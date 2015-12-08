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
    $(window).scroll(function(){
        if($(window).scrollTop()<170)
            $('#mn').addClass('top');
        else
            $('#mn').removeClass('top');
        //console.log(['scroll',$(window).scrollTop()]);
    });
    $('#mn')
        /*删除我的音乐*/
        .on('click','.js-my-music-del',function(){
            var _this = this;
            bmApi.api('del-music',{url:$(this).data('url')},function(){
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
        /*咨询师按钮*/
        .on('click','.js-ask',function(){
            bmApi.api('chat',{});
        })
        /*提醒关闭按钮*/
        .on('click','.alert-box .close span',function(){
            $(this).closest('.alert-box').hide();
        })
        /*显示必须为会员提醒*/
        .on('click','.js-show-join',function(){
            if($(this).attr("type")=='music'){
                bmApi.api('location',{text:tplData.tips.memberMusic});
            }
            if($(this).attr("type")=='test'){
                bmApi.api('location',{text:tplData.tips.memberTest});
            }
            //$('#mn').append(TPL.render('alertBox',{}));
        })
        .on('click','.js-tt-share',function(){
            var data = {
                type:1,
                text:$(this).data('txt'),
                sharUrl:$(this).data('share-url')
            };
            bmApi.api('share',data)
        })
        /*分享音频*/
        .on('click','.js-fm-share',function(){
            var id = $(this).closest('.player-ctrl').data('id');
            var music = tplData.getMusic(0,id,function(res){});
            var data = {
                type:2,
                text:'主播：'+music.professor,
                sharUrl:music.shareURL
            }
            bmApi.api('share',data)
        })
        /*下载音频*/
        .on('click','.js-fm-download',function(){//alert('点击下载');
            var id = $(this).closest('.player-ctrl').data('id');
            //alert('获取音频数据：'+id);
            tplData.getMusic(0,id,function(data){
                //alert('重组音频数据：'+JSON.stringify(data));
                data['url'] = data['filePath'];
                //alert('准备下载：'+JSON.stringify(data));
                bmApi.api('download',data,function(res){

                    var status = parseInt(res.data['downloadResult']);
                    status = status?status:3;
                    $('article .cnt').html(JSON.stringify(res)+":"+status);
                    var tips = ['','下载失败','下载完成','正在下载','已经下载'];
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
                    var data = {method:1,url:res.filePath,playId:res.id};
                    //alert('找到上一首：'+JSON.stringify(data));
                    bmApi.api('player',data,function(res){
                        //alert('上一首回调：'+JSON.stringify(res));
                        ajax('addPlayMusicRecord',{musicId:res.id,versionCode:1,userSource:2});
                    });
                    location.hash = '/bm/fm/player/'+data.playId;
                });
            }
            if($(this).hasClass('next')){
                //alert('准备下一首'+id);
                tplData.getMusic(1,id,function(res){
                    var data = {method:1,url:res.filePath,playId:res.id};
                    //alert('找到下一首：'+JSON.stringify(data));
                    bmApi.api('player',data,function(res){
                        //alert('下一首回调：'+JSON.stringify(res));
                        ajax('addPlayMusicRecord',{musicId:res.id,versionCode:1,userSource:2});
                    });
                    location.hash = '/bm/fm/player/'+data.playId;
                });
            }
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
                    ajax('addPlayMusicRecord',{musicId:res.id,versionCode:1,userSource:2});

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
                summary:$('#summary').val(),
                tuId:$('#toId').val(),
                commentID:$('#commentID').val()
            };

            if(!data['score']) delete data['score'];
            if(!data['tuId']) delete data['tuId'];
            if(!data['commentID']) delete data['commentID'];
            ajax('saveComment',data,function(req){
                history.go(-1);
            })
        })
        .on('click','.js-tt-list-tabs',function(){
            if($(this).hasClass('cur')) return;
            var index = $(this).index();
            $(this).addClass('cur').siblings().removeClass('cur');
            $(this).closest('.tabs').find('.cnt').hide().end().find('.cnt:eq('+index+')').show();
        })
        /*心理评测答题*/
        .on('click','.js-questions input',function(){
            var questionID = $(this).data('question-id');
            var optionID = $(this).data('option-id');
            var cur = $(this).data('cur');
            var questions = cache.test.questions;
            for(var i=0;i<questions.length;i++)
                if(questions[i]['questionID'] == questionID)
                    questions[i]['result'] = optionID;
            /*var btnStr =
                cur >= cache.test.questions.length?
                    '<a class="btn red" href="#/bm/tt/result/'+cache.test.scaleRecordID+'">查看结果</a>':
                    '<a class="btn red" href="#/bm/tt/question/'+(cur+1)+'">下一题</a>'
            $('.js-questions-next').replaceWith(btnStr);*/
            ajax('saveOptionsRecord',{
                scaleRecordID:cache.test.scaleRecordID,
                questionID:questionID,
                optionsID:optionID
            },function(){});
            if($(this).data('cur')==questions.length)
                $(this).closest('.question').find('.ctrl').html('<a class="btn red" href="#/bm/tt/result/'+cache.test.scaleRecordID+'">查看结果</a>');
            else
                location.hash = '/bm/tt/question/'+(parseInt($(this).data('cur'))+1);
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
            data['professiorId'] = data['professiorid'];
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

function ajax(url,data,callback,errorback){
    errorback = errorback || function(req){alert(req['msg'])};
    var remoteUrl = '';
    if(debug)
        remoteUrl = './test/'+url+'.json';
    else
        remoteUrl = "/BmindAPINew/Page/"+url+'.action';
    data['uid'] = params['uid'];
    $.ajax({
        url:remoteUrl,
        type:'POST',
        dataType:'JSON',
        data:data,
        success:function(req){
            if(url == 'getMusic'&& !data.mid){//音频缓存
                if(data.page==1) tplData.musicList = req.list;
                else tplData.musicList.concat(req.list);
            }
            if(parseInt(req['result'])==1) callback(req);
            else errorback(req);
        },
        error:function(){
            errorback({msg:'网络通讯错误，请确定网络是否稳定'+url});
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

