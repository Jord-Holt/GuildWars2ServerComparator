(function(window, document, undefined){

var serverComparator = {
	data : {
		getWorlds : function(location) {
			return $.ajax({
				url:"https://api.guildwars2.com/v1/world_names.json?lang=" + location,
				dataType:"JSON",
				type:"GET"
			});
		},

		getWorldEventStatus : function(worldID) {
			return $.ajax({
				url:"https://api.guildwars2.com/v1/events.json?world_id=" + worldID,
				dataType:"JSON",
				type:"GET"
			});
		},

		getWorldData : function(location) {
			serverComparator.data.getWorlds(location).done(function(world) {

				$.each(world, function(i) {
					serverComparator.model.WorldDataListViewModel.worldData.push(new serverComparator.model.WorldDataViewModel(world[i].id, world[i].name, 0, 0, 0));
				});

				ko.observable(serverComparator.model.WorldDataViewModel);
				ko.applyBindings(serverComparator.model.WorldDataListViewModel);

				serverComparator.data.calculateWorldData(serverComparator.model.WorldDataListViewModel.worldData());
			});
		},

		calculateWorldData : function(worldDataList) {
			var success = 0;
			var failed = 0;
			var worldsAveraged = 0;
			var maxWorlds = worldDataList.length;


			$.each(worldDataList, function(i) {

				serverComparator.data.getWorldEventStatus(worldDataList[i].worldID()).done(function(eventStatuses){

					$.each(eventStatuses, function(i) {
						
						$.each(eventStatuses[i], function(j) {
							if(eventStatuses[i][j].state === "Success") {
								success++;
							}
						});

						$.each(eventStatuses[i], function(j) {
							if(eventStatuses[i][j].state === "Fail") {
								failed++;
							}
						});

					});

					worldDataList[i].percentages.push(serverComparator.utils.getAverageEventSuccess(success,failed));

					worldDataList[i].successPercentage((serverComparator.utils.getSum(worldDataList[i].percentages()) / worldDataList[i].percentages().length).toFixed(2));
					
					success = 0;
					worldsAveraged++;

					if(worldsAveraged === maxWorlds) {
						serverComparator.data.calculateWorldData(worldDataList);
					}
				});
				
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
	},
	utils : {
		getSum : function(list) {
			var total = 0;

			for(var i = 0; i < list.length; i++) {
				total += list[i];
			}

			return total;
		},
		getAverageEventSuccess : function(successfulEvents, failedEvents) {
			return successfulEvents / (successfulEvents + failedEvents);
		}
	}
}

serverComparator.data.getWorldData("us");

})(this, document);