<%@ page language="java" contentType="text/html; charset=UTF-8"   pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jsp"%>

<div id="container" class="container">
	<div class="visual-area">
		<h2><spring:message code="complete-sub-01"/></h2>
	</div>
	
	<jsp:include page="/WEB-INF/views/sitemesh/menu.jsp"></jsp:include>

	<div class="content">
		<h3><spring:message code="complete-sub-02"/></h3>

		<div class="complete-area">
			<h4><spring:message code="complete-sub-03"/></h4>
			<p><spring:message code="complete-sub-04"/><br><spring:message code="complete-sub-06"/></p>
			<p><spring:message code="complete-sub-05"/></p>
		</div>

		<div class="form-submit-area">
			<div class="btn-area">
				<button type="button" class="btn-type-3" onclick="javascrpit:go_reportGuide();"><spring:message code="complete-sub-07"/></button>
				<button type="button" class="btn-submit" onclick="javascrpit:go_reportConfirm();"><spring:message code="complete-sub-08"/></button>
			</div>
		</div>
	</div>
</div><!-- / container -->

<script type="text/javascript">
	function go_reportGuide(){
		location.href="/report/guide.do#tab-3";
	}
	
	function go_reportConfirm(){
		location.href="/report/reportConfirm.do";
	}

	$( function () {
		
		$('html > head > title').text('<spring:message code="site_complete_title" />');
		
		let parser = new UAParser();
		let _top = 0;
		if (!parser.getDevice().type) _top = 500;
		$('html, body').animate({ scrollTop: _top }, 200);
	});
</script>