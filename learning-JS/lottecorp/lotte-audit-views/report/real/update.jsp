<%@ page language="java" contentType="text/html; charset=UTF-8"   pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jsp"%>

<spring:eval expression="@properties['recaptcha.sitekey']" var="key"/>
	
<div id="container" class="container">
	<div class="visual-area">
		<h2><spring:message code="label_h2" /></h2>
	</div>
	
	<jsp:include page="/WEB-INF/views/sitemesh/menu.jsp"></jsp:include>

	<div class="copy-area">
		<p><spring:message code="label_p" /></p>
	</div>
	
	<form id="reportForm" method="post">
	<!-- 토큰 값을 받아 저장할 태그 -->
    <input type="hidden" id="token" name="token"/>
    <input type="hidden" id="report_agree01" name="report_agree01" value="<c:out value='${list.agreeYn1 ? 1 : 0}'/>" />
    <input type="hidden" id="report_agree02" name="report_agree02" value="<c:out value='${list.agreeYn2 ? 1 : 0}'/>" />
    <input type="hidden" id="deleteFileId" name="deleteFileId" value="" />
    <input type="hidden" id="rep_id" name="rep_id" value="<c:out value='${list.repId}'/>" />
    <input type="hidden" id="mem_id" name="mem_id" value="<c:out value='${list.reqMemId}'/>" />

	<div class="content">
		<h3><spring:message code="label_title_modify" /></h3>
		<div class="tab-area">
			<ul>
				<li><a href="#" class="active" title="선택됨"><spring:message code="label_tab_real" /></a></li>
				<li><a href="/report/anonymous.do"><spring:message code="label_tab_anaymous" /></a></li>
			</ul>
		</div>

		<div class="audit-form-area">
			<h4><spring:message code="label_precautions" /></h4>
			<ul class="type-area-1">
				<li><spring:message code="label_precautions_01" /></li>
				<li><spring:message code="label_precautions_02" /></li>
				<li><spring:message code="label_precautions_03" /><br class="mo"> <spring:message code="label_precautions_04" /><img src="/images/ic-arrow-1.png" alt=">"> <br class="mo"><spring:message code="label_precautions_05" /></li>
			</ul>
		</div>	

		<div class="audit-form-area">
			<h4><spring:message code="label_agree" /></h4>
			<div class="type-area-2">
				<ul>
					<li><spring:message code="label_agree_01" /></li>
					<li><spring:message code="label_agree_02" /></li>
				</ul>
				<button 
					type="button" 
					class="btn-type-1" 
					aria-controls="policyPopHtml" 
					id="btn-agree"
					onclick="fnPolicyPop(this);"><spring:message code="label_agree_button" /></button>
			</div>
		</div>	
		
		<div class="audit-form-area">
			<%-- 언어 타입별 코드 및 selectbox default text 설정 --%>
			<c:set var="companyCode" 		value="BUS"/>
			<c:set var="relationshipCode" 	value="TGT"/>
			<c:set var="consultingCode" 	value="PET"/>
			<c:set var="replyCode" 			value="SRR"/>
			<c:set var="emailCode" 			value="SRM"/><%-- 국문 영문 동일 --%>
			<c:set var="phoneCode" 			value="SRH"/><%-- 국문 영문 동일 --%>
			<c:set var="reportSelectBoxDefalutText1"><spring:message code='report_selbox_default_text1'/></c:set>
			<c:set var="reportSelectBoxDefalutText2"><spring:message code='report_selbox_default_text2'/></c:set>
			<c:if test="${cookie.language.value eq 'en'}">
				<c:set var="companyCode" value="BUE"/>
				<c:set var="relationshipCode" value="TGE"/>
				<c:set var="consultingCode" value="PEE"/>
				<c:set var="replyCode" value="SRE"/>
			</c:if>			
			<h4><spring:message code="label_member" /></h4>
			<p class="required-area"><span>*</span> <spring:message code="label_required" /></p>
			<ul class="fieldset-area">
				<li>
					<label for="report_name"><spring:message code="label_name" /><em class="required">*</em></label>
					<div class="input-box-area">
						<span class="text-area w-240"><input type="text" name="report_name" id="report_name" value="<c:out value='${list.memNm}'/>" maxlength="20"></span>
					</div>
				</li>
				<li>
					<label for="report_relationship_selbox"><spring:message code="label_relationship" /><em class="required">*</em></label>
					<div class="input-box-area">						
						<span class="select-area w-240">
							<select name="report_relationship_selbox" id="report_relationship_selbox">
								<selectOption:list code="${relationshipCode}" selected="${list.rltCd}" default_text='${reportSelectBoxDefalutText1}' />								
							</select>							
						</span>
					</div>
				</li>				
				<li class="flex-wrap">
					<label for="report_email_selbox"><spring:message code="label_emal" /><em class="required">*</em></label>
					<div class="input-box-area">
						<span class="select-area w-240">
							<select name="report_email_selbox" id="report_email_selbox" title='<spring:message code="report_email_selbox_title" />'>
								<selectOption:list code="${emailCode}" default_text='${reportSelectBoxDefalutText2}' />								
							</select>
						</span>
						<span class="text-area w-240"><input type="text" name="report_email_id" id="report_email_id" title='<spring:message code="report_email_id_title" />' value="<c:out value='${list.memEml}'/>" maxlength="30"></span>
						<span class="dash">@</span>
						<span class="text-area w-240"><input type="text" name="report_email_addr" id="report_email_addr" title='<spring:message code="report_email_addr_title" />' value="<c:out value='${list.memEmlAddr}'/>" maxlength="30"></span>
					</div>
				</li>
				<li>
					<label for="report_hp_selbox"><spring:message code="label_hp" /><em class="required">*</em></label>
					<div class="input-box-area">
						<span class="select-area w-240">
							<select name="report_hp_selbox" id="report_hp_selbox" title='<spring:message code="report_hp_selbox_title" />'>
								<selectOption:list code="${phoneCode}" selected="${list.memHp01}" default_text='${reportSelectBoxDefalutText1}' />
							</select>
						</span>
						<span class="text-area w-240"><input type="text" name="report_hp_02" id="report_hp_02" title='<spring:message code="report_hp_02_title" />' value="<c:out value='${list.memHp02}'/>" maxlength="4" oninput="javascript: this.value = this.value.replace(/[^0-9]/g, ''); if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"></span>
						<span class="text-area w-240"><input type="text" name="report_hp_03" id="report_hp_03" title='<spring:message code="report_hp_03_title" />' value="<c:out value='${list.memHp03}'/>" maxlength="4" oninput="javascript: this.value = this.value.replace(/[^0-9]/g, ''); if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"></span>
					</div>
				</li>
				<li>
					<label for="report_reply_selbox"><spring:message code="label_reply" /><em class="required">*</em></label>
					<div class="input-box-area">
						<span class="select-area w-240">
							<select name="report_reply_selbox" id="report_reply_selbox">
								<selectOption:list code="${replyCode}" selected="${list.rsltCd}" default_text='${reportSelectBoxDefalutText1}' />								
							</select>
						</span>
					</div>
				</li>
			</ul>
		</div>

		<div class="audit-form-area">
			<h4><spring:message code="label_target" /></h4>

			<ul class="fieldset-area">
				<li>
					<label for="report_company_selbox"><spring:message code="label_company" /><em class="required">*</em></label>
					<div class="input-box-area">
						<span class="select-area w-240">
							<select name="report_company_selbox" id="report_company_selbox" class="selectpicker selectpicker-tab-1" data-live-search="true" 
								title="<spring:message code='report_company_selbox_title1'/>" data-noResultsText="<spring:message code='report_company_selbox_noResultsText'/>">
								<selectOption:list code="${companyCode}" selected="${list.cusCd}" default_text='${reportSelectBoxDefalutText1}' />
							</select>							
						</span>
						<span class="select-area w-240">
							<select name="report_com_cd" id="report_com_cd" class="selectpicker selectpicker-tab-2" data-live-search="true" 
								title="<spring:message code='report_company_selbox_title2'/>" data-noResultsText="<spring:message code='report_company_selbox_noResultsText'/>">
								<option value=""><spring:message code='label_all_select' /></option>
							</select>							
						</span>
						<button 
								type="button" 
								class="btn-type-2 mo-hidden"
								aria-controls="companyPopHtml" 
								id="btn-real-company"
								onclick="fnCompanyPop(this);"><spring:message code="label_company_all" /></button>
					</div>
				</li>
				<li>
					<label for="report_consulting_selbox"><spring:message code="label_consult" /><em class="required">*</em></label>
					<div class="input-box-area">
						<span class="select-area w-240">
							<select id="report_consulting_selbox" name="report_consulting_selbox">
								<selectOption:list code="${consultingCode}" selected="${list.petCd}" default_text='${reportSelectBoxDefalutText1}' />
							</select>							
						</span>
					</div>
				</li>
				<li>
					<label for="report_target"><spring:message code="label_target_name" /></label>
					<div class="input-box-area">
						<span class="text-area w-240"><input type="text" name="report_target" id="report_target" value="<c:out value='${list.tgtEnm}'/>" maxlength="20"></span>
					</div>
				</li>
				<li>
					<label for="report_dept"><spring:message code="label_dept" /></label>
					<div class="input-box-area">
						<span class="text-area w-240"><input type="text" name="report_dept" id="report_dept" value="<c:out value='${list.tgtDnm}'/>" maxlength="50"></span>
					</div>
				</li>
				<li>
					<label for="report_posit"><spring:message code="label_posit" /></label>
					<div class="input-box-area">
						<span class="text-area w-240"><input type="text" name="report_posit" id="report_posit" value="<c:out value='${list.tgtEcls}'/>" maxlength="40"></span>
					</div>
				</li>
			</ul>
		</div>	

		<div class="audit-form-area">
			<h4><spring:message code="label_report_contents" /></h4>

			<ul class="fieldset-area">
				<li>
					<label for="report_title"><spring:message code="label_subject" /><em class="required">*</em></label>
					<div class="input-box-area">
						<span class="text-area w-full"><input type="text" name="report_title" id="report_title" value="<c:out value='${list.reqTt}' escapeXml="false"/>"></span>
					</div>
				</li>
				<li>
					<label for="report_content"><spring:message code="label_contents" /><em class="required">*</em></label>
					<div class="input-box-area">
						<span class="textarea-area w-full"><textarea name="report_content" id="report_content" placeholder="<spring:message code="report_content_placeholer_default" /><spring:message code="report_content_placeholer_PET${fn:substring(list.petCd,3,6)}" />"><c:out value='${list.reqCtt}' escapeXml="false"/></textarea></span>
					</div>
				</li>
				<li class="space">
					<p class="txt"></p>
				</li>
				<li id="fileHTML1">
					<label for="file1"><spring:message code="label_file" /></label>
					
					<div class="input-box-area">
						<div class="filebox">
							<input class="upload-name" id="file1">
							<input type="file" name="contentFile" id="contentFile1"> 
							<label for="contentFile1"><spring:message code="label_file_find" /></label> 
						</div>
					</div>
				</li>
				<li class="file-list" id="fileViewHTML">
				</li>
				<li class="space">
					<p class="txt"><spring:message code="label_file_description" /></p>
				</li>
			</ul>
		</div>

		<div class="form-submit-area">
			<p><spring:message code="label_info_01" /></p>
			<div class="btn-area">
				<c:if test="${empty list.procCd}">
				<button type="button" class="btn-submit" onclick="javascrpit:fnUpdateReport();"><spring:message code="label_result_update" /></button>
				</c:if>
			</div>
		</div>

		<div class="gary-info-area">
			<h4><spring:message code="label_msg_01" /></h4>
			<ul>
				<li><span><spring:message code="label_msg_02" /></span></li>
				<li><span><spring:message code="label_msg_03" /></span></li>
			</ul>
			<ul>
				<li>
					<strong><spring:message code="label_msg_06" /></strong>
					<span><spring:message code="label_msg_07" /></span>
				</li>
				<li>
					<strong><spring:message code="label_msg_08" /></strong>
					<span><spring:message code="label_msg_09" /></span>
				</li>
			</ul>
		</div>
	</div>
	</form>	
