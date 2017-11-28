/*专门为复选框的功能,全选id为checkBoss,旗下name为checkBox*/
/**
 * 选择所有的摄像头
 */
function checkAll() {
	var checked = $("#checkBoss").prop("checked");
	if (!checked) {
		$("input[name='checkBox']").prop("checked", false);
	} else {
		$("input[name='checkBox']").prop("checked", true);
	}
}

/**
 * 判断是否选中了所有的复选框，让最上面那个选中
 */
function check() {
	var flag = true;
	$("input[name='checkBox']").each(function(){
		if(!$(this).prop("checked")){
			flag = false;
		}
	});
	if(flag){
		$("#checkBoss").prop("checked",true);
	}else{
		$("#checkBoss").prop("checked",false);
	}
}

