/*
 ** Author: Winys
 ** Time: 2015.4.9
 *  对所有data-submit属性绑定事件
 */

//Verify.js 用于验证表单字符串 支持 “！” 语句

//常用Reg库
$.Reg = {
	IP : {
		condition : /^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/,
		errmsg : "请输入IP地址格式",
		nerrmsg : "请不要输入IP地址格式"
	},
	NULL : {
		condition : /^\s*$/,
		errmsg : "输入不为空",
		nerrmsg : "该字段为必填字段且不能只为空格"
	},
	PINTEGER : {
		condition : /^[0-9]*[1-9][0-9]*$/,
		errmsg : "请输入正整数",
		nerrmsg : "请不要输入非正整数"
	},
	WORD : {
		condition : /^\w+$/,
		errmsg : "请输入字母数字下划线的组合",
		nerrmsg : "请不要输入字母数字下划线的组合"
	},
	PERCENTAGE : {
		condition :/^(0|[1-9]\d?|100)$/,
		errmsg : "请输入0-100之间的数值",
		nerrmsg : "请不要输入0-100之间的数值"
	},
	PRICE:{
		condition :/^[1-9]\d*(|\.)\d*$/,
		errmsg : "请输入正确的价格",
		nerrmsg : "请不要输入正确的价格"
	},
	TELLPHONE:{
		// condition :/^[1][3578][0-9]{9}$/,
		condition :/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
		errmsg : "请输入正确的手机号码",
		nerrmsg : "请不要输入错误的手机号码"
	},
	EMAIL : {
		// condition : /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
		condition : /(^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+)|(^$)/,
		errmsg : "请输入正确的邮箱地址",
		nerrmsg : "请不要输入错误的邮箱地址"
	},
	TEXTLENGTH : {
		// condition : /^\s*\S((.){0,128}\S)?\s*$/,//最多输入130个字
		condition : /^\s*[\s\S]{0,120}\s*$/,//最多输入120个字
		errmsg : "您输入的字数过多",
		nerrmsg : "请不要输入过多的字数"
	},
	//子网掩码
	SUBNETMASK : {
		condition : /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/,
		errmsg : "您输入的不是合法的子网掩码",
		nerrmsg : "请不要输入不合法的子网掩码"
	},
	UPW:{
		condition:/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z#@$!~%^&*,.]{8,32}$/,
		errmsg:"您输入的内容不符合要求",
		nerrmsg:"请输入符合要求的内容"
	},
	AJAX : {
		condition : function (element,callback,not) {
			var $el = element,
				url = $el.data("url"),
				urlarr = $.Depath.parse(url);
				fdata=$el.data('fdata'),// 2015.12.9加fdata
				data=$.extend($.CONFIG.getFdata(fdata) || {}, urlarr.data)
				;
			
			data[$el.attr("name")]=$el.val();
			
			$.Ajax.getData({
				url:$.Depath.getURL(url,urlarr),
				data : data
			},
			'verify',
			function (data) {
				if(not)
					callback.call($el,!(data.status==0),data.message);
				else callback.call($el,data.status==0,data.message);
			});
		},
		errmsg : "",
		nerrmsg : ""
	},
	OTHERVALUE : {
		condition : function (element,callback,not) {
			var $el = element,
				url=$el.data("url"),
				data={},
				othervalues = [],
				othervalue = $el.closest("form").find("[data-othervalue]")
				;
			for(var i= 0;i<othervalue.length;i++){
				othervalues.push(othervalue[i].value);
			}
			data[$el.attr("name")]=$el.val();
			data["othervalues"] = othervalues;
			$.Ajax.getData({
				url:$.Depath.getURL(url),
				data : data
			},
			'verify',
			function (data) {
				if(not)
					callback.call($el,!(data.status==0),data.message);
				else callback.call($el,data.status==0,data.message);
			});
		},
		errmsg : "",
		nerrmsg : ""
	},
	RENAME : {
		condition : function (element,callback,not) {
			var $el = element,
				url=$el.data("url"),
				data={},
				renames = [],
				rename = $el.closest("tbody").find("[data-rename]")
				;
			for(var i= 0;i<rename.length;i++){
				renames.push(rename[i].value);
			}
			data[$el.attr("name")]=$el.val();
			data["renames"] = renames;
			$.Ajax.getData({
				url:$.Depath.getURL(url),
				data : data
			},
			'verify',
			function (data) {
				if(not)
					callback.call($el,!(data.status==0),data.message);
				else callback.call($el,data.status==0,data.message);
			});
		},
		errmsg : "",
		nerrmsg : ""
	}
}


