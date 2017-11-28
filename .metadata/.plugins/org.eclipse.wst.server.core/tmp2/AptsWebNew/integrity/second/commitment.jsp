<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="../integrity/style.css" />
<link rel="stylesheet" type="text/css" href="../integrity/style2.css" />
<title>Insert title here</title>
</head>
<body >
<div style="width:80%;height:5px;margin:0px auto;padding:0px;background-color:#D4D4D4;"></div>
<div id="jianjie">
	<!-- 公司简介头部 -->
	<div id="jianjieLogo">
		<div id="jianjieLogoText">
		<div id="jianjieLogoText1">&nbsp&nbsp&nbsp企业承诺</div>
		</div>
	</div>
	<div class="top"  style="width:1000px;margin:0 auto;height:100px;margin-top:20px;border-top:1px solid #ddd">
	<!-- 内容 -->
	<div id="jianjieInfo">
	<br>
					${company.commitment}			
	</div>
	
</div>
</body>
</html>