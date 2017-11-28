package com.lumall.search.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.lumall.common.pojo.SearchResult;
import com.lumall.search.service.SearchService;

@Controller
public class SearchCtroller {
	@Autowired
private SearchService searchService;
	@Value("${PAGE_ROWS}")
	private Integer PAGE_ROWS;

	@RequestMapping("/search")
	public String search(String keyword,@RequestParam(defaultValue="1") Integer page, Model model) throws Exception {
		keyword = new String(keyword.getBytes("iso8859-1"), "utf-8");
		SearchResult searchResult=searchService.search(keyword, page, PAGE_ROWS);
		//把结果传递给jsp页面
		model.addAttribute("query", keyword);
		model.addAttribute("totalPages", searchResult.getTotalPages());
		model.addAttribute("recourdCount", searchResult.getRecourdCount());
		model.addAttribute("page", page);
		model.addAttribute("itemList", searchResult.getItemList());
		//返回逻辑视图
		return "search";

	
	}
}
