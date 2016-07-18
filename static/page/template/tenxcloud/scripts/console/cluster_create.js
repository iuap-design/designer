// $('.nav-li').eq(1).addClass('item-click');
// $('.nav-li').eq(1).find('.nav-item-list').show();
// $('#containers li').eq(0).addClass('li-active').siblings().removeClass('li-active');


// $(function(){
//   // get balance and amount
//   $.ajax({
//     url: '/account/getconsumamount',
//     type: 'GET',
//     cache: false
//   }).done(function (resp) {
//     if (resp && resp.length > 0) {
//       $('#sum_balance').val(resp[0].balance);
//       $('#pay_balance').val(resp[0].pay_balance);
//       $('#grant_balance').val(resp[0].grant_balance);
//     } else {
//       $('#balance').val('0');
//     }
//   }).fail(function (error) {
//     //
//   });

//   // init price
//   var price = $('#price').val()
//   try {
//     price = JSON.parse(price)
//   } catch(err) {
//     price = {
//       price_256_per_hour:0.02,
//       price_512_per_hour:0.042,
//       price_1024_per_hour:0.08,
//       price_2048_per_hour:0.16,
//       price_4096_per_hour:0.32,
//       price_8192_per_hour:0.64,
//       price_16384_per_hour:1.35
//     }
//   }
//   // _changeConsumptionEstimate()
//   // function _changeConsumptionEstimate() {
//   //   var config = $('.set_container.active').attr('config')
//   //   config = config.split(',')[1].match(/\d+/)[0]
//   //   var number = $('#instsize .number').val()
//   //   number = parseInt(number)
//   //   if (isNaN(number)) {
//   //     return
//   //   }
//   //   var master = $('#hosting-cluster').val();

//   //   if (master === 'default' || master.indexOf('tenx_') === 0) {
//   //     $('.createPadding span.pull-right').show()
//   //     var consumptionEstimate = price[master]['price_' + config + '_per_hour'] * number
//   //     var consumptionEstimateMonth = (consumptionEstimate * 24 * 30).toFixed(2)
//   //     if (master == 'tenx_district_us') {
//   //       $('#preferential').removeClass('hide');
//   //       $('#specific-us').css('margin-top','-12px');
//   //       $("#old-price").text(consumptionEstimate * 2);
//   //       $('#old-rebate').text(consumptionEstimateMonth)
//   //       //consumptionEstimate = consumptionEstimate /2;
//   //       consumptionEstimateMonth = (consumptionEstimate * 24 * 30).toFixed(2)
//   //     } else {
//   //       $('#preferential').addClass('hide');
//   //       $('#specific-us').css('margin',0)
//   //     }
//   //     consumptionEstimate = consumptionEstimate.toFixed(3)
//   //     $('#consumptionEstimate').text(consumptionEstimate)
//   //     $('#consumptionEstimateTips').text(consumptionEstimateMonth)
//   //   } else {
//   //     $('.createPadding span.pull-right').hide()
//   //   }
//   // }
//   $('#instsize .number').change(function () {
//     _changeConsumptionEstimate()
//   })
//   // List private cluster option
//   // _getmasters();
//   // select the cluster
//   var clusterData = $('#hosting-cluster').val();
//   var clusterText = $('#hosting-cluster-name').val();
//   var createType = $("#createType").val()
//   if (!clusterText || clusterText.trim() == '' || clusterText == 'default') {
//     clusterText = '北京1区';
//     setCookie("b_name", 0);
//     $('.clusterText').text(clusterText).attr('data', clusterData);
//   } else if (clusterText == 'tenx_district2') {
//     clusterText = '北京2区';
//     setCookie("b_name", 1);
//     $('.clusterText').text(clusterText).attr('data', clusterData);
//   } else if (clusterText == 'tenx_district3') {
//     clusterText = '杭州区';
//     setCookie("b_name", 2);
//     $('.clusterText').text(clusterText).attr('data', clusterData);
//   } else if (clusterText == 'tenx_district_us') {
//     clusterText = '北美区';
//     setCookie("b_name", 3);
//     $('.clusterText').text(clusterText).attr('data', clusterData);
//   } else {
//     $('.clusterText').text(clusterText).attr('data', clusterData);
//   }

//   // Handle mountPath
//   _handleMountPath(clusterData);
//   // Load clusters for link
//   _loadClustersForLink(clusterData);

//   // If queryImageName and queryImageType exist, skip to step2.
//   var queryImageName = $('#queryImageName').val();
//   var queryImageType = $('#queryImageType').val();

//   if (queryImageName && queryImageName.trim() !== '' && queryImageType && queryImageType.trim() !== '') {
//     var imageInfo = {};
//     imageInfo.name = queryImageName;
//     imageInfo.type = queryImageType;
//     $('.step-inner').css({left:'-100%'});
//     go_back_step = 1;
//     isFastCreate = true;
//     $('.createPadding').removeClass('hide');
//     // $('.step-inner .host_step1').remove();
//     _insertTwoStep(imageInfo, queryImageType);
//     $('#createButton,.createPadding').removeClass('hide');
//   } else {
//     // Get top repos default
//     _getSystemRepositories('runtime');
//   }
//   //---------------------- left li click  ----------------.
//    $('.nav-item-hover li').click(function(e) {
//       var num = $(this).index(),Id = $(this).parent().siblings().find('.list-detail').attr('id'),
//       titles = '',https = $(this).attr('href');
//         _permalink(this);
//         e.preventDefault();
//       $('#'+Id+' li').eq(num).click();
//       history.pushState(1,titles,https+'?'+ num);
//     });
//   // at detail nav click;
//   $('#containers li').click(function(e) {
//     var num = $(this).index(),
//     titles = '',https = $(this).attr('href');
//     _permalink(this);
//     e.preventDefault();
//     history.pushState(1,titles,https+'?'+ num);
//   });
//   $('.list-detail li').click(function(e) {
//     var num = $(this).index(),
//       titles = '',https = $(this).attr('href');
//      $('.list-detail li').removeClass('li-active');
//      $(this).addClass('li-active');
//       _permalink(this);
//       e.preventDefault();
//       history.pushState(1,titles,https+'?'+ num);
//   });

//   /**************************************************************************
//   ***************************  image type click bound  **********************
//   ***************************************************************************/
//   $("#default").click(function() {
//     if(!$(this).hasClass('primary')){
//       $(this).addClass('active');
//       $('.select-type').addClass('hide');
//       $('#defaultImages').show().siblings().hide();
//       $('#defaultImages').siblings('li').find('.image-item').remove();
//       _getTopRepositories();
//       $(this).addClass('primary').siblings().removeClass('primary');
//       $('.select-type').addClass('hide');
//     }
//   });
//   $('.open-system .info-type').click(function(){
//     $(this).addClass('primary').siblings().removeClass('primary');
//     var type = $(this).attr('type');
//     _getSystemRepositories(type);
//   });
//   $('.stack-system .info-type').click(function(){
//     $(this).addClass('primary').siblings().removeClass('primary');
//     var type = $(this).attr('type');
//     _getStacks(type);
//   });
//   $('#system').click(function() {
//     $('.search-group-inner').show();
//     $('#search-img').attr('placeholder', '搜索镜像');
//     $('#search-img').val('');
//     var type = $('.open-system .info-type.primary').attr('type');
//     _getSystemRepositories(type);
//     $(this).addClass('primary').siblings().removeClass('primary');
//     $('.select-type').removeClass('hide').siblings('.stack-type').addClass('hide');
//     $('#systemImages').show().siblings('li').hide();
//   });
//   $('#stack').click(function() {
//     $('.search-group-inner').show();
//     $('#search-img').attr('placeholder', '搜索镜像');
//     $('#search-img').val('');
//     var type = $('.stack-system .info-type.primary').attr('type');
//     _getStacks(type);
//     $(this).addClass('primary').siblings().removeClass('primary');
//     $('.select-type').addClass('hide').siblings('.stack-type').removeClass('hide');
//     $('#stackImages').show().siblings('li').hide();
//   });
//   $('#private').click(function() {
//     $('.search-group-inner').show();
//     $('#search-img').attr('placeholder', '搜索镜像');
//     $('#search-img').val('');
//     $(this).addClass('primary').siblings().removeClass('primary');
//     $('.select-type,.stack-type').addClass('hide');
//     $('#privateImages').show().siblings().hide();
//     // $('#privateImages').siblings('li').find('.image-item').remove();
//     _getPrivateRepositories();
//   });
//   $('#public').click(function() {
//     $('.search-group-inner').show();
//     $('#search-img').attr('placeholder', '搜索镜像');
//     $('#search-img').val('');
//     $(this).addClass('primary').siblings().removeClass('primary');
//     $('.select-type,.stack-type').addClass('hide');
//     $('#publicImages').show().siblings().hide();
//     // $('#publicImages').siblings('li').find('.image-item').remove();
//     _getPublicRepositories();
//   });
//   $('#favorites').click(function() {
//     $('.search-group-inner').show();
//     $('#search-img').attr('placeholder', '搜索镜像');
//     $('#search-img').val('');
//     $(this).addClass('primary').siblings().removeClass('primary');
//     $('.select-type,.stack-type').addClass('hide');
//     $('#favoritesImages').show().siblings().hide();
//     // $('#favoritesImages').siblings('li').find('.image-item').remove();
//     _getFavoritesRepositories();
//   });
//   $('#docker').click(function() {
//     $('.select-type,.stack-type').addClass('hide');
//     $(this).addClass('primary').siblings().removeClass('primary');
//     $('#dockerImages').show().siblings().hide();

