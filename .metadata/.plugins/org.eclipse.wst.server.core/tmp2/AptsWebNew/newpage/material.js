/**
 * 材料清单功能
 * 
 * @returns
 */
function material(){
	　$.get("../newpage/material.html",function(data){ 
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
				var product = "<tr class='info'  id='"+result[i].categoryId+"' onclick='findMaterial(this)' align='center'><td id='"+result[i].categoryId+"name'>"+result[i].categoryName+"</td><td>"+result[i].categoryDescription+"</td><td><button class='btn  btn-success' value='"+result[i].categoryId+"' onclick='addMaterial4ProductPre(this)' data-toggle='modal' data-target='#addMaterial4Product'>为产品添加材料</button></td></tr>";
				table.append(product);
			}
		}
	});
}

/**
 * 根据产品展示材料
 * 
 * @param product
 * @returns
 */
function findMaterial(product,productId){
	if(product!=null){
		productId = product.id;
	}

	$("#deleteMaterialBtn").val(productId);
	$.get("../mater/findByProdId.action?product.categoryId="+productId,{},function(data){
		var materTable =  $("#materTable");
		materTable.html("<tr class='active' ><th style='text-align: center;'>材料编号</th><th style='text-align: center;'>材料名称</th><th style='text-align: center;'>构成上级材料比例</th><th style='text-align: center;'>材料种类</th><th style='text-align: center;'>材料规格</th><th style='text-align: center;'>计量单位</th><th style='text-align: center;'>材料单价</th><th style='text-align: center;'>备注</th><th style='text-align: center;'>操作</th></tr>");
		if(data.children){
			showChildren(data.children,materTable);
		}
		$('#materTable').aCollapTable({
		    startCollapsed: true,
		    addColumn: false,
		    plusButton: '<i class="glyphicon glyphicon-plus"></i> ', 
		    minusButton: '<i class="glyphicon glyphicon-minus"></i> ' 
		});
	});
}

/**
 * 递归展示下级材料
 */
function showChildren(children,materTable){
	for(var i = 0;i<children.length;i++){
		var mater = children[i].mater;
		var sort = "";
		var context = "";
		var mother = "";
		var standard = "";
		if(mater.materialStandard!=null){
			standard = mater.materialStandard;
		}
		if(mater.materialSort==2){
			sort = "半成品";
		}else{
			sort = "原材料";
		}
		if(mater.materialContext!=null){
			context = mater.materialContext;
		}
		if(mater.materialMother!=null){
			mother = mater.materialMother;
		}
		var materHtml = "<tr class='info'  data-id='"+mater.materialCode+"' data-parent='"+mother+"' ><td><input type='hidden' name='ProductId' value='"+mater.product.categoryId+"'><input type='checkbox' value='"+mater.materialId+"' name='materialCheckBox'>"+mater.materialCode+"</td><td id='"+mater.materialId+"Name'>"+mater.materialName+"</td><td id='"+mater.materialId+"Num'>"+mater.materialNum+"</td><td id='"+mater.materialId+"Sort'>"+sort+"</td><td id='"+mater.materialId+"Standard'>"+standard+"</td><td id='"+mater.materialId+"Unit'>"+mater.materialUnit+"</td><td id='"+mater.materialId+"Cost'>￥ "+mater.materialCost+"</td><td id='"+mater.materialId+"Context'>"+context+"</td><td><button class='btn  btn-danger' value='"+mater.materialId+"' id='"+mater.product.categoryId+"' onclick='deleteSingleMaterial(this)'>删除</button> <button class='btn  btn-info' value='"+mater.materialId+"' id='"+mater.materialCode+"' onclick='editMaterialPre(this)' data-toggle='modal' data-target='#editMaterial'>修改</button> <button class='btn  btn-success' value='"+mater.materialCode+"' id='"+mater.materialName+"' data-toggle='modal' data-target='#addNextMaaterial' onclick='addNextMaaterialPre(this)'>添加下级材料</button></td></tr>"
		materTable.append(materHtml);
		if(children[i].children){
			showChildren(children[i].children,materTable);
		}
	}
}

