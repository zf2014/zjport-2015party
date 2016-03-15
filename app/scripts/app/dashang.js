$(function(){

	var $dom = $(document),
		$total = $('#J-total'),
		$recordList = $('#J-dsRecordList'),
		$totalNumItems = $('.J-dsNumItem')
		,$coinContainer = $('#J-coin')
		,$music = $('#J-coinMusic')
		,getDashangUrl = $recordList.data('getDsUrl')
		,maxItemSize = 6
		,coinSize = 8
		,playTimes = 0
		,start
	;


	/*
	**
	**	描述: 弹幕启动装置
	**
 	*/
	function launch(timestamp){
		var dval;

		if (!start) start = timestamp

		dval = timestamp - start;

		if(dval > 1500 + Math.random()*300){
			_getDashangCoinAndSink();
			start = timestamp;
		}
		window.requestAnimationFrame(launch);
	}

	window.requestAnimationFrame(launch);


	/*
	**
	**	描述: 从服务器上获取聊天内容, 并且发送到弹幕上
	**
 	*/

	function _getDashangCoinAndSink(){
		$.ajax({
			url: getDashangUrl,
			type: 'POST',
			dataType: 'json',
			success: function(result){
				var coinInfo = result.rst.reward
				;
				
				if(coinInfo){
					recordSink(coinInfo)
				}
			},
			error: function(err){
			}
		});
		// recordSink()
		
	}

	// 累计打赏金额
	var doCount = (function(){
		var originalVal = $total.data('originalVal'),
			target = {count: 0},
			numStrMaxLength = 5
		;


		// 将数字转换成符合要求的字符串
		// 100   => 00100
		// 4     => 00004
		// 1456  => 01456
		// 54861 => 54861

		function formatInt(intV){
			var intStr = intV + '',
				stuff;
			;
			if(intStr.length > numStrMaxLength){
				// ERROR
				return '00000';
			}
			stuff = strRepeat('0', (numStrMaxLength - intStr.length) )
			return stuff + intStr;
		}


		// 动画完成时的回调函数
		function onComplete(obj){
			target = obj;
			originalVal = target.count;
		}

		// 动画过程中的回调函数
		function onUpdate(obj){
			var digitStr = formatInt(Math.round(obj.count)),
				digitArr = digitStr.split('')
			;

			digitArr.forEach(function(digit, index){
				$totalNumItems.eq(index).html(digit);
			})

			// TODO
			// console.log(formatInt(Math.round(obj.count)));
		}

		// 动画操作
		function doAction(dval){
			var to = target.count + dval;
			TweenLite.to(target, 1, {count: to, onUpdateParams: [target], onCompleteParams:[target], onUpdate: onUpdate, onComplete: onComplete});
		}

		// 字符串重复
		function strRepeat(str, qty){
		  if (qty < 1) return '';
		  var result = '';
		  while (qty > 0) {
		    if (qty & 1) result += str;
		    qty >>= 1, str += str;
		  }
		  return result;
		}

		// 执行动画操作
		doAction(originalVal);


		return doAction;

	}());



	// 打赏金额滚动效果
	function recordSink(coin){
		var dsCoinObj = coin
			// dsCoinObj = {
			// 	votersName: '张峰',
			// 	rewardGold: Math.round(50 + Math.random()*50)
			// }
			,isFull = $recordList.find('li').size() >= maxItemSize


		TweenMax.to($recordList.find('li'), 0.5, {css:{y: 108}, onComplete: function(){
			if(isFull){
				$recordList.find('li:last').remove();
			}
			var $newLi = $(_createLi(dsCoinObj)).prependTo($recordList);
			TweenMax.set($recordList.find('li'), {css:{y:0}});
			TweenMax.from($newLi, 0.3, {
				css: {y: -110},
				onStart: function(){
					// 播放掉落音乐
					playMusic();
					// 往下掉金币
					dropCoin();
				},
				onComplete: function(){
					// 金额累加
					doCount( dsCoinObj.rewardGold )
				}})
		}});
		if(isFull){
			TweenMax.to($recordList.find('li:last'), 0.5, {css:{opacity: 0}})
		}
	}


	// 创建打赏金额列表项
	function _createLi(data){
		var liTag = [];
		liTag.push('<li class="record-item">')
		liTag.push('<div class="record-cont"><span class="nickname">'+data.votersName+'</span><span class="coin">打赏<em>'+data.rewardGold+'</em>金币</span></div>')
		liTag.push('</li>')
		return liTag.join('');
	}

	// 当前页面的地址信息
	function currentUrl(){
		var url = {};
		var ourl = location.href;
		var searchArr = location.search.substring(1).split("=");

		url.olink = ourl;
		url.link = location.origin + location.pathname;
		url.searchName = searchArr[0];
		url.searchValue = searchArr[1];
		return url;
	}


	// 音乐播放
	function playMusic(){
		playTimes++
		$music[0].play();
	}

	function pauseMusic(){
		$music[0].pause();	
	}





	// 金币掉落
	window.dropCoin = function dropCoin(){
		_.times(coinSize, function(i){
			var $coin = $('<span></span>').appendTo($coinContainer)
			TweenMax.set($coin, {css:{x: Math.random()*20, opacity: 0, y: 0, rotationZ: Math.random()*50*(Math.random()>0.5?1:-1)}})
			TweenMax.to($coin, 1 + Math.random()*1, {
				css:{y: 300, x: Math.random()*200*(Math.random()>0.5?1:-1), opacity: 1, rotationZ: 360 + (Math.random()>0.5?'_cw':'_ccw')},
				delay: i*0.25,
				onCompleteParams:[$coin, i],
				onComplete: function($node, theNum){
					$node.remove();
					if(theNum === coinSize - 1){
						playTimes--
						if(playTimes === 0){
							pauseMusic();
						}
					}
				}
			})
		})
	}

	// 下一个打赏页面
	window.nextShow = function(){
		var url = currentUrl();
		var candId = +url.searchValue;

		if(candId >= 12){
			return;
		}
		location.href = url.link + '?' + url.searchName + '=' + (++candId);
	}

	// 上一个打赏页面
	window.prevShow = function(){
		var url = currentUrl();
		var candId = +url.searchValue;

		if(candId <= 1){
			return;
		}
		location.href = url.link + '?' + url.searchName + '=' + (--candId);
	}


	window.test = function(){
		var dsCoinObj = {
			votersName: '张峰',
			rewardGold: Math.round(50 + Math.random()*50)
		}
		recordSink(dsCoinObj)
	}


});