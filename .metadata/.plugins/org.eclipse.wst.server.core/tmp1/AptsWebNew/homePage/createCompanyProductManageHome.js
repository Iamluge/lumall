var createCompanyProductManageHome = function(trueOrFalse,createTabPanel){
	var trueOrFalse = trueOrFalse;
/**
 * 把对应的一条权限记录查出来
 */
var sessionPower = {};
Ext.Ajax.request({
	url:'../sysPower/findPowerById.action?powerId=4028a89b45bcc3d10145bcc7e9eb0003',
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
 
  var globalProductId = "";
  Ext.define('productCategory', {
				extend : 'Ext.data.Model',
				idProperty : 'categoryId',
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
	
	
	var productGrid = Ext.create('Ext.grid.Panel',{
		   store : productStore,
	       multiSelect :true,
	       title:"产品列表",
	       autoScroll:true,
	       border:false,
	       width : '70%',
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
           tbar:[{
           		
          		xtype :'button' ,
          		text :"转至产品管理页面",
          		disabled:trueOrFalse,
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
				items : [productGrid]
	});
	return showPanel;
}

