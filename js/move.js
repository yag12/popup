/**
*	@File move.js
*	@Desc 팝업창 이동 $("#elementId").move(["elementId"]);
*	@Auth yag12
*	@Date 2012. 9. 26
*/
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
				moveElementFocus = moveElement;
			}
		});

		$(document).keydown(function(e){
			var key = e.keyCode;

			if(key == 27) // Esc
			{
				delete moveElementFocus;
			}

			if(moveElementFocus == moveElement)
			{
				if(moveElement.css("left") != "auto")
				{
					var m = 10;
					switch(key){
						case 38: // ↑
							moveElement.css("top", "-=" + m);
							break;
						case 40: // ↓
							moveElement.css("top", "+=" + m);
							break;
						case 39: // →
							moveElement.css("left", "+=" + m);
							break;
						case 37: // ←
							moveElement.css("left", "-=" + m);
							break;
					}
				}
			}
		});
	}
})(jQuery);
