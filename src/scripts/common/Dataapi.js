//这里用于声明一些data-api
//同时有部分data-api在各自的模块中定义，这里定义一些全局的

//data-nopath
$(document).on('click','[data-nopath]:not(.btn-forbidden)',function(){
	var $this = $(this),
		nopath = $this.data("nopath"),			
		target = $this.data("target") || $.CONFIG.tmplTarget,
		uriprasearr = $.Depath.parse(nopath),
		url = $this.data("url") || $.Depath.getURL(nopath,uriprasearr),
		tmplid = $this.data("tmpl") || uriprasearr["tmpl"],
		fdata = $.CONFIG.getFdata($this.data("fdata")),
		pagedata = $.Depath.parse(window.location.hash.slice(1)).data,
		data = $.extend(fdata,uriprasearr["data"],pagedata)
		;
//console.log(uriprasearr);
    $.Ajax.abort("nopath");
	$.Ajax.getData({
    		url: url,
    		data : data
    	},
    	"nopath",
    	function (ajaxdata) {
    		var	tmpl = $.CONFIG.getTMPL(tmplid);
            // console.log(tmplid);
    		if(tmpl){
        		if(typeof tmpl == "function"){
        			$(target).html(tmpl($.extend(ajaxdata,data)));
        		}
        		else
        			$(target).html(tmpl);
            }
            $(target).data("page",{
                url: nopath,
                tmplid: tmplid,
                data: data,
                target: target
            });
    		$(document).trigger("Init",ajaxdata);
    	});

});

//data-refresh  页面刷新
$(document).on('click','[data-refresh]',function  () {
	$(document).trigger("Depath");
});

//data-update 局部刷新
$(document).on('click','[data-update]',function  () {
    var $this = $(this),
        source = $this.data("update")
        page = $(source).data("page"),
        delay = $this.data("submit")
        ;
    if(delay){
        $.form_data = {
            successFn: update,
            target : this
        }
    }
    else{
        update();
    }
    function update(){
        $.Ajax.abort("nopath");
        $.Ajax.getData({
                url: $.Depath.getURL(page.url),
                data : page.data
            },
            "nopath",
            function (ajaxdata)
             {
                var tmpl = $.CONFIG.getTMPL(page.tmplid);
                data=page.data;
                if(tmpl)
                {
                    if(typeof tmpl == "function")
                    {
                        if(!data)
                        {
                             $(page.target).html(tmpl($.extend(ajaxdata)));
                        }
                        else
                        {
                            $(page.target).html(tmpl($.extend(ajaxdata,data)));
                        }  
                    }
                    else
                    {
                        $(page.target).html(tmpl);
                    }
                }
                $(document).trigger("Init",ajaxdata);
            }); 
    }
});