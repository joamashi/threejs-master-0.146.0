
var ajaxCheck = false; 

$.ajaxSetup({	
	beforeSend:function(xhr, setting){		
		if(setting.url.indexOf("/insert") > -1 || setting.url.indexOf("/update") > -1){			
			ajaxCheck = true;
			myFunc.loader.open();
		}		
	},
	complete:function(xhr,status){
		if(ajaxCheck || $('.loader').addClass('show')){
			myFunc.loader.close();
			ajaxCheck = false;	
		}		
				
	}
});

var message = {};

function fnMessageSetting(msgObj){
	message = msgObj;
}

/*
 * 개인정보 처리방침 팝업 
 */
function fnPolicyPop(param, type){
	
	$.ajax({
		type : 'POST',
		url : '/popup/policyPopup.do',
		data : {type:type},
		success : function(data) {
			if(typeof data == "string"){
				$('.modal').empty();
				$('.modal').attr('id', 'policyPopHtml');
				$('.modal').html(data);
				myFunc.modal(param).open();
			} else {
				alert(message['error_msg']);
			}
		},
		error : function(xhr) {
			if (xhr.status == 400) {
				location.href = '/error.do';
			} else {
				alert(message['error_msg']);
			}

		}
	});
}

/*
 * 계열사 전체 보기 팝업 
 */ 
function fnCompanyPop(param, busCd){
	
	$.ajax({
		type : 'POST',
		url : '/popup/companyPopup.do',
		data : {},
		success : function(data) {
			if(typeof data == "string"){
				$('.modal').empty();
				$('.modal').attr('id', 'companyPopHtml');
				$('.modal').html(data);
				
				$(".modal #busCd").val(busCd);
				myFunc.modal('companyPopHtml').open();
			} else {
				alert(message['error_msg']);
			}
		},
		error : function(xhr) {
			if (xhr.status == 400) {
				location.href = '/error.do';
			} else {
				alert(message['error_msg']);
			}

		}
	});
} 

/*
 * 계열사 바로가기 팝업 
 */  
/*function fnblankPop(param, ref){
	$.ajax({
		type : 'POST',
		url : '/popup/blankPopup.do',
		data : {},
		success : function(data) {
			if(typeof data == "string"){
				$('.modal').empty();
				$('.modal').attr('id', 'blankPopHtml');
				$('.modal').html(data);
				myFunc.modal.open('blankPopHtml');
				//$("#btnBlankClose").attr("onclick", "window.open('"+ref+"')");
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		},
		error : function(xhr) {
			if (xhr.status == 400) {
				location.href = '/error.do';
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}

		}
	});
} */

/*function fnBlankPop(param, ){
	$.ajax({
		type : 'POST',
		url : '/popup/blankPopup.do',
		contentType : "application/json",
		data : JSON.stringify(param),
		success : function(data) {
			if(typeof data == "string"){
				$('.modal').empty();
				$('.modal').attr('id', 'blankPopHtml');
				$('.modal').html(data);
				myFunc.modal(param).open();
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}
		},
		error : function(xhr) {
			if (xhr.status == 400) {
				location.href = '/error.do';
			} else {
				alert('오류가 발생하였습니다. 관리자에게 문의하여주십시오.');
			}

		}
	});
}*/

function setLang(){
	
}

