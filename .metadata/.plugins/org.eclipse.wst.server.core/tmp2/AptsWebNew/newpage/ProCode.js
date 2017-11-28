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
 * 初始化二维码管理界面
 */
function createProCodeManagePanel() {
	$.get("../newpage/ProCode.html", function(data) {
		$("#content").html(data);
		// 加载code模板信息
		findCodeList();
		// 加载公司产品信息
		productStore();
		initProCode_select();
	});

}

/**
 * 下拉框初始化
 */
function initProCode_select() {
	$("#ModelQr_Form_Select").select2({
		minimumResultsForSearch : -1,
		width : "160px",
		placeholder : "选择二维码模板.."
	});
}

/**
 * 生成二维码
 */
function addProCode() {
	$('#DownloadModel').modal('hide');
	/**
	 * ajax异步添加信息
	 */
	// 获得二维码的类型(0为普通二维码，1为溯源二维码)
	var codeType = $('#ModelQr_Form input:radio[type=radio]:checked').val();
	// 获得二维码数量
	var codeCount = 0;
	codeCount = $('#codeCount').val();
	// 获得二维码模板类型
	var TdCodeType = $('#ModelQr_Form_Select option:selected').val();
	// 获得字段名
	var templateKey = "";
	$("#ModelQr_Form input[name=templateName]").serializeArray().map(
			function(x) {
				if (x.value != null && x.value != "") {
					templateKey = templateKey + x.value + "`";
				}
			});
	templateKey = templateKey.substring(0, templateKey.length - 1);
	// 如果为空，提示要选择二维码模板类型
	if (codeType != 0 && codeType != 1) {
		clearForm();
		toastr.error("请选择二维码类型,再重新提交!");
	} else if (TdCodeType == null || TdCodeType == "") {
		clearForm();
		toastr.error("请选择二维码模板类型,再重新提交!");
	} else if (codeCount == 0) {
		clearForm();
		toastr.error("请确认生成模板的数量,再重新提交!");
	} else if (templateKey == "") {
		clearForm();
		toastr.error("请完成模板信息的填写,再重新提交!");
	} else {
		// 不为空，提交信息
		$.ajax({
			url : '../createCode/createTDCode.action',
			cache : false,
			async : false,
			type : "POST",
			dataType : "json",
			data : {
				templateValue : templateKey,
				codeCount : codeCount,
				codeType : TdCodeType
			},
			success : function(result) {
				// 弹出模态框确认是否下载
				$('#addQRModel').on('hide.bs.modal', function() {
					$('#DownloadModel').modal();
				});

				clearForm();
			}
		});
	}

}
/**
 * 清空表单
 */
function clearForm() {
	// 每次点击下载或查看或取消后就清空表单数据
	$(':input', '#ModelQr_Form').not(':button, :submit, :reset, :hidden').val(
			'').removeAttr('checked').removeAttr('selected');
	optioned();
}

/**
 * 生成二维码模板
 */
function addCodeModel() {
	var templateKey = "";
	var templateName = "";
	// 把多个字段信息转为字符串
	$("#ProCode_Form input[name=templateName]").serializeArray().map(
			function(x) {
				if (x.value != null && x.value != "") {
					templateKey = templateKey + x.value + "`";
				}
			});
	templateKey = templateKey.substring(0, templateKey.length - 1);
	// 找到模板名称
	$("#ProCode_Form input[name=templateKey]").serializeArray().map(
			function(x) {
				templateName = x.value;
			});
	$.ajax({
		url : '../createCode/createTDCodeTem.action',
		cache : false,
		async : false,
		type : "POST",
		dataType : "json",
		data : {
			templateKey : templateKey,
			templateName : templateName
		},
		success : function(result) {
			if (result.successOrFalse == "success") {

				// 模态框消失
				$('#addModel').modal('hide');
				// 重新加载页面
				findCodeList();
				// 弹出提示信息
				toastr.success(result.meassage);
			} else {
				$('#addModel').modal('hide');
				toastr.error(result.meassage);
			}
		}
	});
}
/**
 * 修改二维码模板
 */
