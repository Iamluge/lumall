/**
 * 用于设置添加字段的个数
 */
var index = 0;

/**
 * 用于设置录入信息的数量
 */
var messageIndex = 1;
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
 * 初始化商家信息设置
 */
function createCustomInfoTempleManage() {
	$.get("../newpage/CustomInfoTempleManage.html", function(data) {
		$("#content").html(data);
		// 加载公司产品
		processorLoadproduct();
	});
}

/**
 * 加载商家产品
 */
function processorLoadproduct() {
	$
			.ajax({
				url : '../productCategory/findProductCategoryByCompanyId.action',
				dataType : "json",
				cache : false,
				async : false,
				success : function(result) {
					for (var i = 0; i < result.length; i++) {
						$('#comapany_processorInfoManage_Table')
								.append(
										'<tr class="info"><td><input name="processorloadproductCheckBox" type="checkbox" value='
												+ result[i].categoryId
												+ ' onchange="processorfindproduct('
												+ i
												+ ')"/></td><td>'
												+ result[i].categoryName
												+ '</td><td>'
												+ result[i].categoryDescription
												+ '</td></tr>')
					}
				}
			});
}

/**
 * 加载产品的流程模板
 */
function processorfindproduct(index) {
	var categoryId;
	var catagoryName;
	// 判断选中的个数
	if ($("input[name='processorloadproductCheckBox']:checked").length > 1) {
		toastr.error("请选择一个产品进行查看模板流程，不能多出一个");
	} else if ($("input[name='processorloadproductCheckBox']:checked").length == 1) {
		categoryId = $("#comapany_processorInfoManage_Table").find(
				":checkbox:checked").val();
		comapanyName = $("#comapany_processorInfoManage_Table").find(
				":checkbox:checked").parent().next().text();
		// 根据id获取流程信息
		$
				.ajax({
					url : '../proInfoTemplate/findProInfoTemplateByProdId.action?prodId='
							+ categoryId,
					dataType : "json",
					cache : false,
					async : false,
					success : function(result) {
						$('#processor_strong_div').empty();
						$('#processor_strong_div').append(
								'<strong><i class="icon-list"></i>['
										+ comapanyName + ']已设置的流程</strong>');
						// 删除前一次查询的数据
						$('#processorInfoManage_table tr[class=info]').remove();
						$('#processorInfoManage_table input[type=hidden]')
								.remove();
						// 循环加入该产品已经设置的流程
						for (var i = 0; i < result.length; i++) {
							$('#processorInfoManage_table')
									.append(
											'<tr class="info"><td width="5%"><input type="checkbox" name = "processorProductCheckBox"/></td><input name="hidden_categoryId"  type="hidden" value="'
													+ result[i].templateId
													+ '"/><td width="10%">'
													+ result[i].templateName
													+ '</td><td width="20%">'
													+ result[i].description
													+ '</td><td width="30%"><button class="btn btn-info" type="button" onclick="setProcessorInfoManageFun()">设置字段</button>&nbsp;<a class="btn btn-success" type="button" onclick="seeProcessorInfoManageFun()">查看字段</a>&nbsp;<a class="btn btn-warning" type="button" onclick="deleteProcessorInfoManageFun()">修改字段</a>&nbsp;<a class="btn btn-info " type="button" onclick="seeProcessorInfoManage(seeAddProcessorInfoManageModal.id)">查看已录信息</a></td></tr>');
						}
					}
				});
	}
}

/**
 * 加载模板模态框
 */
function addProcessorInfoManageFun() {
	// 判断是否有一个产品被选中
	if ($("input[name='processorloadproductCheckBox']:checked").length != 1) {
		toastr.error("请选择一个产品进行添加模板流程，不能多出一个");
	} else if ($("input[name='processorloadproductCheckBox']:checked").length == 1) {
		$('#addProcessorInfoManage').modal();
	}
}

/**
 * 添加模板
 */
