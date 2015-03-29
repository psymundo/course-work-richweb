var stadiumMap;
var userMarker
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

$(document).bind("pageshow", function(){
	directionsDisplay = new google.maps.DirectionsRenderer();
	var stadiumPosition = new google.maps.LatLng(53.483066, -2.200527);
	var image = 'images/home-pin.gif';
	
	var mapOptions = 
	{
		center: stadiumPosition,
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	
	stadiumMap = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	directionsDisplay.setMap(stadiumMap);
	directionsDisplay.setPanel(document.getElementById('directionsPanel'));
	
	var infoText = "<div id = 'infoWin'>Etihad Stadium<hr></br><img src = 'images/home-pin.gif'/></br>Ashton New Rd,</br> Manchester M11,</br> UK.</br></div>";
	var infoWindow = new google.maps.InfoWindow(
	{
		content:infoText,
		icon:"images/home-pin.gif",
	});
	
	var input = document.getElementById('locationSearch');
	var autocomplete = new google.maps.places.Autocomplete(input);
	autocomplete.bindTo('bounds',stadiumMap);
	
	var stadiumMarker = new google.maps.Marker(
	{
		position: stadiumPosition,
		map: stadiumMap,
		icon: image
	});
	
	userMarker = new google.maps.Marker(
	{
		map: stadiumMap,
		icon: image,
		animation: google.maps.Animation.DROP
	});
	
	function placeMarker(location)
	{
		userMarker.setPosition(location);
	}
	
	google.maps.event.addListener(stadiumMarker, "click", function()
	{
		infoWindow.open(stadiumMap, stadiumMarker);
	})
	
	google.maps.event.addListener(autocomplete, 'place_changed', function() 
	{
        input.className = '';
        var place = autocomplete.getPlace();
		
        if (!place.geometry) 
		{
          // Inform the user that the place was not found and return.
          input.className = 'notfound';
          return;
        }
		
        userMarker.setIcon(image);
        //userMarker.setPosition(place.geometry.location);
		
		var address = '';
		
        if (place.address_components) 
		{
			address = 
			[
				(place.address_components[0] && place.address_components[0].short_name || ''),
				(place.address_components[1] && place.address_components[1].short_name || ''),
				(place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }
		
		placeMarker(place.geometry.location);
		calcRoute(place.geometry.location);
		displayRoute(place.geometry.location);
		map.checkResize();
	});
	
	function displayRoute(location)
	{
		var service = new google.maps.DistanceMatrixService();
		service.getDistanceMatrix(
		{
			origins: [location],
			destinations: [stadiumPosition],
			travelMode: google.maps.TravelMode.DRIVING,
			avoidHighways: false,
			avoidTolls: false
		}, callback);
		
		function callback(response, status)
		{
			if(status == google.maps.DistanceMatrixStatus.OK)
			{
				var origin = response.originAddresses;
				var destination = response.destinationAddresses;
				
				for (var i = 0; i < origin.length; i++)
				{
					var results = response.rows[i].elements;
					for(var j = 0; j < results.length; j++)
					{
						var element = results[j];
						var distance = element.distance.text;
						var duration = element.duration.text;
						var from = origin[i];
					}
				}
			}
			$('.route-info').empty();
			$('.route-info').append("<strong>Origin: </strong>" + from + "<br />" +
			"<strong>Destination: </strong> The Etihad Stadium <br />" +
			"<strong>Distance: </strong>" + distance + "<br />" +
			"<strong>Duration: </strong>" + duration);
		}
	}
	
	function calcRoute(location)
	{
		var start = location;
		var end = stadiumPosition;
		var request = 
		{
			origin: start,
			destination: end,
			travelMode: google.maps.TravelMode.DRIVING
		};
		directionsService.route(request, function(result, status)
		{
			if(status == google.maps.DirectionsStatus.OK)
			{
				directionsDisplay.setDirections(result);
			}
			else
			{
				alert("This route is not possible");
			}
		});
	}

});

//List Blog Posts
$(function() 
{
	$.getJSON("http://mcfcie.blogspot.ie/feeds/posts/default?alt=json&max-results=5&callback=?", function(data) 
	{
		$.each(data["feed"]["entry"], function(index, value) 
		{
			$("<div id = 'blogtitle'><h4 id = 'lol'>" + value["title"]["$t"] 
			+ "</h4></div><div id = 'blogcontent'>" 
			+ value["content"]["$t"] + "</div></div>").appendTo("#blogger");
		});
	});
});

//Get Youtube Videos
function listVideos(data) {
	console.log(data);
	
	var output ='';
	for ( var i=0; i<data.feed.entry.length; i++) {

		var title = data.feed.entry[i].title.$t;
		var thumbnail = data.feed.entry[i].media$group.media$thumbnail[0].url;
		var description = data.feed.entry[0].media$group.media$description.$t;
		var id = data.feed.entry[i].id.$t.substring(38);
		
		var blocktype = ((i % 2)===1) ? 'vRight': 'vLeft';
		
		//output += '<div class="ui-block-' + blocktype + '">';
		output += '<div id = "'+blocktype+'">';
			output += '<a href="#videoplayer" data-transition="fade" onclick="playVideo(\'' +  id +'\',\'' + title + '\',\'' + escape(description) + '\')">';
			/*output += '<h3 class = "title">' + title + '</h3>';*/
			output += '<img class = "thumb" src="' + thumbnail + '" alt="' + title + '" />';
			output +="</a>";
		output +="</div>";
	}
	
	$('#videolist').html(output);
}

//Play selected Youtube Video
function playVideo(id, title, description) {
	var output ='<center><iframe id = "videoframe" src="http://www.youtube.com/embed/'+ id +'?wmode=transparent&amp;HD=0&amp;rel=0&amp;showinfo=0&amp;controls=1&amp;autoplay=1" frameborder="0" allowfullscreen></iframe>';
	output += '<h3>' + title + '</h3>';
	output += '<p>' + unescape(description) + '</p></center>';
	$('#myplayer').html(output);
}


//Twitter
function listTweets(data)
{
	console.log(data);
	var output = '<ul data-role="listview" data-theme="a">';
	
	
	$.each(data, function(key, val) 
	{
		var text = data[key].text;
		var thumbnail = data[key].user.profile_image_url;
		var name = data[key].user.name;
		
		output += '<li>';
		output += '<img src="' + thumbnail +'" alt="Photo of ' + name + '">';
		output += '<div>' + text + '</div>';
		output += '</li>';		
	});
	
	output += '</ul>';
	$('#tweetlist').html(output);
}

//Get Flickr Photos
function jsonFlickrFeed(data) 
{
	console.log(data);
	
	var output = ''
	
	for(var i = 0; i < data.items.length; i++)
	{
		var imageTitle = data.items[i].title;
		var imageLink = data.items[i].media.m.substring(0,56);
		
		var blocktype = ((i % 2)===1) ? 'vRight': 'vLeft';
						
		//output += '<div class = "ui-block-' + blockType + '">';
		output += '<div id = "'+blocktype+'">'
			output += '<a href = "#display" data-transition = "fade"onclick="showPhoto(\'' + imageLink + '\',\'' + imageTitle + '\')">';
			output += '<img src = "' + imageLink + '_q.jpg" alt ="' + imageTitle + '" id = "picture" />';
			output += '</a>';
		output += '</div>';
		
	}
	$('#photolist').html(output);
}
//Show selected photo
function showPhoto(link, title)
{
	var output='<a href="#photos" data-transition="fade">';
	output += '<img src="' + link + '_b.jpg" alt="' + title +'" id = "picture" />';
	output += '</a>';
	$('#showPhoto').html(output);
}

function playerBio(name)
{
	var screenWidth = (window.screen.width / 2) - 300;
	var screenHeight = (window.screen.height / 2) - 155;
	var playerName = name;
	var html = "";
	$.getJSON('JSON/players.json', function(data) 
	{
		$.each(data, function(index, player)
		{
			if(player['name'] == playerName)
			{
				
				html += "<style type = 'text/css'>#player-pic{ width: 100%; } #pic{ width: 100%;} profile{ float: left; } html{ background-color: #234; } td{ vertical-align: top; color: white; padding-right: 5px;} .heading{width: 35%;} strong { color: white; }</style>";
				html += "<div id = 'pTitle'><h4>" + player['name'] + "</h4></div>";
				html += "<div id = 'pic'><img id = 'player-pic' src = 'images/players/" +player['image'] +"' /></div>";
				html += "<div id = 'profile'>";
				html += "<table style = 'border-collapse: collapse'>";
				html += "<tr><td class = 'heading'><strong>Name:</strong></td><td>"+player['name']+ "</td></tr>";
				html += "<tr><td class = 'heading'><strong>Date of Birth:</strong></td><td>"+player['dob']+ "</td></tr>";
				html += "<tr><td class = 'heading'><strong>Nationality:</strong></td><td>"+player['nat']+ "</td></tr>";
				html += "<tr><td class = 'heading'><strong>Height:</strong></td><td>"+player['height']+ "</td></tr>";
				html += "<tr><td class = 'heading'><strong>Bio:</strong></td><td>"+player['bio']+ "</td></tr>";
				html += "</table></div>";
			}
		});
		$("#playerbio").html(html);
	});
}

function alertMessage()
{
	alert("Thank you for your message. We will get back to you shortly");
	return false;
}