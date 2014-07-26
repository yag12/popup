/**
*	@File windows.js
*	@Desc 팝업창 정보
*	@Auth yag12
*	@Data 2012. 9. 24
*/
var windows = function()
{
	this.topElementId = null;
	this.parentElement = "body";
	this.element = null;
	this.elementId = null;
	this.contentId = null;
	this.params = null;
	this.callback = null;
	this.popupPosition = false;
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
		else
		{
			if(typeof data.mainMenu == "undefined" || data.mainMenu == false)
			{
				if(elementId == "common" && main.saveMenu != null)
				{
					var tmpMenuIdx = main.saveMenu[0];
					main.saveMenu = null;
					main.topMenuLeaveEvt($("li[id='menu_"+tmpMenuIdx+"']", ".mainm"));
				}
			}
		}
		this.elementId = elementId;
		this.contentId = this.elementId + "Contents";

		if(typeof data != "undefined")
		{
			if(typeof data.params != "undefined")
			{
				this.params = data.params;
			}

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

		// 창크기 변경시 팝업창 위치 조정
		if(this.topElementId == this.elementId)
		{
			var _this = this;
			$(window).resize(function()
			{
				_this.options = {
					"top": 158, 
					"left": ($(document).width() - 999)/2
				};	

				if(typeof data.top != "undefined")
				{
					_this.options.top = _this.options.top + data.top;
				}

				if(typeof data.left != "undefined")
				{
					_this.options.left = _this.options.left + data.left;
				}

				_this.element.css({
					"top": _this.options.top,
					"left": _this.options.left
				})
			});
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
			
		moveElementFocus = this.element;

		this.popup();
	};

	// 정보 갱신
	this.dispatcher = function(callback)
	{
		if(this.params != null)
		{
			var _this = this;
			this.params.data['_elementId'] = this.elementId;
			dispatcher.startup(this.contentId, this.params, function()
			{
				if(typeof _this.element != "undefined")
				{
					if(_this.element.hasClass("commonPop") && _this.popupPosition == true)
					{
						_this.popupPosition = false;
						_this.element.css({
							"top": _this.options.top,
							"left": _this.options.left
						}).show();

						_this.setTitle(_this.options.title);
					}
				}

				if(typeof callback === "function")
				{
					callback();
				}
				else if(typeof _this.callback === "function")
				{
					_this.callback();
				}
			});
		}
		else
		{
			if(typeof this.element != "undefined")
			{
				if(this.element.hasClass("commonPop") && this.popupPosition == true)
				{
					this.popupPosition = false;
					this.element.css({
						"top": this.options.top,
						"left": this.options.left
					}).show();

					this.setTitle(this.options.title);
				}
			}

			if(typeof this.callback === "function")
			{
				this.callback();
			}
		}
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
					$("<img />").attr("src", "img/btn_close.gif")
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

		this.popupPosition = true;
		this.dispatcher();
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
