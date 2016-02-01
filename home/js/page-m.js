/**
 * Created by setin on 2016/1/12.
 */
$(function(){
    slidePic.init();
    $(window).resize(function(){
        slidePic.getWidth();
    });
});

var slidePic = {
    picContainer:null,
    posContainer:null,
    width:0,
    stepTime:5000,
    cur:0,
    pause:false,
    init:function(){
        this.picContainer = $('.slide-box');
        this.posContainer = $('.slide-box').next('.pos');
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
                slidePic.cur++;
                slidePic.posContainer.find('span:eq('+(slidePic.cur%4)+')').addClass('cur').siblings().removeClass('cur');
                slidePic.picContainer.css('text-indent',0).find('a').append(slidePic.picContainer.find('img:eq(0)'));
            })
        },this.stepTime);
    }
}