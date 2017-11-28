function createPersonManage(){
	　　$.get("../newpage/personManage.html",function(data){ 
		$("#content").html(data);
		$.ajax({
			cache: false,
			async: false,
			type: "POST",
			dataType: "json",
			data: {"page":"1","limit":"80"},
			url: "../sysUser/findPageSysUserByCompanyId.action",
			success: function(result) {
				var users = result.valueList;
				  var table = $("#personTable");
				  for (var i = 0; i <users.length; i++) {
					  var html ="<tr align='center'><td><input type='checkbox' onclick='check()' name='checkBox' value='"+users[i].userId+"'/></td><td>"+users[i].userId+"</td><td id='"+users[i].userId+"userName'>"+users[i].userName+"</td><td id='"+users[i].userId+"company' value='"+users[i].company.companyId+"'>"+users[i].company.companyName+"</td><td><button class='btn btn-info' data-toggle='modal' data-target='#editPerson' onclick='editPersonPre(this)' value='"+users[i].userId+"'>修改</button> <button class='btn btn-danger' value='"+users[i].userId+"' onclick='deleteSinglePerson(this)'>删除</button> <button class='btn btn-success' value='"+users[i].userId+"' onclick='setRolePre(this)' data-toggle='modal' data-target='#setRole'>设置角色</button> <button class='btn btn-danger' value='"+users[i].userId+"' onclick='deleteRolePre(this)' data-toggle='modal' data-target='#deleteRole'>删除角色</button></td></tr>";
					  table.append(html);
				 }
				  $("#company").html(users[0].company.companyName);
				  $("#company").attr("value",users[0].company.companyId);
				 
			}
		});
		
		});
}

/**
 * 添加人员
 * 
 * @returns
 */
function addPerson(){
	var id = $("#person_id").val();
	var name = $("#person_name").val();
	var company = $("#company").val();//
	$.post("../sysUser/addSysUser.action",{"extParam":"{\"extJsons\":\"{\\\"userId\\\":\\\""+id+"\\\",\\\"userName\\\":\\\""+name+"\\\"}\",\"param1\":\""+company+"\"}"},function(data){
		if(data.successOrFalse == "success"){
			toastr.success(data.meassage);
		}else{
			toastr.error(data.meassage);
		}
		createPersonManage();
	});
}

/**
 * 删除单个人员
 * @param btn
 * @returns
 */
function deleteSinglePerson(btn){
	if(confirm("您真的要删除吗？")){
		$.post("../sysUser/deleteSysUser.action",{"extParam":"{'extJsonList':"+btn.value+"}"},function(data){
			if(data.successJsonList){
				toastr.success("删除人员成功");
			}else{
				toastr.error("删除人员失败");
			}
			createPersonManage();
		});
	}
}

/**
 * 批量删除人员
 */
function deletePerson(){
	var flag = false;
	$("input[name='checkBox']").each(function(){
		if($(this).prop("checked")){
			flag = true;
			return false;
		}
	});
	if(!flag){
		alert("您还没勾选任何人员!");
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
		$.post("../sysUser/deleteSysUser.action",{"extParam":"{'extJsonList':"+ids+"}"},function(data){
			if(data.successJsonList){
				toastr.success("删除成功");
			}else{
				toastr.error("删除失败");
			}
			createPersonManage();
		});
	}
}

/**
 * 修改准备回显数据
 * @param btn
 * @returns
 */
function editPersonPre(btn){
	var id =btn.value;
	var userName = $("#"+id+"userName").html();
	var companyName = $("#"+id+"company").html();
	var companyId = $("#"+id+"company").attr("value"); 
	
	$("#editId").html(id);
	$("#editName").val(userName);
	$("#editCompany").html(companyName);
	$("#editCompany").val(companyId);
}

/**
 * 修改用户
 * @returns
 */
function editPerson(){
	var id = $("#editId").html();
	var userName = $("#editName").val();
	var companyId = $("#editCompany").val();
	
	$.post("../sysUser/editSysUser.action",{"extParam":"{\"extJsons\":\"{\\\"userId\\\":\\\""+id+"\\\",\\\"userName\\\":\\\""+userName+"\\\"}\",\"param1\":\""+companyId+"\"}"},function(data){
		if(data.successOrFalse == "success"){
			toastr.success(data.meassage);
		}else{
			toastr.error(data.meassage);
		}
		createPersonManage();
	});
}

