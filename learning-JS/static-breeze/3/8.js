(function(Core){
	var FileUpLoad = function(){
		'use strict';

		var $this, $form, $inputFiles, $progress, $uploadBtn, currentIndex=0, args;
		var setting = {
			selector:'[data-component-file]',
			form:'#fileupload-form',
			inputFiles:'#input-file',
			uploadBtn:'[data-upload-btn]',
			maxLength:5
		}

		var setImgPreview = function(target){
			var _self = target;
			var _this = this;

			if($(this).val() === '') return false;
			Core.ui.loader.show();
			$form.ajaxSubmit({
				success:function(data){
					_.delay(function () {
						Core.ui.loader.hide();
						upImageResult.call(_self, data);
					}, 1000)
				},
				error:function(data){
					_.delay(function(){
						Core.ui.loader.hide();
						upImageResult.call(_self, data.responseJSON);
					}, 1000)
				}
			});
		}

		var upImageResult = function(data){
			if(data.result === true){
				this.fireEvent('upload', this, [data.fileName, data.fullUrl, data.realFileName]);
			}else if(data.result === 'error'){
				this.fireEvent('error', this, [data.errorMessage]);
			}else{
				this.fireEvent('error', this, ['전송을 실패하였습니다.']);
			}
		}

		var Closure = function(){}
		Closure.prototype = {
			setting:function(){
				var opt = Array.prototype.slice.call(arguments).pop();
				$.extend(setting, opt);
				return this;
			},
			init:function(){
				args = arguments[0];
				$.extend(setting, args);
				var _self = this;
				var cUrl = Core.Utils.url.getCurrentUrl();
				var cQueryParams = Core.Utils.getQueryParams(cUrl);

				$this = $(setting.selector);
				$uploadBtn = $this.find(setting.uploadBtn);
				$inputFiles = $(setting.inputFiles);
				$form = $(setting.form);

				$uploadBtn.click(function(e){
					e.preventDefault();

					if(currentIndex >= Number(setting.maxLength)){
						_self.fireEvent('error', this, ['최대'+setting.maxLength+'개 까지만 업로드 가능합니다.']);
						return false;
					}

					//appView일때 toapp 호출
					var appVer = cQueryParams.appver || '';
					if(cQueryParams.deviceOs){
						if(cQueryParams.deviceOs.toLowerCase() === 'ios' || cQueryParams.deviceOs.toLowerCase() === 'and'){
							if(appVer.replace(/\./g, '') >= 120){
								location.href='toapp://attach?uploadUrl='+ location.origin + $form.attr('action') +'&mediatype=image&callback=Core.getModule("module_review_write").moduleConnect&imagecount=1';
							}else{
								console.log('app version - ' + appVer);
							}
						}
					}else{
						$inputFiles.trigger('click');
					}
				});

				$inputFiles.change(function(e){
					setImgPreview.call(this, _self);
				});

				return this;
			},
			setCurrentIndex:function(index){
				currentIndex = index;
			},
			setToappUploadImage:function(data){
				upImageResult.call(this, data);
			},
			plusCurrentIndex:function(){
				currentIndex++;
			},
			minusCurrentIndex:function() {
				currentIndex--;
			},
			currentIndex:function(){
				return currentIndex;
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_file'] = {
		constructor:FileUpLoad,
		attrName:'data-component-file'
	}
})(Core);