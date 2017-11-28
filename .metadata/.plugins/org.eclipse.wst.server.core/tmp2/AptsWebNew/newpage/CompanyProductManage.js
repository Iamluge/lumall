/**
 * 文件中所有方法对应商家产品管理功能
 */
var up;
var globalProdImage = "";
var globalProductId = "";
/**
 * 初始化商家产品列表
 */

function createCompanyProductManage(){
	　　$.get("../newpage/CompanyProductManage.html",function(data){ 
		$("#content").html(data);
		refreshProduct();
	　　}); 
}

/**
 * 刷新产品列表
 * 
 * @returns
 */
function refreshProduct(){
	$.ajax({
		cache: false,
		async: true,
		type: "POST",
		dataType: "json",
		data: {},
		url: "../productCategory/findProductCategoryByCompanyId.action",
		success: function(result) {
			$('#productTable tr[class="info"]').remove();
			var table = $("#productTable");
			for (var i = 0; i < result.length; i++) {
				var isPublish;
				if(result[i].isPublish == 1){
					isPublish = "是";
				}else{
					isPublish = "否";
				}
				var html = "<tr class='info' align='center'><td><input type='checkbox' name='checkBox' value='"+result[i].categoryId+"' onclick='check()'/></td><td>"+result[i].categoryName+"</td><td>"+result[i].categoryDescription+"</td><td>"+isPublish+"</td><td><button class='btn btn-success' type='button' data-toggle='modal' data-target='#brow' value='"+result[i].categoryId+"' onclick='openCategory(this)'>查看</button>&nbsp;<button class='btn btn-info' type='button' value='"+result[i].categoryId+"' onclick='editProductFun(this)'>修改</button>&nbsp;<button class='btn  btn-danger' value='"+result[i].categoryId+"' onclick='deleteSingleCategory(this)'>删除</button></td></tr>";
				table.append(html);
			}
		}
	});
}

/**
 * 添加商家产品
 */
function addgory(){
	var extParam = {};
	var extJsons = {};
	extJsons.categoryName = $('#categoryName').val();
	extJsons.categoryDescription = $('#categoryDescription').val();
	extJsons.imageUrl = globalProdImage;
	extParam.extJsons =JSON.stringify(extJsons);
	$.ajax({
		url :'../productCategory/addProductCategoryToCompany.action',
		dataType : "json",
		cache : false,
		async : false,
		method : "POST",
		data:{
			extParam:JSON.stringify(extParam)
		},
		success : function(result) {
			var sof = result.successOrFalse;
			if(sof == "success"){
				toastr.success(result.meassage);
			}else{
				toastr.error(result.meassage);
			}
			$('#addProduct').modal('hide');
			refreshProduct();
		}
	});
}

/**
 * 查看商家产品
 * 
 * @param btn
 * @returns
 */
function openCategory( btn ){
	
		$.post("../productCategory/findProductCategoryById.action",{'productCategoryId':btn.value},function(data){
			
			$("#browName").text(data.categoryName);
			$("#browDescription").text(data.categoryDescription);
			$("#browImg").attr("src","http://localhost:8080/file/"+data.imageUrl);
			
		});
}
/**
 * 选择/取消发布
 * 
 * @returns
 */
function publishOrNot(){
	var flag = false;
	$("input[name='checkBox']").each(function(){
		if($(this).prop("checked")){
			flag = true;
			return false;
		}
	});
	if(!flag){
		alert("您还没勾选任何产品!");
		return;
	}
	
	var ids = "";
	$("input[name='checkBox']").each(function(){
		if($(this).prop("checked")){
			ids += $(this).val()+"`";
		}
	});
	ids = ids.substring(0,ids.length-1);
	
	if(confirm("您真的要发布产品或者取消发布吗？")){
		$.post("../productCategory/publishProductCategory.action",{"extParam":"{'extJsonList':"+ids+"}"},function(data){
			if(data.successJsonList){
				toastr.success("发布或取消发布产品成功");
			}else{
				toastr.error("发布或取消发布产品失败");
			}
			createCompanyProductManage();
		});
	}
	
}

/**
 * 批量删除
 * 
 * @returns
 */
