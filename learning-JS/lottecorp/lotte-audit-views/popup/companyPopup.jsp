<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jsp"%>
<!DOCTYPE html>

   <div 
	data-modal="dialog"
	class="modal-affiliate">
       <div class="modal-content" tabindex="0">
		<button 
			type="button"
			class="close-modal"><span class="blind">닫기</span></button>
		
		<h2 id="modal-title-sub"><spring:message code="company_pop_01"/></h2>

		<div class="affiliate-list">
			<input type="hidden" id="busCd" name="busCd">
			<c:forEach var="grpItem" items="${grpList}" varStatus="status">
				<c:set var="cdId" value="${grpItem.cdId}" />
				<div class="area">
				
					<h3><c:out value="${grpItem.dispNm}" /></h3>
					<ul>
						<c:forEach var="companyItem" items="${companyList}" varStatus="status">
							<c:choose>
								<c:when test="${cdId eq companyItem.comGrpCd}">
							 		<li>
								 		<a href="javascript:void(0);" 
									 		<%-- <c:if test="${companyItem.refYn eq 'Y' }">aria-controls="blankPopHtml" onclick="javascript:fn_goBlankPop(this, '<c:out value="${companyItem.comRef}" />');"</c:if> --%>
									 		data-value="<c:out value="${companyItem.comGrpCd}" />" data-value2="<c:out value="${companyItem.comCd}" />" data-sub="<c:out value="${companyItem.comRef}" />">
									 		<c:out value="${companyItem.comNm}" />
								 		</a>
							 		</li> 
								</c:when>
								<c:otherwise>
								</c:otherwise>
							</c:choose>
						</c:forEach>
					</ul>
				</div>
			</c:forEach> 

		</div>
	</div>
   </div>


<script type="text/javascript">
	$(document).ready(function(){
		companyPopupStart();
	});
	
	function companyPopupStart() {
		
		$('.modal').find("a").click(function(){
			
			if($("#busCd").val() == ""){
				var grpCd = $(this).attr('data-value');
				var comCd = $(this).attr('data-value2');
				
				if(typeof grpCd != "undefined" && comCd != "undefined"){
					if( typeof(fnReturnCompany) == 'function' ) {
						fnReturnCompany(grpCd, comCd);
						myFunc.modal(this).close();
					} 
				} 
			} else {
				var target =  $(this).attr('data-sub');
				
				if(target.indexOf('@lotte.net') > -1 ){
					alert('<spring:message code="target_msg" />'+ target +'<spring:message code="target_msg01" />');
					return false;
				} else {
					window.open(target,"_blank");
				}
			} 
		});
		
	} 
</script>
