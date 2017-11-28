package com.lumall.sso.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.lumall.common.util.E3Result;
import com.lumall.pojo.TbUser;
import com.lumall.sso.service.RegisterService;

/**
 * 注册功能Controller
 * <p>
 * Title: RegitsterController
 * </p>
 * <p>
 * Description:
 * </p>
 * <p>
 * Company: www.itcast.cn
 * </p>
 * 
 * @version 1.0
 */
@Controller
public class RegitsterController {
	@Autowired
	private RegisterService userService;

	@RequestMapping("/page/register")
	public String showRegister() {
		return "register";
	}

	/*
	 * 注册校验用户名名，手机号、邮箱是否重复
	 */
	@RequestMapping("/user/check/{param}/{type}")
	@ResponseBody
	public E3Result checkData(@PathVariable String param, @PathVariable Integer type) {
		return userService.checkData(param, type);
	}

	/*
	 * 用户注册
	 */
	@RequestMapping(value = "/user/register", method = RequestMethod.POST)
	@ResponseBody
	public E3Result register(TbUser user) {
		return userService.register(user);
	}
}
