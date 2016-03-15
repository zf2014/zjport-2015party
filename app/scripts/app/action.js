

$(function(){
	var $dom = $(document);
	var domain = 'http://weixin.chinabeston.com/';

	$dom.on('keyup', function(e){
		var code = e.which;
		console.log(code)




		/*********************************************************
		**
		**	描述: 功能页面跳转(数字键操作)
		**
	 	*********************************************************/

		// 签到页面 => 1(数字键盘)
		if(code === 97){
			window.location.href = domain + 'cgoWeixin/screen/sphere.jspa'
		}
		// 欢迎语 => 2(数字键盘)
		else if(code === 98){
			window.location.href = domain + 'cgoWeixin/screen/ride.jspa'
		}
		// 开幕式 => 3(数字键盘)
		else if(code === 99){
			window.location.href = domain + 'cgoWeixin/screen/ceremony.jspa'
		}
		// 弹幕 => 4(数字键盘)
		else if(code === 100){
			window.location.href = domain + 'cgoWeixin/screen/bullet.jspa'
		}
		// 打赏 => 5(数字键盘)
		else if(code === 101){
			window.location.href = domain + 'cgoWeixin/screen/rewardShow.jspa?candId=1'
		}
		// 入围 => 6(数字键盘)
		else if(code === 102){
			window.location.href = domain + 'cgoWeixin/screen/rewardShow!showEnterResultList.jspa'
		}
		// 获奖 => 7(数字键盘)
		else if(code === 103){
			window.location.href = domain + 'cgoWeixin/screen/rewardShow!showFinalResultList.jspa'
		}



		/*********************************************************
		**
		**	描述: 签到页面(TAB键之后的一排键盘)
		**
	 	*********************************************************/

		// 圆球居中 => Q
		else if(code === 81){
			(typeof toCenter !== 'undefined') && toCenter();
		}		
		// 圆球变大 => W
		else if(code === 87){
			(typeof sphereToLarge !== 'undefined') && sphereToLarge();
		}
		// 圆球变小 => S
		else if(code === 69){
			(typeof sphereToSmall !== 'undefined') && sphereToSmall();
		}
		// 圆球消失, 拼字进入 => R
		else if(code === 82){
			(typeof stopSphereAnim !== 'undefined') && stopSphereAnim();
		}


		/*********************************************************
		**
		**	描述: 弹幕页面(Caps Lock键之后的一排键盘)
		**
	 	*********************************************************/
	 	// 显示弹幕 => A
		else if(code === 65){
			(typeof startBullet !== 'undefined') && startBullet();
		}
		// 关闭弹幕 => S
		else if(code === 83){
			(typeof stopBullet !== 'undefined') && stopBullet();
		}
		// 关灯(黑屏) => D
		else if(code === 68){
			(typeof darkBullet !== 'undefined') && darkBullet();
		}
		// 原始屏 => F
		else if(code === 70){
			(typeof toBulletDefault !== 'undefined') && toBulletDefault();
		}
		// 隐藏标题 => G
		else if(code === 71){
			(typeof hideBulletTitle !== 'undefined') && hideBulletTitle();
		}


		/*********************************************************
		**
		**	描述: 弹幕中节目图片(~后的1-9键, 表示不同节目图片)
		**
	 	*********************************************************/
		// 节目图片切换 => ~
		else if(code === 192){ 
			(typeof cutPhoto !== 'undefined') && cutPhoto();
		}
		// 隐藏节目图片 => -
		else if(code === 189){ 
			(typeof hideBulletShow !== 'undefined') && hideBulletShow();
		}
		// 显示节目图片 => +
		else if(code === 187){ 
			(typeof showBulletShow !== 'undefined') && showBulletShow();
		}

		/*********************************************************
		**
		**	描述: 打赏页面(切换) -- 方向键 [<- 和 ->]
		**
	 	*********************************************************/
		// 打赏下一个节目 => ->
		else if(code === 39){ 
			(typeof nextShow !== 'undefined') && nextShow();
		}

		// 打赏上一个节目 => <-
		else if(code === 37){ 
			(typeof prevShow !== 'undefined') && prevShow();
		}

		/*********************************************************
		**
		**	描述: 入围&得奖页面
		**
	 	*********************************************************/

		// 所有表演节目 => Z
		else if(code === 90){ 
			(typeof turnoverCards !== 'undefined') && turnoverCards();
		}

		// 入围节目得分 => X
		else if(code === 88){ 
			(typeof ensureFinalists !== 'undefined') && ensureFinalists();
		}

		// 获奖名称 => C(按3次)
		else if(code === 67){
			(typeof gShowTop3 !== 'undefined') && gShowTop3();
		}

		return false;

	})
})