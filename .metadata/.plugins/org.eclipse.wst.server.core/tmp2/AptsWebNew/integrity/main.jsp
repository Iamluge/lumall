<%@page import="org.apache.struts2.components.Include"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"  import="java.util.*"  
    pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<script src="../integrity/js/jquery-1.8.3.js" type=text/javascript></script>
<script src="../integrity/js/jquery.cross-slide.js" type=text/javascript></script>
<script src="../integrity/js/indexFunction2.js" type="text/javascript"></script>
<script type="text/javascript">
//滚动插件
(function($){
$.fn.extend({
        Scroll:function(opt,callback){
                //参数初始化
                if(!opt) var opt={};
                var _this=this.eq(0).find("ul:first");
                var        lineH=_this.find("li:first").height(), //获取行高
                        line=opt.line?parseInt(opt.line,10):parseInt(this.height()/lineH,10), //每次滚动的行数，默认为一屏，即父容器高度
                        speed=opt.speed?parseInt(opt.speed,10):500, //卷动速度，数值越大，速度越慢（毫秒）
                        timer=opt.timer?parseInt(opt.timer,10):3000; //滚动的时间间隔（毫秒）
                if(line==0) line=1;
                var upHeight=0-line*lineH;
                //滚动函数
                scrollUp=function(){
                        _this.animate({
                                marginTop:upHeight
                        },speed,function(){
                                for(i=1;i<=line;i++){
                                        _this.find("li:first").appendTo(_this);
                                }
                                _this.css({marginTop:0});
                        });
                }
                //鼠标事件绑定
                _this.hover(function(){
                        clearInterval(timerID);
                },function(){
                        timerID=setInterval("scrollUp()",timer);
                }).mouseout();
        }        
})
})(jQuery);

$(document).ready(function(){
        $("#information_content").Scroll({line:4,speed:500,timer:1000});
});
</script>

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>欢迎首页</title>
	<link rel ="stylesheet" type="text/css" href="../integrity/style.css" />
</head>


<body style="margin:0;">
 <div style="width:80%;height:5px;margin:0px auto;padding:0px;background-color:#D4D4D4;"></div>
<div id="bodymain" >
	<div id="nonth">
		<div id="west">
			<div id="jianjieImage"><span style="font-weight:bold;"><font size="4">公司简介</font></span><span id="information_title_p2"><a href="../index/introduction.action" target="main">查看更多...</a></span></div>
			<div id="description">
					<br/>
					<div id="descriptionTest">${company.description}</div>			
	    	</div>
	    </div>
	    
		<div id="main">
			<div id="jianjieImage"><span style="font-weight:bold;"><font size="4">产品列表</font></span><span id="information_title_p2"><a href="../index/product.action" target="main">查看更多...</a></span></div>
			<div id="main1">
			<!-- 图片 -->
			<DIV id=rotator>
				<%
				List<String> list=(List<String>)request.getAttribute("picList");
				%>
  				<script type=text/javascript>
			       jQuery(function($) {$(document).ready(function() {
						$('#rotator').crossSlide(
							{sleep: 2, fade: 1, debug: true},
							[
							 <% for(String s:list){%>
							{src: "http://localhost:8080/file/<%=s%>"},
							
							<%}%>
							]
						);
					});});
		       </script> 
    		</div>
    		</div>
    		<!-- 产品名称 -->
    		<div id="main2">
					<ul>
					<s:iterator value="prodlist">
						<div id="main2List"><li>&nbsp&nbsp&nbsp${categoryName}</li></div>
						<div style="width:100%;height:1px;margin:0px auto;padding:0px;background-color:#D4D4D4;"></div>
					</s:iterator>	
					</ul>	
    		</div>
		</div>
	
	<div id="nouth">
			<div id="nouth1">
				<div id="jianjieImage"><span style="font-weight:bold;"><font size="4">公司承诺</font></span><span id="information_title_p2"><a href="../index/commitment.action" target="main">查看更多...</a></span></div>
				<!--  <marquee align="left" behavior="scroll" direction="up" loop="-1" onMouseOut="this.start()" onMouseOver="this.stop()" scrollamount="1" scrolldelay="60"> -->
							<div id="descriptionTest">${company.commitment}</div>			
				<!-- </marquee> -->
			</div>
		
		<div id="nouth2">
			<div id="nouth21">
				<div id="jianjieImage"><span style="font-weight:bold;"><font size="4">产品流程</font></span></div>
				<!-- 用表格拼接字符串 -->
				<marquee align="left" behavior="scroll" direction="up" loop="-1" scrollamount="1" scrolldelay="60"> 
							<s:iterator value="extProcessorList">
						<div id="ProcessorList">${userName}为${productName}进行${processName}&nbsp&nbsp&nbsp时间：${time}<br/></div>
					</s:iterator>		
				</marquee>
				<%--  <marquee onmouseout=this.start() onmouseover=this.stop() behavior="scroll" direction="up" width="500px" height="200px" SCROLLDELAY="320" >
					<s:iterator value="extProcessorList">
						<div id="ProcessorList">${userName}为${productName}进行${processName}&nbsp&nbsp&nbsp时间：${time}<br/></div>
					</s:iterator>
				</marquee> --%> 
			</div>
			
			<div id="nouth22">
				<div id="jianjieImage"><span style="font-weight:bold;"><font size="4">产品溯源</font></span></div>
				<div class="main-search">
					<form action="" id="search-form"
						method="post">
						<fieldset >
							<input type="text" name="productCode" id="productCode" class="text"
								value="请输入溯源码" onFocus="if(this.value=='请输入溯源码'){this.value=''}"
								onBlur="if(this.value==''){this.value='请输入溯源码'}" /> 
								<a href="../index/traceability.action" target="_top">
								<input
								type="button" class="submit" value=""
								onClick="findProcCategoryList2() "  />
								</a>
						</fieldset>
					</form>
				</div>
				<%-- 	<div class="main-content">
			
			<ul class="acc" id="acc">
				<li>
					<h3>商品基本信息</h3>
					<div class="acc-section">
						<div class="acc-content">
							<h2>商品编码:${productInfo.productCode.productCodeId}</h2>
							<h2>商品名称:${productInfo.productCategory.categoryName}</h2>
							<h2>商品描述:${productInfo.productCategory.categoryDescription}</h2>
							<h2>生产时间:${productInfo.produceDate}</h2>
							<h2>生产商:${productInfo.productCategory.company.companyName}</h2>
						</div>
					</div>
				</li>
			</ul>
		</div> --%>
			</div>
	</div>
	</div>
	</div>
</div> 
</body>
</html>