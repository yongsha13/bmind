/**
 * Created by setin on 2016/5/22.
 */
$(function(){
    $('body')
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
        .on('mouseover','.example .tabs span',function(){
            $(this).addClass('cur').siblings('span').removeClass('cur');
            $('.example .tabs p,.example .tabs ul').hide();
            if($(this).index()==0) $('.example .tabs p').show();
            else $('.example .tabs ul').show();
            console.log($(this).index())
        })
        .on('mouseover','.team li',function(){
            $(this).addClass('cur').siblings().removeClass('cur');
        })
        .on('mouseover','.team .tab span',function(){
            $(this).addClass('cur').siblings().removeClass('cur');
            $('.team ul:eq('+$(this).index()+')').show().siblings('ul').hide()
        })
        .on('mouseover','.program ul li',function(){
            console.log('on');
            $(this).addClass('cur').siblings().removeClass('cur');
        })
});