/**
 * 为用户设置角色准备，展示所有角色
 * @param btn
 * @returns
 */
function setRolePre(btn){
	userId = btn.value;
	$("#setRoleBut").val(userId);
	
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
			  table.html("<tr class='active' align='center'><th style='text-align: center;'></th><th style='text-align: center;'>角色名称</th></tr>");
			  for (var i = 0; i <roles.length; i++) {
				  var html ="<tr align='center'><td><input type='checkbox' name='role' value='"+roles[i].roleId+"'/></td><td>"+roles[i].roleName+"</td></tr>";
				  table.append(html);
			 } 
			  
			$.ajax({
					cache: false,
					async: true,
					type: "POST",
					dataType: "json",
					data: {"userId":userId},
					url: "../sysRole/findSysRoleByUserId.action",
					success: function(data) {
						 var roles = "";
						 for (var i = 0; i <data.length; i++) {
							 roles +=data[i].roleName+" ";
						 }
						 table.append("<tr class='info' align='center'><td>已有角色</td><td>"+roles+"</td></tr>");
					}
				});
			 
		}
	});
	

}

/**
 * 为用户设置角色
 * @returns
 */
function setRole(){
	var userId = $("#setRoleBut").val();
	var ids = "";
	$("input[name='role']").each(function(){
		if($(this).prop("checked")){
			ids += $(this).val()+"`";
		}
	});
	ids = ids.substring(0,ids.length-1);
//	$.post("../sysRole/addRoleToUser.action",{"extParam":"{'extJsonList':"+ids+",'extJsonList2':'"+userId+"'}"},function(data){
//		toastr.success("设置角色成功");
//		createPersonManage();
//	});
	$.ajax({
		cache: false,
		async: true,
		type: "POST",
		dataType: "json",
		data: {"extParam":"{'extJsonList':"+ids+",'extJsonList2':'"+userId+"'}"},
		url: "../sysRole/addRoleToUser.action",
		success: function(data) {
			toastr.success("设置角色成功");
			createPersonManage();
		},
		error:function(data){
			toastr.error("设置角色失败");
			createPersonManage();
		}
	});
}

/**
 * 删除用户角色准备
 */
function deleteRolePre(btn){
	var userId = btn.value;
	$("#deleteRoleBut").val(userId);
	$.ajax({
		cache: false,
		async: true,
		type: "POST",
		dataType: "json",
		data: {"userId":userId},
		url: "../sysRole/findSysRoleByUserId.action",
		success: function(data) {
			var table = $("#roleTable2");
			table.html("<tr class='active' align='center'><th style='text-align: center;'></th><th style='text-align: center;'>角色名称</th></tr>");
			for (var i = 0; i <data.length; i++) {
				table.append("<tr class='info' align='center'><td><input type='checkbox' name='deleterole' value='"+data[i].roleId+"'/></td><td>"+data[i].roleName+"</td></tr>");
			 }
		}
	});
}

/**
 * 删除用户角色
 * @returns
 */
function deleteRoleFromUser(){
	var userId = $("#deleteRoleBut").val();
	var ids = "";
	$("input[name='deleterole']").each(function(){
		if($(this).prop("checked")){
			ids += $(this).val()+"`";
		}
	});
	ids = ids.substring(0,ids.length-1);
	
//	$.post("../sysRole/deleteRoleToUser.action",{"extParam":"{'extJsonList':"+ids+",'param1':'"+userId+"'}"},function(data){
//		toastr.success("删除角色成功");
//		createPersonManage();
//	});
	$.ajax({
		cache: false,
		async: true,
		type: "POST",
		dataType: "json",
		data: {"extParam":"{'extJsonList':"+ids+",'param1':'"+userId+"'}"},
		url: "../sysRole/deleteRoleToUser.action",
		success: function(data) {
			toastr.success("删除角色成功");
		},
		error:function(data){
			toastr.error("删除角色失败");
		}
	});
}
