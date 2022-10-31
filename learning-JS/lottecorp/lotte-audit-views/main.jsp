<%@ page language="java" contentType="text/html; charset=UTF-8"   pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jsp"%>

<div id="container" class="container">
	<section class="section main-visual active" id="section0" data-anchor="firstPage">
		<article>
			<a href="/report/reportConfirm.do" class="box">
				<strong><spring:message code="main-fir-01"/><br><spring:message code="main-fir-02"/></strong>
				<span><em>READ</em> MORE</span>
			</a>
			<div>
				<h1>
					<span><spring:message code="main-fir-03"/></span>
					<span><spring:message code="main-fir-04"/></span>
				</h1>
				<p><spring:message code="main-fir-05"/></p>
				<p><spring:message code="main-fir-06"/></p>
			</div>
		</article>

		<a href="#secondPage" class="scroll" data-link="2">
			<span class="blind"><spring:message code="main-fir-07"/></span>
			<em>SCROLL</em>
		</a>
	</section>

	<section class="section grid-layout " tabindex="0" id="section1" data-anchor="secondPage">
		<div class="main-content pc">
			<div class="grid-layout-col">
				<!-- <a href="#section0" class="main-visual-link"><span class="blind"><spring:message code="main-sec-01"/></span></a> -->
				<article class="col-1">
					<a href="/report/real/write.do">
						<div>
							<h2><spring:message code="main-sec-02"/></h2>
							<span><spring:message code="main-sec-03"/></span>
						</div>
					</a>
				</article>
			</div>
			<div class="grid-layout-col">
				<article class="col-2">
					<a href="/report/guide.do">
						<div>
							<h2><spring:message code="main-sec-04"/></h2>
							<span><spring:message code="main-sec-05"/></span>
						</div>
					</a>
				</article>
				<article class="col-3">
					<a href="/report/guide.do#tab-2">
						<div>
							<h2><spring:message code="main-sec-06"/></h2>
							<span><spring:message code="main-sec-07"/></span>
						</div>
					</a>
				</article>
				<article class="col-4">
					<a href="/report/guide.do#tab-3">
						<div>
							<h2><spring:message code="main-sec-08"/></h2>
							<span><spring:message code="main-sec-09"/><br> <spring:message code="main-sec-10"/></span>
						</div>
					</a>
				</article>
			</div>
		</div>

		<div class="main-content mo">
			<div class="grid-layout-col">
				<a href="#section0" class="main-visual-link"><span class="blind"><spring:message code="main-sec-01"/></span></a>
				<article class="col-1">
					<a href="/report/guide.do">
						<div>
							<h2><spring:message code="main-sec-04"/></h2>
							<span><spring:message code="main-sec-05"/></span>
						</div>
					</a>
				</article>
			</div>
			<div class="grid-layout-col">
				<article class="col-2">
					<a href="/report/real/write.do">
						<div>
							<h2><spring:message code="main-sec-02"/></h2>
							<span><spring:message code="main-sec-03"/></span>
						</div>
					</a>
				</article>
				<article class="col-3">
					<a href="/report/guide.do#tab-2">
						<div>
							<h2><spring:message code="main-sec-06"/></h2>
							<span><spring:message code="main-sec-07"/></span>
						</div>
					</a>
				</article>
				<article class="col-4">
					<a href="/report/guide.do#tab-3">
						<div>
							<h2><spring:message code="main-sec-08"/></h2>
							<span><spring:message code="main-sec-09"/><br> <spring:message code="main-sec-10"/></span>
						</div>
					</a>
				</article>
			</div>
		</div>
		
		<!-- footer -->	
		<footer id="footer">
			<div class="footer-content">
				<div class="area">
					<h2><img src="/images/ci-gray.png" alt="LOTTE">
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
	</section>
</div><!-- / container -->

<script type="text/javascript">
$(document).ready(function(){
	$('html > head > title').text('<spring:message code="site_main_title" />');
});
</script>