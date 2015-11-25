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
            {url:'#/bm/my/test',title:'我的测评',rule:'#/bm/my/test',args:'无'},
            {url:'#/bm/my/group/1',title:'活动圈',rule:'#/bm/my/group/:typeId',args:'typeId:活动圈类型ID'},
            {url:'#/bm/tt/index',title:'心理测评',rule:'#/bm/tt/index',args:'无'},
            {url:'#/bm/tt/list/1',title:'心理测评列表',rule:'#/bm/tt/index/:sort',args:'sort:1->专业测试/2->趣味测试'},
            {url:'#/bm/tt/scale/2',title:'量表测评',rule:'#/bm/tt/scale/:scaleID',args:'scaleID:量表ID'},
            {url:'#/bm/tt/result/102',title:'测评结果',rule:'#/bm/tt/result/:scaleRecordID',args:'caleRecordID:测评量表ID'},
            {url:'#/bm/list',title:'[未完待续]',rule:'#/bm/xxx',args:'无'}
        ]
    },
    bmApi:{
        list:[
            {id:1, name:'user-info', title:'获取用户信息'},
            {id:2, name:'login',     title:'登录'},
            {id:3, name:'player',    title:'播放器'},
            {id:4, name:'download',  title:'文件下载'},
            {id:5, name:'chat',      title:'聊天'},
            {id:6, name:'upload',    title:'上传图片'},
            {id:7, name:'share',     title:'分享'},
            {id:8, name:'location',  title:'地理位置'},
            {id:9, name:'title',     title:'标题控制'},
            {id:10,name:'alert',     title:'弹提示消息'}
        ]
    },
    musicList:[],
    getMusic:function(dir,id,fun){
        console.log([dir,id,this.musicList]);
        if(dir==0){
            if(typeof fun=='function')
                fun(this.getMusicPos(id));
            else
                return this.getMusic(id);
            return;
        }
        if(id&&this.musicList.length>0){
            var pos = this.getMusicPos(id);
            if(dir<0 &&pos>0){
                //window.location.hash = '#/bm/fm/player/'+this.musicList[pos-1].id;
                typeof fun=='function' && fun(this.musicList[pos-1]);
            }
            else if(dir>0 && pos<this.musicList.length-1){
                //window.location.hash = '#/bm/fm/player/'+this.musicList[pos+1].id;
                typeof fun=='function' && fun(this.musicList[pos+1]);
            }
            else goRandomMusic();

        }else goRandomMusic();
        function goRandomMusic(){
            this.getRandomMusic(function(res){
                if(dir>0) tplData.musicList.push(res);
                else tplData.musicList.unshift(res);
                //window.location.hash = '#/bm/fm/player/'+res.id;
                typeof fun=='function' && fun(res);
            });

        }
    },
    getRandomMusic:function(callback){
        ajax('getRandomMusic',{},function(res){
            callback(res.music);
            console.log(res);
        });
    },
    getMusicPos:function(id){
        for(var i=0;i<this.musicList.length;i++)
            if(this.musicList[i].id==id) return i;
        return -1;
    }
}