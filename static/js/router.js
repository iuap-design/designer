
var Director = require('../../static/trd/director/director');

var router = new Director.Router();

//创建页面
router.on('/add',function(){

});

//编辑和预览
router.on('/edit',function(){

});

//预览多端  mobile,pc,iphone,ipad
router.on('/preview/:id',function(id){
    var template =  require('../../static/js/template');
    new template.init({
        container:'#container-content',
        id:id
    });
});


//组件面板
router.on('/widget',function(id){
    var template =  require('../../static/js/widget');
    template.init('#sidebar-container');
});

//布局模版
router.on('/layout',function(id){
    var template =  require('../../static/js/layout');
    template.init('#layout-container');
});




router.init();