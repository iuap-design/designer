
function handelImageIcon(icon) {
  var max = 6;
  if (!icon || icon == 'default') {
    return 'https://dn-tenxstore.qbox.me/biao' + Math.floor(Math.random() * max) + '.png';
  } else if (icon.indexOf('https://') < 0) {
    return 'https://dn-tenxstore.qbox.me' + icon.replace('/upload/console/icon', '');
  }
  return icon;
}

function _loadingImg(a) {
  var b = $(a).offset().top + 25,
      c = $('<div class="loadingImg" style="top:' + b + 'px"><img src="/images/loading-little.gif" ></div>');
  $(a).parent().append(c);
};

// table tr delete
function deleteRow(obj,even){
  $(obj).parents('tr').fadeOut('200', function(index) {
    $(this).remove();
  });
  $(even).remove();
}
// set cookie
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


$('.userList').on('click','#logout',function(){

  delCookie('a_name');
  delCookie('b_name');
  delCookie('c_name');
  delCookie('d_name');
  delCookie('e_name');
  delCookie('menu');
  delCookie('rechange-notice');
  delCookie('csrftoken');
  delCookie('stack');
  delCookie('_save');
  localStorage.clear();
});
$(document).on('click','.cursor-drop',function(){
  return false;
});
$(document).on('click',"#btnCheckAll",function(){
  $("input[name='chkItem']").prop("checked", this.checked);
  itemChecked();
});
$(document).on('click',"#blkCheckAll",function(){
  $("input[name='chkItem']").prop("checked", this.checked);
  itemChecked();
});
function itemChecked(){
  if($("input[name='chkItem']").is(':checked')){
    $('#startContainer').removeClass('cursor-drop').addClass('a-live');
    $('#stopContainer').removeClass('cursor-drop').addClass('a-live');
    $('#scaleCluster').removeClass('cursor-drop').addClass('a-live');
    $('#upgradeCluster').removeClass('cursor-drop').addClass('a-live');
    $('#redeployContainer').removeClass('cursor-drop').addClass('a-live');
    $('#changeConfiguration').removeClass('cursor-drop').addClass('a-live');
    $('#deleteButton').removeClass('cursor-drop').addClass('a-live');
    $("a[name='hlink-del']").removeClass('cursor-drop').addClass('a-live');//根据控件name修改样式
    $('#stopOneJob').removeClass('cursor-drop').addClass('a-live');
    var status = [];
    $('.clusterId').find("input[name='chkItem']").each(function(el) {
      if($(this).is(':checked')){
       status.push($(this).attr('status'));
      }
    });
    var statusStr = status.toString();
    var runIndex = statusStr.indexOf('Running');
    var stopIndex = statusStr.indexOf('Stopped');
    if(status.length > 1){
      $('#changeConfiguration').removeClass('a-live').addClass('cursor-drop');
      $('#scaleCluster').removeClass('a-live').addClass('cursor-drop');
      $('#upgradeCluster').removeClass('a-live').addClass('cursor-drop');
    }
    if(statusStr.indexOf('Initialization') > -1){
      $('#startContainer').removeClass('a-live').addClass('cursor-drop');
      $('#stopContainer').removeClass('a-live').addClass('cursor-drop');
      $('#changeConfiguration').removeClass('a-live').addClass('cursor-drop');
      $('#scaleCluster').removeClass('a-live').addClass('cursor-drop');
      $('#upgradeCluster').removeClass('a-live').addClass('cursor-drop');
      $('#deleteOneJob').removeClass('a-live').addClass('cursor-drop');
    }
    if(runIndex > -1 && stopIndex < 0){
      $('#startContainer').removeClass('a-live').addClass('cursor-drop');
      $('#deleteOneJob').removeClass('a-live').addClass('cursor-drop');
    }
    if(runIndex < 0 && stopIndex > -1){
      $('#stopContainer').removeClass('a-live').addClass('cursor-drop');
      $('#upgradeCluster').removeClass('a-live').addClass('cursor-drop');
    }
    if(runIndex > -1 && stopIndex > -1){
      $('#startContainer').removeClass('a-live').addClass('cursor-drop');
      $('#stopContainer').removeClass('a-live').addClass('cursor-drop');
      $('#upgradeCluster').removeClass('a-live').addClass('cursor-drop');
      $('#deleteOneJob').removeClass('a-live').addClass('cursor-drop');
    }
  } else {
    $('#startContainer').removeClass('a-live').addClass('cursor-drop');
    $('#stopContainer').removeClass('a-live').addClass('cursor-drop');
    $('#scaleCluster').removeClass('a-live').addClass('cursor-drop');
    $('#upgradeCluster').removeClass('a-live').addClass('cursor-drop');
    $('#redeployContainer').removeClass('a-live').addClass('cursor-drop');
    $('#changeConfiguration').removeClass('a-live').addClass('cursor-drop');
    $('#deleteButton').removeClass('a-live').addClass('cursor-drop');
    $('#deleteOneJob').removeClass('a-live').addClass('cursor-drop');
  }
}
var ajaxRequest;
function _stack(){
  var stack = getCookie('stack');
  if(stack){
    var getstack = confirm(stack);
    if(getstack){
    delCookie('stack');setCookie('_save',0);
    window.onbeforeunload=function(){};
    }else{
    setCookie('_save',1);
    }
  }
}
function _permalink(obj){
  _stack();
  var _save = getCookie('_save');
  if(_save && _save != 0 ){
    return;
  }
  var newUrl = $(obj).attr('href').split('?')[0];
  // var newUrl = $(obj).attr('href');
  // if(document.location.href.split('?')[0] == newUrl) return;
  // progress.start();
  var title_item = $(obj).find('span').text() ? $(obj).find('span').text() : $(obj).text();
  // var newUrlend = newUrl.indexOf('?') ? newUrl.indexOf('?') : 10;
  // var newUrls = newUrl.substring(0,newUrlend);
  // if(!newUrls || newUrls == '') newUrls = newUrl;
  var stateObject = 1;
  var title = "时速云 - ";
  document.title = title + title_item;
  history.pushState(stateObject,title,$(obj).attr('href'));
  $('.baseInfo').remove();
  if(!$('head link').is('#console_main_css')){
    $('head').append('<link id="console_main_css" rel="stylesheet" href="/css/console/main.526.css?rev=">');
  }
  var info = {type: 'ajax'};
  if (ajaxRequest) {
      ajaxRequest.abort();
    }
  ajaxRequest = $.ajax({
    url: newUrl,
    type: 'GET',
    data: info ,
    change: false,
  }).done(function(resp) {
    // progress.stop();
    if (resp !== null) {
      $('.page-container').html(resp);
      // $('#progress').hide();
      $('#detail-list').remove();
    } else {
      layer.msg('null');
    }
  }).fail(function(err){
    if (err.responseJSON && err.responseJSON === 'invalid_login') {
      window.location.href = '/login';
    }
  });
}
$('[data-permalink]').click(function(e) {
   e.preventDefault();
});
// $(document).on('click','[data-permalink]',function(e){
//   e.preventDefault();
// });
// 引导操作
function _leadAction(type, obj, num){
  var version = 'v1';
  if (!_checkGuide(type, version)) {
    return;
  }
  var _top;
  var _left;
  var _width;
  var _height;
  var img_left;
  var img_top;
  var _bj = '';
  setTimeout(function(){

    if (obj && $(obj).offset()) {
      _top     = $(obj).offset().top -15;
      _left    = $(obj).width() < 120 ? $(obj).offset().left-10 : $(obj).offset().left-25;
      _width   = $(obj).width()+50;
      _height  = $(obj).height()+30;
      img_left = _width >400 ? _left + (_width/3) : _left +_width+20;
      img_top  = _width >400 ?_top + _height +10 : _top;
      if(num == 2){$('body').data('num','3')};
      if(num == 5){$('body').data('num','5')};
      if(num == 6){img_top = _top - 50};
      if(num == 7 && _left > $(window).width() - 400){
        img_left = _left;
        img_top = _top - 100
      };
    }

    if (type === 'dashboard') {
      _bj = '<div id="leadAction" style="background:#4280CB;position:fixed;z-index:10000;top:100px;left:calc(50% - 260px);text-align:center;color:#fff;border-radius:25px;height:360px;">\
             <div class="h3" style="margin-top:30px;">一场精彩的旅行即将开始</div><span class="colseLead" style="position: absolute;top:10px;right:20px;font-size: 30px;cursor: pointer;">&times;</span>\
             <img src="../images/console/load/dashboard-fade.png" width="80%"><div class="h4" style="margin-top:30px;"><a href="javascript:;" class="colseLead" style="color:#fff;padding:10px 15px;border:1px solid #fff;">立即体验</a></div></div>\
             <div class="modal-backdrop fade in"></div>';
     } else {
      _bj = '<div class="modal-backdrop fade" style="z-index: 1051;">\
             <div class="lead-box" style="min-width:100px;top:'+_top+'px;left:'+_left+'px;width:'+_width+'px;height:'+_height+'px"></div></div>\
             <img class="load-fade-img" src="/images/console/load/load-fade-'+num+'.png" style="top:'+img_top+'px;left:'+img_left+'px;">';
    }

    $('article').append(_bj);
    $('.modal-backdrop').addClass('in');
    $('body').css('overflow','hidden');
  }, 1000);

}

