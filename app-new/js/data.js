var tplData = {
    bmList:{
        list:[
            {url:'#/bm/fm/index',title:'情绪调频首页',rule:'#/bm/fm/index',args:'无'},
            {url:'#/bm/fm/player/131',title:'音乐播放',rule:'#/bm/fm/player/:musicId',args:'musicId:音频编号'},
            {url:'#/bm/fm/professor/9097',title:'主播的音频列表',rule:'#/bm/fm/professor/:professorId',args:'professorId:主播编号'},
            {url:'#/bm/fm/category/1/5',title:'按类型检索的音频列表',rule:'#/bm/fm/category/:property/:type',args:'property:0->不区分/1->音频/2->轻音乐,type:音频类型'},
            {url:'#/bm/list',title:'情绪调频搜索[暂未开发]',rule:'#/bm/fm/search',args:'无'},
            {url:'#/bm/list',title:'情绪调频搜索结果[暂未开发]',rule:'#/bm/fm/search/:keyword',args:'无'},
            {url:'#/bm/comment/list/3/131',title:'评论列表',rule:'#/bm/comment/list/:cType/:paperId',args:'cType:页面类型;paperId:页面对象ID'},
            {url:'#/bm/comment/edit/3/131',title:'评论编辑界面',rule:'#/bm/comment/edit/:cType/:paperId',args:'cType:页面类型;paperId:页面对象ID'},
            {url:'#/bm/my/active',title:'我的动态',rule:'#/bm/my/active',args:'无'},
            {url:'#/bm/my/group/1',title:'活动圈',rule:'#/bm/my/group/:typeId',args:'typeId:活动圈类型ID'},
            {url:'#/bm/list',title:'[未完待续]',rule:'#/bm/xxx',args:'无'}
        ]
    }
}