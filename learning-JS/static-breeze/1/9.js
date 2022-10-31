(function(Core){
	var ThumbNail = function(){
		var setting = {
			selector:'[data-component-thumbnail]',
			container:'.thumb-wrap',
			scrollWrap:'.scroll-Wrap',
			list:'.thumb-list',
			thumbTemplate:'{{#each this}}<li class="thumb-list"><a href="{{thumbUrl}}?browse"><img src="{{thumbUrl}}?thumbnail"></a></li>{{/each}}'
		}

		var $this, $container, $list, currentIndex=0, arrThumbList=[], iScroll, args;
		var Closure = function(){}
		Closure.prototype.setting = function(){
			var opt = Array.prototype.slice.call(arguments).pop();
				$.extend(setting, opt);
				return this;
		}
		Closure.prototype.init = function(){
			var _self = this;

			$this = $(setting.selector);
			$container = $this.find(setting.container);
			$list = $this.find(setting.list);
			args = arguments[0];

			var arrList = [];

			$container.find(setting.list).each(function(i){
				var data = Core.Utils.strToJson($(this).attr('data-thumb'), true);
				var imgUrl = $(this).find('img').attr('src').replace(/\?[a-z]+/g, '');
				var pushIS = true;

				data.thumbUrl = imgUrl;

				/* 중복 이미지 처리 */
				for(var i=0; i < arrList.length; i++){
					if(arrList[i].thumbSort === data.thumbSort && arrList[i].thumbUrl === data.thumbUrl){
						pushIS = false;
						console.log('same image');
						return;
					}
				}

				if(pushIS){
					arrList.push(data);
					arrThumbList.push(data);
				}
			});

			$container.on('click', 'li', function(e){
				e.preventDefault();

				$(this).addClass('active').siblings().removeClass('active');
				_self.fireEvent('changeIndex', this, [$(this).index()]);
			});

			this.setThumb(args.sort);

			return this;
		}
		Closure.prototype.getContainer = function(){
			return $this;
		}
		Closure.prototype.setTriggerThumb = function(index){
			var curIndex = index, totalNum = $container.find('li').length;

			if(curIndex < 0){
				curIndex = totalNum - 1;
			}else if(curIndex > totalNum - 1){
				curIndex = 0;
			}

			$container.find('li').eq(curIndex).trigger('click');
		}
		Closure.prototype.setThumb = function(sort){
			var _self = this;
			var appendTxt = '';
			var thumbWidth = (args.thumbType === 'bottom') ? $this.find('.thumb-list').eq(0).outerWidth() : $this.find('.thumb-list').eq(0).outerHeight();
			var count = 0;
			var sortType = sort || args.sort;
			var arrThumbData = arrThumbList.filter(function(item, index, array){
				if(item.thumbSort === sortType || item.thumbSort === 'null'){
					console.log(item);
					return item;
				}
			});

			var thumbTemplate = Handlebars.compile(setting.thumbTemplate)(arrThumbData);
			//var mobileTemplate = Handlebars.compile($("#product-gallery-template-mobile").html())(arrThumbData)
			var totalWidth = count * (thumbWidth + parseInt(args.between));
			if(args.thumbType === 'bottom') $container.empty().append(appendTxt).css({'width':totalWidth}).addClass('show');
			else if(args.thumbType === 'left'){
				if(!Core.Utils.mobileChk){
					$container.css({'height':totalWidth}).addClass('show');
				}
				$container.empty().append(thumbTemplate);
			}

			$container.find('.thumb-list').eq(0).addClass('active');
			$this.parent().append(mobileTemplate);

			_self.fireEvent('setThumbComplete', this);
			$container.find('a').eq(0).trigger('click');

			if(!Core.Utils.mobileChk){
				iScroll = new IScroll($this[0], {
					scrollX:(args.thumbType === 'bottom') ? true : false,
					scrollY:(args.thumbType === 'bottom') ? false : true
				});
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_thumbnail'] = {
		constructor:ThumbNail,
		attrName:'data-component-thumbnail'
	};
})(Core);