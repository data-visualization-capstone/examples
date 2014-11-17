/******************************
          Data.js 
 ******************************/

// Convert Google Location Data's .kml (renamed .xml)
// into a usable JSON format.

function loadData(next){

	loadXML(convertData);

	// Load data from XML (kml) format
	function loadXML(next){

		console.log("\nLoading XML ...");

		$.ajax({
		    url: "/data/alex.xml",
		    dataType:"xml"
		}).done(function(xmlData){
			convertData(xmlData);
		});
	}

	// Convert data into usable format
	function convertData(xmlData){

		console.log("\nXML Converted to JSON");
		
		// Convert XML to JSON. See: https://github.com/stsvilik/Xml-to-JSON
	    var jsonData = xml.xmlToJSON(xmlData);

	    // Extract location data from google location kml structure
	    var data = jsonData.kml.Document.Placemark['gx:Track'];

	    /******************************
	       Convert into Usable Format
	     ******************************/
	    data = _.map(_.zip(data.when, data["gx:coord"]), function(point, key){
	    	return {
	    		"date"     : point[0].Text,
	    		'location' : point[1].Text.split(" "),
	    	};
	    })

	    next(data); // Callback
	}
}