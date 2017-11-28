<html xmlns="http://www.w3.org/1999/xhtml">
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%> <!-- 导入struts2的标签库 -->
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<script src="js/image.js" type="text/javascript"></script>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<style type="text/css">
<!--



</style>

</head>

<body>
<c:if test="${!empty proInfoTemValues}">
		<c:forEach items="${proInfoTemValues}" var="proTem" varStatus="pstatus">
<br>
 <div style="overflow: auto; width: 100%;">
<table width="90%" id="mytab"  border="1" class="t1">
  <thead>
		    <h4>${proTem.proInfoTemplate.templateName}</h4>
			<tr class="tr-title">
			<c:forEach items="${proTem.proInfoIndexs}" var="proIndex">
				<td>${proIndex.indexName}</td>
			</c:forEach>
			</tr>
			
  </thead>
	<c:forEach items="${proTem.indexValues}" var="value" varStatus="vstatus">
			<tr class="al" id="tr${proTem.id}${pstatus.index}${vstatus.index}">
			  	<script type=text/javascript>
				    var jsons = ${value.value};
					var indexCount = ${proTem.indexConut};
					var content = "";
					for(i=0;i<indexCount;i++){
					 content = content + '<td>'+eval('jsons.index'+i)+'</td>';
					}
			       jQuery(function($) {$(document).ready(function() {
						$("#tr${proTem.id}${pstatus.index}${vstatus.index}").append(
							content
						);
					});});
		       </script>
			  </tr>
	</c:forEach>
</table>
</div>
		</c:forEach>
</c:if>

<c:if test="${empty proInfoTemValues}">
	<h1 colspan="5">没有找到相应的记录</h1>
</c:if>
</body>
</html>