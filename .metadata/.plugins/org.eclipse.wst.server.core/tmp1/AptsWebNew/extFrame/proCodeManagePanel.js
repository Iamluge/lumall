var createProCodeManagePanel = function(){
	
	var globalCount = 1;
	var globalTemplateKeys= [];
	var globalSelectCodeCount = 0;
		
	 Ext.define('proCodeTemplate', {
				extend : 'Ext.data.Model',
				idProperty : "id",
				fields : [
				"id",
				"templateKey",
				"templateName"
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
	
	var proCodeTemplateStore = Ext.create('Ext.data.Store', {
		model : 'proCodeTemplate',
		autoLoad : true,
		autoDestroy : true,
		pageSize : 80,
		proxy : {
			type : 'ajax',
			url : "../createCode/findCodeTemplateByCompanyId.action",	
			reader : {
				type : 'json',
				root : 'list',
				totalProperty : 'total'
			}
		},
		sorters : [
			{
				property : 'id',
				direction : 'ASC'
			}
		]
	});	
	
	
   var ImageStore = Ext.create('Ext.data.Store', {
		autoLoad : false,
		autoDestroy : true,
		pageSize : 80,
		fields:[
		"imagePath",
		"code"
		],
		proxy : {
			type : 'ajax',
			url : '../createCode/getCodeImages.action',
			root : 'list',
			reader : {
				type : 'json',
				totalProperty : 'total'
			}
		},
		sorters : [
			{
				property : 'code',
				direction : 'ASC'
			}
		]
	});
	
   var proCodeShowGrid = Ext.create('Ext.grid.Panel',{
		   store : ImageStore,
	       multiSelect :true,
	       autoScroll:true,
	       columnLines: true,
	       region : 'center',
	       selType :'checkboxmodel',
	       columns:[
	       {
				header : '二维码',
				width : 140,
				dataIndex : 'code',
				sortable : true
	       },{
				header : '图片',
				width : 161,
				dataIndex : 'imagePath',
				sortable : true,
				renderer : function(value) {
					if(value != ""){
						return '<img src="../file/codePic/'+value+'" width ="150" height="150"/>' 
					}
				}
	       }],
	       tbar :[
	       {
	       	text : '导出二维码',
	       	width:90,
	       	handler : function(){
	       		downloadSelectTDCode();
	       	}  	
	       },
	       {
	        text : '刷新',
	       	width:50,
	       	handler : function(){
	       	  var searchProxy = new Ext.data.HttpProxy(
					{
						type : 'ajax',
						url : '../createCode/getCodeImages.action',
						reader : {
							type : 'json',
							root : 'list',
							totalProperty : 'total'
						}
					});
			  ImageStore.setProxy(searchProxy);
			  ImageStore.load();
	       	}
	       },
	       	{
	       	xtype : 'numberfield',
	       	emptyText:'请输入要导出的二维码数量',
	       	itemId : 'codeCount',
	       	minValue:0,
	       	border:false,
	       	width :130,
	       	minValue :0,
	       	handler : function(){
	       		
	       	}
	       },
	       {
           	xtype : 'label',
           	text : '已选的数量:'
           },{
           	xtype : 'label',
           	itemId : 'selectCodeCount',
           	text : '0'
           }  
	       ],
	       listeners:{
	       	 'selectionchange' : function( thisCom, selected, eOpts ){
	       	 	var sm = proCodeShowGrid.getSelectionModel();
	       	 	globalSelectCodeCount = sm.getCount();
	       	 	proCodeShowGrid.down('#selectCodeCount').setText(globalSelectCodeCount);
	       	 	proCodeShowGrid.show();
	       	 }
	       }
	})
	
	
	var proCodeTemplateGrid = Ext.create('Ext.grid.Panel',{
		   store : proCodeTemplateStore,
	       multiSelect :true,
	       autoScroll:true,
	       columnLines: true,
	       title:'二维码模板列表',
	       region : 'center',
	       selType :'checkboxmodel',
	       columns:[{
				header : 'id',
				width : 120,
				dataIndex : 'id',
				sortable : true,
				hidden : true
	       },{
				header : '模板名称',
				width : 120,
				dataIndex : 'templateName',
				sortable : true
	       },{
				header : '模板信息',
				width : 120,
				dataIndex : 'templateKey',
				sortable : true
	       }
	       ],
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
            itemId:'add',
            border:false,
            text : "添加模板",
            width:70,          
            name:'add',
            handler : function(){
            	checkIndexForm.down("#checkIndex").removeAll();
            	checkIndexForm.show();
            	componentWin.show();
         }
         },{
            xtype:'button', 
            itemId:'check',
            border:false,
            disabled : true,
            text : "查看模板",
            width:70,          
            name:'check',
            handler : function(){
            checkIndexForm.down("#checkIndex").removeAll();
            var sm = proCodeTemplateGrid.getSelectionModel();
            var data = sm.getLastSelected();
            var templateKey = data.get('templateKey');
            var keys = [];
            keys = templateKey.split("`");
            checkIndexForm.down("#checkIndex").add({
					border :false,
					items:[{
					     border :false,
				         items : [ {
                           xtype:'textfield', 
                           itemId:'templateName',
                           border:false,
                           fieldLabel : "模板名称",
                           width:350,
                           readOnly:true,
                           name:'templateName'
				    }
                    ]
				}]});
            checkIndexForm.down("#templateName").setValue(data.get('templateName'));
            for(i=0;i<keys.length;i++){
            checkIndexForm.down("#checkIndex").add({
					border :false,
					items:[{
					       border :false,
				           items : [ {
		                   xtype:'textfield', 
                           itemId:'index'+i,
                           border : false,
                           readOnly:true,
                           value :keys[i],
                           width:350,
                           fieldLabel : "字段"+i
				           }
                           ]
				}]});
            }
            checkIndexForm.show();
            componentWin2.show();
         }
         
         },{
            xtype:'button', 
            itemId:'delete',
            border:false,
            text : "删除模板",
            disabled : true,
            width:70,          
            name:'delete',
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
									deleteCodeTDTemplate();
								} else if (btn == "no") {
									return;
								}
							}
						});
            	
         }
         }          
         ],
        listeners:{
		'selectionchange':function( thisGrid, selected, eOpts ){
			if(selected.length >  0){
				proCodeTemplateGrid.down("#check").setDisabled(false);
				proCodeTemplateGrid.down("#delete").setDisabled(false);
			}else{
				proCodeTemplateGrid.down("#check").setDisabled(true);
				proCodeTemplateGrid.down("#delete").setDisabled(true);
			}
		}
        }
		});

	var productGrid = Ext.create('Ext.grid.Panel',{
		   store : productStore,
	       multiSelect :true,
	       autoScroll:true,
	       title:"产品列表",
	       border:false,
	       width : '50%',
	       region : 'west',
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
           	 text : '生成二维码',
           	 handler : function(){
           	 	var sm = productGrid.getSelectionModel();
	            var row = sm.getLastSelected();
	            if(row == null){
	            	return;
	            }
			    createCodeForm.down("#productName").setValue(row.get('categoryName'));
			    createCodeFormWin.show();
           	 }
           	 }
           ],
           listeners:[
           {
           'select' : function(thisRowModel, record, index, eOpts ){
           	  
           }
           }
           ]
	});
		
		
