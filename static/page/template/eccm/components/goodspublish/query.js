u.on(window, 'load', function() {				
	//加载更多查询条件
    $('.a-more').on('click', function() {
        //active则处于激活（已加载更多）
        if($(this).hasClass('active')) {
            $(this).removeClass('active');
            $(this).children()[0].innerHTML = "更多";
            $(this).prev().height('');
        } else {
            $(this).addClass('active');
        $(this).children()[0].innerHTML = "收起";
            $(this).prev().height('auto');
        }
    });

})