var createCheckCompanyProcessor = function(){
	
	
	/**
	 * 记录所选择的地址
	 * */
	var cityString = "";
	var countyString = "";
	var provinceString = "";
	var companyId = "";
	
	Ext.define('company', {
				extend : 'Ext.data.Model',
				fields : [
				"companyId",
				"companyName"
				]
			});
	
	Ext.define('processorCategory', {
				extend : 'Ext.data.Model',
				fields : [
				"categoryId",
				"categoryName"
				]
			});	
	
			
	Ext.define('province', {
				extend : 'Ext.data.Model',
				fields : [
				"name",
				"provinceId"
				]
			});
	Ext.define('city', {
				extend : 'Ext.data.Model',
				fields : [
				"name",
				"cityId"
				]
			});
	Ext.define('county', {
				extend : 'Ext.data.Model',
				fields : [
				"name",
				"countyId"
				]
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
		sorters : [
			{
				property : 'companyId',
				direction : 'ASC'
			}
		]
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
		sorters : [
			{
				property : 'provinceId',
				direction : 'ASC'
			}
		]
	});
	
	var cityStore = Ext.create('Ext.data.Store', {
		model : 'city',
		autoLoad : false,
		autoDestroy : true,
		pageSize : 80,
		proxy : {
			type : 'ajax',
			//url : cityStoreUrl,
			//root : cityStoreRoot,
			reader : {
				type : 'array',
				totalProperty : 'total'
			}
		},
		sorters : [
			{
				property : 'cityId',
				direction : 'ASC'
			}
		]
	});
	
	/**
	 * 该商家已有的流程
	 * */
	var processorCategoryStore = Ext.create('Ext.data.Store', {
		model : 'processorCategory',
		autoLoad : false,
		autoDestroy : true,
		pageSize : 80,
		proxy : {
			type : 'ajax',
			url : '../proCategroy/findProCategoryByCompanyId.action?companyId='+companyId,
			root : 'list',
			reader : {
				type : 'json',
				totalProperty : 'total'
			}
		},
		sorters : [
			{
				property : 'categoryId',
				direction : 'ASC'
			}
		]
	});
	

	
	var countyStore = Ext.create('Ext.data.Store', {
		model : 'county',
		autoLoad : false,
		autoDestroy : true,
		pageSize : 80,
		proxy : {
			type : 'ajax',
			//url : countyStoreUrl,
			//root: countyStoreRoot,
			reader : {
				type : 'array',
				totalProperty : 'total'
			}
		},
		sorters : [
			{
				property : 'countyId',
				direction : 'ASC'
			}
		]
	});
	
	var companyTbar1 = Ext.create('Ext.toolbar.Toolbar',{
		items :[{
			xtype : 'combobox',
		    itemId:'provinceCombobox',
            border:false,
            width:120,
            store : provinceStore,
			valueField : 'provinceId',
			displayField : 'name',
			emptyText : '选择省/市..',
            editable:false,
            name:'provinceCombobox',
            listeners: {
                select : function(combo, records, eOpts){
                    var cityStoreUrl = '../data/area.json';
	                var cityStoreRoot = records[0].get('provinceId');
	                provinceString = records[0].get('name');
                	var searchProxy = new Ext.data.HttpProxy(
					{
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
		},{
			xtype : 'combobox',
		    itemId:'cityCombobox',
            border:false,
            width:120,
            store : cityStore,
			valueField : 'cityId',
			displayField : 'name',
			emptyText : '选择市..',
            editable:false,
            name:'cityCombobox',
            listeners: {
                select : function(combo, records, eOpts){
                	var countyStoreUrl = '../data/area.json';
	                var countyStoreRoot = records[0].get('cityId');
	                cityString  = records[0].get('name');
                	var searchProxy = new Ext.data.HttpProxy(
					{
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
		},{
			xtype : 'combobox',
			itemId:'countyCombobox',
            border:false,
            width:120,
            store : countyStore,
			valueField : 'countyId',
			displayField : 'name',
			emptyText : '选择县/区..',
            editable:false,
            name:'countyCombobox',
            listeners:{
            select : function(combo, records, eOpts){
	                countyString  = records[0].get('name');
                }
            }
		}
		]
	});


	var companyTbar2 = Ext.create('Ext.toolbar.Toolbar',{
		items : [{
            xtype:'textfield', 
            itemId:'searchText',
            border:false,
            width:150,
            name:'searchText', 
            emptyText : '请输入关键字',
            allowBlank:true
        },{
            xtype : 'button',text : '搜索',handler :function(){  	
            }}]
	});
	
	var companyGrid=Ext.create('Ext.grid.Panel',{
	       store : companyStore,
	       multiSelect :true,
	       autoScroll:true,
	       width : '40%',
	       frame : true,
	       title : '公司列表',
	       region : 'west',
	       selType : 'checkboxmodel',
	       split : true,
	       minWidth : 120,
	       columns:[{
				header : '商家名称',
				width : 120,
				dataIndex : 'companyName',
				sortable : true
			}
	       ],
	       dockedItems: [companyTbar1,
	       companyTbar2
	       ],
           veiwConfig :
           {
           stripeRows : true
           },
           listeners : {
           'select' : function(RowModel, record, index, eOpts){
			if(record != null){
			    companyId = record.get('companyId');
				var searchProxy = new Ext.data.HttpProxy(
					{
						type : 'ajax',
						url : '../proCategroy/findProCategoryByCompanyId.action?companyId='+companyId,
						reader : {
							type : 'json',
							root : 'list',
							totalProperty : 'total'
						}
					});
			   processorCategoryStore.setProxy(searchProxy);
			   processorCategoryStore.load();
			}
           }
           }
	});
	
	var ProcessorGrid = Ext.create('Ext.grid.Panel',{
		   store : processorCategoryStore,
	       multiSelect :true,
	       autoScroll:true,
	       region : 'center',
	       width : '30%',
	       columns:[{
				header : '流程代码',
				width : 120,
				dataIndex : 'categoryId',
				hidden : true,
				sortable : true
			},{
				header : '流程名称',
				width : 120,
				dataIndex : 'categoryName',
				sortable : true
			}
	       ],
	       frame : true,
	       selType : 'checkboxmodel',
	       split : true,
	       minWidth : 120,
           veiwConfig :
           {
           stripeRows : true
           }
	});
	
	


	var showPanel = Ext.create('Ext.panel.Panel', {
				anchor : "100% 100%",
		        layout : 'border',
				split : true,
				autoScroll:true,
				items : [companyGrid,ProcessorGrid]
	});
	
	return showPanel;
}