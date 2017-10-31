package com.lumall.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lumall.common.pojo.EasyUIDataTreeNode;
import com.lumall.mapper.TbItemCatMapper;
import com.lumall.pojo.TbItemCat;
import com.lumall.pojo.TbItemCatExample;
import com.lumall.pojo.TbItemCatExample.Criteria;
import com.lumall.service.ItemCatService;
@Service
public class ItemCatServiceImpl implements ItemCatService{

	@Autowired
	private TbItemCatMapper ItemCatService;
	@Override
	public List<EasyUIDataTreeNode> getItemByParentId(long parentid) {
		
		TbItemCatExample example=new TbItemCatExample();
	     Criteria criteria=example.createCriteria();
	     criteria.andParentIdEqualTo(parentid);
	     //执行查询
	    List<TbItemCat> list=ItemCatService.selectByExample(example);
	     List<EasyUIDataTreeNode> result=new ArrayList<>();
	     for(TbItemCat tbItemCat:list)
	     {
	    	EasyUIDataTreeNode node=new EasyUIDataTreeNode();
	    	node.setId(tbItemCat.getId());
	    	node.setText(tbItemCat.getName());
	    	node.setState(tbItemCat.getIsParent()?"closed":"open");
	    	result.add(node);
	     }
		return result;
	}

}
