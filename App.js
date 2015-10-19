

google.maps.event.addDomListener(window, 'load', initialize);
google.maps.event.addDomListener(window, 'load', initialize2);
google.maps.event.addDomListener(window, 'load', initialize3);
var service;
var map;
var map2;
var autocomplete;
var InfoWindow;
var InfoWindow2;
var marker;
var MARKER_PATH = 'https://maps.gstatic.com/intl/en_us/mapfiles/marker_green';
var hostnameRegexp = new RegExp('^https?://.+?/');
var selected = [];
var locations = []; //true/false
var locations2 = []; //locations of each place
var locations3 = []; //the true locations of each place
var directionsDisplay;
var count = 0;
var directionsService;

function initialize2() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });
}

function initialize3(){
 directionsService = new google.maps.DirectionsService();
 directionsDisplay = new google.maps.DirectionsRenderer();
 directionsDisplay.setPanel(document.getElementById('directions-panel'));
 map2 = new google.maps.Map(document.getElementById('map-canvas'), {
  center: {lat: -34.397, lng: 150.644},
  zoom: 8
});
 directionsDisplay.setMap(map2);
}


function initialize(){
  var input = document.getElementById('complete');
  var options = {
   types: ['(cities)'],
   componentRestrictions: {country: "us"}
 };
 autocomplete = new google.maps.places.Autocomplete(input, options);
}

function loadMap(){
  var city = autocomplete.getPlace();
  if(!city){
    alert("Please enter a city!");
  }
  map.setCenter(city.geometry.location);
  map.setZoom(11); 
  var lats = city.geometry.location.lat();
  var lngs = city.geometry.location.lng();
  var pyrmont = {lat: lats, lng: lngs};

  InfoWindow = new google.maps.InfoWindow();


  service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: pyrmont,
    radius: 25000,
    types: ['park', 'aquarium', 'natural_feature', 'museum']
  }, callback);
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    clearResults();
    for (var i = 0; i < results.length; i++) {

      selected.push(false);
      createMarker(results[i], i);
    }
  }
}

function createMarker(place, i) {
  var placeLoc = place.geometry.location;
  locations2[i] = place; 
  marker = new google.maps.Marker({
    map: map,
    position: placeLoc
  });
  google.maps.event.addListener(marker, 'click', function() {
    if(place.rating){
     InfoWindow.setContent( place.name + '<img src = ' + place.icon + '>'  + '<p> </p>' + '<p> Rating: ' + place.rating + "</p> " + place.vicinity);
   }
   InfoWindow.open(map, this);
 });
  addResult(place, i, marker);
  locations[i] = false;
}

function addResult(result, i, marker) {

  var results = document.getElementById('results');
  var markerLetter = String.fromCharCode('A'.charCodeAt(0) + i);
  var markerIcon = MARKER_PATH + markerLetter + '.png';

  var tr = document.createElement('tr');
  tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
  tr.onclick = function() {
    google.maps.event.trigger(marker, 'click');
// if (tr.style.backgroundColor === '#F0F0F0' || '#FFFFFF'){
//      alert("FDSLSJFK");
if(!selected[i]) {
  selected[i] = true;
  locations[i] = true;
  tr.style.backgroundColor = '#33CC33';
} else {
  selected[i] = false;
  locations[i] = false;
  (i % 2 === 0 ? tr.style.backgroundColor = '#F0F0F0' : tr.style.backgroundColor = '#FFFFFF');
};
// tr.style.backgroundColor = '#FF00FF';

// }

};

  var iconTd = document.createElement('td');
  var nameTd = document.createElement('td');
  var icon = document.createElement('img');
  icon.src = markerIcon;
  icon.setAttribute('class', 'placeIcon');
  icon.setAttribute('className', 'placeIcon');

  var name = document.createTextNode(result.name);
  iconTd.appendChild(icon);
  nameTd.appendChild(name);
  tr.appendChild(iconTd);
  tr.appendChild(nameTd);
  results.appendChild(tr);
}

function clearResults() {
  var results = document.getElementById('results');
  while (results.childNodes[0]) {
    results.removeChild(results.childNodes[0]);
  }
}
function clearFesults() {
  var fesults = document.getElementById('fesults');
  while (fesults.childNodes[0]) {
    fesults.removeChild(fesults.childNodes[0]);
  }

}

function calcRoute() {
  //var start = document.getElementById('start').value;
  var start = document.getElementById('start').value;
  if (!start) {
    alert("Please enter a starting location");
  }
  var end = locations3[0].geometry.location;
  var request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
}
function next() {
  if (locations3.length - 1 === count){

    var start = locations3[count].geometry.location;
    if (!start) {
      alert("Please enter a starting location");
    }
    var end = document.getElementById('end').value;
    var request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      }
    });
    count++;
  }
  var start = locations3[count].geometry.location;
  if (!start) {
    alert("Please enter a starting location");
  }
  var end = locations3[count + 1].geometry.location;
  var request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
  count++;
}

function jtheb() {
  var j =0;
  for (var i = 0; i < locations2.length; i++) {
    if(locations[i]){
      locations3[j] = locations2[i];
      j++;
    }


  };
  formTable();
}
function formTable(){
  InfoWindow2 = new google.maps.InfoWindow();
  clearFesults();
  for (var i = 0; i < locations3.length; i++) {
    var markerLetter = String.fromCharCode('A'.charCodeAt(0) + i);
    var markerIcon = MARKER_PATH + markerLetter + '.png';
    var tr = document.createElement('tr');
    tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');

    var placeLoc2 = locations3[i].geometry.location;
    marker2 = new google.maps.Marker({
      map: map2,
      position: placeLoc2
    });
    var names = locations3[i].name;
    google.maps.event.addListener(marker2, 'click', function() {

     InfoWindow2.setContent(names);
     InfoWindow2.open(map2, this);
     if (marker2.getAnimation() !== null) {
      marker2.setAnimation(null);
    } else {
      marker2.setAnimation(google.maps.Animation.BOUNCE);
    }


  });


    var iconTd = document.createElement('td');
    var nameTd = document.createElement('td');
    var icon = document.createElement('img');

    icon.src = markerIcon;
    icon.setAttribute('class', 'placeIcon');
    icon.setAttribute('className', 'placeIcon');

    var name = document.createTextNode(locations3[i].name); 
    iconTd.appendChild(icon);
    nameTd.appendChild(name);
    tr.appendChild(iconTd);
    var result = document.getElementById('fesults');
    tr.appendChild(nameTd);
    result.appendChild(tr);

  }
}
/*function search() {
  var search = {
    bounds: map.getBounds(),
    types: ['lodging']
  };
    
  places.nearbySearch(search, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // Create a marker for each hotel found, and
      // assign a letter of the alphabetic to each marker icon.
      for (var i = 0; i < results.length; i++) {
        var markerLetter = String.fromCharCode('A'.charCodeAt(0) + i);
        var markerIcon = MARKER_PATH + markerLetter + '.png';
        // Use marker animation to drop the icons incrementally on the map.
        markers[i] = new google.maps.Marker({
          position: results[i].geometry.location,
          animation: google.maps.Animation.DROP,
          icon: markerIcon
        });
        // If the user clicks a hotel marker, show the details of that hotel
        // in an info window.
      }
    }
  });
}*/

