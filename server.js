var fs = require('fs');
var path = require('path');
var koa = require('koa');
var router = require('koa-router')();
var serve = require('koa-static');
var koaBody = require('koa-body');
var gzip = require('koa-gzip');
var app = koa();

app.use(gzip());

app.use(koaBody({
  formidable: {uploadDir: __dirname},
  textLimit: '50mb',
  formLimit: '50mb'
}));


router.post('/download', function (next) {
  // this.request.body;
  //console.log(this.request.body.html_code);
  var styles = this.request.body.css_code;
  //var htmls = this.request.body.html_code;
  var scripts = this.request.body.script_code;
  var htmls = this.request.body.files;
  //console.log(htmls);

  var tpl = [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="UTF-8">',
    '<title>Title</title>',
    '<link rel="stylesheet" href="http://design.yyuap.com/designer/trd/bootstrap/css/bootstrap.css">',
    '<link rel="stylesheet" href="http://design.yyuap.com/designer/fonts/designfont/iconfont.css">',
    '<link rel="stylesheet" href="http://design.yyuap.com/designer/trd/uui/assets/fonts/font-awesome/css/font-awesome.css">',
    '<link rel="stylesheet" href="http://design.yyuap.com/static/uui/latest/css/u.css">',
    '<link rel="stylesheet" href="http://design.yyuap.com/static/uui/latest/css/u-extend.css">',
    '<link rel="stylesheet" type="text/css" href="http://design.yyuap.com/designer/main.05e4f8bc.css">',
    '</head>',
    '<body>',
    htmls,
    '<script src="http://design.yyuap.com/designer/trd/jquery/jquery-1.11.2.min.js"></script>',
    '<script src="http://design.yyuap.com/designer/trd/knockout/knockout-3.2.0.debug.js"></script>',
    '<script src="http://design.yyuap.com/designer/trd/bootstrap/js/bootstrap.min.js"></script>',
    '<script src="http://design.yyuap.com/static/uui/latest/js/u.js"></script>',
    '<script src="http://design.yyuap.com/static/scrollbar/jquery.mCustomScrollbar.concat.min.js"></script>',
    '<script src="http://design.yyuap.com/designer/bundle.js"></script>',
    '</body>',
    '</html>'
  ]

  //var self = this;
  //fs.writeFile('files.html', tpl.join(""), function (err) {
  //  if (err) throw err;
  //  console.log('It\'s saved!');
  //});
  //
  //var data = fs.createReadStream('files.html');

  this.body = tpl.join("");

});

app.use(router.routes())
  .use(router.allowedMethods());

// response
app.use(function *(next){
  // (3) 进入 response 中间件，没有捕获到下一个符合条件的中间件，传递到 upstream
  if (this.request.url === '/') {
    this.body = fs.readFileSync(path.resolve(__dirname, './build/index.html')).toString();
  } else {
    return yield* next;
  }
});

app.use(serve(path.join(__dirname, './build')));

app.listen( 9000 );
