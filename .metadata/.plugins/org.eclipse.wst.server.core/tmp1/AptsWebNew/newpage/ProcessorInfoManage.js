/**
 * 全局变量，商家产品集合
 */
var productData = {};

/**
 * 全局变量，产品流程集合
 */
var processorData = {};

var resourceUrl = {};

var vedioUrl = {};

/**
 * 全局图片集合
 */
var ImageData;

/**
 * 全局视频集合
 */
var VedioData;
/**
 * 判断表格类型 1表示其他类型的表格 2表示自定义类型的表格
 */
var single_templateType = 0;

/**
 * 全局变量，类型数据
 */
var SingleProcessorInfoData = {};

var single_meassageType = "";
/**
 * 新增一行id
 */
var trIndex = 1;
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
 * 初始化流程管理
 */
function createProcessorInfoManage() {
	$.get("../newpage/ProcessorInfoManage.html", function(data) {
		$("#content").html(data);
		findProduct();
		loadSelect();
		loadDate();
		loadSingleProcessor();
	});

}

/**
 * 下拉菜单初始化
 */
function loadSelect() {
	// 模态框产品下拉框
	$("#table_selectProdut").select2({
		minimumResultsForSearch : -1,
		width : "160px",
		placeholder : "选择产品.."
	});
	$("#table_selectProdut").empty();// 清空下拉框
	$.each(productData, function(i, item) {
		$("#table_selectProdut").append(
				"<option value='" + item.categoryId + "'>" + item.categoryName
						+ "</option>");
	});

	// 模态框流程下拉框
	$('#table_selectProcessor').select2({
		minimumResultsForSearch : -1,
		width : "160px",
		placeholder : "选择流程.."
	});
	// 产品下拉框初始化
	$('#selectProduct').select2({
		minimumResultsForSearch : -1,
		width : "160px",
		placeholder : "选择产品.."
	});
	// 流程下拉框初始化
	$('#selectProcessor').select2({
		minimumResultsForSearch : -1,
		width : "160px",
		placeholder : "选择流程.."
	});
}

/**
 * 初始化日历
 */
function loadDate() {
	laydate({
		elem : '#startTime',
		event : 'focus',
		format : 'YYYY-MM-DD hh:mm:ss',
		istime : true,
		fixed : true,
		istoday : true
	});
	laydate({
		elem : '#endTime',
		event : 'focus',
		format : 'YYYY-MM-DD hh:mm:ss',
		istime : true,
		fixed : true
	});
}

/**
 * 找到商家产品
 */
function findProduct() {
	$.ajax({
		url : '../productCategory/findProductCategoryByCompanyId.action',
		dataType : "json",
		cache : false,
		async : false,
		success : function(result) {
			productData = result;
			selectProduct();
		}
	});
}
/**
 * 把产品添加到选择产品下拉框选项中
 */
function selectProduct() {
	$.each(productData, function(i, item) {
		$("#selectProduct").append(
				"<option value='" + item.categoryId + "'>" + item.categoryName
						+ "</option>");
	});
}

/**
 * 选中获取产品流程
 * 
 * @param data
 */
function addProductToProcessor() {
	if (single_templateType == 1) {
		$('#single_productProcessorInfoManage_otherColumns tr[class="info"]')
				.remove();
	} else if (single_templateType == 2) {
		$('#single_productProcessorInfoManage_templateColumns tr[class="info"]')
				.remove();
	}
	var categoryId = $('#selectProduct').val();
	$.ajax({
		url : '../proCategroy/findProcCgByProdCgId.action?categoryId='
				+ categoryId,
		dataType : "json",
		cache : false,
		async : false,
		success : function(result) {
			processorData = result;
			$("#selectProcessor").empty();// 清空下拉框
			$('#selectProcessor').append('<option></option>');
			$("#selectProcessor").select2({
				minimumResultsForSearch : -1,
				width : "160px",
				placeholder : "选择流程.."
			});
			$.each(processorData, function(i, item) {
				$("#selectProcessor").append(
						"<option value='" + item.categoryId + "'>"
								+ item.categoryName + "</option>");
			});
			loadAllProcessor();
			judgeSelected();
		}
	});
}

/**
 * 每次改变产品就查出所有流程
 */
function loadAllProcessor() {
	var categoryId = $('#selectProduct').val();
	$
			.ajax({
				url : '../processorInfo/findProInfoByProductCgId.action?ProductCgId='
						+ categoryId,
				dataType : "json",
				cache : false,
				async : false,
				success : function(result) {
					// 先删
					$('#productProcessorInfoManage_Table tr[class="info"]')
							.remove();
					// 添加到表格
					for (var i = 0; i < result.length; i++) {
						var startTime = result[i].startTime.replace("T", " ");
						var endTime = result[i].endTime.replace("T", " ");
						$('#productProcessorInfoManage_Table')
								.append(
										'<tr class="info"><td><input type="checkbox" value="'
												+ result[i].proInfoId
												+ '"  onclick="judgeSelected()"/></td><td>'
												+ result[i].title
												+ '</td><td>'
												+ startTime
												+ '</td><td>'
												+ endTime
												+ '</td><td>'
												+ result[i].description
												+ '</td><td>'
												+ result[i].category.categoryName
												+ '</td><td><button class="btn btn-warning btn-xs" onclick="loadEditProcessor(EditProductProcessorModal.id,'
												+ (i + 1)
												+ ')">修改</button>&nbsp;<button class="btn btn-success btn-xs" onclick="loadEditProcessor(EditProductProcessorModal.id,'
												+ (i + 1)
												+ ')">查看</button></td></tr>');
					}
				}
			});
}

/**
 * 通过产品id和流程id查询信息
 * 
 * @param processorId
 */