//     $('.search-group-inner').hide();
//     $('#dockerImages').siblings('li').find('.image-item').remove();
//     /*var docker =  '<div class="image-item" style="padding-top:35px">\
//                         <span class="span-src text-center">镜像仓库地址：</span>\
//                         <span class="span6">\
//                           <input type="text" class="mirror-value" placeholder="请填写...">\
//                         </span>\
//                         <span class="span2"><div class="list-description"><span class="pull-deploy btn btn-primary">选择<i class="fa fa-arrow-circle-o-right margin fa-lg"></i> </span></div></span>\
//                       </div>';
//     $('#dockerImages').append(docker);*/
//   });
//   // Search docker images
//   $('.search-group').submit(function(){
//     var query = $('#search-docker').val();
//     if (!query || query.trim() === '') {
//       layer.tips('请输入镜像名称','#search-docker',{tips: [1, '#3595CC'], time: 2000});
//       return false;
//     }
//     $('#search-img').val(query);
//     $('#searchImages').show().siblings().hide();
//     _searchDockerHub(query);
//     $('.search-group-inner').show();
//     return false;
//   });
//   // Search images
//   $('.search-group-inner').submit(function(){
//     $('.host_step1 .select-type .open-system .info-type:first').addClass('primary').siblings().removeClass('primary');
//     $('.host_step1 .select-type').addClass('hide');
//     $('#searchImages').show().siblings().hide();
//     // $('#searchImages').siblings('li').find('.image-item').remove();
//     if ($('#docker').hasClass('primary')) {
//       // search docker hub
//       var query = $('#search-img').val();
//       if (!query || query.trim() === '') {
//         layer.tips('请输入镜像名称','#search-img',{tips: [1, '#3595CC'], time: 2000});
//         return false;
//       }
//       _searchDockerHub(query);
//     } else {
//       $('.host_step1 .info-class span').removeClass('primary');
//       // search TenxCloud hub
//       _searchRepos();
//     }
//     return false;
//   });

//   $('.STEPS:first').click(function() {
//     $('.step-inner').css({left:'0px'});
//     $(this).addClass('action').siblings('').removeClass('action');
//     // $('.one_step').removeClass('hide').siblings().addClass('hide');
//     $('.pull_confirm, .createPadding').addClass('hide')
//   });
//    $('.STEPS').eq(1).click(function() {
//     $('.step-inner').css({left:'-100%'});
//     $('.pull_confirm,.createPadding').removeClass('hide')
//   });
//   $('.STEPS').eq(2).click(function(){
//     $('.two_step').click();
//     $('.host_step1').css('height','300px');
//   });
//   /*$('#containerName').keyup(function() {
//     if($(this).val() !==''){
//      $('.wrap .two_step').removeClass('disabled');
//     }
//   });*/

//   $('.pull-deploy-directly').click(function() {
//     var imageName = $('.mirror-value').val();
//     var registryServer = $('.pushText').val();
//     if (!imageName || imageName.trim() === '') {
//       layer.tips('请输入镜像名称','.mirror-value', {tips: [1, '#3595CC']});
//       $('.mirror-value').focus();
//       return;
//     }
//     if (!registryServer || registryServer.trim() === '') {
//       layer.tips('请选择镜像服务器','.pushText', {tips: [1, '#3595CC']});
//       $('.pushText').focus();
//       return;
//     }
//     if (registryServer === 'index.docker.io' || registryServer === 'index.tenxcloud.com' || registryServer === 'quay.io') {
//       var imageInfo = {
//         name: imageName,
//         tags: ["latest"]
//       }
//       if (registryServer === 'index.docker.io') {
//         // check if the image exist
//         $.ajax({
//           url: '/docker-hub/searchRepos?query=' + imageName + '&num=1',
//           type: 'GET',
//           cache: false
//         }).done(function (resp) {
//           if (resp && resp.results.length > 0) {
//             go_back_step = 1;
//             $('.createPadding').removeClass('hide');
//             $('.step-inner').css({left:'-100%'});
//             $('.pull_confirm,.createPadding').removeClass('hide');
//             _insertTwoStep(imageInfo, 'dockerhub');
//           } else {
//             layer.tips('该镜像不存在','.mirror-value', {tips: [1, '#3595CC']});
//             $('.mirror-value').focus();
//             return;
//           }
//         }).fail(function (error) {
//           layer.tips('查找镜像失败，请重试','.mirror-value', {tips: [1, '#3595CC']});
//           $('.mirror-value').focus();
//           return;
//         }).complete(function () {
//           layer.close();
//         })
//       } else if (registryServer === 'index.tenxcloud.com') {
//         go_back_step = 1;
//         $('.createPadding').removeClass('hide');
//         $('.step-inner').css({left:'-100%'});
//         $('.pull_confirm,.createPadding').removeClass('hide');
//         _insertTwoStep(imageInfo);
//       }
//     } else {
//       layer.tips('请选择合法的镜像服务器','.pushText', {tips: [1, '#3595CC']});
//       $('.pushText').focus();
//       return;
//     }
//   });

//   $('.dialog').on('click','.image-item .pull-deploy',function(){
//     go_back_step = 1;
//     $('.createPadding').removeClass('hide');
//     $('.step-inner').css({left:'-100%'});
//     $('.pull_confirm,.createPadding').removeClass('hide');
//     var imageInfo;
//     var imageItem = $(this).parents('.image-item');
//     // var imageName = $(imageItem).find('div.name').text().trim();
//     var imageName = $(this).attr('data-attr').trim();
//     if (imageName) {
//       imageInfo = {};
//       imageInfo.name = imageName;
//       var tagsString = $(imageItem).find('span.id').attr('value');
//       imageInfo.tags = [];
//       if (tagsString && tagsString.trim().length > 0) {
//         imageInfo.tags = tagsString.split(',');
//       }
//       // imageInfo.tags = null;
//       imageInfo.type = $(imageItem).find('span.type').attr('type');
//     }
//     _changeConsumptionEstimate()
//     _insertTwoStep(imageInfo);
//   });

//   $('.dialog').on('click','.image-item .pull-deploy-dockerhub',function(){
//     go_back_step = 1;
//     $('.createPadding').removeClass('hide');
//     $('.step-inner').css({left:'-100%'});
//     $('.pull_confirm,.createPadding').removeClass('hide');
//     var imageInfo;
//     var imageItem = $(this).parents('.image-item');
//     var imageName = $(this).attr('data-attr').trim();
//     $('#getImageName').val(imageName+':latest');
//     if (imageName) {
//       imageInfo = {};
//       imageInfo.name = imageName;
//       var tagsString = $(imageItem).find('span.id').attr('value');
//       imageInfo.tags = [];
//       if (tagsString && tagsString.trim().length > 0) {
//         imageInfo.tags = tagsString.split(',');
//       }
//       // imageInfo.tags = null;
//       imageInfo.type = $(imageItem).find('span.type').attr('type');
//     }
//     _insertTwoStep(imageInfo, 'dockerhub');
//   });


//   $('.dialog').on('click','.image-item .pull-deploy-stack',function(){
//     var stack_id = $(this).attr('stack_id');
//     var master = $('#hosting-cluster').val();
//     window.location = '/stack/launch?from=' + master + '&id=' + stack_id;
//   });

//   // go back two step
//   $('.two_step').click(function() {
//     var name = $('#containerName').val().trim();
//     var config = $('.set_container.active').attr('config');
//     if (!config) {
//       layer.msg('请选择容器配置');
//       return;
//     }
//     // check the name of container
//     if(!name || name.length < 1){
//       layer.tips('容器名称不能为空','#containerName',{tips: [1, '#3595CC']});
//       $('#containerName').focus();
//       return;
//     }
//     name = name.toLowerCase();
//     if(name.search(/^[a-z][a-z0-9-]*$/) === -1){
//       layer.tips('容器名称只能由字母、数字及横线组成，且首字母不能为数字及横线。','#containerName',{tips: [1, '#3595CC'],time: 3000});
//       $('#containerName').focus();
//       return;
//     }
//     if(name.length > 50 || name.length < 3){
//       layer.tips('容器名称为3~50个字符','#containerName',{tips: [1, '#3595CC'],time: 3000});
//       $('#containerName').focus();
//       return;
//     }
//     // check number of containers
//     var number = 1;
//     if(!$('#instsize').is(':hidden')){

