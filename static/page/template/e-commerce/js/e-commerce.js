$(document).ready(function () {
    $('.more-button-top').hide();
    $('.more-button-bottom').hide();
});
$('#left').on('click',function () {
    var left=parseInt($('#carousel').css('left'));
    if(left>-3642){
        $('#carousel').css('left',left-1214);
    }else{
        $('#carousel').css('left',0);
    }
});
$('#right').on('click',function () {
    var left=parseInt($('#carousel').css('left'));
    if(left<0){
        $('#carousel').css('left',left+1214);
    }else{
        $('#carousel').css('left',-3642);
    }
});
$('.more-item-right-top').on('mouseenter',function () {
   $(this).children('button').show(300);
    $(this).css('padding-left','15px');
});
$('.more-item-right-top').on('mouseleave',function () {
    $(this).children('button').hide(300);
    $(this).css('padding-left','10px');
});
$('.more-item-right-bottom').on('mouseenter',function () {
    $(this).children('button').show(300);
    $(this).css('padding-left','15px');
});
$('.more-item-right-bottom').on('mouseleave',function () {
    $(this).children('button').hide(300);
    $(this).css('padding-left','10px');
});
$('.menu-item').on('mouseenter',function () {
   $(this).addClass('menu-item-active').siblings().removeClass('menu-item-active')
});
$('.u-panel-body').on('mouseenter',function () {
    $(this).css('left','5px');
});
$('.u-panel-body').on('mouseleave',function () {
    $(this).css('left','0');
});
$('.table-tr').on('mouseenter',function () {
    $(this).find('button').addClass('u-button-danger');
});
$('.table-tr').on('mouseleave',function () {
    $(this).find('button').removeClass('u-button-danger');
});