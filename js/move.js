(function($){
	$.fn.move = function(elementId)
	{
		var moveElement = $(this);
		if(typeof elementId != "undefined")
		{
			if(elementId.indexOf("#") == -1)
			{
				elementId = "#" + elementId;
			}

			moveElement = $(elementId);
		}
		moveElement.css("position", "absolute");

		moveElement.draggable({
			"containment": "document",
			"handle": "#" + $(this).attr("id"),
			"cursor": "move",
			"opacity": 0.6,
			"start": function()
			{

			}
		});
	}
})(jQuery);
