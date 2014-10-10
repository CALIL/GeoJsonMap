// Generated by CoffeeScript 1.7.1
var styleFunction, styles, url, vectorSource;

styles = {
  MultiPolygon: [
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: "yellow",
        width: 1
      }),
      fill: new ol.style.Fill({
        color: "rgba(255, 255, 0, 0.1)"
      })
    })
  ],
  Polygon: [
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: "blue",
        width: 1
      }),
      fill: new ol.style.Fill({
        color: "rgba(0, 0, 255, 0.1)"
      })
    })
  ],
  GeometryCollection: [
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: "magenta",
        width: 2
      }),
      fill: new ol.style.Fill({
        color: "magenta"
      }),
      image: new ol.style.Circle({
        radius: 10,
        fill: null,
        stroke: new ol.style.Stroke({
          color: "magenta"
        })
      })
    })
  ],
  Circle: [
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: "red",
        width: 2
      }),
      fill: new ol.style.Fill({
        color: "rgba(255,0,0,0.2)"
      })
    })
  ]
};


/**
@type {olx.source.GeoJSONOptions}
 */

vectorSource = new ol.source.GeoJSON({
  object: {
    type: "FeatureCollection",
    crs: {
      type: "name",
      properties: {
        name: "EPSG:3857"
      }
    },
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [0, 0]
        }
      }, {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [[4e6, -2e6], [8e6, 2e6]]
        }
      }, {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [[4e6, 2e6], [8e6, -2e6]]
        }
      }, {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [[[-5e6, -1e6], [-4e6, 1e6], [-3e6, -1e6]]]
        }
      }, {
        type: "Feature",
        geometry: {
          type: "MultiLineString",
          coordinates: [[[-1e6, -7.5e5], [-1e6, 7.5e5]], [[1e6, -7.5e5], [1e6, 7.5e5]], [[-7.5e5, -1e6], [7.5e5, -1e6]], [[-7.5e5, 1e6], [7.5e5, 1e6]]]
        }
      }, {
        type: "Feature",
        geometry: {
          type: "MultiPolygon",
          coordinates: [[[[-5e6, 6e6], [-5e6, 8e6], [-3e6, 8e6], [-3e6, 6e6]]], [[[-2e6, 6e6], [-2e6, 8e6], [0, 8e6], [0, 6e6]]], [[[1e6, 6e6], [1e6, 8e6], [3e6, 8e6], [3e6, 6e6]]]]
        }
      }, {
        type: "Feature",
        geometry: {
          type: "GeometryCollection",
          geometries: [
            {
              type: "LineString",
              coordinates: [[-5e6, -5e6], [0, -5e6]]
            }, {
              type: "Point",
              coordinates: [4e6, -5e6]
            }, {
              type: "Polygon",
              coordinates: [[[1e6, -6e6], [2e6, -4e6], [3e6, -6e6]]]
            }
          ]
        }
      }
    ]
  }
});

styleFunction = function(feature, resolution) {
  return styles[feature.getGeometry().getType()];
};

url = "http://lab.calil.jp/haika_store/data/000105.geojson";

$.ajax({
  url: url,
  type: "GET",
  cache: false,
  dataType: "json",
  error: (function(_this) {
    return function() {
      return alert('load error');
    };
  })(this),
  success: (function(_this) {
    return function(geojson) {
      var coordinate, coordinates, data, features, geometry, object, vectorLayer, _i, _j, _len, _len1, _ref, _ref1;
      console.log(geojson);
      console.log(geojson.features[0].geometry.coordinates);
      features = [];
      _ref = geojson.features;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        object = _ref[_i];
        coordinates = [];
        _ref1 = object.geometry.coordinates[0];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          geometry = _ref1[_j];
          coordinate = ol.proj.transform(geometry, "EPSG:4326", "EPSG:3857");
          coordinates.push(coordinate);
          data = {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [coordinates]
            },
            "properties": object.properties
          };
          features.push(data);
        }
      }
      console.log(features);
      geojson = {
        object: {
          type: "FeatureCollection",
          'crs': {
            'type': 'name',
            'properties': {
              'name': "EPSG:3857"
            }
          },
          features: features
        }
      };
      console.log(geojson);
      vectorLayer = new ol.layer.Vector({
        source: new ol.source.GeoJSON(geojson),
        style: styleFunction
      });
      return window.map = new ol.Map({
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          }), vectorLayer
        ],
        target: "map",
        controls: ol.control.defaults({
          attributionOptions: {
            collapsible: false
          }
        }),
        view: new ol.View({
          center: ol.proj.transform([136.18660999999997, 35.9620124], "EPSG:4326", "EPSG:3857"),
          zoom: 20
        })
      });
    };
  })(this)
});

/*
//@ sourceMappingURL=openlayer.map
*/
