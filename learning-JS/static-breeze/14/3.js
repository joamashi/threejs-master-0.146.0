(function(Core){
	Core.register('module_reviewlist', function(sandbox){
		var $this, modal, args;
		var Method = {

			moduleInit:function(){
				var $this = $(this);

				//작성된 리뷰 내용 글자 자르기....
				if($("div#mypage_review_list").length > 0){

					$("div#mypage_review_list").each(function(index){
						str_content = $(this).find('[data-review-text]').data('review-text');

							full_text = Method.content_cut(str_content);   // 내용 파싱... 글자수 200자

							$(this).find('#review_coment').html(full_text);
					});

				}

				//리뷰 더보기, 닫기
				$(document).on("click","a.shorten-toggle", function(e) {
					if($(this).text().trim()=="더보기"){
						var index		= $(this).closest('[data-review-text]').index();
						var full_text 	= $(this).closest('[data-review-text]').data('review-text');   //전체 내용

										  $(this).closest('[data-review-text]').html(full_text+"<a class='shorten-toggle' href='javascript:;' style='font-weight: bold;'> <b>닫기</b></a>");
					} else{
						var index		= $(this).closest('[data-review-text]').index();
						var full_text 	= Method.content_cut($(this).closest('[data-review-text]').data('review-text'));   //전체 내용
										  $(this).closest('[data-review-text]').html(full_text);
					}
				});


			},
			content_cut:function(str){
				if(str.length >= 200){
					return str.substr(0,200)+" ... <a class='shorten-toggle' href='javascript:;' style='font-weight: bold;' data-click-area='pdp' data-click-name='review_view more'> <b>더보기</b></a>";
				} else{
					return str;
				}

			}
		}
		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-reviewlist]',
					attrName:'data-module-reviewlist',
					moduleName:'module_reviewlist',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);