function modifyCodeModel() {
	// 获取表格信息
	var templateId = "";
	var templateKey = "";
	var templateName = "";
	// 获取id
	templateId = $('#ModifyProCode_Form input[name=templateId]').val();
	// 把多个字段信息转为字符串
	$("#ModifyProCode_Form input[name=templateKey]").serializeArray().map(
			function(x) {
				if (x.value != null && x.value != "") {
					templateKey = templateKey + x.value + "`";
				}
			});
	templateKey = templateKey.substring(0, templateKey.length - 1);
	// 找到模板名称
	$("#ModifyProCode_Form input[name=templateName]").serializeArray().map(
			function(x) {
				templateName = x.value;
			});
	if (templateName == "") {
		toastr.error("模板名称不能为空，不修改请按原名填写");
	} else if (templateKey == "") {
		toastr.error("模板不能为空，不修改请按字段填写");
	} else {
		$.ajax({
			url : '../createCode/updateTDCodeTem.action',
			cache : false,
			async : false,
			type : "POST",
			dataType : "json",
			data : {
				templateId : templateId,
				templateKey : templateKey,
				templateName : templateName
			},
			success : function(result) {
				console.info(result);
				if (result.successOrFalse == "success") {
					// 模态框消失
					$('#editModel').modal('hide');
					// 查询所有二维码模板并显示
					findCodeList();
					// 弹出提示信息
					toastr.success(result.meassage);
				} else {
					$('#editModel').modal('hide');
					toastr.error(result.meassage);
				}
			}
		});
	}
}

/**
 * 删除二维码模板
 */
function deleteCodeModel() {
	// 获取该行的id，传id到后台
	var tempateId = "";
	if ($("input[name='checkbox']:checked").length != 0) {// 判断是否选中对象
		$("#CodeList_table").find(":checkbox:checked").each(function() {// 获取选择行的id
			var val = $(this).parent().next().text();
			tempateId = tempateId + val + "`";
		});
		tempateId = tempateId.substring(0, tempateId.length - 1);
	} else {
		toastr.error("删除对象为空，请选择要删除的二维码模板");
	}
	$.ajax({
		url : '../createCode/deleteTDCodeTem.action',
		cache : false,
		async : false,
		type : "POST",
		dataType : "json",
		data : {
			extParam : tempateId
		},
		success : function(result) {
			findCodeList();
			toastr.success(result.meassage);
		}
	});
}

/**
 * 生成二维码更多信息
 */
function addModelMessage() {
	/* 在点击时加上一个字段 */
	$('#ProCode_Table')
			.append(
					'<tr><th>字段：<input type="text" class="form-control" placeholder="请输入字段信息" name="templateName"/></th></tr>');
}

/**
 * 动态添加信息为一个表格的形式
 */
function findCodeList() {
	$
			.ajax({
				url : '../createCode/findCodeTemplateByCompanyId.action',
				dataType : "json",
				cache : false,
				async : false,
				success : function(result) {
					// 删除前一次添加进来的数据
					$('#CodeList_table tr').detach();
					// 加标题
					$('#CodeList_table')
							.append(
									'<tr class="active"><th><input type="checkbox" name="ProCode" onclick="checkAll()"id="ProCodeCheck" /></th><th style="display: none;">模板代码</th><th>模板名称</th><th>模板信息</th><th>操作</th></tr>');
					// js控制展现
					for (var i = 0; i < result.length; i++) {
						$('#CodeList_table')
								.append(
										'<tr class="info"><td><input type="checkbox" name="checkbox"/></td><td style="display:none;">'
												+ result[i].id
												+ '</td><td>'
												+ result[i].templateName
												+ '</td><td>'
												+ result[i].templateKey
												+ '</td><td><button type="button" class="btn btn-info btn-xs" data-toggle="modal" data-target="#editModel" onclick="loadMeassage('
												+ (i + 1)
												+ ')">修改</button> <button type="button" class="btn btn-success btn-xs" data-toggle="modal" data-target="#seeModel" onclick="seeMeassage('
												+ (i + 1)
												+ ')">查看</button></td></tr>');
					}
				}
			});
}

/**
 * 通过表格索引加载每次修改的表单信息到table中
 * 
 * @param index
 */
function loadMeassage(index) {
	// 返回索引，通过索引找内容
	var templateId;
	var templateName;
	var templateKey;
	var keys = [];
	// 模板Id
	templateId = $('#CodeList_table tr:eq(' + (index) + ') td:eq(1)').text();
	// 模板名
	templateName = $('#CodeList_table tr:eq(' + (index) + ') td:eq(2)').text();
	// 模板字段
	templateKey = $('#CodeList_table tr:eq(' + (index) + ') td:eq(3)').text();
	// 把字段转字符串
	keys = templateKey.split("`");
	// 删除前一次添加进来的数据
	$('#ModifyCodeModel_Table td').remove();
	// 把模板id加进来，设置其不可见
	$('#ModifyCodeModel_Table')
			.append(
					'<tr style="display:none;"><td >模板代号：<input type="text"  class="form-control"  name="templateId" value="'
							+ templateId + '" disabled/></td></tr>');
	// 把找到的内容用模态框显示
	$('#ModifyCodeModel_Table')
			.append(
					'<tr><td>模板名称：<input type="text" class="form-control" name="templateName" value="'
							+ templateName + '"/></td></tr>');

	// 循环把字段加进来
	for (var i = 0; i < keys.length; i++) {
		$('#ModifyCodeModel_Table')
				.append(
						'<tr><td>字段'
								+ (i + 1)
								+ '：<input type="text" class="form-control" name="templateKey" value="'
								+ keys[i] + '"/></td></tr>');
	}
}

