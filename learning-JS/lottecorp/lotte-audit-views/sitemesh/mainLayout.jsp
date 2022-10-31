<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jsp"%>
<!DOCTYPE html>
<html lang="ko">
<head>
	<jsp:include page="/WEB-INF/views/sitemesh/head.jsp" />
</head>
	<body oncopy="return false" oncut="return false" onpaste="return false">
		<div class="skip_nav">
			<a href="#gnb">주메뉴 바로가기</a>
			<a href="#container" class="skip-cont">본문 바로가기</a>
			<a href="#footer">하단 바로가기</a>
		</div>	
		<div class="wrap main">
			<!-- header -->
			<jsp:include page="/WEB-INF/views/sitemesh/header.jsp" />
			<!-- //header -->
			
			<!-- container -->
			<sitemesh:write property='body' />
			<!-- container -->
			
			<div class="modal"></div>	
			<div class="modal-backdrop"></div>	
		</div>	
		
		<div 
		  class="modal-gnb" 
		  id="gnb-modal" 
		  role="dialog" 
		  aria-modal="true" 
		  aria-labelledby="modal-title">
		    <div 
				data-modal="dialog">
		        <div class="modal-content" tabindex="0">
					<button 
						type="button"
						class="close-modal"><span class="blind">닫기</span></button>
		
					<ul class="depth-1">
						<li>
							<a href="#none" aria-controls="menu-1" aria-expanded="false"><spring:message code="guide-tt-01"/></a>
							<ul id="menu-1" class="depth-2">
								<li><a href="/report/guide.do"><spring:message code="guide-tt-02"/></a></li>
								<li><a href="/report/guide.do#tab-2"><spring:message code="guide-tt-03"/></a></li>
								<li><a href="/report/guide.do#tab-3"><spring:message code="guide-tt-04"/></a></li>
							</ul>
						</li>
						<li>
							<a href="#none" aria-controls="menu-2" aria-expanded="false"><spring:message code="label_h2" /></a>
							<ul id="menu-2" class="depth-2">
								<li><a href="/report/real/write.do"><spring:message code="label_tab_real" /></a></li>
								<li><a href="/report/anonymous/write.do"><spring:message code="label_tab_anaymous" /></a></li>
								<li><a href="/report/reportEtc.do"><spring:message code="etc-content" /></a></li>
							</ul>
						</li>
						<li>
							<a href="/report/reportConfirm.do"><spring:message code="confirm-tt-01"/></a>
						</li>
					</ul>
				</div>
		    </div>
		</div>
	</body>
</html>