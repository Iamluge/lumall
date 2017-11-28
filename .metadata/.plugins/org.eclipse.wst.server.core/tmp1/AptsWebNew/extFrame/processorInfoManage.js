var createProcessorInfoManage = function() {

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
	
	var globalResourceId = "";
	
	var searchType = 0;
	
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
							searchType = 0;
							comboIsHide = false;
							storeIsLoad = true;
							
						} else {
							searchType = 1;
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
		        idProperty:'proInfoId',
				extend : 'Ext.data.Model',
				fields : ["proInfoId", 'title', 'description', "startTime",
						"endTime", "category.categoryName","category.categoryId"]
			});

	Ext.define('infoType', {
				extend : 'Ext.data.Model',
				fields : ['typeId', 'typeName']
			})

	Ext.define('resourceUrl', {
		        idProperty:"urlId",
				extend : 'Ext.data.Model',
				fields : ['urlId', 'urlContext', 'resourceType', "description","uploadDate","title"]
			});

	Ext.define('proInfoTemplate', {
		        idProperty:"templateId",
				extend : 'Ext.data.Model',
				fields : ["templateId", "templateName", "description","productCategory.categoryId"]
			})
	Ext.define('proInfoIndex', {
				extend : 'Ext.data.Model',
				fields : ["indexId", "indexName", "indexType", "orderNumber"]
			});
   Ext.define('indexValue', {
				extend : 'Ext.data.Model',
				fields : ["indexValueId", "value", "enterDate"]
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
	var proInfoTemplateStore = Ext.create('Ext.data.Store', {
		model : 'proInfoTemplate',
		autoLoad : true,
		autoDestroy : false,
		pageSize : 80,
		proxy : {
			type : 'ajax',
			url : '../proInfoTemplate/findProInfoTemplateByProInfoId.action?proInfoId='
					+ globalProInfoId,
			reader : {
				type : 'json',
				root : 'list',
				totalProperty : 'total'
			}
		},
		sorters : [{
					property : 'templateId',
					direction : 'ASC'
				}]
	});

	var proInfoIndexStore = Ext.create('Ext.data.Store', {
				model : 'proInfoIndex',
				autoLoad : false,
				autoDestroy : true,
				pageSize : 80,
				proxy : {
					type : 'ajax',
					url : '../proInfoIndex/findIndexByTemplateId.action?templateId='
							+ globalTemplateId,
					reader : {
						type : 'json',
						root : 'list',
						totalProperty : 'total'
					}
				},
				sorters : [{
							property : 'orderNumber',
							direction : 'ASC'
						}]
			});

	var productCategoryStore = Ext.create('Ext.data.Store', {
				model : 'productCategory',
				autoLoad : storeIsLoad,
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

	var resourceUrlStore = Ext.create('Ext.data.Store', {
		model : 'resourceUrl',
		autoLoad : false,
		autoDestroy : false,
		pageSize : 80,
		proxy : {
			type : 'ajax',
			url : '../resourceUrl/findResourceUrlByProcessorInfoId.action?processorInfoId='
					+ globalProInfoId,
			reader : {
				type : 'json',
				root : 'list',
				totalProperty : 'total'
			}
		},
		sorters : [{
					property : 'uploadDate',
					direction : 'ASC'
				}]
	});
	
	var indexValueStore = Ext.create('Ext.data.Store', {
		model : 'indexValue',
		autoLoad : false,
		autoDestroy : true,
		pageSize : 80,
		proxy : {
			type : 'ajax',
			url : '../proInfoIndex/findIndexValueByTemAndProInfo.action?templateId='+globalTemplateId+"&proInfoId="+globalProInfoId,
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

	var infoTypeStore = Ext.create('Ext.data.Store', {
				model : 'infoType',
				autoLoad : true,
				autoDestroy : true,
				pageSize : 80,
				proxy : {
					type : 'ajax',
					url : '../data/infoType.json',
					reader : {
						type : 'json',
						root : 'list',
						totalProperty : 'total'
					}
				},
				sorters : [{
							property : 'typeId',
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
					url : '../processorInfo/findProInfoByProcProd.action?searchType='+searchType,
					reader : {
						type : 'json',
						root : 'list',
						totalProperty : 'total'
					}
				},
				sorters : [{
							property : 'startTime',
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
					width : 170,
					dataIndex : 'startTime',
					sortable : true,
					renderer : function(value) {
						if (value == "") {
							return "";
						} else {
							return Ext.util.Format.date(value, 'Y-m-d H:i:s');
						}
					}
				}, {
					header : '结束时间',
					width : 170,
					dataIndex : 'endTime',
					sortable : true,
					renderer : function(value) {
						if (value == "") {
							return "";
						} else {
							return Ext.util.Format.date(value, 'Y-m-d H:i:s');
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
		dockedItems : [
		 {xtype: 'toolbar',
          items: [
			{
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
					processorInfoGrid.down("#checkAll").setDisabled(false);
					processorInfoGrid.down("#addProcessor").setDisabled(false);
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
		}]},
		{
        xtype: 'toolbar',
        items: [
		{
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
            disabled:true,
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
         },
		{
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
		]
		}
		],
		listeners : {
			'select' : function(RowModel, record, index, eOpts) {
					globalProInfoId = record.get('proInfoId');
					resourceUrlGrid.down("#typeCombo").setDisabled(false);
					if(globalInfoType != ""){
						if(globalInfoType == "customInfo"){
						var searchProxy = new Ext.data.HttpProxy({
							type : 'ajax',
							url : '../proInfoTemplate/findProInfoTemplateByProInfoId.action?proInfoId='
									+ globalProInfoId,
							reader : {
								type : 'json',
								root : 'list',
								totalProperty : 'total'
							}
						});
						proInfoTemplateStore.setProxy(searchProxy);
						proInfoTemplateStore.load();
						resourceUrlGrid.show();
						}else{
						var searchProxy = new Ext.data.HttpProxy({
							type : 'ajax',
							url : '../resourceUrl/findUrlByTypeAndProcInfo.action?processorInfoId='
									+ globalProInfoId+"&resourceType="+globalInfoType,
							reader : {
								type : 'json',
								root : 'list',
								totalProperty : 'total'
							}
						});
						resourceUrlStore.setProxy(searchProxy);
						resourceUrlStore.load();
						resourceUrlGrid.show();
						}
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
			allowBlank: comboIsHide,
			hidden:comboIsHide,
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
            allowBlank: comboIsHide,
            fieldLabel : "流程",
            hidden:comboIsHide,
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
				header : '标题',
				width : 120,
				dataIndex : 'title',
				sortable : true
			},{
				header : '描述',
				width : 120,
				dataIndex : 'description',
				sortable : true
			}, {
				header : '录入时间',
				width : 120,
				dataIndex : 'uploadDate',
				sortable : true,
				renderer : function(value) {
						if (value == "") {
							return "";
						} else {
							return Ext.util.Format.date(value, 'Y-m-d h:m:s');
						}
				}
			},{
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
			
			
	var resourceUrlGrid = Ext.create('Ext.grid.Panel', {
		store : proInfoTemplateStore,
		multiSelect : true,
		autoScroll : true,
		width : '40%',
		region : 'east',
		columns : templateColumns,
		frame : true,
		selType : 'checkboxmodel',
		split : true,
		minWidth : 120,
		veiwConfig : {
			stripeRows : true
		},
		tbar : [{
			xtype : 'combobox',
			itemId : 'typeCombo',
			border : false,
			width : 100,
			store : infoTypeStore,
			disabled:true,
			valueField : 'typeId',
			displayField : 'typeName',
			emptyText : '选择类型..',
			editable : false,
			name : 'typeCombo',
			listeners : {
				'select' : function(combo, records, eOpts) {
					globalInfoType = records[0].get('typeId');
					if (globalInfoType == "customInfo") {
						resourceUrlGrid.reconfigure(proInfoTemplateStore,
								templateColumns);
						resourceUrlGrid.down("#upload").setDisabled(true);
						resourceUrlGrid.down("#check").setDisabled(false);
						resourceUrlGrid.down("#delete").setDisabled(false);
						resourceUrlGrid.down("#setIndexValue")
								.setDisabled(false);
						var searchProxy = new Ext.data.HttpProxy({
							type : 'ajax',
							url : '../proInfoTemplate/findProInfoTemplateByProInfoId.action?proInfoId='
									+ globalProInfoId,
							reader : {
								type : 'json',
								root : 'list',
								totalProperty : 'total'
							}
						});
						proInfoTemplateStore.setProxy(searchProxy);
						proInfoTemplateStore.load();
						resourceUrlGrid.show();
					} else {
						resourceUrlGrid.reconfigure(resourceUrlStore,
								otherColumns);
						resourceUrlGrid.down("#check").setDisabled(false);
						resourceUrlGrid.down("#delete").setDisabled(false);
						resourceUrlGrid.down("#upload").setDisabled(false);
						resourceUrlGrid.down("#setIndexValue").setDisabled(true);
						var searchProxy = new Ext.data.HttpProxy({
							type : 'ajax',
							url : '../resourceUrl/findUrlByTypeAndProcInfo.action?processorInfoId='
									+ globalProInfoId+"&resourceType="+globalInfoType,
							reader : {
								type : 'json',
								root : 'list',
								totalProperty : 'total'
							}
						});
						resourceUrlStore.setProxy(searchProxy);
						resourceUrlStore.load();
						resourceUrlGrid.show();
					}
				}
			}
		}, {
			xtype : 'button',
			itemId : 'upload',
			border : false,
			text : "添加",
			width : 70,
			name : 'upload',
			disabled : true,
			handler : function() {
				if(globalInfoType == "text"){
					resourceForm.down("#add").setDisabled(false);
				    resourceForm.down("#edit").setDisabled(true);
					resourceFormWin.show();
				}else{
					uploadPanelWin.show();
				}
			}
		}, {
			xtype : 'button',
			itemId : 'setIndexValue',
			border : true,
			text : "自定义信息录入",
			width : 110,
			name : 'setIndexValue',
			handler : function() {
				proInfoIndexGridStore.loadData("");
				proInfoIndexGrid.down("#addDate").setDisabled(false);
				proInfoIndexGrid.down("#enterIndex").setDisabled(false);
				proInfoIndexWin.setTitle("自定义信息录入");
				// 重置
				globalIndexCount = 0;
				proInfoIndexColumn = [new Ext.grid.RowNumberer()];
				globalIndexNames = [];
				globalIndexCount = proInfoIndexStore.getCount();
				for (i = 0; i < globalIndexCount; i++) {
					var indexName = proInfoIndexStore.getAt(i).get("indexName")
					var column = {};
					globalIndexNames.push(indexName);

					// 判别字段的类型
	                 if (proInfoIndexStore.getAt(i).get("indexType") == "datefield") {
						column = {
							header : indexName,
							dataIndex : "index" + i,
							format:'Y-m-d',
							width : 120,
							editor : {
								xtype : "datefield",
								format:'Y-m-d',
								rawToValue : function(rawValue) {
										return Ext.Date.format(this.parseDate(rawValue) || rawValue || null,"Y-m-d");
								}
							}

						};
					} else if (proInfoIndexStore.getAt(i).get("indexType") == "yesOrNo") {
						column = {
							header : indexName,
							dataIndex : "index" + i,
							width : 120,
							editor : {
								xtype : 'combobox',
								store : yesOrNoStore,
								displayField : 'value',
								valueField : 'value',
								border : false
							}
						};
					} else if (proInfoIndexStore.getAt(i).get("indexType") == "isEligible") {
						column = {
							header : indexName,
							dataIndex : "index" + i,
							width : 120,
							editor : {
								xtype : 'combobox',
								store : isEligibleStore,
								displayField : 'value',
								valueField : 'value',
								border : false
							}
						};
					} else if (proInfoIndexStore.getAt(i).get("indexType") == "numberfield") {
						column = {
							header : indexName,
							dataIndex : "index" + i,
							width : 120,
							editor : {
								xtype : 'numberfield'
							}
						};
					} else if (proInfoIndexStore.getAt(i).get("indexType") == "timefield") {
						column = {
							header : indexName,
							dataIndex : "index" + i,
							width : 120,
							format:'H:i:s',
							editor : {
								xtype : 'datetimefield',
								format:'H:i:s',
								rawToValue : function(rawValue) {
									if (this.stringDate) {
										if (this.showTimer) {
											return Ext.Date.format(this.parseDate(rawValue)|| rawValue|| null,"H:i:s");
										} else {
											return Ext.Date.format(this.parseDate(rawValue) || rawValue || null,"H:i:s");
										}
									} else {
										return this.parseDate(rawValue)|| rawValue || null;
									}
							}
							}

						};
					} else if (proInfoIndexStore.getAt(i).get("indexType") == "datetimefield") {
						column = {
							header : indexName,
							dataIndex : "index" + i,
							width : 120,
							editor : {
								xtype : "datetimefield",
								format:'Y-m-d H:i:s',
							    rawToValue : function(rawValue) {
									if (this.stringDate) {
										if (this.showTimer) {
											return Ext.Date.format(this.parseDate(rawValue)|| rawValue|| null,"Y-m-d H:i:s");
										} else {
											return Ext.Date.format(this.parseDate(rawValue) || rawValue || null,"Y-m-d");
										}
									} else {
										return this.parseDate(rawValue)|| rawValue || null;
									}
								}
							}
						};
					} else {
						column = {
							header : indexName,
							dataIndex : "index" + i,
							width : 120,
							editor : {
								xtype : 'textfield'
							}
						};
					}

					proInfoIndexColumn.push(column);
				}
				proInfoIndexGrid.reconfigure(proInfoIndexGridStore,
						proInfoIndexColumn);
				proInfoIndexWin.show();
			}
		}, {
			xtype : 'button',
			itemId : 'check',
			border : false,
			text : "查看",
			disabled : true,
			width : 70,
			name : 'check',
			handler : function() {
				if (globalInfoType == "customInfo") {
				   proInfoIndexGridStore.loadData("");
            	   proInfoIndexWin.setTitle("查看已录信息");
            	   proInfoIndexGrid.down("#addDate").setDisabled(true);
            	   proInfoIndexGrid.down("#setIndex").setDisabled(true);
            	   proInfoIndexGrid.down("#enterIndex").setDisabled(true);
            	   var searchProxy = new Ext.data.HttpProxy(
					{
						type : 'ajax',
						url : '../proInfoIndex/findIndexValueByTemAndProInfo.action?templateId='+globalTemplateId+"&proInfoId="+globalProInfoId,
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
			       	   if(value != null){
			       	   var indexValue = Ext.JSON.decode(value);	
			       	   proInfoIndexGridStoreData.push(indexValue);
			       	   }
			       }
			       proInfoIndexGrid.reconfigure(proInfoIndexGridStore,proInfoIndexColumn);
			       proInfoIndexGridStore.loadData(proInfoIndexGridStoreData);
			       proInfoIndexWin.show();
			       });
				} else {
					var row = resourceUrlGrid.getSelectionModel().getLastSelected();
					var fileAddress = row.data.urlContext;
					var temps = fileAddress.split('//');
					var fileName = temps[temps.length - 1];
					if (row.data.resourceType == "picture") {
						window.open("localhost:8080/file/" + fileName);
					} else if (row.data.resourceType == "vedio") {
						window.open("../extFrameHtml/vedio.html?fn=" + fileName);
					}
				}
			}
		}, {
			xtype : 'button',
			itemId : 'delete',
			border : false,
			text : "删除",
			disabled : false,
			width : 70,
			name : 'delete',
			handler : function() {
				Ext.Msg.show({
							title : '提示',
							msg : '确定要刪除选中的资源？',
							buttonText : {
								yes : '确定',
								no : '取消'
							},
							buttons : Ext.Msg.YESNO,
							fn : function(btn) {
								if (btn == "yes") {
									deleteResource();
								} else if (btn == "no") {
									return;
								}
							}
						});

			}
		}],
		listeners : {
			'select' : function(RowModel, record, index, eOpts) {
				if (globalInfoType == "customInfo") {
				globalTemplateId = record.get('templateId');
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
				proInfoIndexStore.on('load', function() {
				globalIndexCount = proInfoIndexStore.getCount();
				})
				}else{
					globalResourceId = record.get('urlId');
				}
			},
			'celldblclick' : function( thisGrid, td, cellIndex, record, tr, rowIndex, e, eOpts ){
				resourceForm.loadRecord(record);
				resourceForm.down("#edit").setDisabled(false);
				resourceForm.down("#add").setDisabled(true);
				resourceFormWin.show();
			}
		}
	});
	
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
        saveBtnText: '保存',
        cancelBtnText: '取消',
        autoCancel: false
    });
	var proInfoIndexGrid = Ext.create('Ext.grid.Panel', {
				store : proInfoIndexGridStore,
				multiSelect : true,
				autoScroll : true,
				width : '40%',
				columnLines : true,
				region : 'east',
				selType : 'checkboxmodel',
				enableColumnMove :false,
				columns : proInfoIndexColumn,
				frame : true,
				split : true,
				minWidth : 120,
				plugins: [rowEditing],
				veiwConfig : {
					stripeRows : true
				},
				tbar : [{
							xtype : 'button',
							itemId : 'enterIndex',
							border : false,
							text : "提交",
							width : 70,
							name : 'enterIndex',
							handler : function() {
								enterIndexValue();
							}
						}, {
							xtype : 'button',
							itemId : 'setIndex',
							border : false,
							text : "重置",
							width : 70,
							name : 'setIndex',
							handler : function() {

							}
						}, {
							xtype : 'button',
							itemId : 'addDate',
							border : false,
							text : "新增一行",
							width : 70,
							name : 'addDate',
							handler : function() {
                                var recrod  = {};
                                proInfoIndexGridStore.insert(proInfoIndexGridStore.getCount(), recrod);
								//proInfoIndexGridStore.add("");
							}
						}],
				selModel : {
					selType : 'cellmodel'
				},
				plugins : [cellEditing],
				listeners : {
					'cellkeydown' : function(table, td, cellIndex, record, tr,
							rowIndex, e, eOpts) {
						if (e.getKey() == Ext.EventObject.ENTER) {
							if (cellIndex <= (globalIndexCount - 1)) {
								cellEditing.startEdit(rowIndex, cellIndex + 1);
							} else {
								if (proInfoIndexGridStore.getCount() < (rowIndex + 2)) {
									var recrod  = {};
                                    proInfoIndexGridStore.insert(proInfoIndexGridStore.getCount(), recrod);
								}
								cellEditing.startEdit(rowIndex + 1, 1);
							}
						}
					}
				}
			});

	var resourceForm  = Ext.create("Ext.form.Panel", {
		frame : true,
		split : true,
		// disabled:true,
		minWidth : 120,
		layout : 'fit',
		margins : '0 0 0 0',
		bodyPadding : 3,
		items : [ {
			xtype : 'fieldset',
			collapsible : true,
			maxHeight : 400,
			align : 'center',
			title : '文字信息',
			items : [
					{
						xtype : 'textfield',
						itemId : 'title',
						border : false,
						fieldLabel : "标题",
						width : 350,
						name : 'title'
					},

					{
						xtype : 'textareafield',
						itemId : 'description',
						border : false,
						fieldLabel : "内容",
						name : 'description',
						width : 350,
						allowBlank : false
					}
			     ]
	      }],
	      buttons:[
	      {
	        xtype : 'button',
			itemId : 'add',
			border : false,
			text : "添加",
			width : 70,
			handler : function() {
			   addTextResource();
			   resourceForm .getForm().reset();
			}
	      },
	      {
	        xtype : 'button',
			itemId : 'edit',
			border : false,
			text : "修改",
			width : 70,
			handler : function() {
			  editResource();
			}
	      },
	      {
	        xtype : 'button',
			itemId : 'reset',
			border : false,
			text : "重置",
			width : 70,
			handler : function() {
				this.up('form').getForm().reset();
			}
	      },{
	        xtype : 'button',
			itemId : 'cancel',
			border : false,
			text : "取消",
			width : 70,
			handler : function() {
			   resourceFormWin.hide();
			}
	      }
	      ]
	});
			
	var uploadPanel = Ext.create('Ext.ux.uploadPanel.UploadPanel', {
		header : false,
		addFileBtnText : '选择文件...',
		uploadBtnText : '上传',
		removeBtnText : '移除所有',
		cancelBtnText : '取消上传',
		file_size_limit : 1000,// MB
		file_post_name : 'file',
		width : 750,// 指定上传窗口的宽度
		height : 450,// 指定上传窗口的高度
		// file_types: '*.jpg',
		// file_types_description: 'Image Files',
		flash_url : "../swfupload/swfupload.swf",// 必须指定正确的路径
		flash9_url : "../swfupload/swfupload_fp9.swf",
		upload_success_handler : function(file, serverData, responseReceived) {
			var me = this.settings.custom_settings.scope_handler;
			var rec = me.store.getById(file.id);
			rec.set('percent', 100);
			rec.set('status', file.filestatus);
			rec.commit();
			if (this.getStats().files_queued > 0 && this.uploadStopped == false) {
				this.startUpload();
			} else {
				me.showBtn(me, true);
			}
			var data = {};
			if(serverData != ""){
				var extJson = {};
				data = Ext.JSON.decode(serverData);
				if(data.success == "true"){
				var rec = me.store.getById(file.id);
				extJson.urlContext = data.fileName;
				addVedioOrPictureResource(extJson);
				}else{
					Ext.example.msg("提示","上传失败");
			    }
			}else{
				Ext.example.msg("提示","上传失败");
			}
		    },
		upload_start_handler : function(file) {
			var me = this.settings.custom_settings.scope_handler;
			me.down('#cancelBtn').setDisabled(false);
			var rec = me.store.getById(file.id);
			var postobj = {
				"resourceType" : resourceUrlGrid.down("#typeCombo").getValue()
			};
			this.setPostParams(postobj);
			this.setFilePostName(encodeURIComponent(rec.get('file')));
		},
		upload_complete_handler : function(file) {
			resourceUrlStore.load();
		},
		upload_url : 'http://localhost:8080/AptsUpload/fileUpload.action'
			// upload_url : '../upload/uploadImage.action'
		});

	
	var addVedioOrPictureResource = function(extJson) {
		var extParam = {};
		extJson.resourceType = resourceUrlGrid.down("#typeCombo").getValue();
		extParam.extJsons = Ext.JSON.encode(extJson);
		extParam.param1 = globalProInfoId;
		Ext.Ajax.request({
			url : "../resourceUrl/addResourceUrl.action",
			params : {
				extParam : Ext.JSON.encode(extParam)
			},
			method : "POST",
			success : function(extMessage) {
				var json = Ext.JSON.decode(extMessage.responseText);
	            Ext.example.msg("提示",json.meassage);
	            resourceUrlStore.load();
			}

		});
	}
	
	var editResource = function(){
		var extJson = {};
		extJson.title = resourceForm .down("#title").getValue();
		extJson.description = resourceForm .down("#description").getValue();
		if(globalResourceId != ""){
		extJson.urlId = globalResourceId;
		Ext.Ajax.request({
			url : "../resourceUrl/editResourceUrl.action",
			params : {
				extJson : Ext.JSON.encode(extJson)
			},
			method : "POST",
			success : function(extMessage) {
				var json = Ext.JSON.decode(extMessage.responseText);
				if (json.successOrFalse == "success") {
					Ext.example.msg("提示",json.meassage);
					resourceUrlStore.load();
					resourceFormWin.hide();
				}else if(json.successOrFalse == "false"){
					Ext.Msg.alert("提示",json.meassage);
				}
			}

		});
		}
	}
	
	var addTextResource = function() {
		var extParam = {};
		var extJson = {};
		extJson.title = resourceForm .down("#title").getValue();
		extJson.description = resourceForm .down("#description").getValue();
		extJson.resourceType = resourceUrlGrid.down("#typeCombo").getValue();
		extParam.extJsons = Ext.JSON.encode(extJson);
		extParam.param1 = globalProInfoId;
		Ext.Ajax.request({
			url : "../resourceUrl/addResourceUrl.action",
			params : {
				extParam : Ext.JSON.encode(extParam)
			},
			method : "POST",
			success : function(extMessage) {
				var json = Ext.JSON.decode(extMessage.responseText);
				if (json.successOrFalse == "success") {
					Ext.example.msg("提示",json.meassage);
					resourceUrlStore.load();
					resourceFormWin.hide();
				    resourceForm .getForm().reset();
				}else if(json.successOrFalse == "false"){
					Ext.Msg.alert("提示",json.meassage);
				}
			}

		});
		
	}
	
	var deleteResource = function() {
		var extParam = {};
		var resourceIds = "";
		var url = "";
		var sm = resourceUrlGrid.getSelectionModel();
		var datas = sm.getSelection();
		if (datas.length > 0) {
			if (globalInfoType == "customInfo") {
				for (i = 0; i < datas.length; i++) {
					if (i == (datas.length - 1)) {
						resourceIds = resourceIds + datas[i].get('templateId');
					} else {
						resourceIds = resourceIds + datas[i].get('templateId')
								+ "`";
					}
				}
				url = "../proInfoTemplate/deleteProInfoTemplate.action";
			} else {
				for (i = 0; i < datas.length; i++) {
					if (i == (datas.length - 1)) {
						resourceIds = resourceIds + datas[i].get('urlId');
					} else {
						resourceIds = resourceIds + datas[i].get('urlId') + "`";
					}
				}
				url = "../resourceUrl/deleteResourceUrl.action";
			}
			extParam.extJsonList = resourceIds;
			Ext.Ajax.request({
						url : url,
						params : {
							extParam : Ext.JSON.encode(extParam)
						},
						method : "POST",
						success : function(extMessage) {
							var json = Ext.JSON.decode(extMessage.responseText);
		                    successIds = json.successJsonList.split("`");
							if (globalInfoType == "customInfo") {
		                         proInfoTemplateStore.load();
						         for (i = 0; i < (successIds.length - 1); i++) {
							          if (proInfoTemplateStore.getById(successIds[i]) != null) {
							          Ext.example.msg("提示", "刪除'"+ proInfoTemplateStore.getById(successIds[i]).get('templateName')
											+ "'成功！");
						         }
				            } 
							} else {
								 resourceUrlStore.load();
							}
						}
				 });
		}
	}

	var enterIndexValue = function() {
		var extParam = {};
		var isNull = true; // 用来判断一整行的数据是是否为null
		var store = proInfoIndexGrid.getStore();
		var rows = store.getRange(0, store.getCount() - 1);
		var indexValues = ""; // 存放一行字段的值的集合
		for (i = 0; i < store.getCount(); i++) {
			var indexValue = "" // 存放一行字段的值
			isNull = true;
			for (j = 0; j < globalIndexCount; j++) {
				var index = rows[i].get('index' + j);
				if (index == null || index == "undefined" || index == "" ) {
					index = "";
				}
				if(index != ""){
					isNull = false;
				}
				if (globalIndexCount > 1) {
					if (j == 0) {
						indexValue = "{" + "index" + j + ":\"" + index + "\",";
					} else if (j == globalIndexCount - 1) {
						indexValue = indexValue + "index" + j + ":\"" + index
								+ "\"}";
					} else {
						indexValue = indexValue + "index" + j + ":\"" + index
								+ "\",";
					}
				} else {
					indexValue = "{" + "index" + j + ":\"" + index + "\"}";
				}
			}
			if (indexValue != "" && isNull == false) {
				if (i == store.getCount() - 1) {
					indexValues = indexValues + indexValue;
				} else {
					indexValues = indexValues + indexValue + "`";
				}
			}
		}
		extParam.extJsonList = indexValues;
		extParam.param1 = globalTemplateId;
		extParam.param2 = globalProInfoId;
		if (store.getCount() > 0 || indexValues != "") {
			Ext.Ajax.request({
						url : "../proInfoIndex/enterIndexValue.action",
						params : {
							extParam : Ext.JSON.encode(extParam)
						},
						method : "POST",
						success : function(extMessage) {
						   var json = Ext.JSON.decode(extMessage.responseText);
						   Ext.example.msg("提示", json.meassage);
					       proInfoIndexWin.hide();

						}

					})
		}
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
		if(searchType != "1"){
		extParam.param1 = processorInfoForm.down("#productCombo").getValue();
	    extParam.param2 = processorInfoForm.down("#processorCombo").getValue();
		}
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
		extParam : Ext.JSON.encode(extParam),
		searchType : searchType
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
	
	var uploadPanelWin = Ext.create("Ext.Window", {
				width : 600,
				heigth : 400,
				autoScroll : true,
				modal : true,
				layout : 'fit',
				closeAction : 'hide',
				maximizable : true,
				items : [uploadPanel]
			});

	var proInfoIndexWin = Ext.create("Ext.Window", {
				width : 600,
				height : 300,
				border : false,
				modal : true,
				maximizable : true,
				autoScroll : true,
				layout : 'fit',
				closeAction : 'hide',
				items : [proInfoIndexGrid]
			});
	var resourceFormWin = Ext.create("Ext.Window", {
				width : 600,
				height : 300,
				border : false,
				maximizable : true,
				modal : true,
				autoScroll : true,
				layout : 'fit',
				closeAction : 'hide',
				items : [resourceForm ]
			});

	var processorInfoFormWin = Ext.create("Ext.Window",{
	       width : 600,
	       autoScroll:true,
	       layout : 'fit',
	       modal : true,
 	       closeAction:'hide',
 	       items :[processorInfoForm]
    });
	var showPanel = Ext.create('Ext.panel.Panel', {
				anchor : "100% 100%",
				layout : 'border',
				split : true,
				autoScroll : true,
				items : [processorInfoGrid, resourceUrlGrid]
			});
	return showPanel;
}