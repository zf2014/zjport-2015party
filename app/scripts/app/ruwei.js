$(function(){
	var $columns = $('.J-column'),
		$doll = $('.J-doll'),
		$cardItems = $('.J-showCardItem'),
		columnMaxHeight = 300,
		columnMinHeight = 70,

		columnBarWidth = $columns.eq(0).width(),
		columnBarHeight = $columns.eq(0).height(),

		top5 = new Array(5),
		order = 0,
		len = top5.length - 1
	;

	top5 = [
		{name: '《节目1》', vote: Math.floor(Math.random()*12000), id: 2},
		{name: '《节目2》', vote: Math.floor(Math.random()*12000), id: 3},
		{name: '《节目3》', vote: Math.floor(Math.random()*12000), id: 4},
		{name: '《节目4》', vote: Math.floor(Math.random()*12000), id: 5},
		{name: '《节目5》', vote: Math.floor(Math.random()*12000), id: 6}
	]

	if(typeof jsonData !== 'undefined'){
		top5 = _.shuffle(jsonData);
	}


	init();


	function init(){
		voteToHeight();
	}


	function soreByVote(){
		top5 = _.sortBy(top5, 'vote');
	}


	function voteToHeight(){
		var maxVote
		maxVote = _.max(top5, function(tp){
			return tp.vote
		}).vote;


		_.each(top5, function(tp){
			tp.height = (tp.vote/maxVote)*columnMaxHeight
		});

	}

	function riseAndSumByIndex(index){
		var duration = 10;
		var repeatTimes = 12;

		function onUpdate($target, obj){
			$target.find('.pillar-bd').css({height: (obj.height + columnMinHeight) });
			$target.find('.pillar-num').html( Math.round(obj.vote) )
		}
		function onComplete($target, obj){
			var $name = $target.find('.show-name');
			$name.html(obj.name);
		}

		function onStart($target, obj){
			var $name = $target.find('.show-name');
			$name.html(obj.name);
		}

		var $target = $columns.eq(index).css({opacity: 1});
		var fromObj = {vote: 0, height: 0}
		var tp = top5[index];
		var toObj = {
			ease: Power0.easeNone,
			onStart: onStart,
			onStartParams: [$target, tp],
			onUpdate: onUpdate,
			onUpdateParams: [$target, fromObj]
		};
		
		toObj.vote = tp.vote;
		toObj.height = tp.height;
		TweenLite.to(fromObj, duration, toObj)

		TweenMax.to({n:0}, duration/repeatTimes, {n:1, repeat: repeatTimes, ease: Power0.easeNone, onRepeat: function(){
			_.each($doll.eq(index), function(node){
				TweenMax.set(node, {css: {backgroundPositionY: -108*_.random(0, 3) + 'px'}})
			})
		}})
	}


	function reserveFinalists(){
		var reserved = [],
			ohter = []
		;

		_.each($cardItems, function(node){
			var thatId = $(node).data('showId');
			var topIndex;
			topIndex = _.findIndex(top5, function(tp){
				return tp.id === thatId
			});

			// 入围的
			if(!!~topIndex){
				reserved.push(node);
			}else{
				ohter.push(node);
			}
		});

		_.shuffle(ohter).forEach(function(node, i){
			TweenMax.to(node, 1.6, {
				css: {
					x: (1500 + Math.random()*50)*(Math.random()>0.5?1:-1),
					y:  Math.random()*50*(Math.random()>0.5?1:-1),
					opacity: 0,
					scale: 0
				},
				delay: (0.5 + i*0.35),
				onCompleteParams: [i],
				onComplete: function(index){
					if(index === ohter.length - 1){
						toColumnBottom();
					}
				}
			})
		})


		function toColumnBottom(){

			_.shuffle(reserved).forEach(function(node, i){
				var $node = $(node);
				var toPos = $columns.eq(i).position();
				var fromPos = $node.position();

				TweenMax.to(node, 0.8, {
					css: {
						x: ( (toPos.left + columnBarWidth) - fromPos.left),
						y: ((toPos.top + columnBarHeight) - fromPos.top),
						opacity: 0,
						scale: 0
					},
					delay: (0.2 + i*0.15),
					onCompleteParams: [i],
					onComplete: function(index){
						riseAndSumByIndex(index)
					}
				})
			});


		}

	}



	window.gShowTop5 = function(){
		if(order > len){
			return;
		}
		TweenLite.fromTo($columns.eq(order).find('.show-name'), 0.8, {css:{opacity: 0, scale: 0}}, {css:{opacity: 1, scale: 1}})
		order++;
	}


	window.turnoverCards = function(){
		_.shuffle($cardItems.find('.J-card')).forEach(function(node, i){
			TweenMax.to(node, 0.8, {
				css: {rotationY: 180 + (Math.random()>0.5?'_cw':'_ccw')},
				delay: (0.5 + i*0.5),
				onCompleteParams: [node],
				onComplete: function(node){
					TweenMax.to($(node).next(), 0.6, {css: {opacity: 1}})
				}
			})
		});
	}

	window.ensureFinalists = function(){
		reserveFinalists();
	}

})