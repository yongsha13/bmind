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
            },
            '/player/:id': function (id) {
                render('fmPlayer');
            },
            '/author/:id': function (id) {
                render('fmAuthor');
            },
            '/category/:id': function (id) {
                render('fmCategory');
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
    }
};

