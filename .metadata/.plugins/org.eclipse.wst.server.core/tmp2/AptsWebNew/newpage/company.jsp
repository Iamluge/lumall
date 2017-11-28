<%@ page language="java" contentType="text/html; charset=UTF-8"
	import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ page isELIgnored="false"%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0" />
<title>${company.companyName }首页</title>

<!--=== CSS ===-->

<!-- Bootstrap -->
<link href="../melon/bootstrap/css/bootstrap.min.css" rel="stylesheet"
	type="text/css" />

<!-- jQuery UI -->
<!--<link href="../melon/plugins/jquery-ui/jquery-ui-1.10.2.custom.css" rel="stylesheet" type="text/css" />-->
<!--[if lt IE 9]>
		<link rel="stylesheet" type="text/css" href="../melon/plugins/jquery-ui/jquery.ui.1.10.2.ie.css"/>
	<![endif]-->

<!-- Theme -->
<link href="../melon//assets/css/main.css" rel="stylesheet"
	type="text/css" />
<link href="../melon/assets/css/plugins.css" rel="stylesheet"
	type="text/css" />
<link href="../melon/assets/css/responsive.css" rel="stylesheet"
	type="text/css" />
<link href="../melon/assets/css/icons.css" rel="stylesheet"
	type="text/css" />

<link rel="stylesheet"
	href="../melon/assets/css/fontawesome/font-awesome.min.css">
<!--[if IE 7]>
		<link rel="stylesheet" href="../melon/assets/css/fontawesome/font-awesome-ie7.min.css">
	<![endif]-->

<!--=== JavaScript ===-->

<script type="text/javascript"
	src="../melon/assets/js/libs/jquery-1.10.2.min.js"></script>
<script type="text/javascript"
	src="../melon/plugins/jquery-ui/jquery-ui-1.10.2.custom.min.js"></script>

<script type="text/javascript"
	src="../melon/bootstrap/js/bootstrap.min.js"></script>
<script type="text/javascript"
	src="../melon/assets/js/libs/lodash.compat.min.js"></script>

<!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
<!--[if lt IE 9]>
		<script src="../melon/assets/js/libs/html5shiv.js"></script>
	<![endif]-->

<!-- Smartphone Touch Events -->
<script type="text/javascript"
	src="../melon/plugins/touchpunch/jquery.ui.touch-punch.min.js"></script>
<script type="text/javascript"
	src="../melon/plugins/event.swipe/jquery.event.move.js"></script>
<script type="text/javascript"
	src="../melon/plugins/event.swipe/jquery.event.swipe.js"></script>

<!-- General -->
<script type="text/javascript"
	src="../melon/assets/js/libs/breakpoints.js"></script>
<script type="text/javascript"
	src="../melon/plugins/respond/respond.min.js"></script>
<!-- Polyfill for min/max-width CSS3 Media Queries (only for IE8) -->
<script type="text/javascript"
	src="../melon/plugins/cookie/jquery.cookie.min.js"></script>
<script type="text/javascript"
	src="../melon/plugins/slimscroll/jquery.slimscroll.min.js"></script>
<script type="text/javascript"
	src="../melon/plugins/slimscroll/jquery.slimscroll.horizontal.min.js"></script>

<!-- App -->
<script type="text/javascript" src="../melon/assets/js/app.js"></script>
<script type="text/javascript" src="../melon/assets/js/plugins.js"></script>
<script type="text/javascript"
	src="../melon/assets/js/plugins.form-components.js"></script>
<!-- 滚动插件 -->
<script type="text/javascript"
	src="../melon/limarquee/jquery.kxbdmarquee.js"></script>
<link rel="stylesheet" href="../melon/limarquee/kxbdMarquee.css">
<!-- 放大 -->
<!-- Add mousewheel plugin (this is optional) -->
<script type="text/javascript"
	src="../melon/limarquee/facebox/jquery.mousewheel-3.0.6.pack.js"></script>
<!-- Add fancyBox main JS and CSS files -->
<script type="text/javascript"
	src="../melon/limarquee/facebox/jquery.fancybox.js"></script>
<link rel="stylesheet" type="text/css"
	href="../melon/limarquee/facebox/jquery.fancybox.css" media="screen" />
<!-- Add Button helper (this is optional) -->
<link rel="stylesheet" type="text/css"
	href="../melon/limarquee/facebox/helpers/jquery.fancybox-buttons.css" />
<script type="text/javascript"
	src="../melon/limarquee/facebox/helpers/jquery.fancybox-buttons.js"></script>

<!-- Add Thumbnail helper (this is optional) -->
<link rel="stylesheet" type="text/css"
	href="../melon/limarquee/facebox/helpers/jquery.fancybox-thumbs.css" />
<script type="text/javascript"
	src="../melon/limarquee/facebox/helpers/jquery.fancybox-thumbs.js"></script>

<!-- Add Media helper (this is optional) -->
<script type="text/javascript"
	src="../melon/limarquee/facebox/helpers/jquery.fancybox-media.js"></script>