function _checkGuide (type, version) {
  var is_tenxcloud_user_guide_on = $('#is_tenxcloud_user_guide_on').val();
  if (is_tenxcloud_user_guide_on && is_tenxcloud_user_guide_on == 'off') {
    return false;
  }
  var c_name = _getCookieName(type);
  var guideName = version + '_' + c_name;
  // if (false) {
  if (typeof(Storage) !== "undefined") {
    if(localStorage[guideName]) {
      return false;
    }
    localStorage.setItem(guideName , true);
    return true;
  } else {
    if (getCookie(guideName)) {
      return false;
    }
    setCookie(guideName, true, 365);
    return true;
  }
}
function _delGuideStorage (type, version) {
  var c_name = _getCookieName(type);
  var guideName = version + '_' + c_name;
  if (typeof(Storage) !== "undefined") {
    if(localStorage[guideName]) {
      localStorage.removeItem(guideName);
    }
  } else {
    if (getCookie(guideName)) {
      delCookie(guideName, -1)
    }
  }
}
//  left nav href;
  function _pushNavUrl(obj,num){
    $(obj).parents('.nav-item-list').siblings('a').attr('href', function(){
      return this.href.substring(0, this.href.indexOf('?')) +'?'+num;
    });
  }
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

$(function(){
  !function(){
    var url = "/images/svg/svg-symbols.svg?3";
    var div = document.createElement("div");
    div.style.display = "none";
    document.body.appendChild(div);
    // 载入SVG
    if (localStorage.getItem(url)) {
      // 本地获取，减少请求
      div.innerHTML = localStorage.getItem(url);
    } else {
      var xhr = new XMLHttpRequest();
      xhr.open("get", url);
      xhr.onload = function() {
        if (xhr.responseText) {
          div.innerHTML = xhr.responseText;
          // 本地存储
          localStorage.setItem(url, xhr.responseText);
        }
      };
      xhr.send(null);
    }

  }();
  // window.loaded = true;
  // $('.nav-li').hover(function() {
  //   $(this).css('background','#4E8FDE').siblings('.nav-li').css('background','none');
  // }, function() {
  //   $('.nav-li').css('background','');
  // });
  var modal_name_data;
  var exceptionModals = '|uploadimgModal|otherLogin|'
  $('body').on('show.bs.modal','.modal', function () {
    _modalDrag('.modal-header','.modal-dialog');
    $('.stepblock').css('width',0);
    $('.slidebtn').css('left',0);
    $('body').data('modal_data',$(this).html());
    modal_name_data = $(this).attr('id');
  });
  $('body').on('hidden.bs.modal','.modal', function () {
    // $(this).find('input[type="text"]').val('');
    // $(this).find('input[type="password"]').val('');
    // $('.number').val('1');
    if(exceptionModals.indexOf(modal_name_data) > -1 ) return;
    $('#'+modal_name_data).html($('body').data('modal_data'));
    layer.closeAll('tips');
  });
  /*$('.askBtn').click(function() {
    $('.inner-message').show();
  });
  $('.close-message').click(function() {
    $('.inner-message').hide();
    $('#push-message').val('').hide();
    $('#commit-mes').addClass('hide').siblings().removeClass('hide');
  });
  $('#pull-mes').click(function() {
    $('#push-message').show().focus();
    $('#commit-mes').removeClass('hide').siblings().addClass('hide');
  });
  $('#commit-mes').click(function() {
    var mes_text = $('#push-message').val();
    if(mes_text == ''){
      layer.tips('请输入消息内容','#push-message',{tips: [1,'#3595CC']});
      $('#push-message').focus();
      return;
    }
    var mes_content = '<div class="user-name-ask">\
              <section class="msg-user-img">\
                <img src="/images/admin/user_photo.png" class="username">\
              </section>\
              <span class="names">hello</span>\
              <span class="pull-right">1分钟前</span>\
              <p class="ask-content">'+ mes_text.trim() +'</p>\
            </div>';
      $('.item-body-container').append(mes_content);
      $('#push-message').val('');
  });*/
  $('body').on('click','.modal-backdrop',function(){
    $('article .modal-backdrop').remove();
    $('#leadAction').remove();
    $('.load-fade-img').remove();
    $('body').css('overflow','');
    var data = $('body').data('num');
    if(data && data== 5){
      _leadAction('ci_repolist', '#codeList',6);
      $('body').removeData('num')
    }
  });
  $('body').on('click','.colseLead',function(){
    $('article .modal-backdrop').remove();
    $('#leadAction').remove();
    $('.load-fade-img').remove();
    $('body').css('overflow','');
    var data = $('body').data('num');
    if(data && data== 5){
      _leadAction('ci_repolist', '#codeList',6);
      $('body').removeData('num')
    }
  });

  $('.foldingpad').click(function() {
    // var https = window.location.search;
    //   https = https.substr(1);
    if($(this).hasClass('rotate')){
      _unfold();//展开
    }else{
      _shrink();
    }
  });


  // $('.nav-li').click(function() {
  //   $(this).addClass('item-click').siblings('.nav-li').removeClass('item-click');
  // });
  // $('.list-detail li').hover(function() {
  //   $(this).css({'background':'#EAECED','color':'#333'}).siblings().css({'background':'none','color':'#666'});
  // }, function() {
  //   $('.list-detail li').css({'background':'','color':''});
  // });
  // $('.list-detail li').click(function(){
  //   $(this).addClass('li-active').siblings().removeClass('li-active');
  // });

  // $(window).resize(function() {
  //   var _w = $(window).width();
  //   if($('.nav-li').hasClass('item-click')){
  //     if(_w <= 992){ _shrink();}else{_unfold();};
  //   }
  // });
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
  $('.list-detail').click(function(el) {
    el.stopPropagation();
  });

  // if($.fn.niceScroll){
    $(".nav-menu").niceScroll({
        cursorcolor: "#2FA4FC",
        cursorborder: "0px solid #fff",
        cursorborderradius: "0px",
        cursorwidth: "3px"
    });

    $(".nav-menu").getNiceScroll().resize();
    $(".nav-menu").getNiceScroll().show();
  // }
  $(document).ready(function() {
    var _w = $(window).width();
    if(_w <= 1024){ _shrink();};
  });
  $('.close-notice').click(function() {
    var scope = $(this).attr('data-scope');
    setCookie(scope, false);
    $(this).parent('.global-notice').fadeOut(function(){
      this.remove();
    });
  });
});
  function _modalDrag(move,target){
    var mousedown_X = mousedown_Y = mousemove_X =0;
    var mousemove_Y = OrgX = OrgY = 0;
    var isMove = false;
    $(move).mousemove(function(event){
      if(isMove == false){return;}
      mousemove_X = event.clientX;
      mousemove_Y = event.clientY;
      var left = mousemove_X-mousedown_X+OrgX;
      var top = mousemove_Y-mousedown_Y+OrgY;
      $(this).parents('.modal-dialog').offset({left:left,top:top});
      return false;
    });
    $(move).mouseenter(function(event) {
      $(this).css('cursor','move');
    });
    $(move).mousedown(function(event){
      isMove = true;
      $(this).css('cursor','move');
      mousedown_X = event.clientX;
      mousedown_Y = event.clientY;
      OrgX = $(this).parents(target).offset().left;
      OrgY = $(this).parents(target).offset().top;
    });

    $("html").mouseup(function () {
      isMove = false;
      $(move).css('cursor','auto');
    });
  }