//       var numberStr = $('#instsize .number').val();
//       if(!numberStr){
//         layer.tips('请填写实例数量','#instsize .number',{tips: [1, '#3595CC'],time: 3000});
//         return;
//       }
//       number = parseInt(numberStr);
//       if (number > 3) {
//         layer.tips('实例数量不允许超过3个','#instsize .number',{tips: [1, '#3595CC'],time: 3000});
//         return;
//       }
//       if (number < 1) {
//         layer.tips('实例数量填写错误','#instsize .number',{tips: [1, '#3595CC'],time: 3000});
//         return;
//       }
//     }
//     // check volume
//     if($('#state_service').is(':checked') && !$('#state_service').attr('disabled')){
//       var isVolumeCreate = $('#save_roll_dev').attr('create');
//       if (isVolumeCreate && isVolumeCreate == 1) {
//         layer.tips('请先创建一个存储卷，或取消有状态服务', '#fastCreateVolume', {tips: [1, '#3595CC'],time: 3000});
//         return;
//       }
//       var isSelectVolume = true;
//       $('#mountPathList li').each(function(index, el) {
//         if ($(el).find('.selectVolume').val() == 0) {
//           isSelectVolume = false;
//           layer.tips('请选择一个存储卷，或取消有状态服务', $(el).find('.selectVolume'), {tips: [1, '#3595CC'],time: 3000});
//           return false;
//         }
//       });
//       if (!isSelectVolume) {
//         return;
//       }
//     }
//     go_back_step = 2;
//     $('.step-inner').css({left:'-200%'});
//     $('.radius_step').eq(go_back_step).addClass('action').siblings('').removeClass('action');
//     $('.two_step').addClass('hide');
//     $('.pull_confirm,.go_backs').removeClass('hide');
//     $('.host_step3').removeClass('hide').css('height','auto');
//     var master = $('#hosting-cluster').val();
//     if(master.indexOf('tenx_') == 0 || master == "default") {
//       // private cluster
//       $('.hide-set.hosting').addClass('hide');
//     } else {
//       $.ajax({
//         url: '/hosting/node/listStatus/' + master,
//         type: 'GET',
//         cache: false
//       }).done(function(resp) {
//         if (resp.length && resp.length > 0) {
//           var nodelist = [];
//           resp.forEach(function(node){
//             if (node.status == 'Ready' && node.role != 'master') {
//               nodelist.push('<li nodeid="' + node.id + '">' + node.nodeIps.join('/') + '</li>');
//             }
//           })
//           var result = nodelist.join('');
//           result += '<li>随机分配</li>';
//           $('#hostingTag1').html(result);
//           $('#hosting-host-1').html('随机分配');
//           $('#hosting-service-out').html('随机分配');
//           $('#hostingTag2').html(result);
//         }
//       }).fail(function(err) {
//         //
//       });
//     }
//     layer.closeAll('tips');//clear tips
//   });

//   $('article').on('click','#hostingTag1 li',function(){
//     var list = $(this).text();
//     var nodeid = $(this).attr('nodeid');
//     $('#hosting-host-1').text(list);
//     $('#hosting-service-out').attr('nodeid', nodeid);
//   });

//   $('article').on('click','#hostingTag2 li',function(){
//     var list = $(this).text();
//     var nodeid = $(this).attr('nodeid');
//     $('#hosting-service-out').text(list);
//     $('#hosting-service-out').attr('nodeid', nodeid);
//   });

//   $('.execmd').click(function() {
//     var type = $(this).val();
//     if (type === 'self') {
//       $('#execmd').removeClass('cmdtext');
//       $('#execmd').removeAttr('disabled');
//       $('#execmd').css('cursor', 'normal');
//     } else {
//       $('#execmd').addClass('cmdtext');
//       $('#execmd').attr('disabled', 'disabled');
//       $('#execmd').css('cursor', 'no-drop');
//     }
//   });

//   $('.go_backs').click(function() {
//     if (go_back_step === 1) {
//       $('.createPadding').addClass('hide');
//       $('#createButton').addClass('hide');
//       $('.host_step1').css('height','auto');
//       $('.pull_confirm').removeClass('hide');
//       $('.host_step2 .tips').html('载入容器配置中...').show();
//       $('.host_step2 .safeSet').hide();
//       $('.go_backs,.two_step').addClass('hide');
//       $('.set_container:first').find('.radius_type').hide();
//       $('.set_container:first').siblings().find('.radius_type').show();
//       // $('.set_container:first').find('.up_style').delay(200).html($('<i class="fa_check"></i><span class="radius_type" style="display: none;">1x</span>'));
//       // $('.set_container:first').siblings().find('.fa_check').remove();
//       $('.set_container:first').addClass('x1 active').siblings().removeClass('x2 x3 x4 active');
//       $('#containerName').val('');
//       $('#pullPolicy').prop('checked', true);
//       layer.closeAll('tips');
//     } else if (go_back_step === 2) {
//       $('.host_step1').css('height','300px');
//       $('.host_step3').css('height','300px');
//       $('.host_step3').addClass('hide');
//       if (isFastCreate) {
//         $('.go_backs').addClass('hide');
//       } else {
//         $('.go_backs').removeClass('hide');
//       }
//       $('.two_step').removeClass('hide');
//       // $('#createButton').addClass('hide');
//     } else if (go_back_step === 3) {
//       //
//     }
//     go_back_step --;
//     if (go_back_step < 0) {
//       go_back_step = 0;
//     }
//     // $('.host_step1').css('height','auto');
//     // @todo change click to a function
//     $('.STEPS').eq(go_back_step).click();
//     $('.radius_step').eq(go_back_step).addClass('action').siblings('').removeClass('action');
//   });

//   // for tag dropdown
//   $('#home-main').on('click','#imageTag li',function() {
//     var tag = $(this).text();
//     var oldTag = $('.select-versions .version-text').text().trim();
//     $('.version-text').text(tag);
//     if (oldTag == tag) {
//       return;
//     }
//     var image = $('#getImageName').val().split(':')[0];
//     indexTagChange = layer.load(0, {
//       shade: [0.5,'#fff'] //0.1透明度的白色背景
//     });
//     var dockerhubtag = $('#dockerhubtag').val();
//     if (dockerhubtag === 'dockerhub') {
//       _getConfigFromDockerHub(image, tag);
//       $('#getImageName').val(image +':'+ tag);
//     } else {
//       _getConfig(image, tag);
//     }

//   });
//   // for cluster dropdown
//   $('#home-main').on('click','#clusterList li',function() {
//     setCookie("b_name", $(this).index());
//     var clusterDataBefore = $('#hosting-cluster').val();
//     var clusterText = $(this).text();
//     var clusterData = $(this).attr('data');
//     if (clusterDataBefore === clusterData) {
//       return;
//     }
//     $('.clusterText').text(clusterText);
//     $('.clusterText').attr('data', clusterData);
//     $('#hosting-cluster').val(clusterData);
//     _handleMountPath(clusterData);
//     // Load clusters for link
//     _loadClustersForLink(clusterData);
//     // remove disabled instance number
//     $('.number').removeAttr('disabled');
//     $('#instanceTip').html('');
//     // change price
//     _changeConsumptionEstimate()
//   });
//   // for set config

//   $('.set_container').click(function() {
//     var config = $(this).attr('config');
//     config = config.split(',')[1].match(/\d+/)[0]
//     var pay_balance = $('#pay_balance').val();
//     if (parseInt(pay_balance) <= 0 && parseInt(config) > 512) {
//       layer.alert('该配置需充值后使用',{btn: ['去充值','取消'], icon: 0, title: '充值提示'},function(){
//         window.location.href = '/account';
//       });
//       return;
//     }

//     var num = $(this).index();
//     $(this).addClass('x'+ num);//.find('.radius_type').hide();
//     $(this).siblings().removeClass('active').find('.radius_type').fadeIn();
//     $(this).siblings().removeClass('x1 x2 x3 x4').find('i').remove();
//     if(!$(this).hasClass('active')){
//       // $(this).find('.up_style').delay(200).prepend($('<i class="fa_check"></i>'));
//       $(this).addClass('active');
//       $(this).find('.radius_type').hide();
//     }
//     _changeConsumptionEstimate()
//   });

