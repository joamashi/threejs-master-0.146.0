<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jsp"%>
<!DOCTYPE html>
    <div 
		data-modal="dialog"
		class="modal-affiliate-shortcut">
        <div class="modal-content" tabindex="0">
			<button 
				type="button"
				class="close-modal"><span class="blind">닫기</span></button>
			
			<h2 id="modal-title-sub"><spring:message code="blank_sub_title" /></h2>

			<div class="area">
				<spring:message code="blank_info" /><br class="mo">
				<spring:message code="blank_info2" />
			</div>

			<p><spring:message code="blank_info3" /></p>

			<div class="btn-area">
				<button type="button" class="btn-submit"  id="btnBlankClose"><spring:message code="blank_button_confirm" /></button>
			</div>
		</div>
    </div>


<script type="text/javascript">
	$(document).ready(function(){
		blankPopupStart();
	});
	
	function blankPopupStart() {
		
		$('.modal').find("#btnBlankClose").click(function(){
			//myFunc.modal(this).close();
		});
		
	}
	
</script>
