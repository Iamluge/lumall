<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="utf-8">
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0" />
<title>农产品溯源系统</title>

<!--=== CSS ===-->

<!-- Bootstrap -->
<link href="../melon/bootstrap/css/bootstrap.min.css" rel="stylesheet"
	type="text/css" />
<!-- font styles -->
<link rel="stylesheet" type="text/css"
	href="../melon/assets/css/plugins/bootstrap-wysihtml5.css"></link>
<!-- jQuery UI -->
<!--<link href="../melon/plugins/jquery-ui/jquery-ui-1.10.2.custom.css" rel="stylesheet" type="text/css" />-->
<!--[if lt IE 9]>
		<link rel="stylesheet" type="text/css" href="../melon/plugins/jquery-ui/jquery.ui.1.10.2.ie.css"/>
	<![endif]-->

<!-- Theme -->
<link href="../melon/assets/css/main.css" rel="stylesheet"
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
<!-- 消息提示框 -->
<script type="text/javascript" src="../melon/toastr/toastr.min.js"></script>
<link href="../melon/toastr/toastr.min.css" rel="stylesheet"
	type="text/css" />
<!-- 下拉选择框插件 -->
<link rel="stylesheet" type="text/css" href="../melon/select/select2.min.css" />
<script type="text/javascript" src="../melon/select/select2.full.min.js"></script>
<!-- 日历插件 -->
<script type="text/javascript" src="../melon/laydate/laydate.js"></script>
<link rel="stylesheet" type="text/css" href="../melon/laydate/laydate.css" />
<!-- 字体样式 -->
<script type="text/javascript"
	src="../melon/plugins/bootstrap-wysihtml5/wysihtml5.min.js"></script>
<script type="text/javascript"
	src="../melon/plugins/bootstrap-wysihtml5/bootstrap-wysihtml5.min.js"></script>

<!-- 文件上传第2版 -->
<script type="text/javascript" src="../melon/fileInput/jquery.Huploadify.js"></script>
<link rel="stylesheet" type="text/css" href="../melon/fileInput/Huploadify.css" />

<!-- 上传文件到OSS插件 -->
<script type="text/javascript" src="../melon/fileInput/lib/crypto1/crypto/crypto.js"></script>
<script type="text/javascript" src="../melon/fileInput/lib/crypto1/hmac/hmac.js"></script>
<script type="text/javascript" src="../melon/fileInput/lib/crypto1/sha1/sha1.js"></script>
<script type="text/javascript" src="../melon/fileInput/lib/base64.js"></script>
<script type="text/javascript" src="../melon/fileInput/lib/plupload-2.1.2/js/plupload.full.min.js"></script>
<link rel="stylesheet" type="text/css" href="../melon/fileInput/UploadStyle.css"/>
<!-- 结束 -->
<!-- 结束 -->
<%--动态分布图标--%>
<script type="text/javascript" src="../melon/assets/js/icon.js"></script>
<%--复选框选中功能 --%>
<script type="text/javascript" src="../newpage/checkbox.js"></script>

<%--视频监控 --%>
<script type="text/javascript" src="../newpage/vedioControlPanel.js"></script>
<%--商家产品管理 --%>
<script type="text/javascript" src="../newpage/CompanyProductManage.js"></script>
<%--进入企业主页面 --%>
<script type="text/javascript" src="../newpage/enterMain.js"></script>
<%--人员管理--%>
<script type="text/javascript" src="../newpage/personManage.js"></script>
<%--角色管理--%>
<script type="text/javascript" src="../newpage/roleManage.js"></script>
<%--材料采购--%>
<script type="text/javascript" src="../newpage/materialPurchase.js"></script>
<%--生产计划--%>
<script type="text/javascript" src="../newpage/productPlan.js"></script>
<%--材料清单--%>
<script type="text/javascript" src="../newpage/material.js"></script>
<%--二维码管理 --%>
<script type="text/javascript" src="../newpage/ProCode.js"></script>
<%--商家信息设置 --%>
<script type="text/javascript" src="../newpage/companyInfoSetting.js"></script>
<%--流程监控 --%>
<script type="text/javascript" src="../newpage/comapanyProcessorManage.js"></script>
<%--自定义模板 --%>
<script type="text/javascript" src="../newpage/CustomInfoTempleManage.js"></script>
<%--流程操作 --%>
<script type="text/javascript" src="../newpage/ProcessorInfoManage.js"></script>
<%--手风琴式插件 --%>
<script type="text/javascript" src="../newpage/jquery.aCollapTable.min.js" ></script>
<script>
	$(document).ready(function() {
		"use strict";

		App.init(); // Init layout and core plugins
		Plugins.init(); // Init all plugins
		FormComponents.init(); // Init all form-specific plugins

	});
