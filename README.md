Converter
===========

PROOF OF CONCEPT.

Convert Google Location Data's .kml file into a usable JSON object. Thanks to stsvilik's Xml-to-JSON converter.

https://github.com/stsvilik/Xml-to-JSON

#### Setup:

Run a local Apache server, load index.html

#### Output:

Creates better looking JSON objects, containing a date (timestamp), and a location (GPS coordinates).

#### Examples

Using with AJAX data

	$.ajax({
		url: "data/file.xml",
		dataType:"xml"
	}).done(function(xmlData){
		var jsonData = xml.xmlToJSON(xmlData);
		console.dir(jsonData);
		console.log(JSON.stringify(jsonData));
	});