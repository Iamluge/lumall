package com.lumall.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.lumall.common.pojo.EasyUIDataGridResult;
import com.lumall.mapper.TbItemParamMapper;
import com.lumall.pojo.TbItem;
import com.lumall.pojo.TbItemExample;
import com.lumall.pojo.TbItemParam;
import com.lumall.pojo.TbItemParamExample;
import com.lumall.service.ItemParamService;
@Service
public class ItemParamServiceImpl implements ItemParamService{
     @Autowired
	private TbItemParamMapper itemParamMapper;
	@Override
	public EasyUIDataGridResult findEasyUIDataGridResult(int page, int row) {
		PageHelper.startPage(page, row);
		TbItemParamExample example = new TbItemParamExample();
		List<TbItemParam> list = itemParamMapper.selectByExampleWithBLOBs(example);
		
		EasyUIDataGridResult result = new EasyUIDataGridResult();
		result.setRows(list);
		PageInfo<TbItemParam> pageInfo = new PageInfo<>(list);
		long total = pageInfo.getTotal();
		result.setTotal(total);
		return result;
		
	}
	

}
