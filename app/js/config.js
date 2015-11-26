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
            $('#mn>div').hide();
            window.scrollTo(0, 0);
            $('#mn').addClass('top');
            window['isPlayerUI'] = false;
            window['playerStatusTime'] && clearInterval(window['playerStatusTime']);
        },
        '/api':function(){
            bmApi.api('title',{title:'接口调试'});
            $('#mn').html(TPL.render('bmAPI',{list:tplData.bmApi.list,outStr:JSON.stringify(tplData.bmApi)}));
        },
        '/list':function(){
            console.log()
            bmApi.api('title',{title:'hash路由参数文档'});
            $('#mn').html(TPL.render('bmList',{items:tplData.bmList.list}));
        },
        '/fm': {
            '/index': function () {
                bmApi.api('title',{title:'情绪调频'});
                ajax('getMusic',{type:0,page:1,property:0},function(req){
                    $('#mn').html(TPL.render('fmIndex',{items:req.list,page:2,type:0,property:0}));
                })
            },
            '/player/:id': function (id) {
                bmApi.api('title',{title:'情绪调频'});
                window['isPlayerUI'] = true;
                var data = {};
                ajax('getMusic',{type:0,page:1,property:0,mid:id},function(req){
                    window.playerStatusTime = setInterval(function(){
                        /*todo 正在播放的音频与当前浏览的音频同步逻辑 */
                        bmApi.api('player',{method:4},function(res){//$('article p').html(JSON.stringify(res));
                            var playPercent = res.data['playProcess'];/*<0.02?0.02:res.data['playProcess'];*/

                            var downPercent = res.data['downProcess'];
                            var duration = parseInt(res.data['duration']);
                            var countTime = fmtTime(duration*1000,'mm:ss');
                            var currentTime = fmtTime(parseInt(res.data['duration']*res.data['playProcess'])*1000,'mm:ss');
                            /*播放进度条控制*/
                            $('.progress .cur').css('width',(playPercent*97+3)+'%');
                            $('.progress .down').css('width',(downPercent*100)+'%');
                            $('.player-ctrl .now').html(currentTime);
                            $('.player-ctrl .count').html(countTime);
                            //$('.icons .level em').html(res.data['playProcess']);
                            //$('article p').html(JSON.stringify(res));
                            /*自动下一首*/
                            playPercent>0.999 &&
                            tplData.getMusic(1,id,function(res){
                                var data = {method:1,url:res.filePath,playId:res.id};
                                //alert('找到下一首：'+JSON.stringify(data));
                                bmApi.api('player',data,function(res){
                                    //alert('下一首回调：'+JSON.stringify(res));

                                });
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
                    data = req.list[0];
                    /*alert('准备调用接口');
                    bmApi.api('player',{method:1,url:data.filePath,playId:id},function(res){
                        //alert(JSON.stringify(res));
                    });*/
                    ajax('getCommentList',{page:1,paperId:id,cType:3},function(req){
                        //console.log(req);
                        data['items'] = req.list;
                        data['score'] = req.userScore;
                        /*for(var i=0;i<data['commentList'].length;i++)
                            data['commentList'][i].time = data['commentList'][i].time.split(' ')[0];*/
                        data['page'] = 2;
                        data['paperId'] = id;
                        data['cType'] = 3;
                        $('#mn').html(TPL.render('fmPlayer',data));
                    })
                })

            },
            '/professor/:id': function (id) {
                bmApi.api('title',{title:'主播频道'});
                ajax('getMusic',{type:0,page:1,property:0,professiorId:id},function(req){
                    var data = {items:req.list,professorId:id,type:0,property:0,page:2};
                    console.log(data);
                    $('#mn').html(TPL.render('fmProfessor',data));
                })
                //render('fmAuthor');
            },
            '/category/:property/:type': function (property,type) {
                bmApi.api('title',{title:'频道分类'});
                ajax('getMusic',{type:type,page:1,property:property},function(req){
                    var data = {
                        items:req.list,
                        cur:property,
                        tabs:[
                            {id:1,url:'#/bm/fm/category/1/'+type,name:'音频'},
                            {id:2,url:'#/bm/fm/category/2/'+type,name:'轻音乐'}
                        ],
                        type:type,
                        property:property,
                        page:2
                    };
                    console.log(data);
                    $('#mn').html(TPL.render('fmCategory',data));
                })
                //render('fmCategory');
            },
            '/search': function () {
                bmApi.api('title',{title:'音频搜索'});
                render('fmSearch');
            }
        },
        '/comment': {
            '/list/:cType/:id': function (cType,id) {
                var data = {};
                ajax('getMusic',{type:0,page:1,property:0,mid:id},function(req){
                    //console.log(req);

                    data = req.list[0];
                    ajax('getCommentList',{uid:params['uid'],page:1,paperId:id,cType:cType},function(req){
                        //console.log(req);
                        data['items'] = req.list;
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
                $('#mn').html(TPL.render('commentEdit',{cType:cType,paperId:paperId,tuId:'',commentID:'',score:score}));
            },
            '/edit/:cType/:paperId/:tuId/:commentID':function(cType,paperId,tuId,commentID){
                bmApi.api('title',{title:'回复评论'});
                $('#mn').html(TPL.render('commentEdit',{cType:cType,paperId:paperId,tuId:tuId,commentID:commentID}));
            }
        },
        '/my':{
            '/active':function(){//动态
                bmApi.api('title',{title:'我的动态'});
                ajax('getUserDynamic',{page:1},function(req){
                    $('#mn').html(TPL.render('myActive',{items:req.list,page:2}));
                });
            },
            '/group/:id':function(id){//圈子
                bmApi.api('title',{title:'我的圈子'});
                ajax('getUserActivityList',{typeId:id,page:1},function(req){
                    var data = {
                        items:req.list,
                        page:2,
                        typeId:id,
                        cur:id,
                        tabs:[
                            {id:1,url:'#/bm/my/group/1',name:'线下活动资讯'},
                            {id:2,url:'#/bm/my/group/2',name:'线上活动招募令'},
                            {id:3,url:'#/bm/my/group/3',name:'更多即将开放'}
                        ]
                    };
                    $('#mn').html(TPL.render('myGroup',data));
                });
                render('myGroup');
            },
            '/test':function(){
                bmApi.api('title',{title:'我的评测'});
                ajax('getUserScale',{page:1},function(req){
                    console.log(TPL.render('myTest',{items:req.list}));
                    $('#mn').html(TPL.render('myTest',{items:req.list,page:2}));
                });

            },
            '/music':function(){
                render('myMusic');
            },
            '/plan':function(){
                render('myPlan');
            }
        },
        '/tt':{
            '/index':function(){
                bmApi.api('title',{title:'心理测评'});
                ajax('getScaleList',{page:1,type:1},function(req){
                    var data = {
                        userLevel:window.params['userLevel'],
                        items:req.list,
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
                ajax('getScaleBySort',{sort:id},function(req){
                    req['page'] = 2;
                    $('#mn').html(TPL.render('ttList',req));
                });
                render('ttList');
            },
            '/scale/:id':function(id){
                bmApi.api('title',{title:'心理测评'});
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
            },
            '/question/:step':function(step){
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
                        paperId:id,
                        cType:1,
                        page:1
                    }
                    ajax('getCommentList',data,function(req){
                        data['page'] = 2;
                        data['items'] = req.list;
                        $('.result .comment').append(TPL.render('commentListLi',data));
                    });
                });

            }
        }
    }
};

