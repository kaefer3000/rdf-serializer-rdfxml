var rdf = require('rdf-ext')
var inherits = require('inherits')
var AbstractSerializer = require('rdf-serializer-abstract')
var XMLWriter = require('xml-writer')

function RdfXmlSerializer (options) {
  this.options = options || {}

  AbstractSerializer.call(this, rdf)
}

inherits(RdfXmlSerializer, AbstractSerializer)

RdfXmlSerializer.prototype.serialize = function (graph, done) {
  return new Promise(function (resolve) {
    done = done || function () {}

    var xw = new XMLWriter()

    xw.startDocument(1.0, 'UTF-8')

    xw.startElementNS('rdf', 'RDF')
    xw.startAttributeNS('xmlns', 'rdf')
    xw.text('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
    xw.endAttribute()

    var separateNSandLocalName = function (iri) {
      var ret = {}
      var idx = iri.lastIndexOf('#')
      if (idx <= 0) {
        idx = iri.lastIndexOf('/')
      }
      if (idx <= 0) { /* should fail? */ }
      ret['namespace'] = iri.substring(0, idx + 1)
      ret['localname'] = iri.substring(idx + 1, iri.length)
      ret['prefix'] = 'ns' + Math.floor(Math.random() * 99999)
      return ret
    }

    graph.forEach(function (triple) {
      // triple
      xw.startElementNS('rdf', 'Description')

      // subject
      if (triple.subject.interfaceName === 'BlankNode') {
        xw.startAttributeNS('rdf', 'nodeID')
      } else if (triple.subject.interfaceName === 'NamedNode') {
        xw.startAttributeNS('rdf', 'about')
      } else { /* fail */ }
      xw.text(triple.subject.nominalValue)
      xw.endAttribute()

      // predicate
      var parts = separateNSandLocalName(triple.predicate.nominalValue)
      xw.startElementNS(parts['prefix'], parts['localname'])
      xw.startAttributeNS('xmlns', parts['prefix'])
      xw.text(parts['namespace'])
      xw.endAttribute()

      // object
      if (triple.object.interfaceName === 'BlankNode') {
        xw.startAttributeNS('rdf', 'nodeID')
      } else if (triple.object.interfaceName === 'NamedNode') {
        xw.startAttributeNS('rdf', 'resource')
      } else {
        if (triple.object.language) {
          xw.startAttributeNS('xml', 'lang')
          xw.text(triple.object.language)
          xw.endAttribute()
        } else if (triple.object.datatype &&
            triple.object.datatype.nominalValue !==
              'http://www.w3.org/2001/XMLSchema#string') {
          xw.startAttributeNS('rdf', 'datatype')
          xw.text(triple.object.datatype.nominalValue)
          xw.endAttribute()
        }
      }
      xw.text(triple.object.nominalValue.toString())
      xw.endElement()

      // end triple
      xw.endElement()
    })

    // end graph
    xw.endDocument()

    var xmlString = xw.toString()

    done(null, xmlString)
    resolve(xmlString)
  })
}

// add singleton methods to class
var instance = new RdfXmlSerializer()

for (var property in instance) {
  RdfXmlSerializer[property] = instance[property]
}

module.exports = RdfXmlSerializer
