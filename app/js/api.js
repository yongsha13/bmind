/**
 * Created by wangyong on 2015/12/4.
 */
var bmApi = {
    index:0,
    apiNames:['','user-info','login','player','download','chat','my-music','share','member','title','alert','del-music'],
    callbacks:[],
    timeOut:3000,
    waitCallback:false,
    beginWaitTime:0,
    api:function(apiName,data,callback){
        if(!window['bm']){trace('error','接口对象不存在',data);return}
        if(this.beginWaitTime>0){
            var nowTime = new Date().getTime();
            if(nowTime-this.beginWaitTime>this.timeOut){
                this.beginWaitTime = 0;
                this.waitCallback = false;
                var index = this.callbacks.length-1;
                var callback = this.callbacks[index];
                trace('timeout-'+index,'接口超时',{});
            }
        }
        /*处理并发情况，并发会被覆盖*/
        if(this.waitCallback){
            trace('wait-'+this.getIdByName(apiName)+'-'+this.index,'接口被锁定，等待100毫秒',data);
            setTimeout(function(){
                bmApi.api(apiName,data,callback);
            },100);
            return;
        }
        /*加并发锁*/
        this.waitCallback = true;
        this.beginWaitTime = new Date().getTime();
        this.index++;
        var id = this.getIdByName(apiName);

        trace('call-'+id+'-'+this.index,'JS-API调用接口：', $.extend({crumb:this.index,apiId:id},data));
        /*回调函数置入回调函数等待队列*/
        this.callbacks[this.index] =  typeof callback=='function'?callback:function(){};
        /*调用接口*/
        window['bm'].api(id,this.index,JSON.stringify(data));
    },
    getIdByName:function(apiName){
        return this.apiNames.indexOf(apiName);
        /*for(var i=0;i<this.apiNames.length;i++)
         if(apiName == this.apiNames[i]) return i;
         return 0;*/
    },
    getCallback:function(crumb){
        return this.callbacks[crumb];
    }
};
function bmCallback(res){
    bmApi.waitCallback = false;
    bmApi.beginWaitTime = 0;
    window.bmApi.callbacks[res['crum']](res);
    trace('back-'+res.apiId+'-'+res.crum,'JS-API回调',res);
    //alert('JS接收到回调：'+JSON.stringify(res));
    //alert('接口回调0:'+JSON.stringify(res));


    //alert(JSON.stringify(window.bmApi));
    /*var fun = window.bmApi.getCallback(res['crum']);
     console.log('回调');
     if(fun && typeof fun=='function') fun(data);*/
}
/*function bmCallback(apiId,crumb,status,data){
 $('.js-api-output').html(function(i,v){return v+'<br>回调：apiId'+crumb+','+status,+','+JSON.stringify(data)});
 }*/
function trace(method,descript,data){
    //return false;
    //data['描述'] = descript;
    data = $.extend({'描述':descript,'接口名称':bmApi.apiNames[data.apiId]},data);
    $.ajax({
        url:'/debug?method='+method,
        type:'POST',
        data:data,
        success:function(res){},
        error:function(){}
    });
}