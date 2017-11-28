var createPowerSettingPanel = function(){

	var globalRoleId = "";
	var globalParentPowerId = "";
	var globalPowerId = "";
	var globalNode = null;
	var globalPowerIdList = "";
	var globalPowerTexts = "";
	
	Ext.define('powerType', {
				extend : 'Ext.data.Model',
				fields : [
				"typeId",
				"typeName"
				]
			});
	
	Ext.define('sysRole', {
				extend : 'Ext.data.Model',
				fields : [
				"roleId",
				"roleName",
				"description"
				]
			});

			
	var powerTypeStore = Ext.create('Ext.data.Store', {
		model : 'powerType',
		autoLoad : true,
		autoDestroy : true,
		pageSize : 80,
		proxy : {
			type : 'ajax',
			url : '../data/powerType.json',
			reader : {
				type : 'json',
				root : 'list',
				totalProperty : 'total'
			}
		},
		sorters : [
			{
				property : 'typeId',
				direction : 'ASC'
			}
		]
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
			
 var powerStore = Ext.create('Ext.data.TreeStore', {
    autoLoad : true,
    autoDestroy : true,
    folderSort :false,
    fields :[
    	"id",
		"text",
    	"powerType",
    	"description",
    	"url",
    	"method",
    	"index",
    	{name : "checked",type:"boolean"}
    ],
    proxy: {
        type: 'ajax',
        url: '../sysPower/findPowerByParentPowerId.action',
        reader: {
            type: 'json'
        }
    },
    root: { 
    text : "权限列表",
    id : '1000',
    expanded: true 
    }
 });
 
  var rolePowerStore = Ext.create('Ext.data.TreeStore', {
    autoLoad : false,
    autoDestroy : true,
    folderSort :false,
    fields :[
    	"id",
		"text",
    	"powerType",
    	"checked",
    	{name : "checked",type:"boolean"}
    ],
    proxy: {
        type: 'ajax',
        url: '../sysPower/findPowerByRoleIdAndPowerId.action?roleId='+globalRoleId,
        reader: {
            type: 'json'
        }
    },
    root: { 
    text:"权限列表",
    id : '1000',
    expanded: true 
    }
 });
 
  var powerTree = Ext.create('Ext.tree.Panel', {
  	title :'权限列表',
  	region : 'east',
  	width : '35%',
  	useArrows: true,
    store: powerStore,
    rootVisible: true,   
    multiSelect: true,  
    singleExpand: false,
    split : true,
    minWidth: 300,
    tbar :[
    {
    	text : "增加权限",
    	itemId:"add",
    	handler : function(){
    		powerInfoFrom.getForm().reset();
    		var sm = powerTree.getSelectionModel();
    		var data = sm.getLastSelected(); 
    		if(data == null){
    			Ext.Msg.alert("提示","请选择父级权限！")
    			return;
    		}
    		powerInfoFrom.down("#edit").setDisabled(true);
    		powerInfoFrom.down("#add").setDisabled(false);
    		powerInfoFrom.down("#parentPower").setValue(data.get('text'));
    		componentWin.show();
    	}
    },
    {
    	text : "修改权限",
    	itemId:"edit",
    	disabled:true,
    	handler : function(){
    		var sm = powerTree.getSelectionModel();
    		var data = sm.getLastSelected()
    		globalPowerId = data.get('id');
    		powerInfoFrom.loadRecord(data);
    		powerInfoFrom.down("#edit").setDisabled(false);
    		powerInfoFrom.down("#add").setDisabled(true);
	        componentWin.show();
    	}
    },
        {
    	text : "删除权限",
    	itemId:"delete",
    	disabled:true,
    	handler : function(){
    		    globalPowerTexts = "";
    		    var datas = powerTree.getView().getChecked();
    		    for(i=0;i<datas.length;i++){
    		    	globalPowerTexts = datas[i].get('text')+"; "
    		    }
    			Ext.Msg.show({
							title : '提示',
							msg : '确定要刪除权限:' + globalPowerTexts + "？选择确定后子权限将联同删除！",
							buttonText : {
								yes : '确定',
								no : '取消'
							},
							buttons : Ext.Msg.YESNO,
							fn : function(btn) {
								if (btn == "yes") {
									deletePower();
								} else if (btn == "no") {
									return;
								}
							}
						});
    	}
    }
    ],
    listeners :{
    	'select' : function( thisView, record, index, eOpts ){
    		globalParentPowerId = record.get('id');
    		powerInfoFrom.down("#parentPower").setValue(record.get('text'));	
    	},
    	'selectionchange':function( thisGrid, selected, eOpts ){
			if(selected.length > 0){
				powerTree.down("#edit").setDisabled(false);
				powerTree.down("#delete").setDisabled(false);
			}else{
				powerTree.down("#edit").setDisabled(true);
				powerTree.down("#delete").setDisabled(true);
			}
		},
		'checkchange' : function(node,checked,eOpts){
			if(componentWin.isHidden() ){
			if(node.parentNode != null){
		    globalParentPowerId = node.parentNode.get('id');
		    powerInfoFrom.down("#parentPower").setValue(node.parentNode.get('text'));
			}
		    globalNode = node;
			}

		},
		'cellcontextmenu':function( treePanel,td, cellIndex, record, tr, rowIndex, e, eOpts ){
			    e.preventDefault();
				if (globalNode == null) {
					return;
				}
				checked = record.get("checked");

				if (globalNode.get('id') == record.get('id')) {
						if (globalNode.hasChildNodes()) {
							for (var j = 0; j < globalNode.childNodes.length; j++) {
								checkChildrenNode(globalNode);
								globalNode.childNodes[j].set('checked', checked);
							}
						}
				}
			}
		}  
});



  var rolePowerTree = Ext.create('Ext.tree.Panel', {
  	title :'拥有的权限',
  	region : 'center',
  	width : '35%',
  	useArrows: true,
    store: rolePowerStore,
    rootVisible: true,   
    multiSelect: true,  
    singleExpand: false,
    disabled:true,
    split : true,
    minWidth: 175,
    tbar :[
   {
    	text : "注册权限",
    	handler : function(){
    		addPowerToRole();
    	}
    },
    {
    	text : "注销权限",
    	handler : function(){
    		deletePowerToRole();
    	}
    }
    ],
    listeners:{
    	'checkchange' : function(node,checked,eOpts){
			if(componentWin.isHidden() ){
		    globalNode = node;
			}
		},
    	'cellcontextmenu':function( treePanel,td, cellIndex, record, tr, rowIndex, e, eOpts ){
			    e.preventDefault();
				if (globalNode == null) {
					return;
				}
				checked = record.get("checked");

				if (globalNode.get('id') == record.get('id')) {
						if (globalNode.hasChildNodes()) {
							for (var j = 0; j < globalNode.childNodes.length; j++) {
								checkChildrenNode(globalNode.childNodes[j]);
								globalNode.childNodes[j].set('checked', checked);
							}
						}
				}
			}
    }
});

var checkChildrenNode = function(node){
		if (node.hasChildNodes()) {
			for (var j = 0; j < node.childNodes.length; j++) {
				checkChildrenNode(node.childNodes[j]);
				node.childNodes[j].set('checked', globalNode.get('checked'));
			}
		}
}

var sysRoleGrid=Ext.create('Ext.grid.Panel',{
	store : sysRoleStore,
	multiSelect :true,
	frame : true,
	split : true,
	minWidth : 120,
	selModel :'checkboxmodel',
    selType :'checkboxmodel',
	title:'所有角色',
	region : 'west',
	width : '30%',
    veiwConfig :
    {
	    stripeRows : true
	},
	columns : [
	{text : 'id', dataIndex :'roleId',sortable :true,hidden : true},
	{text : '角色名', dataIndex :'description',sortable :true}
	],
	listeners : {
		'select' : function(RowModel, record, index, eOpts){
			if(record != null){
				globalRoleId = record.get('roleId');
				searchPower(record);
				rolePowerTree.setDisabled(false);
			}
		}
    }
});


 var powerInfoFrom=Ext.create("Ext.form.Panel",{
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
			itemId:'powerInfo',
			collapsible: true,
			maxHeight:400,
			align : 'center',
			title : '权限信息',
			items : [
		{
            xtype:'textfield', 
            itemId:'text',
            border:false,
            fieldLabel : "权限名称",
            width:350,
            name:'text'
        },
        {
            xtype:'textfield', 
            itemId:'parentPower',
            border:false,
            readOnly:true,
            width:350,
            fieldLabel : "父级权限",
            name:'parentPower'
        },
        {
        	xtype:'combobox',
    	    itemId:'powerType',
            border:false,
            width:350,
            store : powerTypeStore,
            fieldLabel:"类型",
			valueField : 'typeId',
			displayField : 'typeName',
			emptyText : '选择类型..',
            editable:false,
            name:'powerType',
            listeners:{
            select : function(combo, records, eOpts){
            	    var type = records[0].get('typeId');
            	    /*if(type == "1"){
            	        powerInfoFrom.down("#method").setDisabled(false);
            	        powerInfoFrom.down("#url").setDisabled(true);
            	    }else if(type == "2"){
            	    	powerInfoFrom.down("#method").setDisabled(true);
            	        powerInfoFrom.down("#url").setDisabled(false);
            	    }*/
                }
            }
        },
        {
            xtype:'textfield', 
            itemId:'url',
            border:false,
            disabled :false,
            width:350,
            fieldLabel : "url地址",
            name:'url'
        },
        {
            xtype:'textfield', 
            itemId:'method',
            border:false,
            disabled :false,
            width:350,
            fieldLabel : "菜单对应函数",
            name:'method'
        },
        {
            xtype:'textareafield', 
            itemId:'description',
            border:false,
            width:350,
            fieldLabel : "描述",
            name:'description'
        }
    ]
    }
	],
	buttons :[
	{text:"添加",itemId:"add",
	 handler:function(){
	 	if(this.up('form').getForm().isValid()){
	 	addOrEditSysPower("add");
	 	}
	}
	},
	{text:"修改",itemId:"edit",
	 handler:function(){
	 	if(this.up('form').getForm().isValid()){
	 	addOrEditSysPower("edit");
	 	}
	}
	},
	{
	text:"重置",itemId:"reset",
	handler:function(){
		this.up('form').getForm().reset();
	}
	}
	]
})	;		
		    

var searchPower=function(record){
	Url = '../sysPower/findPowerByRoleIdAndPowerId.action?roleId='+globalRoleId;
				var searchProxy = new Ext.data.HttpProxy(
					{
						type : 'ajax',
						url : Url,
						reader : {
							type : 'json',
							root : 'list',
							totalProperty : 'total'
						}
					});
			rolePowerTree.setTitle('【'+record.get('description')+'】拥有的权限');
			rolePowerStore.setProxy(searchProxy);
			rolePowerStore.load();
}

var addPowerToRole = function(){
	var extParam = {};
	var powerIds = "";
	var roleIds = "";
	var powerDatas = powerTree.getView().getChecked();
	var roleSM= sysRoleGrid.getSelectionModel();
	var roleDatas = roleSM.getSelection();
	for(i=0;i<roleDatas.length;i++){
		if(i == roleDatas.length-1){
			roleIds = roleIds+roleDatas[i].get('roleId');
		}else{
			roleIds = roleIds+roleDatas[i].get('roleId')+"`";
		}
	}	
	for(i=0;i<powerDatas.length;i++){
		if(i == powerDatas.length-1){
			powerIds = powerIds+powerDatas[i].get('id');
		}else{
			powerIds = powerIds+powerDatas[i].get('id')+"`";
		}
	}
	extParam.extJsonList = powerIds;
	extParam.extJsonList2 = roleIds;
	Ext.Ajax.request({
	url : "../sysPower/addPowerToRole.action",
    params:{
		extParam : Ext.JSON.encode(extParam)
	},
	method : "POST",
	success : function(){
		rolePowerStore.load();
	}
		
	})
}

var deletePowerToRole = function(){
	var extParam = {};
	var datas = rolePowerTree.getView().getChecked();
	extParam.param1 = globalRoleId;
	var powerIds = "";
	for(i=0;i<datas.length;i++){
		if(i == datas.length-1){
			powerIds = powerIds+datas[i].get('id');
		}else{
			powerIds = powerIds+datas[i].get('id')+"`";
		}
	}
	extParam.extJsonList = powerIds;
	Ext.Ajax.request({
	url : "../sysPower/deletePowerToRole.action",
    params:{
		extParam : Ext.JSON.encode(extParam)
	},
	method : "POST",
	success : function(){
		rolePowerStore.load();
	}
		
	})
}




var addOrEditSysPower = function(param){
	var extParam = {};
	var extJson = {};
	var url = "";
	extJson.text = powerInfoFrom.down("#text").getValue();
	extJson.method = powerInfoFrom.down("#method").getValue();
	extJson.url = powerInfoFrom.down("#url").getValue();
	extJson.powerType = powerInfoFrom.down("#powerType").getValue();
	extJson.description = powerInfoFrom.down("#description").getValue();
	if(param == "add"){
		url = "../sysPower/addSysPower.action";
		extParam.param1 = globalParentPowerId;
	}else if(param  == "edit"){
		url = "../sysPower/editSysPower.action"
		extParam.param1 = globalParentPowerId;
		extJson.id = globalPowerId;
	}
	extParam.extJsons = Ext.JSON.encode(extJson);
	Ext.Ajax.request({
	url : url,
    params:{
		extParam : Ext.JSON.encode(extParam)
	},
	method : "POST",
	success : function(extMessage){
		var json = Ext.JSON.decode(extMessage.responseText);
		if (json.successOrFalse == "success") {
			Ext.example.msg("提示",json.meassage);
		    powerStore.load();
		    componentWin.hide();
		}else if(json.successOrFalse == "false"){
			Ext.Msg.alert("提示",json.meassage);
		}
	}
		
	});
}

var deletePower = function(){
	var extParam = {};
	var datas = powerTree.getView().getChecked();
	var powerIds = "";
	for(i=0;i<datas.length;i++){
		if(i == datas.length-1){
			powerIds = powerIds+datas[i].get('id');
		}else{
			powerIds = powerIds+datas[i].get('id')+"`";
		}
	}
	extParam.extJsonList = powerIds;
	Ext.Ajax.request({
	url : "../sysPower/deleteSysPower.action",
    params:{
		extParam : Ext.JSON.encode(extParam)
	},
	method : "POST",
	success : function(){
		powerStore.load();
	}
		
	})
}


	var componentWin = Ext.create("Ext.Window",{
	       width : 600,
	       autoScroll:true,
	       title : '添加权限',
	       border : false,
	       layout : 'fit',
 	       closeAction:'hide',
 	       items :[powerInfoFrom]
    });

	var showPanel = Ext.create('Ext.panel.Panel', {
		anchor : "100% 100%",
		layout : 'border',
		split : true,
		items : [sysRoleGrid,rolePowerTree,powerTree]
		});	
		
	return showPanel;
}