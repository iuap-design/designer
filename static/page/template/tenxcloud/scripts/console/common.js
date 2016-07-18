function setCookie(c_name, value, expiredays){
  if (getCookie(c_name) && getCookie(c_name) == value) {
    return;
  }
  // console.log('getCookie:' + c_name + '|' + getCookie(c_name));
  c_name = _getCookieName(c_name);
  // console.log('setCookie:' + c_name + '|' + value);
  expiredays = expiredays ? expiredays : 1;
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie= c_name + "=" + escape(value) + ((expiredays==null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/";
}
// get cookie
function getCookie(c_name){
  c_name = _getCookieName(c_name);
  if (document.cookie.length > 0) {
    c_start = document.cookie.indexOf(c_name + "=");
    if (c_start !== -1) {
      c_start = c_start + c_name.length + 1;
      c_end = document.cookie.indexOf(";", c_start);
      if (c_end === -1) {
        c_end = document.cookie.length;
      }
      return unescape(document.cookie.substring(c_start, c_end));
    }
  }
  return null;
}
// delete cookie
function delCookie(c_name, value){

  if (c_name !== 'csrftoken') {
    c_name = _getCookieName(c_name);
  }
  var expiredays = -30;
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  if (c_name === 'csrftoken') {
    document.cookie= c_name + "=" + escape(value) + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString()) + ";path=/;domain=.tenxcloud.com";
  } else {
    document.cookie= c_name + "=" + escape(value) + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString()) + ";path=/";
  }

}


// get cookie name
function _getCookieName(c_name){
  var userName = $('.nav-bar .use .nav-t .username').attr('title').trim();
  userName = userName? userName:'normal_user';
  c_name = userName + '_' + c_name;
  return c_name;
}


u.on(window, 'load', function() {
    'use strict';
    $('.foldingpad').click(function() {
    // var https = window.location.search;
    //   https = https.substr(1);
    if($(this).hasClass('rotate')){
      _unfold();//展开
    }else{
      _shrink();
    }
  });

    
    $('.symbol').click(function() {
    if (!$(this).hasClass('action')) {
        $(this).addClass('action');
        $(this).parents('.u-widget-heading').siblings().slideUp();
    } else {
        $(this).removeClass('action');
        $(this).parents('.u-widget-heading').siblings().slideDown();
    }
});

 $('.nav-li').click(function() {
    var self = this;
    $(self).siblings('li').removeClass('item-click').find('.nav-item-list').hide()
    if(!$(self).hasClass('item-click')){
      $(self).addClass('item-click');
      $(self).find('.nav-item-list').show();
    }else{
      $(self).removeClass('item-click')
      $(self).find('.nav-item-list').hide();
    }
});


// 左侧内容
 $(".nav-menu").niceScroll({
    cursorcolor: "#2FA4FC",
    cursorborder: "0px solid #fff",
    cursorborderradius: "0px",
    cursorwidth: "3px"
});

$(".nav-menu").getNiceScroll().resize();
$(".nav-menu").getNiceScroll().show();



// left nav shrink 收缩
  function _shrink(){
    $('.nav-li').addClass('live-hover');
    $('.foldingpad').addClass('rotate');
    // $('.nav-item-list').css('left','-180px');
    $('.page-container').css('margin-left','55px');
    $('.foldingpad').css('left','65px')
    $('.page-sidebar').css('margin-left','-200px');
    $('.page-small-sidebar').css('margin-left','0px');
    $('.global-notice').css('left','90px')
    setCookie('menu','2');
  }
  // left nav unfold 展开
  function _unfold(){
    var https = window.location.pathname;
    setCookie('menu','1');
    $('.nav-li').removeClass('live-hover');
    $('.foldingpad').removeClass('rotate');
    // $('.nav-item-list').css('left','75px');
    $('.page-container').css('margin-left','200px');
    $('.page-sidebar').css('margin-left','0px');
    $('.page-small-sidebar').css('margin-left','-55px');
    $('.global-notice').css('left','235px')
    $('.foldingpad').css('left','210px')
  }
  getCookie('menu') ? getCookie('menu') : setCookie('menu','1');
  var shrinkStatus = getCookie('menu');
  if(shrinkStatus == 1){
    $('.foldingpad').removeClass('rotate');
    $('.page-container').css('margin-left','200px');
    // $('.nav-item-list').css('left','75px');
    // $('.nav-li').removeClass('live-hover');
    $('.page-sidebar').css('margin-left','0px');
    $('.page-small-sidebar').css('margin-left','-55px');
    $('.global-notice').css('left','230px');
    $('.foldingpad').css('left','210px')
  }else{
    $('.foldingpad').addClass('rotate');
    $('.page-container').css('margin-left','55px');
    // $('.nav-item-list').css('left','-180px');
    // $('.nav-li').addClass('live-hover');
    $('.page-sidebar').css('margin-left','-200px');
    $('.page-small-sidebar').css('margin-left','0px');
    $('.global-notice').css('left','90px')
    $('.foldingpad').css('left','65px')
  }

});