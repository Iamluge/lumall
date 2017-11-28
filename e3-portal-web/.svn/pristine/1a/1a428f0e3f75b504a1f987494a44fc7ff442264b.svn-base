package com.lumall.portal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.lumall.content.service.ContentService;
import com.lumall.pojo.TbContent;

@Controller
public class IndexController {
	@Value("${LUNBO_CATEGORYID}")
	private Long LUNBO_CATEGORYID;
	@Autowired
	private ContentService contentService;
@RequestMapping("/index")
public String index(Model model){
	List<TbContent> ad1List=contentService.findContentList(LUNBO_CATEGORYID);
	model.addAttribute("ad1List", ad1List);
	return "index";
}
}
