var createProcessorInfoRegister = function(){
	var globalCount = 1;
	var globalProInfoId = "";
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
			
     Ext.define('processorCategory', {
				extend : 'Ext.data.Model',
				fields : [
				"categoryId",
				"categoryName"
				]
			});			
	
	 Ext.define('processorInfo', {
				extend : 'Ext.data.Model',
				idProperty: "proInfoId",
				fields : [
				"proInfoId",
				'title',
				'description',
				"startTime",
				"endTime",
				"category.categoryId",
				"category.categoryName"
				]
			});	
			
	Ext.define('proInfoTemplate',{
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
			
   Ext.define('indexValue', {
				extend : 'Ext.data.Model',
				fields : [
				"indexValueId",
				"value",
				"enterDate"
				]
			});	
	
    Ext.define('indexType', {
				extend : 'Ext.data.Model',
				idProperty : 'indexTypeId',
				fields : [
				"indexTypeId",
				"typeName"
				]
			});			

	var indexTypeComboStore = Ext.create('Ext.data.Store', {
		model : 'indexType',
		autoLoad : true,
		autoDestroy : true,
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
				property : 'indexTypeId',
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
		sorters : [
			{
				property : 'categoryId',
				direction : 'ASC'
			}
		]
	});
   
   var kuaidi = Ext.create('Ext.data.Store', {
	    fields: ['k', 'v'],
	    proxy: {
	         type: 'ajax',
	         url: '../data/kuaidi.json',
	         reader: {
	             type: 'json',
	             root: 'list'
	         }
	     },
	     autoLoad: true
	});
	
	var processorInfoStore = Ext.create('Ext.data.Store', {
		model : 'processorInfo',
		autoLoad : false,
		autoDestroy : true,
		pageSize : 80,
		proxy : {
			type : 'ajax',
			url : '../processorInfo/findProInfoByProductCgId.action',		
			reader : {
				type : 'json',
				root : 'list',
				totalProperty : 'total'
			}
		},
		sorters : [
			{
				property : 'startTime',
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
			url : '../proInfoTemplate/findProInfoTemplateByProInfoId.action?proInfoId='+globalProInfoId,	
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
	
	var processorInfoGrid = Ext.create('Ext.grid.Panel',{
		   store : processorInfoStore,
	       multiSelect :true,
	       autoScroll:true,
	       width : '70%',
	       region : 'center',
	       columns:[{
				header : 'id',
				width : 120,
				dataIndex : 'proInfoId',
				hidden : true,
				sortable : true
			},{
				header : '标题',
				width : 120,
				dataIndex : 'title',
				sortable : true
			},{
				header : '开始时间',
				width : 170,
				dataIndex : 'startTime',
				sortable : true,
				renderer : function(value){
					if(value == ""){
						return "";
					}else{
						return Ext.util.Format.date(value,'Y-m-d H:i:s');
					}
				}
			},{
				header : '结束时间',
				width : 170,
				dataIndex : 'endTime',
				sortable : true,
				renderer : function(value){
					if(value == ""){
						return "";
					}else{
						return Ext.util.Format.date(value,'Y-m-d H:i:s');
					}
				}
			},{
				header : '流程',
				width : 120,
				dataIndex : 'category.categoryName',
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
            xtype :'combobox',
           	itemId:'productCombo',
            border:false,
            width:180,
            store : productCategoryStore,
			valueField : 'categoryId',
			displayField : 'categoryName',
			emptyText : '选择产品..',
            editable:false,
            name:'productCombo',
            listeners: {
                select : function(combo, records, eOpts){
	                var categoryId = records[0].get('categoryId');
	                globalProductId = categoryId;
                	var searchProxy = new Ext.data.HttpProxy(
					{
						type : 'ajax',
						url : '../proCategroy/findProcCgByProdCgId.action?categoryId='+categoryId,
						reader : {
							type : 'json',
							root : 'list',
							totalProperty : 'total'
						}
					});
					var searchProxy2 = new Ext.data.HttpProxy(
					{
						type : 'ajax',
						url : '../processorInfo/findProInfoByProductCgId.action?ProductCgId='+categoryId,
						reader : {
							type : 'json',
							root : 'list',
							totalProperty : 'total'
						}
					});
			              processorInfoStore.setProxy(searchProxy2);
			              processorInfoStore.load();
			              processorCategoryStore.setProxy(searchProxy);
			              processorCategoryStore.load();
			              processorInfoGrid.down("#processorCombo").setValue("");
			              processorInfoGrid.down("#processorCombo").setDisabled(false);
			              processorInfoGrid.down("#checkAll").setDisabled(false);
                	}
                }
           },{
            xtype :'combobox',
           	itemId:'processorCombo',
            border:false,
            width:120,
            disabled:true,
            store : processorCategoryStore,
			valueField : 'categoryId',
			displayField : 'categoryName',
			emptyText : '选择流程..',
            editable:false,
            name:'processorCombo',
            listeners: {
                select : function(combo, records, eOpts){
                	var categoryId = records[0].get('categoryId');
                	var searchProxy = new Ext.data.HttpProxy(
					{
						type : 'ajax',
						url : '../processorInfo/findProInfoByProcProd.action?ProductCgId='+globalProductId+'&procCgId='+categoryId,
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
           },{
            xtype:'button', 
            itemId:'addProcessor',
            border:false,
            text : "添加",
            width:70,           
            name:'addProcessor',
            handler : function(){
            	/*if(componentWinType == "uploadPanel"){
                componentWin.remove(uploadPanel);
                componentWin.add(processorInfoForm);
                componentWinType = "processorInfoForm";
            	}*/   	
            	if(processorInfoGrid.down('#processorCombo').getValue()=='52a620dd473d8f740147431d28fa001b'){   //物流的ID
	            		processorInfoForm.getForm().findField('description').setDisabled(true);
	            		processorInfoForm.getForm().findField('comCombo').setDisabled(false);
	            		processorInfoForm.getForm().findField('nuField').setDisabled(false);
	            		
	            	}else{
	            		processorInfoForm.getForm().findField('description').setDisabled(false);
	            		processorInfoForm.getForm().findField('comCombo').setDisabled(true);
	            		processorInfoForm.getForm().findField('nuField').setDisabled(true);
	            }
            	processorInfoForm.getForm().reset();
            	processorInfoForm.down("#productCombo").setValue(processorInfoGrid.down("#productCombo").getValue());
            	processorInfoForm.down("#processorCombo").setValue(processorInfoGrid.down("#processorCombo").getValue());
            	processorInfoForm.down("#productCombo").setDisabled(false);
            	processorInfoForm.down("#processorCombo").setDisabled(false);
            	processorInfoForm.down("#add").setDisabled(false);
            	processorInfoForm.down("#edit").setDisabled(true);
            	processorInfoForm.down("#reset").setDisabled(false);
            	processorInfoFormWin.setTitle("添加流程信息");
            	processorInfoFormWin.show();
            }
         },{
            xtype:'button', 
            itemId:'editProcessor',
            border:false,
            text : "修改",
            width:70,           
            name:'editProcessor',
            handler : function(){
            	/*if(componentWinType == "uploadPanel"){
                componentWin.remove(uploadPanel);
                componentWin.add(processorInfoForm);
                componentWinType = "processorInfoForm";
            	}*/
            	var sm = processorInfoGrid.getSelectionModel();
            	var data = sm.getLastSelected();
            	processorInfoForm.getForm().reset();
            	processorInfoForm.loadRecord(data);
            	if(data.get('category.categoryId')=='52a620dd473d8f740147431d28fa001b'){   //物流的ID
	            		processorInfoForm.getForm().findField('description').setDisabled(true);
	            		processorInfoForm.getForm().findField('comCombo').setDisabled(false);
	            		processorInfoForm.getForm().findField('nuField').setDisabled(false);
	            		
	            	}else{
	            		processorInfoForm.getForm().findField('description').setDisabled(false);
	            		processorInfoForm.getForm().findField('comCombo').setDisabled(true);
	            		processorInfoForm.getForm().findField('nuField').setDisabled(true);
	            }
	            processorInfoForm.down("#productCombo").setDisabled(true);
            	processorInfoForm.down("#processorCombo").setDisabled(true);
            	processorInfoForm.down("#add").setDisabled(true);
            	processorInfoForm.down("#edit").setDisabled(false);
            	processorInfoForm.down("#reset").setDisabled(true);
            	processorInfoForm.down("#productCombo").setValue(processorInfoGrid.down("#productCombo").getValue());
            	processorInfoForm.down("#processorCombo").setValue(data.get('category.categoryName'));
            	processorInfoForm.down("#startTime").setValue(Ext.util.Format.date(data.get('startTime'),'YmdHis'));
            	processorInfoForm.down("#endTime").setValue(Ext.util.Format.date(data.get('endTime'),'YmdHis'));
            	processorInfoFormWin.setTitle("添加流程信息");
            	processorInfoFormWin.show();
            }
         },
         {
            xtype:'button', 
            itemId:'check',
            border:false,
            text : "查看",
            width:70,
            disabled:true,
            name:'check',
            handler : function(){
            	var sm = processorInfoGrid.getSelectionModel();
            	var data = sm.getLastSelected();
            	processorInfoForm.loadRecord(data);
            	processorInfoForm.down("#add").setDisabled(true);
            	processorInfoForm.down("#reset").setDisabled(true);
            	processorInfoForm.down("#startTime").setValue(Ext.util.Format.date(data.get('startTime'),'YmdHis'));
            	processorInfoForm.down("#endTime").setValue(Ext.util.Format.date(data.get('endTime'),'YmdHis'));
            	processorInfoForm.down("#processorCombo").setValue(data.get('category.categoryName'));
            	processorInfoForm.down("#productCombo").setValue(processorInfoGrid.down("#productCombo").getValue());
            	processorInfoFormWin.setTitle("查看流程信息");
            	processorInfoFormWin.show();
         }
         },
         {
            xtype:'button', 
            itemId:'delete',
            border:false,
            disabled:true,
            text : "删除",
            width:70,          
            name:'delete',
            handler : function(){
            	  Ext.Msg.show({
							title : '提示',
							msg : '确定要刪除选中的流程信息？',
							buttonText : {
								yes : '确定',
								no : '取消'
							},
							buttons : Ext.Msg.YESNO,
							fn : function(btn) {
								if (btn == "yes") {
									deleteProcessorInfo();
								} else if (btn == "no") {
									return;
								}
							}
						});    	
         }
         },{
			xtype : 'button',
			itemId : 'checkAll',
			border : false,
			text : "查看产品全部信息",
			name : 'checkAll',
			disabled : true,
			handler : function() {
				processorInfoGrid.down("#processorCombo").setValue("");
				var searchProxy = new Ext.data.HttpProxy({
						type : 'ajax',
						url : '../processorInfo/findProInfoByProductCgId.action?ProductCgId='
								+ globalProductId,
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
           ],
           listeners : {
           'select' : function(RowModel, record, index, eOpts){
			if(record != null){
			    var proInfoId = record.get('proInfoId');
			    globalProInfoId = record.get('proInfoId');
				var searchProxy = new Ext.data.HttpProxy(
					{
						type : 'ajax',
						url : '../proInfoTemplate/findProInfoTemplateByProInfoId.action?proInfoId='+proInfoId,
						reader : {
							type : 'json',
							root : 'list',
							totalProperty : 'total'
						}
					});
			   proInfoTemplateGrid.down("#addTemplate").setDisabled(false);
			   proInfoTemplateStore.setProxy(searchProxy);
			   proInfoTemplateStore.load();

			}
           },
           'selectionchange':function( thisGrid, selected, eOpts ){
           	if(selected.length > 0){
           		processorInfoGrid.down("#check").setDisabled(false);
           		processorInfoGrid.down("#editProcessor").setDisabled(false);
           		processorInfoGrid.down("#delete").setDisabled(false);
           	}else{
           		processorInfoGrid.down("#check").setDisabled(true);
           		processorInfoGrid.down("#editProcessor").setDisabled(true);
           		processorInfoGrid.down("#delete").setDisabled(true);
           	}
           }
         }
	});
	
	

	
	var proInfoTemplateGrid = Ext.create('Ext.grid.Panel',{
		   store : proInfoTemplateStore,
	       multiSelect :true,
	       autoScroll:true,
	       width : '30%',
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
            	proInfoTemplateWin.show();
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
            	   proInfoIndexGrid.down("#addDate").setDisabled(true);
            	   proInfoIndexGrid.down("#enterIndex").setDisabled(true);
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
         tbar :[
         {
            xtype:'button', 
            itemId:'enterIndex',
            border:false,
            text : "提交",
            width:70,          
            name:'enterIndex',
            handler : function(){
            	enterIndexValue();
         }
         },{
            xtype:'button', 
            itemId:'setIndex',
            border:false,
            text : "重置",
            width:70,          
            name:'setIndex',
            handler : function(){
         }
         },{
            xtype:'button', 
            itemId:'addDate',
            border:false,
            text : "新增一行",
            width:70,          
            name:'addDate',
            handler : function(){
            	proInfoIndexGridStore.add("");
         }
         }          
         ],
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
			itemId:'settingIndex',
			collapsible: true,
			align : 'center',
			title : '设置字段',
			items : [
        {
            xtype:'textfield', 
            itemId:'templateName',
            border:false,
            fieldLabel : "模板名称",
            disabled : true,
            width:350,
            name:'templateName'
        },
        {
        	layout:'column',
        	border:false,
        	items:[{
            xtype:'textfield', 
            itemId:'index1',
            border:false,
            width:350,
            value:"",
            fieldLabel : "字段1",
            name:'index1'
        	},{
        	xtype:'combobox', 
        	store: indexTypeComboStore,
            itemId:'indexType1',
            displayField: 'typeName',
            valueField: 'indexTypeId',
            border:false,
            width:180,
            fieldLabel : "类型",
            name:'indexType1'
        	}
        	]
        }
	    ]}
	],
	buttons :[
	{text:"更多字段",formBind:true,
			handler:function()
			{
				globalCount++;

				settingIndexForm.down("#settingIndex").add({
					border :false,
					items:[{
					       border :false,
					       layout :"column",
				           items : [ {
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
                           fieldLabel : "类型",
                           name:'indexType'+globalCount
				           }
                           ]
				}]});
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
			var templateName = settingIndexForm.down("#templateName").getValue();
			this.up('form').getForm().reset();
			settingIndexForm.down("#templateName").setValue(templateName);
		}
	}
	]
});	


 var processorInfoForm=Ext.create("Ext.form.Panel",{
	frame : true,
	split : true,
	//disabled:true,
	minWidth : 120,
	layout : 'fit',
    margins : '0 0 0 0',
	bodyPadding : 3,
	items : [{
		    xtype : 'fieldset',
			itemId:'processorInfo',
			collapsible: true,
			maxHeight:400,
			align : 'center',
			title : '流程信息',
			items : [
			{
            xtype :'combobox',
           	itemId:'productCombo',
           	fieldLabel : "产品",
            border:false,
            width:250,
            store : productCategoryStore,
			valueField : 'categoryId',
			displayField : 'categoryName',
			emptyText : '选择产品..',
			allowBlank: false,
            editable:false,
            name:'productCombo',
            listeners: {
                select : function(combo, records, eOpts){
	                var categoryId = records[0].get('categoryId');
                	var searchProxy = new Ext.data.HttpProxy(
					{
						type : 'ajax',
						url : '../proCategroy/findProcCgByProdCgId.action?categoryId='+categoryId,
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
       },{
            xtype :'combobox',
           	itemId:'processorCombo',
            border:false,
            allowBlank: false,
            fieldLabel : "流程",
            width:250,
            store : processorCategoryStore,
			valueField : 'categoryId',
			displayField : 'categoryName',
			emptyText : '选择流程..',
            editable:false,
            name:'processorCombo',
            listeners: {
                select : function(combo, records, eOpts){
	            	console.log(processorInfoForm.down("#processorCombo").getValue());
	            	if(records[0].get('categoryId')=='52a620dd473d8f740147431d28fa001b'){   //物流的ID
	            		processorInfoForm.getForm().findField('description').setDisabled(true);
	            		processorInfoForm.getForm().findField('comCombo').setDisabled(false);
	            		processorInfoForm.getForm().findField('nuField').setDisabled(false);
	            	}else{
	            		processorInfoForm.getForm().findField('description').setDisabled(false);
	            		processorInfoForm.getForm().findField('comCombo').setDisabled(true);
	            		processorInfoForm.getForm().findField('nuField').setDisabled(true);
	            	}
                }
            }
        },{
            xtype:'textfield', 
            itemId:'title',
            border:false,
            allowBlank: false,
            fieldLabel : "标题",
            width:350,
            name:'title'
        },{
               xtype :'combobox',
               itemId:'comCombo',
               border:false,
               allowBlank: false,
               fieldLabel : "物流公司",
               width:250,
               store : kuaidi,
   			   valueField : 'k',
   			   displayField : 'v',
   			   emptyText : '选择物流公司..',
               editable:false,
               disabled:true,
               name:'comCombo'
       },{
            xtype:'textfield', 
            itemId:'nuField',
            border:false,
            allowBlank: false,
            fieldLabel : "快递号",
            width:350,
            disabled:true,
            name:'nuField'
        },{
            xtype:'textareafield', 
            itemId:'description',
            border:false,
            fieldLabel : "摘要",
            disabled:true,
            allowBlank: false,
            width:350,
            name:'description'
        },{
            xtype:'datetimefield', 
            itemId:'startTime',
            border:false,
            format : "Y-m-d",
            allowBlank: false,
            fieldLabel : "开始时间",
            width:350,
            name:'startTime',
            listeners:{
            	'change':function( thisField, newValue, oldValue, eOpts ){
            		if(processorInfoForm.down("#endTime").getValue()!=""){
            		if(newValue > processorInfoForm.down("#endTime").getValue()){
            			Ext.example.msg("提示",'开始时间必须小于结束时间');
            			thisField.setValue(oldValue);
            		}
            		}
            	}
            }
        },{
            xtype:'datetimefield', 
            itemId:'endTime',
            border:false,
            format : "Y-m-d",
            allowBlank: false,
            fieldLabel : "结束时间",
            width:350,
            name:'endTime',
            listeners:{
            	'change':function( thisField, newValue, oldValue, eOpts ){
            		if(processorInfoForm.down("#startTime").getValue()!=""){
            		if(newValue < processorInfoForm.down("#startTime").getValue()){
            			Ext.example.msg("提示",'结束时间必须大于开始时间');
            			thisField.setValue(oldValue);
            		}
            		}
            	}
            }
        }]
	}
	],
        buttons :[{
         xtype: 'button',
         text : '添加',
         itemId:'add',
         handler :function(){
         	if(this.up('form').getForm().isValid()){
         	    addOrEditProcessorInfo("add");
         	}
         }
         },{
         xtype: 'button',
         text : '修改',
         itemId:'edit',
         handler :function(){
         	if(this.up('form').getForm().isValid()){
         	    addOrEditProcessorInfo("edit");
         	}
         }
         },{
         xtype: 'button',
         text : '重置',
         itemId:'reset',
         handler :function(){
         	this.up('form').getForm().reset();
         }
         },
         {
         xtype: 'button',
         text : '取消',
         itemId:'cancel',
         handler :function(){
         	processorInfoFormWin.hide();
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
	extParam.param1 = globalProInfoId;
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
		   	proInfoTemplateWin.hide();
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

 var deleteProcessorInfo = function(){
	var sm = processorInfoGrid.getSelectionModel();
	var datas = sm.getSelection();
	var processorInfoIds = ""
	var extParam = {};
	if(datas.length > 0){
	for(i=0;i<datas.length;i++){
		if(i == (datas.length-1)){
			processorInfoIds = processorInfoIds + datas[i].get('proInfoId')
		}else{
			processorInfoIds = processorInfoIds + datas[i].get('proInfoId') + "`"
		}
	}
	extParam.extJsonList = processorInfoIds;
	Ext.Ajax.request({
	         url : "../processorInfo/deleteProcessorInfo.action",
             params:{
             	extParam :　Ext.JSON.encode(extParam)
	         },
	         method : "POST",
	         success : function(extMessage){
	         	var json = Ext.JSON.decode(extMessage.responseText);
		        successIds = json.successJsonList.split("`");
		        processorInfoStore.load();
		        for (i = 0; i < (successIds.length - 1); i++) {
						if (processorInfoStore.getById(successIds[i]) != null) {
							Ext.example.msg("提示", "刪除'"+ processorInfoStore.getById(successIds[i]).get('title')
											+ "'成功！");
						}
				}
	    }
	});
	}
	
}

var addOrEditProcessorInfo = function(param){
	var url = "";
	var extParam = {};
	var extJson = {};
	if(param == "add"){
		extParam.param1 = processorInfoForm.down("#productCombo").getValue();
	    extParam.param2 = processorInfoForm.down("#processorCombo").getValue();
	    url = "../processorInfo/addProcessorInfo.action";
	}else if(param == "edit"){
		extJson.proInfoId = globalProInfoId;
		url = "../processorInfo/updateProcessorInfo.action";
	}
	extJson.title = processorInfoForm.down("#title").getValue();
	//区分物流快递
	if(processorInfoForm.down("#description").getValue()!=""&&processorInfoForm.down("#comCombo").getValue()=="")
		extJson.description = processorInfoForm.down("#description").getValue();
	else if(processorInfoForm.down("#description").getValue()==""&&processorInfoForm.down("#comCombo").getValue()!=""){
		extJson.description="com="+processorInfoForm.down("#comCombo").getValue()+"`nu="+processorInfoForm.down("#nuField").getValue();
	}else if(processorInfoForm.down("#description").getValue()!=""&&processorInfoForm.down("#comCombo").getValue()!=""){
		if(processorInfoForm.down("#processorCombo").getValue()=='52a620dd473d8f740147431d28fa001b'){
			extJson.description="com="+processorInfoForm.down("#comCombo").getValue()+"`nu="+processorInfoForm.down("#nuField").getValue();
		}else{
			extJson.description = processorInfoForm.down("#description").getValue();
		}
	}
	extJson.startTime = processorInfoForm.down("#startTime").getValue();
	extJson.endTime = processorInfoForm.down("#endTime").getValue();
	extParam.extJsons = Ext.JSON.encode(extJson);
	Ext.Ajax.request({
	url : url,
    params:{
		extParam : Ext.JSON.encode(extParam)
	},
	method : "POST",
	success : function(extMessage){
		var json = Ext.JSON.decode(extMessage.responseText);
		if (json.successOrFalse == "success") {
		   Ext.example.msg("提示",json.meassage);
		   processorInfoStore.load();
		   processorInfoForm.getForm().reset();
		   processorInfoFormWin.hide();
		}else if(json.successOrFalse == "false"){
			Ext.Msg.alert("提示",json.meassage);
		}
	}
		
	});

};

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
    var proInfoTemplateWin = Ext.create("Ext.Window",{
	       width : 600,
	       height: 600,
	       border : false,
	       modal : true,
	       autoScroll:true,
	       layout : 'fit',
 	       closeAction:'hide',
 	       items :[proInfoTemplateForm]
    });
    var componentWin3 = Ext.create("Ext.Window",{
	       width : 600,
	       border : false,
	       maximizable : true,
	       autoScroll:true,
	       layout : 'fit',
	       modal : true,
 	       closeAction:'hide',
 	       items :[proInfoIndexGrid]
    });
	var processorInfoFormWin = Ext.create("Ext.Window",{
	       width : 600,
	       autoScroll:true,
	       layout : 'fit',
	       modal : true,
 	       closeAction:'hide',
 	       items :[processorInfoForm]
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
				items : [processorInfoGrid,proInfoTemplateGrid]
	});
	return showPanel;
}