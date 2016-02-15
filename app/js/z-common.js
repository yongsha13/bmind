/**
 * Created by wangyong on 14-9-24.
 */
;var cache = {
    test:{
        list:[],
        cur:0,
        scaleRecordID:0,
        questions:[],
        curQuestions:0
    }
};


var TPL = new etpl.Engine({
    strip:true,
    namingConflict:'error',
    commandOpen:'{{',
    commandClose:'}}'
});
TPL.addFilter('date',function(source,useExtra){
    //console.log(source);
    return source.split(' ')[0];
});
TPL.addFilter('pre',function(source,useExtra){
    return source.replace(/\n|\r|(\r\n)|(\u0085)|(\u2028)|(\u2029)/g, "</p><p>");
});
TPL.addFilter('url',function(source,useExtra){
    return source || 'javascript:;';
});
var debug = false;
$(function(){
    window.params['userLevel'] = 1;
    $.get('./tpl/template.html',function(req){
        TPL.compile(req);
        window.router = Router(routes).configure({ recurse: 'forward' });
        router.init();
        location.hash.length>0 || (location.hash = '/bm/fm/index');
    },'html');
    //window['params']['uid'] = 32844;
    $('#mn').scroll(function(){
        if($('#mn').scrollTop()<170)
            $('#mn').removeClass('top');
        else
            $('#mn').addClass('top');
        //console.log(['scroll',$(window).scrollTop()]);
    });
    $('#mn')
        .on('click','.js-app-download-btn',function(){
            var ua = navigator.userAgent.toLowerCase();
            var isWeiXin = ua.match(/MicroMessenger/i)=="micromessenger";
            if(isWeiXin){
                $('#mn .fm').append('<div class="weixin"><img src="./images/weixin-bg.jpg" alt=""></div>');
            }else{
                location.href='http://www.ydeap.com/download.jsp'
            }
        })
        /*在新的webview中打开，历史记录不记录hash地址*/
        /*.on('click','.js-new-web',function(){
            bmApi.api('new-web-view',{url:location.href.split('#')[0]+$(this).data('href')})
        })*/
        .on('click','.js-push-a',function(){
            var url = $(this).data('href');
            if($(this).data('type')!='full') url =+ location.href.split('#')[0];
            //alert(url);
            var data = {
                method:1,
                url:url,
                pushType:$(this).data('type')=='full'?1:2
            }
            trace('url','活动圈',data);
            bmApi.api('new-web-view',data);
        })
        /*删除我的音乐*/
        .on('click','.js-my-music-del',function(){
            var _this = this;
            if($(this).data('type')==1)//删除我的下载
                bmApi.api('del-music',{url:$(this).data('url')},function(){
                    $(_this).closest('li').remove();
                });
            else//删除播放记录
                ajax('delPlayMusicRecord',{playRecordId:$(this).data('id')},function(){
                    $(_this).closest('li').remove();
                });
        })
        /*显示我的音乐操作界面*/
        .on('click','.js-show-operation',function(){
            $(this).closest('li').addClass('cur').siblings().removeClass('cur');
        })
        /*分享页播放控制*/
        .on('click','.share-ctrl',function(){
            var c = ['icon-bofangqibofang','icon-zanting'];
            var btn = $(this).find('span');
            if(btn.hasClass(c[0])){
                $('#audio')[0].play();
                btn.removeClass(c[0]).addClass(c[1]);
            }else{
                $('#audio')[0].pause();
                btn.removeClass(c[1]).addClass(c[0]);
            }

        })
        .on('submit','.search form',function(e){
            e.preventDefault();
            var _this = this;
            var keyword = $(this).find('input').val();
            ajax('getMusic',{page:1,type:0,property:0,keyWord:keyword},function(res){
                var data = {roleId:tplData.roleId,items:res.list,type:0,property:0,page:2,keyword:keyword};
                $('#mn').html(TPL.render('fmSearch',data));
            });
            return false;
        })
        /*咨询师按钮*/
        .on('click','.js-ask',function(){
            bmApi.api('chat',$(this).parent().data());
        })
        /*提醒关闭按钮*/
        .on('click','.alert-box .close span',function(){
            $(this).closest('.alert-box').hide();
        })
        /*显示必须为会员提醒*/
        .on('click','.js-show-join',function(){
            //trace('click','点击了',{type:$(this).attr('')});
            if($(this).data("type")=='music'){
                bmApi.api('member',{text:tplData.tips.memberMusic});
            }
            if($(this).data("type")=='test'){
                bmApi.api('member',{text:tplData.tips.memberTest});
            }
            //$('#mn').append(TPL.render('alertBox',{}));
        })
        .on('click','.js-tt-share',function(){
            var data = {
                type:1,
                title:$(this).data('title'),
                text:$(this).data('content'),
                shareUrl:$(this).data('share-url')
            };
            bmApi.api('share',data)
        })
        /*分享音频*/
        .on('click','.js-fm-share',function(){
            //trace('data',{});
            var id = $(this).closest('.player-ctrl').data('id');
            var music = tplData.getMusic(0,id);
            console.log([id,music]);
            var data = {
                type:2,
                title:music.title,
                text:music.musicDes,
                shareUrl:music.shareURL
            }
            //trace('data',data);
            bmApi.api('share',data)
        })
        /*下载音频*/
        .on('click','.js-fm-download',function(){//alert('点击下载');
            var id = $(this).closest('.player-ctrl').data('id');
            //alert('获取音频数据：'+id);
            tplData.getMusic(0,id,function(data){
                //alert('重组音频数据：'+JSON.stringify(data));
                data['url'] = data['filePath'];
                data['id'] = id;
                //alert('准备下载：'+JSON.stringify(data));
                bmApi.api('download',data,function(res){

                    var status = parseInt(res.data['downloadResult']);
                    status = status?status:3;
                    /*$('article .cnt').html(JSON.stringify(res)+":"+status);*/
                    var tips = ['','下载失败','下载完成','正在下载','已经下载','已经取消下载'];
                    var $dom = $('.player-ctrl .status');
                    if(status>0) $dom.html(tips[status]).slideDown();
                    if(status!=3)
                        setTimeout(function(){
                            $dom.slideUp();
                        },5000);
                    //alert('回调：'+JSON.stringify(res));
                });
            });

        })
        /*随机播放*/
        .on('click','.js-random-player',function(){
            tplData.getRandomMusic(function(res){
                bmApi.api('player',{method:1,url:res.filePath,playId:res.id});
                bmApi.api('player',{method:4});
                ajax('addPlayMusicRecord',{musicId:res.id,versionCode:1,userSource:2});
            });
        })
        /*上一首，下一首*/
        .on('click','.js-fm-change',function(){
            var id = $(this).closest('.player-ctrl').data('id');
            if($(this).hasClass('prev')){
                //alert('准备上一首'+id);
                tplData.getMusic(-1,id,function(res){
                    if(!res) return;
                    var data = {method:1,url:res.filePath,playId:res.id};
                    //alert('找到上一首：'+JSON.stringify(data));
                    bmApi.api('player',data,function(res){
                        //alert('上一首回调：'+JSON.stringify(res));
                        ajax('addPlayMusicRecord',{musicId:data.playId,versionCode:1,userSource:2});
                    });
                    urlHistory.pop();
                    location.hash = '/bm/fm/player/'+data.playId;
                });
            }
            if($(this).hasClass('next')){
                //alert('准备下一首'+id);
                tplData.getMusic(1,id,function(res){
                    if(!res) return;
                    var data = {method:1,url:res.filePath,playId:res.id};
                    //alert('找到下一首：'+JSON.stringify(data));
                    bmApi.api('player',data,function(res){
                        //alert('下一首回调：'+JSON.stringify(res));
                        ajax('addPlayMusicRecord',{musicId:data.playId,versionCode:1,userSource:2});
                    });
                    urlHistory.pop();
                    location.hash = '/bm/fm/player/'+data.playId;
                });
            }
        })
        .on('click','.player-ctrl .pos',function(e){
            trace('in','点击',{});
            var x = e.originalEvent.x || e.originalEvent.layerX || 0;
            var w = $(document).width();
            var t = $('.player-ctrl .time .count').html().split(':');
            var s = parseInt(t[0])*60+parseInt(t[1]);
            bmApi.api('player',{method:7,time:parseInt(s*x/w)});
            trace('mouse','鼠标位置',{x:x,w:w,t:t,s:s,time:parseInt(s*x/w)})
        })
        /*播放暂停控制*/
        .on('click','.js-fm-play',function(){
            var data = $(this).closest('.player-ctrl').data();
            /*console.log(data);*/
            var btn = $(this).find('span');
            if(btn.hasClass('icon-bofangqibofang')){
                btn.removeClass('icon-bofangqibofang').addClass('icon-zanting');
                var data = {method:1,url:data.file,playId:data.id};
                //alert(JSON.stringify(data));
                bmApi.api('player',data,function(res){
                    //alert('播放回调完成');;
                    ajax('addPlayMusicRecord',{musicId:data.playId,versionCode:1,userSource:2});

                    /*if(!window['listenPlayer']){
                        window['listenPlayer'] = setInterval(function(){

                        },10000);
                    }*/
                    //alert(JSON.stringify(res));
                });
            }else{
                btn.removeClass('icon.zanting').addClass('icon-bofangqibofang');
                bmApi.api('player',{method:2},function(res){

                })
            }
            /*if(btn.hasClass('icon-zhanting')){

            }*/

        })
        /*发表评论*/
        .on('click','.js-comment-btn',function(){
            var data = {
                score:$('#score').val(),
                paperId:$('#paperId').val(),
                cType:$('#cType').val(),
                summary: $.trim($('#summary').val()),
                tuId:$('#toId').val(),
                commentID:$('#commentID').val()
            };
            if(data.cType==3&&data.score==0){
                bmApi.api('alert',{type:4,title:'提示',text:'请给先给音频评分'});
                //alert('请给先给音频评分');
                return;
            }
            if(data.summary.length==0){
                bmApi.api('alert',{type:4,title:'提示',text:'评论的内容不能为空'});
                //alert("评论的内容不能为空");
                return;
            }
            if(data.summary.length>200){
                bmApi.api('alert',{type:4,title:'提示',text:'评论的字数不能超过200字'});
                //alert('评论的字数不能超过200字');
                return;
            }
            if(!data['score']) delete data['score'];
            if(!data['tuId']) delete data['tuId'];
            if(!data['commentID']) delete data['commentID'];
            ajax('saveComment',data,function(req){
                urlHistory.back();
            })
        })
        .on('click','.js-tt-list-tabs,.js-my-group-tabs',function(){
            if($(this).hasClass('cur')) return;
            var index = $(this).index();
            $(this).addClass('cur').siblings().removeClass('cur');
            /*$(this).closest('.tabs').find('>.cnt').each(function(i,v){
                console.log([i,v]);
                i==index?$(v).show():$(v).hide();
            });*/
            //$(this).closest('.tabs').find('.cnt:eq('+index+')').show().siblings('.cnt').hide();
            $(this).closest('.tabs').find('>.cnt').hide().end().find('>.cnt:eq('+index+')').show();
        })
        /*心理评测答题*/
        .on('click','.js-questions input',function(){
            var _this = this;
            var questionID = $(this).data('question-id');
            var optionID = $(this).data('option-id');
            var cur = $(this).data('cur');
            var questions = cache.test.questions;
            for(var i=0;i<questions.length;i++)
                if(questions[i]['questionID'] == questionID)
                    questions[i]['result'] = optionID;
            ajax('saveOptionsRecord',{
                scaleRecordID:cache.test.scaleRecordID,
                questionID:questionID,
                optionsID:optionID
            },function(){});
            if($(this).data('cur')==questions.length)
                $(this).closest('.question').find('.ctrl').html('<a class="btn red" href="#/bm/tt/result/'+cache.test.scaleRecordID+'">查看结果</a>');
            else
                setTimeout(function(){location.hash = '/bm/tt/question/'+(parseInt($(_this).data('cur'))+1);},500);
        })
        /*api接口测试按钮*/
        .on('click','.js-api-submit',function(){
            window['apiIndex']?window['apiIndex']++:(window['apiIndex'] = 1);
            //console.log(JSON.parse($('#js-api-args').val()));
            if(window['bm']){
                var apiId = $('#js-api-id').val();
                //var apiIndex = window['apiIndex'];
                var apiArgs = JSON.stringify(JSON.parse($('#js-api-args').val()));
                $('.js-api-output').html('执行：window.bm.api('+apiId+','+bmApi.index+',"'+apiArgs+'");<br>等待接口回调...');
                bmApi.api(apiId,apiArgs,function(res){
                    //(res);
                    $('.js-api-output').html(res);
                })
            }else{
                $('.js-api-output').html('没有找到 window.bm 对象，请确定接口是否已经初始化！[浏览器下无bm对象]');
            }
        })
        /*api接口测试2*/
        .on('click','.js-api-submit-2',function(){
            window['apiIndex']?window['apiIndex']++:(window['apiIndex'] = 1);
            if(window['bm']){
                var apiId = $('#js-api-id').val();
                var apiIndex = window['apiIndex'];
                var apiArgs = $('#js-api-args').val();
                $('.js-api-output').html('执行：window.bm.api(1,1,"123");<br>等待接口回调...');
                window.bm.api(1,1,"123");
            }else{
                $('.js-api-output').html('没有找到 window.bm 对象，请确定接口是否已经初始化！[浏览器下无bm对象]');
            }
        })
        /*.on('click','.js-test',function(){
            cache.test.cur = $(this).data('id');
            location.hash = '/bm/tt/scale/'+cache.test.cur;
        })*/
        /*更多圈子*/
        .on('click','.js-more-group',function(){
            var _this = this;
            var data = $(this).data();
            data['typeId'] = data['typeid'];
            ajax('getUserActivityList',data,function(res){
                data['items'] = res.list;
                data['page'] = parseInt(data['page']) +1;
                $(_this).closest('li').replaceWith(TPL.render('myGroupListLi',data));
            })
            //console.log(data);
        })
        /*更多测评*/
        .on('click','.js-more-test',function(){
            var _this = this;
            var data = $(this).data();
            ajax('getScaleList',data,function(req){
                data['items'] = req.list;
                data['roleId'] = tplData.roleId;
                data['page'] = parseInt(data['page']) +1;
                $(_this).closest('li').replaceWith(TPL.render('ttListLi',data));
            });
        })
        /*更多评论*/
        .on('click','.js-more-comment',function(){
            var _this = this;
            var data = $(this).data();
            data['paperId'] = data['paperid'];
            delete data['paperid'];
            data['cType'] = data['ctype'];
            delete data['ctype'];
            ajax('getCommentList',data,function(req){
                //var data = {};
                data['items'] = req.list;
                /*for(var i=0;i<data['commentList'].length;i++)
                    data['commentList'][i].time = data['commentList'][i].time.split(' ')[0];*/
                data['page'] = parseInt(data['page'])+1;
                //console.log(TPL.render('commentListLi',data));
                $(_this).closest('li').replaceWith(TPL.render('commentListLi',data));
                //$('#mn').html($.templates['fmPlayer'].render(data));
            })
        })
        /*更多音频*/
        .on('click','.js-more-music',function(){
            var data = $(this).data();
            var _this = this;
            if(data['keyword']){

                data['keyWord'] = data['keyword'];
            }else{
                data['professiorId'] = data['professiorid'];
            }

            ajax('getMusic',$(this).data(),function(req){
                //var data = {};
                data['items'] = req.list;
                data['roleId'] = tplData.roleId;
                data['page'] = parseInt(data['page'])+1;
                $(_this).closest('li').replaceWith(TPL.render('fmListLi',data));
            })
        })
        /*更多动态*/
        .on('click','.js-more-active',function(){
            var data = $(this).data();
            ajax('getUserDynamic',data,function(req){
                data['page'] = parseInt(data['page'])+1;
                $('#mn').html($.templates['myActive'].render({activeList:req.list,page:2}));
            })
        })
        /*评分功能*/
        .on('click','.js-level-click span',function(){
            var index = $(this).index();
            $('.js-level-click span').each(function(i,v){
                if(i<index)$(v).removeClass('icon-xingjiline').addClass('icon-xingji');
                else $(v).removeClass('icon-xingji').addClass('icon-xingjiline');
            })
            $('#score').val(index);
            //console.log(index);
        })
});



