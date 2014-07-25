var windows = function()
{
	this.topElementId = null;
	this.parentElement = "body";
	this.element = null;
	this.elementId = null;
	this.contentId = null;
	this.callback = null;
	this.options = {
		"title": "",
		"style": "popupStyle",
		"top": 0, 
		"left": 0
	};
	
	// 스타트업
	this.startup = function(elementId, data)
	{
		if(typeof elementId == "undefined")
		{
			return false;
		}

		this.topElementId = elementId;
		if(elementId.indexOf(".") > 0)
		{
			var ids = elementId.split(".");
			this.topElementId = ids[0];
			this.parentElement = "#" + elementId.substr(0, elementId.indexOf(ids[ids.length-1])-1).replace(/\./g, "_");
			var elementId = elementId.replace(/\./g, "_");

			this.options.top = 0;
			this.options.left = 0;
		}

		this.elementId = elementId;
		this.contentId = this.elementId + "Contents";

		if(typeof data != "undefined")
		{
			if(typeof data.title != "undefined")
			{
				this.options.title = data.title;
			}

			if(typeof data.style != "undefined")
			{
				this.options.style = data.style;
			}

			if(typeof data.top != "undefined")
			{
				this.options.top = this.options.top + data.top;
			}

			if(typeof data.left != "undefined")
			{
				this.options.left = this.options.left + data.left;
			}

			if(typeof data.callback != "undefined")
			{
				this.callback = data.callback;
			}
		}

		this.init();
	};

	// 기본 정보 셋팅
	this.init = function()
	{
		var elementId = this.elementId;
		if(this.elementId.indexOf("#") == -1)
		{
			elementId = "#" + this.elementId;
		}

		if($(elementId).is(":visible"))
		{
			this.element = $(elementId);
		}
		else
		{
			$(elementId).remove();
			this.element = $("<div id='" + this.elementId + "' class='commonPop'>").hide();
			$(this.parentElement).append(this.element);
		}
			
		this.popup();
	};

	// 정보 갱신
	this.popupView = function()
	{
		this.element.css({
			"top": this.options.top,
			"left": this.options.left
		}).show();
		this.setTitle(this.options.title);
		this.callback();
	};
	
	// 팝업인 경우
	this.popup = function()
	{
		if($("#" + this.contentId).is(":visible") && $("[name='" + this.topElementId + "']", this.element).hasClass(this.options.style))
		{
			$("[name='" + this.topElementId + "']", this.element).attr({"class": this.options.style});

			$("[id^='" + this.elementId + "_']").each(function(index)
			{
				partials.remove($(this).attr("id"));
			});
		}
		else
		{
			var closeBtn = null;
			if(this.options.style != "")
			{
				closeBtn = $("<div class='closeBtn' />").append(
					$("<img />").attr("src", "./img/btn_close.gif")
				).click(function()
				{
					var parentId = $(this).parent().parent().attr("id");	
					$("[id]", "#" + parentId).each(function(){
						if(typeof partials.windows[$(this).attr("id")] != "undefined")
						{
							partials.remove($(this).attr("id"));
						}
					});

					partials.remove(parentId);
				});
			}

			this.element.hide();
			this.element.empty();
			this.element.append(
				$("<div name='" + this.topElementId + "' class='" + this.options.style + "' />").append(
					closeBtn		
				).append(
					$("<div class='titleBar' id='popupTitle' />").append(
						$("<p class='titleTxt' />")
					).mousedown(function(){
						if($(this).parent().parent().css("z-index") != 99999)
						{
							partials.zindex($(this).parent().attr("name"));
						}
					})
				).append(
					$("<div class='popBody' />").append(
						$("<div id='" + this.contentId + "' />")
					)
				)
			);
		
			$("#popupTitle", this.element).move(this.elementId);
		}

		this.popupView();
		this.element.css({
			"position": "absolute",
			"zoom": 1,
			"*display": "inline"
		});

		if(this.parentElement == "body")
		{
			this.element.css({"z-index": partials.zindex()});
		}
		else
		{
			this.element.css({"z-index": partials.windows[this.topElementId].element.css("z-index")});
		}
	};

	// 팝업인 경우 타이틀바 정보 갱신
	this.setTitle = function(title)
	{
		$("#popupTitle>p", this.element).text(title);
	};
};
