var createHomePage = function(createTabPanel) {
	/**
	 * 商家产品管理
	 */
	var CompanyProductManageHome = createCompanyProductManageHome(false,createTabPanel);
	/**
	 * 流程类表
	 */
	var ComapanyProcessorManageHome = createComapanyProcessorManageHome(createTabPanel);
	/**
	 * 人员
	 */
	var PersonManageHome = createPersonManageHome(createTabPanel);
	/**
	 * 流程信息
	 */
	var ProcessorInfoManageHome = createProcessorInfoManageHome(createTabPanel);

	var CompanyProductManageHomePanel = Ext.create('Ext.panel.Panel', {
		region : 'north',
		height : '50%',
		layout : 'anchor',
		items : [ CompanyProductManageHome ]
	});
	
	var ProcessorInfoManagePanel = Ext.create('Ext.panel.Panel', {
		region : 'center',
		height : '50%',
		layout : 'anchor',
		items : [ ProcessorInfoManageHome ]
	});

	var westPanel = Ext.create('Ext.panel.Panel', {
		region : 'west',
		height : '100%',
		width:"50%",
		layout : 'border',
		items : [ CompanyProductManageHomePanel, ProcessorInfoManagePanel]
	});
	
	var ComapanyProcessorManagePanel = Ext.create('Ext.panel.Panel', {
		region : 'north',
		height : '50%',
		layout : 'anchor',
		items : [ ComapanyProcessorManageHome ]
	});
	
	var PersonManagePanel = Ext.create('Ext.panel.Panel', {
		region : 'center',
		height : '50%',
		layout : 'anchor',
		items : [ PersonManageHome ]
	});

	
	/*
	 * 预警公告面板：将预警和公告放在一起 @dongdong
	 */
	var centerPanel = Ext.create('Ext.panel.Panel', {
		region : 'center',
		height : '100%',
		flex : 4,
		width:"50%",
		split : true,
		layout : 'border',
		items : [ ComapanyProcessorManagePanel, PersonManagePanel ]
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
		items : [ westPanel, centerPanel ]
	});
	return homePage;
};
