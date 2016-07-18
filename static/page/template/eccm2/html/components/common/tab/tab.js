u.EcTabs = u.Tabs.extend({
    init: function(){
    	var self = this;
    	u.Tabs.prototype.init.call(this);
    	
    	this.element.querySelectorAll('.u-tabs__tab').forEach(function(node) {
	        u.on(node, 'mouseenter', self._tabHover.bind(self));
    	})
    },
    _tabHover: function (e) {
		var href = e.target.href.split('#')[1];
		
		this.show(href);  
    }
});

u.compMgr.regComp({
    comp: u.EcTabs,
    compAsString: 'ec.Tabs',
    css: 'ec-tabs'
})
