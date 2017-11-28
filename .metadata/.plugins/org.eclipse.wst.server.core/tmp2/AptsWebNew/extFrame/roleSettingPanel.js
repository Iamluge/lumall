var createRoleSettingPanel = function(){
	
	var globalUserId = "";
	var globalCompanyId = "";
	var globalRoleId = "";
	
	Ext.define('sysRole', {
				extend : 'Ext.data.Model',
				idProperty : 'roleId',
				fields : [
				"roleId",
				"roleName",
				"description",
				"minuteDescription"
				]
			});
	
	Ext.define('sysUser', {
				extend : 'Ext.data.Model',
				fields : [
				"userId",
				"userName",
				"company.companyName"
				]
			});
	Ext.define('company', {
		extend : 'Ext.data.Model',
		fields : [ "companyId", "companyName" ]
	});
			
	var sysUserStore = Ext.create('Ext.data.Store', {
		model : 'sysUser',
		autoLoad : false,
		autoDestroy : true,
		pageSize : 80,
		proxy : {
			type : 'ajax',
			url : '../sysUser/findSysUserByCompanyId.action?companyId='+globalCompanyId,
			reader : {
				type : 'json',
				root : 'list',
				totalProperty : 'total'
			}
		},
		sorters : [
			{
				property : 'userId',
				direction : 'ASC'
			}
		]
	});		
	
	var companyStore = Ext.create('Ext.data.Store', {
		model : 'company',
		autoLoad : true,
		autoDestroy : true,
		pageSize : 80,
		proxy : {
			type : 'ajax',
			url : '../company/findAllCompany.action',
			reader : {
				type : 'json',
				root : 'list',
				totalProperty : 'total'
			}
		},
		sorters : [ {
			property : 'companyId',
			direction : 'ASC'
		} ]
	});
	
 	var sysRoleStore = Ext.create('Ext.data.Store', {
		model : 'sysRole',
		autoLoad : true,
		autoDestroy : true,
		pageSize : 80,
		proxy : {
			type : 'ajax',
			url : '../sysRole/findRoleByAdmin.action',
			reader : {
				type : 'json',
				root : 'list',
				totalProperty : 'total'
			}
		},
		sorters : [
			{
				property : 'roleId',
				direction : 'ASC'
			}
		]
	});
	
  	var userRoleStore = Ext.create('Ext.data.Store', {
		model : 'sysRole',
		autoLoad : false,
		autoDestroy : true,
		pageSize : 80,
		proxy : {
			type : 'ajax',
			url : '../sysRole/findSysRoleByUserId.action?userId='+globalUserId,
			reader : {
				type : 'json',
				root : 'list',
				totalProperty : 'total'
			}
		},
		sorters : [
			{
				property : 'roleId',
				direction : 'ASC'
			}
		]
	});	


var sysUserGrid=Ext.create('Ext.grid.Panel',{
	       store : sysUserStore,
	       multiSelect :true,
	       region : 'west',
	       width : '40%',
	       columns:[{
				header : '人员代码',
				width : 160,
				dataIndex : 'userId',
				sortable : true
			}, {
				header : '姓名',
				width : 120,
				dataIndex : 'userName',
				sortable : true
			}, {
				header : '所属商家',
				dataIndex : 'company.companyName',
				width : 200,
				sortable : true
		    }],
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
			xtype : 'combobox',
			itemId : 'companyCombobox',
			border : false,
			width : 320,
			store : companyStore,
			valueField : 'companyId',
			displayField : 'companyName',
			fieldLabel : "商家",
			emptyText : '请选择商家..',
			editable : false,
			name : 'companyCombobox',
			listeners : {
				'select' : function(combo, records, eOpts) {
					globalCompanyId = records[0].get('companyId');
					var searchProxy = new Ext.data.HttpProxy({
						type : 'ajax',
						url : '../sysUser/findSysUserByCompanyId.action?companyId='
								+ globalCompanyId,
						reader : {
							type : 'json',
							root : 'list',
							totalProperty : 'total'
						}
					});
					sysUserStore.setProxy(searchProxy);
					sysUserStore.load();
				}
			}
		   } 
	       ],
           listeners :{
           	"itemclick" :　function( thisView, record, item, index, e, eOpts ){
           		globalUserId = record.get('userId');
           	},
           	"select" : function( thisView, record, index, eOpts ){
           		globalUserId = record.get('userId');
           		var searchProxy = new Ext.data.HttpProxy(
					{
						type : 'ajax',
						url : '../sysRole/findSysRoleByUserId.action?userId='+globalUserId,
						reader : {
							type : 'json',
							root : 'list',
							totalProperty : 'total'
						}
					});
		 	   userRoleGrid.setTitle('【'+record.get('userName')+'】拥有的角色');
			   userRoleStore.setProxy(searchProxy);
		       userRoleStore.load();
           	}
           }
	});

 var userRoleGrid=Ext.create('Ext.grid.Panel',{
	store : userRoleStore,
	multiSelect :true,
	selModel :'checkboxmodel',
    selType :'checkboxmodel',
	frame : true,
	split : true,
	title:'所有角色',
	region : 'center',
	width : '30%',
    veiwConfig :
    {
	    stripeRows : true
	},
	columns : [
	{text : 'id', dataIndex :'roleId',sortable :true,hidden : true},
	{text : '角色名', dataIndex :'description',sortable :true}
	],
	tbar :[
	,{xtype :'button' ,text :"为该用户添加角色",itemId : "add",
	handler:function(){
		addRoleToUser();
	}
	},{xtype :'button' ,text :"为该用户删除角色",itemId : "delete",
	handler:function(){
		deleteRoleToUser();
	}
	}
	]
});	
	
  var sysRoleGrid=Ext.create('Ext.grid.Panel',{
	store : sysRoleStore,
	multiSelect :true,
	selModel :'checkboxmodel',
    selType :'checkboxmodel',
	frame : true,
	split : true,
	title:'所有角色',
	region : 'east',
	width : '30%',
    veiwConfig :
    {
	    stripeRows : true
	},
	columns : [
	{text : 'id', dataIndex :'roleId',sortable :true,hidden : true},
	{text : '角色名', dataIndex :'roleName',sortable :true},
	{text : '描述', dataIndex :'description',sortable :true}
	],
	tbar : [{xtype :'button' ,text :"添加",itemId : "add",
	handler:function(){
		roleInfoFrom.getForm().reset();
		roleInfoFrom.down("#add").setDisabled(false);
		roleInfoFrom.down("#edit").setDisabled(true);
		componentWin.show();
	}
	},{xtype :'button' ,text :"修改",itemId : "edit",disabled:true,
	handler:function(){
		var sm = sysRoleGrid.getSelectionModel();
		var data = sm.getLastSelected();
		roleInfoFrom.loadRecord(data)
		roleInfoFrom.down("#add").setDisabled(true);
		roleInfoFrom.down("#edit").setDisabled(false);
		componentWin.show();
	}
	},{xtype :'button' ,text :"删除",itemId : "delete",disabled:true,
	handler:function(){
			Ext.Msg.show({
							title : '提示',
							msg : '确定要刪除选中的角色？',
							buttonText : {
								yes : '确定',
								no : '取消'
							},
							buttons : Ext.Msg.YESNO,
							fn : function(btn) {
								if (btn == "yes") {
									deleteRole();
								} else if (btn == "no") {
									return;
								}
							}
						});
	}
	}],
	listeners:{
		'selectionchange':function( thisGrid, selected, eOpts ){
			if(selected.length > 0){
				sysRoleGrid.down("#edit").setDisabled(false);
				sysRoleGrid.down("#delete").setDisabled(false);
			}else{
				sysRoleGrid.down("#edit").setDisabled(true);
				sysRoleGrid.down("#delete").setDisabled(true);
			}
		},
		'select':function( thisGrid, record, index, eOpts ){
			globalRoleId = record.get('roleId');
		}
	}
});	
	
	
  var roleInfoFrom=Ext.create("Ext.form.Panel",{
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
			itemId:'roleInfo',
			collapsible: true,
			maxHeight:400,
			align : 'center',
			title : '角色信息',
			items : [
		{
            xtype:'textfield', 
            itemId:'roleName',
            border:false,
            fieldLabel : "角色名称",
            width:350,
            name:'roleName'
        },
        {
            xtype:'textfield', 
            itemId:'description',
            border:false,
            width:350,
            fieldLabel : "描述",
            name:'description'
        },
        {
            xtype:'textareafield', 
            itemId:'minuteDescription',
            border:false,
            width:350,
            fieldLabel : "详细描述",
            name:'minuteDescription'
        }
    ]
    }
	],
	buttons :[
	{text:"添加",formBind:true,itemId:"add",
	 handler:function(){
	 	if(this.up('form').getForm().isValid()){
	 	addSysRole();
	 	}
	}
	},{text:"修改",formBind:true,itemId:"edit",
	 handler:function(){
	 	if(this.up('form').getForm().isValid()){
	 	editSysRole();
	 	}
	}
	},
	{
	text:"重置",formBind:true,itemId:"reset",
	handler:function(){
		this.up('form').getForm().reset();
	}
	}
	]
})	;		
		    

