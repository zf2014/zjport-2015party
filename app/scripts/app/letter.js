;(function(){

	var reqsPrefix = '/cgoWeixin/json/letter-of-',
		reqSuffix = '.json',

		$dom = $(document),
		$container = $('#J-letterContainer'),
		$letters,
		letterSize,
		width = $container.width(),
		height = $container.height(),
		exchangeTimeid,
		exchangeDuration = 5000,

		exchangeWords = [['ljyqwxkn'], ['wearetogher']],

		signImgs = [],
		signImgsLen
	;

	function flyin(words, delay){
		var letters = [],
			shuffleArr,
			// args = [].slice.call(arguments, 0),
			i = 0
		;
		posList = cached(words);

		posList.forEach(function(pos, j){
			letters.push( _createLetterMark(pos, j) )
			i++
		})

		letterSize = i;

		$letters = $(letters.join('')).appendTo($container);

		shuffleArr = _.shuffle($letters);
		// shuffleArr.forEach(function(node, i){
		// 	TweenMax.from(node, 1, {css: {z: 400, x: Math.random()*200, y: Math.random()*50, opacity: 0, scale: 3}, delay:  ((delay || 0) + i*0.005)})
		// });
			// var now = (new Date).getTime()
		TweenMax.staggerFrom(shuffleArr, 1, {css: {z: 400, x: Math.random()*200, y: Math.random()*50, opacity: 0, width: 48, height: 48}}, 0.005, function(){
			exchangeTimeid = window.setTimeout(function(){
				exchange(0)
			}, exchangeDuration);
		})
			// console.log((new Date).getTime() - now)
	}

	function flyout(){
		var shuffleArr = _.shuffle($container.find('.letter'));
		shuffleArr.forEach(function(node, i){
			TweenMax.to(node, 0.4, {css: {rotationY: Math.random()*45}, delay: i*0.005})
			TweenMax.to(node, 1, {css: {x: -2000}, delay:  (0.5 + i*0.002)})
		});
	}

	// function _createLetterMark(pos){
	// 	var mark = '';
	// 	mark += '<div class="letter"'
	// 	// mark += ' style="transform: translate3d('+pos.left+'px,'+pos.top+'px,0);"'
	// 	mark += ' style="left:'+pos.left+'px;top:'+pos.top+'px;"'
	// 	mark += '></div>'
	// 	return mark;
	// }

	function _createLetterMark(pos, index){
		var bgUrl, imgIndex;

		if(index == null || index > signImgsLen - 1){
			imgIndex = _.random(0, signImgsLen - 1)
		}else{
			imgIndex = index;
		}

		var mark = '';
		mark += '<div class="letter"'
		// mark += ' style="transform: translate3d('+pos.left+'px,'+pos.top+'px,0);"'
		mark += ' style="left:'+pos.left+'px;top:'+pos.top+'px;background-image:url('+signImgs[imgIndex]['url']+');"'
		mark += '></div>'
		return mark;
	}
	function exchange(index){
		var words;
		var toPosList = [];
		var pos;
		var existLetters = $container.find('.letter');
		var shuffleArr;
		var len,n, j = 0;
		index = index || 0;
		words = exchangeWords[index];
		words.forEach(function(word){
			toPosList = toPosList.concat(cached(word))
		})

		if(toPosList.length > existLetters.length){
			var dval = toPosList.length - existLetters.length;
			for(var i = 0 ; i < dval ; i++){
				var node = $(_createLetterMark({left:width/2, top:height/2})).appendTo($container);
				TweenMax.set(node, {css: {opacity: 0}})
				existLetters.push(node);
			}
		}

		shuffleArr = _.shuffle(existLetters);
		n = len = toPosList.length;

		var rnd = Math.random();
		var moveDirection = rnd > 0.7 ? 1: (rnd < 0.4?-1:0);



		shuffleArr.forEach(function(node, i){
			var tl = new TimelineMax({paused: false})
			tl.add(TweenMax.to(node, 0.5, {css:{z: 80 + Math.random()*50}, delay: i*0.002}))

			tl.add(TweenMax.to(node, 2, {css: {opacity: 0, scale: 1, x: (1800 + Math.random()*50*(Math.random()>0.5?1:-1))*(moveDirection === 0 ?(Math.random()>0.5?1:-1):moveDirection), y: Math.random()*50*(Math.random()>0.5?1:-1)}, delay: i*0.0002,onCompleteParams:[node], onComplete: function(ele){
				n--
				if(n === 0){
					_.shuffle(toPosList).forEach(function(pos, i){
						TweenMax.to(shuffleArr[i], 1.2, {css: {opacity: 1, scale: 1, x:0, y:0, z:0, left: pos.left, top: pos.top}, delay: (0.1 + i*0.005), onComplete: function(){
							j++
							if(j === len){
								exchangeTimeid && window.clearTimeout(exchangeTimeid);
								exchangeTimeid = window.setTimeout(function(){
									exchange( (index + 1)%(exchangeWords.length) )
								}, exchangeDuration)
								
							}
						}})
					})
				}
			}}))


			if(!toPosList[i]){
				TweenMax.set(node, {css: {opacity: 0}})
			}
		});
	}

	var cached = (function(){
		var cache = {};
		return function(key){
			if(cache[key]){
				return cache[key];
			}
			$.when($.ajax(reqsPrefix + key + reqSuffix, {dataType: 'json'})).done(function(posList){
				cache[key] = posList;
			})
		}
	}());

	function loadAndCacheLetters(){
		cached(exchangeWords[0][0]);
		cached(exchangeWords[1][0]);
	}

	/*
	**
	**	描述: 启动工程
	**
 	*/
	var launch = window.letterLoop = (function(){
		loadAndCacheLetters();
		return function(){
			$.ajax({
				url: '/cgoWeixin/screen/loginUserAll.jspa',
				type: 'POST',
				dataType: 'json',
				success: function(result){
					var userList = result.rst.userlist;
					_.each(userList, function(user, index){
						user.vxHead && signImgs.push({url: user.vxHead});
					});
					signImgsLen = signImgs.length;
					$container.empty();
					flyin(exchangeWords[1][0]);
				},
				error: function(err){
				}
			});
		}
	}());

}())