// Convert data into usable format
var Convert = {

	// Description
	description : "Converts an .xml file into a usable .json format.",


	// Convert data into usable format
	convertData : function(fileUrl, callback){

		var xmlData = this.fetchData(fileUrl, function(xmlData){
			console.log(xmlData)
		});
		

		// Convert XML to JSON
		// https://github.com/stsvilik/Xml-to-JSON
		var jsonData = xml.xmlToJSON(xmlData);
		
		console.log("XML Converted to JSON...");

		console.log("\n Data from Conversion:")
		console.dir(jsonData);

		var data = jsonData.kml.Document.Placemark['gx:Track'];
		
		// console.log("\n Time List:")
		// console.log(data.when);

		// console.log("\n Coord List:")
		// console.log(data["gx:coord"]);

		/******************************
		   Convert into Usable Format
		 ******************************/
		var acc = [];

		acc = _.zip(data.when, data["gx:coord"]);

		acc = _.map(acc, function(point, key){
			return {
				"date"     : point[0].Text,
				'location' : point[1].Text.split(" "),
			};
		})

		// Limit to 300 data points
		acc = _.sample(acc, 2000);

		console.log('\n Resulting Formatted Data');
		console.log(acc[0]);

		return acc;
		// setupMap(function(){
		// 	addDataToMap(acc);
		// });
	}
	
	/******************************
	  Fetch Data from XML (KML)
	******************************/

	fetchData : function(url, callback){
		$.ajax({
		    url: url,
		    dataType:"xml"
		}).done(function(xmlData){
			callback(xmlData);
		});
	},

}

