$(function(){

	var $dom = $(document),
		$container = $('#J-showContainer'),
		$channels = $('.J-bulletChannel'),
		$title0 = $('#J-bulletTitle0'),
		$title = $('#J-bulletTitle'),
		$photo = $('#J-bulletPhoto'),
		len = $channels.length,
		winWidth = $(window).width()

		,Status = {
			WAITING: 0,
			PROCESS: 1
		}
		,channelAndStatus = _.map($channels, function(channel, index){
			return {s: Status.WAITING, i: index};
		})
		,bounceNames = ['张峰']
		,duration = 16

		,bulletTextColors = ['#48c9fb', '#ffffff', '#08c215']
		,colorSize = bulletTextColors.length
		,faceImgRoot = '/cgoWeixin/themes/2015/screen/images/face/'
		,faceReg = new RegExp("/::\\)|/::~|/::B|/::\\||/:8-\\)|/::<|/::\\$|/::X|/::Z|/::'\\(|/::-\\||/::@|/::P|/::D|/::O|/::\\(|/::\\+|/:--b|/::Q|/::T|/:,@P|/:,@-D|/::d|/:,@o|/::g|/:\\|-\\)|/::!|/::L|/::>|/::,@|/:,@f|/::-S|/:\\?|/:,@x|/:,@@|/::8|/:,@!|/:!!!|/:xx|/:bye|/:wipe|/:dig|/:handclap|/:&-\\(|/:B-\\)|/:<@|/:@>|/::-O|/:>-\\||/:P-\\(|/::'\\||/:X-\\)|/::\\*|/:@x|/:8\\*|/:pd|/:<W>|/:beer|/:basketb|/:oo|/:coffee|/:eat|/:pig|/:rose|/:fade|/:showlove|/:heart|/:break|/:cake|/:li|/:bome|/:kn|/:footb|/:ladybug|/:shit|/:moon|/:sun|/:gift|/:hug|/:strong|/:weak|/:share|/:v|/:@\\)|/:jj|/:@@|/:bad|/:lvu|/:no|/:ok|/:love|/:<L>|/:jump|/:shake|/:<O>|/:circle|/:kotow|/:turn|/:skip|/:oY", "g")
		
		,bulletEnable
		,start

		,isBlack
		,isPhoto
		,photoTimeID
	;




	/*
	**
	**	描述: 创建弹幕, 并且发射
	**		
	**  参数: text => 弹幕内容, 该内容已经被格式化
	**
 	*/
	function createAndSendBullet(text){
		var obj = {},
			$node,
			$channel,
			channel
		;

		channel = _randomFindUseableChannel();

		if(channel == undefined){
			return;
		}
		_disableChannelByIndex(channel.i);

		$node = obj.node = $('<div class="bullet-txt J-bullet-txt">'+text+'</div>').css({
			'font-size': 24 + Math.random()*4*(Math.random()>0.5?1:-1) + 'px',
			'color': bulletTextColors[_.random(0, colorSize - 1)]
		});
		$channel = $channels.channel = $channels.eq(channel.i)

		$node.appendTo($channel)

		obj.width = $node.width();
		obj.height = $node.height();
		obj['index'] = channel.i;

		TweenLite.set($node, {css: {x: obj.width, y: Math.random()*10*(Math.random()>0.5?1:-1)}})
		TweenLite.to($node, duration + (duration*(obj.width)/winWidth) + Math.random()*0.5, {css: {x: -winWidth}, ease: Power0.easeNone, onUpdateParams: [$node, obj], onCompleteParams: [$node], onComplete: onComplete, onUpdate: onUpdate})		
		function onUpdate($target, o){
			var x = +($target.css('transform').split(',')[4]).trim();
			if(!$target.data('isValueless') && x < -20){
				_enableChannelByIndex(o.index);
				$target.data('isValueless', true);
			}
		}

		function onComplete($target){
			$target.remove();
		}
	}


	/*
	**
	**	描述: 弹幕启动装置
	**
 	*/
	function launch(timestamp){
		var dval;

		if (!start) start = timestamp

		dval = timestamp - start;


		if(bulletEnable){
			if(dval > 500 + Math.random()*300){
				_getChatContentAndSend();
				start = timestamp;
			}
			window.requestAnimationFrame(launch);
		}
	}



	/*
	**
	**	描述: 重新构造聊天内容
	**
 	*/
	function _refactorChatMessage(chatInfo){
		var msg = chatInfo.message
		;

		msg = _replaceBounceNames(msg, chatInfo);
		msg = _replaceFaceSign(msg);

		msg = _prefixUserHead(msg, chatInfo)
		

		return msg
	}


	function _prefixUserHead(msg, chatInfo){
		var textMsg = msg;
		var userHeadMsg = '<img class="bullet-avatar" src="'+ chatInfo.userHead+'"></img>'

		return userHeadMsg + textMsg;
	}



	/*
	**
	**	描述: 将弹幕内容中特殊名称替换成发布者的昵称
	**
 	*/
	function _replaceBounceNames(msg, chatInfo){
		_.each(bounceNames, function(bname){
			msg = msg.replace(new RegExp(bname, "g"), chatInfo.nickname);
		})

		return msg
	}


	/*
	**
	**	描述: 将弹幕内容中特殊字符替换成表情
	**
 	*/
	function _replaceFaceSign(msg){
		return msg.replace(faceReg, function(sign){
			return '<img class="bullet-face" src="'+ faceImgRoot + WX_FACE[sign]+'.png"></img>'
		});
	}

	/*
	**
	**	描述: 随机获取可用的弹幕管道
	**
 	*/
	function _randomFindUseableChannel(){
		return _.find(_.shuffle(channelAndStatus), function(status){
			return status.s !== Status.PROCESS;
		});
	}

	/*
	**
	**	描述: 是否是无效的channel
	**
 	*/
	function _isDisableChannelByIndex(index){
		return channelAndStatus[index].s === Status.PROCESS;
	}


	/*
	**
	**	描述: 使目标弹幕管道失效
	**
 	*/
	function _disableChannelByIndex(index){
		if(!_isDisableChannelByIndex(index)){
			channelAndStatus[index].s = Status.PROCESS;
		}
	}


	/*
	**
	**	描述: 恢复目标弹幕管道
	**
 	*/
	function _enableChannelByIndex(index){
		if(_isDisableChannelByIndex(index)){
			channelAndStatus[index].s = Status.WAITING;
		}
	}

	/*
	**
	**	描述: 从服务器上获取聊天内容, 并且发送到弹幕上
	**
 	*/
	function _getChatContentAndSend(){
		$.ajax({
			url: '/cgoWeixin/screen/chat.jspa',
			type: 'POST',
			dataType: 'json',
			success: function(result){
				var chatInfo = result.rst.chatInfo
				;
				if(chatInfo){
					createAndSendBullet( _refactorChatMessage(chatInfo) )
				}
			},
			error: function(err){
			}
		});
		
		// var messageText = '这条信息有毒这条信息有点毒这条信息有毒'
		// var chatInfo = {
		// 	message: messageText.substring(0, _.random(0, messageText.length - 1)),
		// 	nickname: '张峰'
		// }
		// createAndSendBullet( _refactorChatMessage(chatInfo) )

	}

	/*
	**
	**	描述: 隐藏弹幕上的文字
	**
 	*/
	function _showOrHideBulletText(isToHide){
		$channels.find('.J-bullet-txt').css({opacity: isToHide ? 0:1});
	}

	/*
	**
	**	描述: 缩小弹幕上的标题
	**
 	*/	
	function _dwindleBulletTitle(){
		TweenLite.to($title0, 2, {css: {x: 500, y: 240, scale: 0.2}, delay: 1.5, onComplete: function(){
			TweenLite.to($title, 1, {css:{
				opacity: 0.3
			}})
		}})
	}



	/*
	**
	**	描述: 显示及绑定图片显示操作
	**
 	*/
	;(function(){
		_.each(gShowPhotosOfKeyboard, function(photoPro, key){
			$dom.on('keyup', function(e){
				var code = e.which;
				if(code == key){
					// TODO
					_loadAndShowPhoto(photoPro);
				}
			})
		});
	}());

	/*
	**
	**	描述: 图片加载, 并且所有图片都加载完后, 在页面上显示
	**
 	*/
	function _loadAndShowPhoto(photo){
		var pics = photo.pics,
			promises = []
		;

		_.each(pics, function(url){
			promises.push(_loadImage(url));
		})

		$.when.apply($, promises).then(function(){
			var imgs = [].slice.call(arguments, 0);
			// console.log()
			_showPhotoFrame();
			_appendPhoto(imgs, photo);
		});
	}


	/*
	**
	**	描述: 图片加载
	**
 	*/
	function _loadImage(url){
		var defer = $.Deferred();

		loadImage(url, function(img){
			// console.log('[%s], 加载完成!', url);
			defer.resolve(img);
		})
		return defer.promise();
	}


	/*
	**
	**	描述: 显示相框
	**
 	*/
	function _showPhotoFrame(){
		TweenLite.set($photo, {css: {opacity: 0, scale: 0}})
		TweenLite.to($photo, 0.6, {css: {opacity: 1, scale: 1}})
	}


	/*
	**
	**	描述: 相框中插入图片
	**
 	*/
	function _appendPhoto(imgs, options){
		photoTimeID && window.clearTimeout(photoTimeID);
		_emptyPhoto();
		_.each(imgs, function(img){
			$photo.append(img);
		});
		_initPhotoAnim(options);

		isPhoto = true;
	}


	/*
	**
	**	描述: 情况相框
	**
 	*/
	function _emptyPhoto(){
		$photo.empty();
		window.cutPhoto = null;
		photoTimeID && window.clearTimeout(photoTimeID);
	}

	/*
	**
	**	描述: 初始化动画
	**
 	*/
	function _initPhotoAnim(options){
		var images = $photo.find('img'),
		    // tl = new TimelineMax({repeat:-1}),
		    duration = 4,
		    current = 0,
		    size = images.length,
		    isLoop = !!options.loop,
		    i = 0
	    ;
		TweenLite.set($photo, {perspective:2500});
		TweenLite.set(images, {rotationY:180});
		TweenLite.set(images[0], {rotationY:0});

		// for(var i = 0; i < images.length; i++){
		// 	var nextImage = (i+1) == images.length ? images[0] : images[i+1];
		// 	tl
		// 		.to(images[i], duration, {rotationY:'-180_ccw'}, (duration * i + 1))
		// 		.to(nextImage, duration, {rotationY:'0_ccw'}, (duration * i + 1));
		// }


		function doAnim(){


			if(!isLoop && (i!==0) && (i === size - 1) ){
				return;
			}
			i++

			var currImage = images[current],
				nextImage = (++current == size) ? images[(current = 0)] : images[current]
			;

			TweenLite.to(currImage, 1, {css: {x: -1900, opacity: 0}, onComplete: function(){
				TweenLite.set(currImage, {css: {rotationY: 180, opacity: 1, x: 0}})
			}})

			TweenLite.set(nextImage, {css: {rotationY: 0, scale: 1}});
			TweenLite.to(nextImage, 1.5, {css:{opacity: 1, scale: 1}, delay: 0.5, onComplete: onComplete});

		}


		function onComplete(){
			if(options.auto === true){
				photoTimeID = window.setTimeout(function(){
					doAnim()
				}, 1000*(options.interval || 0) )
			}
		}

		if(options.auto === true){
			photoTimeID = window.setTimeout(function(){
				doAnim()
			}, 5000)
		}else{
			window.cutPhoto = function(){
				doAnim();
			}
		}

	}

	/****************************************************************
	**
	**	描述: 将动作暴露到全局对象上, 可以在动作区来完成按键操作
	**
 	****************************************************************/
	// _dwindleBulletTitle();

	// 隐藏弹幕标题
	window.hideBulletTitle = function(){
		_dwindleBulletTitle()
	}

	// 开始弹幕
	window.startBullet = function(){
		bulletEnable = true;
		_showOrHideBulletText(false);
		window.requestAnimationFrame(launch);
	}

	// 暂停弹幕
	window.stopBullet = function(){
		bulletEnable = false;
		_showOrHideBulletText(true);
	}


	window.hideBulletShow = function(){
		$photo.hide();
	}

	window.showBulletShow = function(){
		$photo.show();
	}



	// 关灯
	var darkBullet = window.darkBullet = function(){
		$container.addClass('black');
		isBlack = true;
	}


	// 恢复原始, 暴露弹幕功能
	var toBulletDefault = window.toBulletDefault = function(){
		if(isBlack){
			$container.removeClass('black');
			isBlack = false;
		}

		if(isPhoto){
			_emptyPhoto();
			isPhoto = false;
		}

	}




})