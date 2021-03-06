package com.lumall.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.lumall.common.pojo.EasyUIDataTreeNode;
import com.lumall.service.ItemCatService;

@Controller
public class ItemCatController {
@Autowired
private ItemCatService itemCatService;
@RequestMapping("/item/cat/list")
@ResponseBody
public List<EasyUIDataTreeNode> treeNode(@RequestParam(value="id",defaultValue="0")Long parentid){
	
	return itemCatService.getItemByParentId(parentid);
}
}
