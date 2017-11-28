window.onload = function() {
	var icons = document.getElementsByName("icon");
	for (var i = 0; i < icons.length; i++) {
		var id = icons[i].getAttribute("id");
		if(id=="二维码管理"){
			icons[i].setAttribute("class", "icon-th-large");
		}
		if(id=="生产管理"){
			icons[i].setAttribute("class", "icon-legal");
		}
		if(id=="视频监控"){
			icons[i].setAttribute("class", "icon-facetime-video");
		}
		if(id=="用户管理"){
			icons[i].setAttribute("class", "icon-user");
		}
		if(id=="商家产品管理"){
			icons[i].setAttribute("class", "icon-truck");
		}
		if(id=="流程监控"){
			icons[i].setAttribute("class", "icon-eye-open");
		}
		if(id=="商家信息设置"){
			icons[i].setAttribute("class", "icon-cog");
		}
		if(id=="进入企业诚信主页"){
			icons[i].setAttribute("class", "icon-dashboard");
		} 
	}
}