var createVedioControlPanel = function(){
   
	var globalCameraId = "";
	
	Ext.define('camera', {
				extend : 'Ext.data.Model',
				fields : [
				"id", 
				"ip", 
				"port", 
				"name", 
				"position",
				"userName",
				"password"
				]
			});
			
  	var cameraStore = Ext.create('Ext.data.Store', {
		model : 'camera',
		autoLoad : true,
		autoDestroy : true,
		pageSize : 80,
		proxy : {
			type : 'ajax',
			url : '../camera/findCaremaByCompanyId.action',
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
	
   var cameraGrid=Ext.create('Ext.grid.Panel',{
	store : cameraStore,
	multiSelect :true,
	selModel :'checkboxmodel',
    selType :'checkboxmodel',
	frame : true,
	split : true,
	title:'摄像头列表',
	region : 'west',
	width : '70%',
    veiwConfig :
    {
	    stripeRows : true
	},
	columns : [
	{text : '编号', dataIndex :'id',sortable :true,hidden : true},
	{text : '名称', dataIndex :'name',sortable :true},
	{text : '位置', dataIndex :'position',sortable :true},
	{text : 'ip', dataIndex :'ip',sortable :true},
	{text : '端口', dataIndex :'port',sortable :true},
	{text : '用户名', dataIndex :'userName',sortable :true,hidden : true},
	{text : '密码', dataIndex :'password',sortable :true,hidden : true}
	],
	tbar :[
	,{xtype :'button' ,text :"打开摄像头",itemId : "open",disabled:true,
	handler:function(){
		var sm = cameraGrid.getSelectionModel();
		var data = sm.getLastSelected();
		window.open("http://"+data.get('ip')+":"+data.get('port'));   
		
	}
	},
	{xtype :'button' ,text :"删除摄像头",itemId : "delete",disabled:true,
	handler:function(){
		      Ext.Msg.show({
							title : '提示',
							msg : '确定要刪除选择的摄像头？',
							buttonText : {
								yes : '确定',
								no : '取消'
							},
							buttons : Ext.Msg.YESNO,
							fn : function(btn) {
								if (btn == "yes") {
									deleteCamera();
								} else if (btn == "no") {
									return;
								}
							}
						});
		
	}
	}
	],
	listeners :{
    	'itemclick':function(thisView,record, item,index,e,eOpts ){
    		globalCameraId = record.get('id');
    		cameraInfoForm.loadRecord(record);
    		
    	   /* if (Ext.getCmp(record.get('id')) == null) {
                    tabPanels.add({
                        layout: "fit",
                        title: record.get('name'),
                        id: record.get('id'),
                        closable: true,
                        html:'<iframe src="http://'+record.get('ip')+':'+record.get('port')+'" scrolling="auto" frameborder="0" height="100%" width="100%"> </frame>'
                    }).show();
                } else {
                    Ext.getCmp(record.get('id')).show();
            }*/
    	},
		'selectionchange':function( thisGrid, selected, eOpts ){
			if(selected.length　> 0){
				cameraGrid.down("#open").setDisabled(false);
				cameraGrid.down("#delete").setDisabled(false);
			}else{
				cameraGrid.down("#open").setDisabled(true);
				cameraGrid.down("#delete").setDisabled(true);
			}
		}
	}
});	


var cameraInfoForm = Ext.create('Ext.form.Panel', {
	    border : false,
	    region :'center',
		frame : true,
		width:"40%",
    	height:'100%',
    	title : "摄像头信息",
    	autoScroll:true,
    	items: [{
    		xtype:'fieldset',
            height:'100%',
            layout: 'anchor',
            title:'摄像头信息',
            items :[{
            	xtype:'textfield',
            	anchor: '90%',
            	fieldLabel:'摄像头信息',
                fieldLabel: '名称',
                allowBlank: false,
                itemId: 'name'
            },{
            	xtype:'textfield',
            	anchor: '90%',
                fieldLabel: '位置',
                allowBlank: false,
                itemId: 'position'
            },{
            	xtype:'textfield',
            	anchor: '90%',
                fieldLabel: 'IP',
                allowBlank: false,
                itemId: 'ip'
            },{
            	xtype:'textfield',
            	anchor: '90%',
                fieldLabel: '端口',
                allowBlank: false,
                itemId: 'port'
            },{
            	xtype:'textfield',
            	anchor: '90%',
                fieldLabel: '用户名',
                allowBlank: false,
                itemId: 'userName'
            },{
            	xtype:'textfield',
            	anchor: '90%',
                fieldLabel: '密码',
                allowBlank: false,
                itemId: 'password'
            }]
    	}],
    	buttons: [
    	{
            text: '添加',
            formBind: true, //only enabled once the form is valid
            disabled: true,
            itemId : "add",
            handler: function(){
            	cameraInfoForm.down('#add').setDisabled(true);
            	addOrEditCamera("add");
         
            }
    	},
    	{
            text: '修改',
            formBind: true, //only enabled once the form is valid
            disabled: true,
            itemId : "edit",
            handler: function(){
            	addOrEditCamera("edit");
            }
    	},
    	{
            text: '重置',
            itemId : "reset",
            handler: function() {
                this.up('form').getForm().reset();
            }
    	}
    	]
	

});


var addOrEditCamera = function(param){
	var extJson = {};
	var url = "";
	extJson.ip = cameraInfoForm.down("#ip").getValue();
	extJson.port = cameraInfoForm.down("#port").getValue();
	extJson.name = cameraInfoForm.down("#name").getValue();
	extJson.position = cameraInfoForm.down("#position").getValue();
	extJson.userName = cameraInfoForm.down("#userName").getValue();
	extJson.password = cameraInfoForm.down("#password").getValue();
	if(param == "edit"){
		extJson.id = globalCameraId;
		url = "../camera/eidtCamera.action";
	}else if(param == "add"){
		url = "../camera/addCamera.action";
	}
	Ext.Ajax.request({
	url : url,
    params:{
		extJson : Ext.JSON.encode(extJson)
	},
	method : "POST",
	success : function(extMessage){
		var json = Ext.JSON.decode(extMessage.responseText);
		if(json.successOrFalse == "success"){
			cameraInfoForm.getForm().reset();
			Ext.example.msg("提示",json.meassage);
			cameraStore.load();
		}else{
			Ext.Msg.alert("提示",json.meassage);
		}		
	},
	failure : function(){
		
	}
	});
}

var deleteCamera = function(){
	var extParam = {};
	var sm = cameraGrid.getSelectionModel();
	var datas = sm.getSelection();
	var cameraIds = "";
	for(i=0;i<datas.length;i++){
		if(i == datas.length-1){
			cameraIds = cameraIds+datas[i].get('id');
		}else{
			cameraIds = cameraIds+datas[i].get('id')+"`";
		}
	}
	extParam.extJsonList = cameraIds;
	Ext.Ajax.request({
	url : "../camera/deleteCamera.action",
    params:{
		extParam : Ext.JSON.encode(extParam)
	},
	method : "POST",
	success : function(extMessage){
		var json = Ext.JSON.decode(extMessage.responseText);
		successIds = json.successJsonList.split("`");
		cameraStore.load();
		for(i=0;i<(successIds.length-1);i++){
			if(cameraStore.getById(successIds[i]) != null){
			    Ext.example.msg("提示","刪除'"+cameraStore.getById(successIds[i]).get('name')+"'成功！");
			}
		}	
	}
		
	})
}


var tabPanels = Ext.create("Ext.tab.Panel", {
		itemId : 'tabPanel',
		resizeTabs : true,
		enableTabScroll : false,
		frame:true,
		region : 'center',
		autoScroll: false,
		defaults : {
			autoScroll : true,
			bodyPadding: 10
		}
	});
	
   var showPanel = Ext.create('Ext.panel.Panel', {
				anchor : "100% 100%",
				layout : 'border',
				split : true,
				items : [cameraGrid,cameraInfoForm]
			});
		
	return showPanel;
}