function submitProductProcessor(processorId) {
	var proId = processorId;
	var categoryId = $('#selectProduct').val();
	$
			.ajax({
				url : '../processorInfo/findProInfoByProcProd.action?ProductCgId='
						+ categoryId + '&procCgId=' + proId,
				dataType : "json",
				cache : false,
				async : false,
				success : function(result) {
					// 先删
					$('#productProcessorInfoManage_Table tr[class="info"]')
							.remove();
					// 添加到表格
					for (var i = 0; i < result.length; i++) {
						var startTime = result[i].startTime.replace("T", " ");
						var endTime = result[i].endTime.replace("T", " ");
						$('#productProcessorInfoManage_Table')
								.append(
										'<tr class="info"><td><input type="checkbox" value="'
												+ result[i].proInfoId
												+ '" onclick="judgeSelected()"/></td><td>'
												+ result[i].title
												+ '</td><td>'
												+ startTime
												+ '</td><td>'
												+ endTime
												+ '</td><td>'
												+ result[i].description
												+ '</td><td>'
												+ result[i].category.categoryName
												+ '</td><td><button class="btn btn-warning btn-xs" onclick="loadEditProcessor(EditProductProcessorModal.id,'
												+ (i + 1)
												+ ')">修改</button>&nbsp;<button class="btn btn-success btn-xs" onclick="loadEditProcessor(EditProductProcessorModal.id,'
												+ (i + 1)
												+ ')">查看</button></td></tr>');
					}
					judgeSelected();
				}
			});
}

/**
 * 打开增加流程信息模态框
 */
function openaddProductProcessorModal(data) {
	$('#' + data + '').modal();
}

/**
 * 关闭模态框
 */
function closeaddProductProcessorModal(data) {
	$('#' + data + '').modal('hide');
}
/**
 * 增加流程模态框加载产品流程
 */
function loadProductProcessor(data) {
	openaddProductProcessorModal(data);
	// 加载下拉框的值
	// 删除先加进来的option
	$("#table_selectProdut").empty();
	// 加载产品
	// select2插件要显示默认值，设置selected,并且select2这个插件的初始化需要在数据加载进来之后
	$.each(productData, function(i, item) {
		if (item.categoryName == $('#selectProduct option:selected').text()) {
			$("#table_selectProdut").append(
					"<option selected  value='" + item.categoryId + "'>"
							+ item.categoryName + "</option>");
		} else {
			$("#table_selectProdut").append(
					"<option value='" + item.categoryId + "'>"
							+ item.categoryName + "</option>");
		}
	});
	$("#table_selectProdut").select2({
		minimumResultsForSearch : -1,
		width : "160px",
		placeholder : "选择产品..",
	});
	$("#table_selectProcessor").empty();
	$.each(processorData, function(i, item) {
		if (item.categoryName == $('#selectProcessor option:selected').text()) {
			$("#table_selectProcessor").append(
					"<option selected  value='" + item.categoryId + "'>"
							+ item.categoryName + "</option>");
		} else {
			$("#table_selectProcessor").append(
					"<option value='" + item.categoryId + "'>"
							+ item.categoryName + "</option>");
		}
	});
	$("#table_selectProcessor").select2({
		minimumResultsForSearch : -1,
		width : "160px",
		placeholder : "选择流程..",
	});
	// 结束加载
}

/**
 * 重新产品重新加载流程
 * 
 * @param data
 */
function addLoadProcessorByProduct(data) {
	var categoryId = data;
	$.ajax({
		url : '../proCategroy/findProcCgByProdCgId.action?categoryId='
				+ categoryId,
		dataType : "json",
		cache : false,
		async : false,
		success : function(result) {
			processorData = result;
			$("#table_selectProcessor").empty();// 清空下拉框
			$('#table_selectProcessor').append('<option></option>');
			$("#table_selectProcessor").select2({
				minimumResultsForSearch : -1,
				width : "160px",
				placeholder : "选择流程.."
			});
			$.each(processorData, function(i, item) {
				$("#table_selectProcessor").append(
						"<option value='" + item.categoryId + "'>"
								+ item.categoryName + "</option>");
			});
		}
	});
}

/**
 * 修改模块选择新产品重新添加流程
 * 
 * @param data
 */
function editLoadProcessorByProduct(data) {
	var categoryId = data;
	$.ajax({
		url : '../proCategroy/findProcCgByProdCgId.action?categoryId='
				+ categoryId,
		dataType : "json",
		cache : false,
		async : false,
		success : function(result) {
			processorData = result;
			$("#table_editSelectProcessor").empty();// 清空下拉框
			$("#table_editSelectProcessor").append('<option></option>');// 清空下拉框
			$("#table_editSelectProcessor").select2({
				minimumResultsForSearch : -1,
				width : "160px",
				placeholder : "选择流程.."
			});
			$.each(processorData, function(i, item) {
				$("#table_editSelectProcessor").append(
						"<option value='" + item.categoryId + "'>"
								+ item.categoryName + "</option>");
			});
		}
	});
}

/**
 * 提交增加流程操作
 */
function submitAddProcessor() {
	var extParam = {};
	var extJson = {};
	// 获取产品和流程信息的id
	var productId = $('#table_selectProdut').val();
	var processorId = $('#table_selectProcessor').val();
	extParam.param1 = productId;
	extParam.param2 = processorId;
	// 获取其他信息
	// 标题
	extJson.title = $('#addProductProcessor_table input[name = ProcessorTitle]')
			.val();
	// 摘要
	extJson.description = $(
			'#addProductProcessor_table textarea[name = ProcessorDescription]')
			.val();
	// 开始时间
	var startTime = $('#addProductProcessor_table input[name = startTime]')
			.val();
	var endTime = $('#addProductProcessor_table input[name = endTime]').val();
	for (var i = 0; i < startTime.length; i++) {
		if (!(startTime[i] >= 0 && startTime[i] <= 9) || startTime[i] == " ") {
			startTime = startTime.replace(startTime[i], "");
		}
	}
	for (var i = 0; i < endTime.length; i++) {
		if (!(endTime[i] >= 0 && endTime[i] <= 9) || endTime[i] == " ") {
			endTime = endTime.replace(endTime[i], "");
		}
	}
	extJson.startTime = startTime;
	// 结束时间
	extJson.endTime = endTime;
	// 整合
	extParam.extJsons = JSON.stringify(extJson);
	$.ajax({
		url : '../processorInfo/addProcessorInfo.action',
		method : "POST",
		dataType : "json",
		cache : false,
		async : false,
		data : {
			extParam : JSON.stringify(extParam),
			searchType : 0
		},
		success : function(result) {
			var sof = result.successOrFalse;
			if (sof == "success") {
				$('#addProductProcessorModal').modal('hide');
				toastr.success(result.meassage);
			} else if (sof == "false") {
				toastr.error(result.meassage);
			}
			refreshTable();
		}
	});
}