//   // click to add env
//   $('#cratePATH').click(function() {
//     $('.envNull').remove();
//     var keys = $('.keys');
//     if (keys && keys.length  > 50) {
//       layer.msg('环境变量不能超过50个', {icon: 0});
//       return;
//     } else {
//       var name=$('#Name').val().trim();
//       var val = $('#Value').val().trim();
//       if(name == '')
//       {
//         layer.tips('Name不能为空！','#Name',{tips: [1, '#3595CC'],time: 3000});
//         $('#Name').focus();
//         return;
//       }
//       //name = name.toUpperCase();
//       if (name.search(/^[A-Za-z_][A-Za-z0-9_]*$/) === -1) {
//         layer.tips('环境变量名由字母、数字、下划线组成，且不能以数字开头', '#Name', {tips: [1, '#3595CC'], time: 3000});
//         $('#Name').focus();
//         return;
//       }
//       var checkIsExist = true;
//       $('#Path-oper tr').each(function(index, el) {
//         var existName = $(el).find('.keys').text().trim();
//         if (existName == name) {
//           layer.tips('Name已存在！','#Name',{tips: [1, '#3595CC'],time: 3000});
//           checkIsExist = false;
//           return false;
//         }
//       });
//       if (!checkIsExist) {
//         return;
//       }
//       if(val == '')
//       {
//         layer.tips('Value不能为空！','#Value',{tips: [1, '#3595CC'],time: 3000});
//         $('#Value').focus();
//         return;
//       }
//       var tr = '<tr><td class="keys"><input type="text" style="width:98%" value="'+ name +'"></td>'
//              + '<td class="vals"><input type="text" placeholder="value" value="' + val + '"></td><td><a href="javascript:void(0)"'
//              + ' onclick="deleteRow(this)" class="gray"><i class="fa fa-trash-o fa-lg"></i></a></td></tr>';
//       $('#Path-oper').append(tr);
//       $('#Name').val('');
//       $('#Value').val('');
//     }
//   });
//   // click to add port
//   $('.createPort').click(function() {
//     var portlst = $('.port');
//     if (portlst && portlst.length >= portNumber) {
//       layer.msg('容器端口不能超过' + portNumber + '个', {icon: 0});
//       return;
//     } else {
//       var tr = '<tr class="plus-row"><td><input class="port" type="text"/></td><td>\
//       <select class="T-http"><option>TCP</option><option>HTTP</option></select></td>\
//       <td><i>动态生成</i></td>\
//       <td><a href="javascript:void(0)" onclick="_deletePortRow(this)" class="gray">\
//       <i class="fa fa-trash-o fa-lg"></i></a></td></tr>';
//       $('#pushPrptpcol').append(tr);
//     }
//   });
//   /**************************************************************************
//   ******************************  link containers  **************************
//   ***************************************************************************/
//   //@TODO: get the container env and bind it, link containers
//   $('#addcontainer').click(function() {
//     var containername = $('#linkcontainers').find("option:selected").text();
//     if(!containername || containername==''){
//       layer.tips('没有容器可以链接','#linkcontainers',{tips: [1, '#3595CC']});
//       return;
//     }
//     var containernickname = $('#containernickname').val();
//     if(containernickname == ''){
//      layer.tips('请输入内容','#containernickname',{tips: [1, '#3595CC']});
//      return;
//     }
//     var checkIsAdd = false;
//     $('#linkcontainerbody tr').each(function(index, el) {
//       var rcName = $(el).find('td:first').text().trim();
//       if (rcName == containername) {
//         layer.tips('该容器已添加','#linkcontainers',{tips: [1, '#3595CC']});
//         checkIsAdd = true;
//         return false;
//       }
//     });
//     if (checkIsAdd) {
//       return;
//     }
//     var index = layer.load(0, {
//       shade: [0.5,'#fff'] //0.1透明度的白色背景
//     });
//     $('#linkcontainerbody').append('<tr><td style="width:40%">' + containername + '</td>\
//       <td style="width:40%">' + containernickname + '</td><td style="width:20%"><a href="javascript:void(0)" onclick="deleteRow(this,\'.append-path-value\')" class="gray"><i class="fa fa-trash-o fa-lg"></i></a></td></tr>');
//     $('#linkcontainertb').show();
//     var master = $('#hosting-cluster').val();
//     if (!master || master.trim() == '') {
//       master = 'default';
//     }
//     //@TODO: link containers, list containers
//     $.ajax({
//       url: '/clusters/' + master + '/' + containername + '/getenv',
//       type: 'GET',
//       cache: false
//     }).done(function (resp) {
//       $('#Path').removeClass('hide');
//       resp.envs.forEach(function (env) {
//         $.each(env, function(name, value) {
//           var tr = '<tr class="append-path-value"><td class="keys"><input type="text" value='+name+' class="keys" style="width:98%"/></td>'
//                  +'<td class="vals"><input type="text" value="'+value+'"></td><td class="func"><a href="javascript:void(0)" onclick="deleteRow(this)" class="gray"><i class="fa fa-trash-o fa-lg"></i></a></td></tr>';
//           $('#Path-oper').append(tr);
//         });
//       });
//     }).fail(function (error) {
//       //
//     }).complete(function () {
//       layer.close(index);
//     })
//     $('#Name').val('');
//     $('#Value').val('');
//     $('#containernickname').val('');
//     // $(this).unbind();
//   });
//   /**************************************************************************
//   ***************************  Create new containers  ***********************
//   ***************************************************************************/
//   $('#createButton').click(function () {
//     // console.log(mountPath);
//     var master = $('#hosting-cluster').val();
//     var name = $('#containerName').val().trim();
//     var image = $('#getImageName').val().trim();
//     // var image = $('#imageName').text() + ':' + $('.imageName .version-text').text();
//     var config = $('.set_container.active').attr('config');
//     // Define the pull policy for new container
//     var pullPolicy = $('input[name="pullPolicy"]:checked').length;
//     var syncTimezone = $('input[name="syncTimezone"]:checked').length;
//     var storageInfo;
//     var env = [];
//     var ports = [];
//     var number = 1;
//     name = name.toLowerCase();

//     // if user click create in step 2 ,check the name、number ...
//     if (go_back_step == 1) {
//       // check the name of container
//       if(!name || name.length < 1){
//         layer.tips('容器名称不能为空','#containerName',{tips: [1, '#3595CC']});
//         $('#containerName').focus();
//         return;
//       }
//       name = name.toLowerCase();
//       if(name.search(/^[a-z][a-z0-9-]*$/) === -1){
//         layer.tips('容器名称只能由字母、数字及横线组成，且首字母不能为数字及横线。','#containerName',{tips: [1, '#3595CC'],time: 3000});
//         $('#containerName').focus();
//         return;
//       }
//       if(name.length > 24 || name.length < 3){
//         layer.tips('容器名称为3~24个字符','#containerName',{tips: [1, '#3595CC'],time: 3000});
//         $('#containerName').focus();
//         return;
//       }
//       // check number of containers
//       if(!$('#instsize').is(':hidden')){
//         var numberStr = $('#instsize .number').val();
//         if(!numberStr){
//           layer.tips('请填写实例数量','#instsize .number',{tips: [1, '#3595CC'],time: 3000});
//           return;
//         }
//         number = parseInt(numberStr);
//         /*if (number > 3) {
//           layer.tips('实例数量不允许超过3个','#instsize .number',{tips: [1, '#3595CC'],time: 3000});
//           return;
//         }
//         if (number < 1) {
//           layer.tips('实例数量填写错误','#instsize .number',{tips: [1, '#3595CC'],time: 3000});
//           return;
//         }*/
//       }
//       // check payment
//       if (master == 'tenx_district_us' || master == 'tenx_district2' || master == 'tenx_district3') {
//         //remaining
//         var pay_balance = $('#pay_balance').val();
//         var grant_balance = $('#grant_balance').val();
//         if (parseInt(pay_balance) <= 0) {
//           if (parseInt(grant_balance) > 0) {
//             layer.alert('该区仅限付费用户使用，您的充值余额不足，请充值后使用或选择北京一区创建',{btn: ['去充值','取消'], icon: 0, title: '帐户余额不足'},function(){
//               window.location.href = '/account';
//             });
//             return;
//           } else {
//             layer.alert('您的充值余额不足，请充值后使用',{btn: ['去充值','取消'], icon: 0, title: '帐户余额不足'},function(){
//               window.location.href = '/account';
//             });
//             return;
//           }
//         } else if (parseInt(pay_balance) < parseInt($('#consumptionEstimate').text()) * 24) {
//           layer.alert('您的充值余额不足以使用该容器一天，请充值后使用',{btn: ['去充值','取消'], icon: 0, title: '帐户余额不足'},function(){
//             window.location.href = '/account';
//           });
//           return;
//         }
//       } else {
//         var sum_balance = $('#sum_balance').val();
//         if (parseInt(sum_balance) <= 0) {
//           layer.alert('您的帐户余额不足，请充值后使用',{btn: ['去充值','取消'], icon: 0, title: '帐户余额不足'},function(){
//             window.location.href = '/account';
//           });
//           return;
//         } else if (parseInt(sum_balance) < parseInt($('#consumptionEstimate').text()) * 24) {
//           layer.alert('您的帐户余额不足以使用该容器一天，请充值后使用',{btn: ['去充值','取消'], icon: 0, title: '帐户余额不足'},function(){
//             window.location.href = '/account';
//           });
//           return;
//         }
//       }

