package com.lumall.content.service;

import java.util.List;

import com.lumall.common.pojo.EasyUIDataTreeNode;
import com.lumall.common.util.E3Result;

public interface ContentCategoryService {
public List<EasyUIDataTreeNode> findContentCategoryList(long parentid);
public E3Result addContentCategory(long parentId, String name);
public E3Result renameCategory(long id,String name);
public E3Result deleteCategory(long id);
}
