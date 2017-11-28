/**
 * 生产计划
 */
 var createProductPlan = function(){
 	var categoryId = null;
 	var categoryName = null;
 	var productPlanId=null;
 	var processorId=null;
 	/**
 	 * 产品
 	 */
 	Ext.define('productCategory', {
			extend : 'Ext.data.Model',
			fields : [
			"categoryId",
			"categoryName"
			]
		});	
		
	/**
	 * 生产计划
	 */
 	Ext.define('productPlan', {
		extend : 'Ext.data.Model',
		fields : [
			"productPlanId", //计划ID
			"productionPlanName", //计划名称
			"startTime",//开始生产时间
			"predictEndTime",//预计结束时间
			"actualEndTime",// 实际结束时间
			"proNumber", //数量
			"contents",  //计划描述
			"categoryId",
			"categoryName"
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
	
	var productPlanStore = Ext.create('Ext.data.Store', {
		model : 'productPlan',
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
		}
	});
	var productGrid = Ext.create('Ext.grid.Panel',{
		   store : productStore,
	       multiSelect :true,
	       autoScroll:true,
	       border:false,
	       width : '30%',
	       region : 'west',
	       columns:[{
				header : '产品代码',
				dataIndex : 'categoryId',
				itemId:'categoryId',
				hidden : true,
				sortable : true
			},{
				header : '产品名称',
				width : '100%',
				dataIndex : 'categoryName',
				itemId:'categoryName',
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
           
           listeners:{
			'cellclick':function(view,record,index){
	    		var sm = productGrid.getSelectionModel();
				var row = sm.getLastSelected();
				/**
				 * 为计划添加原料时候，加载原料传参数
				 */
				categoryId = row.data.categoryId;
				categoryName = row.data.categoryName;
	    		var URL = '../productionPlan/findProductPlanByProductCategoryId.action?categoryId='+row.data.categoryId+
	    		"&categoryName="+ encodeURIComponent(categoryName);
	    		var proxy = new Ext.data.HttpProxy({
					type : 'ajax',	
					url : URL,
					reader : {
						type : 'json',
						root : 'list',
						totalProperty : 'total'
					}
				});
				
	    		productPlanStore.setProxy(proxy);
	    		productPlanStore.load();
			}
		}
	});
	
	var productPlanGrid = Ext.create('Ext.grid.Panel',{
		   store : productPlanStore,
	       multiSelect :true,
	       autoScroll:true,
	       border:false,
	       width : '70%',
	       region : 'center',
	       listeners:{
			'cellclick':function(view,record,index){
	    		var sm = productPlanGrid.getSelectionModel();
				var row = sm.getLastSelected();
				productPlanId=row.raw.productPlanId;
			}
		},
	        tbar :[
	       {
	       	text : '添加计划',
	       	width:90,
	       	handler : function(){
	       		if(categoryId==null){
	       			Ext.example.msg("提示","请先在左侧选择一个产品");
		    		return;
	       		}
	       			
	       		addPlan();
	       	}  	
	       },{
	       	text : '修改计划',
	       	width:90,
	       	id:'edit',
	       	handler : function(){
	       		var sm = productPlanGrid.getSelectionModel();
				var row = sm.getLastSelected();
				editPlanForm.getForm().loadRecord(row);
				win.setTitle("修改计划信息");
				URL = 'system/updatePersonMessage.action', 
				win.show();
	       	}  	
	       },{
	       	text : '删除计划',
	       	width:90,
	       	id:'removeEmployee',
	       	handler : function(){
	       		var sm = productPlanGrid.getSelectionModel();
				var row = sm.getLastSelected();
	       		deletePlan(row);
	       	}  	
	       },{
	       		text : '为计划流程选择材料',
	       		id:'processor',
	       		handler : function(){
		       		
	       			displayPanel = Ext.create('Ext.panel.Panel', {
						anchor : "100% 100%",
						layout : 'border',
						split : true,
						items : [processGrid, materialGrid ]
					});
					var win = Ext.create("Ext.window.Window", {
							layout : 'fit',
							closeAction : 'hide',
							width : 1010,
							height : 620,
							resizable : true,
							modal : true,
							items : [displayPanel],
							listeners : {
								"hide" : function() {
								}
							}
					}).show();
					var Proxy = new Ext.data.HttpProxy({
        				type: 'ajax',  
                        url: '../mater/findByProdId.action?product.categoryId='+categoryId,
                        reader : {
							type : 'json',
							root : 'children',
							totalProperty : 'total'
						}
        			});
                	materialStore.setProxy(Proxy);
                	materialStore.load();
					
				    var ProxyprocessorStore = new Ext.data.HttpProxy({
							type : 'ajax',
							url : '../processorInfo/findProInfoByProductCgId.action?productCgId='+categoryId,
							reader : {
								type : 'json',
								totalProperty : 'total'
							}
				        });
						processorStore.setProxy(ProxyprocessorStore);
						processorStore.load();
				}
	       }],
	       columns:[{
				header : '生产计划名ID',
				width : 120,
				dataIndex : 'productPlanId',
				sortable : true,
				hidden:true
			},{
				header : '生产计划名称',
				width : 120,
				dataIndex : 'productionPlanName',
				sortable : true
			},{
				header : '开始生产时间',
				width : 160,
				dataIndex : 'startTime',
				sortable : true,
				renderer:function (value) {
					if(value == null ||value == ""){
						return null;
					}else if (value instanceof Date) {
						return Ext.util.Format.date(new Date(value),'Y-m-d');
					} else {
						var t = value.substr(0,10);
						return t;
					}
				}
			},{
				header : '预计结束时间',
				width : 160,
				dataIndex : 'predictEndTime',
				sortable : true,
				renderer:function (value) {
					if(value == null ||value == ""){
						return null;
					}else if (value instanceof Date) {
						return Ext.util.Format.date(new Date(value),'Y-m-d');
					} else {
						var t = value.substr(0,10);
						return t;
					}
				}
			},{
				header : '实际结束时间',
				width : 160,
				dataIndex : 'actualEndTime',
				sortable : true,
				renderer:function (value) {
					if(value == null ||value == ""){
						return null;
					}else if (value instanceof Date) {
						return Ext.util.Format.date(new Date(value),'Y-m-d');
					} else {
						var t = value.substr(0,10);
						return t;
					}
				}
			},{
				header : '数量',
				width : 50,
				dataIndex : 'proNumber',
				sortable : true
			},{
				header : '计划描述',
//				width : 160,
				dataIndex : 'contents',
				sortable : true
			},{
				header : '产品ID',
//				width : 160,
				dataIndex : 'categoryId',
				sortable : true,
				hidden:true
			},{
				header : '产品名称',
//				width : 160,
				dataIndex : 'categoryName',
				sortable : true,
				hidden:true
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
	
	// 多选的话就禁掉编辑按钮
	productPlanGrid.down('#edit').disable();
	productPlanGrid.getSelectionModel().on({
				selectionchange : function(sm, selections) {
					if (selections.length == 1) {
						productPlanGrid.down('#edit').enable();
					} else {
						productPlanGrid.down('#edit').disable();
					}
				}
			});
	productPlanGrid.down('#processor').disable();
	productPlanGrid.getSelectionModel().on({
				selectionchange : function(sm, selections) {
					if (selections.length == 1) {
						productPlanGrid.down('#processor').enable();
					} else {
						productPlanGrid.down('#processor').disable();
					}
				}
			});
	productPlanGrid.down('#removeEmployee').disable();
	productPlanGrid.getSelectionModel().on({
				selectionchange : function(sm, selections) {
					if (selections.length == 1) {
						productPlanGrid.down('#removeEmployee').enable();
					} else {

						productPlanGrid.down('#removeEmployee').disable();
					}
				}
			});
	
	/**
	 * 流程
	 */
	Ext.define('processor', {
			extend : 'Ext.data.Model',
			fields : [
			"category.categoryId",
			"category.categoryName"
			]
		});	
		
		
		
	/**
	 * 材料
	 */
	Ext.define('materModel', {  
	    extend: 'Ext.data.Model',  
	    fields: [  
	    
	    	 {name: 'mater.materialId',type: 'string'},
	        {name: 'mater.materialCode',type: 'string'},
	        {name: 'mater.materialName',type: 'string'}
	    ]  
	}); 
	    
	var processorStore = Ext.create('Ext.data.Store', {
			model : 'processor',
			autoLoad : false,
			autoDestroy : true,
			pageSize : 80,
			proxy : {
				type : 'ajax',
				url : '../processorInfo/findProInfoByProductCgId.action?productCgId='+categoryId,
				root : 'list',
				reader : {
					type : 'json',
					totalProperty : 'total'
				}
			}
		});
	var materialStore = Ext.create('Ext.data.TreeStore', {  
        model: 'materModel',  
        proxy: {  
            type: 'ajax',  
            url: "../mater/findByProdId.action?product.categoryId="+categoryId,
            totalProperty : 'total'
        },  
        folderSort: true
    });	
		
	var processGrid = Ext.create('Ext.grid.Panel',{
			   store : processorStore,
		       autoScroll:true,
		        title:'流程',
		       width : '33%',
		       region : 'center',
		       columns:[{
					header : '流程ID',
					dataIndex : 'category.categoryId',
					sortable : true,
					hidden:true,
					width : 0
				},{
					header : '流程名称',
					width : '100%',
					dataIndex : 'category.categoryName',
					sortable : true
				}
		       ],
		       frame : true,
		       split : true,
		       listeners:{
					'cellclick':function(view,record,index){
			    		var sm = processGrid.getSelectionModel();
						var row = sm.getLastSelected();
						processorId=row.raw.category.categoryId;
						categoryName=row.raw.category.categoryName;
						materialGrid.setTitle(categoryName+"的材料");
						
						var URL = '../productionPlanMaterial/findMaterialByProductionPlanAndProcess.action?categoryName='+encodeURI(categoryName)+
			    		"&productPlanId="+productPlanId+"&categoryId="+categoryId;
						
			    		var proxy = new Ext.data.HttpProxy({
							type : 'ajax',	
							url : URL,
							reader : {
								type : 'json',
								root : 'children',
								totalProperty : 'total'
							}
						});
			    		materialStore.setProxy(proxy);
			    		materialStore.load();
			    		/**
			    		 * 給树选中值
			    		 */
			    		
					}
				}
		});
			/**
	 * @description 保存修改后的结果
	 *  
	 */
	function saveEdit() {
		
	
	}
	var materialGrid = Ext.create('Ext.tree.Panel',{
		    height: '100%',  
		    width:'70%',
		    region : 'east',
	        flex:2.5,
	        useArrows: true,  
	        rootVisible: false,
	        store: materialStore,  
	        multiSelect: true,  
	        tbar:[{
	        	text:'保存',
//	        	xtype:'button',
	        	handler:function(){
	        		var records = materialGrid.getView().getChecked();
					var indexs = [];
					Ext.Array.each(records, function(rec) {
								var data = rec.data;
								var index = new Object();
								index.materialId = data['mater.materialId'];
								index.materialCode = data['mater.materialCode'];
//								index.productionPlanMaterialId = data.get('');
								index.materialName = data['mater.materialName'];
								indexs.push(index);
					});
					var materialJson = {};
					materialJson.materials = indexs;
					materialJson.productPlanId=productPlanId;
					materialJson.processorId=processorId;
					var URL='../productionPlanMaterial/saveProductionProcessMaterial.action'
					if (indexs.length > 0) {
						Ext.Ajax.request({
							url : URL,
							method : 'POST',
							params : {
								materialJson : Ext.JSON.encode(materialJson)
							},
							success : function(extMessage) {
								var json = Ext.JSON.decode(extMessage.responseText);
								Ext.example.msg("信息", json.meassage);
								
							},
							failure : function(extJson) {
								var json = Ext.JSON.decode(extMessage.responseText);
								Ext.example.msg("信息", json.meassage);
							}
						});
					}else{
						Ext.example.msg("错误信息", "请选择材料");
					}
	        	}
	        }],
	        columns:[{
				text: '材料ID',  
	            tdCls : 'x-change-cell',
	            dataIndex: 'mater.materialId',
	            sortable: true ,
	            hidden:true
			},{
				xtype: 'treecolumn',   
	            text: '材料编号',  
	            tdCls : 'x-change-cell',
	            dataIndex: 'mater.materialCode' ,
	            sortable: true 
			},{  
	            text: '材料名称',  
	            tdCls : 'x-change-cell',
	            dataIndex: 'mater.materialName',  
	            sortable: true 
       		 }],
       		 
       		 listeners:{
	        	checkchange : function(node, checked, eOpts) {
	        		if (checked == true) {
						node.checked = checked;
						// 获得父节点
						pNode = node.parentNode;
						// 当checked == true通过循环将所有父节点选中
						for (; pNode != null; pNode = pNode.parentNode) {
							pNode.set("checked", true);
						}
					}
					// 当该节点有子节点时，将所有子节点选中
					if (!node.get("leaf") && !checked)
						node.cascade(function(node) {
							node.set('checked', false);
						});
				    }
        }
	});

      
	function addPlan(){
		var planForm = Ext.create('Ext.form.Panel', {
		layout : 'anchor',
		frame : true,
		anchor : "95%,90%",
		fieldDefaults : {
			labelAlign : 'left',// 把标签和文本框分行
			msgTarget : 'side'
		},
		items : [{
			xtype : 'fieldset',// 用一个圈包围起来
			anchor : "95%,90%",
			items : [ {
				xtype : 'container',
				anchor : '100%',
				layout : 'column',
				items:[{
					xtype : 'container',
					columnWidth : .5,
					layout : 'anchor',
					items:[{
						xtype : 'textfield',
						labelWidth : 85, // 标签与文本距离
						fieldLabel : '产品ID',
						name : 'categoryId',
						itemId : 'categoryId',
						value:categoryId,
						anchor : '80%',
						hidden : true
					},{
						xtype : 'textfield',
						labelWidth : 85, // 标签与文本距离
						fieldLabel : '产品名称',
						name : 'categoryName',
						itemId : 'categoryName',
						anchor : '80%',
						value:categoryName,
						readOnly : true
					}, {
						xtype : 'numberfield',
						labelWidth : 85, // 标签与文本距离
						fieldLabel : '生产数量',
						name : 'proNumber',
						itemId : 'proNumber',
						anchor : '80%'
					}, {
						xtype : 'datefield',
						labelWidth : 85, // 标签与文本距离
						fieldLabel : '预计结束时间',
						name : 'predictEndTime',
						format: 'Y-m-d',
//						value : Ext.Date.format(new Date(),'Y-m-d T H:i:s'),
						itemId : 'predictEndTime',
						anchor : '80%'
					}]
				},{
					xtype : 'container',
					columnWidth : .5,
					layout : 'anchor',
					items:[{
						name : 'productionPlanName',
						xtype : 'textfield',
						labelWidth : 85, // 标签与文本距离
						anchor : '80%',
						fieldLabel : '计划名称',// 标签内容
						dataIndex : 'productionPlanName',
						itemId : 'productionPlanName'
					}, {
						name : "startTime",
						labelWidth : 85, // 标签与文本距离
						anchor : '80%',
						xtype : 'datefield',
						fieldLabel : '开始生产时间',
						itemId : 'startTime',
//						value : Ext.Date.format(new Date(),'Y-m-d T H:i:s')
						format: 'Y-m-d'
					}, {
						xtype : 'datefield',
						fieldLabel : '实际结束时间',
						labelWidth : 85, // 标签与文本距离
						name : 'actualEndTime',
						anchor : '80%',
						itemId : 'actualEndTime',
//						value : Ext.Date.format(new Date(),'Y-m-d H:i:s')
						format: 'Y-m-d'
					}]
				}]
			}]
			
			},{
				xtype : 'fieldset',// 用一个圈包围起来
				anchor : "95%,90%",
				items : [ {
					xtype : 'textareafield',
					labelWidth : 85, // 标签与文本距离
					fieldLabel : '计划备注',
					name : 'contents',
					itemId : 'contents',
					width : 600,
					height:70
			}]
		},{
			xtype : 'fieldset',// 用一个圈包围起来
			anchor : "95%,90%",
			items : [ {
				xtype : 'button',
				text : '保存',
				handler :function(){
					var newRecord = planForm.getForm().getValues();
					var record = planForm.getForm().getRecord();
					var extParam = {};
					extParam.categoryId = newRecord.categoryId; //产品ID
					extParam.categoryName = newRecord.categoryName; //产品名称
					extParam.proNumber = newRecord.proNumber; // 生产数量
					extParam.predictEndTime = planForm.getForm().findField("predictEndTime").getValue(); //预计结束时间
					extParam.productionPlanName = newRecord.productionPlanName;//计划名称
					extParam.startTime = planForm.getForm().findField("startTime").getValue();  //开始生产时间
					extParam.actualEndTime = null;
					extParam.contents = newRecord.contents  //备注
					var extParamString = Ext.JSON.encode(extParam);
					Ext.Ajax.request({
							url : "../productionPlan/addProductPlan.action",
							params : {
								param : extParamString
							},
							success : function(extMessage) {
								var json = Ext.JSON.decode(extMessage.responseText);
								Ext.example.msg("添加生产计划", json.meassage);
								productPlanStore.load();
								planForm.getForm().reset();
								win.hide();
							}
					});
				}
			}, { 
				xtype : 'button',
				text : '取消',
				handler : cacel
			} ]
		}]
	});
		
		var win = Ext.create("Ext.window.Window", {
			layout : 'fit',
			closeAction : 'hide',
			width : 700,
			height : 320,
			resizable : true,
			modal : true,
			items : [planForm],
			listeners : {
				"hide" : function() {
					planForm.getForm().reset();
					/**
					 * 清空材料表数据
					 */
//					var Proxy = new Ext.data.HttpProxy({
//						type : 'ajax',
//						url :'../mater/findByProdId.action?product.categoryId='+null,
//						reader : {
//							type : 'json',
//							totalProperty : 'total'
//						}
//			        });
//					materstore.setProxy(Proxy);
//					materstore.load();
				}
			}
		});
		win.show()
	}
	
	
	var editPlanForm = Ext.create('Ext.form.Panel', {
		layout : 'anchor',
		frame : true,
		anchor : "95%,90%",
		fieldDefaults : {
			labelAlign : 'left',// 把标签和文本框分行
			msgTarget : 'side'
		},
		items : [{
			xtype : 'fieldset',// 用一个圈包围起来
			anchor : "95%,90%",
			items : [ {
				xtype : 'container',
				anchor : '100%',
				layout : 'column',
				items:[{
					xtype : 'container',
					columnWidth : .5,
					layout : 'anchor',
					items:[{
						xtype : 'textfield',
						labelWidth : 85, // 标签与文本距离
						fieldLabel : '计划ID',
						name : 'productPlanId',
						itemId : 'productPlanId',
						value:categoryId,
						anchor : '80%',
						readOnly : true
					}, {
						xtype : 'numberfield',
						labelWidth : 85, // 标签与文本距离
						fieldLabel : '生产数量',
						name : 'proNumber',
						itemId : 'proNumber',
						anchor : '80%'
					}, {
						xtype : 'datefield',
						labelWidth : 85, // 标签与文本距离
						fieldLabel : '预计结束时间',
						name : 'predictEndTime',
						format: 'Y-m-d', 
						itemId : 'predictEndTime',
						anchor : '80%'
					}]
				},{
					xtype : 'container',
					columnWidth : .5,
					layout : 'anchor',
					items:[{
						name : 'productionPlanName',
						xtype : 'textfield',
						labelWidth : 85, // 标签与文本距离
						anchor : '80%',
						fieldLabel : '计划名称',// 标签内容
						dataIndex : 'productionPlanName',
						itemId : 'productionPlanName'
					}, {
						name : "startTime",
						labelWidth : 85, // 标签与文本距离
						anchor : '80%',
						xtype : 'datefield',
						fieldLabel : '开始生产时间',
						itemId : 'startTime',
						format: 'Y-m-d'
					}, {
						xtype : 'datefield',
						fieldLabel : '实际结束时间',
						labelWidth : 85, // 标签与文本距离
						name : 'actualEndTime',
						anchor : '80%',
						format: 'Y-m-d', 
						itemId : 'actualEndTime'
					}]
				}]
			}]
			
			},{
				xtype : 'fieldset',// 用一个圈包围起来
				anchor : "95%,90%",
				items : [ {
					xtype : 'textareafield',
					labelWidth : 85, // 标签与文本距离
					fieldLabel : '计划备注',
					name : 'contents',
					itemId : 'contents',
					width : 600,
					height:70
			}]
		},{
			xtype : 'fieldset',// 用一个圈包围起来
			anchor : "95%,90%",
			items : [ {
				xtype : 'button',
				text : '保存',
				handler :function(){
					var newRecord = editPlanForm.getForm().getValues();
					var record = editPlanForm.getForm().getRecord();
					var extParam = {};
					extParam.productPlanId = newRecord.productPlanId; //计划ID
					extParam.proNumber = newRecord.proNumber; // 生产数量
					extParam.predictEndTime = editPlanForm.getForm().findField("predictEndTime").getValue(); //预计结束时间
					extParam.productionPlanName = newRecord.productionPlanName;//计划名称
					extParam.startTime = editPlanForm.getForm().findField("startTime").getValue();  //开始生产时间
					extParam.actualEndTime = editPlanForm.getForm().findField("actualEndTime").getValue(); //实际结束时间
					extParam.contents = newRecord.contents  //备注
					var extParamString = Ext.JSON.encode(extParam);
					Ext.Ajax.request({
							url : "../productionPlan/updateProductPlan.action",
							params : {
								param : extParamString
							},
							success : function(extMessage) {
								var json = Ext.JSON.decode(extMessage.responseText);
								Ext.example.msg("修改生产计划", json.meassage);
								productPlanStore.load();
								editPlanForm.getForm().reset();
								win.hide();
							}
					});
				}
			}, { 
				xtype : 'button',
				text : '取消',
				handler : cacel
			} ]
		}]
		
	});
		
	
	//修改计划
	var win = Ext.create("Ext.window.Window", {
			layout : 'fit',
			closeAction : 'hide',
			width : 700,
			height : 320,
			resizable : true,
			modal : true,
			items : [editPlanForm],
			listeners : {
				"hide" : function() {
					editPlanForm.getForm().reset();
				}
			}
		});
	
	function lookPlan(){
		
	}
	function deletePlan(row){
		Ext.Msg.confirm('确认删除','确认要删除吗？一旦删除将不可恢复！',
			function(button) {if (button == 'yes') {
				var test = row;
				Ext.Ajax.request({
						url : "../productionPlan/deleteProductionPlan.action?productionPlanId="+row.raw.productPlanId,
						success : function(extMessage) {
							var json = Ext.JSON.decode(extMessage.responseText);
							Ext.example.msg("删除生产计划", json.meassage);
							productPlanStore.load();
						}
				});
		   }
		})
		
	}
	
	function cacel(){
		win.close()
//		planForm.getForm().reset();
	}
	
	

	
	var showPanel = Ext.create('Ext.panel.Panel', {
				anchor : "100% 100%",
				width:600,
				height:400,
		        layout : 'border',
				split : true,
				autoScroll:true,
				items : [productGrid,productPlanGrid]
	});
	return showPanel;
	
 }