
(function(window, document, undefined){

Parse.initialize("9Uuj7Ak6wRIv9MGRrIMzGVGoMXsGMlM8JUSX7nu1", "W4f9wcCntjuU9R34QhJ42K2grXnDL46bu1LhTyr4");

var serverComparatorWorldTable = {
	data : {
		// Change this function to obtain data through parse and update the array via long polling.
		getWorldData : function(location) {
			var WorldData = Parse.Object.extend("WorldData");
			var query = new Parse.Query(WorldData);

			query.find({
				success : function(worlds) {
					var worldList = [];

					$.each(worlds, function(i) {
						worldList.push(new serverComparatorWorldTable.model.World(worlds[i].get("world_id"), worlds[i].get("world_name"), worlds[i].get("success_percentage").replace("0.",'') + " %"));
					});

					ko.applyBindings(new serverComparatorWorldTable.model.WorldDataListViewModel(worldList));
				},
				error:function(error) {
		        	alert("Error on world data retrieval");
		        }
			});
		}
	},
	model : {
		WorldDataListViewModel : function(worlds) {
			var self = this;

			this.worldData = ko.observableArray(worlds);
			
			// Pagination parameters
			this.pageLimit = ko.observable(10);

			this.pages = ko.observable(Math.floor(worlds.length / 10) + Math.ceil(worlds.length % 10));

			this.currentPage = ko.observable(1);

			this.pageMax = ko.observable(self.currentPage() * self.pageLimit());

			this.pageMin = ko.observable(self.pageLimit() - self.pageMax());

			this.sortBy = function(columnName) {
				switch(columnName) {
					case 'worldName': 
						serverComparatorWorldTable.utils.sortByWorldName(self.worldData);
						break;
					case 'successPercentage': 
						serverComparatorWorldTable.utils.sortBySuccessPercentage(self.worldData);
						break;
				}
			};

			this.setPage = function(page) {
				self.currentPage(page);
				self.pageMax(self.currentPage() * self.pageLimit());
				self.pageMin(self.pageMax() - self.pageLimit());
			};

			this.nameFilterValue = ko.observable("");

			// Input world name search filter.
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
				} else if (serverComparatorWorldTable.utils.compareWorldNameWithSearchInput(worldName,self.nameFilterValue()) !== -1) {
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
	utils : {
		sanitize : function(string) {
			return string.toUpperCase().replace(/[^a-z0-9\s]/gi, '');
		},
		compareWorldNameWithSearchInput : function(worldName, input) {
			return serverComparatorWorldTable.utils.sanitize(worldName).indexOf(serverComparatorWorldTable.utils.sanitize(input));
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
		}
	}
};

serverComparatorWorldTable.data.getWorldData("us");

})(this, document);