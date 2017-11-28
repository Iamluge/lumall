
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0" />
<title>农产品溯源系统</title>

<!--=== CSS ===-->

<!-- Bootstrap -->
<link href="melon/bootstrap/css/bootstrap.min.css" rel="stylesheet"
	type="text/css" />

<!-- Theme -->
<link href="melon/assets/css/main.css" rel="stylesheet" type="text/css" />
<link href="melon/assets/css/plugins.css" rel="stylesheet" type="text/css" />
<link href="melon/assets/css/responsive.css" rel="stylesheet" type="text/css" />
<link href="melon/assets/css/icons.css" rel="stylesheet" type="text/css" />

<!-- Login -->
<link href="melon/assets/css/login.css" rel="stylesheet" type="text/css" />

<link rel="stylesheet"
	href="melon/assets/css/fontawesome/font-awesome.min.css">
<!--[if IE 7]>
		<link rel="stylesheet" href="melon/assets/css/fontawesome/font-awesome-ie7.min.css">
	<![endif]-->

<!--[if IE 8]>
		<link href="melon/assets/css/ie8.css" rel="stylesheet" type="text/css" />
	<![endif]-->

<!--=== JavaScript ===-->

<script type="text/javascript" src="melon/assets/js/libs/jquery-1.10.2.min.js"></script>

<script type="text/javascript" src="melon/bootstrap/js/bootstrap.min.js"></script>
<script type="text/javascript" src="melon/assets/js/libs/lodash.compat.min.js"></script>

<!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
<!--[if lt IE 9]>
		<script src="melon/assets/js/libs/html5shiv.js"></script>
	<![endif]-->

<!-- Beautiful Checkboxes -->
<script type="text/javascript"
	src="melon/plugins/uniform/jquery.uniform.min.js"></script>

<!-- Form Validation -->
<script type="text/javascript"
	src="melon/plugins/validation/jquery.validate.min.js"></script>

<!-- Slim Progress Bars -->
<script type="text/javascript" src="melon/plugins/nprogress/nprogress.js"></script>

<!-- App -->
<script type="text/javascript" src="melon/assets/js/login.js"></script>
<script>
	$(document).ready(function() {
		"use strict";
		Login.init(); // Init login JavaScript
	});
	function sub(){
		var userId = $("#userId").val();
		var password = $("#password").val();
		window.location.href = "sysUser/loginCheck.action?userId="+userId+"&password="+password;
	}
</script>
</head>

<body class="login">
	<!-- Logo -->
	<div class="logo">
		<img src="melon/assets/img/aptslogo.png" style="width: 40px; height: 40px;"
			alt="logo" /> <strong style="color: green;">UNION SAFE</strong><font
			size="1" color="green">DIGITAL AGRICULTURE</font></br> <font
			color="#008000">农产品安全生产监控及溯源平台</font>
	</div>


	<!-- /Logo -->

	<!-- Login Box -->
	<div class="box">
		<div class="content col-lg-10">
			<!-- Login Formular -->
			<form class="form-vertical login-form" action="#"
				method="post">
				<!-- Title -->
				<h3 class="form-title">
					<strong>登录系统</strong>
				</h3>

				<!-- Error Message -->
				<div class="alert fade in alert-danger" style="display: none;">
					<i class="icon-remove close" data-dismiss="alert"></i> 请输入用户名和密码.
				</div>

				<!-- Input Fields -->
				<div class="form-group">
					<!--<label for="username">Username:</label>-->
					<div class="input-icon">
						<i class="icon-user"></i> <input type="text" name="userId" id="userId"
							class="form-control" placeholder="用户名" autofocus="autofocus"
							data-rule-required="true" data-msg-required="请输入用户名." />
					</div>
				</div>
				<div class="form-group">
					<!--<label for="password">Password:</label>-->
					<div class="input-icon">
						<i class="icon-lock"></i> <input type="password" name="password" id="password"
							class="form-control" placeholder="密码" data-rule-required="true"
							data-msg-required="请输入密码." />
					</div>
				</div>
				<!-- /Input Fields -->

				<!-- Form Actions -->
				<div class="form-actions">
					<button  class="btn btn-primary pull-right" onclick="sub()">
						登录 <i class="icon-angle-right"></i>
					</button>
				</div>
			</form>
			<!-- /Login Formular -->
		</div>
		<!-- /.content -->
	</div>
	<!-- /Login Box -->

</body>
</html>