var checkIndexForm=Ext.create("Ext.form.Panel",{
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
			itemId:'checkIndex',
			collapsible: true,
			align : 'center',
			title : '模板信息',
			items : []
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
			title : '设置模板',
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
        	border:false,
        	items:[{
            xtype:'textfield', 
            itemId:'index1',
            border:false,
            width:350,
            fieldLabel : "字段1",
            name:'index1'
        	}
        	]
        }
	    ]}
	],
	buttons :[
	{text:"更多信息",formBind:true,
			handler:function()
			{
				globalCount++;
				settingIndexForm.down("#settingIndex").add({
					border :false,
					items:[{
					       border :false,
				           items : [ {
		                   xtype:'textfield', 
                           itemId:'index'+globalCount,
                           border : false,
                           width:350,
                           value : "",
                           fieldLabel : "字段"+globalCount
				           }
                           ]
				}]});
				settingIndexForm.show();

			}
	},
	{
		text:"提交",formBind:true,handler:function(){
			settingIndexToTemplate();
		}
	},
	{
		text:"重置",formBind:true,handler:function(){
			this.up('form').getForm().reset();
		}
	}
	]
});	
	

var TDCodeTypeStore = Ext.create("Ext.data.Store",{
		proxy : {
			type : 'memory',		
			reader : {
				type : 'json'
			}
		},
	    fields:["id","value"],
        data:[{id:"0",value :"普通二维码"},{id:"1",value : "溯源二维码"}]
	}) 

