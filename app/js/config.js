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
            console.log('bm');
        },
        '/fm': {
            '/index': function () {
                render('fmIndex');
                ajax('getMusic.action',{type:0,page:1,property:0},function(req){
                    var data = {
                        ar5:[1,2,3,4,5]
                    };
                    data['list'] = req.list;
                    //data.list.splice(2);
                    //console.log($.templates['fmList'].render(data));
                    $('#fm_hot').html($.templates['fmList'].render(data));
                });

            },
            '/player/:id': function (id) {
                //render('fmPlayer');
                ajax('getMusic.action',{type:0,page:1,property:0,mid:id},function(req){
                    console.log(req);
                    $('#mn').html($.templates['fmPlayer'].render(req.list[0]));
                    //render('fmPlayer',req.list[0]);
                })

            },
            '/author/:id': function (id) {
                ajax('getMusic.action',{type:0,page:1,property:0,professiorId:id},function(req){
                    $('#mn').html($.templates['fmAuthor'].render({list:req.list}));
                })
                //render('fmAuthor');
            },
            '/category/:id': function (id) {
                ajax('getMusic.action',{type:id,page:1,property:0},function(req){
                    $('#mn').html($.templates['fmCategory'].render({list:req.list}));
                })
                //render('fmCategory');
            },
            '/search': function () {
                render('fmSearch');
            }
        },
        '/comment': {
            '/list/:id': function (id) {
                render('comment');
            },
            '/edit': function () {
                render('commentEdit');
            }
        },
        '/my':{
            '/active':function(){//¶¯Ì¬
                render('myActive');
            },
            '/group':function(){//»î¶¯È¦
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