/**
 * 加载修改流程信息进模态框
 */
function loadEditProcessor(data, index) {
	// 加载所有信息 // 判断是否选择了流程
	if ($('#productProcessorInfoManage_Table').find(":checkbox:checked").length == 0) {
		toastr.error("请选择一个流程信息进行修改信息");
	} else if ($('#productProcessorInfoManage_Table').find(":checkbox:checked").length != 1) {
		toastr.error("每次只能对一个流程信息进行修改");
	} else {
		var editproductName = $('#selectProduct option:checked').text();
		var editProcessorTitle = $(
				'#productProcessorInfoManage_Table tr:eq(' + index
						+ ') td:eq(1)').text();
		var editStartTime = $(
				'#productProcessorInfoManage_Table tr:eq(' + index
						+ ') td:eq(2)').text();
		var editEndTime = $(
				'#productProcessorInfoManage_Table tr:eq(' + index
						+ ') td:eq(3)').text();
		var editProcessorDescription = $(
				'#productProcessorInfoManage_Table tr:eq(' + index
						+ ') td:eq(4)').text();
		var editProcessor = $(
				'#productProcessorInfoManage_Table tr:eq(' + index
						+ ') td:eq(5)').text();
		openaddProductProcessorModal(data);

		// 删除先加进来的option
		$("#table_editSelectProdut").empty();
		$("#table_editSelectProdut").append('<option></option>');
		// 加载产品
		// select2插件要显示默认值，设置selected,并且select2这个插件的初始化需要在数据加载进来之后
		$.each(productData, function(i, item) {
			if (item.categoryName == editproductName) {
				$("#table_editSelectProdut").append(
						"<option selected  value='" + item.categoryId + "'>"
								+ item.categoryName + "</option>");
			} else {
				$("#table_editSelectProdut").append(
						"<option value='" + item.categoryId + "'>"
								+ item.categoryName + "</option>");
			}
		});
		$("#table_editSelectProdut").select2({
			minimumResultsForSearch : -1,
			width : "160px",
			placeholder : "选择产品..",
		});
		$("#table_editSelectProcessor").empty();
		$("#table_editSelectProcessor").append('<option></option>');
		$.each(processorData, function(i, item) {
			if (item.categoryName == editProcessor) {
				$("#table_editSelectProcessor").append(
						"<option selected  value='" + item.categoryId + "'>"
								+ item.categoryName + "</option>");
			} else {
				$("#table_editSelectProcessor").append(
						"<option value='" + item.categoryId + "'>"
								+ item.categoryName + "</option>");
			}
		});
		$("#table_editSelectProcessor").select2({
			minimumResultsForSearch : -1,
			width : "160px",
			placeholder : "选择流程..",
		});
		// 把日历插件绑定
		laydate({
			elem : '#edit_startTime',
			event : 'focus',
			format : 'YYYY-MM-DD hh:mm:ss',
			istime : true,
			fixed : true,
			istoday : true
		});
		laydate({
			elem : '#editendTime',
			event : 'focus',
			format : 'YYYY-MM-DD hh:mm:ss',
			istime : true,
			fixed : true
		});
		// 把其他信息加载进来
		$('#EditProductProcessor_table input[name=editProcessorTitle]').val(
				editProcessorTitle);
		$('#EditProductProcessor_table input[name=editStartTime]').val(
				editStartTime);
		$('#EditProductProcessor_table input[name=editEndTime]').val(
				editEndTime);
		$('#EditProductProcessor_table textarea[name=editProcessorDescription]')
				.val(editProcessorDescription);
	}

}

/**
 * 提交修改流程信息
 */
function submitEditProcessor() {
	var extParam = {};
	var extJson = {};
	extJson.proInfoId = $('#productProcessorInfoManage_Table').find(
			":checkbox:checked").val();
	// 获取其他信息 // 标题
	extJson.title = $(
			'#EditProductProcessor_table input[name =editProcessorTitle]')
			.val();
	// 摘要
	extJson.description = $(
			'#EditProductProcessor_table textarea[name = editProcessorDescription]')
			.val();
	// 开始时间
	var startTime = $('#EditProductProcessor_table input[name =editStartTime]')
			.val();
	var endTime = $('#EditProductProcessor_table input[name = editEndTime]')
			.val();
	for (var i = 0; i < startTime.length; i++) {
		if (!(startTime[i] >= 0 && startTime[i] <= 9) || startTime[i] == " ") {
			startTime = startTime.replace(startTime[i], "");
		}
	}
	for (var i = 0; i < endTime.length; i++) {
		if (!(endTime[i] >= 0 && endTime[i] <= 9) || endTime[i] == " ") {
			endTime = endTime.replace(endTime[i], "");
		}
	}
	extJson.startTime = startTime; // 结束时间
	extJson.endTime = endTime; // 整合
	extParam.extJsons = JSON.stringify(extJson);
	$.ajax({
		url : '../processorInfo/updateProcessorInfo.action',
		method : "POST",
		dataType : "json",
		cache : false,
		async : false,
		data : {
			extParam : JSON.stringify(extParam),
			searchType : 0
		},
		success : function(result) {
			var sof = result.successOrFalse;
			if (sof == "success") {
				$('#EditProductProcessorModal').modal('hide');
				toastr.success(result.meassage);
			} else if (sof == "false") {
				toastr.error(result.meassage);
			}
			refreshTable();
		}
	});

}
/**
 * 删除流程
 */
