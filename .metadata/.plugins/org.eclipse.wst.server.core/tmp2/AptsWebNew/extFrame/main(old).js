Ext.require([ 'Ext.grid.Panel', 'Ext.panel.Panel', 'Ext.tab.Panel',
		'Ext.window.Window', 'Ext.container.Viewport' ]);

var tabmeuntab1 = null;
var tabmeuntab2 = null;
var tabmeuntab3 = null;
var tabmeuntab4 = null;
var tabmeuntab5 = null;
var tabmeuntab6 = null;
var tabmeuntab7 = null;
var tabmeuntab8 = null;
var tabmeuntab9 = null;
var tabmeunlogout = null;

/*
 * var headPanel=Ext.create("Ext.panel.Panel",{ layout : 'fit', bodyStyle:"",
 * renderTo : Ext.getBody() })
 */
var imagePanel = {
	xtype : 'component',// 将xtype设置为box图片充满整个panel
	name : 'bantouImage',
	id : 'bantouImage',
	autoEl : {
		tag : 'img', // 指定为img标签
		src : '../images/bantou.jpg' // 指定url路径 ,一般为相对路径
	}
}

var menu = Ext.create("Ext.panel.Panel", {
	height : '100%',
	layoutConfig : {
		animate : true
	},
	items : [ {
		xtype : "button",
		text : '<b><font size=2>人员管理</font></b>',
		width : 184,
		heigth : 80,
		handler : function() {
			if (Ext.getCmp('tabmeuntab1') == null) {
				tabPanels.add({
					layout : "fit",
					title : '人员管理',
					id : 'tabmeuntab1',
					closable : true,
					items : createPersonManage()
				}).show();
			} else {
				Ext.getCmp('tabmeuntab1').show();
			}

		}
	}, {
		xtype : "button",
		text : '<b><font size=2>商家管理</font></b>',
		width : 184,
		heigth : 80,
		handler : function() {
			if (Ext.getCmp('tabmeuntab2') == null) {
				tabPanels.add({
					layout : "fit",
					title : '商家管理',
					id : 'tabmeuntab2',
					closable : true,
					items : createCompanyManage()
				}).show();
			} else {
				Ext.getCmp('tabmeuntab2').show();
			}
		}
	}, {
		xtype : "button",
		text : '<b><font size=2>商家流程管理</font></b>',
		width : 184,
		heigth : 80,
		handler : function() {
			if (Ext.getCmp('tabmeuntab3') == null) {
				tabPanels.add({
					layout : "fit",
					title : '商家流程管理',
					id : 'tabmeuntab3',
					closable : true,
					items : createComapanyProcessorManage()
				}).show();
			} else {
				Ext.getCmp('tabmeuntab3').show();
			}
		}
	}, {
		xtype : "button",
		text : '<b><font size=2>商家产品管理</font></b>',
		width : 184,
		heigth : 80,
		handler : function() {
			if (Ext.getCmp('tabmeuntab4') == null) {
				tabPanels.add({
					layout : "fit",
					title : '商家产品管理',
					id : 'tabmeuntab4',
					closable : true,
					items : createCompanyProductManage()
				}).show();
			} else {
				Ext.getCmp('tabmeuntab4').show();
			}
		}
	}, {
		xtype : "button",
		text : '<b><font size=2>流程管理</font></b>',
		width : 184,
		heigth : 80,
		handler : function() {
			if (Ext.getCmp('tabmeuntab5') == null) {
				tabPanels.add({
					layout : "fit",
					title : '流程管理',
					id : 'tabmeuntab5',
					closable : true,
					items : createAddProcessorToCompany()
				}).show();
			} else {
				Ext.getCmp('tabmeuntab5').show();
			}
		}
	}, {
		xtype : "button",
		text : '<b><font size=2>流程信息管理</font></b>',
		width : 184,
		heigth : 80,
		handler : function() {
			if (Ext.getCmp('tabmeuntab6') == null) {
				tabPanels.add({
					layout : "fit",
					title : '流程信息管理',
					id : 'tabmeuntab6',
					closable : true,
					items : createProcessorInfoManage()
				}).show();
			} else {
				Ext.getCmp('tabmeuntab6').show();
			}
		}
	}, {
		xtype : "button",
		text : '<b><font size=2>流程信息注册</font></b>',
		width : 184,
		heigth : 80,
		handler : function() {
			if (Ext.getCmp('tabmeuntab7') == null) {
				tabPanels.add({
					layout : "fit",
					title : '流程信息注册',
					id : 'tabmeuntab7',
					closable : true,
					items : createProcessorInfoRegister()
				}).show();
			} else {
				Ext.getCmp('tabmeuntab7').show();
			}
		}
	}, {
		xtype : "button",
		text : '<b><font size=2>角色管理</font></b>',
		width : 184,
		heigth : 80,
		handler : function() {
			if (Ext.getCmp('tabmeuntab8') == null) {
				tabPanels.add({
					layout : "fit",
					title : '角色管理',
					id : 'tabmeuntab8',
					closable : true,
					items : createRoleSettingPanel()
				}).show();
			} else {
				Ext.getCmp('tabmeuntab8').show();
			}
		}
	}, {
		xtype : "button",
		text : '<b><font size=2>权限管理</font></b>',
		width : 184,
		heigth : 80,
		handler : function() {
			if (Ext.getCmp('tabmeuntab9') == null) {
				tabPanels.add({
					layout : "fit",
					title : '权限管理',
					id : 'tabmeuntab9',
					closable : true,
					items : createPowerSettingPanel()
				}).show();
			} else {
				Ext.getCmp('tabmeuntab9').show();
			}
		}
	}, {
		xtype : "button",
		text : '<b><font size=2>注销</font></b>',
		width : 184,
		heigth : 80,
		handler : function() {
			Ext.Ajax.request({
				url : "../sysUser/logout.action",
				method : "POST",
				success : function() {
					window.location.href = "../login.jsp";
				}
			});
		}
	} ]
})

var tabPanels = Ext.create("Ext.tab.Panel", {
	// id : 'tabsPanel',
	resizeTabs : true,
	enableTabScroll : false,
	autoScroll : false,
	anchor : "100% 100%",
	defaults : {
		autoScroll : true
	// bodyPadding: 10
	}
});

var centerMain = Ext.create('Ext.panel.Panel', {
	region : 'center',
	// width:'',
	height : '80%',
	layout : 'anchor',
	id : 'centerL',
	items : [ tabPanels ]
});

Ext.onReady(function() {
	var viewport = Ext.create("Ext.container.Viewport", {
		layout : 'border',
		renderTo : 'viewport',
		autLoad : true,
		frame : true,
		items : [ {
			collapsible : false,
			region : 'north',
			// html : '<br><center><font1>农产品溯源系统</font1></center>',
			items : imagePanel,
			heigth : 120
		}, {
			items : menu,
			collapsible : false,
			region : 'west',
			width : 184
		}, {
			layout : 'fit',
			collapsible : false,
			region : 'center',
			items : centerMain
		} ]
	});
});