function selectFileList(rkeyCd, rkeyId){
	$.ajax({
		type : 'POST',
		url : '/file/selectFile.json',
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
				alert(message['error_msg']);	
			}
			
		},
		error : function(xhr) {
			if(xhr.status == 400){
				location.href = '/error.do';
			} else {
				alert(message['error_msg']);
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
		alert(message['file_msg_07']);
		target.val("");
		target.replaceWith(target.clone(true));
		
	} else if($("#fileViewHTML button").closest('span').length == 5){
		
		alert(message['file_msg_01']);
		target.closest('li').remove();
		
	} else {
		
		target.closest('li').hide();
		addFileViewHTML($("input:file[name=contentFile]").length, file.name, '');
		
		if($("input:file[name=contentFile]").length < 5){
			addFileHTML($("input:file[name=contentFile]").length + 1, true);	
		}
		
	}
			
}

// 파일 HTML 추가
function addFileHTML(idx, display){
	
	var inputFileHTML = '';
	
	inputFileHTML += '	<li id="fileHTML' + idx + '">';
	inputFileHTML += '		<label for="file' + idx + '">' + message['label_file'] + '</label>';
	//inputFileHTML += '		<label for="file' + idx + '">' + '<c:out value=\"<spring:message code=\"label_file\" /> \"/></label>';
	inputFileHTML += '		<div class="input-box-area">';
	inputFileHTML += '			<div class="filebox">';
	inputFileHTML += '				<input class="upload-name" id="file' + idx + '" placeholder="'+message['label_file']+'">';
	inputFileHTML += '				<input type="file" name="contentFile" id="contentFile' + idx + '">';
	inputFileHTML += '				<label for="contentFile' + idx + '">'+message['label_file_find']+'</label> ';
	inputFileHTML += '			</div>';
	inputFileHTML += '		</div>';
	inputFileHTML += '	</li>';
	$("#fileViewHTML").before(inputFileHTML);
	
	if(!display){
		$("#contentFile"+ idx).closest('li').hide();
	}
	
}




// 파일 VIEW HTML 추가
function addFileViewHTML(idx, name, fileId){
	$("#fileViewHTML").append('<span><em><a href="/file/fileDownload.do?fileId=' + fileId + '">' + name + '</a></em><button type="button" class="delete" file-id="' + fileId + '" idx="' + idx + '" onclick="deleteFileHTML(this);"><span class="blind">'+message['label_delete']+'</span></button></span>');
}


// 파일 HTML 삭제
function deleteFileHTML(obj){
	
	var idx = Number($(obj).attr('idx'));
	if($(obj).attr('file-id')){
		$("#deleteFileId").val($("#deleteFileId").val() + '|' + $(obj).attr('file-id'));
	}
	
	$('#fileHTML' + idx).remove();
	$("#fileViewHTML button").closest('span').eq(idx - 1).remove();
	
	$('li[id*=fileHTML]').each(function(index){
		$(this).attr('id', 'fileHTML' + (index + 1));
		$(this).find('label').attr('for', 'file' + (index + 1));
		$(this).find('.upload-name').attr('id', 'file' + (index + 1));
		$(this).find(':file').attr('id', 'contentFile' + ( index + 1 ));
		$(this).find('div.filebox').find('label').attr('for', 'contentFile' + ( index + 1 ));
	});
	
	$("#fileViewHTML button").closest('span').each(function(index){
		$(this).find('button').attr('idx', ( index + 1 ));
	});
	
	var length = $('li[id*=fileHTML]').length;
	var cnt = 0;
	$('li[id*=fileHTML]').each(function(){
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
	
	$('li[id*=fileHTML]').each(function(){
		$(this).remove();
	});
	
	$("#fileViewHTML").empty();
	
}

/**
* 숫자만 입력
*
* @param el : tag jquery object
* @returns {Number}

*/
function onlyNumber(event){
    event = event || window.event;
    var keyID = (event.which) ? event.which : event.keyCode;
    if ( (keyID >= 48 && keyID <= 57) || (keyID >= 96 && keyID <= 105) || keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39 )
        return;
    else
        return false;
} 


//----------------------------------------
// HTML ESCAPE 문자열 치환
//----------------------------------------
function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/\"/g, "&quot;").replace(/\//g, "&#47;");
};


function unescapeHtml(str){
    return str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#47;/g, "\/");
};


//----------------------------------------
//HTML ESCAPE 문자열 치환
// 암호화된 문자중  + & 넘어가지 않는 문제로 인해 추가
//----------------------------------------
function replaceHtml(url) {
    url= url.replace(/&/g,"%26");
    url= url.replace(/\+/g,"%2B");
    return url;
}

//----------------------------------------
// 브라우저 확인작업
//----------------------------------------
function fn_browserCheck() {
    if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) //IF IE > 10
    {
        return "ie";
    }
    else if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 )
    {
        return "opera";
    }
    else if(navigator.userAgent.indexOf("Chrome") != -1 )
    {
        return 'chrome';
    }
    else if(navigator.userAgent.indexOf("Safari") != -1)
    {
        return 'safari';
    }
    else if(navigator.userAgent.indexOf("Firefox") != -1 )
    {
        return 'firefox';
    }
    else
    {
        return 'unknown';
    }
}


//----------------------------------------
// ie 브라우저 여부
//----------------------------------------
function fn_isIE(){
    if( "ie" == fn_browserCheck() ){
        return true;
    }
    return false;

}

//form init 
$.fn.clearForm = function() {
  return this.each(function() {
    var type = this.type,
      tag = this.tagName.toLowerCase()
    if (tag === "form") {
      return $(":input", this).clearForm()
    }
    if (
      type === "text" ||
      type === "password" ||
      type === "hidden" ||
      tag === "textarea"
    ) {
      this.value = ""
    } else if (type === "checkbox" || type === "radio") {
      this.checked = false
    } else if (tag === "select") {
      this.selectedIndex = 0
    }
  })
} 

