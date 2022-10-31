function convertDate(date){
	return date.toLocaleDateString().replace(/\./g, '').split(' ').map((v,i)=> i > 0 && v.length < 2 ? '0' + v : v).join('-');
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 페이지 네비게이션 생성 및 이동 처리
function paging(totalCnt, dataPerPage, pageCount, currentPage){
	
	var totalPage = Math.ceil(totalCnt / dataPerPage); 	// 총 페이지 수
	
	var pageGroup = Math.ceil(currentPage / pageCount); // 페이지 그룹
  
	var last = pageGroup * pageCount;    	// 화면에 보여질 마지막 페이지 번호
	var first = last - ( pageCount - 1 ); 	// 화면에 보여질 첫번째 페이지 번호
	if(last > totalPage)
		last = totalPage;
	if(first == 0) 
		first = 1;
	var next = last+1;
	var prev = first-1;
	
	var html = "";

	if (prev <= 0) {
		html += '<li class="page-item first disabled"><a href="javascript:void(0);" class="page-link" id="first">처음</a></li>';
		html += '<li class="page-item prev disabled"><a href="javascript:void(0);" class="page-link" id="prev">이전</a></li>';
	} else {
		html += '<li class="page-item first"><a href="javascript:void(0);" class="page-link" id="first">처음</a></li>';
		html += '<li class="page-item prev"><a href="javascript:void(0);" class="page-link" id="prev">이전</a></li>';
	}


	for (var i = first; i <= last; i++) {
		html += '<li class="page-item"><a href="javascript:void(0);" class="page-link" id="page' + i + '">' + i + '</a></li>';
	}

	if (last < totalPage) {
		html += '<li class="page-item next"><a href="javascript:void(0);" class="page-link" id="next">다음</a></li>';
		html += '<li class="page-item last"><a href="javascript:void(0);" class="page-link" id="last">마지막</a></li>';
	} else {
		html += '<li class="page-item next disabled"><a href="javascript:void(0);" class="page-link" id="next">다음</a></li>';
		html += '<li class="page-item last disabled"><a href="javascript:void(0);" class="page-link" id="last">마지막</a></li>';
	}

	$(".pagination").html(html);    // 페이지 목록 생성

	$(".page-item a#page" + currentPage).parent().addClass('active'); // 현재 페이지 표시

	$(".page-item a").click(function() {
		var $item = $(this);
		var $id = $item.attr("id");
		var selectedPage = $item.text();
		
		if($item.parent().hasClass('disabled')){
			return false;
		}

		if ($id == "first") selectedPage = 1;
		if ($id == "next") selectedPage = next;
		if ($id == "prev") selectedPage = prev;
		if ($id == "last") selectedPage = totalPage;
		
		gridView.setPage(selectedPage - 1);
		paging(totalCnt, dataPerPage, pageCount, selectedPage);	
		
	});
                                     
}

function fnCompanySelcPop(){
	
	$.ajax({
		type : 'POST',
		url : '/comm/companySelcPopup.do',
		data : {},
		success : function(data) {
			if(typeof data == "string"){
				$('.modal').empty();
				$('.modal').attr('id', 'companySelcPopupHtml');
				$('.modal').html(data);
				myFunc.modal.open('companySelcPopupHtml');
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		},
		error : function(xhr) {
			if (xhr.status == 400) {
				location.href = '/expire.do';
			} else if (xhr.status == 403) {
				location.href = '/error.do';
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		}
	});
	
}

function fnMergePop(param){
	$.ajax({
		type : 'POST',
		url : '/report/mergePopup.do',
		contentType : "application/json",
		data : JSON.stringify(param),
		success : function(data) {
			if(typeof data == "string"){
				$('.modal').empty();
				$('.modal').attr('id', 'mergePopHtml');
				$('.modal').html(data);
				
				myFunc.modal.open('mergePopHtml');
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		},
		error : function(xhr) {
			if (xhr.status == 400) {
				location.href = '/expire.do';
			} else if (xhr.status == 403) {
				location.href = '/error.do';
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		}
	});
}

function fnRejectPop(repId, reqMemId){
	
	$.ajax({
		type : 'POST',
		url : '/report/rejectPopup.do',
		data : {},
		success : function(data) {
			if(typeof data == "string"){
				$('.modal').empty();
				$('.modal').attr('id', 'rejectPopHtml');
				$('.modal').html(data);
				if(repId != null && repId != ""){
					$('#rejectPopHtml #repId').val(repId);
				}
				if(reqMemId != null && reqMemId != ""){
					$('#rejectPopHtml #reqMemId').val(reqMemId);
				}
				
				myFunc.modal.open('rejectPopHtml');
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		},
		error : function(xhr) {
			if (xhr.status == 400) {
				location.href = '/expire.do';
			} else if (xhr.status == 403) {
				location.href = '/error.do';
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		}
	});
}

function fnRejectAdminPop(obj, type){
	$.ajax({
		type : 'POST',
		url : '/admin/rejectAdminPopup.do',
		data : {},
		success : function(data) {
			if(typeof data == "string"){
				
				var html =  "<div class=\"modal\" id=\"adminPopupHtml\"></div>";
				$('.modal').after(html);
				$('#adminPopupHtml').html(data);
				
				if(obj != ""){
					$('#searchAdminPopupWord').val(obj);
					$("#btnAdminPopupSearch").trigger('click');
				}
				
				if(type != null){
					$("#adminPopupObjType").val(type);
				}
				
				myFunc.modal.open('adminPopupHtml','zIndex-2');
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		},
		error : function(xhr) {
			if (xhr.status == 400) {
				location.href = '/expire.do';
			} else if (xhr.status == 403) {
				location.href = '/error.do';
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		}
	});
}

function fnCodePop(){
	
	$.ajax({
		type : 'POST',
		url : '/code/codeGrpPopup.do',
		data : {},
		success : function(data) {
			if(typeof data == "string"){
				$('.modal').empty();
				$('.modal').attr('id', 'codeGrpPopHtml');
				$('.modal').html(data);
				myFunc.modal.open('codeGrpPopHtml');
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		},
		error : function(xhr) {
			if (xhr.status == 400) {
				location.href = '/expire.do';
			} else if (xhr.status == 403) {
				location.href = '/error.do';
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		}
	});
}

function fnSmsTemplatPop(){
	
	$.ajax({
		type : 'POST',
		url : '/templat/smsTemplatPopup.do',
		data : {},
		success : function(data) {
			if(typeof data == "string"){
				$('.modal').empty();
				$('.modal').attr('id', 'smsTemplatPopHtml');
				$('.modal').html(data);
				myFunc.modal.open('smsTemplatPopHtml');
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		},
		error : function(xhr) {
			if (xhr.status == 400) {
				location.href = '/expire.do';
			} else if (xhr.status == 403) {
				location.href = '/error.do';
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		}
	});
}


//계열사 팝업 
function fnCompanyPop(){
	
	$.ajax({
		type : 'POST',
		url : '/company/companyPopup.do',
		data : {},
		success : function(data) {
			if(typeof data == "string"){
				$('.modal').empty();
				$('.modal').attr('id', 'companyPopupHtml');
				$('.modal').html(data);
				myFunc.modal.open('companyPopupHtml');
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		},
		error : function(xhr) {
			if (xhr.status == 400) {
				location.href = '/expire.do';
			} else if (xhr.status == 403) {
				location.href = '/error.do';
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		}
	});
}

//계열사 팝업 
function fnCompanyContentPop(){
	
	$.ajax({
		type : 'POST',
		url : '/company/companyContentPopup.do',
		data : {},
		success : function(data) {
			if(typeof data == "string"){
				$('.modal').empty();
				$('.modal').attr('id', 'companyPopupHtml');
				$('.modal').html(data);
				myFunc.modal.open('companyPopupHtml');
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		},
		error : function(xhr) {
			if (xhr.status == 400) {
				location.href = '/expire.do';
			} else if (xhr.status == 403) {
				location.href = '/error.do';
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		}
	});
}

//담당자 팝업
function fnAdminPop(obj, type){
	
	$.ajax({
		type : 'POST',
		url : '/admin/admPopup.do',
		data : {},
		success : function(data) {
			if(typeof data == "string"){
				$('.modal').empty();
				$('.modal').attr('id', 'adminPopupHtml');
				$('.modal').html(data);
				
				if(obj != ""){
					$('#searchAdminPopupWord').val(obj);
					$("#btnAdminPopupSearch").trigger('click');
				}
				
				if(type != null){
					$("#adminPopupObjType").val(type);
				}
				
				myFunc.modal.open('adminPopupHtml');
				
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		},
		error : function(xhr) {
			if (xhr.status == 400) {
				location.href = '/expire.do';
			} else if (xhr.status == 403) {
				location.href = '/error.do';
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		}
	});
}


function fnAdminContentPop(obj, type){
	
	$.ajax({
		type : 'POST',
		url : '/admin/adminContentPopup.do',
		data : {},
		success : function(data) {
			if(typeof data == "string"){
				$('.modal').empty();
				$('.modal').attr('id', 'adminPopupHtml');
				$('.modal').html(data);
				
				if(obj != ""){
					$('#searchAdminPopupWord').val(obj);
					$("#btnAdminPopupSearch").trigger('click');
				}
				
				if(type != null){
					$("#adminPopupObjType").val(type);
				}
				
				myFunc.modal.open('adminPopupHtml');
				
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		},
		error : function(xhr) {
			if (xhr.status == 400) {
				location.href = '/expire.do';
			} else if (xhr.status == 403) {
				location.href = '/error.do';
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		}
	});
}

function fnExcelPopup(excelCd, sheetName){
	
	$.ajax({
		type : 'POST',
		url : '/comm/excelDownReasonPopup.do',
		data : {excelCd : excelCd, sheetName : sheetName},
		success : function(data) {
			if(typeof data == "string"){
				$('.modal').empty();
				$('.modal').attr('id', 'excelDownReasonPopHtml');
				$('.modal').html(data);
				myFunc.modal.open('excelDownReasonPopHtml');
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		},
		error : function(xhr) {
			if (xhr.status == 400) {
				location.href = '/expire.do';
			} else if (xhr.status == 403) {
				location.href = '/error.do';
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		}
	});
	
}

function fnExcelDownload(){
	
	myFunc.loader.open();
	
	var param = new FormData($("#searchFrm")[0]);
	param.append("excelCd", $("#excelCd").val());
	param.append("sheetName", $("#sheetName").val());
	param.append("reason", $("#reason").val());
	param.append("pwd", $("#pwd").val());
	param.append("ref", location.pathname);
	
	
	var sheetNameArr = $("#sheetName").val().split("|");
	var excelFileNm = sheetNameArr[0];
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		
		if (this.readyState == 4 && this.status == 200){
	      
			var disposition = xhr.getResponseHeader('Content-Disposition');
			
//			if (disposition && disposition.indexOf('attachment') !== -1) {
//				var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
//				var matches = filenameRegex.exec(disposition);
//				if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
//			}
			
			var filename = excelFileNm + ".xlsx";

			var type = xhr.getResponseHeader('Content-Type');
			var blob = new Blob([this.response], { type: type });
			
			if (typeof window.navigator.msSaveBlob !== 'undefined') {
				// IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
				window.navigator.msSaveBlob(blob, filename);
			} else {		
				var URL = window.URL || window.webkitURL;
				var downloadUrl = URL.createObjectURL(blob);

				if (filename) {
					// use HTML5 a[download] attribute to specify filename
					var a = document.createElement("a");
					
					// safari doesn't support this yet
					if (typeof a.download === 'undefined') {
						window.location.href = downloadUrl;
					} else {
						a.href = downloadUrl;
						a.download = filename;
						document.body.appendChild(a);
						a.click();
					}
				}
			

               setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100);
			}
		}
	}
	xhr.open('POST', '/comm/excelDownload.json');
	xhr.responseType = 'blob';
	xhr.send(param); 
	excelDownReasonPopEnd();
	myFunc.loader.close();
	
}

// Code Grp selectbox option append
function selectCodeGrpList(eleId){
	
	$.ajax({
		type : 'POST',
		url : '/code/selectCodeGrpList.json',
		data : {},
		success : function(data) {
			
			if(data && data.hasOwnProperty("list")){
				
				var list = data.list;
				
				$("#" + eleId).empty();
				$("#" + eleId).append('<option value="">전체</option>');
				for(var i = 0 ; i < list.length ; i++){
					$("#" + eleId).append('<option value="' + list[i].grpCd + '" max-cat-cd="' + list[i].maxCatCd + '">' + list[i].grpCd + '</option>');	
				}
				
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');	
			}
			
		},
		error : function(xhr) {
			if (xhr.status == 400) {
				location.href = '/expire.do';
			} else if (xhr.status == 403) {
				location.href = '/error.do';
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		}
	});
	
}

// Code selectbox option append
function selectCodeList(eleId, grpCd){
	
	$.ajax({
		type : 'POST',
		url : '/code/selectCodeList.json',
		data : {'grpCd' : grpCd},
		success : function(data) {
			
			if(data && data.hasOwnProperty("list")){
				
				var list = data.list;
				
				$("#" + eleId).empty();
				$("#" + eleId).append('<option value="">전체</option>');
				for(var i = 0 ; i < list.length ; i++){
					$("#" + eleId).append('<option value="' + list[i].cdId + '">' + list[i].dispNm + '</option>');	
				}
				
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');	
			}
			
		},
		error : function(xhr) {
			if (xhr.status == 400) {
				location.href = '/expire.do';
			} else if (xhr.status == 403) {
				location.href = '/error.do';
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		}
	});
	
}

// Summernote 이미지 업로드
function uploadSummernoteImageFile(file, editor) {
	var param = new FormData();
	param.append("file", file);
	$.ajax({
		data : param,
		type : "POST",
		url : "/comm/uploadSummernoteImageFile.json",
		contentType : false,
		processData : false,
		success : function(data) {
			
			if(data.responseCode == "success"){
				$(editor).summernote('insertImage', data.url);	
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');	
			}
			
		}
	});
}

// 첨부파일 목록 조회
function selectFileList(rkeyCd, rkeyId){
	$.ajax({
		type : 'POST',
		url : '/comm/selectFileList.json',
		data : {'rkeyCd' : rkeyCd, rkeyId : rkeyId},
		success : function(data) {
			
			if(data && data.hasOwnProperty("list")){
				
				var list = data.list;
				
				resetFileHTML();
				
				for(var i = 0; i < list.length; i++){
					addFileHTML((i+1), false);
					addFileViewHTML((i+1), list[i].fileNm, list[i].fileId);
				}
				
				if($("input:file[name=contentFile]").length < 5){
					addFileHTML($("input:file[name=contentFile]").length + 1, true);
				}
				
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');	
			}
			
		},
		error : function(xhr) {
			if (xhr.status == 400) {
				location.href = '/expire.do';
			} else if (xhr.status == 403) {
				location.href = '/error.do';
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		}
	});
}

// 파일 추가
function addFile(id){
	var maxSize = 20971520;
	var target = $("#" + id);
	var file = document.getElementById(id).files[0];
	
	if(file.size > maxSize){
		
		alert('첨부파일 사이즈는 20MB 이내로 등록 가능합니다.');
		target.val("");
		target.replaceWith(target.clone(true));
		
	} else if($("#fileViewHTML > li").length == 5){
		
		alert('첨부파일 최대 5개까지 업로드 가능합니다.');
		target.closest('div.from-area').remove();
		
	} else {
		
		target.closest('div.from-area').hide();
		addFileViewHTML($("input:file[name=contentFile]").length, file.name, '');
		
		if($("input:file[name=contentFile]").length < 5){
			addFileHTML($("input:file[name=contentFile]").length + 1, true);	
		}
		
	}
			
}


// 파일 HTML 추가
function addFileHTML(idx, display){
	
	var inputFileHTML = '';

	inputFileHTML += '	<div class="from-area">';	
	inputFileHTML += '		<span class="file-area">';
	inputFileHTML += ' 			<input type="file" name="contentFile" id="contentFile' + idx + '">';
	inputFileHTML += ' 		</span>';
	inputFileHTML += ' 	</div>';
	
	$("#fileViewHTML").before(inputFileHTML);
	
	if(!display){
		$("#contentFile"+ idx).closest('div.from-area').hide();
	}
	
}

// 파일 VIEW HTML 추가
function addFileViewHTML(idx, name, fileId){
	$("#fileViewHTML").append('<li><a href="javascript:void(0);">' + name + '</a><button type="button" class="delete" file-id="' + fileId + '" idx="' + idx + '" onclick="deleteFileHTML(this);"><span class="blind">삭제</span></button></li>');
}

// 파일 HTML 삭제
function deleteFileHTML(obj){
	
	var idx = Number($(obj).attr('idx')) - 1;
	if($(obj).attr('file-id')){
		$("#deleteFileId").val($("#deleteFileId").val() + '|' + $(obj).attr('file-id'));
	}
	
	$('#fileHTML div.from-area').eq(idx).remove();
	$("#fileViewHTML li").eq(idx).remove();
	
	$('#fileHTML div.from-area').each(function(index){
		$(this).find(':file').attr('id', 'contentFile' + ( index + 1 ));
	});
	
	$("#fileViewHTML li").each(function(index){
		$(this).find('button').attr('idx', ( index + 1 ));
	});
	
	var length = $('#fileHTML div.from-area').length;
	var cnt = 0;
	$('#fileHTML div.from-area').each(function(){
		if(!$(this).is(':visible')){
			cnt++;
		}
	});
	
	
	if(length == cnt && length < 5){
		addFileHTML(length + 1, true);
	}
	
}

// 파일 HTML 초기화
function resetFileHTML(){
	
	$('#fileHTML div.from-area').each(function(){
		$(this).remove();
	});
	
	$("#fileViewHTML").empty();
	
}

// 댓글 목록 조회
function selectReplyList(repId){
	
	$('#replyFrm')[0].reset();
	$("#rlyId").val("");
	
	resetFileHTML();
	addFileHTML(1, true);
	
	$.ajax({
		type : 'POST',
		url : '/comm/selectReplyList.json',
		data : {repId : repId},
		success : function(data) {

			if (data && data.hasOwnProperty("list")) {

				var list = data.list;
				
				$("#replyHTML").empty();
				
				if(list.length > 0){
					var html = '';
					
					html += '<ul>';
					
					for(var i = 0; i < list.length; i++){
						html += '<li>';
						html += '	<strong>' + (list[i].regGubun == 'A' ? '최고관리자' : '댓글') + '</strong><span>' + list[i].regDt + ' <em>' + list[i].regTime +'</em></span>';
						if(list[i].deleteYn == 'Y'){
							html += '	<button type="button" class="delete" onclick="deleteReply(\'' + list[i].rlyId + '\');"><span class="blind">삭제</span></button>';	
						}
						html += '	<p>' + list[i].rlyCtt + '</p>';
						
						var fileList = list[i].fileList;
						
						if(fileList.length > 0){
							html += '<ul class="file-list">';
							for(var j = 0; j < fileList.length; j++){
								html += '<li><a href="/comm/fileDownload.do?fileId=' + fileList[j].fileId + '">' + fileList[j].fileNm + '</a></li>';
							}
							html += '</ul>';
						}
						
						html += '</li>';
					}
					
					html += '</ul>';
					
					$("#replyHTML").append(html);
				} else {
					$("#replyHTML").append('<div class="no-result">접수된 비밀 댓글이 없습니다.</div>');
				}
				
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}

		},
		error : function(xhr) {
			if (xhr.status == 400) {
				location.href = '/expire.do';
			} else if (xhr.status == 403) {
				location.href = '/error.do';
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		}
	});
}

// 댓글 저장
function saveReply(){
	
	if($("#rlyCtt").val() == ""){
		alert("필수항목이 입력되지 않았습니다.");
		return;
	}
	
	var param = new FormData($("#replyFrm")[0]);
	
	if(confirm('댓글을 저장하시겠습니까?')){
		$.ajax({
			type : 'POST',
			url : '/comm/saveReply.json',
			data : param,
			contentType : false,
			processData : false,
			success : function(data) {

				if(data && data.hasOwnProperty("rtnCode")){
					
					if(data.rtnCode == "success"){
						
						alert('댓글이 저장되었습니다.');
						selectReplyList($('#repId').val());
						
					} else if(data.rtnCode == "fail"){
						alert(data.rtnMsg);
					} else {
						alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
					}
					
				} else {
					alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');	
				}

			},
			error : function(xhr) {
				if (xhr.status == 400) {
					location.href = '/expire.do';
				} else if (xhr.status == 403) {
					location.href = '/error.do';
				} else {
					alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
				}
			}
		});
	}
	
}

// 댓글 삭제
function deleteReply(rlyId){
	
	if(confirm('선택하신 댓글을 삭제하시겠습니까?')){
		
		$.ajax({
			type : 'POST',
			url : '/comm/deleteReply.json',
			data : {rlyId : rlyId},
			success : function(data) {

				if(data && data.hasOwnProperty("rtnCode")){
					
					if(data.rtnCode == "success"){
						
						alert("댓글을 삭제했습니다.");
						selectReplyList($('#repId').val());
						
					} else {
						alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
					}
					
				} else {
					alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');	
				}

			},
			error : function(xhr) {
				if (xhr.status == 400) {
					location.href = '/expire.do';
				} else if (xhr.status == 403) {
					location.href = '/error.do';
				} else {
					alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
				}
			}
		});	
	}
}

//=================================================================
//                      첨부 파일 제보관리 content 관련
//=================================================================

function addPrcFile(id){
	var maxSize = 20971520;
	var target = $("#" + id);
	var file = document.getElementById(id).files[0];
	
	if(file.size > maxSize){
		
		alert('첨부파일 사이즈는 20MB 이내로 등록 가능합니다.');
		target.val("");
		target.replaceWith(target.clone(true));
		
	} else if($("#prcContentViewHTML > li").length == 5){
		
		alert('첨부파일 최대 5개까지 업로드 가능합니다.');
		target.closest('div.from-area').remove();
		
	} else {
		
		target.closest('div.from-area').hide();
		addPrcFileViewHTML($("input:file[name=prcContentFile]").length, file.name, '');
		
		if($("input:file[name=prcContentFile]").length < 5){
			addPrcFileHTML($("input:file[name=prcContentFile]").length + 1, true);	
		}
		
	}
			
}

// 파일 VIEW HTML 추가
function addPrcFileViewHTML(idx, name, fileId){
	$("#prcContentViewHTML").append('<li><a href="javascript:void(0);">' + name + '</a><button type="button" class="delete" file-id="' + fileId + '" idx="' + idx + '" onclick="deletePrcFileHTML(this);"><span class="blind">삭제</span></button></li>');
}


// 파일 HTML 추가
function addPrcFileHTML(idx, display){
	
	var inputFileHTML = '';

	inputFileHTML += '	<div class="from-area">';	
	inputFileHTML += '		<span class="file-area">';
	inputFileHTML += ' 			<input type="file" name="prcContentFile" id="prcContentFile' + idx + '">';
	inputFileHTML += ' 		</span>';
	inputFileHTML += ' 	</div>';
	
	$("#prcContentViewHTML").before(inputFileHTML);
	
	if(!display){
		$("#prcContentFile"+ idx).closest('div.from-area').hide();
	}
	
}

// 파일 HTML 삭제
function deletePrcFileHTML(obj){
	
	var idx = Number($(obj).attr('idx')) - 1;
	if($(obj).attr('file-id')){
		$("#deletePrcFileId").val($("#deletePrcFileId").val() + '|' + $(obj).attr('file-id'));
	}
	
	$('#prcContentHTML div.from-area').eq(idx).remove();
	$("#prcContentViewHTML li").eq(idx).remove();
	
	$('#prcContentHTML div.from-area').each(function(index){
		$(this).find(':file').attr('id', 'prcContentFile' + ( index + 1 ));
	});
	
	$("#prcContentViewHTML li").each(function(index){
		$(this).find('button').attr('idx', ( index + 1 ));
	});
	
	var length = $('#prcContentHTML div.from-area').length;
	var cnt = 0;
	$('#prcContentHTML div.from-area').each(function(){
		if(!$(this).is(':visible')){
			cnt++;
		}
	});
	
	
	if(length == cnt && length < 5){
		addPrcFileHTML(length + 1, true);
	}
	
}


// 첨부파일 목록 조회
function selectPrcFileList(rkeyCd, rkeyId){
	$.ajax({
		type : 'POST',
		url : '/comm/selectFileList.json',
		data : {'rkeyCd' : rkeyCd, rkeyId : rkeyId},
		success : function(data) {
			
			if(data && data.hasOwnProperty("list")){
				
				var list = data.list;
				
				resetPrcFileHTML();
				
				for(var i = 0; i < list.length; i++){
					addPrcFileHTML((i+1), false);
					addPrcFileViewHTML((i+1), list[i].fileNm, list[i].fileId);
				}
				
				if($("input:file[name=prcContentFile]").length < 5){
					addPrcFileHTML($("input:file[name=prcContentFile]").length + 1, true);
				}
				
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');	
			}
			
		},
		error : function(xhr) {
			if (xhr.status == 400) {
				location.href = '/expire.do';
			} else if (xhr.status == 403) {
				location.href = '/error.do';
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		}
	});
}

// 파일 HTML 초기화
function resetPrcFileHTML(){
	
	$('#prcContentHTML div.from-area').each(function(){
		$(this).remove();
	});
	
	$("#prcContentViewHTML").empty();
	
}


//=================================================================
//                      반려 첨부파일 content 관련
//=================================================================

function addRejectFile(id){
	var maxSize = 20971520;
	var target = $("#" + id);
	var file = document.getElementById(id).files[0];
	
	if(file.size > maxSize){
		
		alert('첨부파일 사이즈는 20MB 이내로 등록 가능합니다.');
		target.val("");
		target.replaceWith(target.clone(true));
		
	} else if($("#prcContentViewHTML > li").length == 5){
		
		alert('첨부파일 최대 5개까지 업로드 가능합니다.');
		target.closest('div.from-area').remove();
		
	} else {
		
		target.closest('div.from-area').hide();
		addRejectFileViewHTML($("input:file[name=rejectContentFile]").length, file.name, '');
		
		if($("input:file[name=prcContentFile]").length < 5){
			addRejectFileHTML($("input:file[name=rejectContentFile]").length + 1, true);	
		}
		
	}
			
}

// 파일 VIEW HTML 추가
function addRejectFileViewHTML(idx, name, fileId){
	$("#rejectViewHTML").append('<li><a href="javascript:void(0);">' + name + '</a><button type="button" class="delete" file-id="' + fileId + '" idx="' + idx + '" onclick="deleteRejectFileHTML(this);"><span class="blind">삭제</span></button></li>');
}


// 파일 HTML 추가
function addRejectFileHTML(idx, display){
	
	var inputFileHTML = '';

	inputFileHTML += '	<div class="from-area">';	
	inputFileHTML += '		<span class="file-area">';
	inputFileHTML += ' 			<input type="file" name="rejectContentFile" id="rejectContentFile1' + idx + '">';
	inputFileHTML += ' 		</span>';
	inputFileHTML += ' 	</div>';
	
	$("#rejectViewHTML").before(inputFileHTML);
	
	if(!display){
		$("#rejectContentFile"+ idx).closest('div.from-area').hide();
	}
	
}

// 파일 HTML 삭제
function deleteRejectFileHTML(obj){
	
	var idx = Number($(obj).attr('idx')) - 1;
	if($(obj).attr('file-id')){
		$("#deleteRejectFileId").val($("#deleteRejectFileId").val() + '|' + $(obj).attr('file-id'));
	}
	
	$('#rejectHTML div.from-area').eq(idx).remove();
	$("#rejectViewHTML li").eq(idx).remove();
	
	$('#rejectHTML div.from-area').each(function(index){
		$(this).find(':file').attr('id', 'prcContentFile' + ( index + 1 ));
	});
	
	$("#rejectViewHTML li").each(function(index){
		$(this).find('button').attr('idx', ( index + 1 ));
	});
	
	var length = $('#rejectHTML div.from-area').length;
	var cnt = 0;
	$('#rejectHTML div.from-area').each(function(){
		if(!$(this).is(':visible')){
			cnt++;
		}
	});
	
	
	if(length == cnt && length < 5){
		addRejectFileHTML(length + 1, true);
	}
	
}


// 첨부파일 목록 조회
function selectRejectFileList(rkeyCd, rkeyId){
	$.ajax({
		type : 'POST',
		url : '/comm/selectFileList.json',
		data : {'rkeyCd' : rkeyCd, rkeyId : rkeyId},
		success : function(data) {
			
			if(data && data.hasOwnProperty("list")){
				
				var list = data.list;
				
				resetRejectFileHTML();
				
				for(var i = 0; i < list.length; i++){
					addRejectFileHTML((i+1), false);
					addRejectFileViewHTML((i+1), list[i].fileNm, list[i].fileId);
				}
				
				if($("input:file[name=rejectContentFile]").length < 5){
					addRejectFileHTML($("input:file[name=rejectContentFile]").length + 1, true);
				}
				
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');	
			}
			
		},
		error : function(xhr) {
			if (xhr.status == 400) {
				location.href = '/expire.do';
			} else if (xhr.status == 403) {
				location.href = '/error.do';
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		}
	});
}

// 파일 HTML 초기화
function resetRejectFileHTML(){
	
	$('#rejectHTML div.from-area').each(function(){
		$(this).remove();
	});
	
	$("#rejectViewHTML").empty();
	
}



//=================================================================
//                      제보 관리 댓글 파일 영역
//=================================================================

// 댓글 목록 조회
function selectReportReplyList(repId){
	
	$('#replyFrm')[0].reset();
	$("#rlyId").val("");
	
	resetReportReplyFileHTML();
	addReportReplyFileHTML(1, true);
	
	$.ajax({
		type : 'POST',
		url : '/comm/selectReplyList.json',
		data : {repId : repId},
		success : function(data) {

			if (data && data.hasOwnProperty("list")) {

				var list = data.list;
				
				$("#replyHTML").empty();
				
				if(list.length > 0){
					var html = '';
					
					html += '<ul>';
					
					for(var i = 0; i < list.length; i++){
						html += '<li>';
						html += '	<strong>' + (list[i].regGubun == 'A' ? '최고관리자' : '댓글') + '</strong><span>' + list[i].regDt + ' <em>' + list[i].regTime +'</em></span>';
						if(list[i].deleteYn == 'Y'){
							html += '	<button type="button" class="delete" onclick="deleteReply(\'' + list[i].rlyId + '\');"><span class="blind">삭제</span></button>';	
						}
						html += '	<p>' + list[i].rlyCtt + '</p>';
						
						var fileList = list[i].fileList;
						
						if(fileList.length > 0){
							html += '<ul class="file-list">';
							for(var j = 0; j < fileList.length; j++){
								html += '<li><a href="/comm/fileDownload.do?fileId=' + fileList[j].fileId + '">' + fileList[j].fileNm + '</a></li>';
							}
							html += '</ul>';
						}
						
						html += '</li>';
					}
					
					html += '</ul>';
					
					$("#replyHTML").append(html);
				} else {
					$("#replyHTML").append('<div class="no-result">접수된 비밀 댓글이 없습니다.</div>');
				}
				
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}

		},
		error : function(xhr) {
			if (xhr.status == 400) {
				location.href = '/expire.do';
			} else if (xhr.status == 403) {
				location.href = '/error.do';
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		}
	});
}

// 파일 추가
function addReportReplyFile(id){
	var maxSize = 20971520;
	var target = $("#" + id);
	var file = document.getElementById(id).files[0];
	
	if(file.size > maxSize){
		
		alert('첨부파일 사이즈는 20MB 이내로 등록 가능합니다.');
		target.val("");
		target.replaceWith(target.clone(true));
		
	} else if($("#fileReplyViewHTML > li").length == 5){
		
		alert('첨부파일 최대 5개까지 업로드 가능합니다.');
		target.closest('div.from-area').remove();
		
	} else {
		
		target.closest('div.from-area').hide();
		addReportReplyFileViewHTML($("input:file[name=contentFile]").length, file.name, '');
		
		if($("input:file[name=contentFile]").length < 5){
			addReportReplyFileHTML($("input:file[name=contentFile]").length + 1, true);	
		}
		
	}
			
}


function addReportReplyFileViewHTML(idx, name, fileId){
	$("#fileReplyViewHTML").append('<li><a href="javascript:void(0);">' + name + '</a><button type="button" class="delete" file-id="' + fileId + '" idx="' + idx + '" onclick="deleteReportReplyFileHTML(this);"><span class="blind">삭제</span></button></li>');
}

// 파일 HTML 추가
function addReportReplyFileHTML(idx, display){
	
	var inputFileHTML = '';

	inputFileHTML += '	<div class="from-area">';	
	inputFileHTML += '		<span class="file-area">';
	inputFileHTML += ' 			<input type="file" name="contentFile" id="contentFile' + idx + '">';
	inputFileHTML += ' 		</span>';
	inputFileHTML += ' 	</div>';
	
	$("#fileReplyViewHTML").before(inputFileHTML);
	
	if(!display){
		$("#contentFile"+ idx).closest('div.from-area').hide();
	}
	
}

// 파일 HTML 삭제
function deleteReportReplyFileHTML(obj){
	
	var idx = Number($(obj).attr('idx')) - 1;
	if($(obj).attr('file-id')){
		$("#deleteFileId").val($("#deleteFileId").val() + '|' + $(obj).attr('file-id'));
	}
	
	$('#fileReplyHTML div.from-area').eq(idx).remove();
	$("#fileReplyViewHTML li").eq(idx).remove();
	
	$('#fileReplyHTML div.from-area').each(function(index){
		$(this).find(':file').attr('id', 'contentFile' + ( index + 1 ));
	});
	
	$("#fileReplyViewHTML li").each(function(index){
		$(this).find('button').attr('idx', ( index + 1 ));
	});
	
	var length = $('#fileReplyHTML div.from-area').length;
	var cnt = 0;
	$('#fileReplyHTML div.from-area').each(function(){
		if(!$(this).is(':visible')){
			cnt++;
		}
	});
	
	
	if(length == cnt && length < 5){
		addReportReplyFileHTML(length + 1, true);
	}
	
}

// 파일 HTML 초기화
function resetReportReplyFileHTML(){
	
	$('#fileReplyHTML div.from-area').each(function(){
		$(this).remove();
	});
	
	$("#fileReplyViewHTML").empty();
	
}

//메모 조회
function selectAdminMemoList(repId){
	
	$.ajax({
		type : 'POST',
		url : '/comm/selectAdminMemoList.json',
		data : {repId : repId},
		success : function(data) {

			if (data && data.hasOwnProperty("list")) {

				var list = data.list;
				
				$("#memoHTML").empty();
				
				if(list.length > 0){
					var html = '';

					for(var i = 0; i < list.length; i++){
						
						html += '<li>';
						html += '	<button onclick="deleteMemo(\'' + list[i].memoId + '\');"><span class="blind">삭제</span></button>';
						html += '	<span>'+list[i].authName+'</span>';
						html += '	<span>'+list[i].regDt+' <em>'+list[i].regTm+'</em></span>';
						html += '	<span>'+list[i].integMsg+'</span>';
						html += '</li>';
					}
					
					$("#memoHTML").append(html);
				} else {
					
				}
				
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}

		},
		error : function(xhr) {
			if (xhr.status == 400) {
				location.href = '/expire.do';
			} else if (xhr.status == 403) {
				location.href = '/error.do';
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		}
	});
}

// 메모 저장
function saveAdmMemo(){
	
	if($("#integMsg").val() == ""){
		alert("필수항목이 입력되지 않았습니다.");
		return;
	}
	
	var param = new FormData($("#memoFrm")[0]);
	
	if(confirm('메모를 저장하시겠습니까?')){
		$.ajax({
			type : 'POST',
			url : '/comm/saveAdmMemo.json',
			data : param,
			contentType : false,
			processData : false,
			success : function(data) {

				if(data && data.hasOwnProperty("rtnCode")){
					
					if(data.rtnCode == "success"){
						alert('메모가 저장되었습니다.');
						selectAdminMemoList($('#repId').val());
						$('#memoFrm')[0].reset();
					} else if(data.rtnCode == "fail"){
						alert(data.rtnMsg);
					} else {
						alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
					}
					
				} else {
					alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');	
				}

			},
			error : function(xhr) {
				if (xhr.status == 400) {
					location.href = '/expire.do';
				} else if (xhr.status == 403) {
					location.href = '/error.do';
				} else {
					alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
				}
			}
		});
	}
	
}

//메모 삭제
function deleteMemo(memoId){
	
	if(confirm('선택하신 메모를 삭제하시겠습니까?')){
		
		$.ajax({
			type : 'POST',
			url : '/comm/deleteAdmMemo.json',
			data : {memoId : memoId},
			success : function(data) {

				if(data && data.hasOwnProperty("rtnCode")){
					
					if(data.rtnCode == "success"){
						alert("메모를 삭제했습니다.");
						selectAdminMemoList($('#repId').val());
					} else if (data.rtnCode == "failAuth"){
						alert('본인이 등록한 메모가 아닙니다.');
					} else {
						alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
					}
					
				} else {
					alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');	
				}

			},
			error : function(xhr) {
				if (xhr.status == 400) {
					location.href = '/expire.do';
				} else if (xhr.status == 403) {
					location.href = '/error.do';
				} else {
					alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
				}
			}
		});	
	}
}