/**
 * 流程操作
 * @return {}
 */
var createProcessorInfoManageHome = function(createTabPanel) {
/**
 * 把对应的一条权限记录查出来
 */
var sessionPower = {};
Ext.Ajax.request({
	url:'../sysPower/findPowerById.action?powerId=4028a89b45bcc3d10145bcc89c5e0005',
	method:'GET',
    async: false,
	success : function(extMessage){
		var json = Ext.JSON.decode(extMessage.responseText);
		if(json.successOrFalse == "false"){
			Ext.Msg.alert("提示",json.meassage);
		}else if(json.successOrFalse == "success"){
			sessionPower = Ext.JSON.decode(json.extJson);
		}
	}
})
	var globalProInfoId = "";
	/**
	 * 记录指标数量
	 */
	var globalIndexCount = 0;

	var globalProductId = "";

	/**
	 * 自定义模板Id全局变量
	 */
	var globalTemplateId = ""
	/**
	 * 信息类型全局变量
	 */
	var globalInfoType = "";

	var comboIsHide = false;
	var storeIsLoad = false;

	Ext.Ajax.request({
				url : '../sysRole/sysUserHasCompanyAdmin.action',
				method : 'GET',
				async : false,
				success : function(extMessage) {
					var json = Ext.JSON.decode(extMessage.responseText);
					if (json.successOrFalse == "false") {
						Ext.Msg.alert("提示", json.meassage);
					} else if (json.successOrFalse == "success") {
						if (json.param == "true") {
							comboIsHide = false;
							storeIsLoad = true;
						} else {
							comboIsHide = true;
							storeIsLoad = false;
						}
					}
				}

			})

	Ext.define('productCategory', {
				extend : 'Ext.data.Model',
				fields : ["categoryId", "categoryName"]
			});
	Ext.define('processorCategory', {
				extend : 'Ext.data.Model',
				fields : ["categoryId", "categoryName"]
			});

	Ext.define('processorInfo', {
				extend : 'Ext.data.Model',
				fields : ["proInfoId", 'title', 'description', "startTime",
						"endTime", "category.categoryName"]
			});




	var productCategoryStore = Ext.create('Ext.data.Store', {
				model : 'productCategory',
				autoLoad : storeIsLoad,
				autoDestroy : true,
				pageSize : 80,
				proxy : {
					type : 'ajax',
					url : '../productCategory/findProductCategoryByCompanyId.action?',
					reader : {
						type : 'json',
						root : 'list',
						totalProperty : 'total'
					}
				},
				sorters : [{
							property : 'categoryId',
							direction : 'ASC'
						}]
			});

	var processorCategoryStore = Ext.create('Ext.data.Store', {
				model : 'processorCategory',
				autoLoad : false,
				autoDestroy : true,
				pageSize : 80,
				proxy : {
					type : 'ajax',
					url : '',
					reader : {
						type : 'json',
						root : 'list',
						totalProperty : 'total'
					}
				},
				sorters : [{
							property : 'categoryId',
							direction : 'ASC'
						}]
			});

	
	
	

	

	var processorInfoStore = Ext.create('Ext.data.Store', {
				model : 'processorInfo',
				autoLoad : true,
				autoDestroy : true,
				pageSize : 80,
				proxy : {
					type : 'ajax',
					url : '../processorInfo/findProInfoByProcProd.action?searchType=1',
					reader : {
						type : 'json',
						root : 'list',
						totalProperty : 'total'
					}
				},
				sorters : [{
							property : '',
							direction : 'ASC'
						}]
			});

	var processorInfoGrid = Ext.create('Ext.grid.Panel', {
		store : processorInfoStore,
		title : '流程信息',
		multiSelect : true,
		autoScroll : true,
		width : '60%',
		region : 'center',
		columns : [{
					header : 'id',
					width : 120,
					dataIndex : 'proInfoId',
					hidden : true,
					sortable : true
				}, {
					header : '标题',
					width : 120,
					dataIndex : 'title',
					sortable : true
				}, {
					header : '开始时间',
					width : 120,
					dataIndex : 'startTime',
					sortable : true,
					renderer : function(value) {
						if (value == "") {
							return "";
						} else {
							return Ext.util.Format.date(value, 'Y-m-d : h:m:s');
						}
					}
				}, {
					header : '结束时间',
					width : 120,
					dataIndex : 'endTime',
					sortable : true,
					renderer : function(value) {
						if (value == "") {
							return "";
						} else {
							return Ext.util.Format.date(value, 'Y-m-d : h:m:s');
						}
					}
				}, {
					header : '流程',
					width : 120,
					dataIndex : 'category.categoryName',
					sortable : true
				}],
		frame : true,
		selType : 'checkboxmodel',
		split : true,
		minWidth : 120,
		veiwConfig : {
			stripeRows : true
		},
		tbar : [{
			xtype : 'combobox',
			itemId : 'productCombo',
			border : false,
			width : 180,
			store : productCategoryStore,
			valueField : 'categoryId',
			displayField : 'categoryName',
			emptyText : '选择产品..',
			hidden : comboIsHide,
			editable : false,
			name : 'productCombo',
			listeners : {
				select : function(combo, records, eOpts) {
					var categoryId = records[0].get('categoryId');
					globalProductId = categoryId;
					var searchProxy = new Ext.data.HttpProxy({
						type : 'ajax',
						url : '../processorInfo/findProInfoByProductCgId.action?ProductCgId='
								+ categoryId,
						reader : {
							type : 'json',
							root : 'list',
							totalProperty : 'total'
						}
					});
					var searchProxy2 = new Ext.data.HttpProxy({
						type : 'ajax',
						url : '../proCategroy/findProcCgByProdCgId.action?categoryId='
								+ categoryId,
						reader : {
							type : 'json',
							root : 'list',
							totalProperty : 'total'
						}
					});
					processorInfoStore.setProxy(searchProxy);
					processorInfoStore.load();
					processorCategoryStore.setProxy(searchProxy2);
					processorCategoryStore.load();
					processorInfoGrid.down("#processorCombo").setValue("");
				}
			}
		}, {
			xtype : 'combobox',
			itemId : 'processorCombo',
			border : false,
			width : 180,
			store : processorCategoryStore,
			valueField : 'categoryId',
			displayField : 'categoryName',
			emptyText : '选择流程..',
			hidden : comboIsHide,
			editable : false,
			name : 'processorCombo',
			listeners : {
				select : function(combo, records, eOpts) {
					var categoryId = records[0].get('categoryId');
					var searchProxy = new Ext.data.HttpProxy({
						type : 'ajax',
						url : '../processorInfo/findProInfoByProcProd.action?ProductCgId='
								+ globalProductId + '&procCgId=' + categoryId,
						reader : {
							type : 'json',
							root : 'list',
							totalProperty : 'total'
						}
					});
					processorInfoStore.setProxy(searchProxy);
					processorInfoStore.load();
				}
			}
		},
		{
			xtype : 'button',
			border : false,
			text : "转至流程信息页面",
			handler : function() {
				createTabPanel(sessionPower)
			}
		}
		]
	});

	var templateColumns = [{
				header : 'id',
				width : 120,
				hidden : true,
				dataIndex : 'templateId',
				sortable : true
			}, {
				header : '模板名称',
				width : 120,
				dataIndex : 'templateName',
				sortable : true
			}, {
				header : '描述',
				width : 120,
				dataIndex : 'description',
				sortable : true
			}]
	var otherColumns = [{
				header : 'id',
				width : 120,
				hidden : true,
				dataIndex : 'urlId',
				sortable : true
			}, {
				header : '地址',
				width : 120,
				dataIndex : 'urlContext',
				sortable : true
			}, {
				header : '类型',
				width : 120,
				dataIndex : 'resourceType',
				sortable : true,
				renderer : function(val) {
					if (val == "picture") {
						return "图片";
					} else if (val == "text") {
						return "文本";
					} else if (val == "vedio") {
						return "视频";
					}
				}
			}, {
				header : '描述',
				width : 120,
				dataIndex : 'description',
				sortable : true
			}];

	var yesOrNoStore = Ext.create("Ext.data.Store", {
				proxy : {
					type : 'memory',
					reader : {
						type : 'json'
					}
				},
				fields : ["value"],
				data : [{
							value : "是"
						}, {
							value : "否"
						}]
			})

	var isEligibleStore = Ext.create("Ext.data.Store", {
				proxy : {
					type : 'memory',
					reader : {
						type : 'json'
					}
				},
				fields : ["value"],
				data : [{
							value : "合格"
						}, {
							value : "不合格"
						}]
			})

	
	var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1
			});

	var proInfoIndexGridStoreFields = [];

	var proInfoIndexGridStoreData = [];

	var proInfoIndexColumn = [new Ext.grid.RowNumberer()];

	var proInfoIndexGridStore = Ext.create('Ext.data.JsonStore', {
				fields : proInfoIndexGridStoreFields
			})
    var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToMoveEditor: 1,
        autoCancel: false
    });

	var showPanel = Ext.create('Ext.panel.Panel', {
				anchor : "100% 100%",
				layout : 'border',
				split : true,
				autoScroll : true,
				items : [processorInfoGrid]
			});
	return showPanel;
}