function deleteCategory(){
	var flag = false;
	$("input[name='checkBox']").each(function(){
		if($(this).prop("checked")){
			flag = true;
			return false;
		}
	});
	if(!flag){
		alert("您还没勾选任何产品!");
		return;
	}
	
	var ids = "";
	$("input[name='checkBox']").each(function(){
		if($(this).prop("checked")){
			ids += $(this).val()+"`";
		}
	});
	ids = ids.substring(0,ids.length-1);
	
	if(confirm("您真的要删除吗？")){
		$.post("../productCategory/deleteProductCategory.action",{"extParam":"{'extJsonList':"+ids+"}"},function(data){
			if(data.successJsonList){
				toastr.success("删除产品成功");
			}else{
				toastr.error("删除产品失败");
			}
			createCompanyProductManage();
		});
	}
}

/**
 * 删除商家产品
 * 
 * @param btn
 * @returns
 */
function deleteSingleCategory( btn ){

	if(confirm("您真的要删除吗？")){
		$.post("../productCategory/deleteProductCategory.action",{"extParam":"{'extJsonList':"+btn.value+"}"},function(data){
			if(data.successJsonList){
				toastr.success("删除产品成功");
			}else{
				toastr.error("删除产品失败");
			}
			createCompanyProductManage();
		});
	}
}

function addIamgeFun(){
	// 清空
	$('#categoryName').val("");
	$('#categoryDescription').val("");
	$('#productImg').attr("src","");
	$('#addProduct').modal();
}
/**
 * 上传图片
 * 
 * @returns
 */
function addIamge(IamgeId){
	// 初始化上传菜单
	$('#upload').empty();
	$('#addImage').modal();
	up = $('#upload').Huploadify({
		fileTypeExts:'*.*',
		uploader:'http://10.15.134.254:8080/AptsUpload/uploadImage.action',
		auto:false,
		method:'post',// 发送请求的方式，get或post
		multi:true,// 是否允许选择多个文件
		formData:{'resourceType':'prodImage'},// 发送给服务端的参数，格式：{key1:value1,key2:value2}
		fileObjName:'file',// 在后端接受文件的参数名称，如PHP中的$_FILES['file']
		showUploadedPercent:true,// 是否实时显示上传的百分比，如20%
		showUploadedSize:false,// 是否实时显示已上传的文件大小，如1M/2M
		buttonText:'选择文件',// 上传按钮上的文字
	    onUploadComplete:function(file,jsonData){// jsonData:接口返回的数据
	        $('#addImage').modal('hide');
	        var json = eval("("+jsonData+")");
	        if(json.success){
	        	toastr.success("图片上传成功，完善其他信息");
	        	$('#'+IamgeId.id+'').attr("src","http://10.15.134.254:8080/file/"+json.fileName);
	        	globalProdImage = json.fileName;
	        }
	    }
	});
}

/**
 * 加载修改产品信息
 * 
 * @param btn
 * @returns
 */
function editProductFun(btn){
	globalProductId = btn.value;
	$.post("../productCategory/findProductCategoryById.action",{'productCategoryId':btn.value},function(data){
		$("#editCategoryName").val(data.categoryName);
		$("#editCategoryDescription").val(data.categoryDescription);
		$("#editProductImg").attr("src","http://localhost:8080/file/"+data.imageUrl);
	});
	$('#editProduct').modal();
}

/**
 * 修改产品信息
 * 
 * @returns
 */
function editProduct(){
	var extJson = {};
	extJson.categoryId = globalProductId;
	extJson.categoryName = $('#editCategoryName').val();
	extJson.categoryDescription = $('#editCategoryDescription').val();
	extJson.imageUrl = globalProdImage;
	$.ajax({
		url :'../productCategory/editProductCategory.action',
		dataType : "json",
		cache : false,
		async : false,
		method : "POST",
		data:{
			extJson:JSON.stringify(extJson)
		},
		success : function(result) {
			var sof = result.successOrFalse;
			if(sof == "success"){
				toastr.success(result.meassage);
			}else{
				toastr.error(result.meassage);
			}
			$('#editProduct').modal('hide');
			refreshProduct();
		}
	});
}