function addProcessorInfoManage() {
	var extJson = {};
	var extParam = {};
	extJson.templateName = $(
			'#addProcessorInfoManage_table input[name=ProcessorInfoManageName]')
			.val();
	extJson.description = $('#ProcessorInfoManagedescription').val();
	var id = $("#comapany_processorInfoManage_Table").find(":checkbox:checked")
			.val();
	extParam.extJsons = JSON.stringify(extJson);
	extParam.param1 = id;
	if (extJson.templateName == null || extJson.templateName == "") {
		toastr.error("模板名称不能为空！");
		addProcessorInfoManageFun();
	} else if ((extJson.templateName != null || extJson.templateName != "")
			&& (extJson.description != null || extJson.description != "")) {
		$
				.ajax({
					method : "POST",
					url : '../proInfoTemplate/AddTemplate.action',
					dataType : "json",
					cache : false,
					async : false,
					data : {
						extParam : JSON.stringify(extParam)
					},
					success : function(result) {
						var sof = result.successOrFalse;
						if (sof == "success") {
							$('#addProcessorInfoManage').modal('hide');
							toastr.success(result.meassage);
						} else if (sof == "false") {
							toastr.error(result.meassage);
						}
						$
								.ajax({
									url : '../proInfoTemplate/findProInfoTemplateByProdId.action?prodId='
											+ id,
									dataType : "json",
									cache : false,
									async : false,
									success : function(result) {
										$('#processor_strong_div').empty();
										$('#processor_strong_div').append(
												'<strong><i class="icon-list"></i>['
														+ comapanyName
														+ ']已设置的流程</strong>');
										// 删除前一次查询的数据
										$(
												'#processorInfoManage_table tr[class=info]')
												.remove();
										$(
												'#processorInfoManage_table input[type=hidden]')
												.remove();
										// 循环加入该产品已经设置的流程
										for (var i = 0; i < result.length; i++) {
											$('#processorInfoManage_table')
													.append(
															'<tr class="info"><td width="5%"><input type="checkbox" name = "processorProductCheckBox"/></td><input name="hidden_categoryId"  type="hidden" value="'
																	+ result[i].templateId
																	+ '"/><td width="10%">'
																	+ result[i].templateName
																	+ '</td><td width="20%">'
																	+ result[i].description
																	+ '</td><td width="30%"><button class="btn btn-info" type="button" onclick="setProcessorInfoManageFun()">设置字段</button>&nbsp;<a class="btn btn-success" type="button" onclick="seeProcessorInfoManageFun()">查看字段</a>&nbsp;<a class="btn btn-warning" type="button" onclick="deleteProcessorInfoManageFun()">修改字段</a>&nbsp;<a class="btn btn-info " type="button" onclick="seeProcessorInfoManage(seeAddProcessorInfoManageModal.id)">查看已录信息</a></td></tr>');
										}
									}
								});
					}
				});
	}
}

/**
 * 重置
 */
function cleanProcessorInfoManage() {
	$(':input', '#addProcessorInfoManage_table').not(
			':button, :submit, :reset, :hidden').val('').removeAttr('checked')
			.removeAttr('selected');
}

/**
 * 删除/批量删除流程模板
 */