<!-- 放大插件结束 -->
<script type="text/javascript">
	$(document).ready(function() {
		$("#prodListId").kxbdMarquee({
			isEqual : false,
			direction : 'left',
			scrollDelay : 15
		});
		$('#processorList').kxbdMarquee({
			isEqual : false,
			direction : 'up',
			scrollDelay : 15
		});
		$('.fancybox-buttons').fancybox({
			openEffect  : 'none',
			closeEffect : 'none',
			prevEffect : 'none',
			nextEffect : 'none',
			closeBtn  : true,
			helpers : {
				title : {
					type : 'inside'
				},
				buttons	: {}
			}
		});
	});
</script>
<script>
	$(document).ready(function() {
		"use strict";
		App.init(); // Init layout and core plugins
		Plugins.init(); // Init all plugins
		FormComponents.init(); // Init all form-specific plugins
	});

	function search() {
		var processprIndex = 0;
		var processorList = {};
		var productCode = $("#productCode").val();
		$
				.ajax({
					type : "POST",
					dataType : "json",
					cache : false,
					async : true,
					data : {
						"productCode" : productCode
					},
					url : "../proCategroy/findImgByOssUrl.action",
					success : function(result) {
						for (var i = 0; i < processorIndex; i++) {
							var categoryId = processorList[i].categoryId;
							$
									.each(
											result,
											function(key, value) {
												if (categoryId == key) {
													for (var j = 0; j < value.length; j++) {
														$('#processorUlId' + i)
																.append(
																		'<li style="list-style-type: none; display: inline;" class="processorImgLi"><div class="thumbnail"><a class="fancybox-buttons" data-fancybox-group="button" href="'+value[j]+'"><img alt="图片'+j+'" style="width: 100px; height: 75px;" src="'+value[j]+'" ></a></div></li>');
													}
												}
											});
						}
						maquee();
					}
				});
		$
				.ajax({
					type : "POST",
					dataType : "json",
					cache : false,
					async : true,
					data : {
						"productCode" : productCode
					},
					url : "../product/findProductByProductCode.action",
					success : function(result) {
						if (result) {
							$("#productCodeShow").html("商品编码：" + productCode);
							$("#productNameShow")
									.html(
											"商品名称："
													+ result.productCategory.categoryName);
							$("#productDescShow")
									.html(
											"商品描述："
													+ result.productCategory.categoryDescription);
							$("#productTimeShow").html(
									"生产时间：" + result.produceDate);
							$("#companyNameShow")
									.html(
											"生产商："
													+ result.productCategory.company.companyName);
							$("#companyTelShow")
									.html(
											"生产商联系方式："
													+ result.productCategory.company.telephone);
						} else {
							$("#productCodeShow").html("商品编码：");
							$("#productNameShow").html("商品名称：");
							$("#productDescShow").html("商品描述：");
							$("#productTimeShow").html("生产时间：");
							$("#companyNameShow").html("生产商：");
							$("#companyTelShow").html("生产商联系方式：");
						}

						$
								.ajax({
									type : "POST",
									dataType : "json",
									cache : false,
									async : true,
									data : {
										"productCode" : productCode
									},
									url : "../proCategroy/findProListbyCode.action",
									success : function(result) {
										var panel = $("#Two");
										panel.html("");
										processorIndex = result.length;
										processorList = result;
										for (var i = 0; i < result.length; i++) {
											//alert(result[i].categoryName);
											panel
													.append('<div class="panel-body"><h3>'
															+ result[i].categoryName
															+ '</h3><p>'
															+ result[i].categoryDescription
															+ '</p><div class="col-md-9" style="border:1px solid #000;"><div class="processorImgDiv" id="processorImgId'+i+'"><ul id="processorUlId'+i+'"></ul></div></div></div>');
										}
									},
									error : function(data) {
										alert("没有该商品信息");
									}
								});
					},
					error : function(data) {
						alert("没有该商品信息");
					}
				});
	}
</script>
<script type="text/javascript">
	function maquee() {
		$('.processorImgDiv').kxbdMarquee({
			isEqual : false,
			direction : 'left',
			scrollDelay : 15
		});
	}
