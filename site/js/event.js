/**
 * Created by setin on 2016/5/22.
 */
$(function(){
    var marqueeObj =$('.marquee');
    marqueeObj.css('margin-top',0);
    window['marqueeTimer'] = setInterval(function(){
        //return false;
        marqueeObj.each(function(i,v){
            //console.log(v);
            var top = parseFloat(v.style.marginTop);
            console.log(top);


            $(v).animate({
                'margin-top':(top-80)+'px'
            },600,function(){
                if(parseInt($(v).height())-160<-top){
                    top = 60;
                    $(v).css('margin-top','60px').animate({
                        'margin-top':0
                    });
                }
            })
        });

    },7000);
    var sliderStop = false;
    var sliderCur = 0;
    var sliderCount = $('.slider .cnt a').length;
    var spanStr = '';
    for(var i=0;i<sliderCount;i++)
        if(i==0)spanStr += '<span class="cur"></span>';
        else spanStr += '<span></span>'
    $('.slider .ctrl').append(spanStr);
    window['timer'] = setInterval(function(){
        if(sliderStop) return;
        sliderCur --;
        if(sliderCur<=-sliderCount) sliderCur =0;
        $('.slider .cnt').animate({
            textIndent:sliderCur +'00%'
        },1000,function(){
            $('.slider .ctrl span:eq('+(-sliderCur)+')').addClass('cur').siblings().removeClass('cur');
            //$('.slider').css('text-indent',0).append($('.slider a:eq(0)'));
        });
    },5000);
    window['serviceTimer'] = setTimeout(function(){
        $('.center-bar').show();
    },5000);
    $('body')
        .on('click','.slider .ctrl span',function(){
            sliderCur = -$(this).index();
            $('.slider .cnt').animate({
                textIndent:sliderCur +'00%'
            },1000,function(){
                $('.slider .ctrl span:eq('+(-sliderCur)+')').addClass('cur').siblings().removeClass('cur');
                //$('.slider').css('text-indent',0).append($('.slider a:eq(0)'));
            });
        })
        .on('mouseenter','.slider',function(){
            sliderStop = true;
        })
        .on('mouseleave','.slider',function(){
            sliderStop = false;
        })
        .on('click','.ask-btn',function(){
            $('.center-bar').show();
        })
        .on('click','.nav a',function(){
            $(this).addClass('cur').siblings().removeClass('cur');
            $('#index,#question,#eap,#about').hide();
            switch($(this).index()){
                case 0:$('#index').show();break;
                case 1:$('#eap').show();break;
                case 2:$('#question').show();break;
                case 3:$('#about').show();break;
            }
        })
        .on('click','.center-bar .close',function(){
            $('.center-bar').hide();
        })
        .on('mouseenter','.example .tabs span',function(){
            $(this).addClass('cur').siblings('span').removeClass('cur');
            $('.example .tabs p,.example .tabs ul').hide();
            if($(this).index()!=0) $('.example .tabs p').show();
            else $('.example .tabs ul').show();
            console.log($(this).index())
        })
        .on('mouseenter','.team li',function(){
            $(this).addClass('cur').siblings().removeClass('cur');
        })
        .on('mouseenter','.team .tab span',function(){
            $(this).addClass('cur').siblings().removeClass('cur');
            $('.team ul:eq('+$(this).index()+')').show().siblings('ul').hide()
        })
        .on('mouseenter','.program .list-1 li,.program .list-2 li',function(){
            $('.program li').removeClass('cur');
            var c = $(this).attr("class");
            var p = $(this).parent().attr('class');
            var cur = (p=='list-1'?'t1':'t2')+'-'+c;
            console.log(cur);
            $('.program .cnt li').hide();
            $('.program .cnt .'+cur).fadeIn();
            var that = this;
            $(this).addClass('cur').find('span').animate({
                transform:'scale(1.1)'
            },500,function(){
                $(that).find('span').animate({
                    transform:'scale(1)'
                },500)
            });
            //$(this).addClass('cur').siblings().removeClass('cur');
        })
});

