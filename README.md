# rdf-serializer-xml

A RDF/XML-Serializer for [rdf-ext](http://github.com/rdf-ext/)

## Usage with rdf-ext body parser

````javascript
// Load Express.js
var express = require('express');
// Load rdf-ext
var rdf = require('rdf-ext')
// Load the rdf-ext HTTP body parser and serializer attachment for Express.js
var rdfBodyParser = require('rdf-body-parser');

// Load this RDF/XML serializer
var RdfXmlSerializer = require('rdf-serializer-rdfxml');
// Registering this RDF/XML serializer with rdf-ext's common rdf-formats
var formatparams = {};
formatparams.serializers = new rdf.Serializers();
formatparams.serializers['application/rdf+xml'] = RdfXmlSerializer;
var formats = require('rdf-formats-common')(formatparams);
// configuring the rdf-ext HTTP body parser and serializer attachment to use this serializer
var configuredBodyParser = rdfBodyParser({'formats' : formats});

// Your Web App
app = express();
// Make the app use the rdf-ext body parser configured to also serialize to RDF/XML
app.use(configuredBodyParser);

// Proceed as usual with rdf-ext's body parsers.
````
