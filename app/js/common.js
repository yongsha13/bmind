/**
 * Created by wangyong on 14-9-24.
 */
;$(function(){
    window.router = Router(routes).configure({ recurse: 'forward' });
    router.init();
    location.hash.length>0 || (location.hash = '/bm/fm/index');
    $('#mn').click();
});
var debug = false;
function ajax(url,data,callback,errorback){
    errorback = errorback || function(req){alert(req['errorMsg'])};
    var remoteUrl = '';
    if(debug)
        remoteUrl = './test/'+url+'.json';
    else
        remoteUrl = "http://gzbmind.oicp.net:81/BmindAPI/Page/"+url
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