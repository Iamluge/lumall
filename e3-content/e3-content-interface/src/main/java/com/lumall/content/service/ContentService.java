package com.lumall.content.service;

import java.util.List;

import com.lumall.common.pojo.EasyUIDataGridResult;
import com.lumall.common.util.E3Result;
import com.lumall.pojo.TbContent;

public interface ContentService {
public EasyUIDataGridResult findContentList(Integer page, Integer rows);
public E3Result addContent(TbContent content);
public E3Result editContent(TbContent content);
public E3Result deleteContent(String ids);
public List<TbContent> findContentList(long categoryId);
}
