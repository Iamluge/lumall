var createCustomInfoTempleManage = function(){
	var globalCount = 0;
	var globalProductId = "";
	var globalTemplateId = ""
	/**
	* 存放indexName的数组
    * */
	var globalIndexNames = [];
	
	/**
	 * 记录Index数量
	 * */
	var globalIndexCount = 0;
	
    Ext.define('productCategory', {
				extend : 'Ext.data.Model',
				fields : [
				"categoryId",
				"categoryName"
				]
			});	
			
    Ext.define('proInfoTemplate',{
    	idProperty:'templateId',
		extend : 'Ext.data.Model',
		fields:[
		"templateId",
		"templateName",
		"description"
		]
	})
	
  	Ext.define('proInfoIndex', {
				extend : 'Ext.data.Model',
				fields : [
				"indexId",
				"indexName",
				"indexType",
				"orderNumber"
				]
			});	
			
			
	var indexTypeComboStore = Ext.create('Ext.data.Store', {
		model : 'indexType',
		autoLoad : true,
		autoDestroy : true,
		fields : [
				"indexTypeId",
				"typeName"
		],
		pageSize : 80,
		proxy : {
			type : 'ajax',
			url : '../data/indexType.json',	
			reader : {
				type : 'json',
				root : 'list',
				totalProperty : 'total'
			}
		},
		sorters : [
			{
				property : 'enterDate',
				direction : 'ASC'
			}
		]
	});	
	
	var indexValueStore = Ext.create('Ext.data.Store', {
		model : 'indexValue',
		autoLoad : false,
		autoDestroy : true,
		pageSize : 80,
		proxy : {
			type : 'ajax',
			url : '../proInfoIndex/findIndexValueByTemplateId.action?templateId='+globalTemplateId,
			reader : {
				type : 'json',
				root : 'list',
				totalProperty : 'total'
			}
		},
		sorters : [
			{
				property : 'enterDate',
				direction : 'ASC'
			}
		]
	});
	
	var productCategoryStore = Ext.create('Ext.data.Store', {
		model : 'productCategory',
		autoLoad : true,
		autoDestroy : true,
		pageSize : 80,
		proxy : {
			type : 'ajax',
			url : '../productCategory/findProductCategoryByCompanyId.action',	
			reader : {
				type : 'json',
				root : 'list',
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
	
	 var proInfoTemplateStore = Ext.create('Ext.data.Store', {
		model : 'proInfoTemplate',
		autoLoad : false,
		autoDestroy : true,
		pageSize : 80,
		proxy : {
			type : 'ajax',
			url : '../proInfoTemplate/findProInfoTemplateByProdId.action?prodId='+globalProductId,	
			reader : {
				type : 'json',
				root : 'list',
				totalProperty : 'total'
			}
		},
		sorters : [
			{
				property : 'templateId',
				direction : 'ASC'
			}
		]
	});
	
	var proInfoIndexStore = Ext.create('Ext.data.Store', {
		model : 'proInfoIndex',
		autoLoad : false,
		autoDestroy : true,
		pageSize : 80,
		proxy : {
			type : 'ajax',
			url : '../proInfoIndex/findIndexByTemplateId.action?templateId='+globalTemplateId,		
			reader : {
				type : 'json',
				root : 'list',
				totalProperty : 'total'
			}
		},
		sorters : [
			{
				property : 'orderNumber',
				direction : 'ASC'
			}
		]
	});
	var productCategoryGrid = Ext.create('Ext.grid.Panel',{
		   store : productCategoryStore,
	       multiSelect :true,
	       title:"产品列表",
	       autoScroll:true,
	       border:false,
	       height:"50%",
	       width:"100%",
	       region : 'center',
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
           listeners:
           {
           'select' : function(thisRowModel, record, index, eOpts ){
           	   globalProductId = record.get('categoryId');
           	   proInfoTemplateGrid.down("#addTemplate").setDisabled(false);
           	   var searchProxy = new Ext.data.HttpProxy(
					{
						type : 'ajax',
						url : '../proInfoTemplate/findProInfoTemplateByProdId.action?prodId='+globalProductId,
						reader : {
							type : 'json',
							root : 'list',
							totalProperty : 'total'
						}
					});
			   proInfoTemplateStore.setProxy(searchProxy);
			   proInfoTemplateStore.load();
			   proInfoTemplateGrid.setTitle("【"+record.get('categoryName')+"】已有的自定义信息模板");
           }
           }
	});
	
	var proInfoTemplateGrid = Ext.create('Ext.grid.Panel',{
		   store : proInfoTemplateStore,
	       multiSelect :true,
	       autoScroll:true,
	       width : '50%',
	       region : 'east',
	       columns:[{
				header : 'id',
				width : 120,
				hidden : true,
				dataIndex : 'templateId',
				sortable : true
			},{
				header : '模板名称',
				width : 120,
				dataIndex : 'templateName',
				sortable : true
			},{
				header : '描述',
				width : 120,
				dataIndex : 'description',
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
         tbar :[
         {
            xtype:'button', 
            itemId:'addTemplate',
            border:false,
            text : "添加模板",
            width:70,      
            disabled:true,
            name:'addTemplate',
            handler : function(){
            	settingIndexForm.getForm().reset();
            	componentWin2.show();
         }
         },{
            xtype:'button', 
            itemId:'setIndex',
            border:false,
            text : "设置字段",
            width:70,       
            disabled:true,
            name:'setIndex',
            handler : function(){
            	var sm = proInfoTemplateGrid.getSelectionModel()
            	var row = sm.getLastSelected();			    
            	settingIndexForm.down("#templateName").setValue(row.data.templateName);
            	componentWin.setTitle("设置字段")
            	componentWin.show();
         }
         },
         {
         	xtype:'button', 
            itemId:'editIndex',
            border:false,
            text : "修改字段",
            width:70,       
            disabled:true,
            name:'editIndex',
            handler : function(){
            	var sm = proInfoTemplateGrid.getSelectionModel();
            	var datas = sm.getSelection();	
            	if(datas.length <= 0){
            		Ext.Msg.alert("请选择要修改的字段！")
            	}
	            var searchProxy = new Ext.data.HttpProxy(
			    {
						type : 'ajax',
						url : '../proInfoIndex/findIndexByTemplateId.action?templateId='+globalTemplateId,
						reader : {
							type : 'json',
							root : 'list',
							totalProperty : 'total'
						}
				});
			    proInfoIndexStore.setProxy(searchProxy);
			    proInfoIndexStore.load();
            	componentWin5.show();
            }
         },
         {
            xtype:'button', 
            itemId:'checkDate',
            border:false,
            disabled:true,
            text : "查看已录信息",
            width:90,          
            name:'checkDate',
            handler : function(){
            	   proInfoIndexGridStore.loadData("");
            	   componentWin3.setTitle("查看已录信息");
            	   var searchProxy = new Ext.data.HttpProxy({
							type : 'ajax',
							url : '../proInfoIndex/findIndexByTemplateId.action?templateId='
									+ globalTemplateId,
							reader : {
								type : 'json',
								root : 'list',
								totalProperty : 'total'
							}
						});
						proInfoIndexStore.setProxy(searchProxy);
						proInfoIndexStore.load();
            	   var searchProxy = new Ext.data.HttpProxy(
					{
						type : 'ajax',
						url : '../proInfoIndex/findIndexValueByTemplateId.action?templateId='+globalTemplateId,
						reader : {
							type : 'json',
							root : 'list',
							totalProperty : 'total'
						}
					});
			       indexValueStore.setProxy(searchProxy);
			       indexValueStore.load();
			       indexValueStore.on('load',function(){
			       //重置
			       proInfoIndexColumn = [new Ext.grid.RowNumberer()];
            	   globalIndexNames = [];
            	   proInfoIndexGridStoreData = [];
            	   proInfoIndexGridStoreFields =[];
			       	//设置列名和store
			       for(i=0;i<globalIndexCount;i++){
			          var indexName = proInfoIndexStore.getAt(i).get("indexName")
			          globalIndexNames.push(indexName);
			          var column = {header:indexName,dataIndex:"index"+i,width:120};
                      proInfoIndexColumn.push(column);
                      var field = {name : "index"+i};
                      proInfoIndexGridStoreFields.push(field);
			       }
			       //重新绑定store及column
			       proInfoIndexGridStore = Ext.create('Ext.data.JsonStore',{
			       	fields:proInfoIndexGridStoreFields
			       	})
			       
			       //向store添加值
			       for(i=0;i<indexValueStore.getCount();i++){
			                                                      
			       	   var value = indexValueStore.getAt(i).get("value");
			       	   var indexValue = Ext.JSON.decode(value);	
			       	   proInfoIndexGridStoreData.push(indexValue);
			       }
			       proInfoIndexGrid.reconfigure(proInfoIndexGridStore,proInfoIndexColumn);
			       proInfoIndexGridStore.loadData(proInfoIndexGridStoreData);
			       componentWin3.show();
			       });

         }
         },
         {
            xtype:'button', 
            itemId:'deleteTemplate',
            border:false,
            text : "删除",
            disabled:true,
            width:70,          
            name:'deleteTemplate',
            handler : function(){
            	     Ext.Msg.show({
							title : '提示',
							msg : '确定要刪除选中的模板？',
							buttonText : {
								yes : '确定',
								no : '取消'
							},
							buttons : Ext.Msg.YESNO,
							fn : function(btn) {
								if (btn == "yes") {
									deleteProInfoTemplate();
								} else if (btn == "no") {
									return;
								}
							}
						});   
            	
         }
         }
         
         ],
         listeners :{
         	'select' : function( RowModel, record, index, eOpts ){
         		globalTemplateId = record.get('templateId');
         		var searchProxy = new Ext.data.HttpProxy(
					{
						type : 'ajax',
						url : '../proInfoIndex/findIndexByTemplateId.action?templateId='+globalTemplateId,
						reader : {
							type : 'json',
							root : 'list',
							totalProperty : 'total'
						}
					});
			       proInfoIndexStore.setProxy(searchProxy);
			       proInfoIndexStore.load();
			       proInfoIndexStore.on('load',function(){
			       globalIndexCount = proInfoIndexStore.getCount();
			    })
         	},
          'selectionchange':function( thisGrid, selected, eOpts ){
           	if(selected.length > 0){
           		proInfoTemplateGrid.down("#setIndex").setDisabled(false);
           		proInfoTemplateGrid.down("#checkDate").setDisabled(false);
           		proInfoTemplateGrid.down("#deleteTemplate").setDisabled(false);
           		proInfoTemplateGrid.down("#editIndex").setDisabled(false);
           	}else{
           		proInfoTemplateGrid.down("#editIndex").setDisabled(true);
           		proInfoTemplateGrid.down("#setIndex").setDisabled(true);
           		proInfoTemplateGrid.down("#checkDate").setDisabled(true);
           		proInfoTemplateGrid.down("#deleteTemplate").setDisabled(true);
           	}
          }
         }
		});

var proInfoTemplateForm=Ext.create("Ext.form.Panel",{
	border:false,
	autoScroll :true,
	frame : true,
	split : true,
	//disabled:true,
	minWidth : 120,
    margins : '0 0 0 0',
	items : [
		    {
		    xtype : 'fieldset',
			itemId:'templateInfo',
			collapsible: true,
			maxHeight:400,
			align : 'center',
			title : '模板信息',
			items : [
        {
            xtype:'textfield', 
            itemId:'templateName',
            border:false,
            fieldLabel : "模板名称",
            width:350,
            name:'templateName'
        },
        {
            xtype:'textareafield', 
            itemId:'description',
            border:false,
            width:350,
            fieldLabel : "描述",
            name:'description'
        }
    ]
    }
	],
	buttons :[
	{text:"添加",formBind:true,
	 handler:function(){
	 	addProInfoTemplate();
	}
	},
	{
	text:"重置",formBind:true,
	handler:function(){
		this.up('form').getForm().reset();
	}
	}
	]
})	;		
		
var settingIndexForm=Ext.create("Ext.form.Panel",{
	border:false,
	autoScroll :true,
	frame : true,
	split : true,
	//disabled:true,
	minWidth : 120,
    margins : '0 0 0 0',
	items : [
	    {
		    xtype : 'fieldset',
			collapsible: true,
			align : 'center',
			title : '模板信息',
			items : [
        {
            xtype:'textfield', 
            itemId:'templateName',
            border:false,
            fieldLabel : "模板名称",
            disabled : true,
            width:350,
            name:'templateName'
        }
        ]}
        ,
        {
		    xtype : 'fieldset',
			collapsible: true,
			align : 'center',
			itemId:'indexInfo',
			title : '字段信息',
			items : [
	        ]
	    }
	],
	buttons :[
	{text:"更多字段",formBind:true,
			handler:function()
			{
				globalCount++;
				settingIndexForm.down("#indexInfo").add({
					border :false,
					layout :"column",
					items:[{
		                   xtype:'textfield', 
                           itemId:'index'+globalCount,
                           border : false,
                           margins : '0 0 0 0',
                           border:false,
                           width:350,
                           value:"",
                           fieldLabel : "字段"+globalCount
				           },{
				           xtype:'combobox', 
        	               store: indexTypeComboStore,
                           itemId:'indexType'+globalCount,
                           displayField: 'typeName',
                           valueField: 'indexTypeId',
                           border:false,
                           width:180,
                           fieldLabel : "类型"
				           }
                ]});
				settingIndexForm.show();
				settingIndexForm.doLayout();

			}
	},
	{
		text:"提交",formBind:true,handler:function(){
			settingIndexToTemplate();
		}
	},
	{
		text:"重置",formBind:true,handler:function(){
			globalCount = 0;
            settingIndexForm.down("#indexInfo").removeAll();
            //removeAll()后子容器中调用的store要重新创建
            indexTypeComboStore = Ext.create('Ext.data.Store', {
									model : 'indexType',
									autoLoad : true,
									autoDestroy : true,
									fields : ["indexTypeId", "typeName"],
									pageSize : 80,
									proxy : {
										type : 'ajax',
										url : '../data/indexType.json',
										reader : {
											type : 'json',
											root : 'list',
											totalProperty : 'total'
										}
									},
									sorters : [{
												property : 'enterDate',
												direction : 'ASC'
											}]
			});	
			/*var templateName = settingIndexForm.down("#templateName").getValue();
			this.up('form').getForm().reset();
			settingIndexForm.down("#templateName").setValue(templateName);*/
		}
	}
	]
});	

	var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    });

	var proInfoIndexGridStoreFields = [
	];
	
	var proInfoIndexGridStoreData = [
	];
	
	var proInfoIndexColumn=[new Ext.grid.RowNumberer()
    ];
    
	
	var proInfoIndexGridStore = Ext.create('Ext.data.JsonStore',{
		fields:proInfoIndexGridStoreFields
	})
	var proInfoIndexGrid = Ext.create('Ext.grid.Panel',{
		   store : proInfoIndexGridStore,
	       multiSelect :true,
	       autoScroll:true,
	       width : '40%',
	       columnLines: true,
	       region : 'east',
	       selType :'checkboxmodel',
	       enableColumnMove :false,
	       columns:proInfoIndexColumn,
	       frame : true,
	       split : true,
	       minWidth : 120,
           veiwConfig :
           {
           stripeRows : true
           },
        selModel: {
            selType: 'cellmodel'
        },
        plugins: [cellEditing],
        listeners :{
        		'cellkeydown':function( table, td, cellIndex, record, tr, rowIndex, e, eOpts ){
        			    if (e.getKey() == Ext.EventObject.ENTER){
        			    	if(cellIndex <= (globalIndexCount-1)){
        			    	cellEditing.startEdit(rowIndex,cellIndex+1);
        			    	}else{
        			    	if(proInfoIndexGridStore.getCount() < (rowIndex+2)){
        			    	proInfoIndexGridStore.add("");
        			    	}
        			    	cellEditing.startEdit(rowIndex+1,1);
        			    	}
        			    }
        		}
        }
		});
    var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToMoveEditor: 1,
        saveBtnText: '保存',
        cancelBtnText: '取消',
        autoCancel: false
    });

  var editIndexGrid = Ext.create('Ext.grid.Panel',{
		   store : proInfoIndexStore,
		   width : 360,
	       multiSelect :true,
	       autoScroll:true,
	       rowLines : true,
	       plugins: [rowEditing],
	       viewConfig : {
					plugins : {
						ptype : 'gridviewdragdrop',
						ddGroup : 'DragDropGroup'
					}
		   }, 
	       border : false,
	       columns:[{
				header : 'id',
				width : 120,
				dataIndex : 'indexId',
				hidden : true,
				sortable : true
			},{
				header : '字段名',
				width : 180,
				dataIndex : 'indexName',
				sortable : true,
				editor:{
					
				}
			},{
				header : '字段类型',
				width : 180,
				dataIndex : 'indexType',
				sortable : true,
				renderer : function(value){
					return indexTypeComboStore.getById(value).get('typeName');
				},
				editor:{
					xtype:'combobox',
        	        store: indexTypeComboStore,
                    displayField: 'typeName',
                    valueField: 'indexTypeId'
				}
			}
	       ],
	       frame : true,
	       selType : 'checkboxmodel',
	       split : true,
	       minWidth : 120,
           tbar:[
           {
           	   text:"提交修改",
           	   itemId:"edit",
           	   handler:function(){
			       editProInfoIndex();
			   }
           },
           {
           	   text:"删除",
           	   itemId:"delete",
           	   handler:function(){
           	   		var sm = editIndexGrid.getSelectionModel();
	                var datas = sm.getSelection();
			        for(i=0;i<datas.length;i++){
			        	proInfoIndexStore.remove(datas[i]);
			        }
			   }
           }
           ]
	});
	
	var editProInfoIndex = function(){
    var extParam = {};
    var indexs = "";
    var datas = proInfoIndexStore.getRange( 0, proInfoIndexStore.getCount()-1) 
	if(datas.length > 0){
		for(i=0;i<datas.length;i++){
			var index = {};
			index.indexId = datas[i].get('indexId');
			index.indexType = datas[i].get('indexType');
			index.indexName = datas[i].get('indexName');
			if(i == (datas.length-1)){
				indexs = indexs + Ext.JSON.encode(index);
			}else{
				indexs = indexs + Ext.JSON.encode(index) + "`";
			}
		}
	}
	extParam.extJsonList = indexs;
	extParam.param1 = globalTemplateId;
	Ext.Ajax.request({
	url : "../proInfoIndex/editTemplateIndex.action",
    params:{
		extParam : Ext.JSON.encode(extParam)
	},
	method : "POST",
	success : function(extMessage){
		var json = Ext.JSON.decode(extMessage.responseText);
		if (json.successOrFalse == "success") {
			Ext.example.msg("提示",json.meassage);
		    proInfoIndexStore.load();
		    componentWin5.hide();
		}else if(json.successOrFalse == "false"){
			Ext.Msg.alert("提示",json.meassage);
		}
	}
		
	})
	
}
    
var addProInfoTemplate = function(){
    var extJson = {};
    var extParam = {};
	extJson.templateName = proInfoTemplateForm.down("#templateName").getValue();
	extJson.description = proInfoTemplateForm.down("#description").getValue();
	extParam.extJsons = Ext.JSON.encode(extJson);
	extParam.param1 = globalProductId;
	Ext.Ajax.request({
	url : "../proInfoTemplate/AddTemplate.action",
    params:{
		extParam : Ext.JSON.encode(extParam)
	},
	method : "POST",
	success : function(extMessage){
		var json = Ext.JSON.decode(extMessage.responseText);
		if (json.successOrFalse == "success") {
			Ext.example.msg("提示",json.meassage);
		   	componentWin2.hide();
		    proInfoTemplateStore.load();
		}else if(json.successOrFalse == "false"){
			Ext.Msg.alert("提示",json.meassage);
		}
	}
		
	})
}

var deleteProInfoTemplate = function(){
	var extParam = {};
	var proInfoTemplateIds = "";
	var sm = proInfoTemplateGrid.getSelectionModel();
	var datas = sm.getSelection();
	if(datas.length > 0){
		for(i=0;i<datas.length;i++){
			if(i == (datas.length-1)){
				proInfoTemplateIds = proInfoTemplateIds + datas[i].get('templateId');
			}else{
				proInfoTemplateIds = proInfoTemplateIds + datas[i].get('templateId') + "`";
			}
		}
    extParam.extJsonList = proInfoTemplateIds;
	Ext.Ajax.request({
	url : "../proInfoTemplate/deleteProInfoTemplate.action",
    params:{
		extParam : Ext.JSON.encode(extParam)
	},
	method : "POST",
	success : function(){
	   proInfoTemplateStore.load();
		
	}
		
	});
	}
}

var settingIndexToTemplate = function(){
    var extParam = {};
    var indexs = "";
    extParam.param1 = globalTemplateId;
    for(i=1;i<globalCount+1;i++){
    	if(indexs+settingIndexForm.down("#index"+i).getValue()!=null && indexs+settingIndexForm.down("#index"+i).getValue() != ""
    	&& indexs+settingIndexForm.down("#index"+i).getValue() != "undefined"){
    	var extIndex = {};
    	if(settingIndexForm.down("#indexType"+i).getValue()==null || settingIndexForm.down("#indexType"+i).getValue()==""){
    		extIndex.indexType = "textfield";
    		extIndex.indexName = settingIndexForm.down("#index"+i).getValue();
    	}else{
    		extIndex.indexType = settingIndexForm.down("#indexType"+i).getValue();
    		extIndex.indexName = settingIndexForm.down("#index"+i).getValue();
    	}
    	if(i < globalCount){
    		indexs = indexs+Ext.JSON.encode(extIndex).toString()+"`";
    	}else{
    		indexs = indexs+Ext.JSON.encode(extIndex);
    	}
    	}
    }
    extParam.extJsonList = indexs;
	Ext.Ajax.request({
	url : "../proInfoIndex/settingIndexToTemplate.action",
    params:{
		extParam : Ext.JSON.encode(extParam)
	},
	method : "POST",
	success : function(extMessage){
		var json = Ext.JSON.decode(extMessage.responseText);
		if (json.successOrFalse == "success") {
			Ext.example.msg("提示",json.meassage);
		    componentWin.hide();
		    proInfoTemplateStore.load();
		}else if(json.successOrFalse == "false"){
			Ext.Msg.alert("提示",json.meassage);
		}
	}
		
	})
}

	
	var componentWin = Ext.create("Ext.Window",{
	       width : 600,
	       height: 600,
	       autoScroll:true,
	       border : false,
	       modal : true,
	       layout : 'fit',
 	       closeAction:'hide',
 	       items :[settingIndexForm]
    });
    var componentWin2 = Ext.create("Ext.Window",{
	       width : 600,
	       height: 600,
	       border : false,
	       title : '添加模板',
	       modal : true,
	       autoScroll:true,
	       layout : 'fit',
 	       closeAction:'hide',
 	       items :[proInfoTemplateForm]
    });
    var componentWin3 = Ext.create("Ext.Window",{
	       width : 600,
	       height: 300,
	       border : false,
	       maximizable : true,
	       autoScroll:true,
	       layout : 'fit',
	       modal : true,
 	       closeAction:'hide',
 	       items :[proInfoIndexGrid]
    });
    var componentWin5 = Ext.create("Ext.Window",{
	       width : 400,
	       height: 450,
	       autoScroll:true,
	       layout : 'fit',
	       title :"修改字段",
	       modal : true,
 	       closeAction:'hide',
 	       items :[editIndexGrid]
    });
    
	var showPanel = Ext.create('Ext.panel.Panel', {
				anchor : "100% 100%",
		        layout : 'border',
				split : true,
				autoScroll:true,
				items : [productCategoryGrid,proInfoTemplateGrid]
	});
	return showPanel;
}