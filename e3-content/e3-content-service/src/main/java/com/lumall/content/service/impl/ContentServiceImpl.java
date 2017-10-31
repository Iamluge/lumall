package com.lumall.content.service.impl;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.lumall.common.pojo.EasyUIDataGridResult;
import com.lumall.common.util.E3Result;
import com.lumall.content.service.ContentService;
import com.lumall.mapper.TbContentMapper;
import com.lumall.pojo.TbContent;
import com.lumall.pojo.TbContentExample;
import com.lumall.pojo.TbItem;
import com.lumall.pojo.TbItemExample;

@Service
public class ContentServiceImpl implements ContentService {
	@Autowired
	private TbContentMapper cotentMapper;

	@Override
	public EasyUIDataGridResult findContentList(Integer page, Integer rows) {
		PageHelper.startPage(page, rows);
		TbContentExample example = new TbContentExample();
		List<TbContent> list = cotentMapper.selectByExample(example);
		EasyUIDataGridResult result = new EasyUIDataGridResult();
		result.setRows(list);
		PageInfo<TbContent> pageInfo = new PageInfo<>(list);
		long total = pageInfo.getTotal();
		result.setTotal(total);
		return result;
	}

	@Override
	public E3Result addContent(TbContent content) {
		content.setCreated(new Date());
		content.setUpdated(new Date());
		cotentMapper.insert(content);
		return E3Result.ok();
	}

	@Override
	public E3Result editContent(TbContent content) {
		content.setUpdated(new Date());
		cotentMapper.updateByPrimaryKey(content);
		return E3Result.ok();
	}

	@Override
	public E3Result deleteContent(String ids) {
		String[] id = ids.split(",");
		for (int i = 0; i < id.length; i++) {
			cotentMapper.deleteByPrimaryKey(Long.parseLong(id[i]));
		}
		return E3Result.ok();
	}

	/*
	 * 前台轮播图要的数据
	 */
	@Override
	public List<TbContent> findContentList(long categoryId) {
		TbContentExample example = new TbContentExample();
        example.createCriteria().andCategoryIdEqualTo(categoryId);
		List<TbContent> list=cotentMapper.selectByExample(example);
		return list;
	}

}
