var createPersonManageHome = function(createTabPanel) {
/**
 * 把对应的一条权限记录查出来
 */
var sessionPower = {};
Ext.Ajax.request({
	url:'../sysPower/findPowerById.action?powerId=4028a89b45bcc3d10145bcc514080000',
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

	
	
	var sysUserGrid = Ext.create('Ext.grid.Panel', {
		region:"center",
		title:'人员信息',
		store : sysUserStore,
		columns : sysUserColumns,
		multiSelect :true,
	   autoScroll:true,
		frame : true,
		selType : 'checkboxmodel',
		split : true,
		minWidth : 120,
		veiwConfig : {
			stripeRows : true
		},
		tbar:[{
          		xtype :'button' ,
          		text :"转至人员管理页面",
				handler:function(){
					createTabPanel(sessionPower)
				}
           }]
		
	});

	var showPanel = Ext.create('Ext.panel.Panel', {
		anchor : "100% 100%",
        layout : 'border',
		split : true,
		autoScroll:true,
		items : [ sysUserGrid ]
	});
	return showPanel;
}
