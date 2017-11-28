var createCompanyManage = function(){
	
	/*var cityStoreUrl = "";
	var countyStoreUrl = "";
	var cityStoreRoot = "";
	var countyStoreRoot = "";*/
	var cityCombobox = null;
	var countyCombobox = null;
	var provinceCombobox = null;
	var globalFileName= ""
	
	/**
	 * 记录所选择的地址
	 * */
	var cityString = "";
	var countyString = "";
	var provinceString = "";
	

	Ext.define('company', {
				extend : 'Ext.data.Model',
				fields : [
				"companyId",
				"companyName",
				"address",
				"telephone",
				"recordNumber",
				"principal",
				"description",
				"trademark"
				]
			});
			
	Ext.define('province', {
				extend : 'Ext.data.Model',
				fields : [
				"name",
				"provinceId"
				]
			});
	Ext.define('city', {
				extend : 'Ext.data.Model',
				fields : [
				"name",
				"cityId"
				]
			});
	Ext.define('county', {
				extend : 'Ext.data.Model',
				fields : [
				"name",
				"countyId"
				]
			});

	var companyStore = Ext.create('Ext.data.Store', {
		model : 'company',
		autoLoad : true,
		autoDestroy : true,
		pageSize : 80,
		storeId :'companyId',
		proxy : {
			type : 'ajax',
			url : '../company/findAllCompany.action',
			reader : {
				type : 'json',
				root : 'valueList',
				totalProperty : 'valueSize'
			}
		},
		sorters : [
			{
				property : 'companyId',
				direction : 'ASC'
			}
		]
	});
	
	var provinceStore = Ext.create('Ext.data.Store', {
		model : 'province',
		autoLoad : true,
		autoDestroy : true,
		pageSize : 80,
		proxy : {
			type : 'ajax',
			url : '../data/area.json',
			reader : {
				type : 'array',
				root : 'p',
				totalProperty : 'total'
			}
		},
		sorters : [
			{
				property : 'provinceId',
				direction : 'ASC'
			}
		]
	});
	
	var cityStore = Ext.create('Ext.data.Store', {
		model : 'city',
		autoLoad : false,
		autoDestroy : true,
		pageSize : 80,
		proxy : {
			type : 'ajax',
			//url : cityStoreUrl,
			//root : cityStoreRoot,
			reader : {
				type : 'array',
				totalProperty : 'total'
			}
		},
		sorters : [
			{
				property : 'cityId',
				direction : 'ASC'
			}
		]
	});
	
	var countyStore = Ext.create('Ext.data.Store', {
		model : 'county',
		autoLoad : false,
		autoDestroy : true,
		pageSize : 80,
		proxy : {
			type : 'ajax',
			//url : countyStoreUrl,
			//root: countyStoreRoot,
			reader : {
				type : 'array',
				totalProperty : 'total'
			}
		},
		sorters : [
			{
				property : 'countyId',
				direction : 'ASC'
			}
		]
	});
	
	
	
		var companyColumns = [{
				header : '商家代码',
				width : 160,
				dataIndex : 'companyId',
				hidden : true,
				sortable : true
			}, {
				header : '商家名称',
				width : 120,
				dataIndex : 'companyName',
				sortable : true
			}, {
				header : '地址',
				dataIndex : 'address',
				width : 200,
				sortable : true
		    }, {
				header : '电话',
				dataIndex : 'telephone',
				width : 200,
				sortable : true
		    }, {
				header : '工商部门备案号',
				dataIndex : 'recordNumber',
				width : 200,
				sortable : true
		    },{
				header : '公司简介',
				dataIndex : 'description',
				width : 200,
				sortable : true
		    }];
		    
var createProvinceCombobox = function(){			    
	provinceCombobox=Ext.create('Ext.form.ComboBox',{
            itemId:'provinceCombobox',
            border:false,
            width:120,
            store : provinceStore,
			valueField : 'provinceId',
			displayField : 'name',
			emptyText : '选择省/市..',
            editable:false,
            name:'provinceCombobox',
            listeners: {
                select : function(combo, records, eOpts){
                    var cityStoreUrl = '../data/area.json';
	                var cityStoreRoot = records[0].get('provinceId');
	                provinceString = records[0].get('name');
                	var searchProxy = new Ext.data.HttpProxy(
					{
						type : 'ajax',
						url : cityStoreUrl,
						reader : {
							type : 'array',
							root : cityStoreRoot,
							totalProperty : 'total'
						}
					});
			              cityStore.setProxy(searchProxy);
			              cityStore.load();
                	}
                }
    });
        return provinceCombobox;
}
var createCityCombobox = function(){	    
    cityCombobox=Ext.create('Ext.form.ComboBox',{
            itemId:'cityCombobox',
            border:false,
            width:120,
            store : cityStore,
			valueField : 'cityId',
			displayField : 'name',
			emptyText : '选择市..',
            editable:false,
            name:'cityCombobox',
            listeners: {
                select : function(combo, records, eOpts){
                	var countyStoreUrl = '../data/area.json';
	                var countyStoreRoot = records[0].get('cityId');
	                cityString  = records[0].get('name');
                	var searchProxy = new Ext.data.HttpProxy(
					{
						type : 'ajax',
						url : countyStoreUrl,
						reader : {
							type : 'array',
							root : countyStoreRoot,
							totalProperty : 'total'
						}
					});
			              countyStore.setProxy(searchProxy);
			              countyStore.load();
                	}
                }
    });
    return cityCombobox;
}

var createCountyCombobox = function(){
     countyCombobox=Ext.create('Ext.form.ComboBox',{
    	    itemId:'countyCombobox',
            border:false,
            width:120,
            store : countyStore,
			valueField : 'countyId',
			displayField : 'name',
			emptyText : '选择县/区..',
            editable:false,
            name:'countyCombobox',
            listeners:{
            select : function(combo, records, eOpts){
	                countyString  = records[0].get('name');
                }
            }
    });
        return countyCombobox;
}

var companyGridPagingtoolbar = Ext.create('Ext.toolbar.Paging',{
        store: companyStore,  // same store GridPanel is using
        dock: 'bottom', //分页 位置
        emptyMsg: '没有数据',
        displayInfo: true,
        displayMsg: '当前显示{0}-{1}条记录 / 共{2}条记录 ',
        beforePageText: '第',
        afterPageText: '页/共{0}页'
	})

var companyGrid=Ext.create('Ext.grid.Panel',{
	       store : companyStore,
	       multiSelect :true,
	       autoScroll:true,
	       columns:companyColumns,
	       frame : true,
	       selType : 'checkboxmodel',
	       split : true,
	       minWidth : 120,
           veiwConfig :
           {
           stripeRows : true
           },
           tbar:[{
           	xtype : 'button',text : '注册商家',itemId:'add',handler :function(){
           		companyInfoForm.down("#addCompany").setDisabled(false);
           		companyInfoForm.down("#editCompany").setDisabled(true);
           		companyInfoForm.down("#reset").setDisabled(false);
           		companyInfoWin.setTitle("注册商家");
           		companyInfoWin.show();
            }},{
            xtype : 'button',text : '修改商家',itemId:'edit',disabled:true,handler :function(){
            	var sm = companyGrid.getSelectionModel();
            	var data = sm.getLastSelected();
            	companyInfoForm.loadRecord(data);
            	companyInfoForm.down("#addCompany").setDisabled(true);
           		companyInfoForm.down("#editCompany").setDisabled(false);
           		companyInfoForm.down("#reset").setDisabled(true);
            	companyInfoWin.setTitle("修改商家");
            	companyInfoWin.show();
            }},{xtype : 'button',text : '查看商家',itemId:'check',disabled:true,handler :function(){
            	companyInfoWin.setTitle("查看商家");
            	companyInfoWin.show();
            }},{
            xtype : 'button',text : '注销商家',itemId:'logout',disabled:true,handler :function(){
            	deleteCompany();
            }	
            },createProvinceCombobox(),createCityCombobox(),createCountyCombobox(),
        {
            xtype:'textfield', 
            itemId:'searchText',
            border:false,
            width:150,
            name:'searchText', 
            emptyText : '请输入关键字',
            allowBlank:true
        },{
            xtype : 'button',text : '搜索',handler :function(){  	
            }}
        ],
        bbar:[companyGridPagingtoolbar],
        listeners:{
        	'selectionchange':function( thisGrid, selected, eOpts ){
        		if(selected.length >　0){
        			companyGrid.down("#edit").setDisabled(false);
        			companyGrid.down("#check").setDisabled(false);
        			companyGrid.down("#logout").setDisabled(false);
        		}else{
        			companyGrid.down("#edit").setDisabled(true);
        			companyGrid.down("#check").setDisabled(true);
        			companyGrid.down("#logout").setDisabled(true);
        		}
        	}
        }
	});
	
var companyInfoForm=Ext.create("Ext.form.Panel",{
	frame : true,
	split : true,
	//disabled:true,
	minWidth : 120,
	layout : 'fit',
    margins : '0 0 0 0',
	bodyPadding : 3,
	items : [{
		    xtype : 'fieldset',
			itemId:'companyInfo',
			collapsible: true,
			mixHeight:400,
			align : 'center',
			autoScroll:true,
			title : '商家信息',
			items : [
		{
            xtype:'textfield', 
            itemId:'companyId',
            border:false,
            fieldLabel : "商家代码",      
            disabled : true,
            hidden : true,
            width:250,
            name:'companyId'
        },
        
        {
            xtype:'textfield', 
            itemId:'companyName',
            border:false,
            fieldLabel : "商家名称",
            name:'companyName', 
            width:350,
            allowBlank:false
        },
        {
            xtype:'textfield', 
            itemId:'address',
            border:false,
            width:350,
            fieldLabel : "地址",
            hidden : true,
            name:'address', 
            allowBlank:false
        },{
		    xtype : 'fieldset',
			itemId:'addressInfo',
			collapsible: true,
			maxHeight:400,
			align : 'center',
			hidden : false,
			title : '地址信息',
			items :[
			createProvinceCombobox(),createCityCombobox(),createCountyCombobox(),
			{
            xtype:'textfield', 
            itemId:'minuteAddress',
            border:false,
            width:350,
            emptyText : "输入详细地址..",
            name:'minuteAddress', 
            allowBlank:false
            }
			]
        },{
            xtype:'textfield', 
            itemId:'recordNumber',
            border:false,
            width:350,
            fieldLabel : "工商部门备案号",
            name:'recordNumber', 
            allowBlank:false
        },
        {
            xtype:'textfield', 
            itemId:'telephone',
            border:false,
            width:250,
            fieldLabel : "电话",
            name:'telephone', 
            allowBlank:false
        },
        {
            xtype:'textareafield', 
            itemId:'description',
            border:false,
            width:450,
            fieldLabel : "公司简介",
            name:'description', 
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
            text : "公司商标:"
        	},{
            xtype:'image', 
            itemId:'browseImage',
            border:false,
            maxHeight:80,
            maxWidth:80,
            html : '',
            src :'../file/4078ecfc-50d1-4afd-bd34-938245e84a70.jpg',
            name:'browseImage'
        	},{
        		text:'上传公司商标',
                xtype:'button',
                handler : function() {
                	globalFileName = "";
                	fileUploadWin.show();
                	companyInfoWin.setDisabled(true);
                	
                }
        	}
            ]
        }]}
	],
	buttons : [
		{   xtype:'button', 
            itemId:'addCompany',
            border:false,
            text : "注册",
            width:70,           
            name:'addCompany',
            handler : function(){
            	if(this.up('form').getForm().isValid()){
            	addCompany();
            	}
            }
        },
         {
            xtype:'button', 
            itemId:'editCompany',
            border:false,
            text : "修改",
            width:70,          
            name:'editCompany',
            handler : function(){
            	
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
            	companyInfoWin.hide();
         }
        }
	]
})

