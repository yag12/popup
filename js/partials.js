var partials = {
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

	// 삭제
	remove: function(id)
	{
		try
		{
			for(var win in this.windows)
			{
				if(typeof id == "undefined" || win.indexOf(id) != -1)
				{
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
	}
};
