package com.lumall.cart.interceptor;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.lumall.common.util.CookieUtils;
import com.lumall.common.util.E3Result;
import com.lumall.pojo.TbUser;
import com.lumall.sso.service.TokenService;

public class LoginInterceptor implements HandlerInterceptor {

	@Autowired
	private TokenService tokenService;

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object object) throws Exception {
		// 执行handler方法之前执行此方法
		// 1、实现一个HandlerInterceptor接口。
		// 2、在执行handler方法之前做业务处理
		// 3、从cookie中取token。使用CookieUtils工具类实现。
		String token = CookieUtils.getCookieValue(request, "token");
		if (StringUtils.isBlank(token)) {
			return true;
		}
		// 如果用户已登录把用户信息放到request中
		// 获取用户信息
		// 7、返回用户信息。用户是登录状态。可以把用户对象保存到request中，在Controller中可以通过判断request中是否包含用户对象，确定是否为登录状态。
		E3Result e3Result = tokenService.getUser(token);
		if (e3Result.getStatus() != 200) {
			return true;
		}
		TbUser user = (TbUser) e3Result.getData();
		request.setAttribute("user", user);
		//放行
		return true;
	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object object,
			Exception exception) throws Exception {
		// TODO Auto-generated method stub

	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object object,
			ModelAndView modelAndView) throws Exception {
		// TODO Auto-generated method stub

	}

}