/**
 * 删除单个材料
 * 
 * @param btn
 * @returns
 */
function deleteSingleMaterial(btn){
	var  materialId  = btn.value;
	var productId = btn.id;
	if(confirm("您真的要删除吗?")){
		$.ajax({
			cache: false,
			async: true,
			type: "POST",
			dataType: "json",
			data: {"param":"{'maters':[{'materialId':'"+materialId+"'}],'prodId':'"+productId+"'}"},
			url: "../mater/delMater.action",
			success: function(result) {
				toastr.success(result.meassage);
				findMaterial(btn,false);
			},
			error:function(result){
				toastr.error(result.meassage);
				findMaterial(btn,false);
			}
			
		});
	}
	
}

/**
 * 批量删除材料
 */
function deleteMaterial(){
	var productId = $("#deleteMaterialBtn").val();
	var maters = "[";
	$("input[name='materialCheckBox']").each(function(){
		if($(this).prop("checked")){
			maters+="{'materialId':"+$(this).val()+"},";
		}
	});
	maters = maters.substring(0,maters.length-1);
	maters +="]";
	
	if(confirm("您真的要删除吗?")){
		$.ajax({
			cache: false,
			async: true,
			type: "POST",
			dataType: "json",
			data: {"param":"{'maters':"+maters+",'prodId':'"+productId+"'}"},
			url: "../mater/delMater.action",
			success: function(result) {
				toastr.success(result.meassage);
				findMaterial(null,productId);
			},
			error:function(result){
				toastr.error(result.meassage);
				findMaterial(null,productId);
			}
		});
	}
}


/**
 * 为产品添加材料做准备
 * 
 * @param btn
 * @returns
 */
function addMaterial4ProductPre(btn){
	var productId = btn.value;
	var productName = $("#"+btn.value+"name").html();
	
	$("#productName").val(productName);
	$("#addMaterial4Pro").val(productId);
	
	
}

/**
 * 为产品添加材料
 * 
 * @param btn
 * @returns
 */
function addMaterial4Product(btn){
	var productId = btn.value;
	btn.id=productId;
	var materialCode = $("#materialCode").val();
	var materialName = $("#materialName").val();
	var materialNum = $("#materialNum").val();
	var materialStandard = $("#materialStandard").val();
	var materialSort = $('input[name="materialSort"]:checked').val();
	var materialCost = $("#materialCost").val();
	var materialUnit = $("#materialUnit").val();
	var materialContext = $("#materialContext").val();
	$.ajax({
		cache: false,
		async: true,
		type: "POST",
		dataType: "json",
		data: {"product.categoryId":productId,"material.materialCode":materialCode,"material.materialName":materialName,"material.materialNum":materialNum,"material.materialStandard":materialStandard,"material.materialSort":materialSort,"material.materialUnit":materialUnit,"material.materialContext":materialContext},
		url: "../mater/addMater.action",
		success: function(result) {
			toastr.success(result.meassage);
			$('#addMaterial4Product').modal('hide');
			findMaterial(null,productId);
		},
		error:function(result){
			toastr.error(result.meassage);
			$('#addMaterial4Product').modal('hide');
			findMaterial(null,productId);
		}
	});
}

/**
 * 修改材料准备
 * @param btn
 * @returns
 */
