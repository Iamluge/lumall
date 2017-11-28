/**
 * 文件中所有的方法对应所有视频监控功能
 */


/**
 * 初始化摄像头列表
 */
function createVedioControlPanel(){
	　　$.get("../newpage/video.html",function(data){ 
													
	　　　　$("#content").html(data);
		$.ajax({
			cache: false,
			async: true,
			type: "POST",
			dataType: "json",
			data: {},
			url: "../camera/findCaremaByCompanyId.action",
			success: function(result) {
				var table = $("#cameraTable");
				for (var i = 0; i < result.length; i++) {
					var html = "<tr style='text-align:center;' class='info'><td><input type='checkbox' onclick='check()' name='checkBox' value='"+result[i].id+"'/></td><td id='"+result[i].id+"name'>"+result[i].name+"</td><td id='"+result[i].id+"position'>"+result[i].position+"</td><td id='"+result[i].id+"ip'>"+result[i].ip+"</td><td id='"+result[i].id+"port'>"+result[i].port+"</td><td><button class='btn btn-success' value='"+result[i].id+"' onclick='openCamera(this)'>打开</button>&nbsp;<button type='button' class='btn btn-info' onclick='editCameraPre(this)' data-toggle='modal' data-target='#editCamera' value='"+result[i].id+"'>修改</button>&nbsp;<button class='btn btn-danger' value='"+result[i].id+"' onclick='deleteSingleCamera(this)'>删除</button></td></tr>";
					table.append(html);
				}
			}
		});
	
	　　}); 
}

/**
 * 打开摄像头
 */
function openCamera(btn){
	var ip = $("#"+btn.value+"ip").text();
	var port = $("#"+btn.value+"port").text();
	window.open("http://"+ip+":"+port);   
}

/**
 * 批量删除摄像头
 * 
 * @param btn
 * @returns
 */
function deleteCamera(){
	var flag = false;
	$("input[name='checkBox']").each(function(){
		if($(this).prop("checked")){
			flag = true;
			return false;
		}
	});
	if(!flag){
		alert("您还没勾选任何摄像头!");
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
		$.post("../camera/deleteCamera.action",{"extParam":"{'extJsonList':"+ids+"}"},function(data){
			if(data.successJsonList){
				toastr.success("删除成功");
			}else{
				toastr.error("删除失败");
			}
			createVedioControlPanel();
		});
	}
}

/**
 * 删除单个摄像头
 */
function deleteSingleCamera( btn ){
	if(confirm("您真的要删除吗？")){
		$.post("../camera/deleteCamera.action",{"extParam":"{'extJsonList':"+btn.value+"}"},function(data){
			if(data.successJsonList){
				toastr.success("删除成功");
			}else{
				toastr.error("删除失败");
			}
			createVedioControlPanel();
		});
	}
}

/**
 * 修改摄像头
 */
function editCamera(btn){
	var id = btn.value;
	var ip = $("#editIp").val();
	var port = $("#editPort").val();
	var name = $("#editName").val();
	var position = $("#editPosition").val();
	var userName =  $("#editUserName").val();
	var password = $("#editPassword").val();
	
	var extJson = "{'ip':'"+ip+"','port':'"+port+"','name':'"+name+"','position':'"+position+"','userName':'"+userName+"','password':'"+password+"','id':'"+id+"'}";
	$.post("../camera/editCamera.action",{'extJson':extJson},function(data){
		if(data.successOrFalse == "success"){
			toastr.success(data.meassage);
		}else{
			toastr.error(data.meassage);
		}
		createVedioControlPanel();
	});
}

/**
 * 修改摄像头准备回显数据
 */
function editCameraPre( btn ){
	var ip = $("#"+btn.value+"ip").text();
	var port = $("#"+btn.value+"port").text();
	var name = $("#"+btn.value+"name").text();
	var position = $("#"+btn.value+"position").text();
	
	$("#edtiCamera").val(btn.value);
	$("#editIp").val(ip);
	$("#editPort").val(port);
	$("#editName").val(name);
	$("#editPosition").val(position);
	
}


/**
 * 添加摄像头
 */
function addCamera(){
	var ip = $("#ip").val();
	var port = $("#port").val();
	var name = $("#name").val();
	var position = $("#position").val();
	var userName = $("#userName").val();
	var password = $("#password").val();
	
	var extJson = "{'ip':'"+ip+"','port':'"+port+"','name':'"+name+"','position':'"+position+"','userName':'"+userName+"','password':'"+password+"'}";
	$.post("../camera/addCamera.action",{'extJson':extJson},function(data){
		if(data.successOrFalse == "success"){
			toastr.success(data.meassage);
		}else{
			toastr.error(data.meassage);
		}
		createVedioControlPanel();
	});
}