// 문자열 타입에서 금액 Comma 생성
String.prototype.toComma = function() {
    var n = String(this).replace(/\,/g, "");
    return n.match(RegExp("^[0-9]{"+(n.length%3||3)+"}|[0-9]{3}","g"));
}

//숫자 타입에서 쓸 수 있도록 format() 함수 추가
Number.prototype.format = function(){
    if(this==0) return 0;

    var reg = /(^[+-]?\d+)(\d{3})/;
    var n = (this + '');

    while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');

    return n;
};

function setCookie(cookie_name, value, days) {
	 var exdate = new Date(); 
	 exdate.setDate(exdate.getDate() + days); 
	 // 설정 일수만큼 현재시간에 만료값으로 지정 
	 var cookie_value = escape(value) + ((days == null) ? '' : '; path=/; expires=' + exdate.toUTCString()); 
	 
	 document.cookie = cookie_name + '=' + cookie_value; 
}


function getCookie(name) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? unescape(value[2]) : null;
}



function selectResultFileList(rkeyCd, rkeyId){
	$.ajax({
		type : 'POST',
		url : '/file/selectFile.json',
		data : {rkeyCd : rkeyCd, rkeyId : rkeyId},
		success : function(data) {
			
			if(data && data.hasOwnProperty("list")){
				
				var list = data.list;
				
				for(var i = 0; i < list.length; i++){
					addFileViewResultHTML(list[i].fileNo, list[i].fileNm, list[i].fileId);
				}
				
			} else {
				alert(message['error_msg']);	
			}
			
		},
		error : function(xhr) {
			if(xhr.status == 400){
				location.href = '/error.do';
			} else {
				alert(message['error_msg']);
			}
			
		}
	});
} 

function selectReplyList(repId, reqMemId){
	
	//$('#replyFrm')[0].reset();
	//$("#rlyId").val("");
	
	resetFileResultHTML();
	addFileResultHTML(1, true);
	
	$.ajax({
		type : 'POST',
		url : '/comm/selectReplyList.json',
		data : {
			repId : repId
		   ,reqMemId : reqMemId
		},
		success : function(data) {

			if (data && data.hasOwnProperty("list")) {

				var list = data.list;
				
				$("#replyHTML").empty();
				
				if(list.length > 0){
					var html = '';
					html += '<h4>'+message['label_comment']+'</h4>';
					html += '<ul>';
					
					
					for(var i = 0; i < list.length; i++){
						html += '<li>';
						html += '<span><strong '+ (list[i].regGubun == 'A' ? 'class="manager"' : '') + '>' + (list[i].regGubun == 'A' ? message['label_person']  : message['label_informant'] ) + '</strong><em>' + list[i].regDt + '</em> <em>' + list[i].regTime +'</em>';
						
						
						var fileList = list[i].fileList;
						html += '<div class="file-area">';
						if(fileList.length > 0){
							html += '<button class="file"><span class="blind">'+ message['label_file'] +'</span></button>';
							html += '<div class="file-list-area">';
							for(var j = 0; j < fileList.length; j++){
								html += '<a href="/file/fileDownload.do?fileId=' + fileList[j].fileId + '">' + fileList[j].fileNm + '</a>';
							}
							html += '</div>';
						}
						html += '</div>';
						
						
						if(list[i].deleteYn == 'Y'){
							html += '	<button type="button" onclick="deleteReply(\'' + list[i].rlyId + '\');"><span class="blind">'+message['label_delete']+'</span></button>';	
						}
						html += '</span>';
						html += '	<p>' + list[i].rlyCtt + '</p>';
						
						html += '</li>';
					}
					
					html += '</ul>';
					
					$("#replyHTML").append(html);
				} else {
					$("#replyHTML").append('<div class="no-result">'+message['label_reply_comment']+'</div>');
				}
				
				myFunc.getRePaint();
				
			} else {
				alert(message['error_msg']);
			}

		},
		error : function(xhr) {
			if (xhr.status == 400) {
				location.href = '/error.do';
			} else {
				alert(message['error_msg']);
			}

		}
	});
}

// 댓글 저장
function saveReply(){
	
	if($("#rlyCtt").val() == ""){
		alert(message['file_msg_04']);
		return;
	}
	
	var param = new FormData($("#replyFrm")[0]);
	
	if(confirm(message['file_msg_05'])){
		
		$.ajax({
			type : 'POST',
			url : '/comm/saveReply.json',
			data : param,
			contentType : false,
			processData : false,
			success : function(data) {

				if(data && data.hasOwnProperty("rtnCode")){
					
					if(data.rtnCode == "success"){
						
						alert(message['file_msg_06']);
						selectReplyList($('#repId').val());
						
					} else if(data.rtnCode == "fail"){
						alert(data.rtnMsg);
					} else {
						alert(message['error_msg']);
					}
					
				} else {
					alert(message['error_msg']);	
				}

			},
			error : function(xhr) {
				if (xhr.status == 400) {
					location.href = '/error.do';
				} else {
					alert(message['error_msg']);
				}

			}
		});
	}
	
}