var createCodeForm = Ext.create("Ext.form.Panel",{
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
			title : '设置信息',
			items : [
		{
            xtype:'textfield', 
            itemId:'productName',
            border:false,
            disabled : true,
            fieldLabel : "产品名称",
            width:350,
            name:'productName'
        },
        {
        	xtype :'combobox',
           	itemId:'TDCodeTypeCombo',
            border:false,
            width:350,
            fieldLabel:"二维码类型",
            store : TDCodeTypeStore,
			valueField : 'id',
			displayField : 'value',
			emptyText : '请选择二维码类型..',
            editable:false,
            listeners:{
            	select : function(combo, records, eOpts){
            		globalTemplateKeys = [];
            		createCodeForm.down('#templateCombo').setDisabled(false);
            		createCodeForm.down('#templateCombo').setValue("");
            		createCodeForm.down("#templateInfo").removeAll();
            	}
            }
        },
        {
            xtype :'combobox',
           	itemId:'templateCombo',
            border:false,
            width:350,
            fieldLabel:"使用模板",
            store : proCodeTemplateStore,
			valueField : 'id',
			disabled : false,
			displayField : 'templateName',
			emptyText : '请选择模板..',
            editable:false,
            name:'templateCombo',
            listeners: {
            select : function(combo, records, eOpts){
            createCodeForm.down("#templateInfo").removeAll();
	        var templateKey = records[0].get('templateKey');
	        globalTemplateKeys = [];
            globalTemplateKeys = templateKey.split("`");
            for(i=0;i<globalTemplateKeys.length;i++){
            createCodeForm.down("#templateInfo").add({
					border :false,
					items:[{
					       border :false,
				           items : [ {
		                   xtype:'textfield', 
                           itemId:'index'+i,
                           border : false,
                           value : "",
                           width:350,
                           fieldLabel : globalTemplateKeys[i]
				           }
                           ]
				}]});
            }
            createCodeForm.show();
            }
            }
        },
		{
            xtype:'numberfield', 
            itemId:'codeCount',
            border:false,
            minValue:1,
            fieldLabel : "数量",
            allowBlank: false,
            width:350,
            name:'codeCount'
        }/*,
		{
            xtype:'textfield', 
            itemId:'codeRoot',
            border:false,
            fieldLabel : "存放路径",
            width:350,
            name:'codeRoot'
        }*/,{
		    xtype : 'fieldset',
			itemId:'templateInfo',
			collapsible: true,
			align : 'center',
			title : '模板信息'
		}
	]
	}
	],
        buttons :[{
         xtype: 'button',
         text : '确定生成',
         handler :function(){
         	createTDCode();
         }
         },{
         xtype: 'button',
         text : '取消',
         handler :function(){
         	createCodeFormWin.hide();
         }
         }
         
         ]
 });


var settingIndexToTemplate = function(){
    var indexs = "";
    for(i=1;i<globalCount+1;i++){
    	if(settingIndexForm.down("#index"+i).getValue()!=null && settingIndexForm.down("#index"+i).getValue() != ""){
    	if(i == (globalCount)){
    		indexs = indexs+settingIndexForm.down("#index"+i).getValue();
    	}else{
    		indexs = indexs+settingIndexForm.down("#index"+i).getValue()+"`";
    	}
    	}
    }
    templateKey = indexs;
    templateName = settingIndexForm.down("#templateName").getValue();
	Ext.Ajax.request({
	url : "../createCode/createTDCodeTem.action",
    params:{
		templateKey : templateKey,
		templateName : templateName
	},
	method : "POST",
	success : function(extMessage){
		var json = Ext.JSON.decode(extMessage.responseText);
		if (json.successOrFalse == "success") {
			Ext.example.msg("提示",json.meassage);
		    componentWin.hide();
		    proCodeTemplateStore.load();
		}else if(json.successOrFalse == "false"){
			Ext.Msg.alert("提示",json.meassage);
		}
	}
		
	});
}

var deleteCodeTDTemplate = function(){
	var sm = proCodeTemplateGrid.getSelectionModel();
	var datas = sm.getSelection();
	var templateIds = ""
	var extParam = {};
	if(datas.length > 0){
	for(i=0;i<datas.length;i++){
		if(i == (datas.length-1)){
			templateIds = templateIds + datas[i].get('id')
		}else{
			templateIds = templateIds + datas[i].get('id') + "`"
		}
	}
	extParam.extJsonList = templateIds;
	Ext.Ajax.request({
	         url : "../createCode/deleteTDCodeTem.action",
             params:{
             	extParam :Ext.JSON.encode(extParam)
	         },
	         method : "POST",
	         success : function(extMessage){
	         	var json = Ext.JSON.decode(extMessage.responseText);
		        successIds = json.successJsonList.split("`");
		        proCodeTemplateStore.load();
		        for (i = 0; i < (successIds.length - 1); i++) {
						if (proCodeTemplateStore.getById(successIds[i]) != null) {
							Ext.example.msg("提示", "刪除'"+ proCodeTemplateStore.getById(successIds[i]).get('templateName')
											+ "'成功！");
						}
				}
	    }
	});
	}
	
}

