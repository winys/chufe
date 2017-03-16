//这里用于声明一些data-api
//同时有部分data-api在各自的模块中定义，这里定义一些全局的

/**
 * data-nopath 见官方文档介绍
 * - 赋值到模板的数据有四种，第一种是传回来的数据；第二种是nopath对应uri带的数据；第三种是fdata；第四种是当前页面uri带的数据
 */
$(document).on('click','[data-nopath]:not(.btn-forbidden)',function(){
	var $this = $(this),
		nopath = $this.data("nopath"),			
		target = $this.data("target") || $.CONFIG.tmplTarget,
		uriprasearr = $.Depath.parse(nopath),
		url = $this.data("url") || $.Depath.getURL(nopath,uriprasearr),
		tmplid = $this.data("tmpl") || uriprasearr["tmpl"],
		fdata = $.CONFIG.getFdata($this.data("fdata")),
		pagedata = $.Depath.parse(window.location.hash.slice(1)).data,
		data = $.extend(pagedata, fdata, uriprasearr["data"])
		;

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

/**
 * data-refresh
 * - 触发全局刷新，相当于页面刷新
 */
$(document).on('click','[data-refresh]',function  () {
	$(document).trigger("Depath");
});

/**
* data-update
* - 局部刷新，target为nopath对应的target，重新进行nopath操作
* 
* TODO: 模板数据只用ajaxdata，日后需要的话可以改进
*/
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