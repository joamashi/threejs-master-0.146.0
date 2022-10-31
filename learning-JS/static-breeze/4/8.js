(function(Core){
	var Range = function(){
		var setting = {
			selector:'[data-component-range]',
			rangeBars:'.range-handler',
			rangeTrack:'.range-track',
			attrName:'data-component-range',
			componentName:'component_range'
		}

		var $this, $rangeBars, $track, args={}, minper=0, maxper=100, objSlider={}, eventID;


		var Closure = function(){}
		Closure.prototype = {
			setting:function(){
				var opt = Array.prototype.slice.call(arguments).pop();
				$.extend(setting, opt);
				return this;
			},
			init:function(){
				var _self = this;
				$this = $(setting.selector);
				$rangeBars = $this.find(setting.rangeBars);
				$track = $this.find(setting.rangeTrack);
				args = arguments[0];

				$rangeBars.each(function(i){
					var $this = $(this);
					var slider = Core.SliderBar.call(this, (function(){
						if($this.is('.min')){
							return {
								move:function(percent){
									if(percent > maxper) percent = maxper;

									$this.css('left', percent + '%');
									$track.css({
										'left':percent + '%',
										'width':(maxper - percent) + '%'
									});

									minper = percent;
									_self.fireEvent('change', $this[0], [minper]);
								},
								end:function(){
									$this.addClass('focus').siblings().filter('.max').removeClass('focus');
									_self.fireEvent('touchEnd', $this[0], [minper]);
								}
							}
						}else if($this.is('.max')){
							return {
								move:function(percent){
									if(percent < minper) percent = minper;

									$this.css('left', percent + '%');
									$track.css({
										'width':(percent - minper) + '%'
									});

									maxper = percent;
									_self.fireEvent('change', $this[0], [maxper]);
								},
								end:function(){
									$this.addClass('focus').siblings().filter('.min').removeClass('focus');
									_self.fireEvent('touchEnd', $this[0], [maxper]);
								}
							}
						}
					})());

					objSlider[i] = slider;
				});

				return this;
			},
			getSlide:function(name){
				return objSlider[name];
			},
			getArgs:function(){
				return args;
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	};

	Core.Components['component_range'] = {
		constructor:Range,
		attrName:'data-component-range',
	}
})(Core);
