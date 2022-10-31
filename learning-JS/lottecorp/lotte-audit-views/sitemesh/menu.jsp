<%@ page language="java" contentType="text/html; charset=UTF-8"   pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jsp"%>

<c:set var="URL" value="${pageContext.request.requestURI}" />

<ul class="tab-menu">
	<li <c:if test="${fn:indexOf(URL, '/report/guide') > -1}">class="active"</c:if>>
		<a href="/report/guide.do"><spring:message code="guide-tt-01"/></a>
		<div>
			<ul>
				<li <c:if test="${fn:indexOf(URL, '/report/guide.do') > -1}">class="active"</c:if>><a href="/report/guide.do"><spring:message code="guide-tt-02"/></a></li>
				<li <c:if test="${fn:indexOf(URL, '/report/guide.do#tab-2') > -1}">class="active"</c:if>><a href="/report/guide.do#tab-2"><spring:message code="guide-tt-03"/></a></li>
				<li <c:if test="${fn:indexOf(URL, '/report/guide.do#tab-3') > -1}">class="active"</c:if>><a href="/report/guide.do#tab-3"><spring:message code="guide-tt-04"/></a></li>
			</ul>
		</div>
	</li>
	<li <c:if test="${fn:indexOf(URL, '/report/anonymous') > -1 || fn:indexOf(URL, '/report/real') > -1 || fn:indexOf(URL, '/report/reportEtc') > -1 || fn:indexOf(URL, '/report/reportComplete') > -1}">class="active"</c:if>>
		<a href="/report/real/write.do"><spring:message code="label_h2" /></a>
		<div>
			<ul>
				<li <c:if test="${fn:indexOf(URL, '/report/real') > -1}">class="active"</c:if>><a href="/report/real/write.do"><spring:message code="label_tab_real" /></a></li>
				<li <c:if test="${fn:indexOf(URL, '/report/anonymous') > -1}">class="active"</c:if>><a href="/report/anonymous/write.do"><spring:message code="label_tab_anaymous" /></a></li>
				<li <c:if test="${fn:indexOf(URL, '/report/reportEtc') > -1}">class="active"</c:if>><a href="/report/reportEtc.do"><spring:message code="etc-content" /></a></li>
			</ul>
		</div>
	</li>
	<li <c:if test="${fn:indexOf(URL, '/report/reportConfirm') > -1 || fn:indexOf(URL, '/report/reportResult') > -1}">class="active"</c:if>>
		<a href="/report/reportConfirm.do"><spring:message code="confirm-tt-01"/></a>
	</li>
</ul>