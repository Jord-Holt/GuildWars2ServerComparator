
(function(window, document, undefined){

Parse.initialize("9Uuj7Ak6wRIv9MGRrIMzGVGoMXsGMlM8JUSX7nu1", "W4f9wcCntjuU9R34QhJ42K2grXnDL46bu1LhTyr4");

var serverComparator = {
	data : {
		// Change this function to obtain data through parse and update the array via long polling.
		getWorldData : function(location) {
			var WorldData = Parse.Object.extend("WorldData");
			var query = new Parse.Query(WorldData);

			query.find({
				success : function(worlds) {
					var worldList = [];

					$.each(worlds, function(i) {
						worldList.push(new serverComparator.model.World(worlds[i].get("world_id"), worlds[i].get("world_name"), worlds[i].get("success_percentage")));
					});

					ko.applyBindings(new serverComparator.model.WorldDataListViewModel(worldList));
				},
				error:function(error) {
		        	alert("Error on world data retrieval");
		        }
			});
		}
	},
	model : {
		WorldDataListViewModel : function(worlds) {
			this.worldData = ko.observableArray(worlds);

			this.gridViewModel = new ko.simpleGrid.viewModel({
				data: this.worldData,
				columns: [
					{headerText: "World Name", rowText: "worldName"},
					{headerText: "Success Percentage", rowText: "successPercentage"}
				],
				pageSize: 10
			});
		},

		World : function(worldID, worldName, successPercentage) {
			var self = this;
			self.worldID = worldID;
			self.worldName = worldName;
			self.successPercentage = successPercentage;
		}
	}
};

serverComparator.data.getWorldData("us");

})(this, document);