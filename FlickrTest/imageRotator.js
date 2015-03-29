window.onload=slideShow;

var counter = 2;

function slideShow()
{
	
	$("#Image-rotator #1").show("fade",500);
	$("#Image-rotator #1").delay(5500).hide("fade",{direction:"left"},500);
	
	/*$("#image-rotator #"+counter).live("swipeleft swiperight", function(event)
	{
		if(event.type == "swiperight")
		{
		
			$("#Image-rotator #"+counter).show("fade",{direction:"left"},500);
			$("#Image-rotator #"+counter).delay(5500).hide("fade",{direction:"right"},500);
		
			if (counter == 1)
			{
				counter = 7;
			}
			
			else
			{
				counter--;
			}
		}
		
		if(event.type == "swipeleft")
		{
		
			if(counter == 7)
			{
				counter = 1;
			}
			else
			{
				counter++;
			}
		}
	})*/
	
	setInterval(function()
	{
		$("#Image-rotator #"+counter).show("fade",{direction:"left"},500);
		$("#Image-rotator #"+counter).delay(5500).hide("fade",{direction:"right"},500);
		
		if(counter == 7)
		{
			counter = 1;
		}
		else
		{
			counter++;
		}
		
	},6500);
}