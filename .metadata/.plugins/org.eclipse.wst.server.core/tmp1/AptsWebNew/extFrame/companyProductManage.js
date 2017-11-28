var createCompanyProductManage = function(){

  var globalProductId = "";
  var globalProdImage = "";

	
  Ext.define('productCategory', {
				extend : 'Ext.data.Model',
				idProperty : 'categoryId',
				fields : [
				"categoryId",
				"categoryName",
				"imageUrl",
				"isPublish",
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
			},{
				header : '是否发布',
				width : 120,
				dataIndex : 'isPublish',
				sortable : true,
				renderer :function(value){
					if(value == "0"){
						return '否';
					}else{
						return '<font color="red">是</font>';
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
           	 text : '添加',
           	 itemId: 'add',
           	 handler : function(){
           	 	globalProdImage = "";
           	 	productInfoForm.down('#imageUrl').setSrc("");
           	 	productInfoForm.down("#categoryName").setValue("");
	            productInfoForm.down("#categoryDescription").setValue("");
	            productInfoForm.down("#addProduct").setDisabled(false);
	            productInfoForm.down("#editProduct").setDisabled(true);
	            productInfoForm.down("#categoryDescription").setReadOnly(false);
	            productInfoForm.down("#categoryName").setReadOnly(false);
	            productInfoWin.setTitle("添加产品");
           	 	productInfoWin.show();
           	 }
           },{
           	 xtype : 'button',
           	 text : '修改',
           	 itemId: 'edit',
           	 disabled:true,
           	 handler : function(){
           	 	var sm = productGrid.getSelectionModel();
           	 	var data = sm.getLastSelected();
           	 	globalProductId = data.get('categoryId');
           	 	productInfoForm.down("#categoryName").setValue(data.get('categoryName'));
	            productInfoForm.down("#categoryDescription").setValue(data.get('categoryDescription'));
	            productInfoForm.down('#imageUrl').setSrc("");
	            globalProdImage = data.get('imageUrl');
	            if(globalProdImage != null){
	            productInfoForm.down('#imageUrl').setSrc("http://localhost:8080/file/"+globalProdImage);
	            productInfoForm.show();
	            }
	            productInfoForm.down("#addProduct").setDisabled(true);
	            productInfoForm.down("#editProduct").setDisabled(false);
	            productInfoForm.down("#categoryDescription").setReadOnly(false);
	            productInfoForm.down("#categoryName").setReadOnly(false);
	            productInfoWin.setTitle("修改产品信息");
           	 	productInfoWin.show();

           	 }
           },{
           	 xtype : 'button',
           	 text : '查看',
           	 itemId: 'check',
           	 disabled:true,
           	 handler : function(){
           	 	var sm = productGrid.getSelectionModel();
           	 	var data = sm.getLastSelected();
           	 	globalProductId = data.get('categoryId');
           	 	productInfoForm.down("#categoryName").setValue(data.get('categoryName'));
	            productInfoForm.down("#categoryDescription").setValue(data.get('categoryDescription'));
	            productInfoForm.down('#imageUrl').setSrc("");
	            if(globalProdImage != null){
	            productInfoForm.down('#imageUrl').setSrc("http://localhost:8080/file/"+data.get('imageUrl'));
	            productInfoForm.show();
	            }
	            productInfoForm.down("#addProduct").setDisabled(true);
	            productInfoForm.down("#editProduct").setDisabled(true);
	            productInfoForm.down("#reset").setDisabled(true);
	            productInfoForm.down("#categoryDescription").setReadOnly(true);
	            productInfoForm.down("#categoryName").setReadOnly(true);
	            productInfoWin.setTitle("查看产品信息")
           	 	productInfoWin.show();

           	 }
           },{
           	 xtype : 'button',
           	 text : '选择/取消发布',
           	 itemId: 'publish',
           	 disabled:true,
           	 handler : function(){
           	 	publishProductCategory();
           	 }
           },
           	{
           	 xtype : 'button',
           	 text : '删除',
           	 itemId: 'delete',
           	 disabled:true,
           	 handler : function(){
           	 	    Ext.Msg.show({
							title : '提示',
							msg : '确定要刪除选中的产品？',
							buttonText : {
								yes : '确定',
								no : '取消'
							},
							buttons : Ext.Msg.YESNO,
							fn : function(btn) {
								if (btn == "yes") {
									deleteProduct();
								} else if (btn == "no") {
									return;
								}
							}
						});
           	 	
           	 }
           }
           ],
           listeners:
           {
           'select' : function(thisRowModel, record, index, eOpts ){
           	   globalProductId = record.get('categoryId');
           	   globalProdImage = record.get('imageUrl');
           },
           'selectionchange':function( thisGrid, selected, eOpts ){
            	if(selected.length > 0){
            		productGrid.down("#edit").setDisabled(false);
            		productGrid.down("#delete").setDisabled(false);
            		productGrid.down("#check").setDisabled(false);
            		productGrid.down("#publish").setDisabled(false);
            	}else{
            		productGrid.down("#edit").setDisabled(true);
            		productGrid.down("#delete").setDisabled(true);
            		productGrid.down("#check").setDisabled(true);
            		productGrid.down("#publish").setDisabled(true);
            	}
            	
            }
           }
	});
	

	
var productInfoForm = Ext.create("Ext.form.Panel",{
	frame : true,
	split : true,
	//disabled:true,
	minWidth : 120,
	autoScroll:true,
	minHeight: 400,
    margins : '0 0 0 0',   
	bodyPadding : 3,
	items : [
		{
            xtype:'textfield', 
            itemId:'categoryId',
            border:false,
            fieldLabel : "产品代码",
            hidden : true,
            width:350,
            name:'categoryId'
        },
        
        {
            xtype:'textfield', 
            itemId:'categoryName',
            border:false,
            fieldLabel : "名称",
            name:'categoryName', 
            width:350,
            allowBlank:false
        },
        
        {
            xtype:'textareafield', 
            itemId:'categoryDescription',
            border:false,
            fieldLabel : "产品信息",
            name:'categoryDescription', 
            width:400,
            allowBlank:false
        },
        {
        	xtype : 'panel',
        	loyout : 'column',
        	border : false,
        	items :[
        	{
            xtype:'label', 
            border:false,
            width:40,
            height:40,
            text : "产品图片:"
        	},{
            xtype:'image', 
            itemId:'imageUrl',
            border:false,
            height:160,
            width:160,
            html : '',
            src :'',
            name:'imageUrl'
        	},{
        		text:'上传图片',
                xtype:'button',
                handler : function() {
                	resourceType = "headImage";
                	uploadWin.show();
                	
                }
        	}
	    ]
        }
	],
	buttons :[
	      {
            xtype:'button', 
            itemId:'addProduct',
            border:false,
            text : "添加",
            width:70,           
            name:'addProduct',
            handler : function(){
            	if(this.up('form').getForm().isValid()){
            	addProduct();
            	}
            }
        },
         {
            xtype:'button', 
            itemId:'editProduct',
            border:false,
            text : "修改",
            width:70,          
            name:'editProduct',
            handler : function(){
            	if(this.up('form').getForm().isValid()){
            	editProduct();
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
            	this.up('form').getForm().reset();
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
            	productInfoWin.hide();
         }
        }]
})

  var uploadPanel=Ext.create('Ext.ux.uploadPanel.UploadPanel',{
            header: false,
            addFileBtnText : '选择文件...',
            uploadBtnText : '上传',
            removeBtnText : '移除所有',
            cancelBtnText : '取消上传',
            file_size_limit : 1000,//MB
            file_post_name: 'file',
            width : 750,//指定上传窗口的宽度
            height : 450,//指定上传窗口的高度
            //file_types: '*.jpg',
            //file_types_description: 'Image Files',
            flash_url : "../swfupload/swfupload.swf",//必须指定正确的路径
	        flash9_url : "../swfupload/swfupload_fp9.swf",         
	        post_params :{'resourceType':'prodImage'},
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
			data = Ext.JSON.decode(serverData);
			globalProdImage = data.fileName;
			productInfoForm.down('#imageUrl').setSrc("http://10.15.134.254:8080/file/"+globalProdImage);
			productInfoForm.down('#imageUrl').setHeight(160);
			productInfoForm.down('#imageUrl').setWidth(160);
			productInfoForm.doLayout();
			productInfoForm.show();
			uploadWin.hide();
		    },
	        upload_url : 'http://10.15.134.254:8080/AptsUpload/uploadImage.action'
     });
	
var addProduct = function(){
	//var row = ProcessorGrid.getSelectionModel().getLastSelected();
	var extParam = {};
	var extJsons = {};
	extJsons.categoryName = productInfoForm.down("#categoryName").getValue();
	extJsons.categoryDescription = productInfoForm.down("#categoryDescription").getValue();
	extJsons.imageUrl = globalProdImage;
	//extParam.param1 = row.data.categoryId
	extParam.extJsons = Ext.JSON.encode(extJsons);
	Ext.Ajax.request({
	url : "../productCategory/addProductCategoryToCompany.action",
    params:{
		extParam : Ext.JSON.encode(extParam)
	},
	method : "POST",
	success : function(extMessage){
		var json = Ext.JSON.decode(extMessage.responseText);
		if (json.successOrFalse == "success") {			
	     	Ext.example.msg("提示",json.meassage);
		    productStore.load();
		    productInfoWin.hide();
		}else if(json.successOrFalse == "false"){
			Ext.Msg.alert("提示",json.meassage);
		}
	}
		
	})
}; 

var editProduct = function(){
	var extJson = {};
	extJson.categoryId = globalProductId;
	extJson.categoryName = productInfoForm.down("#categoryName").getValue();
	extJson.categoryDescription = productInfoForm.down("#categoryDescription").getValue();
	extJson.imageUrl = globalProdImage;
	Ext.Ajax.request({
	url : "../productCategory/editProductCategory.action",
    params:{
		extJson : Ext.JSON.encode(extJson)
	},
	method : "POST",
	success : function(extMessage){
		var json = Ext.JSON.decode(extMessage.responseText);
		if (json.successOrFalse == "success") {
			Ext.example.msg("提示",json.meassage);
			productStore.load();
			productInfoWin.hide();
		}else if(json.successOrFalse == "false"){
			Ext.Msg.alert("提示",json.meassage);
		}
	}
		
	})
}; 



var deleteProduct = function(){
	var sm = productGrid.getSelectionModel()
	var rows = sm.getSelection();
	var categoryIds = "`";
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
	url : "../productCategory/deleteProductCategory.action",
    params:{
		extParam : Ext.JSON.encode(extParam)
	},
	method : "POST",
	success : function(extMessage){
		var json = Ext.JSON.decode(extMessage.responseText);
		successIds = json.successJsonList.split("`");
		productStore.load();
		for(i=0;i<(successIds.length-1);i++){
			if(productStore.getById(successIds[i]) != null){
			    Ext.example.msg("提示","刪除'"+productStore.getById(successIds[i]).get('categoryName')+"'成功！");
			}
		}
	}
		
	});
	}
}
var publishProductCategory = function(){
	var sm = productGrid.getSelectionModel()
	var rows = sm.getSelection();
	var categoryIds = "`";
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
	url : "../productCategory/publishProductCategory.action",
    params:{
		extParam : Ext.JSON.encode(extParam)
	},
	method : "POST",
	success : function(extMessage){
		var json = Ext.JSON.decode(extMessage.responseText);
		successIds = json.successJsonList.split("`");
		productStore.load();
		for(i=0;i<(successIds.length-1);i++){
			if(productStore.getById(successIds[i]) != null){
			    Ext.example.msg("提示","修改'"+productStore.getById(successIds[i]).get('categoryName')+"'发布状态成功！");
			}
		}
	}
		
	});
	}
}

var productInfoWin = Ext.create("Ext.Window",{
	       width : 600,
	       autoScroll:true,
	       layout : 'fit',
	       modal : true,
 	       closeAction:'hide',
           items : [productInfoForm]
    });

var uploadWin = Ext.create("Ext.Window",{
	       width : 600,
	       height: 200,
	       autoScroll:true,
	       layout : 'fit',
	       modal : true,
 	       closeAction:'hide',
           items : [uploadPanel]
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