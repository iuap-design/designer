/**
 * Created by chief on 16/5/18.
 */

define("sidebar",[],function(){
    var sidebar = function (container){
        this.container = $(container) || $("body");
        this.parent = this.container.closest('.site-menubar');
        this.num = 0;
        this.curNum = 0;
        this.initMenuList();
    };
    sidebar.prototype = {
        scroll:function(){
            var _this = this;
            var html = '<div class="menubar-footer">'+
                            '<a style="cursor: pointer" title="通过滚动鼠标来移动菜单" class="arrow-up lock"><i class="portalfont icon-arrow-up"></i></a>'+
                            '<a style="cursor: pointer" title="通过滚动鼠标来移动菜单" class="arrow-down"><i class="portalfont icon-arrow-down"></i></a>'+
                        '</div>';
            this.container.parent().append($(html));
            if(getBrowserVersion()=='IE8'){
                this.parent.css({'visibility':'hidden','display':'block'});
            }
            var cH = document.body.scrollHeight-50-10;
            var sH = this.container.height();
            //var menu = this.container.find('.menubar').parent();

            if(sH>cH){
                this.parent.find('.menubar-footer').show();
            }

            if(getBrowserVersion()=='IE8'){
                this.parent.removeAttr('style');
            }

            function scroll(value){
                var h  = document.body.clientHeight-50-10;
                var showNum = parseInt(h/70);

                _this.curNum = _this.curNum+value;
                if(_this.curNum<0){
                    _this.curNum = 0;
                    _this.parent.find('.arrow-up').addClass('lock')
                    return false;
                }
                //fix: add 1 fake element
                else if(_this.curNum>_this.num-showNum+2) {
                    _this.curNum=_this.num-showNum+2;
                    _this.parent.find('.arrow-down').addClass('lock')
                    return false;
                }
                else {
                    _this.parent.find('.arrow-down,.arrow-up').removeClass('lock');
                }

                if(getBrowserVersion()=='IE8'||getBrowserVersion()=='IE9'){
                    _this.container.css({'position':'absolute'});
                    $(_this.container).animate({'top':(-_this.curNum*70)+'px'},'300','swing')
                }
                else {
                    _this.container.css({'transform':'translateY('+(-_this.curNum*70)+'px)','-ms-transform':'translateY('+(-_this.curNum*70)+'px)'});
                }
            }
            this.parent.find('.arrow-up,.arrow-down').on('click',function(){
                var value = $(this).hasClass("arrow-down")?1:-1;
                scroll(value)
            })
           /* //-- on arrow hover --//
            var arrowTimmer ;
            this.parent.find('.arrow-up,.arrow-down').on('mouseover',function(){
                var value = $(this).hasClass("arrow-down")?1:-1;
                if(arrowTimmer){
                  clearInterval(arrowTimmer);
                  arrowTimmer = null;
                }
                var timmer = (function(fx){
                  return function(){
                    scroll(fx);
                  }
                })(value);
                arrowTimmer = setInterval(timmer, 500);
            }).on('mouseout',function(){
              if(arrowTimmer){
                clearInterval(arrowTimmer);
                arrowTimmer = null;
              }
            })
            //-- on arrow hover --//*/
            _this.container.on('mousewheel',function(event,delta) {
                var value = delta>0?-1:1; //fix: window mousewheel style
                scroll(value);
                event.stopPropagation();
                event.preventDefault();
            });
            //ipad 滚动
            if(navigator.userAgent.indexOf("iPad")!=-1){
                _this.container.on('touchstart',function(event) {
                    startY = event.originalEvent.changedTouches[0].pageY;
                });
                _this.container.on('touchmove',function(event) {
                    moveEndY = event.originalEvent.changedTouches[0].pageY;
                    var y = moveEndY - startY;
                    var value = y <= 0?1:-1;
                    scroll(value);
                    event.stopPropagation();
                    event.preventDefault();
                });
            }
        },
        html:function(data){
            //data = data.slice(0,4);
            var str = [];
            var hash = location.hash;
            var _this = this;
            var menubar = this.container;
            this.num = data.length;
            function formmaterUrl(item) {
                var uri = " ";
                if (item.urltype === 'url') {
                    uri = '#/ifr/' + encodeURIComponent(encodeURIComponent(item.location));
                    return  uri;
                } else if (item.urltype === 'plugin') {
                    uri = item.id ? ('#/' + item.id) : "#/index_plugin";
                    registerRouter(uri.replace("#", ""), item.location);
                    return  uri;
                } else if (item.urltype === 'view') {
                    uri = item.location;
                    uri= uri.replace("#", "/");
                    addRouter(uri);
                    return  "#"+uri;
                }else if(item.urltype == undefined){
                    item.location = '404';
                    return  '#/ifr/' + encodeURIComponent(encodeURIComponent(item.location));
                }
                else {
                    return item.location;
                }
            }
            function IsURL(str_url) {
                var strRegex = '^((https|http|ftp|rtsp|mms)?://)'
                    + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' // ftp的user@
                    + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
                    + '|' // 允许IP和DOMAIN（域名）
                    + '([0-9a-z_!~*\'()-]+.)*' // 域名- www.
                    + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名
                    + '[a-z]{2,6})' // first level domain- .com or .museum
                    + '(:[0-9]{1,4})?' // 端口- :80
                    + '((/?)|' // a slash isn't required if there is no file name
                    + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$';
                var re = new RegExp(strRegex);
                if (re.test(str_url)) {
                    return true;
                } else {
                    return false;
                }
            };

            if(hash.match(/#\/widget|#\/layouts/)){
                if(hash.match(/#\/widget|#\/layouts/).length>0){
                    $("#design").attr("sortalbe",'false').parent().hide();
                    $("#design").parent().parent().find('.divider').hide();
                }
            }

            $.each(data, function (i, item) {
                if (item.children != null && (item.children) && (item.children.length)) { //child menu
                    var s = '<div class="menubar-menu '+(item.children.length>=10?"menubar-cloum-"+parseInt(item.children.length/10):"")+'"><ul>';
                    $.each(item.children, function (t, items) {
                        s += '<li><a urltype="' + (items.urltype ) + '" ahref="' + items.location + '" href="' + (formmaterUrl(items)) + '">' + items.name + '</a></li>';
                    });
                    s += '</ul></div>';
                    var b = '<span class="icon wb-chevron-right-mini"></span>';
                    var t = '';
                    str.push(
                        '<li ' + (i == 0 ? 'class="active" isIndex="true"' : "") + '>' +
                        '<a urltype="' + item.urltype + '" href="javascript:void(0);" >' +
                        '<i class="icon iconfont  '+ item.icon+'"> </i>' + '<span class="icon-name">' + item.name + b + '</span>'+
                        '</a>' + t + s +
                        '</li>')
                } else {
                    var s = '', b = '';
                    str.push(
                        '<li ' + (i == 0 ? 'class="active" isIndex="true"' : "") + '>' +
                        '<a urltype="' + item.urltype + '" ahref="#' + item.location + '" href="' + formmaterUrl(item) + '">' +
                        '<i class="icon iconfont '+ item.icon+'"></i>' + '<span class="icon-name">' + item.name + '</span>' + b +
                        '</a>'  + s +
                        '</li>');

                }
            });

            menubar.html(str.join(''));
            this.scroll();
            return this;
        },
        init:function(){
            var _this = this;
            var menubar = this.container;
            var clickEventType=((document.ontouchstart!==null)?'click':'touchend');

            menubar.on(clickEventType, 'li',function (e) {   //菜单点击
                var li = $(e.target).closest('.menubar-menu').length>0?$(this).closest('.menubar-menu').closest('li'):$(this).closest('li');
                if(li.hasClass('active')){
                    var target = $(e.target).closest('a');
                    var path = target.attr("href");
                    var ismenu = $(this).find('.menubar-menu').length>0;

                    //刷新path
                    if(path.search(/^javascript\:/ig)==-1&&location.hash==path){
                        path = path.replace('#','');
                        router.dispatch('on',path);
                    }

                    //initLayout(contextRoot+'/data:layout' + href.replace('#','')+"?random="+Math.random(),[]);
                }
                _this.container.find('li').removeAttr('class');
                $(this).addClass('active');
            });
            if(navigator.userAgent.indexOf("iPad")==-1){
                menubar.on('mouseenter', 'li',function (e) {
                    var menu = $(this).find('.menubar-menu');
                    var tips = $(this).find('.tips');
                    var top = _this.container.position().top;
                    var menuTop = $(this).position().top;
                    menu.show();
                    tips.show();
                    $(this).addClass('menubar-hover');
                }).on('mouseleave', 'li',function (e) {
                    var menu = $(this).find('.menubar-menu');
                    var tips = $(this).find('.tips');
                    menu.hide();
                    tips.hide();
                    $(this).removeClass('menubar-hover');
                }).on('mouseleave',function (e) {
                    var tips = $(this).find('.tips');
                    tips.hide();
                }).on('click', '.menubar-menu ul>li', function (e) { //子菜单点击处理
                    $(this).siblings("li").removeClass("active").end().addClass('active').parents("li:first").addClass("active");
                    $(this).closest('.menubar-menu').hide();
                });
            }
            else {
                menubar.on('click', '.menubar-menu ul>li', function (e) { //子菜单点击处理
                    $(this).siblings("li").removeClass("active").end().addClass('active').parents("li:first").addClass("active");
                    $(this).closest('.menubar-menu').hide();
                }).on('mousedown', 'li',function (e) {
                    var menu = $(this).find('.menubar-menu');

                    var top = _this.container.position().top;
                    var menuTop = $(this).position().top;
                    menu.show();
                }).on('mouseleave','li',function (e) {
                    var menu = $(this).find('.menubar-menu');
                    menu.hide();
                })

            }
            //设定hash的选中状态
            var hash = encodeURI(location.hash);
            var element  = _this.container.find('a[href~="'+hash+'"]');
            if(element.length>0){
                var parent = element.closest('.menubar-menu');
                _this.container.find('li:first-child').removeClass('active');
                if(parent.length>0){
                    parent.closest('.menubar-menu').parent().addClass("active");
                }
                element.parent().addClass("active");
            }

            return this;
        },
        initMenuList:function(){
            var _this = this;
            $.ajax({
                url: contextRoot + "/appmenumgr/sidebarList?random="+Math.random(),
                type: 'GET',
                dataType: 'json',
                async: false,
                contentType: 'application/json',
                success: function (result) {
                    if (result.status) {
                        _this.html(result.data);
                        _this.init();
                        _this.router();
                    } else {
                        console.log(result.msg ? result.msg : "error happend!~!");
                    }
                },
                error: function (XMLHttpRequest) {
                    errorLogin(XMLHttpRequest);
                    alert("网络请求失败");
                }
            });

            return this;
        },
        router:function(){
            var homePage = this.container.find("li[isindex=true]>a").attr("href");
            if(window.extendRouteRegister){
                window.extendRouteRegister(router);
            }
            if($.trim(window.location.hash)==''){
                router.init(homePage.replace("#",""));
            }else{
                router.init("/"+window.location.hash);
            }
            return this;
        }
    };

    return sidebar
});
