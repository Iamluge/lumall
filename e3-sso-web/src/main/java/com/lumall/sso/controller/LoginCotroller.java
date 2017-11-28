package com.lumall.sso.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.zookeeper.Login;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.lumall.common.util.CookieUtils;
import com.lumall.common.util.E3Result;
import com.lumall.sso.service.LoginService;

@Controller
public class LoginCotroller {
	@Autowired
	private LoginService loginService;
	@Value("${COOKIE_TOKEN_KEY}")
	private String COOKIE_TOKEN_KEY;

	/*
	 * 登录
	 */
	@RequestMapping(value = "/user/login", method = RequestMethod.POST)
	@ResponseBody
	public E3Result login(String username, String password, HttpServletRequest request, HttpServletResponse response) {
		// 1、接收两个参数。
		// 2、调用Service进行登录。
		E3Result e3Result = loginService.login(username, password);
		//判断是否登录成功
		if(e3Result.getStatus() == 200) {
			String token = e3Result.getData().toString();
			//如果登录成功需要把token写入cookie
			CookieUtils.setCookie(request, response, COOKIE_TOKEN_KEY, token);
		}
		//返回结果
		return e3Result;

	}

	@RequestMapping("/")
	public String showlogin() {
		return "login";
	}

	@RequestMapping("/page/login")
	public String showlogin2(String redirect,Model model) {
		model.addAttribute("redirect",redirect);
		return "login";
	}

}
