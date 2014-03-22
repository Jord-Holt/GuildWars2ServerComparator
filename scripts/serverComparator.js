
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
						worldList.push(new serverComparatorWorldTable.model.World(worlds[i].get("world_id"), worlds[i].get("world_name"), worlds[i].get("success_percentage")));
					});

					console.log(worldList);

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

			this.pageLimit = ko.observable(10);

			this.currentPage = ko.observable(1);

			this.pageMax = ko.observable(self.currentPage() * self.pageLimit());

			this.pageMin = ko.observable(self.pageLimit() - self.pageMax());

			this.sortBy = function(columnName) {
				switch(columnName) {
					case 'worldName': 
						if(serverComparatorWorldTable.sort.worldName === "ascending") {
							
							serverComparatorWorldTable.sort.worldName = "decending";

							this.worldData.sort(function(a,b) {
								if(a.worldName === b.worldName) {
									return 0;
								}
								return a.worldName > b.worldName ? -1 : 1;
							});

						} else if(serverComparatorWorldTable.sort.worldName === "decending") {
							
							serverComparatorWorldTable.sort.worldName = "ascending";

							this.worldData.sort(function(a,b) {
								if(a.worldName === b.worldName) {
									return 0;
								}
								return a.worldName < b.worldName ? -1 : 1;
							});

						} else {
							console.log("Error determining world name sort order in sortBy function.");
						}
						break;
					case 'successPercentage': 
						if(serverComparatorWorldTable.sort.successPercentage === "ascending") {
							
							serverComparatorWorldTable.sort.successPercentage = "decending";

							this.worldData.sort(function(a,b) {
								if(a.successPercentage === b.successPercentage) {
									return 0;
								}
								return a.successPercentage > b.successPercentage ? -1 : 1;
							});

						} else if(serverComparatorWorldTable.sort.successPercentage === "decending") {
							
							serverComparatorWorldTable.sort.successPercentage = "ascending";

							this.worldData.sort(function(a,b) {
								if(a.successPercentage === b.successPercentage) {
									return 0;
								}
								return a.successPercentage < b.successPercentage ? -1 : 1;
							});

						} else {
							console.log("Error determining success percentage sort order in sortBy function.");
						}
						break;
				}
			};

			this.setPage = function(page) {
				self.currentPage(page);
				self.pageMax(self.currentPage() * self.pageLimit());
				self.pageMin(self.pageMax() - self.pageLimit());
			};
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
	}
};

serverComparatorWorldTable.data.getWorldData("us");

})(this, document);