// 댓글 삭제
function deleteReply(rlyId){
	
	if(confirm(message['file_msg_02'])){
		
		
		$.ajax({
			type : 'POST',
			url : '/comm/deleteReply.json',
			data : {rlyId : rlyId},
			success : function(data) {

				if(data && data.hasOwnProperty("rtnCode")){
					
					if(data.rtnCode == "success"){
						
						alert(message['file_msg_03']);
						selectReplyList($('#repId').val());
						
					} else {
						alert(message['error_msg']);
					}
					
				} else {
					alert(message['error_msg']);	
				}

			},
			error : function(xhr) {
				if (xhr.status == 400) {
					location.href = '/error.do';
				} else {
					alert(message['error_msg']);
				}

			}
		});	
	}
}


// 파일 추가
function addResultFile(id){
	var maxSize = 20971520;
	var target = $("#" + id);
	var file = document.getElementById(id).files[0];
	
	if(file.size > maxSize){
		
		alert(message['file_msg_07']);
		target.val("");
		target.replaceWith(target.clone(true));
		
	} else if($(".file-list").closest('span').length == 5){
		
		alert(message['file_msg_01']);
		target.closest('div').remove();
		
	} else {
		
		target.closest('div').hide();
		addFileViewReplyHTML($("input:file[name=contentFile]").length, file.name, '');
		
		if($("input:file[name=contentFile]").length < 5){
			addFileResultHTML($("input:file[name=contentFile]").length + 1, true);	
		}
	}
			
}

// 파일 VIEW HTML 추가
function addFileViewResultHTML(idx, name, fileId){
	$("#resultFileViewHTML").append(name + '<br>');
}

function addFileViewReplyHTML(idx, name, fileId){
	$("#fileViewHTML").append(name +'<br>');
}

// 파일 HTML 추가
function addFileResultHTML(idx, display){
	
	var inputFileHTML = '';
	
	inputFileHTML += '<div class="filebox" id="fileHTML'+idx+'">';
	inputFileHTML += '	<input type="file" name="contentFile" id="contentFile' + idx + '">';
	inputFileHTML += '	<label for="contentFile'+ idx + '"><span class="blind">'+message['label_file_find']+'</span><em>'+message['file_msg_07']+'</em></label>';
	inputFileHTML += '	<button type="button" class="btn-type-4" onclick="saveReply();">'+message['label_save']+'</button>';
	inputFileHTML += '</div>';
	$("#fileViewHTML").after(inputFileHTML);
	
	if(!display){
		$("#contentFile"+ idx).closest('div').hide();
	}
	
}

// 파일 HTML 삭제
function deleteResultFileHTML(obj){
	
	var idx = Number($(obj).attr('idx'));
	if($(obj).attr('file-id')){
		$("#deleteFileId").val($("#deleteFileId").val() + '|' + $(obj).attr('file-id'));
	}
	
	$('#fileHTML' + idx).remove();
	$("#fileViewHTML button").closest('span').eq(idx - 1).remove();
	
	$('[id*=fileHTML]').each(function(index){
		$(this).attr('id', 'fileHTML' + (index + 1));
		$(this).find('label').attr('for', 'contentFile' + (index + 1));
		$(this).find('.upload-name').attr('id', 'file' + (index + 1));
		$(this).find(':file').attr('id', 'contentFile' + ( index + 1 ));
		$(this).find('div.filebox').find('label').attr('for', 'contentFile' + ( index + 1 ));
	});
	
	$("#fileViewHTML button").closest('span').each(function(index){
		$(this).find('button').attr('idx', ( index + 1 ));
	});
	
	var length = $('[id*=fileHTML]').length;
	var cnt = 0;
	$('[id*=fileHTML]').each(function(){
		if(!$(this).is(':visible')){
			cnt++;
		}
	});
	
	
	if(length == cnt && length < 5){
		addFileResultHTML(length + 1, true);
	}

}

function resetFileResultHTML(){
	
	$('[id*=fileHTML]').each(function(){
		$(this).remove();
	});
	
	$(".file-list").empty();
	
}

function phoneCheck(text) {
	var regPhone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
	return regPhone.test(text);
}

function emailCheck(text) {
	var regEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
	return regEmail.test(text);
}