</script>
<style type="text/css">
.myfont {
	font-weight: bold;
	font-family: simhei;
}
</style>
</head>

<body>

	<!-- Header -->
	<header class="header navbar navbar-fixed-top" role="banner">
		<!-- Top Navigation Bar -->
		<div class="container">

			<!-- Only visible on smartphones, menu toggle -->
			<ul class="nav navbar-nav">
				<li class="nav-toggle"><a href="javascript:void(0);"
					title=""><i class="icon-reorder"></i></a></li>
			</ul>

			<!-- Logo -->
			<a class="navbar-brand" href="#"> <img
				src="../melon/assets/img/logo_white.png" alt="logo"
				style="width: 29px; height: 21px;" /> <strong>农产品溯源系统</strong>
			</a>
			<!-- /logo -->

			<!-- Sidebar Toggler -->
			<a href="#" class="toggle-sidebar bs-tooltip" data-placement="bottom"
				data-original-title="切换菜单栏"> <i class="icon-reorder"></i>
			</a>
			<!-- /Sidebar Toggler -->


			<ul class="nav navbar-nav navbar-left hidden-xs hidden-sm">
				<li><a href="#" class="myfont">
						商家:${sysUser.company.companyName } </a></li>
			</ul>

			<!-- Top Right Menu -->
			<ul class="nav navbar-nav navbar-right">
				<!-- User Login Dropdown -->
				<li class="dropdown user"><a href="../melon/#"
					class="dropdown-toggle" data-toggle="dropdown"> <i
						class="icon-male"></i> <span class="username">${sysUser.userName }</span>
						<i class="icon-caret-down small"></i>
				</a>
					<ul class="dropdown-menu">
						<li><a href="/AptsWeb/sysUser/logout.action"><i
								class="icon-off"></i>退出登录</a></li>
					</ul></li>
				<!-- /user login dropdown -->
			</ul>
			<!-- /Top Right Menu -->
		</div>
		<!-- /top navigation bar -->
	</header>
	<!-- /.header -->

	<div id="container">
		<div id="sidebar" class="sidebar-fixed">
			<div id="sidebar-content">

				<%--菜单栏 --%>
				<ul id="nav">
					<c:forEach items="${sysPowerMap }" var="item">
						<c:if test="${item.value.parentPower.id=='1000' }">
							<c:choose>
								<c:when
									test="${item.value.id=='zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz'}">
								</c:when>
								<c:otherwise>
									<li><a
										href="#<%-- <c:url value='${item.value.url }' /> --%>"
										onclick="${item.value.method}" class="myfont"> <i
											name="icon" id="${item.value.text }"></i> ${item.value.text }
									</a>
										<ul class="sub-menu">
											<c:forEach items="${sysPowerMap }" var="children">
												<c:if
													test="${item.value.id==children.value.parentPower.id }">

													<li><a href="#" onclick="${children.value.method}"
														class="myfont"> <i class="icon-angle-right"></i>
															${children.value.text}
													</a></li>

												</c:if>
											</c:forEach>
										</ul></li>
								</c:otherwise>
							</c:choose>
						</c:if>
					</c:forEach>
				</ul>
				<%--菜单栏 --%>
			</div>
			<div id="divider" class="resizeable"></div>
		</div>
		<!-- /Sidebar -->

		<div id="content"></div>
	</div>

</body>
</html>