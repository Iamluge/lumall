package com.lumall.sso.controller;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.lumall.common.util.E3Result;
import com.lumall.common.util.JsonUtils;
import com.lumall.sso.service.TokenService;

@Controller
public class TokenCotroller {
	@Autowired
	TokenService tokenService;

	@RequestMapping(value = "/user/token/{token}", produces = MediaType.APPLICATION_JSON_VALUE + ";charset=utf8")
	@ResponseBody
	public String getUser(@PathVariable String token, String callback) {
		/*
		 * 解决js跨域问题
		 */
		E3Result result = tokenService.getUser(token);
		if (StringUtils.isNoneBlank(callback)) {
			String strresult = callback + "(" + JsonUtils.objectToJson(result) + ");";
			return strresult;
		}
		return JsonUtils.objectToJson(result);
	}
}
