<html xmlns="http://www.w3.org/1999/xhtml">
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%> <!-- 导入struts2的标签库 -->
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<script src="../js/image.js" type="text/javascript"></script>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<style type="text/css">
.image{ width:96px; height:72px;}
.image:hover{clear:both;width:300px; height:300px;
padding:96px -100px;align:center;position:absolute;}
.image ht:hover{clear:both;width:300px; height:300px;
padding:96px -100px;align:center;position:absolute;}
</style>

<c:if test="${!empty resourceUrlList}">
<div class="blk_18">
	<a class="LeftBotton" onMouseDown="ISL_GoUp_1()"
		onmouseup="ISL_StopUp_1()" onMouseOut="ISL_StopUp_1()"
		href="javascript:void(0);" target="_self"></a>
	<div class="pcont" id="ISL_Cont_1">
		<div class="ScrCont">
			<div id="List1_1">
				<c:forEach items="${resourceUrlList}" var="res">
				
						<a class="pl" href="http://localhost:8080/file/${res.urlContext}" target="_blank"><img class="image"
							src="http://localhost:8080/file/${res.urlContext}"  alt="加载中.."
							width="96" height="72" />${res.description}</a>

			
				</c:forEach>
			</div>
			<div id="List2_1"></div>
		</div>
	</div>
	<a class="RightBotton" onMouseDown="ISL_GoDown_1()"
		onmouseup="ISL_StopDown_1()" onMouseOut="ISL_StopDown_1()"
		href="javascript:void(0);" target="_self"></a>
</div>
<div class="c"></div>
</c:if>
		<c:if test="${empty resourceUrlList}">
				<h1 colspan="5">
					没有找到相应的记录
				</h1>
</c:if>
</html>