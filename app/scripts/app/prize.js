$(function(){
	var $winner = $('.J-prizeWinner'),
		order = 0,
		len = $winner.length - 1
	;


	var fromXYs = [
		{x: 510, y: -30},
		{x: -560, y: -30},
		{x: 0, y: -330}
	]






	window.gShowTop3 = function(){
		var $target, xy;
		if(order > len){
			return;
		}
		xy = fromXYs[order];

		$target = $winner.eq(order);
		TweenLite.fromTo($target, 0.8, {css: {opacity: 0, scale: 0, x: xy.x, y: xy.y}}, {css: {opacity: 1, scale: 1, x: 0, y: 0}});
		order++;
	}
})