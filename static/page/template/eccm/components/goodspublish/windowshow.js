//商品展示01-hover
function spzs01hover(idx) {
	var idx = $(idx);
	$(idx).mouseover(function() {
		var $this = $(this);
		$this.addClass("fbspzs01-box-ac");
		$this.find(".sp-txt").addClass("d-none");
		$this.find(".fbspzs01-hover").removeClass("d-none");
	});
	$(idx).mouseout(function() {
		var $this = $(this);
		$this.removeClass("fbspzs01-box-ac");
		$this.find(".sp-txt").removeClass("d-none");
		$this.find(".fbspzs01-hover").addClass("d-none");
	});
}
$(function() {
	spzs01hover(".js-fbspzs01")
});