var addSysRole = function(){
	var extJson = {};
	extJson.roleName = roleInfoFrom.down("#roleName").getValue();
	extJson.description = roleInfoFrom.down("#description").getValue();
	extJson.minuteDescription = roleInfoFrom.down("#minuteDescription").getValue();
	Ext.Ajax.request({
	url : "../sysRole/addSysRole.action",
    params:{
		extJson : Ext.JSON.encode(extJson)
	},
	method : "POST",
	success : function(extMessage){
		var json = Ext.JSON.decode(extMessage.responseText);
		if(json.successOrFalse == "success"){
		    Ext.example.msg("提示",json.meassage);
		    sysRoleStore.load();
		    componentWin.hide();
		}else{
			Ext.Msg.alert("提示",json.meassage);
		}
	}
		
	});
}

var editSysRole = function(){
	var extJson = {};
	extJson.roleId = globalRoleId;
	extJson.roleName = roleInfoFrom.down("#roleName").getValue();
	extJson.description = roleInfoFrom.down("#description").getValue();
	extJson.minuteDescription = roleInfoFrom.down("#minuteDescription").getValue();
	Ext.Ajax.request({
	url : "../sysRole/editSysRole.action",
    params:{
		extJson : Ext.JSON.encode(extJson)
	},
	method : "POST",
	success : function(extMessage){
		var json = Ext.JSON.decode(extMessage.responseText);
		if(json.successOrFalse == "success"){
		    Ext.example.msg("提示",json.meassage);
		    sysRoleStore.load();
		    componentWin.hide();
		}else{
			Ext.Msg.alert("提示",json.meassage);
		}
	}
		
	});
}

