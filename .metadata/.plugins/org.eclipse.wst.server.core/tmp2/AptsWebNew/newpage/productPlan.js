/**
 * 生产计划功能
 * 
 * @returns
 */
function createProductPlan(){
	　$.get("../newpage/productPlan.html",function(data){ 
		$("#content").html(data);
		
	});
	// 加载产品列表
	$.ajax({
		cache: false,
		async: true,
		type: "POST",
		dataType: "json",
		data: {},
		url: "../productCategory/findProductCategoryByCompanyId.action",
		success: function(result) {
			var table = $("#productTable");
			for (var i = 0; i < result.length; i++) {
				var product = "<tr class='info'  id='"+result[i].categoryId+"' onclick='findProductPlan(this,false)' align='center'><td id='"+result[i].categoryId+"categoryNameText'>"+result[i].categoryName+"</td></tr>";
				table.append(product);
			}
		}
	});
}

/**
 * 根据商品查找生产计划
 * 
 * @param btn
 * @returns
 */
function findProductPlan(btn,categoryId){
	if(!categoryId){
		categoryId = btn.id;
	}
	$("#addProductPlanBtn").val(categoryId);
	var categoryName = $("#"+categoryId+"categoryNameText").html();
	
	$.post("../productionPlan/findProductPlanByProductCategoryId.action",{"categoryId":categoryId},function (result){
		var table = $("#productPlan");
		table.html("<tr class='active'><th style='text-align: center;'>生产计划名称</th><th style='text-align: center;'>开始生产时间</th><th style='text-align: center;'>预计结束时间</th><th style='text-align: center;'>实际结束时间</th><th style='text-align: center;'>数量</th><th style='text-align: center;'>计划描述</th><th style='text-align: center;'>操作</th></tr>");
		for (var i = 0; i < result.length; i++) {
			var startTime = "";
			var predictEndTime = "";
			var actualEndTime = "";
			if(result[i].startTime){
				startTime = result[i].startTime.split("T")[0];
			}
			if(result[i].predictEndTime){
				predictEndTime = result[i].predictEndTime.split("T")[0];
			}
			if(result[i].actualEndTime){
				actualEndTime = result[i].actualEndTime.split("T")[0];
			}
			var id = result[i].productPlanId;
			var plan = "<tr align='center' class='info'><td id='"+id+"name'>"+result[i].productionPlanName+"</td><td id='"+id+"start'>"+startTime+"</td><td id='"+id+"predict'>"+predictEndTime+"</td><td id='"+id+"actual'>"+actualEndTime+"</td><td id='"+id+"num'>"+result[i].proNumber+"</td><td id='"+id+"contents'>"+result[i].contents+"</td><td><button  class='btn btn-warning' type='button' onclick='editPlanPre(this)' value='"+id+"'>修改</button>&nbsp;<button  class='btn btn-danger' type='button' value='"+id+"' onclick='delProductPlan(this)' id='"+result[i].productCategory.categoryId+"'>删除</button>&nbsp;<button  class='btn btn-success' type='button' data-toggle='modal' data-target='#addProductionMaterial' onclick='addProductionMaterialPre(this)' value='"+categoryId+"' id='"+id+"'>为计划流程选择材料</button></td></tr>";
			table.append(plan);
			
		}
		$("#addProductPlanBtn").attr("name",categoryName);
		$("#editProductPlan").attr("name",categoryId);
	});
}

/**
 * 删除计划
 * 
 * @param btn
 * @returns
 */
function delProductPlan(btn) {
	var productPlanId = btn.value;
	var categoryId = btn.id;
	if(confirm("您真的要删除吗?")){
		$.post("../productionPlan/deleteProductionPlan.action?productionPlanId="+productPlanId,{},function (result){
			if(result.success){
				toastr.success(result.meassage);
			}else{
				toastr.success(result.meassage);
			}
			//createProductPlan();
			findProductPlan(btn,categoryId);
		});
	}
}

/**
 * 添加计划准备
 * 
 * @param btn
 * @returns
 */
function addPlanPre(btn){
	$("#productName").val(btn.name);
	$("#addProductPlan").val(btn.value);
	$('#addProductPlanPanel').modal();
}

/**
 * 添加计划
 * 
 * @param btn
 * @returns
 */
function addPlan(btn){
	var categoryId = btn.value;
	var categoryName = $("#productName").val();
	var proNumber = $("#productPlanNum").val();
	var predictEndTime = $("#predictEndTime").val();
	var productionPlanName = $("#productPlanName").val();
	var startTime = $("#startTime").val();
	var actualEndTime = $("#actualEndTime").val();
	var contents = $("#productPlanContents").val();
	

	$.post("../productionPlan/addProductPlan.action",{"param":"{'categoryId':'"+categoryId+"','categoryName':'"+categoryName+"','proNumber':'"+proNumber+"','predictEndTime':'"+predictEndTime+"','productionPlanName':'"+productionPlanName+"','startTime':'"+startTime+"','actualEndTime':'"+actualEndTime+"','contents':'"+contents+"'}"},function (result){
		if(result.success){
			toastr.success(result.meassage);
		}else{
			toastr.error(result.meassage);
		}
		$('#addProductPlanPanel').modal('hide');
		//createProductPlan();
		findProductPlan(btn,categoryId);
	});
}

/**
 * 修改计划准备
 * 
 * @param btn
 * @returns
 */
