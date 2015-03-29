function jsonFlickrFeed(data) 
{
	console.log(data);
	
	var output = ''
	
	for(var i = 0; i < data.items.length; i++)
	{
		var imageTitle = data.items[i].title;
		var imageLink = data.items[i].media.m.substring(0,56);
		
		var blockType = ((i % 3) == 2) ? 'c':
						((i % 3) == 1) ? 'b': 'a';
						
		output += '<div class = "ui-block-' + blockType + '">';
		output += '<a href = "#display" data-transition = "fade"onclick="showPhoto(\'' + imageLink + '\',\'' + imageTitle + '\')">';
		output += '<img src = "' + imageLink + '_q.jpg"' + imageTitle + '" />';
		output += '</a>';
		output += '</div>';
		
	}
	$('#photolist').html(output);
}

function showPhoto(link, title)
{
	var output='<a href="#home" data-transition="fade">';
	output += '<img src="' + link + '_b.jpg" alt="' + title +'" />';
	output += '</a>';
	$('#showPhoto').html(output);
}