/**
 * Created by IntelliJ IDEA.
 * User: lanjs
 * Date: 2012-03-12
 * Time: 下午8:31
 * 加载所有 ExtJS-Excel导出需要的 .js 及其 ExtJS模块
 *
 * 此文件名,及其目录结构不要随意修改   存在引用&依赖关系 Button.js
 */


(function() {

    var scripts = document.getElementsByTagName('script'),
        host = window.location.hostname,
        path, i, ln, scriptSrc, match;

    for (i = 0,ln = scripts.length; i < ln; i++) {
        scriptSrc = scripts[i].src;

        match = scriptSrc.match(/export-all\.js$/);

        if (match) {
            path = scriptSrc.substring(0, scriptSrc.length - match[0].length);
            break;
        }
    }


    Ext.Loader.setConfig({ enabled: true });
    Ext.Loader.setPath('Ext.ux.exporter', path + 'exporter');
    Ext.require([
        'Ext.grid.*',
        'Ext.data.*',
        'Ext.util.*',
        'Ext.ux.exporter.Exporter'
    ]);

    document.write('<script type="text/javascript" src="' + path + 'exporter/downloadify.min.js"></script>');
    document.write('<script type="text/javascript" src="' + path + 'exporter/swfobject.js"></script>');
})();