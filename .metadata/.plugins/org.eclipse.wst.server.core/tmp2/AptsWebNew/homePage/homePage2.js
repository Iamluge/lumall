var createHomePage2 = function() {
	
	/**
	 * 商家产品管理
	 */
	var CompanyProductManageHome = createCompanyProductManageHome(true);
	/**
	 * 流程信息
	 */
	var ProcessorInfoManageHome = createProcessorInfoManageHome();

	var CompanyProductManageHomePanel = Ext.create('Ext.panel.Panel', {
		region : 'west',
		height : '100%',
		width:"50%",
		layout : 'anchor',
		items : [ CompanyProductManageHome ]
	});
	
	var ProcessorInfoManagePanel = Ext.create('Ext.panel.Panel', {
		region : 'center',
		height : '100%',
		width:"50%",
		layout : 'anchor',
		items : [ ProcessorInfoManageHome ]
	});


	
	var homePage = Ext.create('Ext.Panel', {
		id : 'new00',
		title : '<font size=2><center>首页</center></font>',
		closable : false,
		anchor : "100% 100%",
		split : true,
		title : "首页",
		layout : {
			type : 'border',
			align : 'center'
		},
		items : [ CompanyProductManageHomePanel, ProcessorInfoManagePanel ]
	});
	return homePage;
};