function submitDeteleProcessor() {
	var processorInfoIds = ""
	var extParam = {};
	// 获取所有要删除的流程
	if ($('#productProcessorInfoManage_Table').find(":checkbox:checked").length == 0) {
		toastr.error("至少选择一个流程信息进行删除");
	} else if ($('#productProcessorInfoManage_Table').find(":checkbox:checked").length >= 1) {
		$("#productProcessorInfoManage_Table").find(":checkbox:checked").each(
				function() {// 获取选择行的id
					var val = $(this).val();
					processorInfoIds = processorInfoIds + val + "`";
				});
		processorInfoIds = processorInfoIds.substring(0,
				processorInfoIds.length - 1);
		extParam.extJsonList = processorInfoIds;
		$.ajax({
			url : '../processorInfo/deleteProcessorInfo.action',
			method : "POST",
			dataType : "json",
			cache : false,
			async : false,
			data : {
				extParam : JSON.stringify(extParam)
			},
			success : function(result) {
				var sof = result.successJsonList.split("`");
				if (sof != null) {
					toastr.success("删除成功");
				} else if (sof == null) {
					toastr.error("删除失败");
				}
				refreshTable();
			}
		});
	}
}

/**
 * 刷新列表
 */
function refreshTable() {
	loadAllProcessor();
}

/**
 * 加载单个流程可选择添加的类型
 */
function loadSingleProcessor() {
	$.ajax({
		url : '../data/infoType.json',
		dataType : "json",
		success : function(data) {
			SingleProcessorInfoData = data.list;
		}
	});
}

/**
 * 初始化表格
 */
function initTable() {
	$("#single_selectProduct").empty();// 清空下拉框
	$("#single_selectProduct").append('<option></option>');// 清空下拉框
	// 初始化下拉框
	$("#single_selectProduct").select2({
		minimumResultsForSearch : -1,
		width : "160px",
		placeholder : "选择类型.."
	});
	$.each(SingleProcessorInfoData, function(i, item) {
		$("#single_selectProduct").append(
				"<option value='" + item.typeId + "'>" + item.typeName
						+ "</option>");
	});
	// 初始化按钮
	$('#singleAdd').attr({
		"disabled" : "disabled"
	});
	$('#singleCustom').attr({
		"disabled" : "disabled"
	});
	$('#singleDetele').attr({
		"disabled" : "disabled"
	});
}

/**
 * 判断选中
 */
function judgeSelected() {
	var length = $('#productProcessorInfoManage_Table').find(
			":checkbox:checked").length;
	if (length == 1) {
		initTable();
		$('#single_selectProduct').removeAttr("disabled");
		$('#single_productProcessorInfoManage_templateColumns tr td').remove();
	} else {
		initTable();
		$('#single_selectProduct').attr({
			"disabled" : "disabled"
		});
	}
	$('#single_div').show();
}

/**
 * 判断选值的信息类型，并加载进来
 */
function singleSelectInfoType(data) {
	// 改变按钮的状态
	single_meassageType = data;
	if (data == "customInfo") {
		templateSelected();
	} else {
		otherSelected(data);
	}
}

/**
 * 选择了其他类型（分类型获取信息，图片获取有Url的OSS路径）
 */
function otherSelected(data) {
	var processInfoData;
	single_templateType = 1;
	$('#singleDetele').removeAttr("disabled");
	$('#singleAdd').removeAttr("disabled");
	$('#singleCustom').attr({
		"disabled" : "disabled"
	});
	$('#single_productProcessorInfoManage_templateColumns').hide();
	$('#single_productProcessorInfoManage_otherColumns').show();
	var proId = $('#productProcessorInfoManage_Table')
			.find(":checkbox:checked").val();
	if (data == "picture") {
		$.ajax({
			url : '../resourceUrl/findResourceOSSUrl.action',
			method : "POST",
			dataType : "json",
			cache : false,
			async : false,
			data : {
				'proId' : proId,
				'resourceType' : 'picture'
			},
			success : function(result) {
				ImageData = result;
				processInfoData = result;
			}
		});
	} else if (data == "text") {
		$.ajax({
			url : '../resourceUrl/findUrlByTypeAndProcInfo.action',
			method : "POST",
			dataType : "json",
			cache : false,
			async : false,
			data : {
				'processorInfoId' : proId,
				'resourceType' : 'text'
			},
			success : function(result) {
				processInfoData = result;
			}
		});
	} else if (data == "vedio") {
		$.ajax({
			url : '../resourceUrl/findResourceOSSUrl.action',
			method : "POST",
			dataType : "json",
			cache : false,
			async : false,
			data : {
				'proId' : proId,
				'resourceType' : 'vedio'
			},
			success : function(result) {
				VedioData = result;
				processInfoData = result;
			}
		});
	}
	// 先删
	$('#single_productProcessorInfoManage_otherColumns tr[class="info"]')
			.remove();
		if(processInfoData != null){
		// 添加到表格
		for (var i = 0; i < processInfoData.length; i++) {
			var r = processInfoData[i];
			singleTypeById(r, i);
		}
	}
}
/**
 * 选择了自定义信息
 */
