

function findProcCategoryList2() {
	
	var productCode = document.getElementById("productCode").value;
	
	$.ajax({
		type : "POST",
		dataType : "json",
		data : {
		productCode : productCode
		},
		url : "../product/findProductByProductCode.action",
		success : function(result) {
				$.ajax({
								type : "POST",
								dataType : "json",
								data : {
									productCode : productCode
								},
								url : "../proCategroy/findProListbyCode.action",
								success : function(result) {
									location.reload();
								},
								error : function(data) {
									location.reload();
								}
							});
		},
		error : function(data) {
			location.reload();
		}
	});
}

//searchType ：0代表图片，1代表视频，２代表文字
function findResourceUrlList(proCgId,type) {
	var searchType = "";
	var url = "../processorInfo/findProInfoByDProcProd.action";
	if(type == "0"){
		searchType = "picture";
	}else if(type == "1"){
		searchType = "vedio";
	}else if(type == "2"){
		searchType = "text";
	}else if(type == "3"){
		url = "../index/findProInfoTemValue.action";
	}
	$.ajax({
		type : "POST",
		data : {
		procCgId : proCgId,
		searchType:searchType
		},

		url : url,

		success : function(result) {
			  $("#"+proCgId+type).html(result);
		},
		error : function(data) {
			 $("#"+proCgId+type).html(result);
		}
	});
}

function findDescription(proCgId){
	$.ajax({
		type : "POST",
		dataType: "json",
		data : {
		procCgId : proCgId
		},
		url : "../processorInfo/findKuaiDiByDProcProd.action",
		success : function(result) {
			$("#kuaidi").attr("src",result);
		},
		error : function(data) {
			// $("#"+proCgId+type).html(result);
			alert('出错');
		}
	});
	
 
}

