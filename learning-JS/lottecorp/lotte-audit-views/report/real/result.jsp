<%@ page language="java" contentType="text/html; charset=UTF-8"   pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jsp"%>


	<div id="container" class="container">
		<div class="visual-area">
			<h2><spring:message code="label_h2" /></h2>
		</div>
		
		<jsp:include page="/WEB-INF/views/sitemesh/menu.jsp"></jsp:include>
		
		<form id="realResultForm" name="realResultForm" method="post">	
	    <input type="hidden" id="rep_id" name="rep_id" value="<c:out value='${list.repId}'/>"/>
	    <input type="hidden" id="reqMemId" name="reqMemId" value="<c:out value='${list.reqMemId}'/>"/>
	    
		<div class="content">
			<h3><spring:message code="label_result_h3" /></h3>
			
			<div class="audit-form-area">
				<h4><spring:message code="label_result_h4" /></h4>
	
				<ul class="fieldset-info-area">
					<c:if test="${!empty list.recNo}">
					<li>
						<em><spring:message code="label_result_em" /></em>
						<span>
							<c:out value='${list.recNo}'/>
						</span>
					</li>
					</c:if>
					<c:if test="${!empty list.cusNm}">
					<li>
						<em><spring:message code="label_company" /></em>
						<span>
							<c:out value='${list.cusNm}'/> <c:out value='${list.compNm}'/>
						</span>
					</li>
					</c:if>
					<c:if test="${!empty list.memNm}">
					<li>
						<em><spring:message code="label_name" /></em>
						<span>
							<c:out value='${list.memNm}'/>
						</span>
					</li>
					</c:if>
					<c:if test="${!empty list.memHp}">
					<li>
						<em><spring:message code="label_hp" /></em>
						<span>
							<c:out value='${list.memHp}'/>
						</span>
					</li>
					</c:if>
					<c:if test="${!empty list.rsltNm}">
					<li>
						<em><spring:message code="label_reply" /></em>
						<span>
							<c:out value='${list.rsltNm}'/>
						</span>
					</li>
					</c:if>
					<c:if test="${!empty list.reqTt}">
					<li>
						<em><spring:message code="label_subject" /></em>
						<span>
							<c:out value='${list.reqTt}' escapeXml="false"/>
						</span>
					</li>
					</c:if>
					<c:if test="${!empty list.reqCtt}">
					<li>
						<em><spring:message code="label_contents" /></em>
						<span>
							<c:out value='${list.reqCtt}' escapeXml="false"/>
						</span>
					</li>
					</c:if>
					<li>
						<em><spring:message code="label_file" /></em>
						<span id="resultFileViewHTML"></span>
					</li>
					
				</ul>
			</div>
	
			<div class="form-submit-area">
				<p><spring:message code="label_result_p" /></p>
				<div class="btn-area">
					<button type="button" class="btn-type-3" id="btnModify" name="btnModify" onclick="javascrpit:go_realReportUpdate();"><spring:message code="label_result_update" /></button>
					<button type="button" class="btn-submit" id="btnResult" name="btnResult" onclick="javascrpit:go_Result();"><spring:message code="label_result_insert" /> </button>
				</div>
			</div>
		</div>
		</form>
	</div><!-- / container --> 


<script type="text/javascript">
	$(function(){
		
		var regId = '${list.regId}';
		if(regId.replace(/[0-9.]/g, '') != "" && regId != 'anonymous'){
			$("#btnModify").hide();
		}
		
		$('html > head > title').text('<spring:message code="site_result_title" />');
		
		selectResultFileList('FRK001', '<c:out value="${list.repId}"/>');
	});
	//제보등록
	function go_Result(){
		location.href="/report/reportComplete.do";
	}
	
	//수정
	function go_realReportUpdate(){
		var form = $('#realResultForm')[0];
		form.action = "/report/real/update.do";
		form.submit();
	}
</script>
  