//       // check volume
//       if($('#state_service').is(':checked') && !$('#state_service').attr('disabled')){
//         var isVolumeCreate = $('#save_roll_dev').attr('create');
//         if (isVolumeCreate && isVolumeCreate == 1) {
//           layer.tips('请先创建一个存储卷，或取消有状态服务', '#fastCreateVolume', {tips: [1, '#3595CC'],time: 3000});
//           return;
//         }
//         var isSelectVolume = true;
//         $('#mountPathList li').each(function (index, el) {
//           if ($(el).find('.selectVolume').val() == 0) {
//             isSelectVolume = false;
//             layer.tips('请选择一个存储卷，或取消有状态服务', $(el).find('.selectVolume'), {tips: [1, '#3595CC'],time: 3000});
//             return false;
//           }
//         });
//         if (!isSelectVolume) {
//           return;
//         }
//       }
//     }
//     // 1.Get mountpath
//     if($('#state_service').attr('stateless') != 1 && $('#state_service').is(':checked')){
//       storageInfo = {type:'', data: []};
//       if (master == "default" || master == "tenx_district_us") {
//         storageInfo.type = 'public';
//       } else {
//         storageInfo.type = 'private';
//       }
//       $('#mountPathList .mount').each(function(index, el) {
//         var mountPathVal = $(el).find('.ve_top').text().trim();
//         var diskName = $(el).find('.selectVolume').val();
//         var isReadonly = $(el).find('.isVolumeReadonly').prop("checked");
//         if (diskName != 0) {
//           var mountData = {};
//           mountData.mountPath = mountPathVal;
//           mountData.diskName = diskName;
//           mountData.readOnly = isReadonly;
//           mountData.uid = $('option[value='+ diskName +']').attr('uid');
//           mountData.format = $('option[value='+ diskName +']').attr('format');
//           storageInfo.data.push(mountData);
//         }
//       });
//     }
//     // console.log(storageInfo);
//     // 2.Get env
//     var checkEnv = true;
//     $('#Path-oper tr').each(function(index, el) {
//       // Skip undefined values
//       if ($(el).find('.keys input').val() === undefined) {
//         return;
//       }
//       var key = $(el).find('.keys input').val().trim();
//       var value = $(el).find('.vals input').val().trim();
//       var oldValue = $(el).find('.oldValue').val();

//       // key = key.toUpperCase();
//       if (!oldValue && (!key || key == '')) {
//         if (go_back_step == 1) {
//           $('.two_step').click();
//         }
//         layer.tips('请填写环境变量名', $(el).find('.keys input'), {tips: [1, '#3595CC'], time: 3000});
//         $(el).find('.keys input').focus();
//         checkEnv = false;
//         return false;
//       }
//       if (key.search(/^[A-Za-z_][A-Za-z0-9_]*$/) === -1) {
//         if (go_back_step == 1) {
//           $('.two_step').click();
//         }
//         layer.tips('环境变量名由字母、数字、下划线组成，且不能以数字开头', $(el).find('.keys input'), {tips: [1, '#3595CC'], time: 3000});
//         $(el).find('.keys input').focus();
//         checkEnv = false;
//         return false;
//       }
//       if (oldValue === undefined && (!value || value == '')) {
//         if (go_back_step == 1) {
//           $('.two_step').click();
//         }
//         layer.tips('请填写环境变量值', $(el).find('.vals'), {tips: [1, '#3595CC'], time: 3000});
//         $(el).find('.vals input').focus();
//         checkEnv = false;
//         return false;
//       }
//       if (value && value != '' && value != oldValue) {
//         var envItem = {};
//         envItem.name = key;
//         envItem.value = value;
//         env.push(envItem)
//       }
//     });
//     if (!checkEnv) {
//       return;
//     }
//     // console.log(env);
//     // 3.Get ports
//     var checkPort = true;
//     if ($('#pushPrptpcol tr.plus-row').length > portNumber) {
//       layer.msg('容器端口不能超过' + portNumber + '个', {icon: 0});
//       return;
//     }
//     var portObj ={};
//     $('#pushPrptpcol tr.plus-row').each(function(index, el) {
//       var port = $(el).find('.port').val();
//       var protocol = $(el).find('.T-http').val();
//       if (!port || port.trim() == '') {
//         if (go_back_step == 1) {
//           $('.two_step').click();
//         }
//         layer.tips('请填写端口', $(el).find('.port'), {tips: [1, '#3595CC'], time: 3000});
//         $(el).find('.port').focus();
//         checkPort = false;
//         return false;
//       }
//       port = parseInt(port);
//       if (isNaN(port) || port < 1 || port > 65535) {
//         if (go_back_step == 1) {
//           $('.two_step').click();
//         }
//         layer.tips('端口格式填写错误', $(el).find('.port'), {tips: [1, '#3595CC'], time: 3000});
//         $(el).find('.port').focus();
//         checkPort = false;
//         return false;
//       }
//       if (!portObj[port]) {
//         var portItem = {};
//         portItem.port = port;
//         portItem.protocol = protocol;
//         ports.push(portItem);
//         portObj[port] = 1;
//       }
//     });
//     if (!checkPort) {
//       return;
//     }
//     // CMD
//     var cmd = $('#execmd').val();
//     var isDefault = $('#execmd').hasClass('cmdtext');
//     if (isDefault === true) {
//       cmd = null;
//     }
//     var json = {
//       name: name,
//       image: image,
//       imageType: $('#imageType').val(),
//       pullPolicy: pullPolicy,
//       syncTimezone: syncTimezone,
//       ports: ports,
//       env: env.length > 0 ? env: null,
//       config: config,
//       size: number,
//       mountPath: mountPath,
//       labels: {name: name},
//       cmd: cmd,
//       storageInfo: storageInfo
//     }
//     if(!(master.indexOf('tenx_') == 0 || master == "default")) {
//       json.hostingHost = $('#hosting-host-1').attr('nodeid');
//       if($('#hosting-service-out').attr('nodeid')) {
//         json.hostingServiceOut = $('#hosting-service-out').attr('nodeid');
//       } else {
//         var nums = $('#hostingTag2 li').length-1;
//         var lis = Math.floor(Math.random()*nums);
//         json.hostingServiceOut = $('#hostingTag2 li').eq(lis).attr('nodeid');
//       }
//     }
//     var info = JSON.stringify(json);
//     // show loading~
//     index = layer.load(0, {
//       shade: [0.5,'#fff'] //0.1透明度的白色背景
//     });
//     $.ajax({
//       url: '/containers/'+master+'/create',
//       type: 'POST',
//       data: info ,
//       contentType: 'application/json',
//       dataType: 'json'
//     }).done(function (cluster) {
//       window.location = '/containers?0';
//     }).fail(function (err) {
//       if(err.responseJSON.message){
//         layer.alert(JSON.stringify(err.responseJSON.message),{icon: 0, title: '创建失败'});
//       } else if(err.responseJSON){
//         layer.alert(err.responseJSON,{icon: 0, title: '创建失败'});
//       } else {
//         layer.msg('创建容器失败',{icon: 2});
//       }
//     }).complete(function () {
//       layer.close(index);
//     });
//   });
//   $('article').on('click','.dock-dropdown li',function(){
//     var text = $(this).text();
//     $(this).parents().siblings('.pushText').val(text);
//   })
// });

// /**************************************************************************
// ***************************  some functions  ******************************
// ***************************************************************************/
// var go_back_step = 0;
// var isFastCreate = false;

// function _insertTwoStep(imageInfo, dockerhub) {
//   $('.host_step1').css('height','300px');
//   $('.radius_step').eq(go_back_step).addClass('action').siblings('').removeClass('action');
//   if (isFastCreate) {
//     $('.go_backs').addClass('hide');
//   } else {
//     $('.go_backs').removeClass('hide');
//   }
//   $('.two_step').removeClass('hide');
//   // Create step 2
//   createContainerSteps(imageInfo, dockerhub);
//   var data = $('body').data('num');
//   setTimeout(function(){
//     if(data && data== 3){
//       _leadAction('cluster_index_step3', '#containerName', 3);
//       $('body').removeData('num')
//     }
//   }, 500);
// }

