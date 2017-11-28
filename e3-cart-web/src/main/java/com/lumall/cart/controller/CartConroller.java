package com.lumall.cart.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.lumall.cart.service.CartService;
import com.lumall.common.util.CookieUtils;
import com.lumall.common.util.E3Result;
import com.lumall.common.util.JsonUtils;
import com.lumall.pojo.TbItem;
import com.lumall.pojo.TbUser;
import com.lumall.service.ItemService;

@Controller
public class CartConroller {
	@Value("${COOKIE_CART_EXPIRE}")
	private Integer COOKIE_CART_EXPIRE;
	@Autowired
	private ItemService itemService;
	@Autowired
	private CartService cartService;

	@RequestMapping("/cart/add/{itemId}")
	public String addCart(@PathVariable Long itemId, @RequestParam(defaultValue = "1") Integer num,
			HttpServletRequest request, HttpServletResponse response) {
		List<TbItem> list = this.getCartLIstFromCookie(request);
		// 判断用户是否登录
		TbUser user = (TbUser) request.getAttribute("user");
		if (user != null) {
			cartService.addCart(user.getId(), itemId, num);
			return "cartSuccess";
		}
		// 设定一个标志判断商品是否被添加过
		boolean flag = false;
		for (TbItem item : list) {
			if (item.getId() == itemId.longValue()) {
				flag = true;
				item.setNum(item.getNum() + num);
				break;
			}
		}
		if (!flag) {
			TbItem item = itemService.tbItem(itemId);
			item.setNum(num);
			if (StringUtils.isNotBlank(item.getImage())) {
				item.setImage(item.getImage().split(",")[0]);
			}
			list.add(item);
		}
		// 写入cookie
		CookieUtils.setCookie(request, response, "cartList", JsonUtils.objectToJson(list), COOKIE_CART_EXPIRE, true);
		// 返回添加成功页面
		return "cartSuccess";
	}

	/*
	 * 跳转到购物车页面
	 */
	@RequestMapping("/cart/cart")
	public String showcart(HttpServletRequest request, HttpServletResponse response) {
		List<TbItem> cartList = this.getCartLIstFromCookie(request);
		TbUser user = (TbUser) request.getAttribute("user");
		if (user != null) {
			cartService.mergeCart(user.getId(), cartList);
			cartList=cartService.getCartList(user.getId());
			request.setAttribute("cartList", cartList);
			// 删掉cookie里的购物车
			CookieUtils.deleteCookie(request, response, "cartList");
			return "cart";
		}
		request.setAttribute("cartList", cartList);
		return "cart";
	}

	public List<TbItem> getCartLIstFromCookie(HttpServletRequest request) {
		String json = CookieUtils.getCookieValue(request, "cartList", true);
		if (StringUtils.isBlank(json)) {
			return new ArrayList<>();
		}
		// 把json转成商品列表
		List<TbItem> list = JsonUtils.jsonToList(json, TbItem.class);
		return list;
	}

	/*
	 * 更新购物车数量
	 */
	@RequestMapping("/cart/update/num/{itemId}/{num}")
	@ResponseBody
	public E3Result updateCart(@PathVariable Long itemId, @PathVariable Integer num, HttpServletRequest request,
			HttpServletResponse response) {
		// 获取cookie里的购物车
		List<TbItem> cartList = this.getCartLIstFromCookie(request);
		TbUser user = (TbUser) request.getAttribute("user");
		if (user != null) {
			cartService.updateCartNum(user.getId(), itemId, num);
			return E3Result.ok();
		}
		// 更新购物车
		for (TbItem item : cartList) {
			if (item.getId() == itemId.longValue()) {
				item.setNum(num);
				break;
			}
		}
		// 写入cookie
		CookieUtils.setCookie(request, response, "cartList", JsonUtils.objectToJson(cartList), COOKIE_CART_EXPIRE,
				true);
		return E3Result.ok();
	}

	/*
	 * 删除购物车信息
	 */
	@RequestMapping("/cart/delete/{itemId}")
	public String deleteCartItem(@PathVariable Long itemId, HttpServletRequest request, HttpServletResponse response) {

		List<TbItem> cartList = this.getCartLIstFromCookie(request);
		TbUser user = (TbUser) request.getAttribute("user");
		if (user != null) {
			cartService.deleteCartItem(user.getId(), itemId);
			return "redirect:/cart/cart.html";
		}
		for (TbItem item : cartList) {
			if (item.getId() == itemId.longValue()) {
				cartList.remove(item);
				break;
			}
		}
		// 写入cookie
		CookieUtils.setCookie(request, response, "cartList", JsonUtils.objectToJson(cartList), COOKIE_CART_EXPIRE,
				true);
		return "redirect:/cart/cart.html";
	}
}
