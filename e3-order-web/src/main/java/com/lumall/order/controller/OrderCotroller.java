package com.lumall.order.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.lumall.cart.service.CartService;
import com.lumall.common.util.E3Result;
import com.lumall.order.pojo.OrderInfo;
import com.lumall.order.service.OrderService;
import com.lumall.pojo.TbItem;
import com.lumall.pojo.TbUser;

@Controller
public class OrderCotroller {
	@Autowired
	private CartService cartService;
	@Autowired
	private OrderService orderService;

	@RequestMapping("/order/order-cart")
	public String gotoOrderPage(HttpServletRequest request) {
		// 获取用户信息
		// 从cartservice中取出订单来给页面
		// 先写死测试一下
		List<TbItem> cartList = cartService.getCartList(5);
		request.setAttribute("cartList", cartList);
		// 返回逻辑视图
		return "order-cart";

	}

	@RequestMapping("/order/create")
	public String creatOrder(OrderInfo orderInfo, HttpServletRequest request) {
		/*
		 * 从request中取出用户信息，并补充到orderinfo中
		 */
		TbUser user = (TbUser) request.getAttribute("user");
		orderInfo.setUserId(user.getId());
		orderInfo.setBuyerNick(user.getUsername());
		// 生成订单并返回订单号
		E3Result e3Result = orderService.createOrder(orderInfo);
		String orderId = e3Result.getData().toString();
		request.setAttribute("orderId", orderId);
		System.out.println(orderInfo.getPayment());
		request.setAttribute("payment", orderInfo.getPayment());
		//清空购物车
		cartService.clearCartItem(user.getId());
		return "success";
	}
}