// // handle ajax of get repos
// var _getTopRepositoriesAjax;
// var _getSystemRepositoriesAjax;
// var _getPrivateRepositoriesAjax;
// var _getPublicRepositoriesAjax;
// var _getFavoritesRepositoriesAjax;
// var _searchReposAjax;
// var _searchDockerHubAjax;
// var _getStacksAjax;

// function _handleReposAjax() {
//   if (_getTopRepositoriesAjax) {
//     _getTopRepositoriesAjax.abort();
//   }
//   if (_getSystemRepositoriesAjax) {
//     _getSystemRepositoriesAjax.abort();
//   }
//   if (_getPrivateRepositoriesAjax) {
//     _getPrivateRepositoriesAjax.abort();
//   }
//   if (_getPublicRepositoriesAjax) {
//     _getPublicRepositoriesAjax.abort();
//   }
//   if (_getFavoritesRepositoriesAjax) {
//     _getFavoritesRepositoriesAjax.abort();
//   }
//   if (_searchReposAjax) {
//     _searchReposAjax.abort();
//   }
//   if (_searchDockerHubAjax) {
//     _searchDockerHubAjax.abort();
//   }
//   if (_getStacksAjax) {
//     _getStacksAjax.abort();
//   }
// }

// // load docker top registry images
// function _getTopRepositories() {
//   _handleReposAjax();
//   $('#systemImages').html('<div class="loadimages"><i>正在加载...</i></div>');
//   _getTopRepositoriesAjax = $.ajax({
//     url: '/docker-registry/toplist',
//     type: 'GET',
//     cache: false
//   }).done(function(resp) {
//     _insertRepositories(resp, 'systemImages');
//   }).fail(function(err) {
//     _handleServerError(err, '#systemImages');
//   });
// }

// // load docker system registry images
// function _getSystemRepositories(type) {
//   _handleReposAjax();
//   $('#systemImages').html('<div class="loadimages"><i>正在加载...</i></div>');
//   _getSystemRepositoriesAjax = $.ajax({
//     url: '/docker-registry/systemlist?search=' + type,
//     type: 'GET',
//     cache: false
//   }).done(function(resp) {
//     _insertRepositories(resp, 'systemImages', type);
//   }).fail(function(err) {
//     _handleServerError(err, '#systemImages');
//   });
// }

// // load docker private registry images
// function _getPrivateRepositories() {
//   _handleReposAjax();
//   $('#privateImages').html('<div class="loadimages"><i>正在加载...</i></div>');
//   _getPrivateRepositoriesAjax = $.ajax({
//     url: '/docker-registry/mylist',
//     type: 'GET',
//     cache: false
//   }).done(function(resp) {
//     _insertRepositories(resp, 'privateImages');
//   }).fail(function(err) {
//     _handleServerError(err, '#privateImages');
//   });
// }

// // load docker public registry images
// function _getPublicRepositories() {
//   _handleReposAjax();
//   $('#publicImages').html('<div class="loadimages"><i>正在加载...</i></div>');
//   _getPublicRepositoriesAjax = $.ajax({
//     url: '/docker-registry/publiclist',
//     type: 'GET',
//     cache:false
//   }).done(function(resp) {
//     _insertRepositories(resp, 'publicImages');
//   }).fail(function(err) {
//     _handleServerError(err, '#publicImages');
//   });
// }

// // load docker favorites registry images
// function _getFavoritesRepositories() {
//   _handleReposAjax();
//   $('#favoritesImages').html('<div class="loadimages"><i>正在加载...</i></div>');
//   _getFavoritesRepositoriesAjax = $.ajax({
//     url: '/docker-registry/myfavlist',
//     type: 'GET',
//     cache: false
//   }).done(function(resp) {
//     _insertRepositories(resp, 'favoritesImages');
//   }).fail(function(err) {
//     _handleServerError(err, '#favoritesImages');
//   });
// }
// function _searchRepos() {
//   _handleReposAjax();
//   $('#searchImages').html('<div class="loadimages"><i>正在加载...</i></div>');
//   var query = $('#search-img').val();
//   _searchReposAjax = $.ajax({
//     url: '/docker-registry/list?q=' + query,
//     type: 'GET',
//     cache: false
//   }).done(function(resp) {
//     _insertRepositories(resp, 'searchImages');
//   }).fail(function(err) {
//     _handleServerError(err, '#searchImages');
//   });
// }

// function _searchDockerHub(query) {
//   _handleReposAjax();
//   $('#searchImages').html('<div class="loadimages"><i>正在加载...</i></div>');
//   _searchDockerHubAjax = $.ajax({
//     url: '/docker-hub/searchRepos?query=' + query + '&num=1',
//     type: 'GET',
//     cache: false
//   }).done(function(resp) {
//     _insertDockerHubRepositories(resp, 'searchImages');
//   }).fail(function(err) {
//     $('#searchImages').html('<div class="loadimages"><i>镜像服务器异常，请稍候重试！</i></div>');
//     //_handleServerError(err, '#searchImages');
//   });
// }

// function _getStacks(type) {
//   _handleReposAjax();
//   $('#stackImages').html('<div class="loadimages"><i>正在加载...</i></div>');
//   _getStacksAjax = $.ajax({
//     url: '/stack/list/' + type,
//     type: 'GET',
//     cache: false
//   }).done(function(resp) {
//     _insertStacks(resp, 'stackImages');
//   }).fail(function(err) {
//     _handleServerError(err, '#stackImages');
//   });
// }
// // insert registry images to page
// function _insertRepositories(resp, place, type) {
//   $('#' + place).empty();
//   if (resp && resp.length > 0) {
//     // var count = 0;
//     resp.forEach(function(image) {
//       if (!type || image.category === type || type === 'docker_library') {
//         // count++;
//         var imageDiv;
//         var tags = '';
//         if (image.tags && image.tags.length>0) {
//           image.tags.forEach(function(tag) {
//             tags += ',' + tag;
//           });
//           tags = tags.substr(1);
//         }
//         image.icon = handelImageIcon(image.icon);
//         imageDiv = $('<div class="image-item"><span class="img_icon span2"><img src="'+image.icon+'?imageView3/2/h/50"></span>'
//         + '<span class="span6 type" type="' + image.category + '"><div class="list-item-description"><div class="name h4">'
//         + image.name + ' <a title="点击查看镜像详情" target="_blank" href="https://hub.tenxcloud.com/repos/' + image.name
//         + '"><i class="fa fa-external-link-square"></i></a></div><span class="span9" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' + (image.description ? image.description : "无") + '</span></div></span><span class="span2"><div class="list-item-description">'
//         + ((place == 'searchImages') ? '<span class="id h5"> </span>':'')
//         + '<span class="pull-deploy btn btn-primary" data-attr="'+image.name+'">部署<i class="fa fa-arrow-circle-o-right margin fa-lg"></i> </span></div></span>'
//         + '</div>');
//         imageDiv.appendTo($('#' + place));
//       }
//     });
//     if($('#' + place).html().trim() === ''){
//       $('#' + place).html('<div class="loadimages"><i>无</i></div>');
//     }
//   } else {
//     $('#' + place).html('<div class="loadimages"><i>无</i></div>');
//   }
//   // _leadAction('cluster_index_step2', '#defaultImages .image-item', 2);
//   $('[data-toggle="tooltip"]').tooltip();
// }

// // insert stack images to page
// function _insertStacks(resp, place, type) {
//   $('#' + place).empty();
//   if (resp && resp.length > 0) {
//     resp.forEach(function(stack) {
//       stack.photo = handelImageIcon(stack.photo);
//       var stackDiv = $('<div class="image-item"><span class="img_icon span2"><img src="' + stack.photo +'?imageView3/2/h/50"></span>'
//       + '<span class="span6"><div class="list-item-description"><div class="name h4">'
//       + stack.name + ' <a title="点击查看 Stack" href="/stack?0">'
//       + '<i class="fa fa-external-link-square"></i></a></div><span class="span9 text-overflow">' + stack.description +'</span></div></span><span class="span2"><div class="list-item-description">'
//       + '<span class="pull-deploy-stack btn btn-primary" stack_id="' + stack.id + '">部署<i class="fa fa-arrow-circle-o-right margin fa-lg"></i> </span></div></span>'
//       + '</div>');
//       stackDiv.appendTo($('#' + place));
//     });
//     if($('#' + place).html().trim() === ''){
//       $('#' + place).html('<div class="loadimages"><i>无</i></div>');
//     }
//   } else {
//     $('#' + place).html('<div class="loadimages"><i>无</i></div>');
//   }
//   $('[data-toggle="tooltip"]').tooltip();
// }

