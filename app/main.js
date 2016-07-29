/**
 * Created by chief on 16/7/14.
 */

require('../static/css/index.css');
require('../static/css/sidebar.css');
require('../static/css/layout.css');
require('../static/css/designer.css');
require('../static/css/header.css');
require('../static/css/main.css');


require('../static/js/router.js');

require('../static/js/header.js');



//默认模版
;(function(){
    var index =  require('../static/js/index');
    new index.init('#container-content');
})();


//侧边栏
;(function(){
    var template =  require('../static/js/sidebar');
    template.init('#sidebar-container');
})();







