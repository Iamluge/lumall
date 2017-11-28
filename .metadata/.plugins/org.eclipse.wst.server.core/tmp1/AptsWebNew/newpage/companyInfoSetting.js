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
function createCompanyInfoSetting() {
	$.get("../newpage/companyInfoSetting.html", function(data) {
		$("#content").html(data);
	});
	loadCompany();
}

/**
 * 修改商家信息
 */
function editCompany() {
	var extJson = {};
	extJson.companyName = $('#companyName').val();
	extJson.pinyinEncoding = $('#pinyinEncoding').val();
	extJson.address = $('#address').val();
	extJson.recordNumber = $('#recordNumber').val();
	extJson.telephone = $('#telephone').val();
	extJson.description = $('#description').val();
	extJson.commitment = $('#commitment').val();
	$.ajax({
		url : '../company/companyInfoSetting.action',
		cache : false,
		async : false,
		type : "POST",
		dataType : "json",
		data : {
			extJson : JSON.stringify(extJson)
		},
		success : function(extMessage) {
			var sof = extMessage.successOrFalse;
			if (sof == "success") {
				toastr.success(extMessage.meassage);
			} else if (sof == "false") {
				toastr.error(extMessage.meassage);
			}
			loadCompany();
		}
	});

}

/**
 * 加载商家信息
 */
function loadCompany() {
	$.ajax({
		url : '../company/findCompanyInfo.action',
		method : 'GET',
		async : false,
		success : function(extMessage) {
			console.info(extMessage);
			// 获取商家所有信息
			var companyMessage = $.parseJSON(extMessage.extJson);
			// 获取是否成功
			var sof = extMessage.successOrFalse;
			if (sof == "false") {
				toastr.error(extMessage.meassage);
			} else if (sof == "success") {
				$('#companyName').val(companyMessage.companyName);
				$('#pinyinEncoding').val(companyMessage.pinyinEncoding);
				$('#address').val(companyMessage.address);
				$('#recordNumber').val(companyMessage.recordNumber);
				$('#telephone').val(companyMessage.telephone);
				$('#description').val(companyMessage.description);
				$('#commitment').val(companyMessage.commitment);
				/*
				 * http://localhost:8080/file/trademark/ea87a3d3-3e0e-4c5e-8d21-5cc4dc152879.jpg
				 * $('#trademark') .val( "http://localhost:8080/file/" +
				 * companyMessage.trademark); $('#headImage') .val(
				 * "http://localhost:8080/file/" + companyMessage.headImage);
				 */
			}
			$('body,html').animate({
				scrollTop : 0
			}, 10);
		}
	});
}