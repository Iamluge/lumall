function createCompanyRoleSetting(){
	　　$.get("../newpage/roleManage.html",function(data){ 
		$("#content").html(data);
		
		$.ajax({
			cache: false,
			async: true,
			type: "POST",
			dataType: "json",
			data: {},
			url: "../sysRole/findRoleByCompanyId.action",
			success: function(result) {
				var roles = result;
				  var table = $("#roleTable");
				  for (var i = 0; i <roles.length; i++) {
					  var html ="<tr align='center'><td><input type='checkbox' onclick='check()' name='checkBox' value='"+roles[i].roleId+"'/></td><td id='"+roles[i].roleId+"name'>"+roles[i].roleName+"</td><td id='"+roles[i].roleId+"description'>"+roles[i].description+"</td><td id='"+roles[i].roleId+"minuteDescription'>"+roles[i].minuteDescription+"</td><td><button class='btn btn-info' data-toggle='modal' data-target='#editRole' onclick='editRolePre(this)' value='"+roles[i].roleId+"'>修改</button> <button class='btn btn-danger' value='"+roles[i].roleId+"' onclick='deleteSingleRole(this)'>删除</button> <button class='btn btn-success' data-toggle='modal' data-target='#powerSetting' value='"+roles[i].roleId+"' onclick='powerSettingPre(this)'>设置权限</button> <button class='btn btn-success' data-toggle='modal' data-target='#powerDel' value='"+roles[i].roleId+"' id='"+roles[i].roleName+"' onclick='powerDelPre(this)'>注销权限</button></td></tr>";
					  table.append(html);
				 }
				 
			}
		});
		});
}

/**
 * 注销权限准备
 * @param btn
 * @returns
 */
function powerDelPre(btn){
	var roleName = btn.id;
	var roleId = btn.value;
	$("#powerDelBtn").val(roleId);
	
	$("li[name='powerli']").attr("hidden","true");
	$("input[name='powerdel']").prop("checked",false)
	
	//$("#4028ab5147c3a3260147c41329070000").removeAttr("hidden");
	$("#rolesPower").html("<i class='icon-legal'></i> "+roleName+"拥有的权限（注销选中的权限）");
	
	$.post("../sysPower/findPowerByRoleIdAndPowerId.action",{"roleId":roleId,"node":1000},function(data){
		for (var i = 0; i < data.length; i++) {
			//alert(data[i].id);
			$("#"+data[i].id).removeAttr("hidden");
			
			$.post("../sysPower/findPowerByRoleIdAndPowerId.action",{"roleId":roleId,"node":data[i].id},function(result){
				for (var i = 0; i < result.length; i++) {
					//alert(result[i].id);
					$("#"+result[i].id).removeAttr("hidden");
				}
			});
		}
	});
}

/**
 * 注销角色权限
 * @returns
 */
function powerDel(){
	var roleId = $("#powerDelBtn").val();
	var ids = "";
	$("input[name='powerdel']").each(function(){
		if($(this).prop("checked")){
			ids += $(this).val()+"`";
		}
	});
	ids = ids.substring(0,ids.length-1);
	$.ajax({
		cache: false,
		async: true,
		type: "POST",
		dataType: "json",
		data: {"extParam":"{'extJsonList':"+ids+",'param1':'"+roleId+"'}"},
		url: "../sysPower/deletePowerToRole.action",
		success: function(result) {
			toastr.success("注销权限成功");
		},
		error:function(result){
			toastr.error("注销权限失败");
		}
	});
}

/**
 * 添加角色
 * 
 * @returns
 */
function addRole(){
	var name = $("#role_name").val();
	var description = $("#role_description").val();
	var minuteDescription = $("#role_minuteDescription").val();//
	var extJson = "{'roleName':'"+name+"','description':'"+description+"','minuteDescription':'"+minuteDescription+"'}";
	$.post("../sysRole/addRoleByCompany.action",{"extJson":extJson},function(data){
		if(data.successOrFalse == "success"){
			toastr.success(data.meassage);
		}else{
			toastr.error(data.meassage);
		}
		createCompanyRoleSetting();
	});
}

