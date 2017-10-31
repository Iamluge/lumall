package com.lumall.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.lumall.common.pojo.EasyUIDataGridResult;
import com.lumall.common.util.E3Result;
import com.lumall.pojo.TbItem;
import com.lumall.service.ItemService;

@Controller
public class ItemController {

	@Autowired
	private ItemService itemService;
	/*
	 * 按商品编号显示商品
	 */

	@RequestMapping("/item/{itemId}")
	@ResponseBody
	public TbItem getItemById(@PathVariable Long itemId) {
		TbItem tbItem = itemService.tbItem(itemId);
		return tbItem;
	}

	/*
	 * 
	 */
	@RequestMapping("/item/list")
	@ResponseBody
	public EasyUIDataGridResult getItemList(Integer page, Integer rows) {
		EasyUIDataGridResult result = itemService.findEasyUIDataGridResult(page, rows);
		return result;
	}

	/*
	 * 添加商品
	 */
	@RequestMapping(value = "/item/save", method = RequestMethod.POST)
	@ResponseBody
	public E3Result addItem(TbItem item, String desc) {
		E3Result result = itemService.addItem(item, desc);
		return result;
	}

	/*
	 * 商品编辑
	 */
	@RequestMapping(value = "/rest/item/update", method = RequestMethod.POST)
	@ResponseBody
	public E3Result update(TbItem item, String desc) {
		E3Result result = itemService.editItem(item, desc);
		return result;
	}

	/*
	 * 商品编辑测试/rest/page/item-edit
	 */
	@RequestMapping(value = "/rest/page/item-edit")
	public String edit() {
		return "item-edit";
	}

	/*
	 * 商品下架
	 */
	@RequestMapping("/rest/item/instock")
	@ResponseBody
	public E3Result down(String ids) {
		// System.out.println(ids);
		return itemService.updateStatus(ids, (byte) 2);
	}

	/*
	 * 上架商品
	 */
	@RequestMapping("/rest/item/reshelf")
	@ResponseBody
	public E3Result up(String ids) {
		return itemService.updateStatus(ids, (byte) 1);
	}

	/*
	 * 删除
	 */
	@RequestMapping("/rest/item/delete")
	@ResponseBody
	public E3Result delete(String ids) {
		return itemService.updateStatus(ids, (byte) 3);
	}
}
