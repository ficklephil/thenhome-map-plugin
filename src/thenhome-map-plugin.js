function getItemAPI(location,centerLat,centerLng,lat_lo,lng_lo,lat_hi,lng_hi,page){

    console.log('Page Number Sent : ' + page);
    //var url = 'http://127.0.0.1:1337/?callback=?';

    var mapWidth = $('#map-canvas').width();
    var mapHeight = $('#map-canvas').height();

    var minPrice = $('.min-price').val();
    var maxPrice = $('.max-price').val();
    var updatedMin = $('.updated-min').val();

    var date = new Date(updatedMin * 1000);

    $('.update-date').text('Start Date :' + date.getDate() + '/' + (date.getMonth()+1));

    //var url = 'http://127.0.0.1:1337/?screenResolutionX='+mapWidth+'&screenResolutionY='+mapHeight+'&placeName='+location+'&callback=?';
    //var url = 'http://thenhome.nodejitsu.com/?screenResolutionX='+mapWidth+'&screenResolutionY='+mapHeight+'&placeName='+location+'&centerLat='+centerLat+'&centerLng='+centerLng+'&lat_lo='+lat_lo+'&lng_lo='+lng_lo+'&lat_hi='+lat_hi+'&lng_hi='+lng_hi+'&page='+page+'&min_price='+minPrice+'&max_price='+maxPrice+'&updated_min='+updatedMin+'&callback=?';
    var url = 'http://localhost:8080/?screenResolutionX='+mapWidth+'&screenResolutionY='+mapHeight+'&placeName='+location+'&centerLat='+centerLat+'&centerLng='+centerLng+'&lat_lo='+lat_lo+'&lng_lo='+lng_lo+'&lat_hi='+lat_hi+'&lng_hi='+lng_hi+'&page='+page+'&min_price='+minPrice+'&max_price='+maxPrice+'&updated_min='+updatedMin+'&callback=?';

    $.ajax({
        type: 'GET',
        url: url,
        async: false,
        jsonpCallback: 'jsonCallback',
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {
            //console.log(JSON.stringify(json.request));
            parseJson(json);
            parseGrid(json);
        },
        error: function(e) {
            console.log(e.message);
        }
    });
}

function parseGrid(json){
    var gridItem = json.response.gridlayout;
    for(var i=0; i < gridItem.length; i++){
        addGridItemToDisplay(gridItem[i].x,gridItem[i].y);
    }
}

function parseJson(json)
{
    parseMarkers(json);
}

var totalPages;
var currentPage;
var totalResults;

function parseMarkers(json){

    console.log('parse markers');

    var responseLat = json.response.locations[0].center_lat;
    var responseLng = json.response.locations[0].center_long;

    currentPage = json.response.page;
    totalPages = json.response.total_pages;
    totalResults = json.response.total_results;
    // console.log('lat + lng : ' + JSON.stringify(responseLat.center_lat));// + responseLng);

    $('.page-number-display').text('Page :' + currentPage + ' of ' + totalPages);
    $('.results-number-display').text('Total Results :' + totalResults);

    moveMap(responseLat,responseLng);

    var listings = json.response.listings;
    console.log(listings.length);

    for(var i=0; i < listings.length; i++){
//                console.log("Item Title " + listings[i].title);
//                console.log("Item Marker X " + listings[i].longitudeXCoor);
//                console.log("Item Marker Y " + listings[i].latitudeYCoor);
//                console.log("Price " + listings[i].price);

        //Longitude is X, Latitude is Y
        addItemToDisplay(listings[i].property_type,listings[i].longitudeXCoor, listings[i].latitudeYCoor,listings[i].price_formatted, listings[i].bedroom_number, listings[i].img_url, listings[i].lister_url );
    }
}



function moveMap(responseLat,responseLng)
{
    console.log('move map');
    var locationLatLng = new google.maps.LatLng(responseLat, responseLng);
    map.panTo(locationLatLng);
}

function addGridItemToDisplay(gridX,gridY){
    $('.display-layer').append('<div class="grid-item" style="left:'+ gridX +'px; top:'+ gridY +'px;"></div>');
}

