package com.lumall.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.lumall.common.pojo.EasyUIDataGridResult;
import com.lumall.service.ItemParamService;

@Controller
public class ItemParamController {
@Autowired
private ItemParamService paramService;
//TODO 数据未完全显示，2017-10-28;19:42
@RequestMapping("/item/param/list")
@ResponseBody
public EasyUIDataGridResult getItemList(Integer page, Integer rows) {
	EasyUIDataGridResult result = paramService.findEasyUIDataGridResult(page, rows);
	return result;
}
}
