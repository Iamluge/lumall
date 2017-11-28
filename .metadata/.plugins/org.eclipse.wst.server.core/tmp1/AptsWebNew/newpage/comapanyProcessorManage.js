/**
 * 提示框属性
 */
$(function() {
	toastr.options = {
		"positionClass" : "toast-top-full-width",// 弹出窗的位置
		"showDuration" : "300",// 显示的动画时间
		"hideDuration" : "1000",// 消失的动画时间
		"timeOut" : "2000", // 展现时间
		"showEasing" : "swing",// 显示时的动画缓冲方式
		"hideEasing" : "linear",// 消失时的动画缓冲方式
		"showMethod" : "fadeIn",// 显示时的动画方式
		"hideMethod" : "fadeOut", // 消失时的动画方式
	}
});

/**
 * 初始化流程管理页面
 */
function createComapanyProcessorManage() {
	$.get("../newpage/comapanyProcessorManage.html", function(data) {
		$("#content").html(data);
	});
	// 查看该公司的所有产品
	loadproduct();
	// 加载所有产品的所有流程
	loadProcessor();
}

/**
 * 查询该公司所有产品
 */
function loadproduct() {
	$.ajax({
		url : '../productCategory/findProductCategoryByCompanyId.action',
		dataType : "json",
		cache : false,
		async : true,
		success : function(result) {
			for (var i = 0; i < result.length; i++) {
				$('#comapany_productStore_Table').append(
						'<tr class="info"><td><input name="loadproductCheckBox" type="checkbox" value='
								+ result[i].categoryId
								+ ' onchange="findProcessor(' + i
								+ ')"/></td><td>' + result[i].categoryName
								+ '</td><td>' + result[i].categoryDescription
								+ '</td></tr>')
			}
		}
	});
}

/**
 * 加载所有流程信息
 */
function loadProcessor() {
	var cs = "";
	$
			.ajax({
				url : '../proCategroy/findProCategoryByCompanyId.action',
				dataType : "json",
				cache : false,
				async : false,
				success : function(result) {
					$('#comapany_processorStore_Table  tr').detach();
					$('#comapany_processorStore_Table')
							.append(
									'<tr class="active"><th width="5%" style="text-align: center;"><inputtype="checkbox" name="code" onclick="checkAll()" id="cameraCheck" /></th><th width="10%" style="text-align: center;">流程名称</th><th width="30%" style="text-align: center;">详细描述</th><th width="20%" style="text-align: center;">流程状态</th><th width="35%" style="text-align: center;">操作</th></tr> ');
					for (var i = 0; i < result.length; i++) {
						if (result[i].categoryState == "0") {
							cs = "激活"
						} else {
							cs = "注销"
						}
						$('#comapany_processorStore_Table')
								.append(
										'<tr class="info" style="text-align:center;"><td><input name="comapanyCheckBox" type="checkbox"/></td><td style="display:none;">'
												+ result[i].categoryId
												+ '</td><td>'
												+ result[i].categoryName
												+ '</td><td style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">'
												+ result[i].categoryDescription
												+ '</td><td>'
												+ cs
												+ '</td><td><button type="button" class="btn btn-info btn-xs" data-toggle="modal" data-target="#editProcessor" onclick="loadProcessorMeassage('
												+ (i + 1)
												+ ')">修改流程</button>&nbsp;<button type="button" class="btn btn-success btn-xs" data-toggle="modal" data-target="#seeProcessor" onclick="seeProcessMeassage('
												+ (i + 1)
												+ ')">查看流程</button></tr>');
					}
				}
			});
}

/**
 * 通过索引动态添加流程类型信息
 * 
 * @param index
 */
function loadProcessorMeassage(index) {
	var extJson = {};
	extJson.categoryId = $(
			'#comapany_processorStore_Table tr:eq(' + (index) + ') td:eq(1)')
			.text();
	extJson.categoryName = $(
			'#comapany_processorStore_Table tr:eq(' + (index) + ') td:eq(2)')
			.text();
	extJson.categoryDescription = $(
			'#comapany_processorStore_Table tr:eq(' + (index) + ') td:eq(3)')
			.text();
	console.info(extJson);
	$('#editProcessor_table td').remove();
	$('#editProcessor_table input[type=hidden]').remove();
	$('#editProcessor_table')
			.append(
					'<tr><input id="id"  type="hidden" value="'
							+ extJson.categoryId
							+ '"/><td>流程名称：<input type="text" class="form-control" name="categoryName" value="'
							+ extJson.categoryName
							+ '"/></td></tr><tr><td>详细描述：<input type="text" class="form-control" name="categoryDescription" value="'
							+ extJson.categoryDescription + '"/></td></tr>')
}