function editPlanPre(btn){
	var productPlanId = btn.value;
	var proNumber = $("#"+productPlanId+"num").html();
	var predictEndTime = $("#"+productPlanId+"predict").html();
	var productionPlanName = $("#"+productPlanId+"name").html();
	var startTime = $("#"+productPlanId+"start").html();
	var actualEndTime = $("#"+productPlanId+"actual").html();
	var contents = $("#"+productPlanId+"contents").html();
	
	$("#editProductPlan").val(productPlanId);
	$("#editProductPlanName").val(productionPlanName);
	$("#editProductPlanNum").val(proNumber);
	$("#editStartTime").val(startTime);
	$("#editPredictEndTime").val(predictEndTime);
	$("#editActualEndTime").val(actualEndTime);
	$("#editProductPlanContents").val(contents);
	$('#editProductPlanPanel').modal();
}

/**
 * 修改计划
 * 
 * @param btn
 * @returns
 */
function  editPlan(btn){
	var productPlanId = $("#editProductPlan").val();
	var productionPlanName = $("#editProductPlanName").val();
	var proNumber = $("#editProductPlanNum").val();
	var startTime = $("#editStartTime").val();
	var predictEndTime = $("#editPredictEndTime").val();
	var actualEndTime = $("#editActualEndTime").val();
	var contents = $("#editProductPlanContents").val();
	$.post("../productionPlan/updateProductPlan.action",{"param":"{'productPlanId':'"+productPlanId+"','proNumber':'"+proNumber+"','predictEndTime':'"+predictEndTime+"','productionPlanName':'"+productionPlanName+"','startTime':'"+startTime+"','actualEndTime':'"+actualEndTime+"','contents':'"+contents+"'}"},function(result){
		if(result.success){
			toastr.success(result.meassage);
		}else{
			toastr.success(result.meassage);
		}
		$('#editProductPlanPanel').modal('hide');
		findProductPlan(btn,btn.name);
	});
	
}

/**
 * 为计划选择材料做准备
 * 
 * @param btn
 * @returns
 */
function addProductionMaterialPre(btn){
	var categoryId = btn.value;
	var productPlanId = btn.id;
	$.post("../processorInfo/findProInfoByProductCgId.action?productCgId="+categoryId,{},function (result){
		var table = $("#processorTable");
		table.html("<tr class='active'><th style='text-align: center;'>流程名称</th></tr>");
		for (var i = 0; i < result.length; i++) {
			var processor = result[i];
			var proinfo = "<tr class='info' align='center' onclick='findMaterialByProductionPlanAndProcess(this)' id='"+productPlanId+","+categoryId+","+processor.category.categoryName+","+processor.category.categoryId+"'><td>"+processor.category.categoryName+"</td></tr>";
			table.append(proinfo);
			
			 $("#materTable").html("<tr class='active'><th style='text-align: center;'>材料编号</th><th style='text-align: center;'>材料名称</th></tr>");
		}
	});
}

/**
 * 根据计划和流程查原材料
 * 
 * @param btn
 * @returns
 */
function findMaterialByProductionPlanAndProcess(btn){
	var str = btn.id.split(",");
	var productPlanId = str[0];
	var categoryId = str[1];
	var categoryName = str[2];
	var realCategoryId = str[3];
	$.post("../productionPlanMaterial/findMaterialByProductionPlanAndProcess.action",{"productPlanId":productPlanId,"categoryId":categoryId,"categoryName":categoryName},function (result){
		var materTable =  $("#materTable");
		materTable.html("<tr class='active'><th style='text-align: center;'>材料编号</th><th style='text-align: center;'>材料名称</th></tr>");
		if(result.children!=null){
			showChildren(result.children,materTable);
		}
		$('#materTable').aCollapTable({
		    startCollapsed: true,
		    addColumn: false,
		    plusButton: '<i class="glyphicon glyphicon-plus"></i> ', 
		    minusButton: '<i class="glyphicon glyphicon-minus"></i> ' 
		});
		
		$("#materTitle").html("<i class='icon-info'></i> "+categoryName+"的材料");
		$("#saveMaterialBtn").val(productPlanId);
		$("#saveMaterialBtn").attr("name",realCategoryId);
	});
}

/**
 * 递归展示下级材料
 */
function showChildren(children,materTable){
	for(var i = 0;i<children.length;i++){
		var mater = children[i].mater;
		var mother = "";

		if(mater.materialMother!=null){
			mother = mater.materialMother;
		}
		var materHtml = "<tr class='info'  data-id='"+mater.materialCode+"' data-parent='"+mother+"' ><td><input type='checkbox' value='"+mater.materialId+","+mater.materialCode+"' name='materialCheckBox'>"+mater.materialCode+"</td><td id='"+mater.materialId+"Name'>"+mater.materialName+"</td></tr>"
		materTable.append(materHtml);
		if(children[i].children!=null){
			showChildren(children[i].children,materTable);
		}
	}
}

/**
 * 保存材料
 * 
 * @param btn
 * @returns
 */
function saveMaterial(btn){
	var processorId = btn.name;
	var productPlanId = btn.value;
	
	var maters = "[";
	$("input[name='materialCheckBox']").each(function(){
		if($(this).prop("checked")){
			var str = $(this).val().split(",");
			var id = str[0];
			var code = str[1];
			var name = $("#"+id+"Name").html();
			maters+="{'materialId':'"+id+"','materialCode':'"+code+"','materialName':'"+name+"'},";
		}
	});
	maters = maters.substring(0,maters.length-1);
	maters +="]";
	
	$.post("../productionPlanMaterial/saveProductionProcessMaterial.action",{"materialJson":"{'materials':"+maters+",'productPlanId':'"+productPlanId+"','processorId':'"+processorId+"'}"},function (result){
		if(result.success){
			toastr.success(result.meassage);
		}else{
			toastr.success(result.meassage);
		}
	});
}