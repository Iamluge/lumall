var createPersonManage = function() {
	var cityCombobox = null;
	var countyCombobox = null;
	var provinceCombobox = null;
       
	/**
	 * 记录所选择的地址
	 */
	var cityString = "";
	var countyString = "";
	var provinceString = "";

	Ext.define('sysUser', {
		extend : 'Ext.data.Model',
		idProperty : 'userId',
		fields : [ 
		"userId", 
		"userName", 
		"company.companyName" 
		]
	});

	Ext.define('company', {
		extend : 'Ext.data.Model',
		fields : [ "companyId", "companyName" ]
	});

	/*Ext.define('province', {
		extend : 'Ext.data.Model',
		fields : [ "name", "provinceId" ]
	});
	Ext.define('city', {
		extend : 'Ext.data.Model',
		fields : [ "name", "cityId" ]
	});
	Ext.define('county', {
		extend : 'Ext.data.Model',
		fields : [ "name", "countyId" ]
	});
	var provinceStore = Ext.create('Ext.data.Store', {
		model : 'province',
		autoLoad : true,
		autoDestroy : true,
		pageSize : 80,
		proxy : {
			type : 'ajax',
			url : '../data/area.json',
			reader : {
				type : 'array',
				root : 'p',
				totalProperty : 'total'
			}
		},
		sorters : [ {
			property : 'provinceId',
			direction : 'ASC'
		} ]
	});

	var cityStore = Ext.create('Ext.data.Store', {
		model : 'city',
		autoLoad : false,
		autoDestroy : true,
		pageSize : 80,
		proxy : {
			type : 'ajax',
			// url : cityStoreUrl,
			// root : cityStoreRoot,
			reader : {
				type : 'array',
				totalProperty : 'total'
			}
		},
		sorters : [ {
			property : 'cityId',
			direction : 'ASC'
		} ]
	});

	var countyStore = Ext.create('Ext.data.Store', {
		model : 'county',
		autoLoad : false,
		autoDestroy : true,
		pageSize : 80,
		proxy : {
			type : 'ajax',
			// url : countyStoreUrl,
			// root: countyStoreRoot,
			reader : {
				type : 'array',
				totalProperty : 'total'
			}
		},
		sorters : [ {
			property : 'countyId',
			direction : 'ASC'
		} ]
	});*/

	var sysUserStore = Ext.create('Ext.data.Store', {
		model : 'sysUser',
		autoLoad : true,
		autoDestroy : true,
		pageSize : 80,
		storeId:'userId',
		proxy : {
			type : 'ajax',
			url : '../sysUser/findPageSysUserByCompanyId.action',
			reader : {
				type : 'json',
				root : 'valueList',
				totalProperty : 'valueSize'
			}
		},
		sorters : [ {
			property : 'userId',
			direction : 'ASC'
		} ]
	});

	var companyStore = Ext.create('Ext.data.Store', {
		model : 'company',
		autoLoad : true,
		autoDestroy : true,
		pageSize : 80,
		proxy : {
			type : 'ajax',
			url : '../company/findAllCompany.action',
			reader : {
				type : 'json',
				root : 'list',
				totalProperty : 'total'
			}
		},
		sorters : [ {
			property : 'companyId',
			direction : 'ASC'
		} ]
	});

	/*var createProvinceCombobox = function() {
		provinceCombobox = Ext.create('Ext.form.ComboBox', {
			itemId : 'provinceCombobox',
			border : false,
			width : 120,
			store : provinceStore,
			valueField : 'provinceId',
			displayField : 'name',
			emptyText : '选择省/市..',
			editable : false,
			name : 'provinceCombobox',
			listeners : {
				select : function(combo, records, eOpts) {
					var cityStoreUrl = '../data/area.json';
					var cityStoreRoot = records[0].get('provinceId');
					provinceString = records[0].get('name');
					var searchProxy = new Ext.data.HttpProxy({
						type : 'ajax',
						url : cityStoreUrl,
						reader : {
							type : 'array',
							root : cityStoreRoot,
							totalProperty : 'total'
						}
					});
					cityStore.setProxy(searchProxy);
					cityStore.load();
				}
			}
		});
		return provinceCombobox;
	}
	var createCityCombobox = function() {
		cityCombobox = Ext.create('Ext.form.ComboBox', {
			itemId : 'cityCombobox',
			border : false,
			width : 120,
			store : cityStore,
			valueField : 'cityId',
			displayField : 'name',
			emptyText : '选择市..',
			editable : false,
			name : 'cityCombobox',
			listeners : {
				select : function(combo, records, eOpts) {
					var countyStoreUrl = '../data/area.json';
					var countyStoreRoot = records[0].get('cityId');
					cityString = records[0].get('name');
					var searchProxy = new Ext.data.HttpProxy({
						type : 'ajax',
						url : countyStoreUrl,
						reader : {
							type : 'array',
							root : countyStoreRoot,
							totalProperty : 'total'
						}
					});
					countyStore.setProxy(searchProxy);
					countyStore.load();
				}
			}
		});
		return cityCombobox;
	}

	var createCountyCombobox = function() {
		countyCombobox = Ext.create('Ext.form.ComboBox', {
			itemId : 'countyCombobox',
			border : false,
			width : 120,
			store : countyStore,
			valueField : 'countyId',
			displayField : 'name',
			emptyText : '选择县/区..',
			editable : false,
			name : 'countyCombobox',
			listeners : {
				select : function(combo, records, eOpts) {
					countyString = records[0].get('name');
				}
			}
		});
		return countyCombobox;
	}*/

	var sysUserColumns = [ {
		header : '人员代码',
		width : 160,
		dataIndex : 'userId',
		sortable : true
	}, {
		header : '姓名',
		width : 120,
		dataIndex : 'userName',
		sortable : true
	}, {
		header : '所属商家',
		dataIndex : 'company.companyName',
		width : 200,
		sortable : true
	} ];

	var sysUserGridPagingtoolbar = Ext.create('Ext.toolbar.Paging',{
        store: sysUserStore,  // same store GridPanel is using
        dock: 'bottom', //分页 位置
        emptyMsg: '没有数据',
        displayInfo: true,
        displayMsg: '当前显示{0}-{1}条记录 / 共{2}条记录 ',
        beforePageText: '第',
        afterPageText: '页/共{0}页'
	})
	
	var sysUserGrid = Ext.create('Ext.grid.Panel', {
		store : sysUserStore,
		multiSelect : true,
		columns : sysUserColumns,
		frame : true,
		selType : 'checkboxmodel',
		split : true,
		minWidth : 120,
		veiwConfig : {
			stripeRows : true
		},
		tbar : [ {
			xtype : 'button',
			text : '添加用户',
			itemId : 'add',
			handler : function() {
				if(companyStore.getCount() > 0){
					sysUserInfoForm.getForm().reset();
					sysUserInfoForm.down("#companyCombobox").setValue(companyStore.getAt(0));
					sysUserInfoForm.down("#addSysUser").setDisabled(false);
					sysUserInfoForm.down("#editSysUser").setDisabled(true);
					sysUserInfoForm.down("#reset").setDisabled(false);
					sysUserInfoWin.show();
				    sysUserInfoWin.setTitle("添加用户");
				}
			}
		}, {
			xtype : 'button',
			text : '修改用户',
			disabled : true,
			itemId : 'edit',
			handler : function() {
				var sm = sysUserGrid.getSelectionModel();
				var data = sm.getLastSelected();
				if(companyStore.getCount() > 0){
					sysUserInfoForm.down("#companyCombobox").setValue(companyStore.getAt(0));
				}
				sysUserInfoForm.down("#addSysUser").setDisabled(true);
				sysUserInfoForm.down("#editSysUser").setDisabled(false);
				sysUserInfoForm.down("#reset").setDisabled(true);
				sysUserInfoForm.loadRecord(data);
				sysUserInfoWin.setTitle("修改用户");
				sysUserInfoWin.show();
			}
		}, {
			xtype : 'button',
			text : '删除用户',
			disabled : true,
			itemId : 'delete',
			handler : function() {
				    Ext.Msg.show({
							title : '提示',
							msg : '确定要刪除选中的人员？',
							buttonText : {
								yes : '确定',
								no : '取消'
							},
							buttons : Ext.Msg.YESNO,
							fn : function(btn) {
								if (btn == "yes") {
									deleteSysUser();
								} else if (btn == "no") {
									return;
								}
							}
						});			
			}
		} ],
		bbar:[sysUserGridPagingtoolbar],
		listeners:{
		'selectionchange':function( thisGrid, selected, eOpts ){
			if(selected.length > 0){
				sysUserGrid.down("#edit").setDisabled(false);
				sysUserGrid.down("#delete").setDisabled(false);
			}else{
				sysUserGrid.down("#edit").setDisabled(true);
				sysUserGrid.down("#delete").setDisabled(true);
			}
		}
		}
	});

	var sysUserInfoForm = Ext.create("Ext.form.Panel", {
		frame : true,
		split : true,
		// disabled:true,
		minWidth : 120,
		layout : 'fit',
		margins : '0 0 0 0',
		bodyPadding : 3,
		items : [ {
			xtype : 'fieldset',
			itemId : 'sysUserInfo',
			collapsible : true,
			maxHeight : 400,
			align : 'center',
			title : '个人信息',
			items : [
					{
						xtype : 'textfield',
						itemId : 'userId',
						border : false,
						fieldLabel : "人员代码",
						width : 250,
						name : 'userId'
					},

					{
						xtype : 'textfield',
						itemId : 'userName',
						border : false,
						fieldLabel : "姓名",
						name : 'userName',
						width : 250,
						allowBlank : false
					},
					{
						xtype : 'fieldset',
						itemId : 'companyInfo',
						collapsible : true,
						maxHeight : 400,
						align : 'center',
						hidden : false,
						title : '所属商家',
						items : [ {
									xtype : 'combobox',
									itemId : 'companyCombobox',
									border : false,
									width : 250,
									store : companyStore,
									valueField : 'companyId',
									displayField : 'companyName',
									fieldLabel : "所属商家",
									emptyText : '选择该人员所属的商家..',
									editable : false,
									name : 'companyCombobox'
								} ]
					} ]
		} ],
		buttons : [ {
			xtype : 'button',
			itemId : 'addSysUser',
			border : false,
			text : "添加",
			width : 70,
			name : 'addSysUser',
			handler : function() {
				if(this.up('form').getForm().isValid()){
				editSysUser("../sysUser/addSysUser.action");
				}
			}
		}, {
			xtype : 'button',
			itemId : 'editSysUser',
			border : false,
			text : "修改",
			width : 70,
			name : 'editSysUser',
			handler : function() {
				if(this.up('form').getForm().isValid()){
				editSysUser("../sysUser/editSysUser.action");
				}
			}
		}, {
			xtype : 'button',
			itemId : 'reset',
			border : false,
			text : "重置",
			width : 70,
			name : 'reset',
			handler : function() {
				this.up('form').getForm().reset();
				if(companyStore.getCount() > 0){
					sysUserInfoForm.down("#companyCombobox").setValue(companyStore.getAt(0));
				}
			}
		}, {
			xtype : 'button',
			itemId : 'cancel',
			border : false,
			text : "取消",
			width : 70,
			name : 'cancel',
			handler : function() {
				sysUserInfoWin.hide();
			}
		} ]
	})

	var deleteSysUser = function() {
		var sm = sysUserGrid.getSelectionModel()
		var rows = sm.getSelection();
		var userIds = "";
		var extParam = {};
		if (rows != null && rows.length > 0) {
			for (i = 0; i < rows.length; i++) {
				if (i != rows.length - 1) {
					userIds = userIds + rows[i].data.userId + "`";
				} else {
					userIds = userIds + rows[i].data.userId;
				}
			}
			extParam.extJsonList = userIds;
			Ext.Ajax.request({
				url : "../sysUser/deleteSysUser.action",
				params : {
					extParam : Ext.JSON.encode(extParam)
				},
				method : "POST",
				success : function(extMessage) {
					var json = Ext.JSON.decode(extMessage.responseText);
					successIds = json.successJsonList.split("`");
					sysUserStore.load();
					for (i = 0; i < (successIds.length-1); i++) {
							Ext.example.msg("提示", "刪除'" +successIds[i] + "'成功！");
					}	
				}

			});
		}
	}

	

	var editSysUser = function(url) {
		var extParam = {};
		var extJsons = {};
		var param1 = "";
		extJsons.userId = sysUserInfoForm.down("#userId").getValue();
		extJsons.userName = sysUserInfoForm.down("#userName").getValue();
		param1 = sysUserInfoForm.down("#companyCombobox").getValue();
		extParam.extJsons = Ext.JSON.encode(extJsons);
		extParam.param1 = param1;
		Ext.Ajax.request({
			url : url,
			params : {
				extParam : Ext.JSON.encode(extParam)
			},
			method : "POST",
			success : function(extMessage) {
				var json = Ext.JSON.decode(extMessage.responseText);
				if (json.successOrFalse == "success") {
					Ext.example.msg("提示",json.meassage);
					sysUserStore.load();
				    sysUserInfoWin.hide();
				    sysUserInfoForm.getForm().reset();
				}else if(json.successOrFalse == "false"){
					Ext.Msg.alert("提示",json.meassage);
				}

			}

		})
	}

	var sysUserInfoWin = Ext.create("Ext.Window", {
		width : 600,
		autoScroll : true,
		layout : 'fit',
		closeAction : 'hide',
		modal : true,
		items : [sysUserInfoForm ]
	});

	var showPanel = Ext.create('Ext.panel.Panel', {
		layout : 'fit',
		split : true,
		items : [ sysUserGrid ]
	});
	return showPanel;
}
