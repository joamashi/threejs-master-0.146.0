<%@ page language="java" contentType="text/html; charset=UTF-8"   pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jsp"%>

	
<div id="container" class="container">
	<div class="visual-area img-2">
		<h2><spring:message code="result_h2" /></h2>
	</div>
	
	<jsp:include page="/WEB-INF/views/sitemesh/menu.jsp"></jsp:include>
	
	<form name="resultFrm" id="resultFrm" method="post">
		<input type="hidden" name="rep_id" id="rep_id" value="<c:out value='${list.repId }'/>"/>
		<input type="hidden" name="reqMemId" id="reqMemId" value="<c:out value='${list.reqMemId }'/>"/>
	</form>
	<c:if test="${empty list.procCd || list.procCd eq 'PRC001' || list.procCd eq 'PRC002' || list.procCd eq 'PRC003' || list.procCd eq 'PRC005' || list.procCd eq 'PRC007'}"> 	
	
	<div class="content">
		<h3><spring:message code="result_h3" /></h3>
		<c:choose>
			<c:when test="${list.mgYn eq 'Y'}">
				<p class="text-area-type">
					<spring:message code="result_merge_01" />
					<c:forEach var="item" items="${mergeList}" begin="0" end="10" step="1" varStatus="status">
							<c:out value='${item.mgNo }'/>
					</c:forEach>
					<spring:message code="result_merge_02" />
					<c:out value='${list.mgNo }'/> <spring:message code="result_merge_03" />
					<spring:message code="result_merge_04" /> <c:out value='${list.mgNo }'/> <spring:message code="result_merge_05" />
				</p>
			</c:when>
			<c:when test="${list.mgYn ne 'Y' and (empty list.procCd || list.procCd eq 'PRC001' || list.procCd eq 'PRC002')}">
				<p class="text-area-type"><spring:message code="result_merge_06" /> <em> <spring:message code="result_proc_msg" /></em><spring:message code="result_merge_07" /> </p>
			</c:when>
			<c:when test="${list.mgYn ne 'Y' and (list.procCd eq 'PRC007')}">
				<p class="text-area-type"><spring:message code="result_merge_08" /><br class="pc"><spring:message code="result_merge_09" /> </p>
			</c:when>
			<c:otherwise>
				<p class="text-area-type"></p>
			</c:otherwise>
		</c:choose>
		
		<p class="text-area-type-2"><spring:message code="result_merge_10" /><br><spring:message code="result_merge_11" /></p>

		<div class="audit-form-area">
			<h4><spring:message code="result_content_01" /></h4>
			<ul class="fieldset-info-area">
			
				<c:if test="${!empty list.regDt}">
				<li>
					<em><spring:message code="result_content_02" /></em>
					<span>
						<c:out value='${list.regDt }'/> <%-- <c:out value='${list.ioeNm }'/> --%>
					</span>
				</li>
				</c:if>
				<c:if test="${!empty list.cusNm}">
				<li>
					<em><spring:message code="result_content_03" /></em>
					<span>
						<c:out value='${list.cusNm }'/> <c:out value='${list.compNm}'/>
					</span>
				</li>
				</c:if>
				<c:if test="${!empty list.tgtEnm}">
				<li>
					<em><spring:message code="result_content_04" /></em>
					<span>
						<c:out value='${list.tgtEnm }'/>
					</span>
				</li>
				</c:if>
				<c:if test="${!empty list.reqTt}">
				<li>
					<em><spring:message code="result_content_05" /></em>
					<span>
						<c:out value='${list.reqTt }' escapeXml="false"/>
					</span>
				</li>
				</c:if>
				<c:if test="${!empty list.reqCtt}">
				<li>
					<em><spring:message code="result_content_06" /></em>
					<span>
						<c:out value='${list.reqCtt }' escapeXml="false"/>
					</span>
				</li>
				</c:if>
				<li>
					<em><spring:message code="label_file" /></em>
					<span id="resultFileViewHTML"></span>
				</li>
			</ul>
		</div>
		
		<c:if test="${empty list.procCd}">
		<div class="form-submit-area mt-2">
			<div class="btn-area">
				<button type="button" class="btn-submit" id="btnModify" onclick="javascript:go_reportUpdate('<c:out value='${list.repType }'/>');"><spring:message code="label_result_update" /></button>
			</div>
		</div>
		</c:if>

		<c:if test="${list.rlyOpYn eq 'Y'}"> 	
		
		<div class="comment-write-area">
			<form name="replyFrm" id="replyFrm">
			<input type="hidden" name="rlyId" id="rlyId" value="" />
			<input type="hidden" name="repId" id="repId" value="<c:out value='${list.repId }'/>"/>
			<input type="hidden" name="reqMemId" id="reqMemId" value="<c:out value='${list.reqMemId }'/>"/>
			<input type="hidden" name="deleteFileId" id="deleteFileId" value="" />
				<h4><spring:message code="result_reply_01" /></h4>
				<p><spring:message code="result_reply_02" /></p>
	
				<div class="input-box-area">
					<span class="textarea"><textarea name="rlyCtt" id="rlyCtt"></textarea></span>
	
					<div class="file-list" id="fileViewHTML">
					</div>
				</div>
			</form>
		</div>
	
		<article class="comment-list-area" id="replyHTML">
			
		</article>

		</c:if>
		
	</div>
	</c:if>
	
	<!-- 종결시 -->
	<c:if test="${list.procCd eq 'PRC006' || list.procCd eq 'PRC004' || list.procCd eq 'PRC008' }"> 
	<div class="content">
		<h3><spring:message code="result_h3" /></h3>
		
		<%-- <c:if test="${list.procCd ne 'PRC004' and list.procCd ne 'PRC006' }">
		<p class="text-area-type"><spring:message code="result_content_07" />${fn:substring(comDay,0,4)}. ${fn:substring(comDay,5,6)}. ${fn:substring(comDay,7,8)}. <spring:message code="result_content_08" /><br class="mo"><em><spring:message code="result_content_09" /></em><spring:message code="result_content_10" /> </p>
		</c:if> --%>
		
		<p class="text-area-type-2"><spring:message code="result_content_11" /><br class="mo"> <spring:message code="result_content_12" /></p>

		<div class="complete-result-area">
			<span class="status">
			
			<c:choose>
				<c:when test="${list.comCd eq 'PRD011'}">
					<img src="/images/ic-status-1.png" alt="징계">
				</c:when>
				<c:when test="${list.comCd eq 'PRD013'}">
					<img src="/images/ic-status-2.png" alt="법적조치">
				</c:when>
				<c:when test="${list.comCd eq 'PRC006'}">
					<img src="/images/ic-status-3.png" alt="보상">
				</c:when>
				<c:otherwise>
					<img src="/images/ic-status-4.png" alt="기타">
				</c:otherwise>
			</c:choose>
			 
			</span>

			<div class="message-area">
				<c:choose>
					<c:when test="${list.comCd eq 'PRD011'}">
						<p><spring:message code="result_content_13" /></p>
					</c:when>
					<c:when test="${list.comCd eq 'PRD013'}">
						<p><spring:message code="result_content_14" /></p>
					</c:when>
					<c:otherwise>
						<p><spring:message code="result_content_15" />
						<c:if test="${list.procCd eq 'PRC006'}">
							<c:if test="${!empty list.resCttSmy}">
								<br class="pc"><br class="pc"><c:out value='${list.resCttSmy }'/>
							</c:if>
						</c:if>						
						</p>
					</c:otherwise>
				</c:choose>
			</div>

			<h4><spring:message code="result_content_16" /></h4>
			<p><spring:message code="result_content_17" /></p>
		</div>
	</div>
	</c:if>
	
	
