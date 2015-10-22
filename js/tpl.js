/**
 * Created by wangyong on 2015/7/9.
 */
$.views.helpers({
    "debug":function(str){
        console.log(str);
    }
});
var TPL = {
    header:'<h1>{{:title}}</h1>',
    fmIndex:
        '<div class="fm">\
        {{include tmpl="fmBanner"/}}\
        <h2>热门</h2>\
        {{include tmpl="fmList"/}}\
        </div>',
    fmBanner:
        '<div class="banner">\
            <div class="bg"></div>\
            <div class="cnt">\
            <div class="btn-1">\
            <a href="javascript:;"><span class="icon-bofangqibofang iconfont"></span></a>\
            \
            </div>\
            <a href="javascript:;">好好睡</a>\
            <a href="javascript:;">放轻松</a>\
            <a href="javascript:;">爱自己</a>\
            <a href="javascript:;">更多</a>\
            </div>\
        </div>',
    fmList:
        '<ul class="list">\
        {{include tmpl="fmListLi"/}}\
        {{include tmpl="fmListLi"/}}\
        {{include tmpl="fmListLi"/}}\
        </ul>',
    fmListLi:
        '<li class="vip">\
            <div class="avatar">\
                <a href="#/bm/fm/author/1"><img src="./images/avatar-1.jpg" alt=""></a>\
            </div>\
            <div class="cnt">\
                <h3><a href="#/bm/fm/player/1">观正念的力量</a><a href="#/bm/fm/author/1"><em>主播：安安</em></a></h3>\
                <span class="category"><a href="#/bm/fm/category/1">好好睡</a></span>\
            </div>\
            <div class="icons">\
                {{include tmpl="fmListLiLevel"/}}\
                <span class="comment">\
                    | <span class="icon-pinglun iconfont"></span>\
                    7777\
                </span>\
                <span class="like">\
                    | <span class="icon-xihuan iconfont"></span>\
                    47\
                </span>\
            </div>\
        </li>',
    fmListLiLevel:
        '<span class="level">\
            <span class="icon-xingji iconfont"></span>\
            <span class="icon-xingji iconfont"></span>\
            <span class="icon-xingji iconfont"></span>\
            <span class="icon-xingjiban iconfont"></span>\
            <span class="icon-xingjiline iconfont"></span>\
            3.7\
        </span>',
    fmPlayer:
        '<div class="fm">\
            <div class="player">\
                <img src="./images/pic-1.jpg" alt="">\
                <div class="player-ctrl">\
                    <div class="progress">\
                        <span class="cur"></span>\
                    </div>\
                    <div class="time">\
                        <span class="now">00:08:32</span>\
                        <span class="count">00:22:32</span>\
                    </div>\
                    <div class="btns">\
                        <a href="javascript:;">\
                            <span class="icon-xiazai iconfont none"></span>\
                            <br><em>下载</em>\
                        </a>\
                        <a href="javascript:;">\
                            <span class="icon-shangyishou iconfont"></span>\
                        </a>\
                        <a class="cur" href="javascript:;">\
                            <span class="icon-zanting iconfont cur"></span>\
                        </a>\
                        <a href="javascript:;">\
                            <span class="icon-xiayishou iconfont"></span>\
                        </a>\
                        <a href="javascript:;">\
                            <span class="icon-fenxiang iconfont none"></span>\
                            <br><em>分享</em>\
                        </a>\
                    </div>\
                    <div class="status">正在下载音频</div>\
                </div>\
                {{include tmpl="article"/}}\
                <ul class="comment">\
                    {{include tmpl="commentLi"/}}\
                    {{include tmpl="commentLi"/}}\
                </ul>\
                <a href="#/bm/comment/list/1" class="more">展开更多</a>\
            </div>\
        </div>',
    fmAuthor:
        '<div class="fm">{{include tmpl="fmList"/}}</div>',
    fmCategory:
        '<div class="fm">\
            <div class="tabs col-2">\
                <div class="ti">\
                    <span class="cur">音频</span>\
                    <span>轻音乐</span>\
                </div>\
            </div>\
            {{include tmpl="fmList"/}}\
        </div>',
    fmSearch:
        '<div class="fm">\
            <div class="search-bar">\
                <a href="javascript:;">确定</a>\
                <input type="search">\
            </div>\
            {{include tmpl="fmList"/}}\
        </div>',
    article:
        '<div class="article">\
            <div class="icons">\
                <div class="level">\
                    {{include tmpl="fmListLiLevel"/}}\
                </div>\
            </div>\
            <article>\
                <h1>观正念的力量 - 内观呼吸法</h1>\
                <h2><a href="#/bm/fm/author/1">主播：安安</a></h2>\
                <p>根据项目进程和乙方要求，及时、全面、客观、合法地提供乙方为实施本项目所必需的有关文件、资料、信息...</p>\
                <div class="ctrl">\
                    <a href="#/bm/comment/edit"><span class="icon-pinglun1 iconfont"></span><br><em>评论</em></a>\
                </div>\
            </article>\
        </div>',
    commentLi:
        '<li>\
            <div class="info">\
                <span class="author">头发自然卷</span>\
                <span class="time"><span class="icon-shijian iconfont"></span> 2015-07-01</span>\
            </div>\
            <p>生活不易，且行且珍惜</p>\
        </li>',
    comment:
        '<ul class="comment">\
            {{include tmpl="article"/}}\
            {{include tmpl="commentLi"/}}\
            {{include tmpl="commentLi"/}}\
            {{include tmpl="commentLi"/}}\
            {{include tmpl="commentLi"/}}\
        </ul>',
    commentEdit:
        '<div class="comment">\
            <div class="level-ctrl">\
                <label>星级评分</label>\
                <span class="icon-xingji iconfont"></span>\
                <span class="icon-xingji iconfont"></span>\
                <span class="icon-xingji iconfont"></span>\
                <span class="icon-xingjiline iconfont"></span>\
                <span class="icon-xingjiline iconfont"></span>\
            </div>\
            <textarea name="" id="" placeholder="说几句评价吧"></textarea>\
        </div>',
    myActive:
        '<div class="my">\
            <ul class="active">\
            {{include tmpl="myActiveLi"/}}\
            {{include tmpl="myActiveLi"/}}\
            {{include tmpl="myActiveLi"/}}\
            </ul>\
        </div>',
    myActiveLi:
        '<li>\
            <div class="info">\
                <span class="avatar"><img src="./images/avatar-1.jpg" alt=""></span>\
                <span class="author">衣角上的人</span>\
                <span class="time">2分钟前</span>\
                <span class="status">评论</span>\
            </div>\
            <p>对乙方提供的有关建议和方案，应及时反馈意见和做出决策。</p>\
        </li>',
    myTest:
        '<div class="my">\
            <ul class="my-test">\
            {{include tmpl="myTestLi"/}}\
            {{include tmpl="myTestLi"/}}\
            {{include tmpl="myTestLi"/}}\
            </ul>\
        </div>',
    myTestLi:
        '<li>\
            <div class="avatar">\
                <img src="./images/avatar-1.jpg" alt="">\
            </div>\
            <div class="cnt">\
                <span class="category">专业测试</span>\
                <h3>观正念的力量</h3>\
            </div>\
            <div class="icons">\
                <span class="comment"><span class="icon-pinglun iconfont"></span>47</span>\
                <span class="space">|</span>\
                <span class="like"><span class="icon-xihuan iconfont"></span>7777</span>\
            </div>\
        </li>',
    myMusic:
        '<div class="my">\
            {{include tmpl="fmList"/}}\
        </div>',
    myGroup:
        '<div class="my">\
            <div class="tabs col-3">\
                <div class="ti">\
                    <span class="cur">线下活动资讯</span>\
                    <span>线上活动招募令</span>\
                    <span>更多即将开放</span>\
                </div>\
                <ul class="group">\
                    {{include tmpl="myGroupLi"/}}\
                    {{include tmpl="myGroupLi"/}}\
                    {{include tmpl="myGroupLi"/}}\
                </ul>\
            </div>\
        </div>',
    myGroupLi:
        '<li>\
            <h4>小e播报</h4>\
            <h3>亲子沟通训练营</h3>\
            <p>为期一个月的时间让孩子和家长沟通没有障碍。</p>\
            <div class="icons">\
                <span class="like"><span class="icon-xihuan iconfont"></span>7777</span>\
                <span class="time"><span class="icon-shijian iconfont"></span>4分钟</span>\
            </div>\
        </li>',
    myPlan:
        '<div class="my">\
            {{include tmpl="myPlanLi"/}}\
            {{include tmpl="myPlanLi"/}}\
            {{include tmpl="myPlanLi"/}}\
        </div>',
    myPlanLi:
        '<div class="plan">\
            <h3>不迷茫的生活是一种怎样的体验</h3>\
            <div class="progress">\
                <span class="cur"></span>\
            </div>\
            <div class="info">\
                完成1/7<span class="percent">14%</span>\
            </div>\
            <div class="icons">\
                <span class="comment"><span class="icon-pinglun iconfont"></span>7777</span>\
                <span class="space"></span>\
                <span class="like"><span class="icon-xihuan iconfont"></span>47</span>\
            </div>\
            <ul class="comment">\
            {{include tmpl="commentLi"/}}\
            {{include tmpl="commentLi"/}}\
            {{include tmpl="commentLi"/}}\
            </ul>\
        </div>'
};
$.templates(TPL);