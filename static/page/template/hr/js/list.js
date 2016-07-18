$(document).ready(function () {
    $('#menu').css('height',$(window).height());
    $('li.menu-item>a').click(function (e) {
        var $ul=$(this).next();
        if($ul.css('display')=='block'){
            $(this).next().hide(300);
            $(this).children('i').removeClass('fa fa-angle-down').addClass('fa fa-angle-right');
        }else{
            $(this).next().show(300).parent().siblings().children("ul").hide(300);
            $(this).children('i').removeClass('fa fa-angle-right').addClass('fa fa-angle-down');
        }
        e=e||window.event;
        e.stopPropagation();
        return false;
    });
    $('ul.menu-second a').click(function (e) {
        var $ul=$(this).next();
        if($ul.css('display')=='block'){
            $(this).next().hide(300);
            $(this).children('i').removeClass('fa fa-angle-down').addClass('fa fa-angle-right');
        }else{
            $(this).next().show(300).parent().siblings().children("ul").hide(300);
            $(this).children('i').removeClass('fa fa-angle-right').addClass('fa fa-angle-down');
        }
        e=e||window.event;
        e.stopPropagation();
        return false;
    });
    $('#searchHead').hide();
    $('#message').hide();
    $('#info').hide();
  $('#more').hide();
  $('#headList').hide();
});
$('#high').on('click',function () {
    var $more=$('#more');
    if($more.is(':hidden')){
        $more.show(300);
    }else{
        $more.hide(300);
    }
});
$('#searchId').on('click',function () {
    $('#searchHead').show(300);
});
$('#searchClose').on('click',function () {
    $('#searchHead').hide(300);
});
$('#nav-menu').on('click',function () {
    var $menu=$('#menu');
    var $menuWidth=$menu.width();
    if($menuWidth){
        document.getElementById('icon').className='fa fa-bars';
        $menu.addClass('menu-close');
    }else{
        document.getElementById('icon').className='fa fa-arrow-left';
        $menu.removeClass('menu-close');
    }
});
$('#bell').on('click',function () {
    var $message=$('#message');
    if($message.is(':hidden')){
        $('#message').show(300);
        $('#info').hide();
    }else{
        $('#message').hide(300);
    }
});
$('#headBtn').on('click',function () {
    var $headList=$('#headList');
    if($headList.is(':hidden')){
        $headList.show(300);
    }else{
        $headList.hide(300);
    }
});
$('#set').on('click',function () {
    var $info=$('#info');
    if($info.is(':hidden')){
        $('#info').show(300);
        $('#message').hide();
        $('#headList').hide();
    }else{
        $('#info').hide(300);
    }
});
