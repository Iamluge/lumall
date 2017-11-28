/**
 * 流程类表
 * @return {}
 */
var createComapanyProcessorManageHome = function(createTabPanel){
/**
 * 把对应的一条权限记录查出来
 */
var sessionPower = {};
Ext.Ajax.request({
	url:'../sysPower/findPowerById.action?powerId=4028a89b45bcc3d10145bcc778e20002',
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
          		xtype :'button' ,
          		text :"转至流程管理页面",
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
				items : [
				processorGrid
				]
	});
	return showPanel;
}