function templateSelected() {
	single_templateType = 2;
	$('#singleDetele').removeAttr("disabled");
	$('#singleCustom').removeAttr("disabled");
	$('#singleAdd').attr({
		"disabled" : "disabled"
	});
	$('#single_productProcessorInfoManage_templateColumns').show();
	$('#single_productProcessorInfoManage_otherColumns').hide();
	// 获取具体流程的id
	var singleProInfoId = "";
	singleProInfoId = $('#productProcessorInfoManage_Table').find(
			":checkbox:checked").val();
	if (singleProInfoId != "") {
		// 获取模板
		$
				.ajax({
					url : '../proInfoTemplate/findProInfoTemplateByProInfoId.action?proInfoId='
							+ singleProInfoId,
					method : "POST",
					dataType : "json",
					cache : false,
					async : false,
					success : function(result) {
						// 先删
						$(
								'#single_productProcessorInfoManage_templateColumns tr[classs="info"]')
								.remove();
						// 添加到表格
						for (var i = 0; i < result.length; i++) {
							$(
									'#single_productProcessorInfoManage_templateColumns')
									.append(
											'<tr class="info"><td><input type="checkbox" value="'
													+ result[i].templateId
													+ '"/></td><td>'
													+ result[i].templateName
													+ '</td><td>'
													+ result[i].description
													+ '</td><td><button class="btn btn-success btn-xs" onclick="single_seeProcessorInfoManage(single_seeAddProcessorInfoManageModal.id)">查看已录信息</button></td></tr>');
						}
					}
				});
	}
}

/**
 * 类型id转类型名
 * 
 * @param r
 */
function singleTypeById(r, index) {
	for (var i = 0; i < SingleProcessorInfoData.length; i++) {
		if (r.resourceType == SingleProcessorInfoData[i].typeId) {
			var newValName = "";
			newValName = SingleProcessorInfoData[i].typeName;
			$('#single_productProcessorInfoManage_otherColumns')
					.append(
							'<tr class="info"><td><input type="checkbox" value="'
									+ r.urlId
									+ '"/></td><td>'
									+ r.title
									+ '</td><td>'
									+ r.description
									+ '</td><td>'
									+ r.uploadDate.replace("T", " ")
									+ '</td><td>'
									+ newValName
									+ '</td><td><button class="btn btn-warning btn-xs" onclick="addOrEditResourceUrlByModal('
									+ 1
									+ ','
									+ index
									+ ');">修改</button>&nbsp;<button class="btn btn-info btn-xs" onclick="addOrEditResourceUrlByModal('
									+ 2 + ',' + index
									+ ');">查看</button></td></tr>');
		}
	}
}

/**
 * 初始化自定义信息录入模态框
 * 
 * @param data
 */
function initTemplateModel(data) {
	// 动态加载数据
	// 获取自定义模板id
	var initTemplateId = $('#single_productProcessorInfoManage_templateColumns')
			.find(":checkbox:checked").val();

	var length = $('#single_productProcessorInfoManage_templateColumns').find(
			":checkbox:checked").length;
	if (length == 1) {
		$
				.ajax({
					url : '../proInfoIndex/findIndexByTemplateId.action?templateId='
							+ initTemplateId,
					dataType : "json",
					cache : false,
					async : false,
					success : function(result) {
						$(
								'#single_productProcessorInfoManage_templateTable tr[name^= trName]')
								.remove();
						trIndex = 1;
						$(
								'#single_productProcessorInfoManage_templateTable  tr[class="active"]')
								.empty();
						$(
								'#single_productProcessorInfoManage_templateTable  tr[class="active"]')
								.append('<th></th>')
						for (var i = 0; i < result.length; i++) {
							// 加载标题
							$(
									'#single_productProcessorInfoManage_templateTable tr[class="active"]')
									.append(
											//
											'<th style="height:10px;">'
													+ result[i].indexName
													+ '<input type="hidden" value="'
													+ result[i].indexType
													+ '"></th>');
						}
					}
				});
		// 打开模态框
		openaddProductProcessorModal(data);
	} else if (length > 1) {
		toastr.error("每次只能为一个自定义信息模板进行自定义信息的录入");
	} else if (length == 0) {
		toastr.error("选择一个自定义信息模板进行自定义信息的录入");
	}
}

/**
 * 新增一行操作
 */
function newOneProcessorInfo() {
	var count = 0;
	var length = $('#single_productProcessorInfoManage_templateTable th').length - 1;
	var templateTypeId = "";
	var templateTypeName = "";
	// 删除其他自定义信息或自身信息录入后的信息
	$('#single_productProcessorInfoManage_templateTable').append(
			'<tr name = "trName' + trIndex + '" class="info"><td>' + trIndex
					+ '</td></tr>');
	for (var i = 0; i < length; i++) {
		templateTypeId = $('#single_productProcessorInfoManage_templateTable')
				.find('input[type="hidden"]:eq(' + i + ')').val();
		// 判断类别
		if (templateTypeId == "textfield") {
			templateTypeName = "<input type='text' class='form-control'  placeholder='输入信息文本'/>";
		} else if (templateTypeId == "datefield") {
			// 日期
			templateTypeName = '<input type="text" class="form-control" id="templateType_selectDate'
					+ trIndex + '" placeholder="选择日期..." />';
			count = 1;
		} else if (templateTypeId == "yesOrNo") {
			templateTypeName = "<select id='templateType_selectYesOrNo'><option></option><option value='Ayes'>是</option><option value='Ano'>否</option></select>";

		} else if (templateTypeId == "numberfield") {
			// 数字
			templateTypeName = "<input type='text' class='form-control' placeholder='输入数字'/>";
		} else if (templateTypeId == "isEligible") {
			templateTypeName = "<select id='templateType_selectIsEligible'><option></option><option value='Byes'>合格</option><option value='Bno'>不合格</option></select>";
		} else if (templateTypeId == "timefield") {
			// 时间
			templateTypeName = '<input type="text" class="form-control"  id="templateType_selectTime'
					+ trIndex + '" placeholder="选择时间..." />';
			count = 2;
		} else if (templateTypeId == "datetimefield") {
			// 日期+时间
			templateTypeName = '<input type="text" class="form-control" id="templateType_selectDateAndTime'
					+ trIndex + '" placeholder="选择日期时间..." />';
			count = 3;
		}
		// 添加
		$(
				'#single_productProcessorInfoManage_templateTable tr[name=trName'
						+ trIndex + ']').append(
				'<td>' + templateTypeName + '</td>');
		initNewOneProcessorInfo(count);
	}
	trIndex++;
}

