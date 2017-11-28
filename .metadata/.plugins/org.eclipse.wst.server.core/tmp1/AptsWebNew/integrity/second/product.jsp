<%@page import="org.apache.struts2.components.Include"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="../integrity/style.css" />
<link rel="stylesheet" type="text/css" href="../integrity/style2.css" />
<link rel="stylesheet" type="text/css" href="../integrity/responsive.css" />

<script src="../integrity/js/jquery-1.8.2.min.js" type="text/javascript"></script>
<script src="../js/script.js" type="text/javascript"></script>
<script src="../integrity/js/jquery.js" type=text/javascript></script>
<script src="../integrity/js/jquery.cross-slide.js" type=text/javascript></script>
<script src="../integrity/js/indexFunction2.js" type="text/javascript"></script>
<title>产品列表</title>
<body>
<div style="width:80%;height:5px;margin:0px auto;padding:0px;background-color:#D4D4D4;"></div>
<div id="jianjie">
	<!-- 公司简介头部 -->
	<div id="jianjieLogo">
		<div id="jianjieLogoText">
		<div id="jianjieLogoText1">&nbsp&nbsp&nbsp产品列表</div>
		</div>
	</div>
	<div class="top"  style="width:1000px;margin:0 auto;height:100px;margin-top:20px;border-top:1px solid #ddd">
	<!-- 内容 -->
	<div id="jianjieInfo">
	<div class="main-bg">
		<div class="container">
			<div class="main-wrp">
				<div >
					<div class="product-grids">
						<div class="bloder-content">
							<%
							List<String> list=(List<String>)request.getAttribute("picList");
							%>
							
						 	<% for(String s:list){%>
							<div class="product-grid">
								<div id="productImage">
								<img src="http://localhost:8080/file/<%=s%>" alt="" />
								</div>
								<div id="productTest">产品图片展览</div>
							</div>
							<%}%>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	</div>
	</div>
	</div>
</body>
</html>