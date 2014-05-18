Parse.initialize("9Uuj7Ak6wRIv9MGRrIMzGVGoMXsGMlM8JUSX7nu1", "W4f9wcCntjuU9R34QhJ42K2grXnDL46bu1LhTyr4");

var services = {
	data : {
		getWorldData : function(location, successCallback) {
			switch(location) {
				case 'DE':
					var WorldData = Parse.Object.extend("WorldDataDE");
					break;
				case 'EN':
					var WorldData = Parse.Object.extend("WorldDataEN");
					break;
				case 'ES':
					var WorldData = Parse.Object.extend("WorldDataES");
					break;
				case 'FR':
					var WorldData = Parse.Object.extend("WorldDataFR");
					break;
			}
			
			var query = new Parse.Query(WorldData);

			query.find({
				success : successCallback,
				error: function(error) {
		        	alert("Error on world data retrieval: " + error);
		        }
			});
		}
	}
}