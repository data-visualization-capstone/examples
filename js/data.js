// Convert Google Location Data's .kml (renamed .xml)
// into a usable JSON format.

function loadData(next){

	console.log("\nLoading JSON ...");

	/******************************
	    Fetch Data from XML (KML)
	******************************/

	$.ajax({
	    url: "/data/alex.xml",
	    dataType:"xml"
	}).done(function(xmlData){
		convertData(xmlData);
	});

	// Convert data into usable format
	function convertData(xmlData){
		
		// Convert XML to JSON
		// https://github.com/stsvilik/Xml-to-JSON
	    var jsonData = xml.xmlToJSON(xmlData);
	    
	    console.log("XML Converted to JSON");

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

	    // console.log('\n Resulting Formatted Data');
	    // console.log(acc);

	    next(acc)
	}
}