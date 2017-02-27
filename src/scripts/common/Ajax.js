/*
 ** Author: hait
 ** Time: 2015.3.19
 */
$.Ajax = function () {
};

//请求队列
$.Ajax._reqs = {};


//封装Ajax GET请求
$.Ajax.getData = function (obj, type, callback,toast) {
    if ( typeof type == "function" ){
        toast = callback;
        callback = type;
        type = null;
    }
    if ( obj.url == "" ){
        callback.call(this,{data:"",message:"",status:0});
        return;
    }
    type = type || "default";
    
    if($.CONFIG.widthToken){
        if(obj.data)
            obj.data.token = $.CONFIG.token();
        else{
            obj.data={
                token: $.CONFIG.token()
            }
        }
    }

    //添加 Toast 信息显示

    if (toast !== false)
        var busy = $.toast("<i class='fa fa-spinner fa-spin'></i>&nbsp;&nbsp;<span>正在获取信息……</span>",true,type).display(200);

    var req = $.ajax({
        url: obj.url,
        type: 'get',
        dataType: 'json',
        data: obj.data,
        cache: false,
        success: callback,
        error: function (data,error) {
            if ( error != "abort" )
                $.toast("error","获取信息失败");
        },
        complete: function (xhr) {
            if (toast !== false) busy.hide(200);
            delete $.Ajax._reqs[type][obj.url];
            if (xhr.status == 403) {
                window.location.href = './403.php';
            } else if (xhr.status == 401) {
                window.location.href = './login.php';
            }
        }
    });

    //请求加入队列
    $.Ajax.setReq(type, obj.url, req);
};

//封装Ajax POST请求
$.Ajax.postData = function (obj, type, callback,toast) {
    if( typeof type == "function" ){
        toast=callback;
        callback = type;
        type = null;
    }
    type = type || "default";
    if (toast !== false)
       var busy = $.toast("<i class='fa fa-spinner fa-spin'></i>&nbsp;&nbsp;<span>正在获取信息……</span>",true,type).display(200);
    
    if($.CONFIG.widthToken){
        if(obj.data)
            obj.data.token = $.CONFIG.token();
        else{
            obj.data={
                token: $.CONFIG.token()
            }
        }
    }

    var req = $.Ajax._reqs[obj.url] = $.ajax({
        url: obj.url,
        type: 'post',
        dataType: 'json',
        data: obj.data,
        cache: false,
        success: callback,
        error: function ( data, error ) {
            if ( error != "abort" )
                $.toast("error","信息处理失败");
        },
        complete: function (xhr) {
            if (toast !== false) busy.hide(200);
            delete $.Ajax._reqs[type][obj.url];
            if (xhr.status == 403) {
                window.location.href = './403.php';
            } else if (xhr.status == 401) {
                window.location.href = './login.php';
            }
        }
    });
    $.Ajax.setReq(type, obj.url, req);
};

//将请求加入到队列
$.Ajax.setReq = function (type, url, req) {
    //检查参数
    type = type || "default";
    if ( this._reqs[type] ){
        this._reqs[type][url] = req;
    }
    else {
        this._reqs[type] = {};
        this._reqs[type][url] = req;
    }
};

$.Ajax.when = function(method,arr,whenback){
    var length = arr.length,
        re={}
        ;
    for(var option in arr){
        $.Ajax[method.toLowerCase()+'Data'](arr[option],
            callbackCompany(re,option,length,whenback)
        );
    }
};

$.Ajax.abort = function ( type, url ) {
    //默认移除全部
    if( arguments.length == 0){
        for ( var i in $.Ajax._reqs ){
            for ( var j in $.Ajax._reqs[key])
                $.Ajax._reqs[i][j].abort();
        }
        $.Ajax._reqs = {};
        return;
    }

    if ( /[a-zA-z]+:\/\/[^\s]*/.test(type) ){
        url = type;
        type = "default";
    }

    if ( $.Ajax._reqs[type] ){
        if( url != undefined){
            var group = $.Ajax._reqs[type];
            group && group[url] && group[url].abort();
            delete group[url];
            return;
        }
        for ( var key in $.Ajax._reqs[type] ){
            $.Ajax._reqs[type][key].abort();
        }
        delete $.Ajax._reqs[type];
    }   
};

function callbackCompany(obj,option,length,whenback){
    return function (data) {
        obj[option] = data;
        var len = 0;
        for(var key in obj){
            len++;
        }
        if(len === length){
            whenback(obj);
        }
    }
}