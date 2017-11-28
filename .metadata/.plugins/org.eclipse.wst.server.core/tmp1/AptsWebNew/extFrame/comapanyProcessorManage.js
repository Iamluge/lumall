var createComapanyProcessorManage = function(){
	
	var globalProcessorId = "";
	var globalProductId = "";
	
	Ext.define('processorCategory', {
				extend : 'Ext.data.Model',
				idProperty :'categoryId',
				fields : [
				"categoryId",
				"categoryName",
				"categoryDescription",
				"categoryState"
				]
			});	
	
	Ext.define('productCategory', {
				extend : 'Ext.data.Model',
				idProperty : 'categoryId',
				fields : [
				"categoryId",
				"categoryName",
				"categoryDescription"
				]
			});	
	/**
	 * 该商家已有的流程
	 * */
	var processorCategoryStore = Ext.create('Ext.data.Store', {
		model : 'processorCategory',
		autoLoad : true,
		autoDestroy : true,
		pageSize : 80,
		proxy : {
			type : 'ajax',
			url : '../proCategroy/findProCategoryByCompanyId.action',
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
	
	
	
	var productStore = Ext.create('Ext.data.Store', {
		model : 'productCategory',
		autoLoad : true,
		autoDestroy : true,
		pageSize : 80,
		proxy : {
			type : 'ajax',
			url : '../productCategory/findProductCategoryByCompanyId.action',
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
	
    var productProcessorStore = Ext.create('Ext.data.Store', {
		model : 'processorCategory',
		autoLoad : false,
		autoDestroy : true,
		pageSize : 80,
		proxy : {
			type : 'ajax',
			url : '',
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
	
	var processorGrid = Ext.create('Ext.grid.Panel',{
		   store : processorCategoryStore,
	       multiSelect :true,
	       autoScroll:true,
	       region:"center",
	       title : '所有流程',
	       width : '70%',
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
			},{
				header : '描述',
				width : 450,
				dataIndex : 'categoryDescription',
				sortable : true
			},{
				header : '状态',
				width : 120,
				dataIndex : 'categoryState',
				sortable : true,
				renderer : function(value){
				if(value == "0"){
				    return "激活";
				}else if(value == "1"){
				    return "<font color='red'>注销</font>";
				}
				}
			}
	       ],
	       frame : true,
	       selType : 'checkboxmodel',
	       split : true,
	       minWidth : 120,
           veiwConfig :
           {
           stripeRows : true
           },
           tbar:[{
           	 xtype : 'button',
           	 text : '增加流程',
           	 itemId:"add",
           	 handler : function(){
           	 	processorCategoryForm.getForm().reset();
            	processorCategoryForm.down("#categoryDescription").setReadOnly(false);
            	processorCategoryForm.down("#categoryName").setReadOnly(false);
            	processorCategoryForm.down("#addProcessor").setDisabled(false);
            	processorCategoryForm.down("#editProcessor").setDisabled(true);
           	 	processorCategoryWin.show();
           	 }
           },{
           	 xtype : 'button',
           	 text : '修改流程',
           	 itemId:"edit",
           	 disabled:true,
           	 handler : function(){
           	 	var sm = processorGrid.getSelectionModel();
           	 	var data = sm.getLastSelected();
           	 	globalProcessorId = data.get('categoryId');
           	 	processorCategoryForm.down("#categoryName").setValue(data.get('categoryName'));
            	processorCategoryForm.down("#categoryDescription").setValue(data.get('categoryDescription'));
            	processorCategoryForm.down("#categoryDescription").setReadOnly(false);
            	processorCategoryForm.down("#categoryName").setReadOnly(false);
            	processorCategoryForm.down("#addProcessor").setDisabled(true);
            	processorCategoryForm.down("#editProcessor").setDisabled(false);
           	 	processorCategoryWin.show();
           	 }
           },{
           	 xtype : 'button',
           	 text : '查看流程',
           	 itemId:"check",
           	 disabled:true,
           	 handler : function(){
           	 	var sm = processorGrid.getSelectionModel();
           	 	var data = sm.getLastSelected();
           	 	processorCategoryForm.down("#categoryName").setValue(data.get('categoryName'));
            	processorCategoryForm.down("#categoryDescription").setValue(data.get('categoryDescription'));
            	processorCategoryForm.down("#categoryDescription").setReadOnly(true);
            	processorCategoryForm.down("#categoryName").setReadOnly(true);
            	processorCategoryForm.down("#addProcessor").setDisabled(true);
            	processorCategoryForm.down("#editProcessor").setDisabled(true);
           	 	processorCategoryWin.show();
           	 }
           	 
           },{
           	 xtype : 'button',
           	 text : '注销流程',
           	 itemId:"logout",
           	 disabled:true,
           	 handler : function(){
           	 	logoutProcessorCategory();
           	 }
           },{
           	 xtype : 'button',
           	 text : '激活流程',
           	 itemId:"activate",
           	 disabled:true,
           	 handler : function(){
           	 	activateProcessorCategory();
           	 }
           },{
           	 xtype : 'button',
           	 text : '删除流程',
           	 itemId:"delete",
           	 disabled:true,
           	 handler : function(){
    	 	
           	 	Ext.Msg.show({
							title : '提示',
							msg : '确定要刪除选中的流程？',
							buttonText : {
								yes : '确定',
								no : '取消'
							},
							buttons : Ext.Msg.YESNO,
							fn : function(btn) {
								if (btn == "yes") {
									deleteProcessorCategory();
								} else if (btn == "no") {
									return;
								}
							}
						});
           	 	
           	 }
           }],
           listeners:{
           	  'selectionchange':function( thisGrid, selected, eOpts ){
           	   if(selected.length > 0){
           	   	processorGrid.down("#edit").setDisabled(false);
           	   	processorGrid.down("#check").setDisabled(false);
           	   	processorGrid.down("#activate").setDisabled(false);
           	   	processorGrid.down("#logout").setDisabled(false);
           	   	processorGrid.down("#delete").setDisabled(false);
           	   }else{
           	   	processorGrid.down("#edit").setDisabled(true);
           	   	processorGrid.down("#check").setDisabled(true);
           	   	processorGrid.down("#activate").setDisabled(true);
           	   	processorGrid.down("#logout").setDisabled(true);
           	   	processorGrid.down("#delete").setDisabled(true);
           	   }
           	   }
           }
	});
	
	var productGrid = Ext.create('Ext.grid.Panel',{
		   store : productStore,
	       multiSelect :true,
	       title:"产品列表",
	       autoScroll:true,
	       border:false,
	       height:"50%",
	       width:"100%",
	       region : 'north',
	       columns:[{
				header : '产品代码',
				width : 120,
				dataIndex : 'categoryId',
				hidden : true,
				sortable : true
			},{
				header : '产品名称',
				width : 160,
				dataIndex : 'categoryName',
				sortable : true
			},{
				header : '详细描述',
				width : 400,
				dataIndex : 'categoryDescription',
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
           },
           tbar:[
           	{
           	 xtype : 'button',
           	 text : '为产品添加流程',
           	 itemId: 'setting',
           	 disabled:false,
           	 handler : function(){
           	 	var data1 = processorGrid.getSelectionModel().getSelection();
           	 	var data2 = productGrid.getSelectionModel().getSelection();
           	 	if(data1.length <= 0){
           	 		Ext.Msg.alert("请至少选择一条流程记录！");
           	 	}else{
           	 		if(data2.length <= 0){
           	 		    Ext.Msg.alert("请选择一条产品记录！");
           	 	    }else{
           	 	    	settingProcessor();
           	 	    }
           	 	}	
           	 }
           }],           
           listeners:
           {
           'select' : function(thisRowModel, record, index, eOpts ){
           	   var procCategoryId = record.get('categoryId');
           	   globalProductId = record.get('categoryId');
           	   var searchProxy = new Ext.data.HttpProxy(
					{
						type : 'ajax',
						url : '../proCategroy/findProcCgByProdCgId.action?categoryId='+procCategoryId,
						reader : {
							type : 'json',
							root : 'list',
							totalProperty : 'total'
						}
					});
			   productProcessorStore.setProxy(searchProxy);
			   productProcessorStore.load();
			   productProcessorGrid.setTitle("【"+record.get('categoryName')+"】已设置的流程")
           }
           }
	});
	
	var productProcessorGrid = Ext.create('Ext.grid.Panel',{
		   store : productProcessorStore,
	       multiSelect :true,
	       autoScroll:true,
	       border : false,
	       region : 'south',
	       title : '【】已设置的流程',
	       height:"50%",
	       width:"100%",
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
           },
           tbar:[{
           	 xtype : 'button',
           	 text : '删除流程',
           	 itemId: 'delete',
           	 handler : function(){
           	 	      Ext.Msg.show({
							title : '提示',
							msg : '确定要刪除选中的流程？',
							buttonText : {
								yes : '确定',
								no : '取消'
							},
							buttons : Ext.Msg.YESNO,
							fn : function(btn) {
								if (btn == "yes") {
									deleteProcessorToProduct();
								} else if (btn == "no") {
									return;
								}
							}
						});
           	 	
           	 }
           }],
           listeners:{
           	'selectionchange':function( thisGrid, selected, eOpts ){
            	if(selected.length > 0){
            		productProcessorGrid.down("#delete").setDisabled(false);
            	}else{
            		productProcessorGrid.down("#delete").setDisabled(true);
            	}
            	
            }
           }
	});
	
var processorCategoryForm=Ext.create("Ext.form.Panel",{
	frame : true,
	split : true,
	//disabled:true,
	minWidth : 120,
	layout : 'fit',
    margins : '0 0 0 0',
	bodyPadding : 3,
	items : [{
		    xtype : 'fieldset',
			itemId:'processorCategoryInfo',
			collapsible: true,
			maxHeight:400,
			align : 'center',
			title : '产品信息',
			items : [
		{
            xtype:'textfield', 
            itemId:'categoryId',
            border:false,
            fieldLabel : "流程代码",
            hidden : true,
            width:350,
            name:'categoryId'
        },
        
        {
            xtype:'textfield', 
            itemId:'categoryName',
            border:false,
            fieldLabel : "流程名称",
            name:'categoryName', 
            width:350,
            allowBlank:false
        },
        
        {
            xtype:'textareafield', 
            itemId:'categoryDescription',
            border:false,
            fieldLabel : "详细描述",
            name:'categoryDescription', 
            width:400,
            allowBlank:false
        }
			]
        }
   
	],
	buttons :[
        {
            xtype:'button', 
            itemId:'addProcessor',
            border:false,
            text : "添加",
            width:70,           
            name:'addProcessor',
            handler : function(){
            	if(this.up('form').getForm().isValid()){
            	addProcessorCategory();
            	}
            }
        },
         {
            xtype:'button', 
            itemId:'editProcessor',
            border:false,
            text : "修改",
            width:70,          
            name:'editProcessor',
            handler : function(){
            	if(this.up('form').getForm().isValid()){
            	editProcessorCategory();
            	}
         }
        },
         {
            xtype:'button', 
            itemId:'reset',
            border:false,
            text : "重置",
            width:70,          
            name:'reset',
            handler : function(){
            	
         }
        }
        ,
         {
            xtype:'button', 
            itemId:'cancel',
            border:false,
            text : "取消",
            width:70,          
            name:'cancel',
            handler : function(){
            	
         }
        }
	]
})

/**
 * 添加流程类型
 * */	
var addProcessorCategory = function(){
	var extJson = {};
	extJson.categoryName = processorCategoryForm.down("#categoryName").getValue();
	extJson.categoryDescription = processorCategoryForm.down("#categoryDescription").getValue();
	Ext.Ajax.request({
	url : "../proCategroy/addProCategory.action",
    params:{
		extJson : Ext.JSON.encode(extJson)
	},
	method : "POST",
	success : function(extMessage){
		var json = Ext.JSON.decode(extMessage.responseText);
		if(json.successOrFalse == "success"){
	        Ext.example.msg("提示", json.meassage);
			processorCategoryStore.load();
			processorCategoryWin.hide();
		}else if(json.successOrFalse == "false"){
			Ext.Msg.alert("提示",json.meassage);
		}
	}
		
	})
}

var editProcessorCategory = function(){
	var extJson = {};
	extJson.categoryId = globalProcessorId;
	extJson.categoryName = processorCategoryForm.down("#categoryName").getValue();
	extJson.categoryDescription = processorCategoryForm.down("#categoryDescription").getValue();
	Ext.Ajax.request({
	url : "../proCategroy/editProCategory.action",
    params:{
		extJson : Ext.JSON.encode(extJson)
	},
	method : "POST",
	success : function(extMessage){
		var json = Ext.JSON.decode(extMessage.responseText);
		if(json.successOrFalse == "success"){
	        Ext.example.msg("提示", json.meassage);
			processorCategoryStore.load();
			processorCategoryWin.hide();
		}else if(json.successOrFalse == "false"){
			Ext.Msg.alert("提示",json.meassage);
		}
	}
		
	})
}

/**
 * 删除流程类型
 * */
var deleteProcessorCategory = function(){
	var sm = processorGrid.getSelectionModel()
	var rows = sm.getSelection();
	var categoryIds = "";
	var extParam = {};
	if(rows != null && rows.length > 0){
		for(i = 0;i < rows.length ;i++){
			if(i != rows.length-1){
				categoryIds = categoryIds+rows[i].data.categoryId+"`";
			}else{
				categoryIds = categoryIds+rows[i].data.categoryId;
			}
		}
		
	extParam.extJsonList = categoryIds;
	Ext.Ajax.request({
	url : "../proCategroy/deleteProCategory.action",
    params:{
		extParam : Ext.JSON.encode(extParam)
	},
	method : "POST",
	success : function(extMessage){
		var json = Ext.JSON.decode(extMessage.responseText);
		successIds = json.successJsonList.split("`");
		processorCategoryStore.load();
		for(i=0;i<(successIds.length-1);i++){
			if(processorCategoryStore.getById(successIds[i]) != null){
			    Ext.example.msg("提示","刪除'"+processorCategoryStore.getById(successIds[i]).get('categoryName')+"'成功！");
			}
		}
	}
		
	});
	}
}	

var activateProcessorCategory = function(){
	var sm = processorGrid.getSelectionModel()
	var rows = sm.getSelection();
	var categoryIds = "";
	var extParam = {};
	if(rows != null && rows.length > 0){
		for(i = 0;i < rows.length ;i++){
			if(i != rows.length-1){
				categoryIds = categoryIds+rows[i].data.categoryId+"`";
			}else{
				categoryIds = categoryIds+rows[i].data.categoryId;
			}
		}
		
	extParam.extJsonList = categoryIds;
	Ext.Ajax.request({
	url : "../proCategroy/activateProCategory.action",
    params:{
		extParam : Ext.JSON.encode(extParam)
	},
	method : "POST",
	success : function(){
		processorCategoryStore.load();
	}
		
	});
	}
}

var logoutProcessorCategory = function(){
	var sm = processorGrid.getSelectionModel()
	var rows = sm.getSelection();
	var categoryIds = "";
	var extParam = {};
	if(rows != null && rows.length > 0){
		for(i = 0;i < rows.length ;i++){
			if(i != rows.length-1){
				categoryIds = categoryIds+rows[i].data.categoryId+"`";
			}else{
				categoryIds = categoryIds+rows[i].data.categoryId;
			}
		}
		
	extParam.extJsonList = categoryIds;
	Ext.Ajax.request({
	url : "../proCategroy/logoutProCategory.action",
    params:{
		extParam : Ext.JSON.encode(extParam)
	},
	method : "POST",
	success : function(){
		processorCategoryStore.load();
	}
		
	});
	}
}

var settingProcessor = function(){
	var sm = processorGrid.getSelectionModel();
	var rows = sm.getSelection();
	var processorCgIds = "";
	var extParam = {};
	if(globalProductId != null){
	if(rows != null && rows.length > 0){
		for(i = 0;i < rows.length ;i++){
			if(i != rows.length-1){
				processorCgIds = processorCgIds+rows[i].data.categoryId+"`";
			}else{
				processorCgIds = processorCgIds+rows[i].data.categoryId;
			}
		}
	extParam.param1 = globalProductId;
	extParam.extJsonList = processorCgIds;
	Ext.Ajax.request({
	url : "../productCategory/settingProcessorCategroy.action",
    params:{
		extParam : Ext.JSON.encode(extParam)
	},
	method : "POST",
	success : function(extMessage){
		var json = Ext.JSON.decode(extMessage.responseText);
		Ext.example.msg("提示",json.meassage);
		productProcessorStore.load();
	}
		
	});
	}
	}
	
}

var deleteProcessorToProduct = function(){
	var sm = productProcessorGrid.getSelectionModel();
	var rows = sm.getSelection();
	var processorCgIds = "";
	var extParam = {};
	if(globalProductId != null){
	if(rows != null && rows.length > 0){
		for(i = 0;i < rows.length ;i++){
			if(i != rows.length-1){
				processorCgIds = processorCgIds+rows[i].data.categoryId+"`";
			}else{
				processorCgIds = processorCgIds+rows[i].data.categoryId;
			}
		}
	extParam.param1 = globalProductId;
	extParam.extJsonList = processorCgIds;
	Ext.Ajax.request({
	url : "../productCategory/deleteProcessorToProduct.action",
    params:{
		extParam : Ext.JSON.encode(extParam)
	},
	method : "POST",
	success : function(extMessage){
		var json = Ext.JSON.decode(extMessage.responseText);
		Ext.example.msg("提示",json.meassage);
		productProcessorStore.load();
	}
		
	});
	}
	}
	
}

var processorCategoryWin = Ext.create("Ext.Window",{
	       width : 600,
	       autoScroll:true,
	       	title :'添加流程类型',
	       layout : 'fit',
	       modal : true,
 	       closeAction:'hide',
           items : [processorCategoryForm]
    });	
		
	
	var showPanel = Ext.create('Ext.panel.Panel', {
				anchor : "100% 100%",
		        layout : 'border',
				split : true,
				autoScroll:true,
				items : [
				processorGrid

				,{
					region:"east",
					width:"30%",
					layout : 'border',
					autoScroll:true,
					items:[
					productGrid,
					productProcessorGrid
					]
				}
				]
	});
	return showPanel;
}