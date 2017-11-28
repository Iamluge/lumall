package com.lumall.item.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.lumall.item.pojo.Item;
import com.lumall.pojo.TbItem;
import com.lumall.pojo.TbItemDesc;
import com.lumall.service.ItemService;

@Controller
public class ItemController {
	@Autowired
	private ItemService itemService;

	@RequestMapping("/item/{itemId}")
	public String getItem(@PathVariable Long itemId, Model model) {
		// 跟据商品id查询商品信息
		TbItem tbItem = itemService.tbItem(itemId);
		// 把TbItem转换成Item对象
		Item item = new Item(tbItem);
		// 根据商品id查询商品描述
		TbItemDesc tbItemDesc = itemService.geTbItemDesc(itemId);
		// 把数据传递给页面
		model.addAttribute("item", item);
		model.addAttribute("itemDesc", tbItemDesc);

		return "item";
	}

}
