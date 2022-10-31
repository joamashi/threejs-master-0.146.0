<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jsp"%>

<header>
	<div class="header-content">
		<h1><a href="/"><img src="/images/ci.png" alt="LOTTE"><spring:message code="logo"/></a></h1>
		<ul class="language-area">
			<li><a href="javascript:void(0);" id="exId" data-value="ko" idx="0">KO</a></li>
			<li><a href="javascript:void(0);" id="exId" data-value="en" idx="1">EN</a></li>
		</ul>
		<a href="javascript:void(0);" id="gnb" class="gnb" aria-controls="gnb-modal" onclick="myFunc.modal(this).open();"><span class="blind">주메뉴 열기</span></a>
	</div>
</header><!-- / header -->

<script type="text/javascript">
$(document).ready(function() {
	
	$("ul.language-area").find("li a").bind('click', function(e){
		var path = location.pathname;

		if(path == "/report/reportResult.do" ||
		   path == "/report/real/update.do" ||
		   path == "/report/real/result.do" ||
		   path == "/report/anonymous/update.do" || 
		   path == "/report/anonymous/result.do"
		){
			var lval = e.target.getAttribute('data-value');
			setCookie('language', lval, 30);
			location.replace("/main.do");
		} else {
			var lval = e.target.getAttribute('data-value');
			setCookie('language', lval, 30);
			location.replace(location.href=path);
		}
		
	});
	
	var cName = getCookie("language");
	if(cName == "en"){
		$("body").addClass(cName);
	} else {
		$("body").removeClass("en");
	}
	
	
});

$(window).load(function(){
	
	var cName = getCookie("language") ? getCookie("language") : navigator.language || navigator.userLanguage;
	
	cName = cName.substring(0, 2);
	
	setCookie('language', cName, 30);
	
	$('.language-area li > a').removeClass('active');
	var type = document.querySelectorAll('[data-value*="'+cName+'"]');
	for(var i=0; i < type.length; i++){
		type[i].setAttribute('class','active');
	}
	
});

</script>