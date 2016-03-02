/**
 * Created by wangyong on 2015/12/4.
 */


var debug = false;

var bmApi = {
    index:0,
    apiNames:['',
        'user-info',
        'login',
        'player',
        'download',
        'chat',
        'my-music',
        'share',
        'member',
        'title',
        'alert',
        'del-music',
        'new-web-view'],
    callbacks:[],
    timeOut:3000,
    waitCallback:false,
    beginWaitTime:0,
    api:function(apiName,data,callback){
        //trace('inApi','进入API',data);
        //if(!window['bm']){trace('error','接口对象不存在',data);return}
        if(this.beginWaitTime>0){
            var nowTime = new Date().getTime();
            if(nowTime-this.beginWaitTime>this.timeOut){
                this.beginWaitTime = 0;
                this.waitCallback = false;
                var index = this.callbacks.length-1;
                var callback = this.callbacks[index];
                this.getIdByName(apiName)==3 || trace('timeout-'+index,'接口超时',{});
            }
        }
        /*处理并发情况，并发会被覆盖*/
        if(this.waitCallback){
            //trace('wait-'+this.getIdByName(apiName)+'-'+this.index,'接口被锁定，等待100毫秒',data);
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

        id==3 || trace('call-'+id+'-'+this.index,'JS-API调用接口：', $.extend({crumb:this.index,apiId:id},data));
        /*回调函数置入回调函数等待队列*/
        this.callbacks[this.index] =  typeof callback=='function'?callback:function(){};
        /*调用接口*/
        window['bm'] && window['bm'].api(id,this.index,JSON.stringify(data));
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
    if(res.apiId==12&&res.data.back==1) urlHistory.back();//点击后退的回调
    else window.bmApi.callbacks[res['crum']](res);

    res.apiId==3 ||
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
/*function pushA(hash){
    var url = location.href.split('#')[0];
    bmApi.api('new-web-view',{url:url+hash});
}*/
function trace(method,descript,data){
    if(!debug) return false;
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

/*自定义history*/
var urlHistory = {
    stack:[],
    cur:null,

    go:function(url){
        if(this.cur==url) return;
        this.cur && this.stack.push(this.cur);
        this.cur = url;
    },
    pop:function(dir){
        if(this.stack.length>0)
            if(dir==-1){//前一页出栈
                this.stack.pop();
                /*var temp = this.stack.pop();
                this.cur = this.stack.pop();
                this.stack.push(temp);*/
            }else
                this.cur = this.stack.pop();
        else this.cur = null;
    },
    back:function(){
        //var _this = this;
        //trace('history-back','后退',{hash:location.hash});
        /*判断在测评题页面或量表页*/
        var method = location.hash.split('/')[3];
        var isTesting = method=='question' /*|| method=='scale'*/;
        if(isTesting){
            trace('in-back','后退提示',{isTest:isTesting,hash:location.hash})
            if($('.confirm-box').length>0) return;
            /*退回到app传参*/
            var data={
                method:2,
                animated:1,
                mine:0
            };
            /*if(method=='scale'){
                bmApi.api('new-web-view',data);
                return;
            }*/
            components.confirm('您的评测还没有做完，您确定退出么？',
                {title:'您正在退出心理测评',okValue:'确定退出',cancelValue:'继续做题'},function(){
                    if(urlHistory.cur) location.hash = urlHistory.cur;
                    else bmApi.api('new-web-view',data);
                });
            return false;
        }
        if(this.stack.length>0){
            //var re = this.cur;
            this.cur = this.stack.pop();
            location.hash = this.cur;
        }else{

            var isMy = (this.cur && this.cur.split('/')[2]=='my' && this.cur.split('/')[3]!='group');
            trace('is-my','判断个人中心',{isMy:isMy});
            var data={
                method:2,
                animated:isMy?0:1,
                mine:isMy?1:0
            };
            trace('exit','退出',data);
            bmApi.api('new-web-view',data)
            //console.log('退出app');
        }

    }
}

/*确定框组件*/
var components = {
    confirm:function(content,opts,callback){
        var options = $.extend({},{
            title:'操作确认',
            content:content,
            hidePos:'-10rem',
            okValue:'确认',
            cancelValue:'取消'
        },opts);
        console.log(options);
        $('#mn').append(TPL.render('confirmBox',options));
        setTimeout(function(){
            $('.confirm-box .box').css('bottom',0);
        },100);
        $('.confirm-box .ok').click(function(){hide(callback);});
        $('.confirm-box .cancel,.confirm-box').click(function(){hide();})
        function hide(back){
            $('.confirm-box .box').css('bottom',options.hidePos);
            setTimeout(function(){
                $('.confirm-box').remove();
                back && typeof back=='function' && back();
            },1000);

        }
    }
}


var localCache = {
    keepDay:3,
    list:[
        'getMusic',             //音频
        'getUserActivityType',  //圈子分类
        'getUserActivityList',  //圈子列表
        'getScaleList',         //测评列表
        'getScaleBySort',       //测评分类列表
        'getMentalTestQuestion',//测评量表
        'getMentalTestResult',  //测评结果
    ],
    getter:function(url,req){
        if($.inArray(url,this.list)==-1)return false;
        if(window.localStorage){
            var temp = window.localStorage.getItem(url+this.getParams(req));
            if(temp){
                temp = JSON.parse(temp);
                //console.log(temp);
                if(temp['storageLastTime'] && temp['storageLastTime'] > new Date().getTime())
                    return temp;
            }
        }
        return false;
    },
    setter:function(url,req,data){
        if($.inArray(url,this.list)==-1)return false;
        if(window.localStorage){
            var date = new Date();
            data['storageLastTime'] = date.getTime()+this.keepDay*24*60*60*1000;
            window.localStorage.setItem(url+this.getParams(req),JSON.stringify(data));
        }
        return false;
    },
    getParams:function(params){
        var re = [];
        for(var p in params) re.push(params[p]);
        //console.log(['params',params,re.join('_')]);
        return re.join('_');
    }
}

function ajax(url,data,callback,errorback,times){
    times = times || 0;

    errorback = errorback ||
    function(res){
        if(times<3 && res['flag']){ //通讯出错时，尝试3次，然后提示网络错误
            trace('network','网络错误',{times:times,flag:res['flag']});
            ajax(url,data,callback,errorback,++times);
        }else
            bmApi.api('alert',{type:4,text:res['msg']||'网络访问出错'})
    };

    var remoteUrl = '';
    /*if(debug)
        remoteUrl = './test/'+url+'.json';
    else*/
    remoteUrl = "/BmindAPINew/Page/"+url+'.action';
    data['uid'] = params['uid'];
    /*本地存储*/
    /*var localData = localCache.getter(url,data);
    if(localData){
        //console.log(['本地',localData]);
        if(url=='getMusic') tplData.push(localData.list);
        callback && typeof callback=='function' && callback(localData);
        return false;
    }*/
    //bmApi.api('alert',{type:3,text:'正在加载数据'});
    $.ajax({
        url:remoteUrl,
        type:'POST',
        dataType:'JSON',
        data:data,
        success:function(req){
            //bmApi.api('alert',{type:0})
            localCache.setter(url,data,req);
            if(url == 'getMusic'){//音频缓存
                tplData.push(req.list);
                /*if(data.page==1) tplData.musicList = req.list;
                 else tplData.musicList.concat(req.list);*/
            }
            if(parseInt(req['result'])==1) callback(req);
            else errorback(req);
        },
        error:function(){
            //bmApi.api('alert',{type:0})
            errorback({
                msg:'请检查网络是否稳定',
                flag:true
            });
        }
    })
}
function loadAllQuestion(scaleID,page,count,versionCode,userSource){
    if(Math.ceil(count/10)<page) return;
    ajax('getMentalTestQuestion',{
        scaleID:scaleID,
        page:page,
        versionCode:versionCode,
        userSource:userSource
    },function(req){
        //cache.test.questions = req.list;
        cache.test.questions = cache.test.questions.concat(req.list);
        loadAllQuestion(scaleID,page+1,count,versionCode,userSource);
        /*
         cache.test.title = req.title;
         cache.test.count = req.count;
         cache.test.description = req.description;
         cache.test.curQuestions = 0;
         cache.test.scaleRecordID = req.ScaleRecordID;
         $('#mn').html(TPL.render('ttScale',cache.test));*/
    });
}