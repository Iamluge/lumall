package com.lumall.order.service;

import com.lumall.common.util.E3Result;
import com.lumall.order.pojo.OrderInfo;

public interface OrderService {
	public E3Result createOrder(OrderInfo orderInfo);
}
