package com.lumall.service.impl;

import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.lumall.common.util.E3Result;
import com.lumall.mapper.TbItemDescMapper;
import com.lumall.mapper.TbItemParamMapper;
import com.lumall.pojo.TbItemDesc;
import com.lumall.pojo.TbItemParam;
import com.lumall.pojo.TbItemParamExample;
import com.lumall.pojo.TbItemParamExample.Criteria;
import com.lumall.pojo.TbItemParamItem;

import com.lumall.service.ItemDescService;

@Service
public class ItemDescServiceImpl implements ItemDescService{

	@Autowired
	private TbItemParamMapper itemParaMapper;
	@Autowired
	private TbItemDescMapper itemDescMapper;
	@Override
	public E3Result findItemDesc(long id) {
		TbItemDesc itemDesc=itemDescMapper.selectByPrimaryKey(id);
	   return	E3Result.ok(itemDesc);
		
	}
	@Override
	public E3Result findItemParam(long itemId) {
		TbItemParamExample itemParamExample=new TbItemParamExample();
		itemParamExample.createCriteria().andItemCatIdEqualTo(itemId);
		//TODO 这里有点问题查不出paramdata
		List<TbItemParam> list=itemParaMapper.selectByExampleWithBLOBs(itemParamExample);
	
		if(list.size()>0)
		{
		return E3Result.ok(list.get(0));
		}
		return null;
	}

}
