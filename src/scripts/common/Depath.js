/*
 ** Author: Winys
 ** Time: 2015.3.24
 */
var Depath = function () {
};

/**
* Depath.parse 解析 uri 函数
* - 返回值为 (例如/Components/Dialog/?id=888)
    {
        "uriarr":["Components","Dialog"],
        "tmpl":"tmpl_Components_Dialog",
        "data":{"id":"888"}
    }
*/
Depath.parse = function  (uri) {
    if (uri == "/" || !uri)
        return {
            uriarr : [$.CONFIG.indexpage],
            tmpl:"tmpl_" + $.CONFIG.indexpage,
            data:null
        };

    //判断是否有参数
    
    var args = uri.split("?"),
        uriarr = args[0],
        data = new Object(),
        result = new Object()
        ;
    //去掉前后多余的 "/"
    uriarr = uriarr.replace(/(^\/*)|(\/*$)/g, "").split("/");
    result["uriarr"] = uriarr;
    var tempMap = $.CONFIG.UrlMap;
    var tempUrl = null;

    for (var key in uriarr)
        tempMap = tempMap[uriarr[key]];
    if (typeof tempMap == "object"){
        uriarr.push($.CONFIG.indexpage);
    }

    result["tmpl"] =  "tmpl_" + uriarr.join("_");

    //解析参数
    if(args.length>1){
        var paramArr = args[1].split("&");
        for (var key in paramArr){
            var key_value = paramArr[key].split("=");
            data[key_value[0]] = key_value[1];
        }
        result["data"] = data;
    }
    
    return result;    
}

/**
* Depath.getURL 获取数据对应服务器地址
* param1 path 即uri
* parseArr Depath.parse(uri)的返回值
*/
Depath.getURL = function  ( path, parseArr) {
    parseArr = parseArr || Depath.parse(path);
    //判断是否启用了地址映射
    if( $.CONFIG.addrMap ){
        var tempMap = $.CONFIG.UrlMap,
            tempArr = parseArr["uriarr"]
            ;
        for( var key in tempArr ){
            if( tempMap[tempArr[key]] !== undefined )
                tempMap = tempMap[tempArr[key]];
            else
                throw new Error(parseArr["uriarr"].join("/") + " map is not finded.");
        }
        if( typeof tempMap == "object"){
            tempMap = tempMap.overview;
        }
        // console.log(tempMap);
        //如果没有地址返回非映射解析
        if( tempMap != undefined ){
            if(tempMap)
                return $.CONFIG.server + tempMap;
            return tempMap;
        }
        else{
            return $.CONFIG.server + path;
        }        
    }
    return path;
}

/**
* Depath.hash hash改变触发函数
* data-path的实现
*/
Depath.hash = function  (event) {
    var uri = window.location.hash.slice( 1 ),
        $element = $("[data-path='" + uri+"']"),
        target = $element.data("target") || $.CONFIG.tmplTarget,
        parseArr = Depath.parse(uri) ,
        tmpl_id = $element.data("tmpl") || parseArr['tmpl'],
        data = parseArr["data"],
        Url = $element.data("url") || Depath.getURL(uri,parseArr),
        method = (data&&data["method"]?data["method"]:"get")+"Data"        
        ;

    //如果回退 触发选中事件
    $element.click();

    $.toast.remove("hash");
    $.Ajax.abort("hash");

    $.Ajax[method]({
        url:Url,
        data:data
    },
    "hash",
    function  (data) {
        var $el = $(target);
        if(data.status != 0){
            $.toast("error",data.message);
            return;
        }
        if(!window.QTMPL || !window.QTMPL[tmpl_id]){
            throw new Error("No template is finded ! Tmpl's Name is '" + tmpl_id + "'");
        };//alert(window.QTMPL[tmpl_id]);
        var tmpl = Handlebars.compile(window.QTMPL[tmpl_id]);

        //数据包含2部分：返回数据 + uri中解析得到的数据
        data.data = $.extend(data.data, parseArr.data)
        $el.html(tmpl(data));
        $(document).trigger("Init",data);        
    });
}

window.onhashchange = Depath.hash;

$(document).on("Depath",Depath.hash);

$.Depath = module.exports = Depath;