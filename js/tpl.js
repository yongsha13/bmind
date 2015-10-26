/**
 * Created by wangyong on 2015/7/9.
 */
/**
 * 模板语法
 * {{: ...}}输出变量
 * {{> ...}}encode输出变量
 * {{include tmpl=... /}}引用子模板
 * {{for ...}}对象遍历循环
 * {{>key}}:{{>prop}}键值对输出
 * {{if ...}} ... {{else ...}} ... {{else}} ... {{/if}} 条件语句
 * {{!-- ... --}} 注释
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
            <div class="hot">\
                <h2>热门</h2>\
                <ul id="fm_hot" class="list">\
                    <li class="tips">正在加载...</li>\
                </ul>\
            </div>\
        </div>',
    fmBanner:
        '<div class="banner">\
            <div class="bg"></div>\
            <div class="cnt">\
            <div class="btn-1">\
                <a href="javascript:;"><span class="icon-bofangqibofang iconfont"></span></a>\
                <a href="javascript:;" class="random">换一首</a>\
            </div>\
            <div class="btn-2">\
                <a href="javascript:;"><img src="./images/icon-1.png" alt="">好好睡</a>\
                <a href="javascript:;"><img src="./images/icon-2.png" alt="">放轻松</a>\
                <a href="javascript:;"><img src="./images/icon-3.png" alt="">爱自己</a>\
                <a href="javascript:;"><img src="./images/icon-4.png" alt="">更多</a>\
            </div>\
            </div>\
        </div>',
    fmList:
        '<ul class="list">\
        {{for list tmpl="fmListLi"/}}\
        </ul>',
    fmListLi:
        '<li{{if isMember}} class="vip"{{/if}}>\
            <div class="avatar">\
                <a href="#/bm/fm/author/{{:professorId}}"><img src="./images/avatar-1.jpg" alt=""></a>\
            </div>\
            <div class="cnt">\
                <h3><a href="#/bm/fm/player/{{:id}}">{{:title}}</a><a href="#/bm/fm/author/{{:professorId}}"><em>主播：{{:professor}}</em></a></h3>\
                <span class="category"><a href="#/bm/fm/category/{{:type}}">{{:musicTypeName}}</a></span>\
            </div>\
            <div class="icons">\
                {{include tmpl="fmListLiLevel"/}}\
                <span class="comment">\
                    | <span class="icon-pinglun iconfont"></span>\
                    {{:commentTimes}}\
                </span>\
                <span class="like">\
                    | <span class="icon-xihuan iconfont"></span>\
                    {{:playTimes}}\
                </span>\
            </div>\
        </li>',
    fmListLiLevel:
        '<span class="level">\
            <span class="icon-{{if avg>=1}}xingji{{else avg>=.5}}xingjiban{{else}}xingjiline{{/if}} iconfont"></span>\
            <span class="icon-{{if avg>=2}}xingji{{else avg>=1.5}}xingjiban{{else}}xingjiline{{/if}} iconfont"></span>\
            <span class="icon-{{if avg>=3}}xingji{{else avg>=2.5}}xingjiban{{else}}xingjiline{{/if}} iconfont"></span>\
            <span class="icon-{{if avg>=4}}xingji{{else avg>=3.5}}xingjiban{{else}}xingjiline{{/if}} iconfont"></span>\
            <span class="icon-{{if avg>=5}}xingji{{else avg>=4.5}}xingjiban{{else}}xingjiline{{/if}} iconfont"></span>\
            {{:avg}}\
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
                <h1>{{:title}}</h1>\
                <h2><a href="#/bm/fm/author/{{:professorId}}">主播：{{:professor}}</a></h2>\
                <p>{{:musicDes}}</p>\
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
        '<li class="vip">\
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
        </div>',
    ttIndex:
        '<div class="tt">\
            <div class="index">\
                <img src="./images/pic-1.jpg" alt="">\
                <div class="bar">\
                    <a href="javascript:;">\
                        <img src="./images/icon-1.png" alt="">\
                        趣味测试\
                    </a>\
                    <a href="javascript:;">\
                        <img src="./images/icon-2.png" alt="">\
                        专业测试\
                    </a>\
                </div>\
                <div class="cnt">\
                    <h2>热门</h2>\
                    <ul class="my-test">\
                    {{include tmpl="myTestLi"/}}\
                    {{include tmpl="myTestLi"/}}\
                    {{include tmpl="myTestLi"/}}\
                    </ul>\
                </div>\
            </div>\
        </div>',
    ttList:
        '<div class="tt">\
            <div class="tabs col-3">\
                <div class="ti">\
                    <span class="cur">心理健康</span>\
                    <span>职场相关</span>\
                    <span>更多</span>\
                </div>\
            </div>\
            <ul class="my-test">\
            {{include tmpl="myTestLi"/}}\
            {{include tmpl="myTestLi"/}}\
            {{include tmpl="myTestLi"/}}\
            </ul>\
        </div>'
};
$.templates(TPL);