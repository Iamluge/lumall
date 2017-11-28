package com.lumall.order.service.impl;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.lumall.common.jedis.JedisClient;
import com.lumall.common.util.E3Result;
import com.lumall.mapper.TbOrderItemMapper;
import com.lumall.mapper.TbOrderMapper;
import com.lumall.mapper.TbOrderShippingMapper;
import com.lumall.order.pojo.OrderInfo;
import com.lumall.order.service.OrderService;
import com.lumall.pojo.TbOrderItem;
import com.lumall.pojo.TbOrderShipping;

@Service
public class OrderServiceImpl implements OrderService {
	@Autowired
	private JedisClient jedisClient;
	@Value("${ORDERID_KEY}")
	private String ORDERID_KEY;
	@Value("${ORDERID_BEGIN_VALUE}")
	private String ORDERID_BEGIN_VALUE;
	@Autowired
	private TbOrderMapper orderMapper;
	@Autowired
	private TbOrderItemMapper orderItemMapper;
	@Value("${ORDERITEM_GEN_KEY}")
	private String ORDERITEM_GEN_KEY;
	@Autowired
	private TbOrderShippingMapper orderShippingMapper;

	@Override
	public E3Result createOrder(OrderInfo orderInfo) {
		// 1、接收表单的数据
		// 采用redis生成订单号
		if (!jedisClient.exists(ORDERID_KEY)) {
			jedisClient.set(ORDERID_KEY, ORDERID_BEGIN_VALUE);
		}
		// 生成订单ID
		String orderId = jedisClient.incr(ORDERID_KEY).toString();

		// 3、向订单表插入数据。
		// 先补全属性
		orderInfo.setOrderId(orderId);
		orderInfo.setCreateTime(new Date());
		orderInfo.setUpdateTime(new Date());
		// 1、未付款，2、已付款，3、未发货，4、已发货，5、交易成功，6、交易关闭
		orderInfo.setStatus(1);
		orderMapper.insert(orderInfo);
		// 4、向订单明细表插入数据
		
	
		List<TbOrderItem> orderItems = orderInfo.getOrderItems();
		for (TbOrderItem orderItem : orderItems) {
			orderItem.setId(jedisClient.incr(ORDERITEM_GEN_KEY).toString());
			orderItem.setOrderId(orderId);
			orderItemMapper.insert(orderItem);
		}
		// 5、向订单物流表插入数据。
		TbOrderShipping orderShipping = orderInfo.getOrderShipping();
		orderShipping.setOrderId(orderId);
		orderShipping.setCreated(new Date());
		orderShipping.setUpdated(new Date());
		orderShippingMapper.insert(orderShipping);

		// 6、返回e3Result。

		return E3Result.ok(orderId);
	}

}
