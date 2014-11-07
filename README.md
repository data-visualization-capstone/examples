Converter
===========

PROOF OF CONCEPT.

Convert Google Location Data's .kml file into a usable JSON object. Thanks to stsvilik's Xml-to-JSON converter.

https://github.com/stsvilik/Xml-to-JSON

Overview
---
A demo utilizing D3.js to create interactive maps on top of [Leaflet.js](http://leafletjs.com/).

Source
---

This repo contains a fork from Chris Zetter's [Voronoi maps](http://chriszetter.com/blog/2014/06/14/visualising-supermarkets-with-a-voronoi-diagram/) project - using D3 and Leaflet. You can find the [original project here](https://github.com/zetter/voronoi-maps).

Original Demo
---

See an [explanation of the code](http://chriszetter.com/blog/2014/06/15/building-a-voronoi-map-with-d3-and-leaflet/) and a [demo](http://chriszetter.com/voronoi-map/examples/uk-supermarkets/).

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

License
---

The code is released under the The MIT License. The names and the details the stores used in the `uk-supermarkets` example remain copyright of their respective owners.

Special Thanks
---

Thanks to Chris Zetter and his [guide using D3 with Leaflet](http://chriszetter.com/blog/2014/06/15/building-a-voronoi-map-with-d3-and-leaflet/). His blog post provided the initial code and instructions for mapping on top of Leaflet.