/**
 * 修改流程类型
 */
function editProcessor() {
	var extJson = {};
	extJson.categoryId = $('#id').val();
	extJson.categoryName = $('#editProcessor_form input[name=categoryName]')
			.val();
	extJson.categoryDescription = $(
			'#editProcessor_form input[name=categoryDescription]').val();
	$.ajax({
		method : "POST",
		url : '../proCategroy/editProCategory.action',
		dataType : "json",
		cache : false,
		async : false,
		data : {
			extJson : JSON.stringify(extJson)
		},
		success : function(extMessage) {
			var sof = extMessage.successOrFalse;
			if (sof == "success") {
				$('#editProcessor').modal('hide');
				toastr.success(extMessage.meassage);
			} else if (sof == "false") {
				toastr.error(extMessage.meassage);
			}
			loadProcessor();
		}
	});
}

/**
 * 通过产品查询该产品的流程
 * 
 * @param index
 */
function findProcessor(index) {
	var categoryId;
	var catagoryName;
	// 判断选中的个数
	if ($("input[name='loadproductCheckBox']:checked").length > 1) {
		toastr.error("请选择一个产品进行查看流程，不能多出一个");
	} else if ($("input[name='loadproductCheckBox']:checked").length == 1) {
		categoryId = $("#comapany_productStore_Table")
				.find(":checkbox:checked").val();
		comapanyName = $("#comapany_productStore_Table").find(
				":checkbox:checked").parent().next().text();
		// 根据id获取流程信息
		$
				.ajax({
					url : '../proCategroy/findProcCgByProdCgId.action?categoryId='
							+ categoryId,
					dataType : "json",
					cache : false,
					async : false,
					success : function(result) {
						// 获取到的添加到流程信息列表中
						// 1. 标题
						$('#strong_div').empty();
						$('#strong_div').append(
								'<strong><i class="icon-list"></i>['
										+ comapanyName + ']已设置的流程</strong>');
						// 删除前一次查询的数据
						$('#product_table tr[class=info]').remove();
						$('#product_table input[type=hidden]').remove();
						// 循环加入该产品已经设置的流程
						for (var i = 0; i < result.length; i++) {
							$('#product_table')
									.append(
											'<tr class="info"><td><input type="checkbox" name = "productCheckBox"/></td><input name="hidden_categoryId"  type="hidden" value="'
													+ result[i].categoryId
													+ '"/><td>'
													+ result[i].categoryName
													+ '</td></tr>');
						}
					}
				});
	}
}

/**
 * 清空表单数据
 */
function ProcessorCleanForm() {
	// 每次点击清空表单数据
	$(':input', '#addProcessor_form').not(':button, :submit, :reset, :hidden')
			.val('').removeAttr('checked').removeAttr('selected');
}

/**
 * 增加流程
 */
function addProcessor() {
	// 获取表单数据
	var extJson = {};
	extJson.categoryName = $('#addProcessor_form input[name=categoryName]')
			.val();
	extJson.categoryDescription = $(
			'#addProcessor_form input[name=categoryDescription]').val();
	$.ajax({
		method : "POST",
		url : '../proCategroy/addProCategory.action',
		dataType : "json",
		cache : false,
		async : false,
		data : {
			extJson : JSON.stringify(extJson)
		},
		success : function(extMessage) {
			var sof = extMessage.successOrFalse;
			if (sof == "success") {
				$('#addProcessor').modal('hide');
				toastr.success(extMessage.meassage);
			} else if (sof == "false") {
				toastr.error(extMessage.meassage);
			}
			loadProcessor();
		}
	});
}

/**
 * 查看流程类型
 */
