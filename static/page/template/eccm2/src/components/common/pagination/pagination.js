u.on(window, 'load', function() {
	// 分页
	var pagination = document.querySelector('.u-pagination')['u.pagination'];
	pagination.update({
		totalPages: 100,
		pageSize: 20,
		currentPage: 1,
		totalCount: 200
	});
})