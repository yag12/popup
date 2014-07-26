/**
*	@File partials.js
*	@Desc 팝업창 관리
*	@Auth yag12
*	@Data 2012. 9 .24
*/
var partials = {
	notUpdate: [],
	currentZindex: 10000,
	windows: {},

	// 생성
	create: function(elementId, data)
	{
		try
		{
			var id = elementId.replace(/\./g, "_");

			this.windows[id] = new windows();
			if(this.windows[id].startup(elementId, data) === false)
			{
				this.remove(id);
				return false;
			}

			return this.windows[id];
		}
		catch(e)
		{
			return false;
		}
	},

	// 업데이트
	update: function(id, callback)
	{
		try
		{
			for(var win in this.windows)
			{
				if(typeof id == "undefined" || win.indexOf(id) != -1)
				{
					var update = true;
					for(var i in this.notUpdate)
					{
						if(this.windows[win].params.method.indexOf(this.notUpdate[i]) > -1)
						{
							update = false;
						}
					}

					if(update == true)
					{
						this.windows[win].dispatcher(callback);
					}
				}
			}
	
			return true;
		}
		catch(e)
		{
			return false;
		}
	},

	// params 데이터 갱신 후 업데이트
	replace: function(id, params)
	{
		if(typeof this.windows[id] != "undefined")
		{
			this.windows[id].params = params;
			this.update(id);
		}
	},

	// 삭제
	remove: function(id)
	{
		try
		{
			for(var win in this.windows)
			{
				if(typeof id == "undefined" || win.indexOf(id) != -1)
				{
					if(moveElementFocus == this.windows[win].element)
					{
						delete moveElementFocus;
					}

					this.zindex(win);
					this.current_zindex = this.current_zindex - 1;

					delete this.windows[win];

					var elementId = win;
					if(win.indexOf("#") == -1)
					{
						elementId = "#" + win;
					}

					$(elementId).remove();
				}
			}
	
			return true;
		}
		catch(e)
		{
			return false;
		}
	},

	// 팝업 z-index 변경
	zindex: function(id)
	{
		try
		{
			if(typeof id == "undefined")
			{
				return this.currentZindex = this.currentZindex + 1;
			}
			else
			{
				var zindex = Number(this.windows[id].element.css("z-index"));
				for(var win in this.windows)
				{
					if(id.indexOf(win) != -1)
					{
						this.windows[win].element.css({"z-index": this.currentZindex});
					}
					else if(Number(this.windows[win].element.css("z-index")) > zindex)
					{
						this.windows[win].element.css({"z-index": "-=1"});
					}
				}
			}
		}
		catch(e){ }

		return false;
	},

	// 팝업 타이틀바 변경
	setTitle: function(title, id)
	{
		if(typeof id == "undefined" && typeof moveElementFocus != "undefined")
		{
			var id = moveElementFocus.attr("id");
		}

		if(typeof this.windows[id] != "undefined")
		{
			this.windows[id].setTitle(title);
		}
	}
};
