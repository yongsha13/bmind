/**
 * Created by wangyong on 2015/10/26.
 */
var reg = /name=([^&]*)/.exec(location.href);
var name = reg?reg[1]:'';
name = decodeURIComponent(name);
//params['name'] = decodeURI(params['name']);
/*window['params']['uid'] = 32844;*/
var text = [
    '我感觉到了你脱单的决心在火火燃烧！',
    '我感觉到了你脱单的决心在火火燃烧！',
    '明明约好了要一起在光棍节烧情侣，<br>临战前你却脱离了圣战。',
    '别人在光棍节被虐，<br>你却在光棍节现场表演脱单虐狗。',
    '享受好你人生最后一个光棍节，<br>且过且珍惜。',
    '2015年的光棍节稍纵即逝，<br>且过且珍惜。',
    '年内成功脱单看来无望，<br>2016年新年新气象，好好秀恩爱。',
    '这个测试似乎和你无关，<br>该干嘛干嘛去，洗洗睡。',
    '这个测试似乎和你无关，<br>该干嘛干嘛去，洗洗睡。',
    '这个测试似乎和你无关，<br>该干嘛干嘛去，洗洗睡。'
];
var hasDay = Math.ceil(GetDateDiff(new Date().toString(),'2015/11/11'));
if(hasDay<0) hasDay = 2;
var day = ['1','1',hasDay-1,hasDay,hasDay+1,33,99,'∞','∞','∞'];
var index = 9;
function GetDateDiff(startDate,endDate)
{
    var startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
    var endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
    var dates = Math.abs((startTime - endTime))/(1000*60*60*24);
    return dates;
}
function getDay(name){
    var key = 0;
    for(var i=0;i < name.length;i++)
        key+=(name.charCodeAt(i).toString(10)).slice(-4)*(i+1);
    return key%10;
}

$(function(){
    if(name){
        var key = 0;
        for(var i=0;i < name.length;i++)
            key+=(name.charCodeAt(i).toString(10)).slice(-4)*(i+1);
        index = key%10;
        $('.js-score').html(day[index]);
        $('.js-cnt').html(text[index]);
        $('.js-name').html(name.replace('>','&gt;').replace('<','&lt;'));
        $('#index').hide();
        $('#day').show();
    }
    if (window['wx']) {
        wx.config({
            debug: false,
            appId: params['appId'],
            timestamp: params['timestamp'],
            nonceStr: params['nonceStr'],
            signature: params['signature'],
            jsApiList: ['chooseImage', 'uploadImage', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'hideMenuItems'] // 功能列表，我们要使用JS-SDK的什么功能
        });
        wx.ready(function () {

            wx.checkJsApi({
                jsApiList: [
                    'chooseImage', 'uploadImage', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'hideMenuItems'
                ]
            });

            var shareData = {
                title: '光棍虐狗节马上到！',
                desc: '这里可以让你知道你究竟能不能在光棍节前顺利脱单',
                link: location.href,
                imgUrl: 'http://www.ydeap.com/b-marketing/11-11/' + '/images/banner.jpg'
            };
            //wx.onMenuShareAppMessage(shareData);
            wx.onMenuShareAppMessage({
                title: '光棍虐狗节马上到！',
                desc: '这里可以让你知道你究竟能不能在光棍节前顺利脱单',
                link: location.href,
                imgUrl: 'http://www.ydeap.com/b-marketing/11-11' + '/images/banner.jpg',
                trigger: function (res) {
                    // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                    //alert('用户点击发送给朋友');
                },
                success: function (res) {
                    //alert('已分享');
                },
                cancel: function (res) {
                    //alert('已取消');
                },
                fail: function (res) {
                    //alert(JSON.stringify(res));
                }
            });
            wx.onMenuShareTimeline(shareData);
            // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
            wx.hideMenuItems({
                menuList: [
                    'menuItem:copyUrl',
                    'menuItem:openWithQQBrowser',
                    'menuItem:openWithSafari',
                    'menuItem:share:qq',
                    'menuItem:share:email',
                    'menuItem:originPage'
                ]
            });
            //hide
            //wx.hideAllNonBaseMenuItem();
            //wx.hideOptionMenu();
        });
        wx.error(function (res) {
            alert("error: " + res.errMsg);
        });
    }
    $('#mn').on('click','.js-begin',function(){

        var val = $('.js-input').val();
        if(val.length==0){
            alert('请输入姓名');
            return;
        }
        if(val.length>16){
            alert('名字长度不能大于16个字哦！');
            return;
        }
        index = getDay(val);
        $('.js-score').html(day[index]);
        $('.js-cnt').html(text[index]);
        $('.js-name').html(val.replace('>','&gt;').replace('<','&lt;'));
        $('.js-index').replaceWith('<a href="javascript:;" class="btn js-share">炫耀一把</a>');
        $('#index').hide();
        $('#day').show();
        var shareData = {
            title:  '光棍虐狗节马上到！',
            desc:val + ' 距离脱单还有 '+ index + '天',
            link:'http://www.ydeap.com/b-marketing/11-11/?name='+encodeURIComponent(val),
            imgUrl: 'http://www.ydeap.com/b-marketing/11-11/' + '/images/banner.jpg'
        };
        wx.onMenuShareTimeline(shareData);
        wx.onMenuShareAppMessage(shareData);
    })
        .on('click','.js-share',function(){
            $('.tips').show();
        })
        .on('click','.tips',function(){
            $('.tips').hide();
        })
        .on('click','.js-index',function(){
            name = '';
            $('.js-input').val('');
            $('#day').hide();
            $('#index').show();
        })
});