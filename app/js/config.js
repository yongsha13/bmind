/**
 * Created by wangyong on 14-9-26.
 */


;function render(name){
    $('#mn').html($.templates[name].render(tplData[name]));
}

;var routes = {
    '/bm': {
        on: function () {
            $('#mn>div').hide();
            window.scrollTo(0, 0);
            $('#mn').addClass('top');
            //console.log('bm');
            window['isPlayerUI'] = false;
        },
        '/list':function(){
            render('bmList');
        },
        '/fm': {
            '/index': function () {
                render('fmIndex');
                ajax('getMusic',{type:0,page:1,property:0},function(req){
                    var data = {};
                    data['musicList'] = req.list;
                    data['musicPage'] = 2;
                    data['type'] = 0;
                    data['property'] = 0;

                    $('#fm_hot').html($.templates['fmList'].render(data));
                });

            },
            '/player/:id': function (id) {
                window['isPlayerUI'] = true;
                var data = {};
                ajax('getMusic',{type:0,page:1,property:0,mid:id},function(req){
                    //console.log(req);

                    data = req.list[0];
                    ajax('getCommentList',{uid:params['uid'],page:1,paperId:id,cType:3},function(req){
                        //console.log(req);
                        data['commentList'] = req.list;
                        for(var i=0;i<data['commentList'].length;i++)
                            data['commentList'][i].time = data['commentList'][i].time.split(' ')[0];
                        data['commentPage'] = 2;
                        $('#mn').html($.templates['fmPlayer'].render(data));
                    })
                })

            },
            '/professor/:id': function (id) {
                ajax('getMusic',{type:0,page:1,property:0,professiorId:id},function(req){
                    $('#mn').html($.templates['fmAuthor'].render({musicList:req.list,professiorId:id,type:0,property:0,musicPage:2}));
                })
                //render('fmAuthor');
            },
            '/category/:property/:type': function (property,type) {
                ajax('getMusic',{type:type,page:1,property:property},function(req){
                    $('#mn').html($.templates['fmCategory'].render({musicList:req.list,type:type,property:property,musicPage:2}));
                })
                //render('fmCategory');
            },
            '/search': function () {
                render('fmSearch');
            }
        },
        '/comment': {
            '/list/:id': function (id) {
                var data = {};
                ajax('getMusic',{type:0,page:1,property:0,mid:id},function(req){
                    //console.log(req);

                    data = req.list[0];
                    ajax('getCommentList',{uid:params['uid'],page:1,paperId:id,cType:3},function(req){
                        //console.log(req);
                        data['commentList'] = req.list;
                        for(var i=0;i<data['commentList'].length;i++)
                            data['commentList'][i].time = data['commentList'][i].time.split(' ')[0];
                        $('#mn').html($.templates['comment'].render(data));
                    })
                })
            },
            '/edit': function () {
                render('commentEdit');
            }
        },
        '/my':{
            '/active':function(){//动态
                ajax('getUserDynamic',{uid:params['uid'],page:1},function(req){
                    $('#mn').html($.templates['myActive'].render({activeList:req.list,page:2}));
                });
            },
            '/group':function(){//圈子
                render('myGroup');
            },
            '/test':function(){
                render('myTest');
            },
            '/music':function(){
                render('myMusic');
            },
            '/plan':function(){
                render('myPlan');
            }
        },
        '/tt':{
            '/index':function(){
                render('ttIndex');
            },
            '/list':function(){
                render('ttList');
            }
        }
    }
};