function addItemToDisplay(itemType,longitudeXCoor,latitudeYCoor,price_formatted,bedroom_number,imageSrc,imageLink){

    $('.display-layer').append('<div class="item-dot '+itemType+'" style="left:'+ longitudeXCoor +'px; top:'+ latitudeYCoor +'px;">');

    $('.display-layer').append('<a href="'+imageLink+'" target="_blank"><div class="item-box" style="left:'+ longitudeXCoor +'px; top:'+ latitudeYCoor +'px;"><div class="item-image"><img src="'+imageSrc+'" width="100%" height="100%" ></div>' +
        '<div class="item-data-container"><div class="item-data-field-one">'+price_formatted.substring(0,3)+' k</div><div class="item-data-field-two">'+bedroom_number+' Bed</div></div></a>');



    //$('.display-layer').append('<div class="dot-item '+itemType+'" style="left:'+ longitudeXCoor +'px; top:'+ latitudeYCoor +'px;"><div class="price">'+price_formatted+'</div>' +
    //        '<div class="beds">Beds '+bedroom_number+'</div><a href="'+imageLink+'" target="_blank"><div class="item-image"><img src="'+imageSrc+'" ></div></a></div>');
}

function clearMarkersOnMap(){
    $('.item-dot').remove();
    $('.item-box').remove();
    $('.grid-item').remove();
}

function search(page){
    clearMarkersOnMap();
    searchByCenterPoint(page);
}

var map;



function placeMarkerOnMap(){
    console.log('placing marker on map');

    var myLatlng = new google.maps.LatLng(51.45908,-0.36889);
//            var mapOptions = {
//                zoom: 4,
//                center: myLatlng,
//                mapTypeId: google.maps.MapTypeId.ROADMAP
//            }
    //var map = new google.maps.Map(document.getElementById('map-canvas'));

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Hello World!'
    });

}

function placeDotOnMapAtXY(){
    //mark a point
    var lat = 51.448979;
    var lng = -0.334396;
    if(map)
    {
        var overlay = new google.maps.OverlayView();
        overlay.draw = function() {};
        overlay.setMap(map);

        var latLng = new google.maps.LatLng(40.712216,-74.22655)
        //var pointCenter = proj.fromLatLngToDivPixel(latLng);

        //alert('point' + overlay.getProjection());
        var point = overlay.getProjection().fromLatLngToContainerPixel(latLng);
    }
    //alert(pointCenter);
    //}

    //so you want the x and y coordinate pixel of the marker point,
    //as you want to send this to the service.

    //you also want the x and y coordinate pixel of the marker point so
    //that you can draw a div on that point and therefore may it overable

    //var divPixelCentre = google.maps.fromLatLngToDivPixel(center);

    //alert(divPixelCentre);

    //get the x and y of that point
    //put a dot on the map

    //link the dot to the image of the place
}

function searchByLocation(page){
    console.log('Search for :' + $('.location-input').val());

    var location = $('.location-input').val();
    getItemAPI(location);
}

function searchByCenterPoint(page){

    var bounds = map.getBounds();
    var northEastCorner = bounds.getNorthEast();
    var southWestCorner = bounds.getSouthWest();

    console.log(southWestCorner);

    //var lat_lo, lng_lo, lat_hi, lng_hi;
    lat_hi = northEastCorner.lat();
    lng_hi = northEastCorner.lng();
    lat_lo = southWestCorner.lat();
    lng_lo = southWestCorner.lng();

    console.log('Movement');

    //getBounds?
    var centerLatLng = map.getCenter();
    console.log(centerLatLng.lat());
    console.log(centerLatLng.lng());

    var location ='hounslow';

    console.log('lat_hi' + lat_hi + 'lng_hi' + lng_hi + 'lat_lo' + lat_lo + 'lng_lo' + lng_lo);

    getItemAPI(location,centerLatLng.lat(),centerLatLng.lng(),lat_lo,lng_lo,lat_hi,lng_hi,page);
}

function areaSearch(){
    searchByCenterPoint(1);
}

var currentPageNumber = 1;

function next(){
    console.log('get Current Page : ' + currentPage);
    console.log('get Total Pages' +totalPages);

    if(currentPage < totalPages)
    {
        search(++currentPage);
    }
}

function previous(){

    console.log('get Current Page : ' + currentPage);
    console.log('get Total Pages' + totalPages);

    if(currentPage > 1){//can only send 1
        search(--currentPage);
    }
}

function initialise() {

    //so you may want to pass in initial values for these which will override these
    var lat = 51.46310355210425;
    var lng = -0.36240399999992734;

    var mapOptions = {
        center: new google.maps.LatLng(lat, lng),
        zoom: 15,
        sensors:false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);

    google.maps.event.addListener(map, 'dragend', function(){
        search(1);
    });
}
google.maps.event.addDomListener(window, 'load', initialise);

//so over here lets have the interface

//we sent back an object on the event with the data ie. price, page number, input prices
//