/**
 * 删除单个角色
 * 
 * @param btn
 * @returns
 */
function deleteSingleRole(btn){
	if(confirm("您真的要删除吗？")){
		$.post("../sysRole/deleteSysRole.action",{"extParam":"{'extJsonList':"+btn.value+"}"},function(data){
			if(data.successJsonList){
				toastr.success("删除角色成功");
			}else{
				toastr.error("删除角色失败");
			}
			createCompanyRoleSetting();
		});
	}
}

/**
 * 批量删除角色
 */
function deleteRole(){
	var flag = false;
	$("input[name='checkBox']").each(function(){
		if($(this).prop("checked")){
			flag = true;
			return false;
		}
	});
	if(!flag){
		alert("您还没勾选任何角色!");
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
		$.post("../sysRole/deleteSysRole.action",{"extParam":"{'extJsonList':"+ids+"}"},function(data){
			createCompanyRoleSetting();
		});
	}
}

/**
 * 修改准备回显数据
 * 
 * @param btn
 * @returns
 */
function editRolePre(btn){
	var id =btn.value;
	var roleName = $("#"+id+"name").html();
	var description = $("#"+id+"description").html();
	var minuteDescription = $("#"+id+"minuteDescription").html(); 
	
	$("#editName").val(roleName);
	$("#editDescription").val(description);
	$("#editMinuteDescription").val(minuteDescription);
	$("#edtiRole").val(id);
}

/**
 * 修改用户
 * 
 * @returns
 */
function editRole(btn){
	var roleName = $("#editName").val();
	var description = $("#editDescription").val();
	var minuteDescription = $("#editMinuteDescription").val();
	var id =btn.value;
	
	var extJson = "{'roleId':'"+id+"','roleName':'"+roleName+"','description':'"+description+"','minuteDescription':'"+minuteDescription+"'}";
	$.post("../sysRole/editSysRole.action",{"extJson":extJson},function(data){
		if(data.successOrFalse == "success"){
			toastr.success(data.meassage);
		}else{
			toastr.error(data.meassage);
		}
		createCompanyRoleSetting();
	});
}


/**
 * 设置权限准备工作，显示当前拥有的权限
 * 
 * @returns
 */
function powerSettingPre(btn){
	var id = btn.value;
	$("#powerSetting").val(id);
	$("input[name='power']").prop("checked", false);
	// 获取当前角色拥有的的权限，选中复选框
	$.post("../sysPower/findPowerByRoleIdAndPowerId.action",{"roleId":id,"node":1000},function(data){
		for (var i = 0; i < data.length; i++) {
			$("input[value='"+data[i].id+"']").prop("checked", true);
			
			$.post("../sysPower/findPowerByRoleIdAndPowerId.action",{"roleId":id,"node":data[i].id},function(result){
				for (var i = 0; i < result.length; i++) {
					$("input[value='"+result[i].id+"']").prop("checked", true);
				}
			});
		}
	});
}

/**
 * 设置用户权限
 * 
 * @param btn
 * @returns
 */
function powerSet(){
	var roleId = $("#powerSetting").val();
	var ids = "";
	$("input[name='power']").each(function(){
		if($(this).prop("checked")){
			ids += $(this).val()+"`";
		}
	});
	ids = ids.substring(0,ids.length-1);
	
	
//	$.post("../sysPower/addPowerToRole.action",{"extParam":"{'extJsonList':"+ids+",'extJsonList2':'"+roleId+"'}"},function(data){
//		createCompanyRoleSetting();
//	});
	
	$.ajax({
		cache: false,
		async: true,
		type: "POST",
		dataType: "json",
		data: {"extParam":"{'extJsonList':"+ids+",'extJsonList2':'"+roleId+"'}"},
		url: "../sysPower/addPowerToRole.action",
		success: function(result) {
			toastr.success("设置权限成功");
		},
		error:function(result){
			toastr.error("设置权限失败");
		}
	});
	
}
