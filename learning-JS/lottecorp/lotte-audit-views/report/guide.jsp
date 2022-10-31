<%@ page language="java" contentType="text/html; charset=UTF-8"   pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jsp"%>

<div id="container" class="container">
	<div class="visual-area img-3">
		<h2><spring:message code="guide-tt-01"/></h2>
	</div>
	
	<jsp:include page="/WEB-INF/views/sitemesh/menu.jsp"></jsp:include>

	<div class="content">
		<h3><spring:message code="guide-ct-01"/></h3>
		<p class="text-area-type"><spring:message code="guide-ct-02"/><br><spring:message code="guide-ct-03"/></p>
	</div>

	<div id="tab-1" class="bg-full-ground grey">
		<div class="content">
			<h4><spring:message code="guide-ct-04"/></h4>

			<ul class="case-1">
				<li>
					<h5><spring:message code="guide-ct-05"/></h5>
					<ul>
						<li><spring:message code="guide-ct-06"/></li>
						<li><spring:message code="guide-ct-07"/></li>
						<li><spring:message code="guide-ct-08"/></li>
						<li><spring:message code="guide-ct-09"/></li>
						<li><spring:message code="guide-ct-10"/></li>
					</ul>
				</li>
				<li>
					<h5><spring:message code="guide-ct-11"/></h5>
					<ul>
						<li><spring:message code="guide-ct-12"/></li>
						<li><spring:message code="guide-ct-13"/></li>
						<li><spring:message code="guide-ct-14"/></li>
						<li><spring:message code="guide-ct-15"/></li>
						<li><spring:message code="guide-ct-16"/></li>
					</ul>
				</li>
				<li>
					<h5><spring:message code="guide-ct-17"/></h5>
					<ul>
						<li><spring:message code="guide-ct-18"/></li>
						<li><spring:message code="guide-ct-19"/></li>
						<li><spring:message code="guide-ct-20"/></li>
						<li><spring:message code="guide-ct-21"/></li>
						<li><spring:message code="guide-ct-22"/><br>
							<spring:message code="guide-ct-23"/></li>
					</ul>
				</li>
				<li>
					<h5><spring:message code="guide-ct-24"/></h5>
					<ul>
						<li><spring:message code="guide-ct-25"/></li>
						<li><spring:message code="guide-ct-26"/></li>
						<li><spring:message code="guide-ct-27"/></li>
						<li><spring:message code="guide-ct-28"/></li>
					</ul>
				</li>
				<li>
					<h5><spring:message code="guide-ct-29"/></h5>
				</li>
				<li>
					<h5><spring:message code="guide-ct-30"/></h5>
				</li>
			</ul>
		</div>	
	</div>

	<div id="tab-2" class="bg-full-ground">
		<div class="content">
			<h4><spring:message code="guide-ct-31"/></h4>
			<p class="text-area-type-3"><spring:message code="guide-ct-32"/><br><spring:message code="guide-ct-33"/></p>
			
			<ul class="case-2">
				<li><span><spring:message code="guide-ct-34"/></span></li>
				<li><em><i></i><spring:message code="guide-ct-35"/><br><spring:message code="guide-ct-36"/></em></li>
				<li><span><spring:message code="guide-ct-37"/><br><spring:message code="guide-ct-38"/></span></li>
				<li><em><i></i><spring:message code="guide-ct-39"/><br><spring:message code="guide-ct-40"/></em></li>
				<li><span><spring:message code="guide-ct-41"/></span></li>
			</ul>

			<h5><spring:message code="guide-ct-42"/></h5>
			<ul class="case-3">
				<li>
					<em>STEP 01</em>
					<h6><spring:message code="guide-ct-43"/></h6>
					<p><spring:message code="guide-ct-44"/> <br class="pc">
						<spring:message code="guide-ct-45"/>
						<spring:message code="guide-ct-46"/></p>
				</li>
				<li>
					<em>STEP 02</em>
					<h6><spring:message code="guide-ct-47"/></h6>
					<p><spring:message code="guide-ct-48"/> 
						<spring:message code="guide-ct-49"/></p>
				</li>
				<li>
					<em>STEP 03</em>
					<h6><spring:message code="guide-ct-50"/></h6>
					<p><spring:message code="guide-ct-51"/> <br class="pc">
						<spring:message code="guide-ct-52"/><br class="pc">
						<spring:message code="guide-ct-53"/> <br class="pc">
						<spring:message code="guide-ct-54"/></p>
				</li>
			</ul>
		</div>	
	</div>

	<div id="tab-3" class="bg-full-ground grey mb-160">
		<div class="content">
			<h4><spring:message code="guide-ct-55"/></h4>
			<p class="text-area-type-3"><spring:message code="guide-ct-56"/><br class="pc">
				<spring:message code="guide-ct-57"/></p>
			
			<ul class="case-4">
				<li><spring:message code="guide-ct-58"/></li>
				<li><spring:message code="guide-ct-59"/></li>
				<li><spring:message code="guide-ct-60"/></li>
			</ul>

			<div class="case-5">
				<h5><spring:message code="guide-ct-61"/></h5>
				<ul>
					<li><spring:message code="guide-ct-62"/></li>
					<li><spring:message code="guide-ct-63"/></li>
					<li><spring:message code="guide-ct-64"/></li>
				</ul>
				<h5><spring:message code="guide-ct-65"/></h5>
				<ul>
					<li><spring:message code="guide-ct-66"/><br class="pc"> 
						<spring:message code="guide-ct-67"/></li>
					<li><spring:message code="guide-ct-68"/><br>
						<spring:message code="guide-ct-69"/></li>
					<li><spring:message code="guide-ct-70"/><br class="pc">
						<spring:message code="guide-ct-71"/></li>
				</ul>
			</div>
		</div>

		

		<div class="form-submit-area">
			<div class="btn-area">
				<a href="/report/real/write.do" class="btn-submit"><spring:message code="main-sec-02_btn"/></a>
			</div>
		</div>	
	</div>

</div><!-- / container -->

<script type="text/javascript">
$(document).ready(function(){
	$('html > head > title').text('<spring:message code="site_guide_title" />');
});
</script>