var createTDCode  = function(){
	var extParam = {};
	var keyValues = "";
	var codeCount = createCodeForm.down("#codeCount").getValue();
	var TDCodeType = createCodeForm.down("#TDCodeTypeCombo").getValue();
	if(codeCount <= 0){
		return;
	}
	for(i=0;i<globalTemplateKeys.length;i++){

		 if(i == (globalTemplateKeys.length-1)){
		 	keyValues = keyValues+globalTemplateKeys[i]+"="+createCodeForm.down("#templateInfo").down("#index"+i).getValue();
		 }else{
		 	keyValues = keyValues+globalTemplateKeys[i]+"="+createCodeForm.down("#templateInfo").down("#index"+i).getValue()+"`";
		 }
	}

    Ext.Ajax.request({
	url : "../createCode/createTDCode.action",
    params:{
    	templateValue : keyValues,
		codeCount : codeCount,
		codeType:TDCodeType
	},
	method : "POST",
	success : function(){
	Ext.Msg.show({
     title:'提示',
     msg: '二维码已生成成功，点击"下载"为立即下载已生成的二维码<br/>点击"查看"为查看已生成的二维码！',
     buttonText: {
        yes: '下载',
        no: '查看',
        cancel: '取消'
    },
     buttons: Ext.Msg.YESNOCANCEL ,
     fn:function(btn){
     	if(btn == "yes"){
     		window.open("../createCode/downloadTDCode.action",
						'height=500,width=611,scrollbars=yes,status =yes');
     	}else if(btn == "no"){
     		var searchProxy = new Ext.data.HttpProxy(
					{
						type : 'ajax',
						url : '../createCode/getCodeImages.action',
						reader : {
							type : 'json',
							root : 'list',
							totalProperty : 'total'
						}
					});
			  ImageStore.setProxy(searchProxy);
			  ImageStore.load();
			  createShowCodemWin.show();
		      createCodeFormWin.hide();
     	}
     }
     });
		
		/*Ext.Msg.alert('提示', '是否下载生成的二维码', function(btn, text){
		if (btn == 'ok'){

			var searchProxy = new Ext.data.HttpProxy(
					{
						type : 'ajax',
						url : '../createCode/getCodeImages.action',
						reader : {
							type : 'json',
							root : 'list',
							totalProperty : 'total'
						}
					});
			  ImageStore.setProxy(searchProxy);
			  ImageStore.load();
			  createShowCodemWin.show();
		      createCodeFormWin.hide();
		}});*/

	}
		
	});
}

var downloadSelectTDCode = function(){
	if(proCodeShowGrid.down('#codeCount').getValue() != null && proCodeShowGrid.down('#codeCount').getValue() != 0){
		var datas = proCodeShowGrid.getStore().getRange(0,proCodeShowGrid.down('#codeCount').getValue()-1)
		
	}else{
	    var sm = proCodeShowGrid.getSelectionModel();
	    var datas = sm.getSelection();
	}
	
	var extParam = {};

	var codes = "";
	if(datas.length <= 0){
		Ext.Msg.alert("提示","你至少选择一条记录");
		return;
	}
	for(i=0 ; i<datas.length ;i++){
		if(i == (datas.length-1)){
			codes = codes + datas[i].get('code');
		}else{
			codes = codes + datas[i].get('code')+"`";
		}
	}
	extParam.extJsonList = codes;
	var url = "../createCode/downloadSelectTDCode.action?extParam="+Ext.JSON.encode(extParam);
    window.open(url,'','height=500,width=611,scrollbars=yes,status=yes,method=post');
	/*Ext.Ajax.request({
	url : "../createCode/downloadSelectCode.action",
    params:{
    	extParam :　Ext.JSON.encode(extParam)
	},
	method : "POST",
	success : function(){
		
	}	
	});*/
}


	var componentWin = Ext.create("Ext.Window",{
	       width : 600,
	       height: 400,
	       autoScroll:true,
	       title : '为模板设置指标',
	       border : false,
	       layout : 'fit',
 	       closeAction:'hide',
 	       items :[settingIndexForm]
    });		
    
    var componentWin2 = Ext.create("Ext.Window",{
	       width : 600,
	       autoScroll:true,
	       title : '查看模板',
	       border : false,
	       modal : true,
	       layout : 'fit',
 	       closeAction:'hide',
 	       items :[checkIndexForm]
    });	
    
     var createCodeFormWin = Ext.create("Ext.Window",{
	       width : 600,
	       autoScroll:true,
	       layout : 'fit',
	       modal : true,
 	       closeAction:'hide',
           items : [createCodeForm]
    });
    
    var createShowCodemWin = Ext.create("Ext.Window",{
	       width : 600,
	       autoScroll:true,
	       modal : true,
	       layout : 'fit',
	       title:"二维码列表",
 	       closeAction:'hide',
 	       maximizable : true,
           items : [proCodeShowGrid]
    });
	
	var showPanel = Ext.create('Ext.panel.Panel', {
				anchor : "100% 100%",
		        layout : 'border',
				split : true,
				autoScroll:true,
				items : [proCodeTemplateGrid,productGrid]
	});
	return showPanel;

}