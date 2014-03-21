
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
					console.log(worlds);
					$.each(worlds, function(i) {
						serverComparator.model.WorldDataListViewModel.worldData.push(new serverComparator.model.WorldDataViewModel(worlds[i].get("world_id"), worlds[i].get("world_name"), worlds[i].get("success_percentage")));
					});

					ko.observable(serverComparator.model.WorldDataViewModel);
					ko.applyBindings(serverComparator.model.WorldDataListViewModel);
				},
				error:function(error) {
		        	alert("Error on world data retrieval");
		        }
			});
		}
	},
	model : {
		WorldDataListViewModel : {
			worldData : ko.observableArray()
		},

		WorldDataViewModel : function(worldID, worldName, successPercentage) {
			var self = this;
			self.worldID = ko.observable(worldID);
			self.worldName = ko.observable(worldName);
			self.successPercentage = ko.observable(successPercentage);
		}
	}
}

serverComparator.data.getWorldData("us");

})(this, document);