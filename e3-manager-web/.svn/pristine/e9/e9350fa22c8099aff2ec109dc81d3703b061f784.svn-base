package com.lumall.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.lumall.common.util.E3Result;
import com.lumall.search.service.ItemListService;

@Controller
public class SolrItemController {
	@Autowired
	private ItemListService listService;
	@RequestMapping("/index/item/import")
	@ResponseBody
	public E3Result importAllItem() {
		return listService.addAllItemToSolr();
	}
}
