/**
*	@File dispatcher.js
*	@Desc 데이터 통신을 위한 코드
*	@Auth yag12
*	@Data 2012. 9. 5
*/
var dispatcher = {
	htmls: {},
	
	// 스타트업
	startup: function(elementId, params, callback)
	{
		var tmpl = params.view;
		var data = params.data;
		if(elementId.indexOf('#') == -1) elementId = '#' + elementId;

		if(typeof dispatcher.htmls[tmpl] != "undefined")
		{
			try{ $.tmpl(dispatcher.htmls[tmpl], data).appendTo(elementId); }catch(e){ console.log(e); }
			callback();
		}else{
			$.ajax({
				url: "tmpl/" + tmpl,
				dataType: "html",
				async: false,
				success: function(html){
					dispatcher.htmls[tmpl] = html;

					try{ $.tmpl(dispatcher.htmls[tmpl], data).appendTo(elementId); }catch(e){ console.log(e); }
					callback();
				}
			});
		}

		return true;
	}
};