</script>
</head>
<body>
	<div class="container">
		<img alt="图片" src="holder.js/100%x180">
		<div class="panel panel-default">
			<div class="panel-header">
				<ul class="nav nav-tabs">
					<li class="active"><a href="#home" data-toggle="tab">首页</a></li>
					<li><a href="#messages" data-toggle="tab">企业简介</a></li>
					<li><a href="#product" data-toggle="tab">产品</a></li>
					<li><a href="#promise" data-toggle="tab">企业诚信承诺</a></li>
					<li><a href="#tracing" data-toggle="tab">产品溯源</a></li>
				</ul>
			</div>
			<div class="panel-body">
				<div class="tab-content">
					<!-- 首页 -->
					<div id="home" class="tab-pane fade in active">
						<div class="row">
							<div class="col-md-3">
								<ul class="nav nav-pills nav-stacked">
									<li class="active"><a href="#"> <span
											class="badge pull-right">more...</span> 公司简介
									</a></li>
								</ul>
								<p>${company.description}</p>
							</div>
							<div class="col-md-9">
								<ul class="nav nav-pills nav-stacked">
									<li class="active"><a href="#"> <span
											class="badge pull-right">more...</span> 产品列表
									</a></li>
								</ul>
								<div id="prodListId">
									<ul>
										<c:forEach items="${prodlist }" var="prod">
											<li style="list-style-type: none; display: inline;">
												<div class="thumbnail">
													<a href="#" class="btn"><img alt="图片"
														style="width: 300px; height: 250px;"
														src="http://localhost:8080/file/${prod.imageUrl }"></a>
													<div class="caption" style="text-align: center;">
														<h4>${prod.categoryName }</h4>
														<p>${prod.categoryDescription }</p>
													</div>
												</div>
											</li>
										</c:forEach>
									</ul>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-5">
								<ul class="nav nav-pills nav-stacked">
									<li class="active"><a href="#"> <span
											class="badge pull-right">more...</span> 公司承诺
									</a></li>
								</ul>
								<p>诚信原则</p>
								<p>${company.commitment }</p>
							</div>
							<div class="col-md-7">
								<ul class="nav nav-pills nav-stacked">
									<li class="active"><a href="#"> 产品流程 </a></li>
								</ul>
								<div id="processorList">
									<table style="width: 100%;">
										<c:forEach items="${extProcessorList}" var="processor">
											<tr>
												<td>${processor.productName }</td>
												<td>${processor.userName }</td>
												<td>${processor.processName }</td>
												<td>${processor.roleName }</td>
												<td>${processor.time }</td>
											</tr>
										</c:forEach>
									</table>
								</div>
							</div>
						</div>
					</div>
					<div id="messages" class="tab-pane jumbotron"
						style="background: white;">
						<h2>企业简介</h2>
						<p style="font-size: 15px;">${company.description}</p>
					</div>
					<div id="product" class="tab-pane jumbotron"
						style="background: white;">
						<h2>产品列表</h2>
						<c:forEach items="${prodlist }" var="prod">
							<div class="col-md-3">
								<div class="thumbnail">
									<img alt="图片"
										src="http://localhost:8080/file/${prod.imageUrl }">
									<div class="caption">
										<h4>${prod.categoryName }</h4>
										<span>${prod.categoryDescription }</span>
									</div>
								</div>
							</div>
						</c:forEach>
					</div>
					<div id="promise" class="tab-pane jumbotron"
						style="background: white;">
						<h2>企业承诺</h2>
						<p style="font-size: 15px;">诚信原则</p>
						<p style="font-size: 15px;">${company.commitment }</p>
					</div>
					<div id="tracing" class="tab-pane" style="background: white;">
						<!-- 搜索表单 -->
						<div class="col-md-12">
							<div class="col-md-3">
								<input type="text" class="form-control" placeholder="请输入溯源码"
									id="productCode">
							</div>
							<div class="col-md-2">
								<button class="btn btn-default" onclick="search()">搜索</button>
							</div>
						</div>
						<!-- 搜索信息 -->
						<div class="panel-group" id="Info">
							<div class="panel panel-default">
								<div class="panel-heading">
									<h4 class="panel-title">
										<a data-toggle="collapse" data-parent="#Info" href="#One">商品基本信息</a>
									</h4>
								</div>
								<div id="One" class="panel-collapse collapse in">
									<div class="panel-body">
										<ul class="list-group" style="border: 0;">
											<li class="list-group-item" id="productCodeShow">商品编码：</li>
											<li class="list-group-item" id="productNameShow">商品名称：</li>
											<li class="list-group-item" id="productDescShow">商品描述：</li>
											<li class="list-group-item" id="productTimeShow">生产时间：</li>
											<li class="list-group-item" id="companyNameShow">生产商：</li>
											<li class="list-group-item" id="companyTelShow">生产商联系方式：</li>
										</ul>
									</div>
								</div>
							</div>
							<div class="panel panel-default">
								<div class="panel-heading">
									<h4 class="panel-title">
										<a data-toggle="collapse" data-parent="#Info" href="#Two">商品生产流程信息</a>
									</h4>
								</div>
								<div id="Two" class="panel-collapse collapse"></div>
							</div>
						</div>
						<div class="panel panel-default">
							<div class="panel-heading">
								<h4 class="panel-title">
									<a data-toggle="collapse" data-toggle="collapse"
										data-parent="#Info" href="#Other">其他信息</a>
								</h4>
							</div>
							<div id="Other" class="panel-collapse collapse">
								<div class="panel-body">
									<p></p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 页脚 -->
		<div class="crumbs" style="text-align: center;">
			<a href="#">首页</a> &nbsp;|&nbsp;<a href="#">服务</a>&nbsp;|&nbsp; <a
				href="#">产品</a>&nbsp;|&nbsp;<a href="#">关于我们</a>&nbsp;|&nbsp; <a
				href="#">联系我们</a>
		</div>
	</div>
</body>
</html>