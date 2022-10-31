(function(Core){
	var Gallery = function(){

		var $this, $galleryWrap, $zoomWrap, args, arrGalleryList=[],arrColorList=[], sliderComponent,sliderComponent2, endPoint;
		var setting = {
			selector:'[data-component-gallery]',
			galleryWrapper:'#product-gallery',
			zoomWrapper:'.pdp-gallery-fullview',
			zoomAppender:'.gallery-images'
		}

		var Closure = function(){}
		Closure.prototype.setting = function(){
			var opt = Array.prototype.slice.call(arguments).pop();
			$.extend(setting, opt);
			return this;
		}

		Closure.prototype.init = function(){
			var _self = this;

			args = arguments[0];
			$this = $(setting.selector);
			$galleryWrap = $this.find(setting.galleryWrapper);
			$zoomWrap = $this.find(setting.zoomWrapper);
			endPoint = Core.getComponents('component_endpoint');

			/*
				fireEvent 가 등록되기전에 호출하여 처음 이벤트는 발생하지 않는다 그래서 setTimeout으로 자체 딜레이를 주어 해결하였다.
				조금 위험한 방법아지만 해결방법을 찾기 전까지 사용해야 할꺼 같다.
			*/
			setTimeout(function(){
				_self.fireEvent('skuLoadComplete', _self, ['COMINGSOON']);
			});

			//pc일때
			var arrList = [];
			$galleryWrap.find('.image-list').each(function(i){
				var data = Core.Utils.strToJson($(this).attr('data-thumb'), true);
				var isImage = ($(this).find('img').size() > 0) ? true : false;
				var imgUrl = $(this).find('img, source').attr('src').replace(/\?[a-z]+/g, '');
				var pushIS = true;

				data.isImage = isImage;
				data.thumbUrl = imgUrl;

				/* 중복 이미지 처리 */
				for(var i=0; i < arrList.length; i++){
					if(arrList[i].thumbSort === data.thumbSort && arrList[i].thumbUrl === data.thumbUrl){
						pushIS = false;
						return;
					}
				}

				if(pushIS){
					arrList.push(data);
					arrGalleryList.push(data);
				}
			});

			//모바일일때
			var arrList2 = [];
			$("#product-option_color").find("a").each(function(){
				var data = {};
				var linkUrl = $(this).attr('href');
				var isImage = ($(this).find('img').size() > 0) ? true : false;
				var imgUrl = $(this).find('img').attr('src').replace(/\?[a-z]+/g, '');
				var pushIS = true;
				data.isImage = isImage;
				data.thumbUrl = imgUrl;
				data.linkUrl = linkUrl;

				if(pushIS){
				arrList2.push(data);
				arrColorList.push(data);
				}
			});


		//모바일 슬라이딩 상세 이미지 클릭시 zoom..
		var img_L = 0;
		var img_T = 0;
		var targetObj;

		function getLeft(o){
				 return parseInt(o.style.left.replace('px', ''));
		};
		function getTop(o){
				 return parseInt(o.style.top.replace('px', ''));
		};

		// 줌 이미지 close
		$("#jq_gallery_zoom .jq_gallery_zoom_close").on('click', function(){
		   $("#jq_gallery_zoom").hide();
		});


		$galleryWrap.on('click', '[data-product-image-list] [data-product-image]', function(){

			var str_img = $(this).attr('data-product-image');

				$("#jq_gallery_zoom").show();  // 줌 이미지 div
				$("#jq_gallery_zoom_img").attr('src', str_img+"?zoom");

				$('#jq_gallery_zoom_div').offset({    // 이미지 화면 중앙으로 조정....
							left: ($(window).width() - $("#jq_gallery_zoom_div")[0].clientWidth)/2,
							top: ($(window).height() - $("#jq_gallery_zoom_div")[0].clientWidth)/2
				});

		});

        //줌 이미지 터치 시작...
		$("#jq_gallery_zoom_div").bind('touchstart', function(e) {

				e.preventDefault();
				obj   = this;
				img_L = getLeft(obj) - event.touches[0].clientX;
				img_T = getTop(obj) - event.touches[0].clientY;

					//guide_t , guide_l 미 설정시 zoom 레이어가 화면 밖으로 나가는 현상 발생
					//이미지 사이즈, 화면 사이즈 계산해서 최대치 정의.

				guide_t = $(window).height()-$("#jq_gallery_zoom_img").height();
				guide_l = $(window).width()-$("#jq_gallery_zoom_img").width();

				//	 obj.style.left = "-500px";
				//	 obj.style.top  = "-500px";

				//	console.log("클릭T :  "+getTop(obj));
				//console.log("================= :  "+ event.touches[0].clientY);
				//console.log("-----------------:  "+ this.style.top);

				//줌 이미지 드래그 시작..
				this.addEventListener("touchmove",function(e){

					e.preventDefault();

					//console.log("클릭L :  "+img_L);
					//	console.log("클릭T :  "+img_T);

					var dmvx = parseInt(e.touches[0].clientX + img_L);
					var dmvy = parseInt(e.touches[0].clientY+ img_T);
					//$("#img").css('transform', 'translate('+dmvx+'px,'+ dmvy+'px)');

					if(dmvx < 0 &&     dmvx > $(window).width() - $('#jq_gallery_zoom_img').outerWidth() ){
					obj.style.left = dmvx +"px";
					};

					if(dmvy < 0   &&   dmvy > $(window).height() - $('#jq_gallery_zoom_img').outerHeight() ){
					obj.style.top = dmvy +"px";
					};

					//console.log("이동L :  "+event.touches[0].clientX );
					console.log("이동L :  "+ dmvx );
					console.log("이동T :  "+ dmvy );

					//	console.log("라스트L :  "+dmvx);
					//	console.log("라스트T :  "+dmvy);
				});
		});


			//pc 상세 이미지 zoom..
			$galleryWrap.on('click', '.image-list a', function(){
				endPoint.call('pdpImageClick');
				$('html').addClass('uk-modal-page');
				$('body').css('paddingRight', 15);
				$zoomWrap.addClass('show');
				//선택항 PDP 이미지 index에 맞게 줌 이미지 스크롤, object.offset.top 값이 좀 이상해서 일일히 계산함.
				var fullWrapper = $this.find('.pdp-gallery-fullview-wrapper');
				if ($galleryWrap.find('video').length) {
			    var imagelengt = arrGalleryList.length-1;
				} else {
					var imagelengt = arrGalleryList.length;
				}
				var eachHeight = fullWrapper.outerHeight()/imagelengt;
				var imageIndex = $(this).attr('href').replace('#', '');
				if ($galleryWrap.find('video').length) {
					var offsetTop = (eachHeight*parseInt(imageIndex-1));
				} else {
					var offsetTop = (eachHeight*parseInt(imageIndex));
				}

				$zoomWrap.animate({scrollTop : offsetTop}, 500, 'linear');
			});

			$zoomWrap.click(function(){
			//  if($('#quickview-wrap').length <= 0){
				$('html').removeClass('uk-modal-page');
				$('body').removeAttr('style');
			//  }
				$(this).removeClass('show');
			});

			//진입시 바로 모바일 pc,사이즈 체크
			var widthMatch = matchMedia("all and (max-width: 1023px)");
			if (Core.Utils.mobileChk && widthMatch.matches) {
				this.setThumb(args.sort);
				$("#product-option_color").hide();
			} else {
				this.setZoom(args.sort);
				$("#product-option_color").show();
			}
			
			//리사이징될때 실행 (오동작 체크 필요)
			$(window).resize(function() {
				if (Core.Utils.mobileChk && widthMatch.matches) {
					Closure.prototype.setThumb(args.sort);
					$("#product-option_color").hide();
				} else {
					Closure.prototype.setZoom(args.sort);
					$("#product-option_color").show();
				}
			});

			return this;
		}

		//pc인경우
		Closure.prototype.setZoom = function(sort){
			var _self = this;
			var appendTxt = '';
			var count = 0;
			var sortType = sort || args.sort;

			//console.log('arrGalleryList:' , arrGalleryList);
			var arrGalleryData = arrGalleryList.filter(function(item, index, array){
				if(item.thumbSort === sortType || item.thumbSort === 'null'){
				count++;
				return item;
				}
			});

			var thumbTemplate;
			if(args.type === 'snkrs'){
				thumbTemplate = Handlebars.compile($("#product-gallery-snkrs").html())(arrGalleryData);
			} else if(arrGalleryData.length > 3){
				thumbTemplate = Handlebars.compile($("#product-gallery-nike").html())(arrGalleryData);
			} else if ($galleryWrap.find('video').length){
				thumbTemplate = Handlebars.compile($("#product-gallery-nike").html())(arrGalleryData);
			} else {
				thumbTemplate = Handlebars.compile($("#product-gallery-nike-large").html())(arrGalleryData);
			}

			var zoomTemplate = Handlebars.compile($('#product-gallery-zoom').html())(arrGalleryData);

			$galleryWrap.empty().append(thumbTemplate);
			$zoomWrap.find(setting.zoomAppender).empty().append(zoomTemplate);
			$("#color-swipe").empty();
		}

		//모바일인경우
		Closure.prototype.setThumb = function(sort){
			var _self = this;
			var appendTxt = '';
			var count = 0;
			var sortType = sort || args.sort;
			var arrThumbData = arrGalleryList.filter(function(item, index, array){
				if(item.thumbSort === sortType || item.thumbSort === 'null'){
					count++;
					return item;
				}
			});

			var colorgalleryTemplate = Handlebars.compile($("#product-gallery-color-swipe").html())(arrColorList);
			var galleryTemplate = Handlebars.compile($("#product-gallery-swipe").html())(arrThumbData);
			var zoomTemplate = Handlebars.compile($('#product-gallery-zoom').html())(arrThumbData);

			$("#color-swipe").empty().append(colorgalleryTemplate);
			$galleryWrap.empty().append(galleryTemplate);
			$zoomWrap.find(setting.zoomAppender).empty().append(zoomTemplate);

			//사이즈 조정
			$galleryWrap.find(".swipe-wrapper").css('width','100%');
			$galleryWrap.find(".swipe-wrapper").find('li').css('min-width','auto');
			$("#color-swipe").find(".swipe-wrapper").find('li').css('min-width','auto');

			//PDP메인 상품이미지 화면 768px 미만일 때 슬라이더로 변환
			if(sliderComponent) sliderComponent.destroySlider();
			sliderComponent = Core.getComponents('component_slider', {context:$this, selector:'#product-gallery>div>.swipe-container'}, function(){
				this.addEvent('slideAfter', function($slideElement, oldIndex, newIndex){
					$galleryWrap.find('li').eq(newIndex).addClass('active').siblings().removeClass('active');
					jQuery('video').trigger('play');

					//사용자의 슬라이드 전환 이벤트 완료 후 이벤트 발생 부
					//trackEvent 요청 처리 2020-04-09 17:20:27 @pck
					var param = {};
						param.pdp_interactions = 'mobile image slide';
						param.page_event = {
							pdp_interaction : true
						}
					endPoint.call('pdpInteraction', param);
				});
				this.addEvent('slideClick', function($slideElement){
					var param = {};
					param.pdp_interactions = 'image selected';
					param.page_event = {
						pdp_interaction : true
					}
					endPoint.call('pdpInteraction', param);						
				});
			});

			//항목이 1개 초과일 경우에만 슬라이더 작동
			if( $("#color-swipe").find(".swipe-wrapper").find('li').length > 1 ){
				if(sliderComponent2) sliderComponent2.destroySlider();
				sliderComponent2 = Core.getComponents('component_slider', {context:$this, selector:'#color-swipe>div>.swipe-container'}, function(){
					this.addEvent('slideClick', function($slideElement){
						var param = {};
						param.pdp_interactions = 'colorway changed';
						param.page_event = {
							pdp_interaction : true
						}
						endPoint.call('pdpInteraction', param);						
					});
				});
			} else {
				$("#color-swipe ul").css({
					width: "145px"
				});
			}
		}


		// '1 사이즈' 노출 시 '사이즈가이드' 미노출
		// $('.size-grid-type [sizeno="size1"]').closest('.size-grid-type').addClass('sizeGuideNone');

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_gallery'] = {
		constructor:Gallery,
		attrName:'data-component-gallery'
	}
 })(Core);