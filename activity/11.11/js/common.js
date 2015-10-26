/**
 * Created by wangyong on 2015/10/26.
 */
var name = '';
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
$(function(){
    if(params['name']){
        var key = 0;
        for(var i=0;i < params['name'].length;i++)
            key+=(params['name'].charCodeAt(i).toString(10)).slice(-4)*(i+1);
        index = key%10;
        $('.js-score').html(day[index]);
        $('.js-cnt').html(text[index]);
        $('.js-name').html(params['name'].replace('>','&gt;').replace('<','&lt;'));
        $('#index').hide();
        $('#day').show();
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
        name = val;
        var key = 0;
        for(var i=0;i < val.length;i++)
            key+=(val.charCodeAt(i).toString(10)).slice(-4)*(i+1);
        index = key%10;
        console.log(index);
        $('.js-score').html(day[index]);
        $('.js-cnt').html(text[index]);
        $('.js-name').html(name.replace('>','&gt;').replace('<','&lt;'));
        $('#index').hide();
        $('#day').show();
    })
        .on('click','.js-share',function(){
            $('.tips').show()
        })
        .on('click','.js-index',function(){
            name = '';
            $('.js-input').val('');
            $('#day').hide();
            $('#index').show();
        })
});