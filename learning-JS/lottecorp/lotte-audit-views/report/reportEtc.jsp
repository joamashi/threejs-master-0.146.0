<%@ page language="java" contentType="text/html; charset=UTF-8"   pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jsp"%>

<div id="container" class="container">
	<div class="visual-area">
		<h2><spring:message code="etc-title"/></h2>
	</div>

	<jsp:include page="/WEB-INF/views/sitemesh/menu.jsp"></jsp:include>

	<div class="copy-area">
		<p><spring:message code="etc-copy-01"/><br>
		<spring:message code="etc-copy-02" /><br>
		<spring:message code="etc-copy-03" /><br>
		<spring:message code="etc-copy-04" /></p>
	</div>

	<div class="content">
		<h3><spring:message code="etc-content" /></h3>

		<div class="post-area">
			<p><spring:message code="etc-post-01" /><br>
			   <spring:message code="etc-post-02" /><br><spring:message code="etc-post-03" /></p>
			<ul>
				<li>
					<em><spring:message code="etc-post-04" /></em>
					<span><spring:message code="etc-post-05" /></span>
				</li>
				<li>
					<em><spring:message code="etc-post-06" /></em>
					<span><spring:message code="etc-post-07" /><br>
						<spring:message code="etc-post-08" /><br>
						<spring:message code="etc-post-09" /></span>
				</li>
			</ul>
		</div>	
	</div>
</div><!-- / container -->

<script type="text/javascript">
	$(function(){
		$('html > head > title').text('<spring:message code="site_etc_title" />');
	});
</script>