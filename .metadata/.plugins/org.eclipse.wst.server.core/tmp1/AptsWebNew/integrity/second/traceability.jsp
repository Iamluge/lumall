<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<!-- 导入struts2的标签库 -->
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<head>
<title>农产品溯源网</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="Content-Style-Type" content="text/css" />
<link href="../css/index/style.css" rel="stylesheet" type="text/css" />
<script src="../jquery/jquery-1.9.1.min.js" type="text/javascript"></script>
<script src="../js/script.js" type="text/javascript"></script>
<script src="../integrity/js/indexFunction2.js" type="text/javascript"></script>

</head>
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
<body>
	<div id="suyuan">
		<div class="main-search">
			<form action="" id="search-form"
				method="post">
				<fieldset>
					<input type="text" name="productCode" id="productCode" class="text"
						value="请输入溯源码" onFocus="if(this.value=='请输入溯源码'){this.value=''}"
						onBlur="if(this.value==''){this.value='请输入溯源码'}" /> <input
						type="button" class="submit" value=""
						onClick="findProcCategoryList2()" />
				</fieldset> 
			</form>
		</div>
		<div class="main-content">
			<div id="options">
				<a href="javascript:parentAccordion.pr(1)">展开所有</a> | <a
					href="javascript:parentAccordion.pr(-1)">关闭所有</a>
			</div>
			<!-- 加滚动条 -->
			<div>
			<ul class="acc" id="acc">
				<li>
					<h3>商品基本信息</h3>
					<div class="acc-section">
						<div class="acc-content">
							<h2>商品编码:${productInfo.productCode.productCodeId}</h2>
							<h2>商品名称:${productInfo.productCategory.categoryName}</h2>
							<h2>商品描述:${productInfo.productCategory.categoryDescription}</h2>
							<h2>生产时间:${productInfo.produceDate}</h2>
							<h2>生产商:${productInfo.productCategory.company.companyName}</h2>
							<h2>生产商联系方式:${productInfo.productCategory.company.telephone}</h2>
						</div>
					</div>
				</li>
				<li>
					<h3>商品生产流程信息</h3>
					<div class="acc-section">
						<div class="acc-content">
							<ul class="acc" id="nested">
								<c:forEach items="${proCategoryList}" var="pro">
									<li>
										<h3>${pro.categoryName}</h3>
										<div class="acc-section">
											<div class="acc-content">
												<ul class="acc" id="infor">
													<h2>${pro.categoryDescription}</h2>
													<c:if test="${pro.categoryName=='物流'}">
														<li onClick="findDescription('${pro.categoryId}')"
															onmousedown="this.style.color='#000'">+物流</li>
														<iframe id="kuaidi" src="" width="600"
															height="250" marginwidth="0" marginheight="0" hspace="0"
															vspace="0" frameborder="0" scrolling="no"></iframe>
													</c:if>
														<li onClick="findResourceUrlList('${pro.categoryId}','0')"
															onmousedown="this.style.color='#000'">+图片</li>
														<div class="acc-section">
															<div class="acc-content" id="${pro.categoryId}0"></div>
														</div>

														<li onClick="findResourceUrlList('${pro.categoryId}','1')"
															onmousedown="this.style.color='#000'">+视频</li>
														<div class="acc-section">
															<div class="acc-content" id="${pro.categoryId}1"></div>
														</div>

														<li onClick="findResourceUrlList('${pro.categoryId}','2')"
															onmousedown="this.style.color='#000'">+文字</li>
														<div class="acc-section">
															<div class="acc-content" id="${pro.categoryId}2"></div>
														</div>
														<li onClick="findResourceUrlList('${pro.categoryId}','3')"
															onmousedown="this.style.color='#000'">+自定义信息</li>
														<div class="acc-section">
															<div class="acc-content" id="${pro.categoryId}3"></div>
														</div>
												</ul>
											</div>
										</div>
									</li>
								</c:forEach>
							</ul>
						</div>
					</div>
				</li>
				<li>
					<h3>其他信息</h3>
					<div class="acc-section">
						<div class="acc-content"></div>
					</div>
				</li>
			</ul>
			</div>
		</div>
		
	</div>
	<script type="text/javascript">
		var parentAccordion = new TINY.accordion.slider("parentAccordion");
		parentAccordion.init("acc", "h3", 0, 0);

		var nestedAccordion = new TINY.accordion.slider("nestedAccordion");
		nestedAccordion.init("nested", "h3", 0, -1, 0);

		var inforAccordion = new TINY.accordion.slider("inforAccordion");
		inforAccordion.init("infor", "h3", 0, -1, 0);
		picrun_ini();
	</script>
</body>
</html>