</div><!-- / container -->

<script type="text/javascript">
$(function(){
	
	var regId = '${list.regId}';
	if(regId.replace(/[0-9.]/g, '') != "" && regId != 'anonymous'){
		$("#btnModify").hide();
	}
	
	$('html > head > title').text('<spring:message code="site_reportResult_title" />');
	
	var msgObj = {
		label_file : '<spring:message code="label_file" />',
		label_file_find : '<spring:message code="label_file_find" />',
		error_msg : '<spring:message code="error_msg" />',
		label_delete : '<spring:message code="label_delete" />',
		label_reply_comment : '<spring:message code="label_reply_comment" />',
		file_msg_01 : '<spring:message code="file_msg_01" />',
		file_msg_02 : '<spring:message code="file_msg_02" />',
		file_msg_03 : '<spring:message code="file_msg_03" />',
		file_msg_04 : '<spring:message code="file_msg_04" />',
		file_msg_05 : '<spring:message code="file_msg_05" />',
		file_msg_06 : '<spring:message code="file_msg_06" />',
		file_msg_07 : '<spring:message code="file_msg_07" />',
		label_save : '<spring:message code="label_save" />',
		label_person : '<spring:message code="label_person" />',
		label_informant : '<spring:message code="label_informant" />',
		label_comment : '<spring:message code="label_comment" />'
	};
	
	fnMessageSetting(msgObj);
	
	selectResultFileList('FRK001', '<c:out value="${list.repId}"/>');
	
	selectReplyList($("#repId").val(), $("#reqMemId").val());
	
	$("div.comment-write-area").on('change', ':file', function(){
		addResultFile($(this).attr('id'));
	});
});

function go_reportUpdate(repType){
	if(repType=="real"){
	    $("#resultFrm").attr("action","/report/real/update.do").submit();
	} else {
	    $("#resultFrm").attr("action","/report/anonymous/update.do").submit();
	}
}

$( function () {
	let parser = new UAParser();
	let _top = 0;
	if (!parser.getDevice().type) _top = 500;
	$('html, body').animate({ scrollTop: _top }, 200);
});
</script>	
