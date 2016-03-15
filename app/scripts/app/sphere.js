$(function(){
	var $container = $('#J-sphereContainer'),
		$picList = $('#J-picList'),
		$pic = $picList.find('.pic'),
		$newComer = $('#J-newComer'),
		$codeScan = $('#J-codeScan'),
		$win = $(window),
		$dom = $(document),
		toSpin,
		toLarge,
		isLarge = false,
		isFlyinFinish = false,
		tl,
		r = 0,
		maxRepeatSize = Infinity,

		smallDurationTime = 28,

		picShuffArr = _.shuffle($pic),
		len = picShuffArr.length - 1,
		currentIndex = 0

		,start
		,fakeUserInfo // 虚构的用户签到信息
	;


	launch();

	/*
	**
	**	描述: 启动工程
	**
 	*/
	function launch(){
		$.ajax({
			url: '/cgoWeixin/screen/loginUserAll.jspa',
			type: 'POST',
			dataType: 'json',
			success: function(result){
				var userList = result.rst.userlist;

				// fakeUserInfo = userList[2];

				_.each(userList, function(user, index){
					_setSphereBackgroudImageByIndex(user.vxHead)
				});
				_getSigninUserAndShow();
			},
			error: function(err){
			},
			complete: function(){
				_spin();
			}
		});
	}



	/*
	**
	**	描述: 球体旋转
	**
 	*/
	function _spin(){
		toSpin = TweenMax.to($picList, smallDurationTime, {css: {rotationY: 360}, repeat: -1, ease: Linear.easeNone, onRepeat: function(){
			r++
			if(r > maxRepeatSize){
				toSpin.pause();
				flyoutAll();
				return;
			}
		}});
	}

	/*
	**
	**	描述: 球体居中, 且二维码消失
	**
 	*/
	function _center(){
		TweenMax.to($picList, 2, {x: 0});
		TweenMax.to($codeScan, 2, {x: -100, y: -200, scale: 0.1, opacity: 0});
	}

	/*
	**
	**	描述: 球体放大
	**
 	*/
	function _sphereToLarge(){
		if(isLarge){
			return;
		}
		toLarge = TweenMax.to($picList, 5, {css: {z: 250}});
		isLarge = true;
	}

	/*
	**
	**	描述: 球体缩小(复原)
	**
 	*/
	function _sphereToSmall(){
		if(!isLarge){
			return;
		}
		toSpin.duration(smallDurationTime);
		TweenMax.to($picList, 3, {css: {z: -400}})
		// toLarge.reverse();
		isLarge = false;
	}

	/*
	**
	**	描述: 签到飞入
	**
 	*/
	var flyin = (function(){
		var tl = new TimelineMax({paused: true, onComplete: finishCallback}),
			mLeft,
			mTop,
			first = true,
			i = 0,
			max = Infinity,
			avatar
		;

		mLeft = $container.width()/2;
		mTop = $container.height()/2;

		tl.add(TweenMax.to($newComer, 3, {css: {x: -mLeft + 80, y: -mTop, z: 400,  rotationY: 720, rotationX: 720, rotationZ: 720, opacity: 1, scale: 1, transformOrigin: '50%'}}))
		tl.add(TweenMax.to($newComer, 2, {z: 50, scale: 0.1, opacity: 0}))


		function finishCallback(){
			_getSigninUserAndShow();
			_setSphereBackgroudImageByIndex(avatar)
		}

		function setAvatar(userInfo){
			$newComer.css({
				"background-image": "url(" + (avatar = userInfo.vxHead) + ")"
			})
		}

		return function(userInfo){

			if(isFlyinFinish == true){
				return;
			}

			setAvatar(userInfo);

			isFlyinFinish = false;
			i++
			if(first){
				tl.play();
				first = false;
			}else{
				if(i < max){
					tl.restart();
					return;
				}
				isFlyinFinish = true;
				toSpin.seek();
				flyoutAll();
			}
		}
	}());


	/*
	**
	**	描述: 球体消失, 文字飞入
	**
 	*/
	var flyoutAll = (function(){
		var first = true,
			arr = [],
			num = 0,
			c = 0
		;

		return function(){
			toSpin.pause();
			if(first){
				_.each(_.shuffle($pic), function(node, i){

					arr.push(TweenMax.to(node, 0.8, {css: {z: -800, opacity: 0, x: (1800 + Math.random()*100), y: Math.random()*100, scale: 0.1, opacity: 0}, ease: Power4.easeIn, delay: i*0.004, onStart: function(){
						num++
					}, onComplete:function(){
						c++;
						if(c == $pic.length){
							window.letterLoop();
						}

					}, onReverseComplete: function(){
						num--
						if(num === 0 ){
							toSpin.restart();
							first = true;
						}
					}}));
				})

				first = false;
				return;
			}else{
				var tween
				;

				while(!!arr.length && (tween = arr.shift())){
					tween.reverse();
				}
				return;
			}
		}

	}())

	/*
	**
	**	描述: 设置球体上的头像
	**
 	*/
	function _setSphereBackgroudImageByIndex(url){
		var n = Math.random()>0.5?1:2;

		if( currentIndex > len ){
			return;
		}


		_.times(n, function(){

			$(picShuffArr[currentIndex]).addClass('no-border').find('div').css({
				"background-image": "url(" + url + ")"
			})
			currentIndex++;
		})

		
	}

	/*
	**
	**	描述: 获取签到数据, 并且加入动画效果
	**
 	*/
	function _getSigninUserAndShow(){
		$.ajax({
			url: '/cgoWeixin/screen/loginUser.jspa',
			type: 'POST',
			dataType: 'json',
			success: function(result){
				var userInfo = result.rst.userInfo;
				if(userInfo){
					flyin(userInfo)
				}else{
					throttleGetSigninInfoFunc();
				}
			},
			error: function(err){
			}
		});
	}

	/*
	**
	**	描述: 获取签到数据, 并且加入动画效果(添加阀值)
	**
 	*/
	var throttleGetSigninInfoFunc = _.throttle(_getSigninUserAndShow, 1000, {leading: false})





	window.toCenter = function(){
		isFlyinFinish = true;
		_center();
	}
	window.stopSphereAnim = function(){
		// 不在显示签到照片
		isFlyinFinish = true;
		// 最后旋转一圈, 然后散开
		maxRepeatSize = r;
		// flyoutAll();
	}
	window.sphereToLarge = _sphereToLarge;
	window.sphereToSmall = _sphereToSmall;


	window.stop = function(){
		toSpin.pause();
	}
});