var deleteRole = function(){
	var extParam = {};
	var roleIds = "";
	var roleSM = sysRoleGrid.getSelectionModel();
	var datas = roleSM.getSelection();
	for(i=0;i<datas.length;i++){
		if(i == datas.length-1){
			roleIds = roleIds + datas[i].get('roleId');
		}else{
			roleIds = roleIds + datas[i].get('roleId')+"`";
		}
	}
	extParam.extJsonList = roleIds;
	Ext.Ajax.request({
	url : "../sysRole/deleteSysRole.action",
    params:{
		extParam : Ext.JSON.encode(extParam)
	},
	method : "POST",
	success : function(extMessage){
		var json = Ext.JSON.decode(extMessage.responseText);
		successIds = json.successJsonList.split("`");
		sysRoleStore.load();
		for(i=0;i<(successIds.length-1);i++){
			if(sysRoleStore.getById(successIds[i]) != null){
			    Ext.example.msg("提示","刪除'"+sysRoleStore.getById(successIds[i]).get('roleName')+"'成功！");
			}
		}
	}
		
	});
}


var addRoleToUser = function(){
	var extParam = {};
	var roleIds = "";
	var userIds = "";
	var roleSM = sysRoleGrid.getSelectionModel();
	var userSM = sysUserGrid.getSelectionModel();
	var userDatas = userSM.getSelection();
	var roleDatas = roleSM.getSelection();
	for(i=0;i<userDatas.length;i++){
		if(i == userDatas.length-1){
			userIds = userIds + userDatas[i].get('userId');
		}else{
			userIds = userIds + userDatas[i].get('userId')+"`";
		}
	}
	for(i=0;i<roleDatas.length;i++){
		if(i == roleDatas.length-1){
			roleIds = roleIds + roleDatas[i].get('roleId');
		}else{
			roleIds = roleIds + roleDatas[i].get('roleId')+"`";
		}
	}
	extParam.extJsonList = roleIds;
	extParam.extJsonList2 = userIds;
	Ext.Ajax.request({
	url : "../sysRole/addRoleToUser.action",
    params:{
		extParam : Ext.JSON.encode(extParam)
	},
	method : "POST",
	success : function(){
		userRoleStore.load();
	}
		
	});
}

var deleteRoleToUser = function(){
	var extParam = {};
	var roleIds = "";
	var roleSM = userRoleGrid.getSelectionModel();
	var userSM = sysUserGrid.getSelectionModel();
	var data = userSM.getLastSelected();
	var datas = roleSM.getSelection();
	for(i=0;i<datas.length;i++){
		if(i == datas.length-1){
			roleIds = roleIds + datas[i].get('roleId');
		}else{
			roleIds = roleIds + datas[i].get('roleId')+"`";
		}
	}
	extParam.extJsonList = roleIds;
	extParam.param1 = data.get('userId');
	Ext.Ajax.request({
	url : "../sysRole/deleteRoleToUser.action",
    params:{
		extParam : Ext.JSON.encode(extParam)
	},
	method : "POST",
	success : function(){
		userRoleStore.load();
	}
		
	});
}
 
	var componentWin = Ext.create("Ext.Window",{
	       width : 600,
	       autoScroll:true,
	       title : '添加角色',
	       modal : true,
	       border : false,
	       layout : 'fit',
 	       closeAction:'hide',
 	       items :[roleInfoFrom]
    });
	
   var showPanel = Ext.create('Ext.panel.Panel', {
		anchor : "100% 100%",
		layout : 'border',
		split : true,
		items : [sysUserGrid,userRoleGrid,sysRoleGrid]
		});	
	return showPanel;	
}