var uploadFile=Ext.create('Ext.form.Panel', {
    width: 400,
    bodyPadding: 10,
    frame: true,
    items: [{
        xtype: 'filefield',
        name: 'file',
        fieldLabel: '图片',
        labelWidth: 50,
        msgTarget: 'side',
        allowBlank: false,
        anchor: '100%',
        buttonText: '浏览'
    }],

    buttons: [{
        text: '上传',
        handler: function() {
            var form = this.up('form').getForm();
            if(form.isValid()){
                form.submit({
                    url: '../upload/uploadImage.action',
                    waitMsg: '上传中，请等待...',
                    success: function(fp, o) {
                       companyInfoForm.down('#browseImage').setSrc("../file/"+o.result.fileName);
                       globalFileName = o.result.fileName;
                       companyInfoForm.show();
                       fileUploadWin.hide();
                    },
                    failure :function(fp, o) {
                    	alert("上传失败,请重新上传");
                    }
                });
            }
        }
    }]
})



var deleteCompany = function(){
	var sm = companyGrid.getSelectionModel()
	var rows = sm.getSelection();
	var companyIds = "";
	var companyNames = "";
	var extParam = {};
	if(rows != null && rows.length > 0){
		for(i = 0;i < rows.length ;i++){
			if(i != rows.length-1){
				companyIds = companyIds+rows[i].data.companyId+"`";
				companyNames = companyNames + "\""+rows[i].data.companyName+"\";";
			}else{
				companyIds = companyIds+rows[i].data.companyId;
				companyNames = companyNames + "\""+rows[i].data.companyName+"\"";
			}
		}
	
	Ext.Msg.show({
     title:'提示',
     msg: '确定要注销'+companyNames+"？",
     buttonText: {
        yes: '确定',
        no: '取消'
    },
     buttons: Ext.Msg.YESNO,
     fn:function(btn){
     	if(btn == "yes"){
     		extParam.extJsonList = companyIds;
				Ext.Ajax.request({
					url : "../company/logoutCompany.action",
					params : {
							xtParam : Ext.JSON.encode(extParam)
					},
					method : "POST",
					success : function() {
						companyStore.load();
					}

		});
     	}else if(btn == "no"){
     		return;
     	}
     }
    });

	}

}     
    