/**
 * 查看模板信息
 * 
 * @param index
 */
function seeMeassage(index) {
	// 返回索引，通过索引找内容
	var templateName;
	var templateKey;
	var keys = [];
	// 模板名
	templateName = $('#CodeList_table tr:eq(' + (index) + ') td:eq(2)').text();
	// 模板字段
	templateKey = $('#CodeList_table tr:eq(' + (index) + ') td:eq(3)').text();
	// 把字段转字符串
	keys = templateKey.split("`");
	// 删除前一次添加进来的数据
	$('#seeCodeModel_Table td').remove();
	// 把找到的内容用模态框显示
	$('#seeCodeModel_Table').append(
			'<tr><td>模板名称：<label>' + templateName + '</label></td></tr>');

	// 循环把字段加进来
	for (var i = 0; i < keys.length; i++) {
		$('#seeCodeModel_Table').append(
				'<tr><td>字段' + (i + 1) + '：<label>' + keys[i]
						+ '</label></td></tr>');
	}
}

/**
 * 动态添加下拉框中的模板信息
 */
function addOptions() {
	// 加载产品
	var productValue = "";
	if ($("#productStore_Table input[type='checkbox']:checked").length == 1) {// 判断是否选中对象

		productValue = $("#productStore_Table").find(":checkbox:checked")
				.parent().next().text();
		// 清空所加项目
		$('#ModelQr_Form_Product').empty();
		$('#ModelQr_Form_Product')
				.append(
						'<label class="col-sm-3 control-label">产品名称：</label><div class="col-sm-9"><input type="text" class="form-control disabled"placeholder="'
								+ productValue + '" disabled /></div>');

		// 从数据库中得到数据，返回添加
		$.ajax({
			url : '../createCode/findCodeTemplateByCompanyId.action',
			dataType : "json",
			cache : false,
			async : false,
			success : function(result) {
				clearForm();
				// 删除前一次添加进来的数据
				$('#ModelQr_Form_Table tr').remove();
				$('#ModelQr_Form_Select option').remove();
				initProCode_select();
				// js控制展现
				for (var i = 0; i < result.length; i++) {
					$('#ModelQr_Form_Select').append(
							'<option value="' + result[i].templateName + '">'
									+ result[i].templateName + '</option>');
				}
			}
		});
		$("#addQRModel").modal();
	} else {
		$("#addQRModel").modal('hide');
		toastr.error("每次生成二维码不能为空或多于一个，请确认");
	}
}

/**
 * 动态添加二维码模板字段
 */
function optioned() {
	var templateKey = "";
	var keys = [];
	var selectValue;
	// 获得下拉选择框的值
	selectValue = $('#ModelQr_Form_Select option:selected').text();
	// 获取到字段信息
	$
			.ajax({
				url : '../createCode/findCodeTemplateByCompanyId.action',
				dataType : "json",
				cache : false,
				async : false,
				success : function(result) {
					for (var i = 0; i < result.length; i++) {
						// 判断是否和模板名相同
						if (result[i].templateName == (selectValue)) {
							// 相同分成数组
							keys = result[i].templateKey.split("`");
						}
					}
					// 删除之前一次点击添加的字段
					$('#ModelQr_Form_Table tr').remove();
					// 动态添加模板信息
					for (var i = 0; i < keys.length; i++) {
						$('#ModelQr_Form_Table')
								.append(
										'<tr><th style="text-align: right;">'
												+ keys[i]
												+ '</th><td><input type="text" class="form-control" name="templateName"/></td></tr>')
					}
				}
			});
}

/**
 * 下载生成的二维码信息
 */
function downloadCode() {
	$('#DownloadModel').modal('hide');
	window.open("../createCode/downloadTDCode.action",
			'height=500,width=611,scrollbars=yes,status =yes');
}

/**
 * 查询该公司所有产品
 */
function productStore() {
	$.ajax({
		url : '../productCategory/findProductCategoryByCompanyId.action',
		dataType : "json",
		cache : false,
		async : false,
		success : function(result) {
			for (var i = 0; i < result.length; i++) {
				$('#productStore_Table').append(
						'<tr class="info"><td><input type="checkbox" value='
								+ result[i].categoryId + '/></td><td>'
								+ result[i].categoryName + '</td><td>'
								+ result[i].categoryDescription + '</td></tr>')
			}
		}
	});
}
