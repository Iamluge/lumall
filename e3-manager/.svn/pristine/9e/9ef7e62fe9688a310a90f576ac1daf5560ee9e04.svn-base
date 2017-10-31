package com.lumall.page;

import java.util.List;

import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.alibaba.dubbo.container.page.PageHandler;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.lumall.mapper.TbItemMapper;
import com.lumall.pojo.TbItem;
import com.lumall.pojo.TbItemExample;

public class PageTest {
//@Test
public void testPageHelper(){
	ApplicationContext applicationContext=new ClassPathXmlApplicationContext("classpath:spring/applicationContext-dao.xml");
//从容器中获取mapper代理对象
	TbItemMapper tbItemMapper=applicationContext.getBean(TbItemMapper.class);
	
    PageHelper.startPage(1,10);
    TbItemExample tbItemExample=new TbItemExample();
	
	List<TbItem> items=tbItemMapper.selectByExample(tbItemExample);
	PageInfo<TbItem> pageInfo=new PageInfo<>(items);
	System.out.println(pageInfo.getTotal());
	System.out.println(pageInfo.getSize());
	System.out.println(pageInfo.getPageSize());
	
	
	
}
}
