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
function bmCallback(req){
    $('.js-api-output').html(function(i,v){return v+'<br>回调：'+JSON.stringify(req)});
}
TPL.addFilter('date',function(source,useExtra){
    //console.log(source);
    return source.split(' ')[0];
});
TPL.addFilter('url',function(source,useExtra){
   return source || 'javascript:;';
});
var debug = false;
$(function(){
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
                console.log(req);
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
            var btnStr =
                cur >= cache.test.questions.length?
                    '<a class="btn red" href="#/bm/tt/result/'+cache.test.scaleRecordID+'">查看结果</a>':
                    '<a class="btn red" href="#/bm/tt/question/'+(cur+1)+'">下一题</a>'
            $('.js-questions-next').replaceWith(btnStr);
            ajax('saveOptionsRecord',{
                scaleRecordID:cache.test.scaleRecordID,
                questionID:questionID,
                optionsID:optionID
            },function(){});
            //console.log(questionID,optionID);
        })
        .on('click','.js-api-submit',function(){
            window['apiIndex']?window['apiIndex']++:(window['apiIndex'] = 1);
            if(window['bm']){
                var apiId = $('#js-api-id').val();
                var apiIndex = window['apiIndex'];
                var apiArgs = $('#js-api-args').val();
                $('.js-api-output').html('执行：window.bm.api('+apiId+','+apiIndex+',"'+apiArgs+'");<br>等待接口回调...');
                window.bm.api(apiId,apiIndex,apiArgs);
            }else{
                $('.js-api-output').html('没有找到 window.bm 对象，请确定接口是否已经初始化！[浏览器下无bm对象]');
            }
        })
        /*.on('click','.js-test',function(){
            cache.test.cur = $(this).data('id');
            location.hash = '/bm/tt/scale/'+cache.test.cur;
        })*/
        .on('click','.js-more-test',function(){
            var _this = this;
            var data = $(this).data();
            ajax('getScaleList',data,function(req){
                data['items'] = req.list;
                data['page'] = parseInt(data['page']) +1;
                $(_this).closest('li').replaceWith(TPL.render('ttListLi',data));
            });
        })
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
        .on('click','.js-more-music',function(){
            var data = $(this).data();
            var _this = this;
            data['professiorId'] = data['professiorid'];
            ajax('getMusic',$(this).data(),function(req){
                //var data = {};
                data['items'] = req.list;
                data['page'] = parseInt(data['page'])+1;
                $(_this).closest('li').replaceWith(TPL.render('fmListLi',data));
            })
        })
        .on('click','.js-more-active',function(){
            var data = $(this).data();
            ajax('getUserDynamic',data,function(req){
                data['page'] = parseInt(data['page'])+1;
                $('#mn').html($.templates['myActive'].render({activeList:req.list,page:2}));
            })
        })
        .on('click','.js-level-click span',function(){
            var index = $(this).index();
            $('.js-level-click span').removeClass('icon-xingji').addClass('icon-xingjiline');
            $('.js-level-click span:lt('+index+')').removeClass('icon-xingjiline').addClass('icon-xingji')
                /*.siblings('span').removeClass('icon-xingji').addClass('icon-xingjiline');*/
            $('#score').val(index);
            console.log(index);
        })
});

function ajax(url,data,callback,errorback){
    errorback = errorback || function(req){alert(req['msg'])};
    var remoteUrl = '';
    if(debug)
        remoteUrl = './test/'+url+'.json';
    else
        remoteUrl = "http://gzbmind.oicp.net:81/BmindAPI/Page/"+url+'.action';
    data['uid'] = params['uid'];
    $.ajax({
        url:remoteUrl,
        type:'POST',
        dataType:'JSON',
        data:data,
        success:function(req){
            console.log(req);
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
        cache.test.questions = req.list;
        cache.test.questions.concat(req.list);
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