// // insert registry images to page
// function _insertDockerHubRepositories(resp, place, type) {
//   $('#' + place).empty();
//   if (resp && resp.results.length > 0) {
//     // var count = 0;
//     resp.results.forEach(function(image) {
//       // count++;
//       var imageDiv;
//       var imageUri = image.repo_name.indexOf('/') != -1 ? "https://hub.docker.com/r/" : "https://hub.docker.com/_/";
//       imageDiv = $('<div class="image-item"><span class="img_icon span2"><img src="/images/dockerhub.png"></span>'
//       + '<span class="span6 type" type=""><div class="list-item-description"><div class="name h4"><span style="float:left; margin-right: 30px">'
//       + image.repo_name + ' <a title="点击查看镜像详情" target="_blank" href="' + imageUri + image.repo_name
//       + '/"><i class="fa fa-external-link-square"></i></a></span><span style="font-size:14px"><span class="span2"> <i class="cloud_download"></i><span class="number">' + image.pull_count + '</span>'
//       + '</span><i class="fa fa-star-o"></i> <span class="star">' + image.star_count
//       + '</span></span></div><span class="span9" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' + (image.short_description ? image.short_description : '无') + '</span></div></span><span class="span2"><div class="list-item-description">'
//       + '<span class="pull-deploy-dockerhub btn btn-primary" data-attr="index.docker.io/'+image.repo_name+'">部署<i class="fa fa-arrow-circle-o-right margin fa-lg"></i> </span></div></span>'
//       + '</div>');
//       imageDiv.appendTo($('#' + place));
//     });
//     if($('#' + place).html().trim() === ''){
//       $('#' + place).html('<div class="loadimages"><i>无</i></div>');
//     }
//   } else {
//     $('#' + place).html('<div class="loadimages"><i>该镜像不存在</i></div>');
//   }
//   // _leadAction('cluster_index_step2', '#defaultImages .image-item', 2);
//   $('[data-toggle="tooltip"]').tooltip();
// }
// function _handleServerError(err, divIdShowMessage) {
//   var divToFill = $(divIdShowMessage);
//   divToFill.html(''); // clear the list
//   divToFill.css('visibility','visible');
//   if (err.status === 500) {
//     divToFill.html('<div id="nodata" class="nodata"><i>镜像服务器正在维护当中，请稍后重试...</i></div>');
//   } else if(err.status !== 0) {
//     //Using the Firefox, When the page Jump Ajax request error: {"readyState": "0", "status:" "0", "statusText": error}
//     divToFill.html('服务器错误: ' + JSON.stringify(err));
//   }
// }

// function createContainerSteps(imageInfo, dockerhub){
//   $('#param_list').empty();
//   $('#imageTag').empty();
//   $('#imageType').val(imageInfo.type);
//   if (imageInfo) {
//     if (imageInfo.tags && imageInfo.tags[0]) {
//       // Use 'latest' tag by default
//       var latestIndex = imageInfo.tags.indexOf("latest");
//       if (latestIndex > 0) {
//         imageInfo.tags.splice(latestIndex, 1);
//         imageInfo.tags.splice(0, 0, "latest");
//       }
//       // insert tags
//       $('.version-text').text(imageInfo.tags[0]);
//       imageInfo.tags.forEach(function(tag) {
//         $('#imageTag').append('<li>' + tag + '</li>');
//       })
//       // get image config info
//       if (dockerhub === 'dockerhub') {
//         _getImageConfigFromDockerHub(imageInfo.name, imageInfo.tags[0]);
//       } else {
//         _getImageConfig(imageInfo.name, imageInfo.tags[0]);
//       }
//     } else {
//       // get image config info
//       if (dockerhub === 'dockerhub') {
//         _getImageConfigFromDockerHub(imageInfo.name);
//       } else {
//         _getImageConfig(imageInfo.name);
//       }
//     }
//     $('#createButton').removeAttr('disabled');
//     var imageCutName = imageInfo.name.substr(imageInfo.name.indexOf('/') + 1);
//     if(imageInfo.type === 'os' || imageInfo.type === 'database'){
//       // $('#number').val('1');
//       $('#instsize').hide();
//     } else {
//       $('#instsize').show();
//     }
//     /**
//     if(imageInfo.type === 'os'){
//       $('#instNotice').show();
//     } else {
//       $('#instNotice').hide();
//     }**/
//   } else {
//     $('.imageName').html('<i>无</i>');
//     $('#createButton').attr('disabled', 'disabled');
//     layer.tips('请返回上一步选择镜像','.go_backs',{tips: [1, '#3595CC'],time: 3000});
//   }
// }

// function _getImageConfig(image, tag) {
//   $('.host_step2 .tips').html('载入容器配置中...');
//   $('.two_step').attr('disabled', 'disabled');
//   if (!tag) {
//     $('#imageTag').empty();
//     $.ajax({
//       url: '/docker-registry/getImagetags?imageName=' + image,
//       type: 'GET',
//       cache: false
//     }).done(function(resp) {
//       if (resp[0]) {
//         var latestIndex = resp.indexOf("latest");
//         if (latestIndex > 0) {
//           resp.splice(latestIndex, 1);
//           resp.splice(0, 0, "latest");
//         }
//         _getConfig(image, resp[0]);
//         $('.version-text').text(resp[0]);
//         resp.forEach(function (tag) {
//           $('#imageTag').append('<li>' + tag + '</li>');
//         })
//       } else {
//         $('.host_step2 .tips').html('该镜像没有tag，无法创建容器。');
//       }
//     }).fail(function (err) {
//       $('.host_step2 .tips').html('载入容器配置失败，请点击<a href="javascript:_getImageConfig(\'' + image + '\',\'' + tag + '\')">重试</a>');
//     });
//   } else {
//     _getConfig(image, tag);
//   }
// }

// function _getImageConfigFromDockerHub(image, tag) {
//   $('.host_step2 .tips').html('载入容器配置中...');
//   $('.two_step').attr('disabled', 'disabled');
//   image = image.replace('index.docker.io/', '');
//   $('#imageTag').empty();
//   $.ajax({
//     url: '/docker-hub/getImagetags?imageName=' + image,
//     type: 'GET',
//     cache: false
//   }).done(function(resp) {
//     var tags = Object.keys(resp);
//     if (resp && tags && tags.length > 0) {
//       for (var index in tags) {
//         $('#imageTag').append('<li>' + tags[tags.length - 1 - index] + '</li>');
//       }
//       $('#imageTag').append('<li><input id="dockerhubtag" type="hidden" value="dockerhub" /></li>');
//       var matchTag;
//       if (tag) {
//         matchTag = tag;
//       } else {
//         if (tags.indexOf('latest') >=0) {
//           matchTag = 'latest';
//         }  else {
//           matchTag = tags[0];
//         }
//       }
//       $('.version-text').text(matchTag);
//       _getConfigFromDockerHub(image, matchTag);
//     } else {
//       $('.host_step2 .tips').html('该镜像没有tag，无法创建容器。');
//     }
//   }).fail(function (err) {
//     $('.host_step2 .tips').html('载入容器配置失败：' + err.responseText + '，点击<a href="javascript:_getImageConfigFromDockerHub(\'' + image + '\',\'' + tag + '\')">重试</a>');
//   });
// }

// var indexTagChange;

// function _getConfig(image, tag) {
//   if (!tag || tag.trim() === 'undefined') {
//     layer.alert('镜像版本选择错误，点击确定重新加载镜像版本', {icon: 0}, function (index) {
//       $('[data-attr="' + image + '"]').click()
//       $('.host_step2 .tips').html('载入容器配置中...')
//       layer.close(index)
//     })
//     return
//   }
//   var imageSrc = 'https://dn-tenxstore.qbox.me/' + image.replace('/', '_') + '.png';
//   var iconHtml = '<img style="width: 25px" src="' + imageSrc + '?imageView3/2/h/30">';
//   $('.imageName').html(iconHtml + ' index.tenxcloud.com/<span id="imageName">'+ image + '</span>:<span class="version-text">'+ tag +'</span>');
//   $('#getImageName').val(image +':'+ tag);
//   $.ajax({
//     url: '/docker-registry/getconfig?imageName=' + image + '&tag=' + tag,
//     type: 'GET',
//     cache: false
//   }).done(function(resp) {
//     _insertConfigInfo(resp);
//   }).fail(function (err) {
//     $('.host_step2 .tips').html('载入容器配置失败，请点击<a href="javascript:_getImageConfig(\'' + image + '\',\'' + tag + '\')">重试</a>');
//     // layer.msg("服务器错误，请点击重试。",{icon: 8});
//   }).complete(function () {
//     if (indexTagChange) {
//       layer.close(indexTagChange);
//     }
//   });
// }

