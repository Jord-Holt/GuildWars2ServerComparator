// Initialize parse
Parse.initialize("9Uuj7Ak6wRIv9MGRrIMzGVGoMXsGMlM8JUSX7nu1", "W4f9wcCntjuU9R34QhJ42K2grXnDL46bu1LhTyr4");

//Parse.Cloud.job("updateGuildWarsData", function(request, status) {
	
	var serverComparator = {
		executions: 0,
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

					serverComparator.data.calculateWorldData(serverComparator.model.WorldDataListViewModel.worldData);
				});
			},

			calculateWorldData : function(worldDataList) {
				var success = 0;
				var failed = 0;
				var worldsAveraged = 0;
				var maxWorlds = worldDataList.length;
				

				if(serverComparator.executions === 25) {
					// Delete all previous values in parse.

					// Set worldDataList values in parse.
					$.each(worldDataList, function(i) {
						var WorldData = Parse.Object.extend("WorldData");
						var worldData = new WorldData();

						worldData.set("world_id", worldDataList[i].worldID);
						worldData.set("world_name", worldDataList[i].worldName);
						worldData.set("success_percentage", worldDataList[i].successPercentage);

						worldData.save(null, {
							success: function(worldData) {
								console.log(worldData + " saved to parse.");
							},
							error: function(worldData, error) {
								console.log("ERROR: " + error);
							}
						});
					});

					
				}

				serverComparator.executions++;

				$.each(worldDataList, function(i) {

					serverComparator.data.getWorldEventStatus(worldDataList[i].worldID).done(function(eventStatuses){

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

						worldDataList[i].successPercentage = ((serverComparator.utils.getSum(worldDataList[i].percentages)) / worldDataList[i].percentages.length).toFixed(2);
						
						success = 0;
						worldsAveraged++;

						if(worldsAveraged === maxWorlds) {
							console.log("Executions: " + serverComparator.executions);
							serverComparator.data.calculateWorldData(worldDataList);
						}
					});
					
				});
			}
		},
		model : {
			WorldDataListViewModel : {
				worldData : []
			},

			WorldDataViewModel : function(worldID, worldName, successfulEvents, successPercentage, failedEvents) {
				var self = this;
				self.worldID = worldID;
				self.worldName = worldName;
				self.successPercentage = successPercentage;
				self.percentages = [];
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

//});