function seeProcessMeassage(index) {
	var extJson = {};
	extJson.categoryName = $(
			'#comapany_processorStore_Table tr:eq(' + (index) + ') td:eq(2)')
			.text();
	extJson.categoryDescription = $(
			'#comapany_processorStore_Table tr:eq(' + (index) + ') td:eq(3)')
			.text();
	$('#seeProcessor_table td').remove();
	$('#seeProcessor_table')
			.append(
					'<tr><td>流程名称：<input type="text" class="form-control" name="categoryName" value="'
							+ extJson.categoryName
							+ '"/></td></tr><tr><td>详细描述：<input type="text" class="form-control" name="categoryDescription" value="'
							+ extJson.categoryDescription + '"/></td></tr>')
}

/**
 * 用于关闭模态框
 */
function closed() {
	$('#seeProcessor').modal('hide');
}

/**
 * 激活流程
 */
function activeProcessor() {
	var extParam = {};
	var categoryIds = "";
	if ($("#comapany_processorStore_Table input[name='comapanyCheckBox']:checked").length != 0) {// 判断是否选中对象
		$("#comapany_processorStore_Table").find(":checkbox:checked").each(
				function() {// 获取选择行的id
					var val = $(this).parent().next().text();
					categoryIds = categoryIds + val + "`";
				});
		categoryIds = categoryIds.substring(0, categoryIds.length - 1);
		extParam.extJsonList = categoryIds;
		$.ajax({
			url : '../proCategroy/activateProCategory.action',
			dataType : "json",
			cache : false,
			async : false,
			data : {
				extParam : JSON.stringify(extParam)
			},
			success : function() {
				loadProcessor();
				toastr.success("激活成功");
			}
		});

	} else {
		toastr.error("激活对象为空，请选择要激活的流程类型");
	}
}

/**
 * 注销流程
 */
function logoutProcessor() {
	var extParam = {};
	var categoryIds = "";
	if ($("#comapany_processorStore_Table input[name='comapanyCheckBox']:checked").length != 0) {// 判断是否选中对象
		$("#comapany_processorStore_Table").find(":checkbox:checked").each(
				function() {// 获取选择行的id
					var val = $(this).parent().next().text();
					categoryIds = categoryIds + val + "`";
				});
		categoryIds = categoryIds.substring(0, categoryIds.length - 1);
		extParam.extJsonList = categoryIds;
		$.ajax({
			url : '../proCategroy/logoutProCategory.action',
			dataType : "json",
			cache : false,
			async : false,
			data : {
				extParam : JSON.stringify(extParam)
			},
			success : function() {
				loadProcessor();
				toastr.success("注销成功");
			}
		});

	} else {
		toastr.error("注销对象为空，请选择要注销的流程类型");
	}
}

/**
 * 删除流程
 */
function deleteProcessor() {
	var extParam = {};
	var categoryIds = "";
	if ($("#comapany_processorStore_Table input[name='comapanyCheckBox']:checked").length != 0) {// 判断是否选中对象
		$("#comapany_processorStore_Table").find(":checkbox:checked").each(
				function() {// 获取选择行的id
					var val = $(this).parent().next().text();
					categoryIds = categoryIds + val + "`";
				});
		categoryIds = categoryIds.substring(0, categoryIds.length - 1);
		extParam.extJsonList = categoryIds;
		$.ajax({
			url : '../proCategroy/deleteProCategory.action',
			dataType : "json",
			cache : false,
			async : false,
			data : {
				extParam : JSON.stringify(extParam)
			},
			success : function(extMessage) {
				loadProcessor();
			}
		});

	} else {
		toastr.error("删除对象为空，请选择要删除的流程类型");
	}
}

/**
 * 为产品添加流程
 */
