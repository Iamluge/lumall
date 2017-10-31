package com.lumall.dubbo;

import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class TestDubbo {
	/*
	 * 测试dubbo服务不需要tomcat照样能用，tomcat的作用只是初始化spring容器
	 */
//@Test
public void testDubboNoTomcat()throws Exception{
	ApplicationContext applicationContext=new ClassPathXmlApplicationContext("classpath:spring/applicationContext-*");
	System.out.println("服务已经启动，按回车结束服务");
	System.in.read();
	System.out.println("服务已经停止！！");
}
}
