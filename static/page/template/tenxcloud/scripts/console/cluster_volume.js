$(function(){

  var user_memory_limit = $('#user_memory_limit').val();
  var minSize = 200;
  var maxSize = 600;
  if (user_memory_limit > 512) {
    minSize = 1024;
    maxSize = 10240;
  }

  $('article').on('click',"#fastCreateVolume",function (event) {
    /* Act on the event */
    var self = this;
    var volume = {};
    volume.imageName = $('#fastImageName').val();
    volume.blkSize = $('#fastVolumeSize').val();
    volume.format = $('#fastFormat').text();
    // check imageName and blkSize
    if (volume.imageName.trim().length < 1) {
      layer.tips('请填写存储卷名称','#fastImageName',{tips: [1, '#3595CC']});
      $('#fastImageName').focus();
      return;
    }
    if (volume.imageName.length < 3 || volume.imageName.length > 15) {
      layer.tips('存储卷名称长度为3-15位','#fastImageName',{tips: [1, '#3595CC']});
      $('#fastImageName').focus();
      return;
    }
    if (volume.imageName.search(/^[a-z][a-z0-9-]*$/) === -1) {
      layer.tips('存储卷名称只能由字母、数字及横线组成，且首字母不能为数字及横线','#fastImageName',{tips: [1, '#3595CC']});
      $('#fastImageName').focus();
      return;
    }
    var num = parseInt(volume.blkSize);
    if (isNaN(num)) {
      $('#fastVolumeSize').val(minSize);
      $('#fastVolumeSize').focus();
      layer.tips('存储卷大小填写错误','#fastVolumeSize',{tips: [1, '#3595CC'], time: 1500});
      return;
    }
    if(num > maxSize || num < minSize){
      $('#fastVolumeSize').val(minSize);
      $('#fastVolumeSize').focus();
      layer.tips('存储卷大小为' + minSize + '-' + maxSize + 'M','#fastVolumeSize',{tips: [1, '#3595CC'],time: 1500});
      return;
    }

    volume.imageName = volume.imageName.trim();
    _createVolume(volume, 'fast', self);
  });

  //勾选“有状态服务”时
  $('#state_service').click(function() {
    var master = $('#hosting-cluster').val();
    if($(this).is(':checked')){
      $('.loadingVolume').show();
      _insertMounPathList();
      $('.selectVolume').html('<option value="0">载入中...</option>');
      _getVolumeList();
      var hostStep2 = $('.host_step2 .safeSet');
      hostStep2.scrollTop(hostStep2[0].scrollHeight);
      // disabled instance number
      if (master === 'tenx_district2' || master === 'tenx_district3') {
        $('.number').val(1).attr('disabled', 'disabled');
        $('#instanceTip').html('<i class="fa fa-warning"></i> 有状态服务只容许单实例');
      }
    } else {
      $('.loadingVolume').hide();
      $('#save_roll_dev,#save_roll').hide();
      // remove disabled instance number
      if (master === 'tenx_district2' || master === 'tenx_district3') {
        $('.number').removeAttr('disabled');
        $('#instanceTip').html('');
      }
    }
  });
  $('article').on('click', '.refreshVolume', function () {
    $('.refreshVolume').attr('disabled', 'disabled');
    $('.isVolumeReadonly').prop("checked", false);
    $('.selectVolume').html('<option value="0">载入中...</option>');
    _getVolumeList();
  });
  $('article').on('click', '.delVolume', function () {
    $(this).parents('li.mount').fadeOut('200', function(index) {
      $(this).remove();
      if ($('#mountPathList li.mount').length < 1) {
        $('#state_service').prop('checked', false);
        $('#save_roll_dev').hide();
      }
    });
  })
});
function _createVolume(volume, type, obj){
  var master = $('#hosting-cluster').val();
  $(obj).attr('disabled', 'disabled');
  $(obj).text('检查名称中...');
  $.ajax({
    url: '/storage/' + master + '/checkname/' + volume.imageName,
    type: 'GET',
    cache: false
  }).done(function (resp) {
    if (resp > 0) {
      layer.msg('存储卷名称已存在，请修改', {
        icon: 0,
        time: 1500
      });
      $(obj).removeAttr('disabled');
      $(obj).text('创建存储卷');
      return;
    }
    var index;
    if (type === 'normal') {
      $('#modalCrealRoll').modal('hide');
      index = layer.load(0, {
        shade: [0.5,'#fff'] //0.1透明度的白色背景
      });
    } else {
      $(obj).text('创建中...');
    }
    var data = JSON.stringify(volume);
    $.ajax({
      url: '/storage/' + master + '/create',
      type: 'POST',
      data: data,
      contentType: 'application/json',
      dataType: 'json'
    }).done(function (resp) {
      layer.msg('存储卷' + volume.imageName + '创建成功！', {
        icon: 1,
        time: 1500
      });
      setTimeout(function() {
        if (type === 'normal') {
          _showBackups(master);
        } else {
          _getVolumeList()
        }
      }, 1500);
    }).fail(function (err) {
      // console.log(JSON.stringify(err));
      layer.msg(err.responseText ? err.responseText : '存储卷创建失败', {
        icon: 0,
        time: 1500
      });
    }).complete(function(){
      if (type === 'normal') {
        layer.close(index);
      }
      $(obj).removeAttr('disabled');
      $(obj).text('创建存储卷');
    });
  }).fail(function (err) {
    layer.msg('检查名称失败，请重试', {
      icon: 0,
      time: 1500
    });
    $(obj).removeAttr('disabled');
    $(obj).text('创建存储卷');
  });
}

