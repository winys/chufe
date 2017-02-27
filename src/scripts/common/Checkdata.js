var Checkdata = function() {};

Checkdata.run = function (data) {
	if( !data || !data.data )return;
	var that = $.Checkdata;
	that.datatype.forEach(function (item){
		that[item].call(that,data.data);
	});
    if(data.data.constanty){
        $.Constanty.run($.Depath.getURL(window.location.hash.slice(1)), 20000, "page", this.run);
    }
};
$.Checkdata = module.exports = Checkdata;


/****************************************************
 *			以下为自定义返回数据选项					*
 ****************************************************/

Checkdata.datatype = ["refresh","redirect","table","charts"];

Checkdata.refresh = function (data) {
	if(data.refresh)
		$(document).trigger("Depath");
};

Checkdata.redirect = function (data) {
	if(data.redirect)
		window.location.href = data.redirect;
};

Checkdata.table = function (data) {
};

Checkdata.charts = function ( data ){
	//是否有图表
    if (data.chart){
    	var charts = data.chart;
    	for( var key in charts){
    		var option = charts[key].option,
    			type = option.series[0].type
    			;
    		// 添加toolbox
    		
    		switch (type){
    			//折线型
    			case "line":
                    option["toolbox"] = {
                        show : true,
                        feature : {
                            saveAsImage : {show: false}
                        }
                    };
    				option.toolbox.feature.magicType = 
    					{show: true, type: ['line', 'bar']};
    				option.tooltip = {
    					show : true,
						trigger: 'axis'
					};
    				break;
    			case "pie":
    				break;
    			case "gauge":
                    option.series[0].radius=[0, '100%'];
                    option.series[0].axisLine = {
                        show: true,
                        lineStyle: {
                            color: [[0.2, '#2b821d'],[0.8, '#005eaa'],[1, '#c12e34']], 
                            width: 3
                        }
                    };
                    option.series[0].axisTick = {
                        splitNumber: 10,
                        length :8,
                        lineStyle: {
                            color: 'auto'
                        }
                    };
                    option.series[0].splitLine = {
                        length :12,
                        lineStyle: {
                            color: 'auto'
                        }
                    };
                    option.series[0].pointer = {
                        width : 5
                    };
    				break;
    			default:
    				break;
    		}
    		try {
                var element = $('#' + key),
                    ec = $('#' + key).data("echarts");
                    ;
                if(ec){
                    ec.setOption(option);
                }
                else{
                    ec = echarts.init(element[0]);
                    element.data("echarts",ec);
                    ec.setOption(option);
                }
    		}catch (e){
    			$('#' + key).html("<span>" + key + "没数据</span>");
    		}
    	}
    }
};