function deleteProcessorInfoManage() {
	var extParam = {};
	var proInfoTemplateIds = "";
	var categoryId;
	if ($("input[name='processorloadproductCheckBox']:checked").length == 1) {
		if ($("input[name='processorProductCheckBox']:checked").length != 0) {// 判断是否选中对象
			$("#processorInfoManage_table").find(":checkbox:checked").each(
					function() {
						var val = $(this).parents("tr").find(
								"input[type = hidden]").val();
						proInfoTemplateIds = proInfoTemplateIds + val + "`";
					});
			proInfoTemplateIds = proInfoTemplateIds.substring(0,
					proInfoTemplateIds.length - 1);
			extParam.extJsonList = proInfoTemplateIds;
			$
					.ajax({
						url : '../proInfoTemplate/deleteProInfoTemplate.action',
						dataType : "json",
						cache : false,
						async : false,
						data : {
							extParam : JSON.stringify(extParam)
						},
						success : function() {
							categoryId = $(
									"#comapany_processorInfoManage_Table")
									.find(":checkbox:checked").val();
							$
									.ajax({
										url : '../proInfoTemplate/findProInfoTemplateByProdId.action?prodId='
												+ categoryId,
										dataType : "json",
										cache : false,
										async : false,
										success : function(result) {
											$('#processor_strong_div').empty();
											$('#processor_strong_div')
													.append(
															'<strong><i class="icon-list"></i>['
																	+ comapanyName
																	+ ']已设置的流程</strong>');
											// 删除前一次查询的数据
											$(
													'#processorInfoManage_table tr[class=info]')
													.remove();
											$(
													'#processorInfoManage_table input[type=hidden]')
													.remove();
											// 循环加入该产品已经设置的流程
											for (var i = 0; i < result.length; i++) {
												$('#processorInfoManage_table')
														.append(
																'<tr class="info"><td width="5%"><input type="checkbox" name = "processorProductCheckBox"/></td><input name="hidden_categoryId"  type="hidden" value="'
																		+ result[i].templateId
																		+ '"/><td width="10%">'
																		+ result[i].templateName
																		+ '</td><td width="20%">'
																		+ result[i].description
																		+ '</td><td width="30%"><button class="btn btn-info" type="button" onclick="setProcessorInfoManageFun()">设置字段</button>&nbsp;<a class="btn btn-success" type="button" onclick="seeProcessorInfoManageFun()">查看字段</a>&nbsp;<a class="btn btn-warning" type="button" onclick="deleteProcessorInfoManageFun()">修改字段</a>&nbsp;<a class="btn btn-info " type="button" onclick="seeProcessorInfoManage(seeAddProcessorInfoManageModal.id)">查看已录信息</a></td></tr>');
											}
										}
									});
						}
					});
		} else {
			toastr.error("删除对象为空，请选择要删除的产品模板");
		}
	} else {
		toastr.error("同一时间段只能为一种产品进行删除模板操作，请确认");
	}
}
/**
 * 加载设置字段模态框
 */
function setProcessorInfoManageFun() {
	var ProcessorName;
	ProcessorName = $("#processorInfoManage_table").find(":checkbox:checked")
			.parents("tr").children("td").eq(1).text();
	// 判断是否有一个流程类型被选中
	if ($("input[name='processorProductCheckBox']:checked").length != 1) {
		toastr.error("请选择一个模板流程进行设置字段，不能多出一个");
	} else if ($("input[name='processorProductCheckBox']:checked").length == 1) {
		$('#setProcessorInfoManageModal').modal();
		// 删除前一次加进来的信息
		$('#setProcessorInfoManageLanel').empty();
		$('#setProcessorInfoManage_table').empty();
		$('#setProcessorInfoManageLanel').append(
				'模板信息：<input class="form-control" type="text" value="'
						+ ProcessorName + '" disabled/>');
		$('#setProcessorInfoManage_table')
				.append(
						'<tr><td><label class="col-sm-12 control-label" id="setProcessorInfoManageLanel">模板字段</label></td></tr>');
	}
}

/**
 * 添加更多字段
 */
function addProcessorInfoManageMessage() {
	$('#setProcessorInfoManage_table')
			.append(
					'<tr><td>字段：<input type="text" class="form-control" placeholder="请输入字段信息" name="templateName'
							+ index
							+ '"/></td><td>类型:<br><select id="typeSelect'
							+ index
							+ '" name="typeSelect'
							+ index
							+ '" class="form-control"></select></td></tr>');
	addSelect(index);
	index++;
}

/**
 * 动态加载下拉选择框的内容
 */
