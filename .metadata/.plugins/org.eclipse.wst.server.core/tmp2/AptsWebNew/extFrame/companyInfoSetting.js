var createCompanyInfoSetting = function(){

var globalCompany = {};
var globalTrademarkName = "";
var globalHeadImageName = ""
var resourceType = "";
	
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
			

			    
var	provinceCombobox=Ext.create('Ext.form.ComboBox',{
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
 
 var cityCombobox=Ext.create('Ext.form.ComboBox',{
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

 var countyCombobox=Ext.create('Ext.form.ComboBox',{
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
	
var companyInfoForm=Ext.create("Ext.form.Panel",{
	frame : true,
	split : true,
	//disabled:true,
	minWidth : 120,
	autoScroll :true,
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
            itemId:'pinyinEncoding',
            border:false,
            fieldLabel : "拼音编码",
            name:'pinyinEncoding', 
            width:350,
            allowBlank:false
        },
        {
            xtype:'textfield', 
            itemId:'address',
            border:false,
            width:350,
            fieldLabel : "地址",
            name:'address', 
            allowBlank:false
        },{
		    xtype : 'fieldset',
			itemId:'addressInfo',
			collapsible: true,
			maxHeight:400,
			align : 'center',
			hidden : true,
			title : '地址信息',
			items :[
			provinceCombobox,cityCombobox,countyCombobox,
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
            readOnly : true,
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
            width:650,
            fieldLabel : "公司简介"+"<font color=red>(2000字以内)</font>",
            name:'description', 
            allowBlank:false
        },
        {
            xtype:'htmleditor', 
            itemId:'commitment',
            border:false,
            width:650,
            heigth:400,
            fontFamilies:['宋体','隶书','黑体',
            'Arial','Tahoma','Verdana'
            ],
            fieldLabel : "诚信承诺"+"<font color=red>(2000字以内)</font>",
            name:'commitment', 
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
            itemId:'trademark',
            border:false,
            maxHeight:80,
            maxWidth:80,
            html : '',
            src :'',
            name:'trademark'
        	},{
        		text:'上传公司商标',
                xtype:'button',
                handler : function() {
                	resourceType = "trademark";
                	componentWin.show();
                	
                }
        	}
            ]
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
            text : "版头图片:"
        	},{
            xtype:'image', 
            itemId:'headImage',
            border:false,
            maxHeight:80,
            maxWidth:200,
            html : '',
            src :'',
            name:'headImage'
        	},{
        		text:'上传版头图片',
                xtype:'button',
                handler : function() {
                	resourceType = "headImage";
                	componentWin.show();
                	
                }
        	}
            ]
        }
        ]}
	],
	buttons : [
         {
            xtype:'button', 
            itemId:'editCompany',
            border:false,
            text : "修改",
            width:70,          
            name:'editCompany',
            handler : function(){
            	editCompany();
         }
        }
        ]
})


Ext.Ajax.request({
	url:'../company/findCompanyInfo.action',
	method:'GET',
    async: false,
	success : function(extMessage){
		var json = Ext.JSON.decode(extMessage.responseText);
		if(json.successOrFalse == "false"){
			Ext.Msg.alert("提示",json.meassage);
		}else if(json.successOrFalse == "success"){
			globalCompany = Ext.JSON.decode(json.extJson);
			companyInfoForm.down("#companyName").setValue(globalCompany.companyName);
            companyInfoForm.down("#address").setValue(globalCompany.address);
            companyInfoForm.down("#telephone").setValue(globalCompany.telephone);
            companyInfoForm.down("#recordNumber").setValue(globalCompany.recordNumber); 
            companyInfoForm.down("#description").setValue(globalCompany.description);
            companyInfoForm.down("#commitment").setValue(globalCompany.commitment);
            companyInfoForm.down("#pinyinEncoding").setValue(globalCompany.pinyinEncoding);
            globalHeadImageName = globalCompany.headImage;
            globalTrademarkName = globalCompany.trademark;
            companyInfoForm.down('#trademark').setSrc("http://localhost:8080/file/"+globalCompany.trademark);
            companyInfoForm.down('#headImage').setSrc("http://localhost:8080/file/"+globalCompany.headImage);
            companyInfoForm.show();
		}
	}
		
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
	        //post_params :{'processorInfoId' : globalProInfoId},
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
			companyInfoForm.show();
			var fileName = data.fileName;
			if(fileName.indexOf("trademark") > -1){
				globalTrademarkName = data.fileName;
			    companyInfoForm.down('#trademark').setSrc("http://localhost:8080/file/"+globalTrademarkName);
			}
			else if(fileName.indexOf("headImage") > -1){
				globalHeadImageName = data.fileName;
				companyInfoForm.down('#headImage').setSrc("http://localhost:8080/file/"+globalHeadImageName);
			}
			companyInfoForm.doLayout();
			companyInfoForm.show();
			showPanel.show();
			componentWin.hide();
		    },
		    upload_start_handler : function(file){
	        var me = this.settings.custom_settings.scope_handler;
	        me.down('#cancelBtn').setDisabled(false);	
	        var rec = me.store.getById(file.id);
	        var postobj = {"resourceType":resourceType};
	        this.setPostParams(postobj);
	        this.setFilePostName(encodeURIComponent(rec.get('file')));
	        },
	        upload_url : 'http://localhost:8080/AptsUpload/uploadImage.action'
     });

var editCompany = function(){
   var extJson = {};
   extJson.companyName = companyInfoForm.down("#companyName").getValue();
   extJson.address = companyInfoForm.down("#address").getValue();
   extJson.telephone = companyInfoForm.down("#telephone").getValue();
   extJson.recordNumber =  companyInfoForm.down("#recordNumber").getValue();
   extJson.pinyinEncoding = companyInfoForm.down("#pinyinEncoding").getValue();
   extJson.commitment =  companyInfoForm.down("#commitment").getValue();
   extJson.trademark =  globalTrademarkName;
   extJson.headImage = globalHeadImageName
   extJson.description = companyInfoForm.down("#description").getValue();
   Ext.Ajax.request({
	url:'../company/companyInfoSetting.action',
	method:'POST',
    async: false,
    params :{
    	extJson : Ext.JSON.encode(extJson)
    },
	success : function(extMessage){
		var json = Ext.JSON.decode(extMessage.responseText);
		if(json.successOrFalse == "success"){
			Ext.example.msg("提示",json.meassage);
		}else if(json.successOrFalse == "false"){
			Ext.Msg.alert("提示",json.meassage);
		}
	}
		
	})
}
  

var componentWin = Ext.create("Ext.Window",{
	       width : 700,
	       height: 200,
	       layout : 'fit',
 	       closeAction:'hide',
 	       maximizable : true,
 	       items :[uploadPanel]
    });	

    
var showPanel = Ext.create('Ext.panel.Panel', {
				layout : 'fit',
				split : true,
				autoScroll:true,
				items : [companyInfoForm]
	});
	return showPanel;    

}