function settingProcessor() {
	var processorCgIds = "";
	var ProductId = "";
	var extParam = {};
	if ($("input[name='loadproductCheckBox']:checked").length == 1) {
		if ($("input[name='comapanyCheckBox']:checked").length != 0) {
			$("#comapany_processorStore_Table").find(":checkbox:checked").each(
					function() {// 获取选择行的id
						var val = $(this).parent().next().text();
						processorCgIds = processorCgIds + val + "`";
					});
			processorCgIds = processorCgIds.substring(0,
					processorCgIds.length - 1);
			extParam.extJsonList = processorCgIds;
			ProductId = $("#comapany_productStore_Table").find(
					":checkbox:checked").val();
			extParam.param1 = ProductId;
			$
					.ajax({
						url : '../productCategory/settingProcessorCategroy.action',
						dataType : "json",
						cache : false,
						async : false,
						data : {
							extParam : JSON.stringify(extParam)
						},
						success : function(extMessage) {
							$
									.ajax({
										url : '../proCategroy/findProcCgByProdCgId.action?categoryId='
												+ ProductId,
										dataType : "json",
										cache : false,
										async : false,
										success : function(result) {
											// 获取到的添加到流程信息列表中
											// 1. 标题
											$('#strong_div').empty();
											$('#strong_div')
													.append(
															'<strong><i class="icon-list"></i>['
																	+ comapanyName
																	+ ']已设置的流程</strong>');
											// 删除前一次查询的数据
											$(
													'#product_table input[type="hidden"]')
													.remove();
											$('#product_table tr[class=info]')
													.remove();
											// 循环加入该产品已经设置的流程
											for (var i = 0; i < result.length; i++) {
												$('#product_table')
														.append(
																'<tr class="info"><td><input name="productCheckBox" type="checkbox" /></td><input name="hidden_categoryId" type="hidden" value="'
																		+ result[i].categoryId
																		+ '"/><td>'
																		+ result[i].categoryName
																		+ '</td></tr>');
											}
										}
									});
							toastr.success(extMessage.meassage);
						},
						error : function(extMessage) {
							toastr.error(extMessage.meassage);
						}
					});
		} else {
			toastr.error("请选择要为产品添加的流程");
		}
	} else if ($("input[name='loadproductCheckBox']:checked").length == 0) {
		toastr.error("请选择一件产品进行流程的添加");
	} else {
		toastr.error("同一时间段只能为一种产品进行流程的添加");
	}

}

/**
 * 删除产品中的流程
 */
function deleteProcessorToProduct() {
	var processorCgIds = "";
	var ProductId = "";
	var extParam = {};
	if ($("input[name='loadproductCheckBox']:checked").length == 1) {
		if ($("input[name='productCheckBox']:checked").length != 0) {
			$("#product_table").find(":checkbox:checked").each(
					function() {
						var val = $(this).parents("tr").find(
								"input[type = hidden]").val();
						processorCgIds = processorCgIds + val + "`";
					});
			processorCgIds = processorCgIds.substring(0,
					processorCgIds.length - 1);
			extParam.extJsonList = processorCgIds;
			ProductId = $("#comapany_productStore_Table").find(
					":checkbox:checked").val();
			extParam.param1 = ProductId;
			$
					.ajax({
						url : '../productCategory/deleteProcessorToProduct.action',
						dataType : "json",
						cache : false,
						async : false,
						data : {
							extParam : JSON.stringify(extParam)
						},
						success : function(extMessage) {
							$
									.ajax({
										url : '../proCategroy/findProcCgByProdCgId.action?categoryId='
												+ ProductId,
										dataType : "json",
										cache : false,
										async : false,
										success : function(result) {
											// 获取到的添加到流程信息列表中
											// 1. 标题
											$('#strong_div').empty();
											$('#strong_div')
													.append(
															'<strong><i class="icon-list"></i>['
																	+ comapanyName
																	+ ']已设置的流程</strong>');
											// 删除前一次查询的数据
											$(
													'#product_table input[type="hidden"]')
													.remove();
											$('#product_table tr[class=info]')
													.remove();

											// 循环加入该产品已经设置的流程
											for (var i = 0; i < result.length; i++) {
												$('#product_table')
														.append(
																'<tr class="info"><td><input name="productCheckBox" type="checkbox" /></td><input name="hidden_categoryId" type="hidden" value="'
																		+ result[i].categoryId
																		+ '"/><td>'
																		+ result[i].categoryName
																		+ '</td></tr>');
											}
										}
									});
							toastr.success(extMessage.meassage);
						},
						error : function(extMessage) {
							toastr.error(extMessage.meassage);
						}
					});
		} else {
			toastr.error("请选择删除的流程");
		}
	} else {
		toastr.error("同一时间段只能为一种产品进行流程的删除");
	}
}