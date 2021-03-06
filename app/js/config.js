/**
 * Created by wangyong on 14-9-26.
 */
function fmtTime(time,fmt){
    var t = new Date(time);
    var o = {
        "M+" : t.getMonth()+1,                 //月份
        "d+" : t.getDate(),                    //日
        "h+" : t.getHours(),                   //小时
        "m+" : t.getMinutes(),                 //分
        "s+" : t.getSeconds(),                 //秒
        "q+" : Math.floor((t.getMonth()+3)/3), //季度
        "S"  : t.getMilliseconds()             //毫秒
    };
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;

}




;var routes = {
    '/bm': {
        on: function () {
            trace('router','路由转换',{hash:location.hash});
            $('#mn>div').hide();
            window.scrollTo(0, 0);
            $('#mn').html(TPL.render('loading',{}));
            urlHistory.go(location.hash);
            window['isPlayerUI'] = false;
            window['playerStatusTime'] && clearInterval(window['playerStatusTime']);
            //alert('准备取用户信息');
            !tplData.userInfo &&
            bmApi.api('user-info',{},function(res){//获取用户信息
                document.cookie = res.data['cookieStr'] || '';
                //alert(JSON.stringify(res));
                tplData.userInfo = true;
                tplData['common'] = res.data['common']||{};
                tplData['user'] = res.data['user'] || {};
                tplData.roleId = tplData.user['memberLevel'];
                tplData['ajaxArgs'] = $.extend({},tplData['common'],{accountType:tplData.user['accountType']||'',uid:tplData.user['uid']||tplData.user['id']||''});
                /*
                 *  3秒取一次用户信息
                 *  简单直接暴力【接口已经完善，取消该功能】
                 */
                /*window['getUserInfoTimes'] = setInterval(function(){
                    bmApi.api('user-info',{},function(res){//获取用户信息
                        /!*memberLevel发生变化则强制刷新页面*!/
                        if(tplData.user['memberLevel']!=res.data.user['memberLevel'])
                            location.reload();
                    });
                },3000);*/
            });
            bmApi.api('player',{method:6});//显示左上角正在播放的图标
            //
        },
        '/api':function(){
            bmApi.api('title',{title:'接口调试'});
            $('#mn').html(TPL.render('bmAPI',{list:tplData.bmApi.list,outStr:JSON.stringify(tplData.bmApi)}));
        },
        '/list':function(){
            bmApi.api('title',{title:'hash路由参数文档'});
            $('#mn').html(TPL.render('bmList',{items:tplData.bmList.list}));
        },
        '/fm': {
            '/index': function () {
                bmApi.api('title',{title:'情绪调频'});
                bmApi.api('new-web-view',{method:3,itemType:1})
                $('#mn').html(TPL.render('fmIndex',{}));//先解析头部按钮
                ajax('getMusic',{type:0,page:1,property:0},function(res){//请求接口数据
                    var data = {roleId:tplData.roleId,items:res.data,page:2,type:0,property:0};
                    $('#fm_hot ul').html(TPL.render('fmListLi',data));//再解析音频列表
                })
            },
            '/player/:id': function (id) {
                bmApi.api('title',{title:'情绪调频'});
                bmApi.api('new-web-view',{method:3,itemType:2})
                window['isPlayerUI'] = true;
                var data = {};
                ajax('getMusic',{type:0,page:1,property:0,mid:id},function(req){
                    window.playerStatusTime = setInterval(function(){

                        bmApi.api('player',{method:4},function(res){//$('article p').html(JSON.stringify(res));
                            //$('article .cnt').html(JSON.stringify(res)+'<br>'+res['playId']+':'+id);
                            if(res['data']&&res.data['playId']!=id) return false;
                            bmApi.api('player',{method:5});//隐藏左上角正在播放的图标
                            var playPercent = res.data['playProcess'];/*<0.02?0.02:res.data['playProcess'];*/
                            var playing = res.data['playStatus']&&res.data['playStatus']==1?true:false;
                            var downPercent = res.data['downProcess'];
                            var duration = parseInt(res.data['duration']);
                            var countTime = fmtTime(duration*1000,'mm:ss');
                            var currentTime = fmtTime(parseInt(res.data['duration']*res.data['playProcess'])*1000,'mm:ss');
                            /*播放进度条控制*/
                            $('.progress .cur').css('width',(playPercent*97+3)+'%');
                            $('.progress .down').css('width',(downPercent*100)+'%');
                            $('.player-ctrl .now').html(currentTime);
                            $('.player-ctrl .count').html(countTime);
                            /*播放状态控制*/
                            var targetBtn = $('.js-fm-play span');
                            if(playing && targetBtn.hasClass('icon-bofangqibofang')){
                                targetBtn.removeClass('icon-bofangqibofang').addClass('icon-zanting');
                            }
                            //$('.icons .level em').html(res.data['playProcess']);
                            //$('article .cnt').html(JSON.stringify(res));
                            /*自动下一首*/
                            playPercent>0.999 &&
                            tplData.getMusic(1,id,function(res){
                                var data = {method:1,url:res.filePath,playId:res.id};
                                //alert('找到下一首：'+JSON.stringify(data));
                                bmApi.api('player',data,function(res){
                                    //alert('下一首回调：'+JSON.stringify(res));

                                });
                                urlHistory.pop();
                                location.hash = '/bm/fm/player/'+data.playId;
                            });

                            function fmt(num){
                                num = parseInt(num);
                                var s = num%60;
                                var m = parseInt(num/60);
                                return m>9?m:'0'+m + ':'+ (s>9?s:'0'+s);
                            }
                        })
                    },500);
                    //console.log(req);
                    data = req.data[0];
                    data.roleId = tplData.roleId;
                    /*alert('准备调用接口');
                    bmApi.api('player',{method:1,url:data.filePath,playId:id},function(res){
                        //alert(JSON.stringify(res));
                    });*/
                    ajax('getCommentList',{page:1,paperId:id,cType:3},function(req){
                        //console.log(req);
                        data['items'] = req.data;
                        data['score'] = req.userScore;
                        /*for(var i=0;i<data['commentList'].length;i++)
                            data['commentList'][i].time = data['commentList'][i].time.split(' ')[0];*/
                        data['page'] = 2;
                        data['showShare'] = params['showShare'];
                        data['paperId'] = id;
                        data['cType'] = 3;
                        //console.log(data);
                        $('#mn').html(TPL.render('fmPlayer',data));
                    })
                })

            },
            '/professor/:id': function (id) {
                bmApi.api('title',{title:'情绪调频'});
                bmApi.api('new-web-view',{method:3,itemType:2})
                ajax('getMusic',{type:0,page:1,property:0,professiorId:id},function(req){
                    var data = {roleId:tplData.roleId,items:req.data,professorId:id,type:0,property:0,page:2};
                    //console.log(data);
                    $('#mn').html(TPL.render('fmProfessor',data));
                })
                //render('fmAuthor');
            },
            '/category/:property/:type': function (property,type) {
                bmApi.api('title',{title:'情绪调频'});
                bmApi.api('new-web-view',{method:3,itemType:2})
                urlHistory.stack.length>1 && urlHistory.pop(-1);
                ajax('getMusic',{type:type,page:1,property:property},function(req){
                    var data = {
                        items:req.data,
                        roleId:tplData.roleId,
                        cur:property,
                        tabs:[
                            {id:1,url:'#/bm/fm/category/1/'+type,name:'音频'},
                            {id:2,url:'#/bm/fm/category/2/'+type,name:'轻音乐'}
                        ],
                        type:type,
                        property:property,
                        page:2
                    };
                    //console.log(['分类数据：',data]);
                    $('#mn').html(TPL.render('fmCategory',data));
                })
                //render('fmCategory');
            },
            '/search': function () {
                bmApi.api('title',{title:'音频搜索'});
                $('#mn').html(TPL.render('fmSearch',{}));
                //render('fmSearch');
            }
        },
        '/comment': {
            '/list/:cType/:id': function (cType,id) {
                var data = {};
                ajax('getMusic',{type:0,page:1,property:0,mid:id},function(req){
                    //console.log(req);

                    data = req.data[0];
                    ajax('getCommentList',{uid:params['uid'],page:1,paperId:id,cType:cType},function(req){
                        //console.log(req);
                        data['items'] = req.data;
                        data['page'] = 2;
                        data['paperId'] = id;
                        data['cType'] = 3;
                        /*for(var i=0;i<data['commentList'].length;i++)
                            data['commentList'][i].time = data['commentList'][i].time.split(' ')[0];*/
                        $('#mn').html(TPL.render('comment',data));
                        //$('#mn').html($.templates['comment'].render(data));
                    })
                })
            },
            '/edit/:cType/:paperId/:score': function (cType,paperId,score) {
                bmApi.api('title',{title:'评论'});
                bmApi.api('player',{method:5});//隐藏左上角正在播放的图标
                $('#mn').html(TPL.render('commentEdit',{cType:cType,paperId:paperId,tuId:'',commentID:'',score:score}));
            },
            '/edit/:cType/:paperId/:tuId/:commentID':function(cType,paperId,tuId,commentID){
                bmApi.api('title',{title:'回复评论'});
                bmApi.api('player',{method:5});//隐藏左上角正在播放的图标
                $('#mn').html(TPL.render('commentEdit',{cType:cType,paperId:paperId,tuId:tuId,commentID:commentID}));
            }
        },
        '/my':{
            '/active':function(){//动态
                bmApi.api('title',{title:'我的动态'});
                ajax('getUserDynamic',{page:1},function(req){
                    var data = {items:req.data||[],page:2};
                    //console.log(data);
                    $('#mn').html(TPL.render('myActive',data));
                });
            },
            '/group':function(){
                /*location.hash = '/bm/my/music';
                return false;*/
                var id=1;
                var data = {};
                ajax('getUserActivityType',{},function(res){
                    data['tabs'] = [];
                    for(var i=0;i<res.data.length;i++)
                        data['tabs'].push({
                            id:res.data[i].typeId,
                            url:'#/bm/my/group/'+res.data[i].typeId,
                            name:res.data[i].typeName
                        });
                    console.log(data);
                    $('#mn').html(TPL.render('myGroup',data));
                    for(var i=0;i<data['tabs'].length;i++)
                        loadUL(data['tabs'][i]);

                    function loadUL(data){
                        console.log($('#mn .ul-'+data.id));
                        ajax('getUserActivityList',{typeId:data.id,page:1},function(res){
                            $('#mn .tabs .ul-'+data.id).append(TPL.render('myGroupListLi',{
                                items:res.data,
                                page:2,
                                typeId:data.id
                            }));
                        });
                    }
                    /*ajax('getUserActivityList',{typeId:data['tabs'][0].id,page:1},function(req){
                        data['tab1'] = {
                            items:req.list,
                            page:2,
                            typeId:data['tabs'][0].id,
                            cur:id,
                        };
                        ajax('getUserActivityList',{typeId:data['tabs'][1].id,page:1},function(req){
                            data['tab2'] = {
                                items:req.list,
                                page:2,
                                typeId:data['tabs'][1].id,
                                cur:id,
                            };
                            $('#mn').html(TPL.render('myGroup',data));
                        });

                    });*/
                });
            },
            '/group/:id':function(id){//圈子
                if(!id){
                    bmApi.api('title',{title:'我的圈子'});
                    location.hash = '/bm/my/group/1';
                }


            },
            '/test':function(){
                bmApi.api('title',{title:'我的评测'});
                ajax('getUserScale',{page:1},function(req){
                    //console.log(TPL.render('myTest',{items:req.data}));
                    $('#mn').html(TPL.render('myTest',{items:req.data,page:2}));
                });

            },
            '/music':function(){
                var p = location.hash.split('/');
                //console.log(p);
                if(p[p.length-1]=='music'){
                    bmApi.api('title',{title:'我的音频'});
                    location.hash = '/bm/my/music/2';
                }
                //render('myMusic');
            },
            '/music/:id':function(id){
                urlHistory.pop();
                if(!id) id==2;
                var data = {
                    cur:id,
                    tabs:[
                        {id:1,url:'#/bm/my/music/1',name:params['showShare']?'我的下载':'我的最爱'},
                        {id:2,url:'#/bm/my/music/2',name:'最近播放'}
                    ],
                }
                //console.log(data);
                if(id==1){
                    bmApi.api('my-music',{},function(res){
                        data['items'] = res.data.data;
                        //trace('data','数据调试',res);
                        $('#mn').html(TPL.render('myMusic',data));
                    });
                }else{
                    ajax('getPlayMusicRecord',{pageSize:20},function(res){
                        data['items'] = res.data;
                        data['page'] = 2;
                        $('#mn').html(TPL.render('myMusic',data));
                    })
                }
            },
            '/plan':function(){
                //render('myPlan');
            }
        },
        '/tt':{
            '/index':function(){
                bmApi.api('title',{title:'心理测评'});
                ajax('getScaleList',{page:1,type:1},function(req){
                    var data = {
                        userLevel:window.params['userLevel'],
                        items:req.data,
                        roleId:tplData.roleId,
                        page:2,
                        type:1
                    };
                    for(var i=0;i<data.items.length;i++)
                        cache.test.list[data.items[i].scaleID] = data.items[i];
                    $('#mn').html(TPL.render('ttIndex',data));
                });

            },
            '/list/:id':function(id){
                bmApi.api('title',{title:'心理测评'});
                /*urlHistory.stack.length<=0 &&
                    urlHistory.stack.push(location.hash);*/
                //trace('history','查看历史记录',urlHistory.stack);
                var reqData = {
                    sort:id,
                    page:1
                }
                ajax('getScaleBySort',reqData,function(res){
                    res['roleId'] = tplData.roleId;
                    trace('tt','测评数据',res);
                    $('#mn').html(TPL.render('ttList',res));
                });
            },
            '/scale/:id':function(id){
                bmApi.api('title',{title:'心理测评'});
                //urlHistory.pop();
                ajax('getMentalTestQuestion',{
                    scaleID:id,
                    page:1,
                    versionCode:1,
                    userSource:1
                },function(req){
                    cache.test.questions = req.data;
                    cache.test.title = req.title;
                    cache.test.count = req.count;
                    cache.test['height'] = $(window).height()-30;
                    cache.test.description = req.description;
                    cache.test.curQuestions = 0;
                    cache.test.scaleRecordID = req.ScaleRecordID;
                    trace('test','测评数据',cache.test);
                    $('#mn').html(TPL.render('ttScale',cache.test));
                    loadAllQuestion(id,2,req.count,1,1);
                    trace('height','屏高',{h:$(window).height()})
                });
                //bmApi.api('new-web-view',{url:location.href.split('#')[0]+'#/bm/tt/scale-view/'+id})
            },
            /*'/scale-view/:id':function(id){
                ajax('getMentalTestQuestion',{
                    scaleID:id,
                    page:1,
                    versionCode:1,
                    userSource:1
                },function(req){
                    cache.test.questions = req.list;
                    cache.test.title = req.title;
                    cache.test.count = req.count;
                    cache.test.description = req.description;
                    cache.test.curQuestions = 0;
                    cache.test.scaleRecordID = req.ScaleRecordID;
                    $('#mn').html(TPL.render('ttScale',cache.test));
                    loadAllQuestion(id,2,req.count,1,1);
                });
            },*/
            '/question/:step':function(step){
                urlHistory.pop();//取消历史记录
                bmApi.api('title',{title:'心理测评'});
                if(cache.test.questions.length==0){
                    location.hash = '/bm/tt/index';
                    return false;
                }
                cache.test['cur'] = step;
                cache.test['percent'] = parseInt(step/cache.test.count*100);
                cache.test['question'] = cache.test.questions[step -1];
                $('#mn').html(TPL.render('ttQuestion',cache.test));
            },
            '/result/:id':function(id){
                bmApi.api('title',{title:'测试结果'});
                ajax('getMentalTestResult',{scaleRecordID:id},function(req){
                    req['id'] = id;
                    $('#mn').html(TPL.render('ttResult',req));
                    var data = {
                        paperId:req['scaleID'],
                        cType:1,
                        page:1
                    }
                    console.log(data);
                    ajax('getCommentList',data,function(req){
                        data['page'] = 2;
                        data['items'] = req.data;
                        console.log(req);
                        console.log(data);
                        $('.result .comment').append(TPL.render('commentListLi',data));
                    });/*
                    scaleID
                    */
                });

            }
        },
        '/share':{
            '/m/:id':function(id){console.log(id);},
            '/music/:id':function(id){
                console.log('in share test');
                $.get('/BmindAPINew/Page/getMusic.action',{uid:params['uid'],type:0,page:1,property:0,mid:id},function(req){
                    data = req.data[0];
                    $('#mn').html(TPL.render('shareMusic',data));
                });
/*                ajax('getMusic',{type:0,page:1,property:0,mid:id},function(req){
                    data = req.data[0];
                    $('#mn').html(TPL.render('shareMusic',data));
                });*/
            }
        },
        '/index':function(){
            //initIndex()
            //setTimeout(function(){initIndex()},200);
            //function initIndex(){
                //trace('tpl-data','数据',{data:tplData['common']});
                /*if(!tplData['common']){
                    //trace('try','偿试',{});

                    setTimeout(function(){initIndex()},100);
                }else{*/
                    //var ajaxArgs = $.extend({},tplData['common'],{accountType:tplData.user['accountType']||'',uid:tplData.user['uid']||''});
                    trace('cookie','cookie值',{cookie:document.cookie});
                    trace('args','接口传参',tplData['ajaxArgs']);
                    //bmApi.api('title',{title:'测试页面一二三'});
                    $.get('/BmindAPPSet/app/parameterSet/100/list.do', window.params['args']||{},function(res){
                        //console.log(res);
                        $.get('/BmindAPPSet/app/home/100/list.do?page=1&rows=10',window.params['args']||{},function(listRes){
                            res.data['list'] = listRes.data;
                            res.data['page'] = 2;
                            console.log(res.data);
                            $('#mn').html(TPL.render('bmindIndex',res.data));
                            slideComponent.add('.js-slide-component');
                        })

                    });
                //}
            //}


        },
        '/read':{
            '/list':function(){
                $.get('/BmindRepository/app/article/100/articleList.do?page=1&rows=10',window.params['args']||{},function(res){
                    $('#mn').html(TPL.render('bmReadList',{list:res.data,page:2}));
                })

            }
        },
        '/s/m/:id':function(id){console.log(id)}
    }
};

