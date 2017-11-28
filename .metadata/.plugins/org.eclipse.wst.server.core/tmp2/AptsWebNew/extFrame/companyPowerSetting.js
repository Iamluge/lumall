var createCompanyPowerSetting = function(){

	var globalRoleId = "";
	var globalPowerId = "";
	var globalNode = "";
	
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
			url : '../sysRole/findRoleByCompanyId.action',
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
    autoLoad : false,
    autoDestroy : true,
    folderSort :false,
    fields :[
    	"id",
		"text",
    	"powerType",
    	{name : "checked",type:"boolean"}
    ],
    proxy: {
        type: 'ajax',
        url: '../sysPower/findPowerByComAdminAndPowerId.action',
        reader: {
            type: 'json'
        }
    },
    root: { 
    text : "权限列表",
    id : '1000',
    expanded: false 
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
    text : "权限列表",
    id : '1000',
    expanded: false 
    }
 });
 
  var powerTree = Ext.create('Ext.tree.Panel', {
  	title :'权限列表',
  	region : 'east',
  	width : '35%',
  	useArrows: true,
    store: powerStore,
    rootVisible: true,
    split : true,
    minWidth: 300,
    listeners :{
    	'select' : function( thisView, record, index, eOpts ){
    		globalPowerId = record.get('id');
    	},
    	 'checkchange' : function(node,checked,eOpts){
		    globalNode = node;
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

  var rolePowerTree = Ext.create('Ext.tree.Panel', {
  	title :'拥有的权限',
  	region : 'center',
  	width : '35%',
  	useArrows: true,
  	disabled : true,
    store: rolePowerStore,
    rootVisible: true,
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
		    globalNode = node;
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


	var showPanel = Ext.create('Ext.panel.Panel', {
		anchor : "100% 100%",
		layout : 'border',
		split : true,
		items : [sysRoleGrid,rolePowerTree,powerTree]
		});	
		
	return showPanel;
}