function editMaterialPre(btn){
	var materialId = btn.value;
	var mtaerialCode = btn.id;
	var materialName = $("#"+materialId+"Name").html();
	var materialNum = $("#"+materialId+"Num").html();
	var materialSort = $("#"+materialId+"Sort").html();
	var materialStandard = $("#"+materialId+"Standard").html();
	var materialUnit = $("#"+materialId+"Unit").html();
	var materialCost = $("#"+materialId+"Cost").html();
	var materialContext = $("#"+materialId+"Context").html();
	var productId = $("input[name='ProductId']").val();
	
	$("#editCode").val(mtaerialCode);
	$("#editName").val(materialName);
	$("#editStandard").val(materialStandard);
	$("#editUnit").val(materialUnit);
	$("#editContext").val(materialContext);
	$("#editNum").val(materialNum);
	$("#editCost").val(materialCost.substr(2,materialCost.length-1));
	
	if(materialSort == "半成品"){
		$("input[name='editSort'][value='2']").prop("checked",true);
		$("input[name='editSort'][value='1']").prop("checked",false);
	}else{
		$("input[name='editSort'][value='1']").prop("checked",true);
		$("input[name='editSort'][value='2']").prop("checked",false);
	}
	
	$("#editMaterialBtn").val(materialId);
	$("#editMaterialBtn").attr("name",productId);
}

/**
 * 修改材料
 */
function editMaterial(btn){
	var materialId = btn.value;
	var productId = btn.name;
	var materialCode = $("#editCode").val();
	var materialName = $("#editName").val();
	var materialStandard = $("#editStandard").val();
	var materialUnit = $("#editUnit").val();
	var materialContext = $("#editContext").val();
	var materialNum = $("#editNum").val();
	var materialCost = $("#editCost").val();
	var materialSort =$('input[name="editSort"]:checked').val();
	$.ajax({
		cache: false,
		async: true,
		type: "POST",
		dataType: "json",
		data: {"param":"{'materialId':'"+materialId+"','materialName':'"+materialName+"','materialCode':'"+materialCode+"','materialNum':"+materialNum+",'materialSort':'"+materialSort+"','materialStandard':'"+materialStandard+"','materialUnit':'"+materialUnit+"','materialCost':"+materialCost+",'materialContext':'"+materialContext+"'}"},
		url: "../mater/updateMater.action",
		success: function(result) {
			toastr.success(result.meassage);
			$('#editMaterial').modal('hide');
			findMaterial(null,productId);
		},
		error:function(result){
			toastr.error(result.meassage);
			$('#editMaterial').modal('hide');
			findMaterial(null,productId);
		}
	});
}


/**
 * 添加下级材料做准备
 * @param btn
 * @returns
 */
function addNextMaaterialPre(btn){
	var materialCode = btn.value;
	var materialName = btn.id;
	
	$("#addNextMaterialBtn").val(materialCode);
	$("#motherName").html(materialName);
}

/**
 * 添加下级材料
 * @param btn
 * @returns
 */
function addNextMaaterial(btn){
	var materialMother = btn.value;
	var productId = $("input[name='ProductId']").val();
	var materialCode = $("#Code").val();
	var materialName = $("#Name").val();
	var materialNum = $("#Num").val();
	var materialStandard = $("#Standard").val();
	var materialSort = $('input[name="Sort"]:checked').val();
	var materialCost = $("#Cost").val();
	var materialUnit = $("#Unit").val();
	var materialContext = $("#Context").val();
	var materialData = {"material.materialMother":materialMother,"material.materialCode":materialCode,"material.materialName":materialName,"material.materialNum":materialNum,"material.materialStandard":materialStandard,"material.materialSort":materialSort,"material.materialUnit":materialUnit,"material.materialContext":materialContext};
	$.ajax({
		cache: false,
		async: true,
		type: "POST",
		dataType: "json",
		data: materialData,
		url: "../mater/addMater.action",
		success: function(result) {
			toastr.success(result.meassage);
			$('#addNextMaaterial').modal('hide');
			findMaterial(null,productId);
		},
		error:function(result){
			toastr.error(result.meassage);
			$('#addNextMaaterial').modal('hide');
			findMaterial(null,productId);
		}
	});
}

/**
 * 显示成本栏
 * 
 * @returns
 */
function showCost(){
	$("#costPanel").show();
}


function showCost2(){
	$("#editCostPanel").show();
}

/**
 * 隐藏成本栏
 * 
 * @returns
 */
function hideCost(){
	$("#costPanel").hide();
}
function hideCost2(){
	$("#editCostPanel").hide();
}