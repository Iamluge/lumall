package com.lumall.service;

import com.lumall.common.pojo.EasyUIDataGridResult;
import com.lumall.common.util.E3Result;
import com.lumall.pojo.TbItem;

public interface ItemService {
public TbItem tbItem(long itemid);
public EasyUIDataGridResult findEasyUIDataGridResult(int page,int row);
public E3Result addItem(TbItem item, String desc);
public E3Result editItem(TbItem item, String desc);
public E3Result updateStatus(String ids,byte status);

}