// function _getConfigFromDockerHub(image, tag) {
//   var imageSrc = 'https://dn-tenxstore.qbox.me/' + image.replace('/', '_') + '.png';
//   var iconHtml = '<img style="width: 25px" src="' + imageSrc + '?imageView3/2/h/30">';
//   // in case it has prefix index.docker.io/
//   image = image.replace('index.docker.io/', '');
//   $('.imageName').html(iconHtml + ' <span id="imageName">index.docker.io/'+ image + '</span>:<span class="version-text">'+ tag +'</span>');
//   $('#getImageName').val('index.docker.io/' + image +':'+ tag);
//   $.ajax({
//     url: '/docker-hub/getconfig?imageName=' + image + '&imageTag=' + tag,
//     type: 'GET',
//     cache: false
//   }).done(function(resp) {
//     _insertConfigInfo(resp);
//   }).fail(function (err) {
//     $('.host_step2 .tips').html('载入容器配置失败，请点击<a href="javascript:_getImageConfig(\'' + image + '\',\'' + tag + '\')">重试</a>');
//     // layer.msg("服务器错误，请点击重试。",{icon: 8});
//   }).complete(function () {
//     if (indexTagChange) {
//       layer.close(indexTagChange);
//     }
//   });
// }

// var portNumber;
// var mountPath;
// function _insertConfigInfo(imageInfo) {
//   var envText = '';
//   var defaultEnv;
//   mountPath = imageInfo.mountPath;
//   if (imageInfo.cmd) {
//     $('#execmd').val(imageInfo.cmd);
//   }
//   if (imageInfo.entrypoint && imageInfo.entrypoint.length > 0) {
//     $('#entrypoint').val(imageInfo.entrypoint.join(' '));
//   }
//   // 1.insert mountPath of config
//   var master = $('#hosting-cluster').val();
//   _handleMountPath(master);
//   // 2.insert env of config
//   $('#Path-oper').empty();
//   if (imageInfo && imageInfo.defaultEnv) {
//     imageInfo.defaultEnv.forEach(function (env) {
//       var envArray = env.split('=');
//       var tr = '<tr><td class="keys"><input type="text" style="line-height:20px; width:98%" disabled value="' + envArray[0] + '"></td>'
//              + '<td class="vals"><input style="line-height:20px;" type="text" placeholder="value" value="' + envArray[1]
//              + '"></td><td class="func"><a href="javascript:void(0)" onclick="deleteRow(this)" class="gray">'
//              + '<i class="fa fa-trash-o fa-lg"></i></a><input style="line-height:20px;" type="hidden" class="oldValue" value="' + envArray[1]
//              + '"></td></tr>';
//       $('#Path-oper').append(tr);
//     });
//   } else {
//     $('#Path-oper').html('<tr class="envNull"><td colspan="3" align="center"><i>镜像未配置环境变量</i></td>');
//   }
//   // 3.insert ports of config
//   $('#pushPrptpcol').empty();
//   if (imageInfo.containerPorts) {
//     portNumber = imageInfo.containerPorts.length;
//     portNumber = (portNumber > 10) ? portNumber : 10;
//     imageInfo.containerPorts.forEach(function (port) {
//       var portArray = port.split('/');
//       var selected = "";
//       if (portArray[0] == 80 || portArray[0] == 8080) {
//         selected = "selected";
//       }
//       if(master.indexOf('tenx_') == 0 || master == "default") {
//         var tr = '<tr class="plus-row"><td><input style="height:30px;line-height:10px;" class="port" type="text" disabled value="' + portArray[0] + '"/></span></td><td>\
//         <select style="height:30px;line-height:10px;" class="T-http"><option>TCP</option><option ' + selected + '>HTTP</option></select></td>\
//         <td><i>动态生成</i></td>\
//         <td><a href="javascript:void(0)" onclick="_deletePortRow(this)" class="gray">\
//         <i class="fa fa-trash-o fa-lg"></i></a></td></tr>';
//         $('#pushPrptpcol').append(tr);
//       } else {
//         var tr = '<tr class="plus-row"><td><input style="height:30px;line-height:10px;" class="port" type="text" disabled value="' + portArray[0] + '"/></span></td><td>\
//         <select style="height:30px;line-height:10px;" class="T-http" disabled="disabled"><option>TCP</option><option ' + selected + '>HTTP</option></select></td>\
//         <td><i>动态生成</i></td>\
//         <td><a href="javascript:void(0)" onclick="_deletePortRow(this)" class="gray">\
//         <i class="fa fa-trash-o fa-lg"></i></a></td></tr>';
//         $('#pushPrptpcol').append(tr);
//       }
//     })
//   } else {
//     var tr = '<tr class="plus-row"><td><input class="port" type="text"/></span></td><td>\
//     <select class="T-http"><option>TCP</option><option>HTTP</option></select></td>\
//     <td><i>动态生成</i></td>\
//     <td><a href="javascript:void(0)" onclick="_deletePortRow(this)" class="gray">\
//     <i class="fa fa-trash-o fa-lg"></i></a></td></tr>';
//     $('#pushPrptpcol').append(tr);
//     // $('#pushPrptpcol').html('<tr class="portsNull"><td colspan="5" align="center"><i>镜像未配置端口</i></td>')
//   }
//   $('.host_step2 .tips').hide();
//   $('.host_step2 .safeSet').show();
//   $('.two_step').removeAttr('disabled');

//   $('#pushdevroll').on('click','.dropdown-position li',function() {
//     var list = $(this).text();
//     $(this).parent().siblings().find('.hostingText').text(list);
//   });
// }

// function _handleMountPath(hostinCluster) {
//   if (hostinCluster != 'default' && hostinCluster != 'tenx_district2' && hostinCluster != 'tenx_district3' && hostinCluster != 'tenx_district_us') {
//     $('#save_roll_dev').hide();
//     $('#save_roll').hide();
//     $('#state_service').prop("checked", true);
//     $('#state_service').prop("disabled", true);
//     $('#state_service').attr('stateless', 1);
//     $('#service_type .update-mi font').html('无状态服务')
//     return;
//   }
//   if (!mountPath || mountPath.length < 1) {
//     $('#save_roll_dev').hide();
//     $('#save_roll').hide();
//     $('#state_service').prop("checked", true);
//     $('#state_service').prop("disabled", true);
//     $('#state_service').attr('stateless', 1);
//     $('#service_type .update-mi font').html('无状态服务')
//     $('#service_type .update-mi .mountTips').html('（该镜像未配置volume）');
//   } else {
//     $('#state_service').prop("disabled", false);
//     $('#service_type .update-mi .mountTips').html('');
//     $('#service_type').show();
//     $('#state_service').prop("checked", false);
//     $('#state_service').attr('stateless', 0);
//     $('#service_type .update-mi font').html('有状态服务');
//     // TODO: check this option and disable it
//     if (!hostinCluster || hostinCluster.trim() == '') {
//       hostinCluster = 'default';
//     }
//     /*if (hostinCluster != 'tenx_district2') {
//       $('#state_service').prop("checked", true);
//       $('#state_service').prop("disabled", true);
//     }*/
//     $('#save_roll_dev').hide();
//     $('#save_roll').hide();
//   }
// };

// // List private cluster option
// function _getmasters() {
//   $.ajax({
//     url: '/hosting/master/list',
//     type: 'GET',
//     cache: false
//   }).done(function(resp) {
//     resp.clusters.forEach(function (cluster) {
//       var clusterHtml = '<li data="' + cluster.cluster_id + '">' + cluster.display_name + '</li>';
//       $(clusterHtml).appendTo('#clusterList');
//     });
//   }).fail(function(err) {
//     //
//   });
// }

// function _loadClustersForLink(master) {
//   $('#linkcontainers').empty();
//   $('#linkcontainerbody').empty();
//   $('#Path-oper .append-path-value').remove();
//   if (!master || master.trim() == '') {
//     master = 'default';
//   }
//   $.ajax({
//     url: '/clusters/' + master + '/list',
//     type: 'GET',
//     cache: false
//   }).done(function (resp) {
//     if (resp.node_number == 0) {
//       return;
//     }
//     resp.forEach(function (cluster) {
//       $('#linkcontainers').append('<option>' + cluster.id + '</option>');
//     })
//   }).fail(function (error) {
//     //
//   })
// }
// function _deletePortRow(row) {
//   var portNumber = $(row).parent().parent().parent().children().length;
//   if (portNumber <= 1) {
//     // layer.msg('警告：如果不开放任何端口，服务只能通过内网访问。', {icon: 7});
//     layer.msg('警告：请至少开放一个端口。', {icon: 7});
//     return
//   }
//   deleteRow(row);
// }
