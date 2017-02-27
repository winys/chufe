/*
 ** Author: winys
 ** Time: 2015.6.10
 */
var Constanty = function () {
}

Constanty._que = {};

Constanty.clear = function (flag) {
	//如果为NULL全部清空
	if( flag === null ){
		for( var key in this._que ){
			for (var k in this._que[key])
				clearInterval(this._que[key][k]);
		}
		return;
	}
	//如果为undefined清空除了System以外的
	if( flag === undefined ){
		for( var key in this._que ){
			if(key == "system") continue;
			for (var k in this._que[key])
				clearInterval(this._que[key][k]);
		}
		return;
	}
	//清空flag
	for( var key in this._que[flag] ){
		clearInterval(this._que[key]);
	}
};

Constanty.run = function (url, timeout, flag, callback) {
	flag = flag || "default";
	if(Constanty.exist(url,flag))return;
	Constanty.setFlag(flag, url, setInterval(function () {
		$.Ajax.getData({
			url:url,
			data:null
		},
		"Constanty",
		function (data) {
			callback(data);
		},
		false);
	},timeout));
};
Constanty.exist = function (url,flag) {
	if(this._que[flag]&&this._que[flag][url])
		return true;
	return false;
}
Constanty.setFlag = function (flag, url, interval) {
	flag = flag || "default";
	if ( this._que[flag] ){
        this._que[flag][url] = interval;
    }
    else{
    	this._que[flag] = {};
        this._que[flag][url] = interval;
    }
};

$.Constanty = module.exports = Constanty;