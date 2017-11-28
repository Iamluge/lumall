package com.lumall.sso.service;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.lumall.common.jedis.JedisClient;
import com.lumall.common.util.E3Result;
import com.lumall.common.util.JsonUtils;
import com.lumall.pojo.TbUser;

@Service
public class TokenServiceImpl implements TokenService {
	@Autowired
	private JedisClient jedisClient;
	@Value("${TOKEN_EXPIRE}")
	private Integer TOKEN_EXPIRE;

	/*
	 * 通过token在redis里取用户信息
	 */
	@Override
	public E3Result getUser(String token) {
		if (token == null || "".equals(token)) {
			return E3Result.build(400, "null");
		}
		String json = jedisClient.get("SESSIONID" + token);
		if (StringUtils.isBlank(json)) {
			return E3Result.build(201, "用户会话已过期！");
		}
		// 更新过期时间
		jedisClient.expire("SESSIONID" + token, TOKEN_EXPIRE);
		TbUser user = JsonUtils.jsonToPojo(json, TbUser.class);
		return E3Result.ok(user);
	}

}
