/**
 * @class Ext.ux.Exporter.Button
 * @extends Ext.Component
 * @author Nige White, with modifications from Ed Spencer, with modifications from iwiznia.
 * Specialised Button class that allows downloading of data via data: urls.
 * Internally, this is just a link.
 * Pass it either an Ext.Component subclass with a 'store' property, or just a store or nothing and it will try to grab the first parent of this button that is a grid or tree panel:
 * new Ext.ux.Exporter.Button({component: someGrid});
 * new Ext.ux.Exporter.Button({store: someStore});
 * @cfg {Ext.Component} component The component the store is bound to
 * @cfg {Ext.data.Store} store The store to export (alternatively, pass a component with a getStore method)
 */
(function(){
     var scripts = document.getElementsByTagName('script'),
             host = window.location.hostname,
             path, i, ln, scriptSrc, match;

         for (i = 0, ln = scripts.length; i < ln; i++) {
             scriptSrc = scripts[i].src;

             match = scriptSrc.match(/export-all\.js$/);

             if (match) {
                 path = scriptSrc.substring(0, scriptSrc.length - match[0].length);
                 break;
             }
         }

})()
Ext.define("Ext.ux.exporter.Button", {
    extend: "Ext.Component",
    //extend:'Ext.button.Button',
	alias: "widget.exporterbutton",
	text:'导出',
    html: '<p></p>',
    config: {
        swfPath: '/downloadify.swf',
        downloadImage: '/download.png',
        width: 62,
        height: 22,
        text:'导出',
        downloadName: "Excel导出"
    },

    constructor: function(config) {
      config = config || {};



      this.initConfig();
      Ext.ux.exporter.Button.superclass.constructor.call(this, config);

      var self = this;
      this.on("afterrender", function() { // We wait for the combo to be rendered, so we can look up to grab the component containing it
          self.setComponent(self.store || self.component || self.up("gridpanel") || self.up("treepanel"), config);
      });
    },

    reconfig: function(config) {
        this.constructor(config);
    },
    setComponent: function(component, config) {

        this.component = component;
        this.store = !component.is ? component : component.getStore(); // only components or stores, if it doesn't respond to is method, it's a store
        config.component=this.component;
        config.store=this.store;
        this.setDownloadify(config);
    },
    /**
     * 获取当前项目路径
     */
    getRelPath:function(){
     var scripts = document.getElementsByTagName('script'),
             host = window.location.hostname,
             path, i, ln, scriptSrc, match;

         for (i = 0, ln = scripts.length; i < ln; i++) {
             scriptSrc = scripts[i].src;

             match = scriptSrc.match(/export-all\.js$/);

             if (match) {
                 path = scriptSrc.substring(0, scriptSrc.length - match[0].length);
                 break;
             }
         }
         return   path;
    },
    
    setDownloadify: function(config) {
        var self = this;
        Downloadify.create(this.el.down('p').id,{
            filename: function() {
              return self.getDownloadName() + "." + Ext.ux.exporter.Exporter.getFormatterByName(self.formatter).extension;
            },
            data: function() {
              return Ext.ux.exporter.Exporter.exportAny(self.component, self.formatter, config);
            },
            transparent: false,

            //lanjs  this.getRelPath()
            swf: this.getRelPath()+this.getSwfPath(),
            downloadImage: this.getRelPath()+this.getDownloadImage(),

            width: this.getWidth(),
            height: this.getHeight(),
            transparent: true,
            append: false
        });
    }
});