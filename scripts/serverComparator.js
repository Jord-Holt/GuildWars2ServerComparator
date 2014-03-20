(function(window, document, undefined){

var serverComparator = {
	data : {
		// Change this function to obtain data through parse and update the array via long polling.
		getWorldData : function(location) {
			serverComparator.data.getWorlds(location).done(function(world) {

				$.each(world, function(i) {
					serverComparator.model.WorldDataListViewModel.worldData.push(new serverComparator.model.WorldDataViewModel(world[i].id, world[i].name, 0, 0, 0));
				});

				ko.observable(serverComparator.model.WorldDataViewModel);
				ko.applyBindings(serverComparator.model.WorldDataListViewModel);

				serverComparator.data.calculateWorldData(serverComparator.model.WorldDataListViewModel.worldData());
			});
		}
	},
	model : {
		WorldDataListViewModel : {
			worldData : ko.observableArray()
		},

		WorldDataViewModel : function(worldID, worldName, successfulEvents, successPercentage, failedEvents) {
			var self = this;
			self.worldID = ko.observable(worldID);
			self.worldName = ko.observable(worldName);
			self.successPercentage = ko.observable(successPercentage);
			self.percentages = ko.observableArray();
		}
	}
}

serverComparator.data.getWorldData("us");

})(this, document);