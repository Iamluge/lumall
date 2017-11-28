<html xmlns="http://www.w3.org/1999/xhtml">
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%> <!-- 导入struts2的标签库 -->
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<script src="js/image.js" type="text/javascript"></script>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />


<c:if test="${!empty resourceUrlList}">
<div class="text-list">
		<c:forEach items="${resourceUrlList}" var="res">
		<div class="text-content"></div>
		<ht>${res.title}</ht><br>
		<hc>${res.description}</hc>
		</div>
		</c:forEach>
</div>
</c:if>
<c:if test="${empty resourceUrlList}">
	<h1 colspan="5">没有找到相应的记录</h1>
</c:if>
</html>