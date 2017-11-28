Ext.require([ 
    'Ext.grid.Panel', 
    'Ext.panel.Panel', 
    'Ext.tab.Panel',
    'Ext.window.Window',
    'Ext.container.Viewport',
    'Ext.*'
]); 


Ext.onReady(function()
{
Ext.QuickTips.init();

var sessionUser = {};
var sessionCompany ={};
var trademark = "";
var headImage = "";
var role=""
Ext.Ajax.request({
	url:'../sysUser/findSysUserInfo.action',
	method:'GET',
    async: false,
	success : function(extMessage){
		var json = Ext.JSON.decode(extMessage.responseText);
		if(json.successOrFalse == "false"){
			Ext.Msg.alert("提示",json.meassage);
		}else if(json.successOrFalse == "success"){
			sessionUser = Ext.JSON.decode(json.extJson);
			role = Ext.JSON.decode(json.param);
			sessionCompany = sessionUser.company;
			if(sessionCompany.headImage != "undefined" && sessionCompany.headImage != null && sessionCompany.headImage != ""){
				headImage = '<img src="http://localhost:8080/file/'+sessionCompany.headImage+'" width ="100%" height="100" align="center"/>' ;
			}else{
				headImage = "";
			}
			
		}
	}
		
	})


var headPanel = Ext.create('Ext.panel.Panel',{
 
        name:'bantou',
        align:'center',
        region : 'center',
        height : 120,
        border : false,
        layout : 'border',
        items:[
        {
        	xtype : 'panel',
        	border : false,
        	height :100,
        	region : 'center',
        	align : 'center',
        	html :headImage
    
        },
        {
        	xtype : 'panel',
        	border : false,
        	height :20,
        	region : 'south',
        	layout : 'column',
        	align : 'right',
        	bodyCls : 'bgcl02',
        	items :[
        	{
        		columnWidth :.10,
        		xtype : 'label',
        		border : false,
        		itemId : 'userName',
				text : "用户:"+sessionUser.userName+" "//'当前用户:',
        	},
        	{
        		columnWidth :.30,
        		xtype : 'label',
        		border : false,
        		itemId : 'companyName',
				text : "商家:"+sessionCompany.companyName+" "//'所属商家:',
        	}
        	/*,
        	{
        		xtype : 'label',
        		border : false,	
        		align : 'right',
        		width:"20%",
				html : '<a href="../'+sessionCompany.pinyinEncoding+'.htm" target="_blank">进入企业诚信主页</a>'
        	}*/
        	]
        	
        },
        {
        	xtype : 'panel',
        	border : false,
        	height :100,
        	width:100,
        	region : 'east',
        	align : 'center',
        	bodyCls : 'bgcl01'
    
        }
        ]

 })


 

 
 var powerStore = Ext.create('Ext.data.TreeStore', {
    autoLoad : true,
    autoDestroy : true,
    folderSort :true,
    fields :[
    	"id",
		"text",
		'powerType',
		'url',
		"method",
		"processorCategroyId",
		"productCategoryId",
		"status"
    ],
    proxy: {
        type: 'ajax',
        url: '../sysPower/findMenuByUserIdAndPowerId.action',
        reader: {
            type: 'json'
        }
    },
    root: { 
    id : '1000',
    expanded: true 
    },
    sorters : [
	{
		property : 'id',
		direction : 'ASC'
	}]
 });

/*var processorStore = Ext.create('Ext.data.Store',{
		autoLoad : false,
		autoDestroy : true,
		pageSize : 80,
		fields : [
		"categoryId",
		"categoryName"
		],
		proxy : {
			type : 'ajax',
			url : '',
			reader : {
				type : 'json',
				root : 'list',
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
 
var productStore = Ext.create('Ext.data.Store',{
		autoLoad : false,
		autoDestroy : true,
		pageSize : 80,
		fields : [
		"categoryId",
		"categoryName"
		],
		proxy : {
			type : 'ajax',
			url : '../productCategory/findUserHasProdCategoryPower.action',
			reader : {
				type : 'json',
				root : 'list',
				totalProperty : 'total'
			}
		},
		sorters : [
			{
				property : 'categoryId',
				direction : 'ASC'
			}
		]
});*/
 
 var menuTree = Ext.create('Ext.tree.Panel', {
  	title :'菜单栏',
  	useArrows: true,
  	border : false,
    store: powerStore,
    selModel :'cellmodel',
    autoScroll: true,
    enableColumnHide :false,
    enableColumnResize :true,
    rootVisible: false,
    split : true,
    minWidth: 175,
    width:'100%',
    border : false,
    region : 'center',
    dockedItems : [{
    xtype : 'toolbar',
    dock : 'top',
    items : [
    /*{
     xtype:'combobox',
     itemId : 'productCombobox',
	 border : false,
	 width : 170,
	 store : productStore,
	 valueField : 'categoryId',
	 displayField : 'categoryName',
	 emptyText : '请选择产品..',
	 editable : false,
	 listeners:{
	 	select : function(combo, records, eOpts) {
			var searchProxy = new Ext.data.HttpProxy(
					{
						type : 'ajax',
						url : '../proCategroy/findUserHasProcCategoryPower.action?categoryId='+records[0].get('categoryId'),
						reader : {
							type : 'json',
							root : 'list',
							totalProperty : 'total'
						}
					});
			processorStore.setProxy(searchProxy);
			processorStore.load();
			menuTree.down("#processorCombobox").setDisabled(false);
	}
	}
    }
    ]
    },{
    xtype : 'toolbar',
    dock : 'top',
    items : [
    {
     xtype:'combobox',
     itemId : 'processorCombobox',
	 border : false,
	 width : 170,
	 store : processorStore,
	 disabled: true,
	 valueField : 'categoryId',
	 displayField : 'categoryName',
	 emptyText : '请选择流程..',
	 editable : false,
	 listeners :{
	 	select : function(combo, records, eOpts) {
	}
	 }
    }*/
    ]
    }
    ],
    columns:[
    {
    	enableColumnHide :false,
    	xtype: 'treecolumn',
    	dataIndex : 'text',
    	width :300,
    	renderer: function(value){
        return '<font size=3px face=黑体>'+value+'</font>';
    }
    }
    ],
    listeners :{
    	
    	'itemclick':function(thisView,record, item,index,e,eOpts ){
    	
    	if(record.get('powerType') == "4"){
    		  Ext.Ajax.request({
				url : '../proCategroy/setProcCategorySession.action',
				method : 'POST',
				async : false,
				params : {
					categoryId : record.get('processorCategroyId')
				},
				success : function(extMessage) {

				}
			})
    	}
    	if((record.get('powerType') == "1" || record.get('powerType') == "4")
    	&&record.get('method')!=null&&record.get('method')!=""){
    		if (Ext.getCmp(record.get('id')) == null) {
                    tabPanels.add({
                        layout: "fit",
                        title: record.get('text'),
                        id: record.get('id'),
                        closable: true,
                        items: eval(record.get('method'))
                    }).show();
                } else {
                    Ext.getCmp(record.get('id')).show();
            }
    	}else if(record.get('powerType') == "1" &&record.get('url')!=null&&record.get('url')!=""
    	&&record.get('status')==null
    	){
    		    Ext.Msg.show({
							title : '提示',
							msg : '确定'+record.get('text')+'？',
							buttonText : {
								yes : '确定',
								no : '取消'
							},
							buttons : Ext.Msg.YESNO,
							fn : function(btn) {
								if (btn == "yes") {
									window.location.href = record.get('url');
								} else if (btn == "no") {
									return;
								}
							}
						});  
    	}else if(record.get('powerType') == "1" &&record.get('url')!=null&&record.get('url')!=""
    			&&record.get('status')=="1"){
    		javascript:window.open('../'+sessionCompany.pinyinEncoding+'.htm',"_blank") 
    	}
    	
    	},
    	'cellclick':function(thisView, td, cellIndex, record, tr, rowIndex, e, eOpts ){
    		if(record.get('powerType') == "3"){
    		  Ext.Ajax.request({
				url : '../productCategory/setProdCategorySession.action',
				method : 'POST',
				async : false,
				params : {
					productCategoryId : record.get('productCategoryId')
				},
				success : function(extMessage) {

				}
			})
    		}else if(record.get('powerType') == "4"){
    		  Ext.Ajax.request({
				url : '../proCategroy/setProcCategorySession.action',
				method : 'POST',
				async : false,
				params : {
					categoryId : record.get('processorCategroyId')
				},
				success : function(extMessage) {

				}
			})
    		}
    	}
    }
});

var createTabPanel = function(sessionPower){
	if(sessionPower==null){
		return;
	}
	else{
		if (Ext.getCmp(sessionPower.id) == null) {
	        tabPanels.add({
	            layout: "fit",
	            title: sessionPower.text,
	            id: sessionPower.id,
	            closable: true,
	            items: eval(sessionPower.method)
	        }).show();
	    } else {
	        Ext.getCmp(sessionPower.id).show();
		}
	}
}
	
var homePage = null;
/**
 * 商家管理员
 */

if(role=="1"){
	homePage = createHomePage(createTabPanel);
}
/**
 * 其他角色
 */
else{
 	homePage = createHomePage2(createTabPanel);
}




var tabPanels = Ext.create("Ext.tab.Panel", {
		//id : 'tabsPanel',
		resizeTabs : true,
		enableTabScroll : false,
		deferredRender:false,
		autoScroll: false,
		anchor:"100% 100%",
		items : [homePage],
		defaults : {
			autoScroll : true
			// bodyPadding: 10
		},
		plugins : Ext.create('Ext.ux.TabCloseMenu', {
					closeTabText : '关闭当前',
					closeOthersTabsText : '关闭其他',
					closeAllTabsText : '关闭所有'
	   })
	});
	

var centerMain = Ext.create('Ext.panel.Panel', {
				region : 'center',
				split : true,
				// width:'',
				height : '80%',
				layout : 'anchor',
				id : 'centerL',
				items : [tabPanels]
});


var viewport=Ext.create("Ext.container.Viewport",{
	layout : 'border',
	renderTo : 'viewport',
	autLoad : true,
	split : true,
	frame : true,
	items : [
	{
		collapsible : false,
		region : 'north',
		border : false,
		//html : '<br><center><font1>农产品溯源系统</font1></center>',
		items : headPanel,
		heigth :'20%'
	},
	{
		layout : 'fit',
		collapsible : false,
		region : 'west',
	    items : menuTree,
		width :184
	},
	{
		layout : 'fit',
		collapsible : false,
		region :'center',
		items : centerMain
	}
	]
});
}
);
