package com.lumall.freemarkertest;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.junit.Test;

import freemarker.template.Configuration;
import freemarker.template.Template;

public class TestFreeMarker {

	@Test
	public void testHelloFreeMarket() throws Exception{
//		第一步：创建一个Configuration对象，直接new一个对象。构造方法的参数就是freemarker对于的版本号。
		Configuration configuration=new Configuration(Configuration.getVersion());
//		第二步：设置模板文件所在的路径。
		configuration.setDirectoryForTemplateLoading(new File("D:/javaee32/template-mars2/e3-item-web/src/main/webapp/WEB-INF/ftl"));
//		第三步：设置模板文件使用的字符集。一般就是utf-8.
		configuration.setDefaultEncoding("UTF-8");
//		第四步：加载一个模板，创建一个模板对象。
		Template template = configuration.getTemplate("hello.ftl");
//		第五步：创建一个模板使用的数据集，可以是pojo也可以是map。一般是Map。
		Map dataModel = new HashMap<>();
		dataModel.put("hello", "the first freemarker!!!");
//		第六步：创建一个Writer对象，一般创建一FileWriter对象，指定生成的文件名。
		Writer writer=new FileWriter(new File("D:/javaee32/temp/hello.html"));
//		第七步：调用模板对象的process方法输出文件。
		template.process(dataModel, writer);
//		第八步：关闭流。
		writer.close();

	}
	@Test
	public void testHelloFreeMarketlist() throws Exception{
//		第一步：创建一个Configuration对象，直接new一个对象。构造方法的参数就是freemarker对于的版本号。
		Configuration configuration=new Configuration(Configuration.getVersion());
//		第二步：设置模板文件所在的路径。
		configuration.setDirectoryForTemplateLoading(new File("D:/javaee32/template-mars2/e3-item-web/src/main/webapp/WEB-INF/ftl"));
//		第三步：设置模板文件使用的字符集。一般就是utf-8.
		configuration.setDefaultEncoding("UTF-8");
//		第四步：加载一个模板，创建一个模板对象。
		Template template = configuration.getTemplate("user.ftl");
//		第五步：创建一个模板使用的数据集，可以是pojo也可以是map。一般是Map。
		Map dataModel = new HashMap<>();
		User user=new User();
		user.setAge("11");
		user.setPassword(1008611);
		user.setUsername("laolu");
		dataModel.put("user", user);
		dataModel.put("date", new Date());
		dataModel.put("val", null);
//		第六步：创建一个Writer对象，一般创建一FileWriter对象，指定生成的文件名。
		Writer writer=new FileWriter(new File("D:/javaee32/temp/hello.html"));
//		第七步：调用模板对象的process方法输出文件。
		template.process(dataModel, writer);
//		第八步：关闭流。
		writer.close();

	}
}