function addSelect(index) {
	$.ajax({
		url : '../data/indexType.json',
		dataType : "json",
		success : function(data) {
			$("#" + "typeSelect" + index + "").empty();// 清空下拉框
			$("#" + "typeSelect" + index + "").append('<option></option>');
			$.each(data.list, function(i, item) {
				$("#" + "typeSelect" + index + "").append(
						"<option value='" + item.indexTypeId + "'>"
								+ item.typeName + "</option>");
			});
			
			$("#" + "typeSelect" + index + "").select2({
				minimumResultsForSearch : -1,
				width : "200px",
				placeholder : "选择字段类型.."
			});
		}
	});
}

/**
 * 提交流程模板字段
 */
function submitProcessorInfoManage() {
	var extParam = {};
	var extIndex = {};
	var indexs = "";
	var proInfoTemplateId = "";
	if ($("#processorInfoManage_table").find(":checkbox:checked").length == 1) {
		$("#processorInfoManage_table").find(":checkbox:checked").each(
				function() {
					proInfoTemplateId = $(this).parents("tr").find(
							"input[type = hidden]").val();
				});
		extParam.param1 = proInfoTemplateId;
		for (var i = 0; i < index; i++) {
			// 获取字段的名称
			extIndex.indexType = $('select[name=typeSelect' + i + ']').val()
			extIndex.indexName = $('input[name =templateName' + i + ' ]').val()
			indexs = indexs + JSON.stringify(extIndex) + "`";
		}
		indexs = indexs.substring(0, indexs.length - 1);
		extParam.extJsonList = indexs;
		$.ajax({
			url : '../proInfoIndex/settingIndexToTemplate.action',
			dataType : "json",
			cache : false,
			async : false,
			method : "POST",
			data : {
				extParam : JSON.stringify(extParam)
			},
			success : function(result) {
				var sof = result.successOrFalse;
				if (sof == "success") {
					toastr.success(result.meassage);
					index = 0;
				} else if (sof == "false") {
					toastr.error(result.meassage);
				}
				$('#setProcessorInfoManageModal').modal('hide');
			}
		});
	} else {
		toastr.error("每次设置字段的模板只能为一个");
	}
}

/**
 * 加载修改流程模态框
 */
function deleteProcessorInfoManageFun() {
	var proInfoTemplateId = "";
	// 加载所有流程信息
	// 判断是否有选中一个流程，多于一个或少于一个都不行
	if ($("#processorInfoManage_table").find(":checkbox:checked").length == 0) {
		toastr.error("请选择一个流程模板进行修改字段");
	} else if ($("#processorInfoManage_table").find(":checkbox:checked").length > 1) {
		toastr.error("每次只能对一个流程模板进行修改字段，请确认");
	} else if ($("#processorInfoManage_table").find(":checkbox:checked").length == 1) {

		$("#processorInfoManage_table").find(":checkbox:checked").each(
				function() {
					proInfoTemplateId = $(this).parents("tr").find(
							"input[type = hidden]").val();
				});
		// 获取字段数据
		$
				.ajax({
					method : "POST",
					url : '../proInfoIndex/findIndexByTemplateId.action?templateId='
							+ proInfoTemplateId,
					dataType : "json",
					cache : false,
					async : false,
					success : function(result) {
						$('#deleteProcessorInfoManage_table tr').remove();
						// 添加主标题
						$('#deleteProcessorInfoManage_table')
								.append(
										'<tr ><td colspan="3"><label class="col-sm-12 control-label"id="deleteProcessorInfoManage">修改字段</label></td></tr>');
						// 添加表格子标题
						$('#deleteProcessorInfoManage_table')
								.append(
										'<tr class="info"><td width="5%"><input type="checkbox" /></td><td>字段名</td><td>字段类型</td></tr>');
						for (var i = 0; i < result.length; i++) {
							$('#deleteProcessorInfoManage_table')
									.append(
											'<tr><td width="5%"><input type="checkbox" name = "processorProductCheckBox" /></td><td><input type="text" name="EditTemplateName'
													+ i
													+ '" class="form-control"value="'
													+ result[i].indexName
													+ '"></input></td><td><select id="EditTypeSelect'
													+ i
													+ '" name="EditTypeSelect'
													+ i
													+ '" class="form-control"></select></td></tr>');
							addSelectById(i, result[i].indexType);
						}
					}
				});
		$('#deleteProcessorInfoManageModal').modal();
	}
}

