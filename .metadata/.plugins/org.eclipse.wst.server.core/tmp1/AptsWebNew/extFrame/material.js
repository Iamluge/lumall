/**
 * 物料清单
 */
var material=function(){
	var mater={};
	var product={};
	product.prodId="";
	product.prodName="";
	mater.materId="";
	mater.materName="";
	mater.materCode="";
	mater.materNum="";
	mater.materSort="";
	mater.materStandard="";
	mater.materUnit="";
	mater.materCost="";
	mater.materContext="";
	
	Ext.define('materModel', {  
        extend: 'Ext.data.Model',  
        fields: [  
            {name: 'mater.materialId',type: 'string'},
            {name: 'mater.materialCode',type: 'string'}, 
            {name: 'mater.materialName',type: 'string'},
            {name: 'mater.materialNum',type: 'string'},
            {name: 'mater.materialSort',type: 'string'},
            {name: 'mater.materialStandard',type: 'string'},
            {name: 'mater.materialUnit',type: 'string'},
            {name: 'mater.materialCost',type: 'string'},
            {name: 'mater.materialContext',type: 'string'},
        ]  
    }); 
	Ext.define('productCategory', {
		extend : 'Ext.data.Model',
		fields : [
		"categoryId",
		"categoryName",
		"categoryDescription"
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
	var typeStore = Ext.create('Ext.data.Store', {
	    fields: ['type', 'name'],
	    data : [
	        {"type":"1", "name":"原材料"},
	        {"type":"2", "name":"半成品"},
	    ]
	});
	var materstore = Ext.create('Ext.data.TreeStore', {  
        model: 'materModel',  
        proxy: {  
            type: 'ajax',  
            url: "../mater/findByProdId.action?product.categoryId=null"  ,
            totalProperty : 'total'
        },  
        folderSort: true  ,
    });
	
	//商品表
	var productGrid = Ext.create('Ext.grid.Panel', {
		title : '商品列表',
		store : productStore,
		autoScroll : true,
		height : '100%',
		flex : 1,
		columns : [ {
			header : '产品代码',
			flex : 1,
			dataIndex : 'categoryId',
			hidden : true,
			sortable : true
		}, {
			header : '产品名称',
			flex : 1,
			dataIndex : 'categoryName',
			sortable : true
		}, {
			header : '详细描述',
			flex : 2,
			dataIndex : 'categoryDescription',
			sortable : true
		} ],
		listeners:{
			selectionchange: function(selModel, selected) {
            	var selectionModel = this.getSelectionModel();
        		var record = selectionModel.getSelection();
        		if(record!=null&&record!=""){
        			materGrid.down('#updateMater').setDisabled(true);
        			materGrid.down('#delMater').setDisabled(true);
        			mater.materId="";
        			mater.materCode="";
        			product.prodId=record[0].get('categoryId');
        			product.prodName=record[0].get('categoryName');
        		}
            },
            itemclick : function(grid, rowIndex, e){
            	var record=grid.getSelectionModel().getSelection();  
                if(record!=null&&record!=""){
                	var Proxy = new Ext.data.HttpProxy({
        				type: 'ajax',  
                        url: '../mater/findByProdId.action?product.categoryId='+record[0].get('categoryId'),
                        reader : {
							type : 'json',
							root : 'children',
							totalProperty : 'total'
						}
        			});
                	materstore.setProxy(Proxy);
                	materstore.load();
                }
            }
	
		}
	});
	
	//材料表
	var materGrid = Ext.create('Ext.tree.Panel', {  
        height: '100%',  
        flex:2.5,
        useArrows: true,  
        rootVisible: false,  
        store: materstore,  
        multiSelect: true,  
        singleExpand: true,
        columns: [{  
            text: '材料ID',  
            flex: 1,  
            tdCls : 'x-change-cell',
            dataIndex: 'mater.materialId' ,
            sortable: true ,
            hidden:true
        },{  
            xtype: 'treecolumn',   
            text: '材料编号',  
            flex: 3,  
            tdCls : 'x-change-cell',
            dataIndex: 'mater.materialCode' ,
            sortable: true 
        },{  
            text: '材料名称',  
            flex: 1,  
            tdCls : 'x-change-cell',
            dataIndex: 'mater.materialName',  
            sortable: true 
        },{  
            text: '构成上级材料比例',  
            flex: 2,  
            dataIndex: 'mater.materialNum', 
            tdCls : 'x-change-cell',
            sortable: true 
        },{
			header : '材料种类',
			dataIndex : 'mater.materialSort',
			flex:1,
			tdCls : 'x-change-cell',
			sortable: true ,
			renderer : function(value) {
				if(value=='1')
					return '<front style="color:red;">原材料</front>';
				else if(value=='2')
					return '<front style="color:green;">半成品</front>';
				else return '<front style="color:red;">数据出错</front>';
					
			},
		}, {
			header : '材料规格',
			dataIndex : 'mater.materialStandard',
			tdCls : 'x-change-cell',
			flex:1,
			sortable: true 
		}, {
			header : '计量单位',
			dataIndex : 'mater.materialUnit',
			tdCls : 'x-change-cell',
			flex:1,
			sortable: true 
		},{
			header : '材料单价',
			dataIndex : 'mater.materialCost',
			tdCls : 'x-change-cell',
			flex:1,
			sortable: true ,
			renderer : function(value) {
				return "￥              "+value+"   元"
					
			},
		}, {
			header : '备注',
			dataIndex : 'mater.materialContext',
			tdCls : 'x-change-cell',
			flex:2,
			sortable: true 
		}],
        tbar:[{
	    	xtype:'button',
	    	itemId:'addMap',
	        text:'为商品添加材料',
	        handler:function(){
	        	if(product.prodId!=""&&product.prodId!=null){
	        		addMap('为商品添加材料','商品编号','商品名称',product.prodId,product.prodName,'product.categoryId','../mater/addMater.action');
	        	}else Ext.Msg.alert('提示', '请选择一个商品');
	        }
        },'-',{
	    	xtype:'button',
	    	itemId:'addMater',
	        text:'添加下级材料',
	        handler:function(){
	        	if(mater.materCode!=""&&mater.materCode!=null){
	        		addMap('添加下级材料','上级材料编号','上级材料名称',mater.materCode,mater.materName,'material.materialMother','../mater/addMater.action');
	        	}else Ext.Msg.alert('提示', '请选择一个上级材料');
	        }
		},'-',{
	    	xtype:'button',
	    	itemId:'updateMater',
	        text:'修改材料信息',
	        handler:update,
	        disabled:true
		},'-',{
	    	xtype:'button',
	    	itemId:'delMater',
	        text:'删除材料',
	        disabled:true,
	        handler:del
		},'-',{
			xtype:'label',
	        text:'请选择商品,查询对应的物料',
	        style:{
	        	color:'red'
	        },
	        width:250,
		}],
        
        listeners:{
        	checkchange : function(node, checked, eOpts) {
//				if (checked == true) {
//					node.checked = checked;
//					// 获得父节点
//					pNode = node.parentNode;
//					// 当checked == true通过循环将所有父节点选中
//					for (; pNode != null; pNode = pNode.parentNode) {
//						pNode.set("checked", true);
//					}
//				}
        		if(!node.get("leaf") &&checked == true){
        			node.cascade(function(node) {
						node.set('checked', true);
						materGrid.down('#delMater').setDisabled(false);
					});
        		}
				// 当该节点有子节点时，将所有子节点选中
				if (!node.get("leaf") && !checked)
					node.cascade(function(node) {
						node.set('checked', false);
						materGrid.down('#delMater').setDisabled(true);
					});
			},
			selectionchange: function(selModel, selected) {
            	var selectionModel = this.getSelectionModel();
        		var record = selectionModel.getSelection();
        		if(record!=null&&record!=""){
        			materGrid.down('#updateMater').setDisabled(false);
        			mater.materCode=record[0].get('mater.materialCode');
        			mater.materName=record[0].get('mater.materialName');
        			mater.materId=record[0].get('mater.materialId');
        			mater.materNum=record[0].get('mater.materialNum');
        			mater.materSort=record[0].get('mater.materialSort');
        			mater.materStandard=record[0].get('mater.materialStandard');
        			mater.materUnit=record[0].get('mater.materialUnit');
        			mater.materCost=record[0].get('mater.materialCost');
        			mater.materContext=record[0].get('mater.materialContext');
        		}
            },
        }
	});
	//主页面
	var materPanel=Ext.create('Ext.panel.Panel', {
		width:'100%',
		height:'100%',
		layout:'hbox',
		items:[productGrid,materGrid],
		
	});
	
	/**
	 * 添加材料方法
	 */
	function addMap(type,id,name,idvalue,namevalue,property,url){
			var addMap=Ext.create('Ext.window.Window', {
				title: type,
	            height: 350,
	            width: 600,
	            modal:true,
	            layout: 'fit',
	            closeAction:'hide',
	            items:[{
	            	xtype:'form',
	            	layout:'column',
	            	height:'100%',
	            	itemId:'form,',
	            	url:url,
	            	items: [{
	            		xtype:'fieldset',
	            		columnWidth: 0.5,
	                    height:'100%',
	                    layout: 'anchor',
	                    items :[{
	                    	xtype:'textfield',
	                    	anchor: '100%',
	                        fieldLabel: '<front style="color:red;">材料编号<front/>',
	                        allowBlank: false,
	                        name: 'material.materialCode'
	                    }, {
	                    	xtype:'textfield',
	                        fieldLabel: '材料名称',
	                        anchor: '100%',
	                        allowBlank: false,
	                        name: 'material.materialName'
	                    },{
	                    	xtype:'numberfield',
	                        fieldLabel: '材料成本',
	                        items:'purchasePrice',
	                        allowBlank: false,
	                        anchor: '100%',
	                        maxValue: 999,
	           		     	minValue: 0,
	           		     	disabled:true,
	                        name: 'material.materialCost'
	                    },{
	                    	xtype:'numberfield',
	                        fieldLabel: '构成上级材料的比例',
	                        allowBlank: false,
	                        maxValue: 99,
	           		     	minValue: 0,
	           		     	step:0.1,
	                        anchor: '100%',
	                        name: 'material.materialNum'
	                    },{
	                    	xtype:'textfield',
	                        fieldLabel: '材料规格',
	                        anchor: '100%',
	                        name: 'material.materialStandard'
	                    }]
	                },{
	                	xtype:'fieldset',
	                	height:'100%',
	                	columnWidth: 0.5,
	                    layout: 'anchor',
	                    items :[{
	                    	xtype:'textfield',
	                    	anchor: '100%',
	                        fieldLabel: '<front style="color:red;">'+id+'<front/>',
	                        value:idvalue,
	                        allowBlank: false,
	                        hidden:true,
	                        name: property
	                    }, {
	                    	xtype:'textfield',
	                    	anchor: '100%',
	                        fieldLabel: name,
	                        value:namevalue,
	                        allowBlank: false,
	                    }, {
	                    	xtype:'combobox',
	                        fieldLabel: '材料种类',
	                        anchor: '100%',
	                        allowBlank: false,
	                        store:typeStore,
	                        displayField: 'name',
	                        valueField: 'type',
	                        name: 'material.materialSort',
	                        listeners: {
	                            select : function(combo, records, eOpts){
	            	                var categoryId = records[0].get('type');
	                            	if(categoryId=='1'){
	                            		this.up('form').getForm().findField('material.materialCost').setDisabled(false);
	                            	}else {
	                            		this.up('form').getForm().findField('material.materialCost').setDisabled(true);
	                            	}
	                            }
	                        }
	                    },{
	                    	xtype:'textfield',
	                        fieldLabel: '计量单位',
	                        anchor: '100%',
	                        allowBlank: false,
	                        name: 'material.materialUnit'
	                    },{
	                    	xtype:'textfield',
	                        fieldLabel: '备注',
	                        anchor: '100%',
	                        name: 'material.materialContext'
	                    }]
	                }],
	                buttons: [{
	                    text: '保存',
	                    formBind: true, //only enabled once the form is valid
	                    disabled: true,
	                    handler: function() {
	                        var form = this.up('form').getForm();
	                        if (form.isValid()) {
	                        	 form.submit({
	                        		 success: function(form, action) {
	                        			 Ext.Msg.alert('提示', action.result.meassage);
		                            	 addMap.close();
		                            	 productStore.load();
		                            	 materstore.load();
		                               },
		                               failure: function(form, action) {
		                            	 Ext.Msg.alert('提示', action.result.meassage);
		                            	 addMap.close();
		                            	 productStore.load();
		                            	 materstore.load();
		                               }
	                        	 });
	                        }
	                    }
	                },{
	                    text: '重置',
	                    handler: function() {
	                        this.up('form').getForm().reset();
	                    }
	                }],
	            
	            }]
			});
			addMap.show();
	}
	
	function isdisable(){
    	if(mater.materSort=='1'){
	     	return false;
	    }else return true;
	}
	/**
	 * 修改信息
	 */
	function update(){
		var updateMap=Ext.create('Ext.window.Window', {
			title: '修改材料信息',
            height: 350,
            width: 600,
            modal:true,
            layout: 'fit',
            closeAction:'hide',
            items:[{
            	xtype:'form',
            	layout:'column',
            	height:'100%',
            	itemId:'form,',
            	items: [{
            		xtype:'fieldset',
            		columnWidth: 0.5,
                    height:'100%',
                    layout: 'anchor',
                    items :[{
                    	xtype:'textfield',
                    	anchor: '100%',
                        fieldLabel: '<front style="color:red;">材料ID<front/>',
                        allowBlank: false,
                        name: 'material.materialId',
                        disabled:true,
                        value:mater.materId
                    },{
                    	xtype:'textfield',
                    	anchor: '100%',
                        fieldLabel: '<front style="color:red;">材料名称<front/>',
                        allowBlank: false,
                        name: 'material.materialName',
                        value:mater.materName
                    },{
                    	xtype:'numberfield',
                        fieldLabel: '材料成本',
                        items:'purchasePrice',
                        allowBlank: false,
                        anchor: '100%',
                        maxValue: 999,
           		     	minValue: 0,
           		     	disabled:isdisable(),
                        name: 'material.materialCost',
                        value:mater.materCost
                    },{
                    	xtype:'numberfield',
                        fieldLabel: '构成上级材料的比例',
                        allowBlank: false,
                        maxValue: 999,
           		     	minValue: 0,
           		     	step:0.1,
                        anchor: '100%',
                        name: 'material.materialNum',
                        value:mater.materNum
                    },{
                    	xtype:'textfield',
                        fieldLabel: '材料规格',
                        anchor: '100%',
                        name: 'material.materialStandard',
                        value:mater.materStandard
                    }]
                },{
                	xtype:'fieldset',
                	height:'100%',
                	columnWidth: 0.5,
                    layout: 'anchor',
                    items :[{
                    	xtype:'textfield',
                    	anchor: '100%',
                        fieldLabel: '<front style="color:red;">材料编号<front/>',
                        allowBlank: false,
                        name: 'material.materialCode',
                        disabled:true,
                        value:mater.materCode
                    }, {
                    	xtype:'combobox',
                        fieldLabel: '材料种类',
                        anchor: '100%',
                        allowBlank: false,
                        store:typeStore,
                        displayField: 'name',
                        valueField: 'type',
                        name: 'material.materialSort',
                        value:mater.materSort,
                        listeners: {
                            select : function(combo, records, eOpts){
            	                var categoryId = records[0].get('type');
                            	if(categoryId=='1'){
                            		this.up('form').getForm().findField('material.materialCost').setDisabled(false);
                            	}else {
                            		this.up('form').getForm().findField('material.materialCost').setDisabled(true);
                            	}
                            }
                        }
                    },{
                    	xtype:'textfield',
                        fieldLabel: '计量单位',
                        anchor: '100%',
                        allowBlank: false,
                        name: 'material.materialUnit',
                        value:mater.materUnit
                    },{
                    	xtype:'textfield',
                        fieldLabel: '备注',
                        anchor: '100%',
                        name: 'material.materialContext',
                        value:mater.materContext
                    }]
                }],
                buttons: [{
                    text: '保存',
                    formBind: true, //only enabled once the form is valid
                    disabled: true,
                    handler: function() {
                        var form = this.up('form').getForm();
                        var material={};
                        material.materialId=form.findField('material.materialId').getValue();
                        material.materialName=form.findField('material.materialName').getValue();
                        material.materialCode=form.findField('material.materialCode').getValue();
                        material.materialNum=form.findField('material.materialNum').getValue();
                        material.materialSort=form.findField('material.materialSort').getValue();
                        material.materialStandard=form.findField('material.materialStandard').getValue();
                        material.materialUnit=form.findField('material.materialUnit').getValue();
                        material.materialCost=form.findField('material.materialCost').getValue();
                        material.materialContext=form.findField('material.materialContext').getValue();
                        if (form.isValid()) {
                        	Ext.Ajax.request({
            					url : '../mater/updateMater.action',
            					method : 'POST',
            					params:{
            						'param':Ext.JSON.encode(material)
            					},
            					success : function(status) {
            						Ext.Msg.alert('提示', Ext.JSON.decode(status.responseText).meassage);
            						updateMap.close();
            						productStore.load();
	                            	materstore.load();
            					}
                        	});
                       }
                    }
                },{
                    text: '重置',
                    handler: function() {
                        this.up('form').getForm().reset();
                    }
                }],
            
            }]
		});
		updateMap.show();
	}
	/**
	 * 删除材料
	 */
	function del(){
		var records=materGrid.getView().getChecked();
		var maters = [];
		var materJson = {};
		Ext.Array.each(records, function(rec) {
			var data = rec.getData();
			var material = new Object();
			material.materialId = data['mater.materialId'];
			maters.push(material);
		});
		materJson.maters = maters;
		materJson.prodId=product.prodId;
		if(materJson.maters.length > 0){
			Ext.MessageBox.confirm('警告','你确定要删除该材料?',function(btn){
				if(btn=="yes"){
	                Ext.Ajax.request({
	  					url : '../mater/delMater.action',
	  					method : 'POST',
	  					params:{
	  						param:Ext.JSON.encode(materJson)
	  					},
	  					success : function(status) {
	  						Ext.example.msg("提示", Ext.JSON.decode(status.responseText).meassage);
	  						materstore.load();
	  					},
	  				});
				}
            });
		}
	}
	return materPanel;
};