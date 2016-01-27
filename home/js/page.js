/**
 * Created by setin on 2016/1/12.
 */
$(function(){
    slidePic.init();
    scrollPosition.init();
    $(window).resize(function(){
        slidePic.getWidth();
        scrollPosition.getY();
    });
});

var slidePic = {
    picContainer:null,
    width:0,
    stepTime:5000,
    pause:false,
    init:function(){
        this.picContainer = $('.slide-box');
        this.getWidth();
        this.roll();
        this.picContainer
            .on('mouseover',function(){slidePic.pause = true; })
            .on('mouseout', function(){slidePic.pause = false;})
    },
    getWidth:function(){
        this.width = this.picContainer.find('img').width();
    },
    roll:function(){
        setInterval(function(){
            !slidePic.pause && slidePic.picContainer.animate({textIndent:-slidePic.width},1000,function(){
                slidePic.picContainer.css('text-indent',0).find('a').append(slidePic.picContainer.find('img:eq(0)'));
            })
        },this.stepTime);
    }
}
var scrollPosition = {
    ids:['mn','li-1','li-2','li-3','li-4'],
    y:[],
    init:function(){
        this.getY();
        $('.header ul li').on('click',function(){
            var index = $(this).index();
            $(window).scrollTop(scrollPosition.y[index]-80);
            //$(this).addClass('cur').siblings().removeClass('cur');
        })
        $(window).scroll(function(){
            var top = $(window).scrollTop();

            for(var i=scrollPosition.y.length-1;i>=0;i--){
                if(top>=scrollPosition.y[i]-80){
                    $('.header ul li:eq('+i+')').addClass('cur').siblings().removeClass('cur');
                    break;
                }
            }
        })
    },
    getY:function(){
        for(var i=0;i<this.ids.length;i++){
            var offset = $('#'+this.ids[i]).offset();
            this.y[i] = offset.top;
        }
    }
}