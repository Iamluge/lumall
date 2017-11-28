package com.lumall.cart.service;

import java.util.List;

import com.lumall.common.util.E3Result;
import com.lumall.pojo.TbItem;

public interface CartService {
public 	E3Result addCart(long userId, long itemId, int num);

public E3Result mergeCart(long userId, List<TbItem> itemList);
public List<TbItem> getCartList(long userId);
public E3Result updateCartNum(long userId, long itemId, int num);
public E3Result deleteCartItem(long userId, long itemId);
public E3Result clearCartItem(long userId);
}