var Verify = function () {
}

$.verify_test = Verify.test = function (type,element,callback,context){
	if(!type||element.is(":hidden")||element.css("display")=="none")return true;

	//以空格隔开，可以使用多个验证
	var typelist = type.split(/\s* \s*/),
		status = true,
		value = element.val()
		;
	for ( var key in typelist ){
		var TYPE = typelist[key].toUpperCase();
		//带有！运算符
		if(  TYPE.indexOf('!') == 0 ){
			TYPE = TYPE.slice(1);
			var verifyObj = $.Reg[TYPE];
			if( toString.call(verifyObj.condition) === "[object RegExp]" ){
				status = status && !(verifyObj.condition).test(value);
				if (callback) callback.call(context||this,status,verifyObj.nerrmsg,element);
			}
			else if( toString.call(verifyObj.condition) === "[object Function]" ){
				verifyObj.condition.call(context||this,element,callback,true);
			}
		}
		//正常情况
		else{
			var verifyObj = $.Reg[TYPE];
			if( verifyObj )
				if( toString.call(verifyObj.condition) === "[object RegExp]" ){
				status = status && verifyObj.condition.test(value);
				if (callback) callback.call(context||this,status,verifyObj.errmsg,element);
			}
			else if( toString.call(verifyObj.condition) === "[object Function]" ){
				verifyObj.condition.call(context||this,element,callback);
			}
		}
	}

}

//表单焦点触发验证
$(document).on("blur", "[data-verify]",function (event) {
	var $this = $(this).closest("[data-verify]"),		
		type = $this.data("verify")
		;
	if($this.css("display")=="none")return;
	if($this.is(":hidden"))return;
	$.verify_test (type,$(this),function(status,msg){
		var $submit = $this.closest("form").find("[data-submit]");//submit按钮
		var $upfile = $this.closest("form").find("[data-upfile]");//upfile按钮
		var $sureconceal= $this.closest("form").find("[data-sureconceal]");//sureconceal按钮
		var $step=$this.closest(".step_item").find("[data-next]");//step里面的下一步按钮
		$this.tooltip('destroy');
		if(status){
			$this.removeClass("verify_err");
			$submit.data("err",$submit.data("err")?parseInt($submit.data("err"))-1:0);
			$upfile.data("err",$upfile.data("err")?parseInt($upfile.data("err"))-1:0);
			$sureconceal.data("err",$upfile.data("err")?parseInt($sureconceal.data("err"))-1:0);
			$step.data("err",$step.data("err")?parseInt($step.data("err"))-1:0);
			return;
		}
		$this.tooltip({
			title:msg || "格式不正确",
			placement:"bottom",
			trigger:"manual"
		});
		$this.tooltip('show');
		$this.addClass("verify_err");
		$submit.data("err",$submit.data("err")?parseInt($submit.data("err"))+1:1);
		$upfile.data("err",$upfile.data("err")?parseInt($upfile.data("err"))+1:1);
		$sureconceal.data("err",$sureconceal.data("err")?parseInt($sureconceal.data("err"))+1:1);
		$step.data("err",$step.data("err")?parseInt($step.data("err"))+1:1);
		},this);
});