var addCompany = function(){
	var extJson = {};
	extJson.companyName = companyInfoForm.down("#companyName").getValue();
	extJson.address = provinceString+cityString+countyString+companyInfoForm.down("#minuteAddress").getValue();
	extJson.telephone = companyInfoForm.down("#telephone").getValue();
	extJson.recordNumber = companyInfoForm.down("#recordNumber").getValue();
	extJson.description = companyInfoForm.down("#description").getValue();
	extJson.trademark = globalFileName;
	Ext.Ajax.request({
	url : "../company/addCompany.action",
    params:{
		extJson : Ext.JSON.encode(extJson)
	},
	method : "POST",
	success : function(extMessage){
		var json = Ext.JSON.decode(extMessage.responseText);
		if(json.successOrFalse == "success"){
			Ext.example.msg("提示",json.meassage);
			globalFileName = "";
			companyInfoForm.getForm().reset();
			companyInfoWin.hide();
			companyStore.load();
		}else{
			Ext.Msg.alert("提示",json.meassage);
		}
	}
		
	})
}    

var companyInfoWin = Ext.create("Ext.Window",{
	       width : 600,
	       autoScroll:true,
	       layout : 'fit',
	       modal : true,
 	       closeAction:'hide',
           items : [companyInfoForm]
    });
    
var fileUploadWin = Ext.create("Ext.Window",{
	       title : '上传图片',
	       autoScroll:true,
	       layout : 'fit',
 	       closeAction:'hide',
 	       modal : true,
 	       margin :10,
           items : [uploadFile],
           listeners :
           {
           	  'close' : function( panel, eOpts ){
           	  	  	companyInfoWin.setDisabled(false);
           	  },
           	  'hide' : function( panel, eOpts ){
           	  	  	companyInfoWin.setDisabled(false);
           	  }
           }
    });
    
	var showPanel = Ext.create('Ext.panel.Panel', {
				layout : 'fit',
				split : true,
				autoScroll:true,
				items : [companyGrid]
	});
	return showPanel;
}