/**
 * 初始化参数
 */
function initNewOneProcessorInfo(index) {
	// yesOrNo
	$('#templateType_selectYesOrNo').select2({
		minimumResultsForSearch : -1,
		width : "160px",
		placeholder : "是/否.."
	});
	// 合不合格
	$('#templateType_selectIsEligible').select2({
		minimumResultsForSearch : -1,
		width : "160px",
		placeholder : "合格/不合格.."
	});
	if (index == 1) {
		// 日期
		laydate({
			elem : '#templateType_selectDate' + trIndex + '',
			event : 'focus',
			format : 'YYYY-MM-DD',
			istime : true,
			fixed : true,
			istoday : true
		});
	}
	if (index == 2) {
		// 时间
		laydate({
			elem : '#templateType_selectTime' + trIndex + '',
			event : 'focus',
			format : 'hh:mm:ss',
			istime : true,
			fixed : true,
			istoday : true
		});
	}
	if (index == 3) {
		// 日期加时间
		laydate({
			elem : '#templateType_selectDateAndTime' + trIndex + '',
			event : 'focus',
			format : 'YYYY-MM-DD hh:mm:ss',
			istime : true,
			fixed : true,
			istoday : true
		});
	}
}

/**
 * 重置表格
 * 
 * @param data
 */
function resetTable(data) {
	$('#' + data + ' tr[name^= trName]').remove();
	trIndex = 1;
}

/**
 * 提交表格
 */
function submitTemplateModel() {
	var extParam = {};
	var isNull = true; // 用来判断一整行的数据是是否为null
	var indexValues = ""; // 存放一行字段的值的集合
	for (var i = 0; i < trIndex; i++) {
		var indexValue = "" // 存放一行字段的值
		isNull = true;
		var length = $('#single_productProcessorInfoManage_templateTable tr:eq('
				+ (i + 1) + ') td').length - 1;
		for (var j = 0; j < length; j++) {
			var index = "";
			index = $(
					'#single_productProcessorInfoManage_templateTable tr:eq('
							+ (i + 1) + ') td:eq(' + (j + 1) + ')').find(
					"input").val();
			if (index == "" || index == null || index == "undefined") {
				index = $(
						'#single_productProcessorInfoManage_templateTable tr:eq('
								+ (i + 1) + ') td:eq(' + (j + 1) + ')').find(
						"select").val();
			}
			if (index != "") {
				isNull = false;
			}
			if (length > 1) {
				if (j == 0) {
					indexValue = "{" + "index" + j + ":\"" + index + "\",";
				} else if (j == length - 1) {
					indexValue = indexValue + "index" + j + ":\"" + index
							+ "\"}";
				} else {
					indexValue = indexValue + "index" + j + ":\"" + index
							+ "\",";
				}
			} else {
				indexValue = "{" + "index" + j + ":\"" + index + "\"}";
			}
		}
		if (indexValue != "" && isNull == false) {
			if (i == (trIndex - 2)) {
				indexValues = indexValues + indexValue;
			} else {
				indexValues = indexValues + indexValue + "`";
			}
		}
	}
	extParam.extJsonList = indexValues;
	var singleTemplateId = $(
			'#single_productProcessorInfoManage_templateColumns').find(
			":checkbox:checked").val();
	var singleProInfoId = $('#productProcessorInfoManage_Table').find(
			":checkbox:checked").val();
	extParam.param1 = singleTemplateId;
	extParam.param2 = singleProInfoId;
	// 提交
	$.ajax({
		url : '../proInfoIndex/enterIndexValue.action',
		method : "POST",
		dataType : "json",
		cache : false,
		async : false,
		data : {
			extParam : JSON.stringify(extParam)
		},
		success : function(result) {
			var sof = result.successOrFalse;
			if (sof == "success") {
				toastr.success(result.meassage);
			} else if (sof == "false") {
				toastr.error(result.meassage);
			}
			$('#single_templateProductProcessorModal').modal('hide');
		}
	});
}

/**
 * 查看产品流程模板已经录入的信息
 */
