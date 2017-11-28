/**
 * 原料采购
 */
var materialPurchase=function(){
	var record_start = 0;
	var productId="";
	Ext.define('materGridModel', {
        extend: 'Ext.data.Model',
        fields: [
//         		 {name:'productionPlanMaterialXUHAO',type:'string'},
                 {name:'productionPlanMaterialId',type:'string'},
                 {name:'materialCode',type:'string'},
                 {name:'materialName',type:'string'},
                 {name:'materialCost',type:'string'},
                 {name:'materialNum',type:'string'},
                 {name:'materialUnit',type:'string'}
        ]
    });
    
    var materGridStore=Ext.create('Ext.data.Store', {
		model : 'materGridModel',
		autoLoad : false,
		autoDestroy : true,
		pageSize : 80,
	    proxy: {
	        type: 'ajax',
	        url:'',
	        reader: {
	        	root: 'list',
	            type: 'json',
	            totalProperty :'total'   
	        }
	
	    },
		sorters : [ {               
			property : 'materialCode',
			direction : 'ASC'
		} ]
	});
    /**
	 * 生产计划
	 */
 	Ext.define('productPlan', {
		extend : 'Ext.data.Model',
		fields : [
			"productPlanId",       //计划ID
			"productionPlanName", //计划名称
			"startTime",          //开始生产时间
			"predictEndTime",     //预计结束时间
			"actualEndTime",      // 实际结束时间
			"proNumber",          //数量
			"contents"            //计划描述
		]
	});	
 	var productPlanStore = Ext.create('Ext.data.Store', {
		model : 'productPlan',
		autoLoad : true,
		autoDestroy : true,
		pageSize : 80,
		proxy : {
			type : 'ajax',
			url : '../productionPlan/findproPlanByCompany.action',
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
 	var dockedItems=[{
		xtype : 'toolbar',
		dock : 'top',
		layout:'absolute',
		height : 50,
		items : [{
	    	xtype:'button',
	    	x:10,
			y:15,
	    	itemId:'print',
	        text:'打印',
	        handler:function(){
	        	Ext.ux.grid.Printer.print(materGrid);
	        }
		},{
			x:60,
			y:3,
			xtype: 'exporterbutton',
			component :materGrid,
			downloadName: "用料报表",
			downloadImage : '../extexcel/download.png',
			swfPath : '../extexcel/downloadify.swf',
			text: "导出 Excel"
		},{
			xtype:'label',
			x:130,
			y:15,
		    text:'请选择生产计划,查询需要采购的材料',
		    style:{
		        color:'red'
		    },
		    width:250
		}]
	}];
	var materGrid = Ext.create('Ext.grid.Panel', {
		multiSelect :true,
		title:'用料列表',
		flex:1,
		height:'100%',
		dockedItems : dockedItems,
		store:materGridStore,
		columns : [
		new Ext.grid.RowNumberer({   
			header : "序号",   
			flex:0.5,
			renderer: function (value, metadata, record, rowIndex) {
				return 1 + rowIndex;
			} 
		}),{
			header : '序号',
			flex:0.5,
            renderer:function(value,metadata,record,rowIndex){
            	return record_start + 1 + rowIndex;
	        }
		},{
			header : '材料计划ID',
			dataIndex : 'productionPlanMaterialId',
			flex:1,
			hidden:true
		},{
			header : '材料编号',
			dataIndex : 'materialCode',
			flex:1
		}, {
			header : '材料名称',
			dataIndex : 'materialName',
			flex:1
			
		},{
			header : '采购数量',
			dataIndex : 'materialNum',
			flex:1
			
		},{
			header : '计量单位',
			dataIndex : 'materialUnit',
			flex:1
			
		},{
			header : '材料总成本',
			dataIndex : 'materialCost',
			flex:1,
			renderer : function(value) {
				return "￥              "+value+"   元"
					
			}
		}]
		
	});

	var productPlanGrid = Ext.create('Ext.grid.Panel',{
		title:'生产计划列表',
		store : productPlanStore,
	       multiSelect :true,
	       autoScroll:true,
	       height : '100%',
	       flex:1,
	       columns:[{
				header : '生产计划ID',
				flex:1,
				dataIndex : 'productPlanId',
				sortable : true,
				hidden:true
			},{
				header : '生产计划名称',
				flex:1,
				dataIndex : 'productionPlanName',
				sortable : true
			},{
				header : '开始时间',
				flex:1,
				dataIndex : 'startTime',
				sortable : true
			},{
				header : '预计结束时间',
				flex:1,
				dataIndex : 'predictEndTime',
				sortable : true,
			},{
				header : '结束时间',
				flex:1,
				dataIndex : 'actualEndTime',
				sortable : true,
				hidden:true
			},{
				header : '数量',
				flex:1,
				dataIndex : 'proNumber',
				sortable : true
			},{
				header : '计划描述',
				flex:2,
				dataIndex : 'contents',
				sortable : true,
				hidden:true
			}
	       ],
	       frame : true,
	       selType : 'checkboxmodel',
	       split : true,
	       minWidth : 120,
	       veiwConfig :{
	    	   stripeRows : true
	       },
	       listeners:{
	    	   itemclick : function(grid, rowIndex, e){
	            	var record=grid.getSelectionModel().getSelection();  
	                if(record!=null&&record!=""){
	                	var Proxy = new Ext.data.HttpProxy({
	        				type: 'ajax',  
	                        url: '../prodPlanMater/findPlanMater.action?extParam.param1='+record[0].get('productPlanId'),
	                        reader : {
								type : 'json',
								root : 'list',
								totalProperty : 'total'
							}
	        			});
	                	materGridStore.setProxy(Proxy);
	                	materGridStore.load();
	                }
	            }
	       }
       
	});
	var materSetPanel=Ext.create('Ext.panel.Panel', {
		width:'100%',
		height:'100%',
		layout:'hbox',
		items:[productPlanGrid,materGrid],
		
	});
	
	return materSetPanel;
};