function _getVolumeList(){
  var master = $('#hosting-cluster').val();
  // console.log(master)
  if (!master) {
    master = 'tenx_district2';
  }
  // Use common volume
  if (master != "tenx_district2" && master != 'tenx_district3') {
    $('.loadingVolume').hide();
    _insertMounPathList();
    $('#save_roll_dev').show();
    $('#save_roll_dev').removeAttr('create');
    $('#save_roll').hide()
    return;
  }
  $.ajax({
    url: '/storage/' + master + '/getvolumelist',
    type: 'GET',
    cache: false
  }).done(function (resp) {
    // insert volumes to volume select option
    $('#refreshVolume').removeAttr('disabled');
    $('.loadingVolume').hide();
    if (resp.length < 1) {
      // $('#addsavedev').show();
      $('#save_roll').show()
      $('.selectVolume').html('<option value="0">请先创建一个存储卷</option>');
      var hostStep2 = $('.host_step2 .safeSet');
      hostStep2.scrollTop(hostStep2[0].scrollHeight);
      $('#save_roll_dev').attr('create', '1');
      return;
    }
    _insertMounPathList();
    $('#save_roll_dev').show();
    $('#save_roll_dev').removeAttr('create');
    $('#save_roll').hide()
    $('.selectVolume').html('<option value="0">选择一个存储卷</option>');
    resp.forEach(function (volume) {
      var volumeHtml = '<option uid="' + volume.blk_id + '" format="' + volume.blk_fs_type + '" value="' + volume.blk_name + '">';
      volumeHtml += volume.blk_name + ' ' + volume.blk_fs_type + ' ' + volume.size + 'M</option>';
      $(volumeHtml).appendTo('.selectVolume');
    });
  }).fail(function (err) {
    /*layer.msg('获取存储卷列表失败，请重试', {
      icon: 0,
      time: 1500
    });*/
  });
}
function _insertMounPathList() {
  var i = 0;
  $('#mountPathList').empty();
  $('#save_roll_dev').hide();
  var master = $('#hosting-cluster').val();
  mountPath.forEach(function (mount) {
    i ++;
    var mountHtml = "<li class=\"mount line-h-3\">" +
      "<span class=\"ve_top\">&nbsp;</span>" +
      "<table class='pull-left'>" +
        "<tr>" +
          "<!-- <input type='text' disabled/> -->" +
          "<td><span class=\"ve_top\" style=width:230px>"+ mount + "</span></td>";
    if (master == 'tenx_district2' || master == 'tenx_district3') {
      mountHtml += "<td><select class='selectVolume' style=\"height:30px;width:240px;\">" +
            "<option value=\"0\">选择一个存储卷</option>" +
          "</select></td>" +
          "<td><span class='ins'><input type=\"checkbox\" id=\"readOnlyOp" + i + "\" class=\"isVolumeReadonly\"> <label for=\"readOnlyOp" + i + "\">只读</label></span>" +
          "<a class='refreshVolume' title=\"刷新\" href=\"javascript:void(0)\" class=\"btn btn-link\"><i class=\"fa fa-refresh fa-lg\" style=\"font-size: 16px\"></i></a>" +
          "<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>";
    } else {
      mountHtml += "<td style=width:100px>默认存储</td><td>"
    }
    mountHtml += "<a class='delVolume' title=\"删除\" href=\"javascript:void(0)\" class=\"btn btn-link\"><i class=\"fa fa-trash-o\" style=\"font-size: 16px\"></i></a></td>" +
        "</tr>" +
      "</table>" +
    "</li>";
    $('#mountPathList').append(mountHtml);
  })
}