/**
 * 动态加载有默认项的下拉选择框
 * 
 * @param index
 */
function addSelectById(index, data) {
	var typeId = data;
	$.ajax({
		url : '../data/indexType.json',
		dataType : "json",
		success : function(data) {
			$("#" + "EditTypeSelect" + index + "").empty();// 清空下拉框
			$("#" + "EditTypeSelect" + index + "").append('<option></option>');
			$.each(data.list, function(i, item) {
				if (typeId == item.indexTypeId) {
					$("#" + "EditTypeSelect" + index + "").append(
							"<option selected value='" + item.indexTypeId
									+ "'>" + item.typeName + "</option>");
				} else {
					$("#" + "EditTypeSelect" + index + "").append(
							"<option value='" + item.indexTypeId + "'>"
									+ item.typeName + "</option>");
				}
			});
			$("#" + "EditTypeSelect" + index + "").select2({
				minimumResultsForSearch : -1,
				width : "200px",
				placeholder : "选择字段类型.."
			});
		}
	});
}

/**
 * 查看流程模板信息
 */
function seeProcessorInfoManageFun() {
	var proInfoTemplateId = "";
	// 加载所有流程信息
	// 判断是否有选中一个流程，多于一个或少于一个都不行
	if ($("#processorInfoManage_table").find(":checkbox:checked").length == 0) {
		toastr.error("请选择一个流程模板进行查看字段");
	} else if ($("#processorInfoManage_table").find(":checkbox:checked").length > 1) {
		toastr.error("每次只能对一个流程模板进行查看字段，请确认");
	} else if ($("#processorInfoManage_table").find(":checkbox:checked").length == 1) {
		$("#processorInfoManage_table").find(":checkbox:checked").each(
				function() {
					proInfoTemplateId = $(this).parents("tr").find(
							"input[type = hidden]").val();
				});
		// 获取字段数据
		$
				.ajax({
					url : '../proInfoIndex/findIndexByTemplateId.action?templateId='
							+ proInfoTemplateId,
					dataType : "json",
					cache : false,
					async : false,
					success : function(result) {
						$('#seeProcessorInfoManage_table tr').remove();
						// 添加主标题
						$('#seeProcessorInfoManage_table')
								.append(
										'<tr ><td colspan="3"><label class="col-sm-12 control-label">查看字段</label></td></tr>');
						// 添加表格子标题
						$('#seeProcessorInfoManage_table')
								.append(
										'<tr class="info"><td>字段名</td><td>字段类型</td></tr>');
						for (var i = 0; i < result.length; i++) {
							var r = result[i];
							addTdById(r);
						}
					}
				});
		$('#seeProcessorInfoManageModal').modal();
	}
}

/**
 * 动态查看流程模板字段信息
 * 
 * @param r
 */
function addTdById(r) {
	$.ajax({
		url : '../data/indexType.json',
		dataType : "json",
		success : function(data) {
			for (var i = 0; i < data.list.length; i++) {
				if (r.indexType == data.list[i].indexTypeId) {
					var newValName = "";
					newValName = data.list[i].typeName;
					$('#seeProcessorInfoManage_table').append(
							'<tr><td>' + r.indexName + '</td><td>' + newValName
									+ '</td></tr>');
				}
			}
		}
	});
}

/**
 * 关闭模态框
 */
function closeSeeProcessorInfoManageModal() {
	$('#seeProcessorInfoManageModal').modal('hide');
}

/**
 * 提交模板字段信息修改信息
 */
