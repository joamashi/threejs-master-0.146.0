(function(Core){
	Core.register('module_review_write', function(sandbox){
		var $deferred = null;
		var imgCount = 0;
		var removeId = null;
		var maxCount = 6;
		var currentStarCount = 0;
		var starCountIS = false;
		var fileLoad = null;
		var arrDescription = ['별로에요.', '그저 그래요.', '나쁘지 않아요.', '마음에 들어요.', '좋아요! 추천합니다.'];
		var imgTemplate = '<span class="preview-up-img"><a href="javascript:;" class="file-remove_btn"></a><img src="/kr/ko_kr/{{imgUrl}}?thumbnail" alt="{{imgAlt}}" /></span>';
		var inputHiddenTemplate = '<input type="hidden" name="fileList[{{id}}].fullUrl" class="file-{{id}}" value={{fullUrl}} /><input type="hidden" name="fileList[{{id}}].fileName" class="file-{{id}}" value={{fileName}} />';
		var endPoint, name, model,page_type;

		var Method = {
			moduleInit:function(){
				endPoint = Core.getComponents('component_endpoint');
				var $this = $(this);
				var $form = $this.find('#review-write-form');
				var $imgContainer = $this.find('.uplode-preview-list');
				var $thumbNailWrap = $this.find('.thumbnail-wrap');
				var $submitArea = $this.find('input[type=submit]');
				name 		= $($this).find('input[name="name"]').val();
				model 		= $($this).find('input[name="model"]').val();
				page_type	= $($this).find('input[name="reviewId"]').val();   //수정인지(reviewId 있으면), 신규작성인지

				var textAreaComponent = sandbox.getComponents('component_textarea', {context:$this}, function(i){
					var _this = this;
					this.addEvent('change', function(val){
						if(starCountIS && _this.getValidateChk()){
							$submitArea.removeClass('disabled');
						}else{
							$submitArea.addClass('disabled');
						}
					});
				});

				// fileLoad = sandbox.getComponents('component_file', {context:$this}, {setting:maxLength=6}, function(){
				fileLoad = sandbox.getComponents('component_file', {context:$this, maxLength:maxCount}, function(){
					var _self = this;
					this.addEvent('error', function(msg){
						UIkit.notify(msg, {timeout:3000,pos:'top-center',status:'warning'});
					});

					this.addEvent('upload', function(fileName, fileUrl){
						//console.log(fileName, fileUrl);
						$thumbNailWrap.append(sandbox.utils.replaceTemplate(imgTemplate, function(pattern){
							switch(pattern){
								case 'imgUrl' :
									return fileUrl;
									break;
								case 'imgAlt' :
									return fileName;
									break;
							}
						}));

						imgCount++;
						_self.setCurrentIndex(imgCount);
					});
				});

				imgCount = $thumbNailWrap.children().size();
				fileLoad.setCurrentIndex(imgCount);

				currentStarCount = $this.find('.rating-star a').filter('.active').length - 1;

				$this.find('.rating-star a').click(function(e) {
					e.preventDefault();
					var index = $(this).index() + 1;
					$(this).parent().children('a').removeClass('active');
					$(this).addClass('active').prevAll('a').addClass('active');

					$this.find('input[name=rating]').val(index*20);
					$this.find('input[name=starCount]').val(index);
					$this.find('.rating-description').text(arrDescription[index-1]);

					starCountIS = true;

					if(textAreaComponent.getValidateChk()){
						if($submitArea.hasClass('disabled')){
							$submitArea.removeClass('disabled');
						}
					}
				});

				if(currentStarCount >= 0){
					$this.find('.rating-star a').eq(currentStarCount).trigger('click');
				}

				$this.find('.uplode-preview-list').on('click', '.file-remove_btn', function(e){
					e.preventDefault();
					var index = $(this).attr('href');
					$(this).parent().remove();

					imgCount--;
					fileLoad.setCurrentIndex(imgCount);
				});

				$this.find('input[type=submit]').click(function(e){
					e.preventDefault();
					var reviewContentText = _.trim($("#comment").val());
					var reviewTitleText = _.trim($("input#title").val());
					var reviewstarCount = $("input[name=starCount]").val();
					
					if (reviewstarCount == '0'){
						Core.ui.modal.alert('별점을 선택해 주세요.');
						return;
					};

					if (reviewTitleText == ''){
						Core.ui.modal.alert('제목을 입력해 주세요.');
						return;
					};

					if (reviewContentText.length < 6){
						Core.ui.modal.alert('상품리뷰를 다섯자 이상 작성해주세요.<br\>고객님이 올려주신 상품에 관련된 글은 주관적인 의견은 사실과 다르거나 보는 사람에 따라 다르게 해석될 수 있습니다.');
						return;
					};
					
					if (Core.utils.has.hasEmojis(reviewTitleText) || Core.utils.has.hasEmojis(reviewContentText)) {
						Core.ui.modal.alert('상품리뷰에 이모지를 사용할 수 없습니다.');
						return;
					};

					if(!starCountIS || !textAreaComponent.getValidateChk()){
						return;
					};

					$thumbNailWrap.children().each(function(i){
						var $this = $(this);
						$form.append(sandbox.utils.replaceTemplate(inputHiddenTemplate, function(pattern){
							switch(pattern){
								case 'id' :
									return i;
									break;
								case 'fileName' :
									return $this.find('img').attr('alt');
									break;
								case 'fullUrl' :

									return $this.find('img').attr('src');
									break;

									//수정시 마다 앞에 풀url( https://stg-cf-nike.brzc.kr) 이 붙는 현상으로. 쌈네일 이미지 깨지는 현상 발생
									//임시방편으로 수정
									// var r_fullUrl = $this.find('img').attr('src');
									// var st1 = 'https://static-breeze.nike.co.kr';
									// var st2 = 'https://stg-cf-nike.brzc.kr';
									// var s_fullUrl  = r_fullUrl.replace(st1,');
									// 	 s_fullUrl  = s_fullUrl.replace(st2,');
									//	 s_fullUrl  = s_fullUrl.replace('/kr/ko_kr',');
									//	 s_fullUrl  = s_fullUrl.replace('//','/');

									// return s_fullUrl

							}
						}));
					});

					var itemRequest = BLC.serializeObject($form);
					sandbox.utils.ajax($form.attr('action'), $form.attr('method'), itemRequest, function(res){
						var data = sandbox.rtnJson(res.responseText);

						if(data.hasOwnProperty('errorMessage') || !data){
							if($deferred) $deferred.reject(data.errorMessage);
							else UIkit.notify(data.errorMessage, {timeout:3000,pos:'top-center',status:'danger'});
						}else{
							/*리뷰 작성 시 상품 화면으로 되돌아 가면서 reflesh 되지 않아 우선 막음*/
							/*if($deferred) $deferred.resolve(data); else */
							endPoint.call("writeReview",{ name : name, model : model });
							Core.ga.action('review','write');

							if(page_type == ""){  //  위에 reviewId  수정, 신규 구분값
								var review_msg ="50마일 지급이 완료되었습니다."
							}else{
								var review_msg ="수정되었습니다.";
							}

							UIkit.modal.alert(review_msg).on('hide.uk.modal', function() {
								location.href = data.redirectUrl;
							});

						}
					}, true);
				});
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-review-write]',
					attrName:'data-module-review-write',
					moduleName:'module_review_write',
					handler:{context:this, method:Method.moduleInit}
				});
			},
			destroy:function(){
				$deferred = null;
				//console.log('destroy review-write module');
			},
			setDeferred:function(defer){
				$deferred = defer;
			},
			moduleConnect:function(){
				fileLoad.setToappUploadImage({
					fileName:arguments[0],
					fullUrl:arguments[1],
					result:(arguments[2] === '1') ? true : false
				});
			}
		}
	});
})(Core);