function single_seeProcessorInfoManage(data) {
	// 查出字段信息及添加字段信息
	var fieldNum = 0;
	// 查出字段并设置为表格标题
	var seeTemplateId = $('#single_productProcessorInfoManage_templateColumns')
			.find(":checkbox:checked").val();
	var length = $('#productProcessorInfoManage_Table').find(
			":checkbox:checked").length;
	if (length == 1) {
		$
				.ajax({
					url : '../proInfoIndex/findIndexByTemplateId.action?templateId='
							+ seeTemplateId,
					dataType : "json",
					cache : false,
					async : false,
					success : function(result) {
						// 字段个数
						fieldNum = result.length;
						$(
								'#single_seeAddProcessorInfoManage_table  tr[class="active"]')
								.empty();
						for (var i = 0; i < result.length; i++) {
							// 加载标题
							$(
									'#single_seeAddProcessorInfoManage_table tr[class="active"]')
									.append(
											'<th style="height:10px;">'
													+ result[i].indexName
													+ '<input type="hidden" value="'
													+ result[i].indexType
													+ '"></th>');
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
								'#single_seeAddProcessorInfoManage_table tr[name^=seeName]')
								.remove();
						for (var i = 0; i < result.length; i++) {
							$('#single_seeAddProcessorInfoManage_table')
									.append('<tr name="seeName' + i + '"></tr>');
							var newResult = eval("(" + result[i].value + ")");
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
								}
								$(
										'#single_seeAddProcessorInfoManage_table tr[name=seeName'
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

/**
 * 删除/批量删除自定义信息模板
 */
function single_deleteProcessorInfoManage() {
	var extParam = {};
	var length = 0;
	if(single_meassageType == "customInfo"){
		length = $("#single_productProcessorInfoManage_templateColumns").find(
		":checkbox:checked").length;
	}else{
		length = $("#single_productProcessorInfoManage_otherColumns").find(
		":checkbox:checked").length;
	}
	if(length == 0){
		toastr.error("删除对象为空，选址要删除的对象");
	}else if(length != 0){
		if (single_meassageType == "customInfo") {
			
			// 自定义删除
			var proInfoTemplateIds = "";
			$("#single_productProcessorInfoManage_templateColumns").find(
					":checkbox:checked").each(function() {
				var val = $(this).val();
				proInfoTemplateIds = proInfoTemplateIds + val + "`";
			});
			proInfoTemplateIds = proInfoTemplateIds.substring(0,
					proInfoTemplateIds.length - 1);
			extParam.extJsonList = proInfoTemplateIds;
			$.ajax({
				url : '../proInfoTemplate/deleteProInfoTemplate.action',
				dataType : "json",
				cache : false,
				async : false,
				data : {
					extParam : JSON.stringify(extParam)
				},
				success : function() {
					toastr.success("删除成功");
					templateSelected();
				},
				error : function() {
					toastr.error("删除失败");
					templateSelected();
				}
			});
		} else if(single_meassageType == "text") {
			// 其他信息删除
			var resourceIds = "";
			$("#single_productProcessorInfoManage_otherColumns").find(
					":checkbox:checked").each(function() {
				var val = $(this).val();
				resourceIds = resourceIds + val + "`";
			});
			resourceIds = resourceIds.substring(0, resourceIds.length - 1);
			extParam.extJsonList = resourceIds;
			$.ajax({
				url : '../resourceUrl/deleteResourceUrl.action',
				dataType : "json",
				cache : false,
				async : false,
				data : {
					extParam : JSON.stringify(extParam)
				},
				success : function() {
					toastr.success("删除成功");
					otherSelected(single_meassageType);
				},
				error : function() {
					toastr.error("删除失败");
					otherSelected(single_meassageType);
				}
			});
		}else if(single_meassageType == "picture" || single_meassageType == "vedio"){
			// 其他信息删除
			var resourceIds = "";
			$("#single_productProcessorInfoManage_otherColumns").find(
					":checkbox:checked").each(function() {
				var val = $(this).val();
				resourceIds = resourceIds + val + "`";
			});
			resourceIds = resourceIds.substring(0, resourceIds.length - 1);
			extParam.extJsonList = resourceIds;
			$.ajax({
				url : '../resourceUrl/deleteResourceOSSUrl.action',
				dataType : "json",
				cache : false,
				async : false,
				data : {
					extParam : JSON.stringify(extParam)
				},
				success : function() {
					toastr.success("删除成功");
					otherSelected(single_meassageType);
				},
				error : function() {
					toastr.error("删除失败");
					otherSelected(single_meassageType);
				}
			});
		}
	}
}

/**
 * 添加其他信息模态框
 */
function single_addProcessorInfo(data) {
	// 判断类型
	if (single_meassageType == "text") {
		$('#single_editOrSeeAddId').removeAttr("disabled");
		$('#single_editOrSeeEditId').attr("disabled", "disabled");
		openaddProductProcessorModal(data);
	} else {
		$('#loadImage').attr("src","");
		$('#uploadInfoBtn').attr("disabled", "disabled");
		$('#OssuploadImageId').removeAttr('disabled');
		$('#uploadChangeBtn').removeAttr('disabled');
		openaddProductProcessorModal("single_uploadProcessorInfoManageModal");
	}
}

/**
 * 提交添加信息
 */
function single_submitAddProcessorInfo() {
	var extParam = {};
	var extJson = {};
	extJson.title = $('#single_editOrSeeText').val();
	extJson.description = $('#single_editOrSeeTextarea').val();
	extJson.resourceType = single_meassageType;
	extParam.extJsons = JSON.stringify(extJson);
	extParam.param1 = $('#productProcessorInfoManage_Table').find(
			":checkbox:checked").val();
	$.ajax({
		url : '../resourceUrl/addResourceUrl.action',
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
				$('#single_editOrSeeProcessorInfoManageModal').modal('hide');
				toastr.success(result.meassage);
			} else if (sof == "false") {
				toastr.error(result.meassage);
			}
			otherSelected(single_meassageType);
		}
	});
}

/**
 * 修改/查看其它类型的信息模态框
 */
function single_editOrSeeProcessorInfo(data) {
	if (single_meassageType == "text") {
		// $('#single_editOrSeeEditId').removeAttr("disabled");
		// 加载信息
		var length = $('#single_productProcessorInfoManage_otherColumns').find(
				":checkbox:checked").length;
		if (length == 1) {
			openaddProductProcessorModal(data);
			var title = $('#single_productProcessorInfoManage_otherColumns')
					.find(":checkbox:checked").parents("tr").children("td").eq(
							1).text();
			var description = $(
					'#single_productProcessorInfoManage_otherColumns').find(
					":checkbox:checked").parents("tr").children("td").eq(2)
					.text();
			$('#single_editOrSeeText').val(title);
			$('#single_editOrSeeTextarea').val(description);
		} else {
			toastr.error("选择一个信息进行修改或查看");
		}
	}
}

/**
 * 修改其他类型的信息
 */
function single_submitEditProcessorInfo() {
	var extJson = {};
	var modalType;
	if (single_meassageType == "text") {
		extJson.title = $('#single_editOrSeeText').val();
		extJson.description = $('#single_editOrSeeTextarea').val();
		extJson.urlId = $('#single_productProcessorInfoManage_otherColumns')
				.find(":checkbox:checked").val();
		modalType = "single_editOrSeeProcessorInfoManageModal";
	} else if (single_meassageType == "vedio") {
		extJson.title = $('#findOrEdit_single_uploadVedioText').val();
		extJson.description = $('#findOrEdit_single_uploadVedioTextarea').val();
		extJson.urlId = vedioUrl.urlId;
		modalType = "findOrEdit_single_uploadVedioModal";
	}
	$.ajax({
		url : '../resourceUrl/editResourceUrl.action',
		dataType : "json",
		cache : false,
		async : false,
		method : "POST",
		data : {
			extJson : JSON.stringify(extJson),
			systemType : 'edit'
		},
		success : function(result) {
			var sof = result.successOrFalse;
			if (sof == "success") {
				$('#' + modalType + '').modal('hide');
				toastr.success(result.meassage);
			} else if (sof == "false") {
				toastr.error(result.meassage);
			}
			otherSelected(single_meassageType);
		}
	});
}

/**
 * 打开模态框
 */
function openOssupload() {
	if (single_meassageType == "picture") {
		$('#ossfile').empty();
		$('#OSSuploadModal').modal();
	} else if (single_meassageType == "vedio") {
		$('#ossVedio').empty();
		$('#OSSuploadVedioModal').modal();
	}

}

/**
 * 清空下拉列表
 */
function clearUploadList() {
	$('#ossfile').empty();
}

/*******************************************************************************
 * 改变按钮状态
 */
function BtnChange() {
	if ($('#single_uploadText').val() != ""
			|| $('#single_uploadText').val() != null) {
		$('#uploadInfoBtn').removeAttr("disabled");
	}
}

/**
 * 增加修改图片标题、描述
 * 
 * @param index
 */
function addOrEditResourceUrl(index) {
	// 1为添加、2为修改
	var extJson = {};
	var modalId;
	var systemType;
	if (index == 1) {
		systemType = "add";
		extJson.urlId = $('#uploadUrl').val();
		extJson.title = $('#single_uploadText').val();
		extJson.description = $('#single_uploadTextarea').val();
		modalId = "single_uploadProcessorInfoManageModal";
	} else if (index == 2) {
		systemType = "edit";
		extJson.urlId = resourceUrl.urlId;
		extJson.title = $('#findOrEdit_single_uploadText').val();
		extJson.description = $('#findOrEdit_single_uploadTextarea').val();
		modalId = "findOrEdit_single_uploadProcessorInfoManageModal";
	}
	$.ajax({
		url : "../resourceUrl/editResourceUrl.action",
		dataType : "json",
		cache : false,
		async : false,
		method : "POST",
		data : {
			extJson : JSON.stringify(extJson),
			systemType : systemType
		},
		success : function(extMessage) {
			var sof = extMessage.successOrFalse;
			if (sof == "success") {
				$("#" + modalId + "").modal('hide');
				toastr.success(extMessage.meassage);
			} else if (sof == "false") {
				toastr.error(extMessage.meassage);
			}
			otherSelected(single_meassageType);
			$('#'+modalId).modal('hide');
		}
	});
}

/**
 * 查看/修改图片信息 1是修改、2是查看
 */
function addOrEditResourceUrlByModal(index, sow) {
	var dataType = $('#single_selectProduct').val();
	if (dataType == "picture") {
		var rs = chilckImageIndex(sow, 1);
		$('#findOrEditloadImage').attr("src", "");
		$('#findOrEdit_single_uploadText').val(rs.title);
		$('#findOrEdit_single_uploadTextarea').val(rs.description);
		$('#findOrEditloadImage').attr("src", rs.url);
		if (index == 2) {
			$('#changeBtn').text('确定');
			$('#findOrEdit_uploadInfoBtn').attr("disabled", "disabled");
		} else if (index == 1) {
			$('#changeBtn').text('取消');
			$('#findOrEdit_uploadInfoBtn').removeAttr("disabled");
		}
		$('#findOrEdit_single_uploadProcessorInfoManageModal').modal();
	} else if (dataType == "text") {
		if (index == 1) {
			$('#single_editOrSeeAddId').attr("disabled", "disabled");
			$('#single_editOrSeeEditId').removeAttr("disabled");
			$('#single_editOrSeeCallId').text('取消');
			single_editOrSeeProcessorInfo("single_editOrSeeProcessorInfoManageModal");
		} else if (index == 2) {
			$('#single_editOrSeeEditId').attr("disabled", "disabled");
			$('#single_editOrSeeAddId').attr("disabled", "disabled");
			$('#single_editOrSeeCallId').text('确认');
			single_editOrSeeProcessorInfo("single_editOrSeeProcessorInfoManageModal");
		}
	} else if (dataType == "vedio") {
		var rv = chilckImageIndex(sow, 2);
		$('#findOrEdit_single_uploadVedioText').val(rv.title);
		$('#findOrEdit_single_uploadVedioTextarea').val(rv.description);
		if (index == 2) {
			var proId = $('#productProcessorInfoManage_Table').find(
					":checkbox:checked").val();
			window.open("../newpage/processorVideo.html?proId=" + proId
					+ "&index=" + sow + "");
		} else if (index == 1) {
			$('#findOrEdit_single_uploadVedioModal').modal();
		}
	}

}

/**
 * 获取图片信息
 * 
 * @param index
 * @returns {___anonymous37693_37694}
 */
function chilckImageIndex(index, typeIndex) {
	var rsv = {};
	if (typeIndex == "1") {
		// 图片信息
		var r = ImageData[index];
		rsv.title = r.title;
		rsv.description = r.description;
		rsv.url = r.urlContext;
		rsv.urlId = r.urlId;
		resourceUrl = rsv;
	} else if (typeIndex == "2") {
		var v = VedioData[index];
		rsv.title = v.title;
		rsv.description = v.description;
		rsv.urlId = v.urlId;
		rsv.urlContext = v.urlContext;
		vedioUrl = rsv;
	}
	return rsv;
}