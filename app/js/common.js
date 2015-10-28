/**
 * Created by wangyong on 14-9-24.
 */
;$(function(){
    window.router = Router(routes).configure({ recurse: 'forward' });
    router.init();
    location.hash.length>0 || (location.hash = '/bm/fm/index');

    //window['params']['uid'] = 32844;
    $(window).scroll(function(){
        if($(window).scrollTop()<170)
            $('#mn').addClass('top');
        else
            $('#mn').removeClass('top');
        //console.log(['scroll',$(window).scrollTop()]);
    });
    $('#mn')
        .on('click','.js-more-comment',function(){
            var _this = this;
            ajax('getCommentList',{uid:params['uid'],page:$(this).data('page'),paperId:$(this).data('id'),cType:3},function(req){
                var data = {};
                data['commentList'] = req.list;
                for(var i=0;i<data['commentList'].length;i++)
                    data['commentList'][i].time = data['commentList'][i].time.split(' ')[0];
                data['commentPage'] = parseInt($(_this).data('page'))+1;
                $(_this).closest('li').replaceWith($.templates['commentLi'].render(data));
                //$('#mn').html($.templates['fmPlayer'].render(data));
            })
        })
        .on('click','.js-more-music',function(){
            var data = $(this).data();
            var _this = this;
            data['professiorId'] = data['professiorid'];
            ajax('getMusic',$(this).data(),function(req){
                //var data = {};
                data['musicList'] = req.list;
                data['musicPage'] = parseInt(data['page'])+1;
                $(_this).closest('li').replaceWith($.templates['fmListLi'].render(data));
            })
        })
        .on('click','.js-more-active',function(){
            var data = $(this).data();
            data['uid'] = params['uid'];
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
            console.log(index);
        })
});
var debug = false;
function ajax(url,data,callback,errorback){
    errorback = errorback || function(req){alert(req['errorMsg'])};
    var remoteUrl = '';
    if(debug)
        remoteUrl = './test/'+url+'.json';
    else
        remoteUrl = "http://gzbmind.oicp.net:81/BmindAPI/Page/"+url+'.action'
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
            errorback({errorMsg:'网络通讯错误，请确定网络是否稳定'+url});
        }
    })
}