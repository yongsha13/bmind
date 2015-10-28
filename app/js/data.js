/**
 * Created by wangyong on 2015/7/9.
 */
var baseUrl='./';
var tplData = {
    fmBanner:{

    },
    fmIndex:{
        banner:this.fmBanner
    },
    bmList:{
        list:[
            {url:'#/bm/fm/index',title:'情绪调频首页',rule:'#/bm/fm/index',args:'无'},
            {url:'#/bm/fm/player/131',title:'音乐播放',rule:'#/bm/fm/player/:musicId',args:'musicId:音频编号'},
            {url:'#/bm/fm/professor/9097',title:'主播的音频列表',rule:'#/bm/fm/professor/:professorId',args:'professorId:主播编号'},
            {url:'#/bm/fm/category/1/5',title:'按类型检索的音频列表',rule:'#/bm/fm/category/:property/:type',args:'property:0->不区分/1->音频/2->轻音乐,type:音频类型'},
            {url:'#/bm/list',title:'情绪调频搜索[暂未开发]',rule:'#/bm/fm/search',args:'无'},
            {url:'#/bm/list',title:'情绪调频搜索结果[暂未开发]',rule:'#/bm/fm/search/:keyword',args:'无'},
            {url:'#/bm/comment/list/131',title:'音频评论列表[地址可能需要修改]',rule:'#/bm/comment/list/:paperId',args:'paperId:页面对象ID'},
            {url:'#/bm/comment/edit',title:'音频评论编辑界面[地址可能需要修改]',rule:'#/bm/comment/edit',args:'无'},
            {url:'#/bm/my/active',title:'我的动态',rule:'#/bm/my/active',args:'无'},
            {url:'#/bm/list',title:'[未完待续]',rule:'#/bm/xxx',args:'无'}
        ]
    }
}

/*
var music = {
    dataSet:[],
    push:function(obj){
        if(!this.getById(obj.id));
        this.dataSet.push(obj);
    },
    getById:function(id,flag){
        for(var i=0;i<this.dataSet.length;i++)
            if(this.dataSet[i].id==id) return this.dataSet[i]
        return false;
    }
}*/
