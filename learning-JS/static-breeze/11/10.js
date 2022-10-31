(function(Core){
	'use strict';

	Core.register('module_merchmenu', function(sandbox){

    var merchActive = function(){
      merchTriger.classList.add("isActive");
    }

    var merchDeactive = function(){
      merchTriger.classList.remove("isActive");
    }

		var Method = {
			moduleInit:function(){
        var merchTriger = document.getElementById("merchTriger");
        var merchBtns = document.querySelectorAll("[id^='toggle']");
        merchTriger.addEventListener("mouseenter", merchActive);
        merchTriger.addEventListener("mouseleave", merchDeactive);
        
        merchBtns.forEach(function(merchBtn){
          merchBtn.addEventListener("click", function(){
            var merchIdx = Number(merchBtn.value);
            for (var i = 0; i < 4; i++) {
              var othersRadioMenu = document.getElementById("toggle" + i).nextElementSibling.nextElementSibling;
              var clickedRadioMenu = document.getElementById("toggle" + merchIdx).nextElementSibling.nextElementSibling;
              var clickedRadioMenuHeight = clickedRadioMenu.firstElementChild.clientHeight + "px";
              if (i !== merchIdx) {
                othersRadioMenu.style.maxHeight = 0;
              } else {
                if (clickedRadioMenu.style.maxHeight == clickedRadioMenuHeight) {
                  clickedRadioMenu.style.maxHeight = 0;
                  document.getElementById("toggle" + merchIdx).checked = false;
                } else {
                  clickedRadioMenu.style.maxHeight = clickedRadioMenuHeight;
                }
              }
            }
          })
        })
      }
    }

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-merchmenu]',
					attrName:'data-module-merchmenu',
					moduleName:'module_merchmenu',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);