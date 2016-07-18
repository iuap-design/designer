u.EcNavMenu = u.NavMenu.extend({
    init: function(){
    	var self = this;
    	u.NavMenu.prototype.init.call(this);
    	
    	this.element.querySelectorAll('.nav-menu-lev-1-li').forEach(function(node) {
	        u.on(node, 'mouseenter', self._horNavlinkHover.bind(self));
    	})
    },
    _horNavlinkHover: function (e) {
        var index = u.index('.u-navmenu-horizontal .nav-menu-lev-1-li', e.target);
        
        var subs = document.querySelectorAll('.u-navmenu-subhor > .u-navmenu-sub');
        for(var i= 0;i < subs.length;i++) {
        	if(i === index) {
        		subs[i].style.display = 'block';
        	} else {
        		subs[i].style.display = 'none';
        	}
        }
        
    }
});

u.compMgr.regComp({
    comp: u.EcNavMenu,
    compAsString: 'ec.NavMenu',
    css: 'ec-navmenu'
})