function submitEditProcessorInfoManage() {
	var extParam = {};
	var indexs = ""
	var proInfoTemplateId = "";
	var extIndex = {};
	// 获取三个字段信
	$("#processorInfoManage_table").find(":checkbox:checked").each(
			function() {
				proInfoTemplateId = $(this).parents("tr").find(
						"input[type = hidden]").val();
			});
	extParam.param1 = proInfoTemplateId;
	var EditIndex = 0;
	EditIndex = $('#deleteProcessorInfoManage_table input[type=text]').length;
	for (var i = 0; i < EditIndex; i++) {
		// 获取字段的名称
		extIndex.indexType = $('select[name=EditTypeSelect' + i + ']').val()
		extIndex.indexName = $('input[name =EditTemplateName' + i + ' ]').val()
		indexs = indexs + JSON.stringify(extIndex) + "`";
	}
	indexs = indexs.substring(0, indexs.length - 1);
	extParam.extJsonList = indexs;
	$.ajax({
		url : '../proInfoIndex/editTemplateIndex.action',
		dataType : "json",
		cache : false,
		async : false,
		method : "POST",
		data : {
			extParam : JSON.stringify(extParam)
		},
		success : function(result) {
			var sof = result.successOrFalse;
			if (sof == "success") {
				toastr.success(result.meassage);
				index = 0;
			} else if (sof == "false") {
				toastr.error(result.meassage);
			}
			$('#deleteProcessorInfoManageModal').modal('hide');
		}
	});
}

/**
 * 查看产品流程模板已经录入的信息
 */
function seeProcessorInfoManage(data) {
	// 查出字段信息及添加字段信息
	var fieldNum = 0;
	// 查出字段并设置为表格标题
	var seeTemplateId = $('#processorInfoManage_table').find(
			":checkbox:checked").parents("tr").find("input[type = hidden]")
			.val();
	var length = $('#comapany_processorInfoManage_Table').find(
			":checkbox:checked").length;
	if (length == 1) {
		$.ajax({
			url : '../proInfoIndex/findIndexByTemplateId.action?templateId='
					+ seeTemplateId,
			dataType : "json",
			cache : false,
			async : false,
			success : function(result) {
				// 字段个数
				fieldNum = result.length;
				$('#seeAddProcessorInfoManage_table  tr[class="active"]')
						.empty();
				for (var i = 0; i < result.length; i++) {
					// 加载标题
					$('#seeAddProcessorInfoManage_table tr[class="active"]')
							.append(
									'<th style="height:10px; width:200px;">'
											+ result[i].indexName
											+ '<input type="hidden" value="'
											+ result[i].indexType + '"></th>');
				}
			}
		});
		// 打开模态框
		openaddProductProcessorModal(data);
		// 添加录入的信息
		$
				.ajax({
					url : '../proInfoIndex/findIndexValueByTemplateId.action?templateId='
							+ seeTemplateId,
					dataType : "json",
					cache : false,
					async : false,
					success : function(result) {
						$(
								'#seeAddProcessorInfoManage_table tr[name^=seeTrName]')
								.remove();
						for (var i = 0; i < result.length; i++) {
							$('#seeAddProcessorInfoManage_table').append(
									'<tr name="seeTrName' + i + '"></tr>');
							var newResult = eval("(" + result[i].value + ")");
							console.info(newResult);
							for (var j = 0; j < fieldNum; j++) {
								var key = "index" + j;
								var val = newResult[key];
								if (val == "Bno") {
									val = "不合格";
								} else if (val == "Byes") {
									val = "合格";
								} else if (val == "Ayes") {
									val = "是";
								} else if (val == "Bno") {
									val = "否";
								} else {
									val = newResult[key];
								}
								$(
										'#seeAddProcessorInfoManage_table tr[name=seeTrName'
												+ i + ']').append(
										'<td>' + val + '</td>');
							}
						}
					}
				});
	} else if (length > 1) {
		toastr.error("每次只能查看一个自定义信息模板中已录入的信息");
	} else if (length == 0) {
		toastr.error("选择一个自定义信息模板查看以录的信息");
	}
}