// Generated by CoffeeScript 1.7.1
var log, map;

log = function(obj) {
  return {
    "try": console.log(obj)
  };
};

map = {
  map: null,
  userLocation: null,
  geosjon: null,
  createMap: function(divId) {
    if (divId == null) {
      divId = 'map';
    }
    return this.map = new google.maps.Map(document.getElementById(divId), {
      disableDefaultUI: true,
      zoom: 19,
      maxZoom: 32,
      center: {
        lat: 0,
        lng: 0
      },
      scaleControl: false
    });
  },
  loadFloorByLevel: function(level) {
    var latlng;
    if (!this.map) {
      this.createMap();
    }
    this.removeUserLocation();
    this.geojson = app.getGeoJSONByLevel(level);
    this.map.data.forEach((function(_this) {
      return function(feature) {
        return _this.map.data.remove(feature);
      };
    })(this));
    latlng = new google.maps.LatLng(this.geojson.haika.xyLatitude, this.geojson.haika.xyLongitude);
    this.map.setCenter(latlng);
    this.map.data.addGeoJson(this.geojson);
    return this.drawGeoJSON();
  },
  drawGeoJSON: function(shelfId) {
    if (shelfId == null) {
      shelfId = 0;
    }
    return this.map.data.setStyle((function(_this) {
      return function(feature) {
        return _this.applyStyle(feature, shelfId);
      };
    })(this));
  },
  changeShelfColor: function(shelfId) {
    return this.drawGeoJSON(shelfId);
  },
  applyStyle: function(feature, shelfId) {
    var id, type;
    if (shelfId == null) {
      shelfId = 0;
    }
    id = feature.getProperty("id");
    type = feature.getProperty("type");
    if (type === 'floor') {
      return {
        fillColor: "#ffffff",
        fillOpacity: 0.5,
        strokeWeight: 0,
        zIndex: -1
      };
    }
    if (type === 'wall') {
      return {
        fillColor: "#555555",
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#555555",
        strokeOpacity: 1
      };
    }
    if (type === 'shelf') {
      if (id === shelfId) {
        return {
          fillColor: "#ff0000",
          fillOpacity: 1,
          strokeWeight: 3
        };
      } else {
        return {
          fillColor: "#aaaaff",
          fillOpacity: 1,
          strokeWeight: 2
        };
      }
    }
    if (type === 'beacon') {
      return {
        fillColor: "#000000",
        fillOpacity: 1,
        strokeWeight: 2,
        zIndex: 1000
      };
    }
  },
  loadFloorAndchangeShelfColor: function(level, shelfId) {
    this.loadFloorByLevel(level);
    return this.changeShelfColor(shelfId);
  },
  createUserLocation: function(beaconId) {
    var coordinate, count, feature, lat, lon, markerImage, position, _i, _j, _len, _len1, _ref, _ref1;
    lat = 0;
    lon = 0;
    count = 0;
    _ref = this.geojson.features;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      feature = _ref[_i];
      if (feature.properties.type === 'beacon') {
        if (feature.properties.id === beaconId) {
          count = feature.geometry.coordinates[0].length;
          _ref1 = feature.geometry.coordinates[0];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            coordinate = _ref1[_j];
            lat += coordinate[1];
            lon += coordinate[0];
          }
        }
      }
    }
    if (lat === 0 && lon === 0) {
      return;
    }
    markerImage = new google.maps.MarkerImage('img/marker.png', new google.maps.Size(34, 34), new google.maps.Point(0, 0), new google.maps.Point(17, 17));
    position = new google.maps.LatLng(lat / count, lon / count);
    if (this.userLocation) {
      this.animateMarker([lat / count, lon / count]);
    } else {
      this.userLocation = new google.maps.Marker({
        position: position,
        map: this.map,
        icon: markerImage
      });
    }
    return this.userLocation.setMap(this.map);
  },
  removeUserLocation: function() {
    if (this.userLocation) {
      this.userLocation.setMap(null);
    }
    return this.userLocation = null;
  },
  drawingNumber: 100,
  animationFrameTime: 10,
  animationCounter: 0,
  startLatLng: void 0,
  animateLatLng: void 0,
  animationLat: void 0,
  animationLng: void 0,
  animateMarker: function(goLatLng) {
    this.startLatLng = [this.userLocation.getPosition().lat(), this.userLocation.getPosition().lng()];
    return this.transitionMarker(goLatLng);
  },
  transitionMarker: function(goLatLng) {
    this.animationCounter = 0;
    this.animateLatLng = this.startLatLng;
    this.animationLat = (goLatLng[0] - this.startLatLng[0]) / this.drawingNumber;
    this.animationLng = (goLatLng[1] - this.startLatLng[1]) / this.drawingNumber;
    return this.moveMarker();
  },
  moveMarker: function() {
    this.animateLatLng[0] += this.animationLat;
    this.animateLatLng[1] += this.animationLng;
    this.userLocation.setPosition(new google.maps.LatLng(this.animateLatLng[0], this.animateLatLng[1]));
    if (this.animationCounter !== this.drawingNumber) {
      this.animationCounter++;
      setTimeout((function(_this) {
        return function() {
          return _this.moveMarker();
        };
      })(this));
      return this.animationFrameTime;
    }
  },
  createLevelMenu: function(levelArray) {
    var level, _i, _len;
    $('#map-level').empty();
    for (_i = 0, _len = levelArray.length; _i < _len; _i++) {
      level = levelArray[_i];
      $('#map-level').append("<li level=\"" + level + "\">" + level + "</li>");
    }
    return $('#map-level li').mousedown(function() {
      return map.loadFloorByLevel($(this).attr('level'));
    });
  }
};

/*
//@ sourceMappingURL=appMap.map
*/
