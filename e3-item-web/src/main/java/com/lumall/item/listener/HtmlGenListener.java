package com.lumall.item.listener;

import java.io.File;
import java.io.FileWriter;
import java.io.Writer;
import java.util.HashMap;
import java.util.Map;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.TextMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;

import com.lumall.item.pojo.Item;
import com.lumall.pojo.TbItem;
import com.lumall.pojo.TbItemDesc;
import com.lumall.service.ItemService;

import freemarker.ext.beans.DateModel;
import freemarker.template.Configuration;
import freemarker.template.Template;

public class HtmlGenListener  implements MessageListener{
	@Autowired
	private FreeMarkerConfigurer freeMarkerConfigurer;
	@Autowired
	private ItemService itemService;
	@Value("${HTML_GEN_PATH}")
	private String HTML_GEN_PATH;

	@Override
	public void onMessage(Message message) {
		//创建一个模板
		//从消息中取得商品ID
		try {
		TextMessage textMessage = (TextMessage) message;
		String text=textMessage.getText();
		long itemId=new Long(text);	
		//等待事务提交
		Thread.sleep(1000);
		//根据商品ID查询商品信息，商品的基本信息和商品的描述
		TbItem tbItem=itemService.tbItem(itemId);
		Item item=new Item(tbItem);
		//取出商品描述
		TbItemDesc tbItemDesc=itemService.geTbItemDesc(itemId);
		//创建一个数据集合，把商品数据封装
		Map data = new HashMap<>();
		data.put("item", item);
		data.put("itemDesc", tbItemDesc);
		//加载模板对象
		Configuration configuration=freeMarkerConfigurer.getConfiguration();
		Template template=configuration.getTemplate("item.ftl");
		//创建一个输出流，指定输出的目录及文件名称
		Writer writer=new FileWriter(HTML_GEN_PATH + itemId + ".html");
		//生成静态页面
		template.process(data, writer);
		//关闭流
		writer.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	
		
	}
	

}
