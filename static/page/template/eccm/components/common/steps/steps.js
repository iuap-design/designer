u.Steps = u.BaseComponent.extend({
    init: function () {
		this.step = 0;
	},
	next: function() {
		this.step += 1;
		this.stepTo(this.step);
	},
	pre: function() {
		this.step -= 1;
		this.stepTo(this.step);
	},
	stepTo: function(stepNum) {
		var stepdoing = this.element.querySelector('.ec-step.doing'),
		steps = document.querySelectorAll('.ec-steps > ul > li');
		
		steps = Array.prototype.slice.call(steps);
		var index = steps.indexOf(stepdoing);
		
		if(stepNum < 0 || stepNum > steps.length-1) {
			console.log('错误的步数');
			return;
		}
		
		
		var stepnext = steps[stepNum],
		deco = document.querySelector('.ec-steps-doing-decorator');
		
		u.removeClass(stepdoing, 'doing').addClass(stepdoing, 'done');
		u.addClass(stepnext, 'doing');
		
		deco.style.transform = 'translate3d('+(stepNum)*210+'px, 0px, 0px)'

	}
})

u.compMgr.regComp({
    comp: u.Steps,
    compAsString: 'u.Steps',
    css: 'ec-steps'
})


    
