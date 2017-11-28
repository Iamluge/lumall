/**
 * 材料清单功能
 * 
 * @returns
 */
function materialPurchase(){
	　$.get("../newpage/materialPurchase.html",function(data){ 
		$("#content").html(data);
	});
	// 加载产品列表
	$.ajax({
		cache: false,
		async: true,
		type: "POST",
		dataType: "json",
		data: {},
		url: "../productionPlan/findproPlanByCompany.action",
		success: function(result) {
			var proPlans = result.list;
			var table = $("#proPlanTable");
			for (var i = 0; i < proPlans.length; i++) {
				var plan = "<tr align='center' id='"+proPlans[i].productPlanId+"' class='info' onclick='findPlanMater(this)'><td>"+proPlans[i].productionPlanName+"</td><td>"+proPlans[i].startTime.split("T")[0]+"</td><td>"+proPlans[i].predictEndTime.split("T")[0]+"</td><td>"+proPlans[i].proNumber+"</td></tr>";
				table.append(plan);
			}
		}
	});
}

function findPlanMater(btn){
	var proPlanId = btn.id;
	$.post("../prodPlanMater/findPlanMater.action?extParam.param1="+proPlanId,{},function (result){
		var materials = result.list;
		var table = $("#materialsTable");
		table.html("<tr class='active'><th style='text-align: center;'>序号</th><th style='text-align: center;'>材料编号</th><th style='text-align: center;'>材料名称</th><th style='text-align: center;'>计量单位</th><th style='text-align: center;'>采购数量</th><th style='text-align: center;'>材料单价</th><th style='text-align: center;'>材料总成本</th></tr>");
		for (var i = 0; i < materials.length; i++) {
			var material = "<tr class='info' align='center'><td>"+(i+1)+"</td><td>"+materials[i].materialCode+"</td><td>"+materials[i].materialName+"</td><td>"+materials[i].materialUnit+"</td><td>"+materials[i].materialNum+"</td><td>￥ "+materials[i].materialCost+"</td><td>￥ "+(materials[i].materialCost*materials[i].materialNum)+"</td></tr>";
			table.append(material); 
		}
	});
}

/**
 * 打印
 * 
 * @returns
 */
function printPage(){
	var bodyHtml = document.body.innerHTML;
	document.body.innerHTML = $("#materialsDiv").html();
	window.print();
	document.body.innerHTML = bodyHtml;
}

/**
 * 导出excel
 * @returns
 */
function export2Excel() {
//	alert(1);
    var elTable = document.getElementById("materialsTable"); // table1改成你的tableID

    var oRangeRef = document.body.createTextRange();
	
    oRangeRef.moveToElementText(elTable);

    oRangeRef.execCommand("Copy");

    try {
        var appExcel = new ActiveXObject("Excel.Application");
    } catch (e) {
        alert("无法调用Office对象，请确保您的机器已安装了Office并已将本系统的站点名加入到IE的信任站点列表中！");
        return;
    }

    appExcel.Visible = true;

    appExcel.Workbooks.Add().Worksheets.Item(1).Paste();

    appExcel = null;

}