// slider
  scale = function (obj, btn, bar, block, title) {
    this.btn = document.getElementById(btn);
    this.bar = document.getElementById(bar);
    this.step = document.getElementById(block);
    this.title = document.getElementById(title);
    var min_steps = $(obj).attr('data-min-steps');
    var max_steps = $(obj).attr('data-max-steps');
    this.title.value = min_steps;
    this.init(min_steps,max_steps);
  };
  scale.prototype = {
    init: function (min_steps,max_steps) {
      min_steps = parseInt(min_steps);
      max_steps = parseInt(max_steps);
      var f = this, g = document, b = window, m = Math;

      f.btn.onmousedown = function (e) {
        var x = (e || b.event).clientX;
        var l = this.offsetLeft;
        var max = f.bar.offsetWidth - this.offsetWidth;
        g.onselectstart = function (){return false}
        g.onmousemove = function (e) {
          var thisX = (e || b.event).clientX;
          var to = m.min(max, m.max(0, l + (thisX - x))) ;
          f.btn.style.left = to + 'px';
          f.ondrag(m.round(m.max(0, to / max) * (max_steps - min_steps) + min_steps), to);//最大值
          b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
        };
        // g.onmouseup = new Function('this.onmousemove=null');
        g.onmouseup = function(){
          this.onmousemove = null;
          this.onselectstart= true;
        }
      };
    },
    ondrag: function (pos, x) {
      this.step.style.width = Math.max(0, x) + 'px';
      this.title.value = pos;
    }
  }