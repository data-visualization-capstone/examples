function fetchData(next){
	console.log("Loading JSON ...");

	$.ajax({
	    url: "data/josh.xml",
	    dataType:"xml"
	}).done(function(xmlData){
		convertData(xmlData);
	});

	// Convert data into usable format
	function convertData(xmlData){
		/******************************
	       Fetch Data from XML (KML)
	     ******************************/
		// Convert XML to JSON
		// https://github.com/stsvilik/Xml-to-JSON
	    var jsonData = xml.xmlToJSON(xmlData);
	    
	    console.log("XML Converted to JSON...");
	    console.log("\n Data from Conversion:")
	    console.dir(jsonData);
	    var data = jsonData.kml.Document.Placemark['gx:Track'];
	    
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
	    // acc = _.sample(acc, 2000);

	    console.log('\n Resulting Formatted Data');
	    console.log(acc[0]);

	    next(acc)
	}
}