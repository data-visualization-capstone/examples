// Convert data into usable format
var Convert = {

	// Description
	description : "Converts an .xml file into a usable .json format.",

	/******************************
	  Fetch Data from XML (KML)
	******************************/

	fetchData : function(url, next){
		$.ajax({
		    url: url,
		    dataType:"xml"
		}).done(function(xmlData){
			next(xmlData);
		});
	},

	/******************************
	  Format Data to JSON
	******************************/
	formatData : function(xml){
		
		// Convert XML to JSON
		// https://github.com/stsvilik/Xml-to-JSON
		var jsonData = xml.xmlToJSON(xml);
		
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

	},


	// Convert data into usable format
	convertData : function(fileUrl, callback){

		var jsonData = this.fetchData(fileUrl, this.formatData);

			// function(xmlData){
			// console.log(xmlData)

			// formatData(xmlData, function(jsonData){
			// 	console.log(jsonData);

			// 	callback(jsonData);

			// })
		

		callback(jsonData)
	},

}

