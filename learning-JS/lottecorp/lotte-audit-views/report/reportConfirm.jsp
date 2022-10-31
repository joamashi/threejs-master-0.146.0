<%@ page language="java" contentType="text/html; charset=UTF-8"   pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jsp"%>

<c:if test="${not empty responseMessage }">
<script>alert('${responseMessage}');</script>
</c:if>
<div id="container" class="container">
	<div class="visual-area img-2">
		<h2><spring:message code="confirm-tt-01"/></h2>
	</div>
	
	<jsp:include page="/WEB-INF/views/sitemesh/menu.jsp"></jsp:include>
	<form id="frm" name="frm" method="post">
	<input type="hidden" id="repId" name="repId" />
	<div class="content">
		<h3><spring:message code="confirm-sub-01"/></h3>

		<p class="text-area-type"><spring:message code="confirm-sub-02"/><br class="mo"> <spring:message code="confirm-sub-03"/></p>

		<div class="complete-processing-result-area">
			<p><spring:message code="confirm-sub-04"/><br class="mo"> <spring:message code="confirm-sub-05"/></p>
			<ul class="fieldset-area">
				<li>
					<label for="recNo"><spring:message code="confirm-sub-06"/></label>
					<span class="text-area w-320"><input type="text" name="recNo" id="recNo" maxlength="10" style="text-transform: uppercase;"></span>
				</li>
				<li>
					<label for="memPw"><spring:message code="confirm-sub-07"/></label>
					<span class="text-area w-320"><input type="password" name="memPw" id="memPw" maxlength="20" autocomplete="off"></span>
				</li>
			</ul>
		</div>

		<div class="form-submit-area">
			<div class="btn-area">
				<button type="button" class="btn-submit" onclick="javascript:fn_resultConfirm();"><spring:message code="confirm-sub-08"/></button>
			</div>
		</div>
	</div>
	</form>
</div><!-- / container -->



<script type="text/javascript">
	
	$(function(){
		$('html > head > title').text('<spring:message code="site_confirm_title" />');
	});

	//제보 처리 결과 조회 
	function fn_resultConfirm(){
		
		if(
			$("#recNo").val() == "" || 
			$("#memPw").val() == ""
		){
			alert('<spring:message code="result_confirm_msg"/>');
			return;
		}
		
		var param = new FormData($("#frm")[0]);
		
		$.ajax({
			// AJAX 호출할 URL
			url          : '/report/selectReportConfirm.json',
			type		 : "POST",
			data		 : param,
			processData  : false,
	        contentType  : false,
			async        : false,
			success		 : function(data, textStatus) {
				//결과 조회 페이지 이동 
				if(data && data.hasOwnProperty("rtnCode")){
					
					if(data.rtnCode == "success"){
						$("#repId").val(data.repId);
					    $("#frm").attr("action","/report/reportResult.do").submit();
					} else if(data.rtnCode == "repValid"){
						alert('<spring:message code="repid_not_matched"/>');
					} else if(data.rtnCode == "pwValid"){
						alert('<spring:message code="password_not_matched"/>');
					} else {
						alert('<spring:message code="error_msg"/>');
					}
					
				} else {
					alert('<spring:message code="error_msg"/>');	
				}
			}
		});
	}
</script>