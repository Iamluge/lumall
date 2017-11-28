package com.lumall.order.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.lumall.cart.service.CartService;
import com.lumall.common.util.CookieUtils;
import com.lumall.common.util.E3Result;
import com.lumall.common.util.JsonUtils;
import com.lumall.pojo.TbItem;
import com.lumall.pojo.TbUser;
import com.lumall.sso.service.TokenService;

public class LoginInterceptor  implements HandlerInterceptor{

	@Value("${SSO_URL}")
	private String SSO_URL;
	@Autowired
	private TokenService tokenService;
	@Autowired
	private CartService cartService;
	@Value("${COOKIE_CART_KEY}")
	private String COOKIE_CART_KEY;
	@Override
	public void afterCompletion(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, Exception arg3)
			throws Exception {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void postHandle(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, ModelAndView arg3)
			throws Exception {
		// TODO Auto-generated method stub
		
	}

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object arg2) throws Exception {
		//当用户提交订单时盘断用户有没有登录
		String token=CookieUtils.getCookieValue(request, "token");
		if(StringUtils.isBlank(token))
		{
			//跳转到登录页面
			response.sendRedirect(SSO_URL + "?redirect=" + request.getRequestURL());
			return false;
		}
		//从tokensevice中取出用户
		E3Result e3Result=tokenService.getUser(token);
		//判断登录是否过期，过期跳转到登录页面
		if(e3Result.getStatus()!=200)
		{
			//跳转到登录页面
			response.sendRedirect(SSO_URL + "?redirect=" + request.getRequestURL());
			return false;	
		}
		
		TbUser user=(TbUser)e3Result.getData();
		request.setAttribute("user", user);
		// 判断cookie中是否有购物车信息，如果有合并购物车
		String json = CookieUtils.getCookieValue(request, COOKIE_CART_KEY, true);
		if (StringUtils.isNotBlank(json)) {
			cartService.mergeCart(user.getId(), JsonUtils.jsonToList(json, TbItem.class));
			//删除cookie中的购物车数据
			CookieUtils.setCookie(request, response, COOKIE_CART_KEY, "");
		}
		//放行
		return true;
	}

}