</div><!-- / container --> 

<c:if test="${cookie.language.value eq 'ko'}">
<script src="https://www.google.com/recaptcha/api.js?render=<c:out value="${key}" />"></script>
</c:if> 
<c:if test="${cookie.language.value eq 'en'}">
<script src="https://www.google.com/recaptcha/api.js?render=<c:out value="${key}&hl=en" />"></script>
</c:if> 

<script type="text/javascript">
	
	$(function(){
		
		$('html > head > title').text('<spring:message code="site_update_real_title" />');
		
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
		
		$("form").validate({
	    	onfocusout: false,
	        // 체크할 항목들의 룰 설정
	        rules: {
	        	//제보자 정보
	        	//상담유형
	        	report_consulting_selbox: {
	                required : true
	            },
	        	//제보자 성명
	        	report_name: {
	        		required : true
	            },
	            report_email_id: {
	            	required : true
	            },
	            report_email_addr: {
	            	required : true
	            },
	        	//휴대전화
	        	report_hp_selbox: {
	        		required : true
	            },
	        	report_hp_02: {
	        		required : true
	            },
	            report_hp_03: {
	            	required : true
	            },
	            
	        	//제보대상 
	        	//회사명
	        	report_company_selbox: {
	        		required : true
	            },
	            report_com_cd: {
	            	required : true
	            },
	        	//대상과의관계
	        	report_relationship_selbox: {
	        		required : true
	            },
	        	
	        	//제보내용 
	        	//제목
	        	report_title: {
	        		required : true
	            },
	        	//내용 
	        	report_content: {
	        		required : true
	            }
	        },
	        //규칙체크 실패시 출력될 메시지
	        messages : {
	        	//제보자 정보
	        	//상담유형
	        	report_consulting_selbox: {
	                required : '<spring:message code="report_consulting_selbox_msg" />'
	            },
	        	//제보자 성명
	        	report_name: {
	                required : '<spring:message code="report_name_msg" />'
	            },
	        	//이메일
	            report_email_id: {
	                required : '<spring:message code="report_email_id_msg" />'
	            },
	            report_email_addr: {
	                required : '<spring:message code="report_email_id_msg" />'
	            },
	        	//휴대전화
	        	report_hp_selbox: {
	                required : '<spring:message code="report_hp_selbox_msg" />'
	            },
	        	report_hp_02: {
	                required : '<spring:message code="report_hp_02_msg" />'
	            },
	            report_hp_03: {
	                required : '<spring:message code="report_hp_03_msg" />'
	            },
	        	//제보대상 
	        	//회사명
	        	report_company_selbox: {
	                required : '<spring:message code="report_company_selbox_msg" />'
	            },
	            report_com_cd: {
	            	 required : '<spring:message code="report_company_selbox_msg" />'
	            },
	        	//대상과의관계
	        	report_relationship_selbox: {
	                required : '<spring:message code="report_relationship_selbox_msg" />'
	            },
	        	//제보내용 
	        	//제목
	        	report_title: {
	                required : '<spring:message code="report_title_msg" />'
	            },
	        	//내용 
	        	report_content: {
	                required : '<spring:message code="report_content_msg" />'
	            }
	        }, 
	        errorPlacement: function(error, element) {
				
			}, 
			invalidHandler: function(form, validator) {
				var errors = validator.numberOfInvalids();
				if (errors) {
					alert(validator.errorList[0].message);
					validator.errorList[0].element.focus();
				}
			}
	    });
	    
	    $("#report_email_selbox").change(function(){
	    	if($(this).val() == ""){
	    		$("#report_email_addr").val("");
	    	} else {
	    		$("#report_email_addr").val($(this).find("option:selected").text());
	    	}
	    });
	    
	  	//사업군 선택시 계열사 조회
		$("#report_company_selbox").change(function(){
			goCompany($("#report_company_selbox").val());
		});
	   
		$("ul.fieldset-area").on('change', ':file', function(){
			addFile($(this).attr('id'));
		});
	  	
		selectFileList('FRK001', $("#rep_id").val());

		var compCd = "<c:out value='${list.compCd }'/>";
		if(typeof compCd != "undefined"){
			goCompany("<c:out value='${list.cusCd }'/>");
		}
		
		$("#report_com_cd").change(function(e){
			
			var title = $(this).find(':selected').attr('data-sub02');
			if(typeof title == "undefined"){
				$("#report_com_cd").attr('title',"");
			} else {
				$("#report_com_cd").attr('title',title);
			}
			
			var busCd = $("#report_consulting_selbox").val();
			if(busCd != "" && (busCd == "PET020" || busCd == "PEE020")){
				
				$("#btn-real-company").attr('onclick', 'fnCompanyPop(this,"'+busCd+'");');
				
				var target = $(this).find(':selected').attr('data-sub');
				if(target != ""){
					if(target.indexOf('@lotte.net') > -1 ){
						alert('<spring:message code="target_msg" />'+ target +'<spring:message code="target_msg01" />');
						return false;
					} else {
						alert('<spring:message code="blank_msg" />');
						window.open(target,"_blank");
					}
				}
			} else {
				$("#btn-real-company").attr('onclick', 'fnCompanyPop(this);');
			}
		});
		
		$("#report_consulting_selbox").change(function(e){
			var busCd = $(this).val();
			if(busCd != "" && (busCd == "PET020" || busCd == "PEE020")){
				$("#btn-real-company").attr('onclick', 'fnCompanyPop(this,"'+busCd+'");');
				
			} else {
				$("#btn-real-company").attr('onclick', 'fnCompanyPop(this);');
			}
			
			$("#report_content").attr("placeholder","");
			
			var companyCd = $("#report_company_selbox").val();
			var comCd = $("#report_com_cd").val();
			
			if((busCd == "PET020" || busCd == "PEE020")){
				fnChangeDisabled(true);
			} else {
				fnChangeDisabled(false);
			}
			
			
			if(companyCd != "" && comCd != "" && (busCd == "PET020" || busCd == "PEE020")){
				
				var target = $("#report_com_cd").find(':selected').attr('data-sub');
				if(target != ""){
					if(target.indexOf('@lotte.net') > -1 ){
						alert('<spring:message code="target_msg" />'+ target +'<spring:message code="target_msg01" />');
						return false;
					} else {
						alert('<spring:message code="blank_msg" />');
						window.open(target,"_blank");
					}
				}
				
			} else if(busCd.slice(-3) != "020"){
				
				var defaultPlaceholder = '<spring:message javaScriptEscape="true" code="report_content_placeholer_default" />';
				
				var contentPlaceholder = {
					PET003 : '<spring:message javaScriptEscape="true" code="report_content_placeholer_PET003" />',
					PET014 : '<spring:message javaScriptEscape="true" code="report_content_placeholer_PET014" />',
					PET016 : '<spring:message javaScriptEscape="true" code="report_content_placeholer_PET016" />',
					PET017 : '<spring:message javaScriptEscape="true" code="report_content_placeholer_PET017" />',
					PET018 : '<spring:message javaScriptEscape="true" code="report_content_placeholer_PET018" />',
					PET019 : '<spring:message javaScriptEscape="true" code="report_content_placeholer_PET019" />'
				}
				
				$("#report_content").attr("placeholder", defaultPlaceholder + eval("contentPlaceholder.PET"+busCd.slice(-3)));		
			}
		});
	});
	
	//검색조건 selectbox 
	function goCompany(grpDiv){
		
		$.ajax({
			// AJAX 호출할 URL
			url          : '/report/selectReportCompanyList.json',
			type		 : "POST",
			data		 : {
				grpDiv   : grpDiv
			},
			dataType     : 'json',			// AJAX의 응답형태를 JSON으로 사용
			async        : false,
			success		 : function(response, statusText) {
				//초기화
				$("#report_com_cd").empty();
				$("#report_com_cd").append($("<option />", {"value":"", "text":"<spring:message code='label_all_select' />"}));
				if (statusText == 'success') {
					response.list.forEach(function(list, i){
						if(list.comCd == null) {
							return true;
						}
						$("#report_com_cd").append($("<option />", {"value":list.comCd, "text":list.comNm, "data-sub":list.comRef, "data-sub02":list.cdCmt}));
					});
				}
				var compCd = "<c:out value='${list.compCd }'/>";
				$("#report_com_cd").val(compCd).trigger('change');
				$("#report_com_cd").selectpicker('refresh');
			}
		});
	}
	
	function fnReturnCompany(grpCd, comCd){
		$("#report_company_selbox").val(grpCd).prop("selected", true);
		$("#report_company_selbox").selectpicker('refresh');
		goCompany(grpCd);
		$("#report_com_cd").val(comCd).prop("selected", true);
		$("#report_com_cd").selectpicker('refresh');
	} 
	
	//return policyPopup
	function fnReturnPolicy(data){
		$("#report_agree01").val(data.agree01);
		$("#report_agree02").val(data.agree02);
		
		$("#btn-real-company").attr("disabled", false);
		
		$("#report_consulting_selbox").attr("disabled", false);
		$("#report_name").attr("disabled", false);
		$("#report_company_selbox").attr("disabled", false);
		$("#report_com_cd").attr("disabled", false);
		
		$("#report_company_selbox").selectpicker('refresh');
		$("#report_com_cd").selectpicker('refresh');
	}
	
	function onClick(e) {
        grecaptcha.ready(function() {
        	grecaptcha.execute('${key}', {action: 'homepage'}).then(function(token) {
        		$('#token').val(token);
		    	// form
		    	var form = $('#reportForm')[0];
				// Create an FormData object 
				var fileForm = new FormData(form);
		    	
		    	 $.ajax({
		            url : '/grecaptcha.json'
	            	,data: fileForm //queryString
	 	            ,type: "post"
	 	            ,processData: false
	 	            ,contentType: false
	 	            ,async:false /// 필요에 따라서 비동기 또는 동기 호출
		            ,success: function (result) {
		        	    console.log(result);  
		            }
		            ,error: function(e) {
		        	    console.log("fail");
		            }
		        }); 
		    });
		});
	  	
      }
	
    //제보하기 
    function fnUpdateReport() {
    	 
        var agree = $("#report_agree01").val();
        if(agree != "1"){
        	alert('<spring:message code="policy_pop_msg" />');
        	$("#btn-agree").focus();
        	return false;
        }
        
        
    	// 이메일, 휴대전화 패턴체크
		var reportEmail = $("#report_email_id").val() + $("#report_email_addr").val();
		var reportHP = $("#report_hp_selbox").val() + $("#report_hp_02").val() + $("#report_hp_03").val();
					
		if(reportHP != ""){
			if(!phoneCheck($("#report_hp_selbox").val() + "-" + $("#report_hp_02").val() + "-" + $("#report_hp_03").val())){
				alert('<spring:message code="report_hp_02_msg" />');
				$("#report_hp_02").focus();
				return false;
			}
		} 
		
		if(reportEmail != ""){
			if(!emailCheck($("#report_email_id").val() + "@" + $("#report_email_addr").val())){
				alert('<spring:message code="report_email_id_msg" />');
				$("#report_email_id").focus();
				return false;
			}
		}
        
        var isChecked = $('#reportForm').valid();
		//필수 입력 값 체크 
        if(isChecked){
			
        	var busCd = $("#report_consulting_selbox").val();
   	    	if(busCd != "" && (busCd == "PET020" || busCd == "PEE020")){
   	    		alert('<spring:message code="blank_msg" />');
   	    		return false;
   	    	}
        	
			// Get form
			var form = $('#reportForm')[0];		
			
			// Create an FormData object 
			var fileForm = new FormData(form);
		
	        $.ajax({
	            url : '/report/real/updateReal.json'
	           ,data: fileForm //queryString
	           ,type: "post"
	           ,processData: false
	           ,contentType: false
	           // ,async:false /// 필요에 따라서 비동기 또는 동기 호출
	           ,success: function (data, textStatus) {
	                if(data.rtnCode != "" && data.rtnCode == "success" && data.rtnCode != undefined){
	            	    alert('<spring:message code="rep_success_msg" />');
					    //제보결과 페이지 이동 
					    $("#rep_id").val(data.rtnKey);					    
					    $("#reportForm").attr("action","/report/real/result.do").submit();
					    
	                } else if (data.rtnCode == "fileExt") {
   						alert('<spring:message code="rep_file_ext" />');	                	
   	                } else if (data.rtnCode == "fileSize") {
   						alert('<spring:message code="rep_file_size" />');	                	
   	                } else {   	                	
	                	alert('<spring:message code="rep_fail_msg" />');
	                }	                
	            }
	           ,error: function(e, data, textStatus) {
	        	   alert('<spring:message code="rep_fail_msg" />');
	           }
	        });
		} 
     	
    }
    
    function fnChangeDisabled(data){
		$("#report_name").attr("disabled", data);
		$("#report_email_selbox").attr("disabled", data);
		$("#report_email_id").attr("disabled", data);
		$("#report_email_addr").attr("disabled", data);
		$("#report_hp_selbox").attr("disabled", data);
		$("#report_hp_02").attr("disabled", data);
		$("#report_hp_03").attr("disabled", data);
		$("#report_reply_selbox").attr("disabled", data);
		$("#report_relationship_selbox").attr("disabled", data);
		$("#report_target").attr("disabled", data);
		$("#report_dept").attr("disabled", data);
		$("#report_posit").attr("disabled", data);
	    $("#report_title").attr("disabled", data);
		$("#report_content").attr("disabled", data);
		$("#file1").attr("disabled", data);
		$("#contentFile1").attr("disabled", data);
		$("#report_password").attr("disabled", data);
		$("#report_password_confirm").attr("disabled", data);
		$("#btnSave").attr("disabled", data);
	}
     
	
</script>
  