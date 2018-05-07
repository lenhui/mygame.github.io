$(document).ready(function(){
	
	var Arr_pokerContent = []; //空数组放卡牌数据对象

	//初始化三位玩家对象的信息
	var play_1 = { name: 'Sun Xuyang', poker:[], id:1, landholder:false, htmlclass:'.play_1'};
	var play_2 = { name: 'Chen Zhoushi',poker:[],id:2, landholder:false, htmlclass:'.play_2'};
	var play_3 = { name: 'Li Enhui',poker:[],id:3, landholder:false, htmlclass:'.play_3'};
	var landholder_card = [];
	var game_manager = { nowPlayer:null, maxPlayer:null, Isturn:false, skipTime:0 };
	var playerObj_Arr = [ play_1, play_2, play_3 ]; 
	var play_card_MessageObj = {
		card_Arr: [],
		card_Type : null,//number
		card_point : null//number
	};

	//便于后期操作卡组
	$('.left .play_1').addClass('player_card_area');
	$('.mid_end .play_2').addClass('player_card_area');
	$('.right .play_3').addClass('player_card_area');

	function pokerInit() {
		//初始化生成一副无内容的扑克牌
		for (var i = 0; i < 54; i++) {
			$('.all_poker').prepend('<li class="back" style="top:'+i+'px;>"</li>');
		}

		//往扑克牌添加内容，把一张牌当成一个对象，对象中放入花色和数值两个属性值

		function createPokerContent(flower_color,i) { //往数组添加牌数据-除了大小王
			var card_id = flower_color+'-'+i;
			Arr_pokerContent.push(card_id);
		} 
		for (var i = 1; i < 5; i++) {
			for (var j = 1; j < 14; j++) {
				createPokerContent(i,j);
			}
		}
		Arr_pokerContent.push("0-14","0-15"); //补上大小王
		// console.log(Arr_pokerContent);
	}
	pokerInit();
// --------------------------------------------------

	//洗牌：实际上是打乱数组
	$('.all_poker').prepend('<button class="shuffle_btn" style="position:absolute;top:-35px;left:0px;">洗牌<button>');
	$('.shuffle_btn').click(function(){shuffle(Arr_pokerContent)});
	function shuffle(a) { //a is array
	    var len = a.length;
	    for (var i = 0; i < len - 1; i++) {
	        var index = parseInt(Math.random() * (len - i));
	        var temp = a[index];
	        a[index] = a[len - i - 1];
	        a[len - i - 1] = temp;
	    }
	    //陈总动画效果
	    setTimeout(function(){
	    		for(var i=0;i<18;i++){
	    			$('.all_poker li').eq(36+i).animate({top:i+'px'},800).delay(500).animate({left:530+i+'px',top:0+'px'},400).delay(28).animate({left:-600+60*i+'px'},300).animate({top:600+'px'},700);
	    			$('.all_poker li').eq(35-i).animate({top:300-i+'px'},800).delay(500).animate({left:550-i+'px',top:300+'px'},400).delay(28).animate({left:-600+60*i+'px'},300).animate({top:300+'px'},700);
	    			$('.all_poker li').eq(17-i).animate({top:600-i+'px'},800).delay(500).animate({left:550-i+'px',top:600+'px'},400).delay(28).animate({left:-600+60*i+'px'},300).animate({top:0+'px'},700);
	    		};
    	},200);
    	setTimeout(function(){
    		for(var i=0;i<18;i++){
    			$('.all_poker li').eq(36+i).animate({left:600+i+'px'},300);//.delay(35).animate({left:0+'px',top:300+i+'px'},400);
    			$('.all_poker li').eq(35-i).animate({left:-600+i+'px'},300);//.delay(35).animate({left:0+'px',top:300+i+'px'},400);
    			$('.all_poker li').eq(17-i).animate({left:600+i+'px'},300);//.delay(35).animate({left:0+'px',top:300+i+'px'},400);
    		};
    	},400);
    	setTimeout(function(){
    		for(var i=0;i<54;i++){
    			$('.all_poker li').delay(35).eq(i).animate({left:0+'px',top:300+i+'px'},400).delay(500).animate({left:(Math.ceil(Math.random()*2000))-500+'px',top:(Math.ceil(Math.random()*2000))-500+'px'},400).delay(2000).animate({left:0+'px',top:0+i/2+'px'},400);
    		};
    	},800);
	    //陈总动画效果
		// console.log(a);
	};
// --------------------------------------------------之前的应该先不用管了

	//发牌
	$('.shuffle_btn').after('<button class="deal_btn" style="position:absolute;top:-35px;left:40px;">发牌<button>');
	$('.deal_btn').click(dealPoker);
	function dealPoker() {
			// shuffle(Arr_pokerContent); 发牌就别洗牌啊！！
			//html占位布局，此时并没有内容图
			// if ($('.mid_end .play_2').children().length>0 && $('.landholder_btn').attr('pick_time')!=4) { alert('已经发牌了'); return false; }
			if ($('.mid_end .play_2').children().length>0) { alert('已经发牌了'); return false; }
			$('.player_card_area').empty();
			for (var i = 0; i < 17; i++) {  //三位玩家发牌
				$('.mid_end .play_2').append('<li class="back" style="left:'+(i*20-16/2*20)+'px;"></li>')
				$('.left .play_1').append('<li class="back" style="top:'+(i*35)+'px;"></li>')
				$('.right .play_3').append('<li class="back" style="top:'+(i*35)+'px;"></li>')
			}
			for (var i = 0; i < 3; i++) {  //桌面区发牌（作为前期地主牌，后期用于显示玩家出的牌）
				$('.all_poker').append('<li class="back landholder_card_className" style="left:'+(i*20-20)+'px; top:180px;"></li>');
			}

			

			//将打乱数组的元素添加到玩家对象各自的数组中
			while (play_1.poker.length<17) {
				play_1.poker.push(Arr_pokerContent.pop());
				play_2.poker.push(Arr_pokerContent.pop());
				play_3.poker.push(Arr_pokerContent.pop());
			};
			while (landholder_card.length<3) {
				landholder_card.push(Arr_pokerContent.pop());
			}
			// console.log(play_1.poker)


			//给牌添加内容
			var bg_pos = [
				[-17,-5],	//club
				[-162,-5],	//heart
				[-17,-224],	//diamond
				[-162,-224],	//spade
			];
			for (var i = 0; i < play_1.poker.length; i++) {  //把字符串元素拆分为数组
				play_1.poker[i].split('-');  //拆分数组，形成花色+数字的子数组
				switch (parseInt(play_1.poker[i][0])){	//根据花色选择背景图片坐标
					case 1:
						var bg_x = bg_pos[3][0];
						var bg_y = bg_pos[3][1];
					break;

					case 2:
						var bg_x = bg_pos[1][0];
						var bg_y = bg_pos[1][1];
					break;

					case 3:
						var bg_x = bg_pos[0][0];
						var bg_y = bg_pos[0][1];
					break;

					case 4:
						var bg_x = bg_pos[2][0];
						var bg_y = bg_pos[2][1];
					break;

					default:
						if(play_1.poker[i].split('-')[1] == 14){
							$('.left .play_1 li:eq('+i+')').css('background','url(./images/14.png) -17px -5px no-repeat');
						}else if(play_1.poker[i].split('-')[1] == 15){
							$('.left .play_1 li:eq('+i+')').css('background','url(./images/15.png) -17px -5px no-repeat');
						}
				}
				//根据数字值选择背景图片文件
				if (play_1.poker[i].split('-')[0] != 0) {
					$('.left .play_1 li:eq('+i+')').css('background','url(./images/'+ play_1.poker[i].split('-')[1] +'.png) '+ bg_x +'px '+ bg_y +'px '+'no-repeat');
				}
			}

			for (var i = 0; i < play_2.poker.length; i++) {  //把字符串元素拆分为数组
				play_2.poker[i].split('-');  //拆分数组，形成花色+数字的子数组
				switch (parseInt(play_2.poker[i][0])){	//根据花色选择背景图片坐标
					case 1:
						var bg_x = bg_pos[3][0];
						var bg_y = bg_pos[3][1];
					break;

					case 2:
						var bg_x = bg_pos[1][0];
						var bg_y = bg_pos[1][1];
					break;

					case 3:
						var bg_x = bg_pos[0][0];
						var bg_y = bg_pos[0][1];
					break;

					case 4:
						var bg_x = bg_pos[2][0];
						var bg_y = bg_pos[2][1];
					break;

					default:
						if(play_2.poker[i].split('-')[1] == 14){
							$('.mid_end .play_2 li:eq('+i+')').css('background','url(./images/14.png) -17px -5px no-repeat');
						}else if(play_2.poker[i].split('-')[1] == 15){
							$('.mid_end .play_2 li:eq('+i+')').css('background','url(./images/15.png) -17px -5px no-repeat');
						}
				}
				if (play_2.poker[i].split('-')[0] != 0) {
					$('.mid_end .play_2 li:eq('+i+')').css('background','url(./images/'+ play_2.poker[i].split('-')[1] +'.png) '+ bg_x +'px '+ bg_y +'px '+'no-repeat');
				}
			}

			for (var i = 0; i < play_3.poker.length; i++) {  //把字符串元素拆分为数组
				play_3.poker[i].split('-');  //拆分数组，形成花色+数字的子数组
				switch (parseInt(play_3.poker[i][0])){	//根据花色选择背景图片坐标
					case 1:
						var bg_x = bg_pos[3][0];
						var bg_y = bg_pos[3][1];
					break;

					case 2:
						var bg_x = bg_pos[1][0];
						var bg_y = bg_pos[1][1];
					break;

					case 3:
						var bg_x = bg_pos[0][0];
						var bg_y = bg_pos[0][1];
					break;

					case 4:
						var bg_x = bg_pos[2][0];
						var bg_y = bg_pos[2][1];
					break;

					default:
						if(play_3.poker[i].split('-')[1] == 14){
							$('.right .play_3 li:eq('+i+')').css('background','url(./images/14.png) -17px -5px no-repeat');
						}else if(play_3.poker[i].split('-')[1] == 15){
							$('.right .play_3 li:eq('+i+')').css('background','url(./images/15.png) -17px -5px no-repeat');
						}
				}
				//根据数字值选择背景图片文件
				if (play_3.poker[i].split('-')[0] != 0) {
					$('.right .play_3 li:eq('+i+')').css('background','url(./images/'+ play_3.poker[i].split('-')[1] +'.png) '+ bg_x +'px '+ bg_y +'px '+'no-repeat');
				}
			}





			//地主卡片现身
			function landholder_card_get(player_class,playerObj) {
				if (player_class === '.play_1') { alert('玩家一号(左)有个很无解的bug，建议做了地主后打开控制台看一下....') };
				$(player_class+' button').remove();
				playerObj.landholder = true;
				game_manager.nowPlayer = playerObj;
				for (var i = 0; i < landholder_card.length; i++) {  //把字符串元素拆分为数组
					landholder_card[i].split('-');  //拆分数组，形成花色+数字的子数组
					// console.log(landholder_card);
					switch (parseInt(landholder_card[i][0])){	//根据花色选择背景图片坐标
						case 1:
							var bg_x = bg_pos[3][0];
							var bg_y = bg_pos[3][1];
						break;

						case 2:
							var bg_x = bg_pos[1][0];
							var bg_y = bg_pos[1][1];
						break;

						case 3:
							var bg_x = bg_pos[0][0];
							var bg_y = bg_pos[0][1];
						break;

						case 4:
							var bg_x = bg_pos[2][0];
							var bg_y = bg_pos[2][1];
						break;

						default:
							if(landholder_card[i].split('-')[1] == 14){
								$('.landholder_card_className:eq('+i+')').css('background','url(./images/14.png) -17px -5px no-repeat');
							}else if(landholder_card[i].split('-')[1] == 15){
								$('.landholder_card_className:eq('+i+')').css('background','url(./images/15.png) -17px -5px no-repeat');
							}
					}
					//根据数字值选择背景图片文件
					if (landholder_card[i].split('-')[0] != 0) {
						// $('.landholder_card_className:eq('+i+')').css('background','url(./images/'+ parseInt(landholder_card[i].split('-')[1]) +'.png) '+ bg_x +'px '+ bg_y +'px '+'no-repeat');
						$('.landholder_card_className').eq(i).css('background','url(./images/'+ parseInt(landholder_card[i].split('-')[1]) +'.png) '+ bg_x +'px '+ bg_y +'px '+'no-repeat');
					}
					// console.log(parseInt(landholder_card[i].split('-')[1]))


					//根据地主的身份调整放入地主牌的top+left样式
					switch(player_class){
						case '.play_2':
							$('.landholder_card_className:eq('+i+')').clone().css('top','0px').appendTo($(player_class));
						break;

						case '.play_1':
							$('.landholder_card_className:eq('+i+')').clone().css({ 'left':'0px','top': i*35+'px' }).appendTo($(player_class));
							console.log('地主牌点数是: '+ (parseInt(landholder_card[i].split('-')[1])+2) +','+'地主牌花色是: '+ parseInt(landholder_card[i].split('-')[0]) + '【0-王 / 1-黑桃 / 2-红心 / 3-梅花 / 4-方块】' );
						break;                                                 

						case '.play_3':
							$('.landholder_card_className:eq('+i+')').clone().css({ 'left':'0px','top': i*35+'px' }).appendTo($(player_class));
						break;
					}

				}

				switch(player_class){  //地主牌插入牌堆，在视觉上对齐
					case '.play_1':
						// $('.left .play_1').append('<li class="back" style="top:'+(i*35)+'px;"></li>')
						for (var i = 0; i < $('.play_1 li').length; i++) {
							$('.play_1 li:eq('+i+')').css('top',i*35+'px');
						}
					break;

					case '.play_3':
						for (var i = 0; i < $('.play_3 li').length; i++) {
							$('.play_3 li:eq('+i+')').css('top',i*35+'px');
						}
					break;

					case '.play_2':
					// $('.mid_end .play_2').append('<li class="back" style="left:'+(i*20-17/2*20)+'px;"></li>')
						for (var i = 0; i < $('.play_2 li').length; i++) {
							$('.play_2 li:eq('+i+')').css('left',(i*20-190)+'px');
						}
					break;
				}

				//把加入的地主牌排序
				for (var i = 0; i < 3; i++) {
					playerObj.poker.push(landholder_card.pop());
				}
				setTimeout(function(){sortPoker(playerObj)},1000);

				//拿了地主后清除多余按钮
				$('.all_poker button').remove();
				$('.all_poker').append('<button class="showCard_btn" style="position:absolute;top:-40px;min-width:100%">开始出牌</button>')

//------------------------------------------------------------------------------------------------------------------------------------------------

				//这里开始是出牌阶段了。
				$('.showCard_btn').click(showCardStage);
				function showCardStage() {
					var host_obj = null;
					if (play_1.landholder) {host_obj = play_1;} 
					if (play_2.landholder) {host_obj = play_2;} 
					if (play_3.landholder) {host_obj = play_3;}
					$('.all_poker').empty();
					$('.all_poker').addClass('game_table');


					//找到地主，从它开始
					// host_obj
					//先加入一个判断决定应该由哪个玩家使用这个逻辑，判断依据定义为一个全局记录对象的属性
					play_skip(game_manager.nowPlayer.htmlclass);


					$('.play_1 li,.play_2 li,.play_3 li').click(chosenCard);
					function chosenCard() { //选完牌准备打出去
						if($(this).parent().hasClass('play_1')) {
							if ($(this).css('left')!=='40px') {
								$(this).addClass('chosen_card');
								$(this).css('left','40px');
							}else{
								$(this).removeClass('chosen_card');
								$(this).css('left','0px');
							}
						}
						if($(this).parent().hasClass('play_2')) {
							if ($(this).css('bottom')!=='20px') {
								$(this).addClass('chosen_card');
								$(this).css('bottom','20px');
								$(this).css('top','auto');
							}else{
								$(this).removeClass('chosen_card');
								$(this).css('bottom','0px');
								$(this).css('top','auto');
							}
						}
						if($(this).parent().hasClass('play_3')) {
							if ($(this).css('right')!=='40px') {
								$(this).addClass('chosen_card');
								$(this).css('right','40px');
								$(this).css('left','auto');
							}else{
								$(this).removeClass('chosen_card');
								$(this).css('right','0px');
								$(this).css('left','auto');
							}
						}
						// console.log(typeof $(this).position().top);
					}//chosenCard函数结尾


					function play_skip(htmlclass) { //使得出牌跳牌按钮在地主位置出现
						$(htmlclass).append('<button class="play_btn" style="position:absolute;">出牌</button><button class="skip_btn" style="position:absolute;">跳过</button>');
						if(htmlclass === '.play_1'){
							$('.play_btn').css({'left':'190px','top':'150px','min-width':'2.5em'});
							$('.skip_btn').css({'left':'190px','top':'190px','min-width':'2.5em'});
						}
						if(htmlclass === '.play_2'){
							$('.play_btn').css({'left':'-40px','top':'-60px'});
							$('.skip_btn').css({'left':'50px','top':'-60px'});
						}
						if(htmlclass === '.play_3'){
							$('.play_btn').css({'left':'-130px','top':'150px'});
							$('.skip_btn').css({'left':'-130px','top':'190px'});
						}


						//出牌按钮的行为---把牌选出来后就开始打出去
						// $(htmlclass+' .play_btn').one('click',playBtnFunc);
						$(htmlclass+' .play_btn').click(playBtnFunc);
						function playBtnFunc() {
							//出牌逻辑！！
							function afterPlayDisplay(playerObj) { //生成牌的背景
								$(playerObj.htmlclass+' li').remove();
								for (var i = 0; i < playerObj.poker.length; i++) {  //把字符串元素拆分为数组
										if(playerObj === play_1 || playerObj === play_3) {
											$(playerObj.htmlclass).append('<li class="back" style="top:'+(i*35)+'px;"></li>')
										}else if(playerObj === play_2) {
											$(playerObj.htmlclass).append('<li class="back" style="left:'+(i*20-(playerObj.poker.length-1)*20/2)+'px;"></li>')
										}
										$(playerObj.htmlclass + ' li').eq(i).click(chosenCard);
										playerObj.poker[i].split('-');  //拆分数组，形成花色+数字的子数组
										switch (parseInt(playerObj.poker[i][0])){	//根据花色选择背景图片坐标
											case 1:
												var bg_x = bg_pos[3][0];
												var bg_y = bg_pos[3][1];
											break;

											case 2:
												var bg_x = bg_pos[1][0];
												var bg_y = bg_pos[1][1];
											break;

											case 3:
												var bg_x = bg_pos[0][0];
												var bg_y = bg_pos[0][1];
											break;

											case 4:
												var bg_x = bg_pos[2][0];
												var bg_y = bg_pos[2][1];
											break;

											default:
												if(playerObj.poker[i].split('-')[1] == 14){
													$(playerObj.htmlclass+' li:eq('+i+')').css('background','url(./images/14.png) -17px -5px no-repeat');
												}else if(playerObj.poker[i].split('-')[1] == 15){
													$(playerObj.htmlclass+' li:eq('+i+')').css('background','url(./images/15.png) -17px -5px no-repeat');
												}
										}
										//根据数字值选择背景图片文件
										if (playerObj.poker[i].split('-')[0] != 0) {
											$(playerObj.htmlclass+' li:eq('+i+')').css('background','url(./images/'+ playerObj.poker[i].split('-')[1] +'.png) '+ bg_x +'px '+ bg_y +'px '+'no-repeat');
										}
									}
							}
							function playChange(playerObj) { //出牌后的视觉以及数据内容变化
								var handCard_Length = playerObj.poker.length; //手牌长度
								var playCard_indexs = []; //数组元素指代打出的牌在手牌中的位置
								var playCard_point = null;
								function kind_1and5plus(argument) {
									if (play_card_MessageObj.card_Arr.length!==1&&play_card_MessageObj.card_Arr.length<5) { game_manager.Isturn = false; alert('现在只能出一个或者顺子'); return false; };
									for (var i = 0; i < play_card_MessageObj.card_Arr.length; i++) {
										//拿到待出牌在手牌中的的index，才能拿到点数
										if (playerObj === play_1 || playerObj === play_3) {
											playCard_indexs.push(play_card_MessageObj.card_Arr[i].position().top / 35);
										}else if (playerObj === play_2) {
											playCard_indexs.push((play_card_MessageObj.card_Arr[i].position().left + (handCard_Length-1)*20/2) /20);
										}
										play_card_MessageObj.card_Arr[i].order = i;//标记出出牌对象的顺序位置


										//拿到牌的点数
										playCard_point = parseInt(game_manager.nowPlayer.poker[playCard_indexs[i]].split('-')[1]);

										// -----------------------------------------------------------------------
										
										//拿到牌的点数，然后判断牌点够不够大，不够大可以在这里退出
										if (play_card_MessageObj.card_point===null || playCard_point>play_card_MessageObj.card_point) {
											play_card_MessageObj.card_point = playCard_point;
										}
										//------------------------------------------------------------------------
										//123456判断
										else if(playCard_indexs.length===play_card_MessageObj.card_Arr.length && parseInt( game_manager.nowPlayer.poker[playCard_indexs[play_card_MessageObj.card_Arr.length-1]].split('-')[1] ) <= play_card_MessageObj.card_point ){ 
											alert('牌不够大');
											game_manager.Isturn = false; 
											return false; 
										}
										//------------------------------------------------------------------------
										// ------------------------------------------------------------------------
										game_manager.Isturn = true;//能运行到这里表明牌是可以打出去的了

										//根据一些线索和条件指定此时的出牌类型
										if (play_card_MessageObj.card_Arr.length===1) {play_card_MessageObj.card_Type = 1} ; 
										//样式控制：牌的视觉变化
										if (i===0) { $('.game_table li.chosen_card').remove(); };
										play_card_MessageObj.card_Arr[i].clone().css({'top':'180px','left':(i*20-(play_card_MessageObj.card_Arr.length-1)/2*20)+'px'}).appendTo($('.game_table'));
									}
									for (var j = 0; j < play_card_MessageObj.card_Arr.length; j++) {
										game_manager.nowPlayer.poker.splice(playCard_indexs[j]-play_card_MessageObj.card_Arr[j].order,1);
									}
								}
								kind_1and5plus();
								if (!game_manager.Isturn) { return false };
								afterPlayDisplay(playerObj);
							}
							//先根据出牌数做判断
							//把对象数据放进数组中
							// console.log($(htmlclass+' .chosen_card').length)
							// console.log($(htmlclass+' .chosen_card').eq(1));
							for (var i = 0; i < $(htmlclass+' .chosen_card').length; i++) {
								play_card_MessageObj.card_Arr.push($(htmlclass+' .chosen_card').eq(i));
							}
							switch(play_card_MessageObj.card_Arr.length){
								//case指代打出的牌的张数！！！
								case 0:
									alert('您没有选择要出的牌，请选择或跳过。');
									return false;
									//没牌出不必改变牌型代号card_Type
								break;

								case 1:
									if (play_card_MessageObj.card_Type === 1 || play_card_MessageObj.card_Type === null) {
										//符合出牌规则时
										//根据偏移样式反推牌的点数
										playChange(game_manager.nowPlayer)
									}
								break;

								case 2:
									if (play_card_MessageObj.card_Type === 2 || play_card_MessageObj.card_Type === null) {
										//符合出牌规则时
										//根据偏移样式反推牌的点数
										playChange(game_manager.nowPlayer)
									}
								break;

								default:
										//符合出牌规则时
										//根据偏移样式反推牌的点数
										playChange(game_manager.nowPlayer)
								break;		

							}
							//清空出牌数组,以便重新运行逻辑
							play_card_MessageObj.card_Arr.splice(0,play_card_MessageObj.card_Arr.length);
							if (!game_manager.Isturn) { return false }
							//指针指向下一个玩家
							$(this).parent().children('button').remove();
							if ($(htmlclass+' li').length===0) {
								setTimeout(function(){
									alert('恭喜'+game_manager.nowPlayer.name+'获得了本局游戏的胜利！'); $('.player_card_area button').remove(); return true;
									},10)
							}else{
								switch(game_manager.nowPlayer) {
								case play_1:
									game_manager.nowPlayer = play_2;
								break;
								case play_2:
									game_manager.nowPlayer = play_3;
								break;
								case play_3:
									game_manager.nowPlayer = play_1;
								break;
								}
								game_manager.skipTime = 0;							
								play_skip(game_manager.nowPlayer.htmlclass);
							}
							
						}//playbtnfunc ending




						//跳过按钮行为
						// $(htmlclass+' .skip_btn').one('click',turnToNextPlayer);
						$(htmlclass+' .skip_btn').click(turnToNextPlayer);
						function turnToNextPlayer() {
							if (game_manager.nowPlayer.poker.length===20 && game_manager.nowPlayer.landholder===true) {
								alert('你是地主，第一轮必须出牌。');return false;
							}
							if (game_manager.skipTime===2) { alert('按照规则你已经不能再跳过了，但你能重新定义牌的格式出牌'); play_card_MessageObj.card_Type=null; return false; }
							switch(game_manager.nowPlayer) {
								case play_1:
									game_manager.nowPlayer = play_2;
								break;
								case play_2:
									game_manager.nowPlayer = play_3;
								break;
								case play_3:
									game_manager.nowPlayer = play_1;
								break;
							}
							game_manager.skipTime+=1;
							play_skip(game_manager.nowPlayer.htmlclass);
							$(this).parent().children('button').remove();
						}
					}
					
					
				} 


			}






			//添加内容后进行排序
			$('.left .play_1>li').hover(function(){sortPoker(play_1)});
			$('.mid_end .play_2>li').hover(function(){sortPoker(play_2)});
			$('.right .play_3>li').hover(function(){sortPoker(play_3)});
			setTimeout(function(){sortPoker(play_1)},1500);
			setTimeout(function(){sortPoker(play_2)},1500);
			setTimeout(function(){sortPoker(play_3)},1500);
			function sortPoker(playerObj) {
				playerObj.poker.sort(function (a,b) { //对数组元素进行排序
					// console.log(a);
					// alert(a);
					var a_arr = a.split('-');
					var b_arr = b.split('-');
					if (a_arr[1] !== b_arr[1]) {
						return a_arr[1] - b_arr[1];
					}else {
						return a_arr[0] - b_arr[0];
					}
				})

				for (var i = 0; i < playerObj.poker.length; i++) {  //把字符串元素拆分为数组
					playerObj.poker[i].split('-');  //拆分数组，形成花色+数字的子数组
					switch (parseInt(playerObj.poker[i][0])){	//根据花色选择背景图片坐标
						case 1:
							var bg_x = bg_pos[3][0];
							var bg_y = bg_pos[3][1];
						break;

						case 2:
							var bg_x = bg_pos[1][0];
							var bg_y = bg_pos[1][1];
						break;

						case 3:
							var bg_x = bg_pos[0][0];
							var bg_y = bg_pos[0][1];
						break;

						case 4:
							var bg_x = bg_pos[2][0];
							var bg_y = bg_pos[2][1];
						break;

						default:
							// if(playerObj.poker[i].split('-')[1] == 1){
							// 	$('.mid_end .play_2 li:eq('+i+')').css('background','url(./images/0.png) -17px -5px no-repeat');
							// }else if(playerObj.poker[i].split('-')[1] == 2){
							// 	$('.mid_end .play_2 li:eq('+i+')').css('background','url(./images/0.png) -162px -5px no-repeat');
							// }这堆东西或者在切换玩家的时候可以用到！！
							// if(playerObj.poker[i].split('-')[1] == 1){
							// 	switch(playerObj){
							// 		case play_2:
							// 			$('.mid_end .play_2 li:eq('+i+')').css('background','url(./images/0.png) -17px -5px no-repeat');
							// 		break;

							// 		case play_1:
							// 			$('.left .play_1 li:eq('+i+')').css('background','url(./images/0.png) -17px -5px no-repeat');
							// 		break;		

							// 		case play_3:
							// 			$('.right .play_3 li:eq('+i+')').css('background','url(./images/0.png) -17px -5px no-repeat');
							// 		break;	
							// 	}
							// }else if(playerObj.poker[i].split('-')[1] == 2){
							// 	switch(playerObj){
							// 		case play_2:
							// 			$('.mid_end .play_2 li:eq('+i+')').css('background','url(./images/0.png) -162px -5px no-repeat');
							// 		break;

							// 		case play_1:
							// 			$('.left .play_1 li:eq('+i+')').css('background','url(./images/0.png) -162px -5px no-repeat');
							// 		break;		

							// 		case play_3:
							// 			$('.right .play_3 li:eq('+i+')').css('background','url(./images/0.png) -162px -5px no-repeat');
							// 		break;	
							// 	}
							// }
					}
					//根据数字值选择背景图片文件
					// $('.mid_end .play_2 li:eq('+i+')').css('background','url(./images/'+ playerObj.poker[i].split('-')[1] +'.png) '+ bg_x +'px '+ bg_y +'px '+'no-repeat');
					// 这堆东西或者在切换玩家的时候可以用到！！
					switch(playerObj){
						case play_2:
							$('.mid_end .play_2 li:eq('+i+')').css('background','url(./images/'+ playerObj.poker[i].split('-')[1] +'.png) '+ bg_x +'px '+ bg_y +'px '+'no-repeat');
							if (playerObj.poker[i].split('-')[0] == 0) {
								$('.mid_end .play_2 li:eq('+i+')').css('background','url(./images/'+ playerObj.poker[i].split('-')[1] +'.png) -17px -5px no-repeat');
							}
						break;

						case play_1:
							$('.left .play_1 li:eq('+i+')').css('background','url(./images/'+ playerObj.poker[i].split('-')[1] +'.png) '+ bg_x +'px '+ bg_y +'px '+'no-repeat');
							if (playerObj.poker[i].split('-')[0] == 0) {
								$('.left .play_1 li:eq('+i+')').css('background','url(./images/'+ playerObj.poker[i].split('-')[1] +'.png) -17px -5px no-repeat');
							}
						break;		

						case play_3:
							$('.right .play_3 li:eq('+i+')').css('background','url(./images/'+ playerObj.poker[i].split('-')[1] +'.png) '+ bg_x +'px '+ bg_y +'px '+'no-repeat');
							if (playerObj.poker[i].split('-')[0] == 0) {
								$('.right .play_3 li:eq('+i+')').css('background','url(./images/'+ playerObj.poker[i].split('-')[1] +'.png) -17px -5px no-repeat');
							}
						break;	
					}
					
				}

			}



			//选地主
			$('.deal_btn').after('<button class="landholder_btn" style="position:absolute;top:-35px;left:80px;">选地主<button>');
			$('.landholder_btn').click(pickLandholder);
			$('.landholder_btn').attr('pick_time',0);
			var player_id = Math.ceil(3*Math.random());
			// var player_id = 2;
			function pickLandholder() {
				if ($('.mid_end .play_2>li').length<=0) { alert('请先发牌'); return false; };
				var landholderYes_btn = '<button class="landholderYes_btn" style="position:absolute;top:350px;left:-80px;min-width:4em;">做地主<button>';
				var landholderNo_btn = '<button class="landholderNo_btn" style="position:absolute;top:390px;left:-80px;min-width:4em;">做农民<button>';
				$('.landholderYes_btn').remove();
				$('.landholderNo_btn').remove();
				switch(player_id){
					case 3:
						$('.right .play_3').append(landholderYes_btn);
						$('.right .play_3').append(landholderNo_btn);
						$('.landholderNo_btn').click(function () {
							player_id = 1;
							pickLandholder();
						});
						$('.landholderYes_btn').click(function () {
							landholder_card_get('.play_3',play_3)
						})
					break;

					case 1:
						$('.left .play_1').append(landholderYes_btn);
						$('.left .play_1').append(landholderNo_btn);
						$('.left .play_1 .landholderYes_btn').css({'left':'140px'});
						$('.left .play_1 .landholderNo_btn').css({'left':'140px'});
						$('.landholderNo_btn').click(function () {
							player_id = 2;
							pickLandholder();
						})
						$('.landholderYes_btn').click(function () {
							landholder_card_get('.play_1',play_1)
						})
					break;

					case 2:
						$('.mid_end .play_2').append(landholderYes_btn);
						$('.mid_end .play_2').append(landholderNo_btn);
						$('.mid_end .play_2 .landholderYes_btn').css({'top':'-40px','left':'-40px'});
						$('.mid_end .play_2 .landholderNo_btn').css({'top':'-40px','left':'100px'});
						$('.landholderNo_btn').click(function () {
							player_id = 3;
							pickLandholder();
						})
						$('.landholderYes_btn').click(function () {
							landholder_card_get('.play_2',play_2)
						})
					break;
				}
				// console.log(typeof $('.landholder_btn').attr('pick_time'));
				// console.log(1+parseInt($('.landholder_btn').attr('pick_time')))
				// var increase = 1+parseInt($('.landholder_btn').attr('pick_time'));
				// $('.landholder_btn').attr('pick_time',increase);
				// console.log($('.landholder_btn').attr('pick_time'));
				// if ($('.landholder_btn').attr('pick_time')>3) { 
				// 	alert('无人叫地主，将重新发牌');
				// 	$('.landholder_btn').attr('pick_time',0); 
				// 	dealPoker(); 
				// };
			}


	}

	

//-----------------------再往下就是onload事件外面了
})
