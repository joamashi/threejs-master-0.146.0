<%@ page language="java" contentType="text/html; charset=UTF-8"   pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jsp"%>
<!-- footer -->	
<footer id="footer">
	<div class="footer-content">
		<div class="area">
			<h2>
				<img src="/images/ci-gray.png" alt="LOTTE">
				<c:if test="${cookie.language.value eq 'ko'}">
					<a href="https://www.lotte.co.kr/privacy/agree.do"><spring:message code="footer_policy"/></a>
				</c:if>
				<c:if test="${cookie.language.value eq 'en'}">
					<a href="https://www.lotte.co.kr/global/en/privacy/agree.do"><spring:message code="footer_policy"/></a>
				</c:if>	
			</h2>
			<p>COPYRIGHT © 2022 LOTTE. ALL RIGHTS RESERVED.</p>
		</div>
		<ul>
			<!-- <li><a href="http://www.wa.or.kr/board/list.asp?BoardID=0006" target="_blank"><img src="/images/ic-f-0.png" alt="(사)한국장애인단체총연합회 한국웹접근성인증평가원 웹 접근성 우수사이트 인증마크(WA인증마크) 새창"></a></li> -->
			<li><a href="https://www.youtube.com/user/LOTTELIVE" target="_blank"><img src="/images/ic-f-1.png" alt="유튜브 새창"></a></li>
			<li><a href="https://www.facebook.com/lotte" target="_blank"><img src="/images/ic-f-2.png" alt="페이스북 새창"></a></li>
			<li><a href="http://blog.lotte.co.kr/" target="_blank"><img src="/images/ic-f-3.png" alt="블로그 새창"></a></li>
		</ul>
	</div>
</footer>
<!-- //footer -->