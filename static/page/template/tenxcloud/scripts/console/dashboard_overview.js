$(function () {
  _loadClusterOverview();
  _loadJobOverview();
  _getCiOverview();
  _getImageOverview();
  _getHostingNodeOverview();
  _getHostingClusterOverview();
  _getStackOverview();
  _getVolumeOverview();
  _listRecentOperations();
  //加载提示
  _leadAction('dashboard', null, 0);
  /*function _leadAction(){
    var _bj = '<div id="leadAction" style="background:#4280CB;position:fixed;z-index:10000;top:100px;left:calc(50% - 260px);text-align:center;color:#fff;border-radius:25px;height:360px;">\
      <div class="h3" style="margin-top:30px;">一场精彩的旅行即将开始</div><span class="colseLead" style="position: absolute;top:10px;right:20px;font-size: 30px;cursor: pointer;">&times;</span>\
      <img src="../images/console/load/dashboard-fade.png" width="80%"><div class="h4" style="margin-top:30px;"><a href="javascript:;" class="colseLead" style="color:#fff;padding:10px 15px;border:1px solid #fff;">立即体验</a></div></div>\
       <div class="modal-backdrop fade in"></div>';

    $('article').append(_bj);
    $('body').css('overflow','hidden');
    setTimeout(function(){
      $('.modal-backdrop').addClass('in');
    }, 1000);
  }*/
  // $('.nav-li').removeClass('item-click').addClass('live-hover');
  // $('.foldingpad').hide();
  // $('.page-container').css('margin-left','200px');
  $('#nav-zone .nav-li-small:first').addClass('selected').siblings().removeClass('selected');
  $('.nav-li:first').addClass('item-click').siblings().removeClass('item-click');
  $('.list-detail li').removeClass('li-active');
  $('.symbol').click(function() {
    if(!$(this).hasClass('action')){
      $(this).addClass('action');
      $(this).parent().siblings().slideUp();
    }else{
      $(this).removeClass('action');
      $(this).parent().siblings().slideDown();
    }
  });
  // $('.slider_bj .slider_block').css('width','20px');
  $('.nav-item-hover li').off().on('click', function(e) {
    var num = $(this).index(),
    titles = '',https = $(this).attr('href');
    _permalink(this);
    e.preventDefault();
    history.pushState(1,titles,https+'?'+ num);
  });
  $('.list-detail li').off().on('click', function(e) {
    var num = $(this).index(),
      titles = '',https = $(this).attr('href');
     $('.list-detail li').removeClass('li-active');
     $(this).addClass('li-active');
      _permalink(this);
      e.preventDefault();
      history.pushState(1,titles,https+'?'+ num);
  });
   /*----  hide dashboard ajax data   ---*/
  if(!$('#consumecsse').html()){
      // Get balance and amount
    $.ajax({
      url: '/account/getconsumamount',
      type: 'GET',
      cache: false
    }).done(function (resp) {
      _createAmountChart(resp);
    }).fail(function (error) {
      //
    });
  }
  function _createAmountChart(amountData) {
    $('#thisMonthconsumptionSum').text(amountData[0].balance);
    $('#thisMonthGruntSum').text(amountData[0].grant_balance);
    $('#thisMonthPaySum').text(amountData[0].pay_balance);
    //$('#thisMonthCost').text(amountData[1]);
    var formatData, categories=['余额', '消费'];
    formatData = [amountData[0].balance, amountData[1]];
    if(amountData[1] <=0 ){
      amountData[1] = 0.01;
    }
    if(amountData[0].balance <= 0){
      formatData = [0, amountData[1]];
      //$('#consumecsse').html('<img src="/images/console/data-load.png" style="padding-top:30px" />');
      //return;
    }
    var colors = ['#0075c1', '#0075c1'],
    data = [{
      y: 5.11,
      color: colors[0],
      drilldown: {
        name: '本月消费情况',
        categories: categories,
        data: formatData,
        color: colors[1]
      }
    }];
    // Build the data arrays
    var browserData = [];
    var versionsData = [];
    for (var i = 0; i < data.length; i++) {
        // add browser data
        browserData.push({});

        // add version data
        for (var j = 0; j < data[i].drilldown.data.length; j++) {
            var brightness = 0.2 - (j / data[i].drilldown.data.length) / 5 ;
            versionsData.push({
                name: data[i].drilldown.categories[j],
                y: data[i].drilldown.data[j],
                color: Highcharts.Color(data[i].color).brighten(brightness).get()
            });
        }
    }
    // Create the chart
    $('#consumecsse').highcharts({
        chart: {
            type: 'pie'
        },
        title: {
            text: '',
            y:-18,
            verticalAlign:'center'
        },
        credits:{
          enabled:false // 禁用版权信息
        },
        yAxis: {
            title: {
                text: 'Total percent market share'
            },
            gridLineWidth:0
        },
        plotOptions: {
            pie: {
                shadow: false,
                center: ['50%', '50%']
            }
        },
        tooltip: {
          valuePrefix: '￥'
        },
        series: [
        {
            name: ((new Date()).getMonth() + 1) + '月',
            // name: Highcharts.dateFormat('%m月%e日', new Date()),
            data: versionsData,
            size: '90%',
            innerSize: '55%',
            color: '#9972B5',
            dataLabels: {
              formatter: function() {
                  // display only if larger than 1
                  return this.y >= 0 ? '<b>'+ this.point.name +':</b> '+ '￥' + this.y : null;
              }
            }
        }]
    });
  }

  function _loadClusterOverview(){
    $.ajax({
      url: 'clusters/master/overview',
      type: 'GET',
      cache: false
    }).done(function (resp) {
      $('#clusterNum').text(resp.number);
      if (parseInt(resp.number) > 0) {
        $('.slider_bj .network').css('width', '100%');
      } else {
        $('.slider_bj .network').css('width', '0%');
      }
      // $('#detailClusterNum').text(resp.number);
      $('#detailMemory').text(resp.memory);
      $('#totalMemory').text(resp.totalMemory);
      $('#detailCpu').text(resp.cpu);
      // $('.slider_bj .detailClusterNum').attr('title', '您建了' + resp.number + '个容器');
      $('.slider_bj .detailMemory').attr('title', '您使用了' + resp.memory + 'G内存');
      $('.slider_bj .detailCpu').attr('title', '您使用了' + resp.cpu + '核cpu');
      var detailClusterNumPercent = (resp.number / 4 * 100).toFixed();
      detailClusterNumPercent = detailClusterNumPercent > 100 ?100:detailClusterNumPercent;
      var detailMemoryPercent = (resp.memory / resp.totalMemory * 100).toFixed();
      detailMemoryPercent = detailMemoryPercent > 100 ?100:detailMemoryPercent;
      var detailCpuPercent = (resp.cpu / 1 * 100).toFixed();
      detailCpuPercent = detailCpuPercent > 100 ?100:detailCpuPercent;
      // $('.slider_bj .detailClusterNum').css('width', detailClusterNumPercent + '%');
      $('.slider_bj .detailMemory').css('width', detailMemoryPercent + '%');
      $('.slider_bj .detailCpu').css('width', detailCpuPercent + '%');
    }).fail(function (err) {
      //
    });
  };

  function _loadJobOverview(){
    $.ajax({
      url: '/clusters/master/job/overview',
      type: 'GET',
      cache: false
    }).done(function (resp) {
      $('#taskNum').text(resp.number);
      if (parseInt(resp.number) > 0) {
        $('.slider_bj .network').css('width', '100%');
        $('.slider_bj .taskNum').css('width', '80%');
      } else {
        $('.slider_bj .network').css('width', '0%');
        $('.slider_bj .taskNum').css('width', '0%');
      }
      // $('#detailClusterNum').text(resp.number);
      var memory = Number($('#detailMemory').text());
      memory = memory != NaN ? memory : 0;
      memory = Number(resp.memory) != NaN ? memory + Number(resp.memory) : memory;
      var cpu = Number($('#detailCpu').text());
      cpu != NaN ? cpu : 0;
      cpu = Number(resp.cpu) != NaN ? cpu + Number(resp.cpu) : cpu;
      $('#detailMemory').text(memory);
      $('#totalMemory').text(resp.totalMemory);
      $('#detailCpu').text(cpu);
      $('.slider_bj .detailMemory').attr('title', '您使用了' + memory + 'G内存');
      $('.slider_bj .detailCpu').attr('title', '您使用了' + cpu + '核cpu');
      var detailMemoryPercent = (memory / resp.totalMemory * 100).toFixed();
      detailMemoryPercent = detailMemoryPercent > 100 ? 100 : detailMemoryPercent;
      var detailCpuPercent = (cpu / 1 * 100).toFixed();
      detailCpuPercent = detailCpuPercent > 100 ? 100 : detailCpuPercent;
      // $('.slider_bj .detailClusterNum').css('width', detailClusterNumPercent + '%');
      $('.slider_bj .detailMemory').css('width', detailMemoryPercent + '%');
      $('.slider_bj .detailCpu').css('width', detailCpuPercent + '%');
    }).fail(function (err) {
      //
    });
  };

  function _getCiOverview(){
    $.ajax({
      url: '/ci/master/overview',
      type: 'GET',
      cache: false
    }).done(function (resp) {
      $('#ciNum').text(resp.number);
      // $('#detailCiNum').text(resp.number);
      // $('.slider_bj .detailCiNum').attr('title', '您建了' + resp.number + '个项目');
      // var detailCiNumPercent = (resp.number / 10 * 100).toFixed();
      // detailCiNumPercent = detailCiNumPercent > 100 ?100:detailCiNumPercent;
      // $('.slider_bj .detailCiNum').css('width', detailCiNumPercent + '%');
    }).fail(function (err) {
      //
    });
  }

  function _getImageOverview(){
    $.ajax({
      url: '/docker-registry/master/overview',
      type: 'GET',
      cache: false
    }).done(function (resp) {
      $('#imageNum').text(resp.number);
      // $('#detailimageNum').text(resp.number);
      // $('.slider_bj .detailimageNum').attr('title', '您构建了' + resp.number + '个镜像');
      // var detailImageNumPercent = (resp.number / 10 * 100).toFixed();
      // detailImageNumPercent = detailImageNumPercent > 100 ?100:detailImageNumPercent;
      // $('.slider_bj .detailimageNum').css('width', detailImageNumPercent + '%');
    }).fail(function (err) {
      //
    });
  }

  function _getHostingNodeOverview(){
    $.ajax({
      url: '/hosting-node/master/overview',
      type: 'GET',
      cache: false
    }).done(function (resp) {
      $('#hostingNum').text(resp.number);
      $('#detailHostingNum').text(resp.number);
      $('.slider_bj .detailHostingNum').attr('title', '您添加了' + resp.number + '台主机');
      var detailHostingNumPercent = (resp.number / 5 * 100).toFixed();
      detailHostingNumPercent = detailHostingNumPercent > 100 ?100:detailHostingNumPercent;
      $('.slider_bj .detailHostingNum').css('width', detailHostingNumPercent + '%');
    }).fail(function (err) {
      //
    });
  }

  function _getHostingClusterOverview(){
    $.ajax({
      url: '/hosting-cluster/master/overview',
      type: 'GET',
      cache: false
    }).done(function (resp) {
      $('#detailHostingClusterNum').text(resp.number);
      $('.slider_bj .detailHostingClusterNum').attr('title', '您建了' + resp.number + '个集群');
      var detailHostingClusterNumPercent = (resp.number / 1 * 100).toFixed();
      detailHostingClusterNumPercent = detailHostingClusterNumPercent > 100 ?100:detailHostingClusterNumPercent;
      $('.slider_bj .detailHostingClusterNum').css('width', detailHostingClusterNumPercent + '%');
    }).fail(function (err) {
      //
    });
  }

  function _getStackOverview(){
    $.ajax({
      url: '/stack/master/overview',
      type: 'GET',
      cache: false
    }).done(function (resp) {
      $('#detailStackNum').text(resp.number);
      $('.slider_bj .detailStackNum').attr('title', '您建了' + resp.number + '个Stack');
      var detailStackNumPercent = (resp.number / 15 * 100).toFixed();
      detailStackNumPercent = detailStackNumPercent > 100 ?100:detailStackNumPercent;
      $('.slider_bj .detailStackNum').css('width', detailStackNumPercent + '%');
    }).fail(function (err) {
      //
    });
  }

  function _getVolumeOverview(){
    $.ajax({
      url: '/volume/master/overview',
      type: 'GET',
      cache: false
    }).done(function (resp) {
      $('#detailVolume').text(resp.number);
      $('#totalVolume').text(resp.total);
      $('.slider_bj .detailVolume').attr('title', '您建了' + resp.number + 'G 存储');
      var detailVolumeNumPercent = (resp.number / resp.total * 100).toFixed();
      detailVolumeNumPercent = detailVolumeNumPercent > 100 ? 100 : detailVolumeNumPercent;
      $('.slider_bj .detailVolume').css('width', detailVolumeNumPercent + '%');
    }).fail(function (err) {
      //
    });
  }

  function _listRecentOperations(){
    $.ajax({
      url: '/master/recentop',
      type: 'GET',
      cache: false
    }).done(function (resp) {
      if (resp && resp.length > 0) {
        $('.operation #recentOp').html('');
        resp.forEach(function (op) {
          var opHtml = '';
          opHtml += '<div class="operlog">';
          opHtml += '<p class="logtitle"><i class="fa_icon server_icon_'+ op.type +'"></i>' + op.title;
          opHtml += '<span class="showtiem">' + op.time + '</span></p>';
          opHtml += '<div class="logcontent text-overflow">';
          opHtml += op.detail;
          opHtml += '</div></div>';
          $(opHtml).appendTo($('.operation #recentOp'));
        });
      } else {
        $('.operation #recentOp').html('<p style="text-indent:30px;line-height: 50px;">暂无操作记录</p>');
      }
    }).fail(function (err) {
      //
    });
  }
  function _getMessageCenter (){
    var http = document.location.host,https;
    if(http == "localhost:8000"){
      https = 'localhost:3000';
    }else{
      https = 'https://hub.tenxcloud.com';
    }
    $.ajax({
      url: '/message',
      type: 'GET',
      cache: false
    }).done(function(resp) {
      // console.log("success"+JSON.stringify(resp));
      if (resp && resp.length > 0) {
        $('#message-center').html('');
        var mes_title;
        resp.forEach(function (op) {

          var opHtml = '';
          opHtml += '<div class="operlog">';
          opHtml += '<p class="logtitle"><i class="'+ _setMessageIcon(op.type) +'"></i>' + _getMessageType(op.type);
          opHtml += '<span class="showtiem">' + op.time + '</span></p>';
          opHtml += '<div class="span8 text-overflow">';
          opHtml += op.content;
          opHtml += '</div>';
          opHtml += '<div class="span2">&nbsp;&nbsp;<a href="'+ https + op.url+'" target="_blank">查看 <i class="fa fa-angle-double-right"></i></a></div>';
          opHtml += '</div>';
          $(opHtml).appendTo($('#message-center'));
        });
      } else {
        $('#message-center').html('<p style="text-indent:30px;line-height:40px;">消息为空，在这里您会收到镜像的消息</p>');
      }
    }).fail(function() {
      console.log("error");
    });

  }
  _getMessageCenter();
  function _getMessageType(items){
    switch(items){
      case 0:
        return '系统通知';
        break;
      case 1:
        return '镜像评论通知';
        break;
      case 2:
        return '收藏镜像通知';
        break;
      default:
        return '未知';
    }
  }
  function _setMessageIcon(type){
    switch(type){
      case 0:
        return 'fa_icon fa_system';
        break;
      case 1:
        return 'fa_icon fa_msg';
        break;
      case 2:
        return 'fa_icon fa_forks';
        break;
      default:
        return 'fa_icon fa_system';
    }
  }
});