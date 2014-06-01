var serverComparatorWorldTable = {
	worldTableModelReference : null,
	tableBound : false,
	model : {
		WorldDataListViewModel : function(worlds) {
			var self = this;

			this.worldData = ko.observableArray(worlds);

			// Pagination parameters
			this.pageLimit = ko.observable(10);

			this.pages = ko.observable(Math.floor(worlds.length / self.pageLimit()) + Math.ceil(worlds.length % self.pageLimit()));

			this.currentPage = ko.observable(1);

			this.pageMax = ko.observable(self.currentPage() * self.pageLimit());

			this.pageMin = ko.observable(self.pageLimit() - self.pageMax());

			this.sortBy = function(columnName) {
				switch(columnName) {
					case 'worldName': 
						serverComparatorWorldTable.localUtils.sortByWorldName(self.worldData);
						break;
					case 'successPercentage': 
						serverComparatorWorldTable.localUtils.sortBySuccessPercentage(self.worldData);
						break;
				}
			};

			this.setPage = function(page) {
				self.currentPage(page);
				self.pageMax(self.currentPage() * self.pageLimit());
				self.pageMin(self.pageMax() - self.pageLimit());
			};

			this.nameFilterValue = ko.observable("");

			this.filterNames = function() {
				self.nameFilterValue($("#worldNameFilerInput").val());
			};

			this.filter = function(index, pageMax, pageMin, worldName) {
				if(self.nameFilterValue() === "") {
					if(index < pageMax && index >= pageMin) {
						return true;
					} else {
						return false;
					}
				} else if (serverComparatorWorldTable.localUtils.compareWorldNameWithSearchInput(worldName,self.nameFilterValue()) !== -1) {
					return true;
				}

				return false;
			};

			this.worldNameSearchInput = function() {
				if(self.nameFilterValue() === "") {
					return true;
				} else {
					return false;
				}
			}
		},

		World : function(worldID, worldName, successPercentage) {
			var self = this;
			self.worldID = worldID;
			self.worldName = worldName;
			self.successPercentage = successPercentage;
		}
	},
	sort: {
		worldName : "ascending",
		successPercentage : "ascending"
	},
	localUtils : {
		sanitize : function(string) {
			return string.toUpperCase().replace(/[^a-z0-9\s]/gi, '');
		},
		compareWorldNameWithSearchInput : function(worldName, input) {
			return serverComparatorWorldTable.localUtils.sanitize(worldName).indexOf(serverComparatorWorldTable.localUtils.sanitize(input));
		},
		sortByWorldName : function(worldData) {
			if(serverComparatorWorldTable.sort.worldName === "ascending") {
							
				serverComparatorWorldTable.sort.worldName = "decending";

				worldData.sort(function(a,b) {
					if(a.worldName === b.worldName) {
						return 0;
					}
					return a.worldName > b.worldName ? 1 : -1;
				});

			} else if(serverComparatorWorldTable.sort.worldName === "decending") {
				
				serverComparatorWorldTable.sort.worldName = "ascending";

				worldData.sort(function(a,b) {
					if(a.worldName === b.worldName) {
						return 0;
					}
					return a.worldName < b.worldName ? 1 : -1;
				});

			} else {
				console.log("Error determining world name sort order in sortBy function.");
			}
		},
		sortBySuccessPercentage : function(worldData) {
			if(serverComparatorWorldTable.sort.successPercentage === "ascending") {
							
				serverComparatorWorldTable.sort.successPercentage = "decending";

				worldData.sort(function(a,b) {
					if(a.successPercentage === b.successPercentage) {
						return 0;
					}
					return a.successPercentage > b.successPercentage ? -1 : 1;
				});

			} else if(serverComparatorWorldTable.sort.successPercentage === "decending") {
				
				serverComparatorWorldTable.sort.successPercentage = "ascending";

				worldData.sort(function(a,b) {
					if(a.successPercentage === b.successPercentage) {
						return 0;
					}
					return a.successPercentage < b.successPercentage ? -1 : 1;
				});

			} else {
				console.log("Error determining success percentage sort order in sortBy function.");
			}
		},
		setLanguage : function(location) {
			$("#languageSelector").val(location);
			services.data.getWorldData(location, function(worlds) {
				var worldList = [];

				$.each(worlds, function(i) {
					worldList.push(new serverComparatorWorldTable.model.World(worlds[i].get("world_id"), worlds[i].get("world_name"), worlds[i].get("success_percentage").replace("0.",'') + " %"));
				});

				if(serverComparatorWorldTable.tableBound === false) {
					serverComparatorWorldTable.worldTableModelReference = new serverComparatorWorldTable.model.WorldDataListViewModel(worldList);
					ko.applyBindings(serverComparatorWorldTable.worldTableModelReference);
					serverComparatorWorldTable.tableBound = true;
				} else {
					serverComparatorWorldTable.worldTableModelReference.worldData(worldList);
				}
			});
		}
	}
};

$(document).ready(function() {

serverComparatorWorldTable.localUtils.setLanguage("EN");

$("#languageSelector").change(function() {
	serverComparatorWorldTable.localUtils.setLanguage($("#languageSelector select").val());
});

});