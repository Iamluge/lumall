<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<link rel="stylesheet" type="text/css" href="../integrity/style.css" />


<script src="../jquery/jquery-1.9.1.min.js" type="text/javascript"></script>
<script src="../js/script.js" type="text/javascript"></script>
<script src="../js/indexFunction.js" type="text/javascript"></script>
<script language="javascript">
	$(document).ready(
			function() {

				/* 	完整版示例	*/

				// 把每个a中的内容包含到一个层（span.out）中，在span.out层后面追加背景图层（span.bg）
				$("#menu li a").wrapInner('<span class="out"></span>').append(
						'<span class="bg"></span>');

				// 循环为菜单的a每个添加一个层（span.over）
				$("#menu li a").each(
						function() {
							$(
									'<span class="over">' + $(this).text()
											+ '</span>').appendTo(this);
						});

				$("#menu li a").hover(function() {
					// 鼠标经过时候被触发的函数
					$(".out", this).stop().animate({
						'top' : '45px'
					}, 250); // 向下滑动 - 隐藏
					$(".over", this).stop().animate({
						'top' : '0px'
					}, 250); // 向下滑动 - 显示
					$(".bg", this).stop().animate({
						'top' : '0px'
					}, 120); // 向下滑动 - 显示

				}, function() {
					// 鼠标移出时候被触发的函数
					$(".out", this).stop().animate({
						'top' : '0px'
					}, 250); // 向上滑动 - 显示
					$(".over", this).stop().animate({
						'top' : '-45px'
					}, 250); // 向上滑动 - 隐藏
					$(".bg", this).stop().animate({
						'top' : '-45px'
					}, 120); // 向上滑动 - 隐藏
				});

			});
</script>
</head>
<body style="margin:0;">

	<div id="header">
		<!-- 头部 -->
	    <div id="header1" style="background-repeat: no-repeat, repeat-x;">
	    	<img src="http://localhost:8080/file/${company.headImage}" width="100%" height="100%">
	    </div>
	    <div style="width:100%;height:5px;margin:0px auto;padding:0px;background-color:#D4D4D4;"></div>
	    <!-- 菜单 -->
	    <div id="header2" align="left">
		   <!--  <div id="header2Test">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="" target="main"></a><font size="5">首页&nbsp;</font></div>
		    <div id="header2Test"><a href="introduction.action" target="main"><font size="5">企业简介&nbsp;</font></a></div>
		    <div id="header2Test"><font size="5">产品&nbsp;</font></div>
		    <div id="header2Test"><font size="5">企业诚信承诺&nbsp;</font></div>
		    <div id="header2Test"><font size="5">产品溯源</font></div> -->
		    <div class="main-menu">
		    <div id="menu" class="menu">
				<ul>
					<li><a href="../index/main.action" target="main">首页</a></li>
					<li><a href="../index/introduction.action" target="main">企业简介</a></li>
					<li><a href="../index/product.action" target="main">产品</a></li>
					<li><a href="../index/commitment.action" target="main">企业诚信承诺</a></li>
					<li><a href="../index/traceability.action" target="main">产品溯源</a></li>
				</ul>
			</div>
			</div>
			
	    </div>
	    
	</div>

</body>
</html>