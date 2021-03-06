package com.lumall.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.lumall.common.pojo.EasyUIDataGridResult;
import com.lumall.common.util.E3Result;
import com.lumall.content.service.ContentService;
import com.lumall.pojo.TbContent;

@Controller
public class ContentCotroller {
	@Autowired
	private ContentService cotentService;
@RequestMapping("/content/query/list")
@ResponseBody
public EasyUIDataGridResult findContentList(Integer page, Integer rows){
	return cotentService.findContentList(page, rows);
}
@RequestMapping("/content/save")
@ResponseBody
public E3Result addContent(TbContent content){
	return cotentService.addContent(content);
}

@RequestMapping("/rest/content/edit")
@ResponseBody
public E3Result editContent(TbContent content){
	return cotentService.editContent(content);
}
@RequestMapping("/content/delete")
@ResponseBody
public E3Result deleteContent(String ids){
	return cotentService.deleteContent(ids);
}

}
