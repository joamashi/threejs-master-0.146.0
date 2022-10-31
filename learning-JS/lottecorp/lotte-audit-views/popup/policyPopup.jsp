<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jsp"%>
<!DOCTYPE html>
    <div 
		data-modal="dialog"
		class="modal-terms-of-use">
        <div class="modal-content" tabindex="0">
			<button 
				type="button"
				class="close-modal"><span class="blind">닫기</span></button>
			
			<h2 id="modal-title"><spring:message code="policy_pop_info" /><spring:message code="policy_pop_info2" /></h2>

			<div class="terms-checkbox">
				<span class="checkbox-area">
					<input type="checkbox" name="checkbox-1" id="checkbox-1" onclick="fnCheckboxAllChecked();">
					<label for="checkbox-1"><spring:message code="policy_pop_info3" /><br  class="mo"><spring:message code="policy_pop_info4" /></label>
				</span>
			</div>

			<div class="terms-radio">
				<h3><spring:message code="policy_pop_info5" /></h3>
				<div class="textarea" tabindex="0">
					<c:forEach var="data" items="${list}" varStatus="status">
						<c:if test="${data.privacyCd eq 'AGM001' && langType eq 'ko'}">
							<c:out value='${data.koContent}' escapeXml="false"/>
						</c:if>
						<c:if test="${data.privacyCd eq 'AGM001' && langType eq 'en'}">
							<c:out value='${data.enContent}' escapeXml="false"/>
						</c:if>
					</c:forEach>
				</div>
				<div class="radio-group">
					<span class="radio-area">
						<input type="radio" name="radio-1" id="radio-1-1" value="1">
						<label for="radio-1-1"><spring:message code="policy_pop_btn" /></label>
					</span>
					<span class="radio-area">
						<input type="radio" name="radio-1" id="radio-1-2" value="0" checked>
						<label for="radio-1-2"><spring:message code="policy_pop_btn2" /></label>
					</span>
				</div>
			</div>

			<div class="terms-radio">
				<h3><spring:message code="policy_pop_info6" /></h3>
				<div class="textarea" tabindex="0">
					<c:forEach var="data" items="${list}" varStatus="status">
						<c:if test="${data.privacyCd eq 'AGM002' && langType eq 'ko'}">
							<c:out value='${data.koContent}' escapeXml="false"/>
						</c:if>
						<c:if test="${data.privacyCd eq 'AGM002' && langType eq 'en'}">
							<c:out value='${data.enContent}' escapeXml="false"/>
						</c:if>
					</c:forEach>	
				</div>
				<div class="radio-group">
					<span class="radio-area">
						<input type="radio" name="radio-2" id="radio-2-1" value="1">
						<label for="radio-2-1"><spring:message code="policy_pop_btn3" /></label>
					</span>
					<span class="radio-area">
						<input type="radio" name="radio-2" id="radio-2-2" value="0" checked>
						<label for="radio-2-2"><spring:message code="policy_pop_btn4" /></label>
					</span>
				</div>
			</div>

			<div class="terms-text">
				<p><spring:message code="policy_pop_info7" /><br><spring:message code="policy_pop_info8" /></p>
				<c:if test="${type ne 'anonymous'}">
				<a href="/report/anonymous/write.do"><spring:message code="policy_pop_info9" /></a>
				</c:if>
			</div>

			<div class="btn-area">
				<button type="button" class="btn-submit" id="btnPolicyClose" onclick="fnPolicyAgree();"><spring:message code="policy_pop_btn5" /></button>
			</div>
		</div>
    </div>


<script type="text/javascript">
	
	var policyPopupObj;
	
	function fnCheckboxAllChecked(){
	 	var checked = $('input:checkbox[id="checkbox-1"]').is(":checked");
	    if(checked == true){
	    	$('input[type=radio][id=radio-1-1]').trigger('click');
			$('input[type=radio][id=radio-2-1]').trigger('click');
	    } else {
	    	$('input[type=radio][id=radio-1-2]').trigger('click');
			$('input[type=radio][id=radio-2-2]').trigger('click');
	    }
	}
	
	function fnPolicyAgree(){
		var chk01 = $('input[type=radio][id=radio-1-1]:checked').val();
		var chk02 = $('input[type=radio][id=radio-2-1]:checked').val();
		
		if(chk01 != "1" || chk02 != "1"){
			alert('<spring:message code="policy_pop_msg" />');
			
			$('input:checkbox[id="checkbox-1"]').focus();
			return false;
		}
		
		policyPopupObj = {'agree01':chk01,'agree02':chk02};
		
		if( typeof(fnReturnPolicy) == 'function' ) {
			fnReturnPolicy(policyPopupObj);
			myFunc.modal("policyPopHtml").close();
		} 
	}
	
	$(document).ready(function(){
		if($("#report_agree01").val() == "1" && $("#report_agree02").val() == "1"){
			$("#checkbox-1").attr("checked",true);
			fnCheckboxAllChecked();
		}
	});
	
</script>
