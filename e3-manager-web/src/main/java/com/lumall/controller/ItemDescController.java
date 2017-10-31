package com.lumall.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.lumall.common.util.E3Result;
import com.lumall.pojo.TbItem;
import com.lumall.service.ItemDescService;
import com.lumall.service.ItemService;
/*
 * 因为商品规格和商品描述的内容不多，所以把他们合并在一个controller写
 */

@Controller
public class ItemDescController {
	@Autowired
	private ItemDescService itemDescService;
	@Autowired
	private ItemService itemService;

	@RequestMapping("/rest/item/query/item/desc/{itemId}")
	@ResponseBody
	public E3Result getItemDescById(@PathVariable Long itemId) {

		return itemDescService.findItemDesc(itemId);
	}

	@RequestMapping("/rest/item/param/item/query/{itemId}")
	@ResponseBody
	public E3Result getItemById2(@PathVariable Long itemId) {
		/*
		 * 从itemservice里查出cid再查paramdata
		 */

		TbItem item = itemService.tbItem(itemId);
		// System.out.println(itemId+"cid="+item.getCid());
		return itemDescService.findItemParam(item.getCid());
	}
}
