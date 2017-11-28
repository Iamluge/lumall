package com.lumall.sso.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import com.lumall.common.jedis.JedisClient;
import com.lumall.common.util.E3Result;
import com.lumall.common.util.JsonUtils;
import com.lumall.mapper.TbUserMapper;
import com.lumall.pojo.TbUser;
import com.lumall.pojo.TbUserExample;
import com.lumall.pojo.TbUserExample.Criteria;

@Service
public class LoginServiceImpl implements LoginService {
	@Autowired
	private TbUserMapper usermapper;
	@Autowired
	private JedisClient jedisClient;
	@Value("${TOKEN_EXPIRE}")
	private Integer TOKEN_EXPIRE;

	@Override
	public E3Result login(String username, String password) {
		// 1、判断用户名密码是否正确。
		TbUserExample example = new TbUserExample();
		Criteria criteria = example.createCriteria();
		criteria.andUsernameEqualTo(username);
		// 查询用户信息
		List<TbUser> list = usermapper.selectByExample(example);
		// 校验密码
		if (list.size() == 0 || list == null) {
			return E3Result.build(400, "用户名或密码有误！");
		}
		TbUser user = list.get(0);
		String md5Pass = DigestUtils.md5DigestAsHex(password.getBytes());
		if (!user.getPassword().equals(md5Pass)) {
			return E3Result.build(400, "用户名或密码有误！");
		}
		// 2、登录成功后生成token。Token相当于原来的jsessionid，字符串，可以使用uuid。
		String token = UUID.randomUUID().toString();
		// 3、把用户信息保存到redis。Key就是token，value就是TbUser对象转换成json。
		// 密码不能返回去，
		user.setPassword(null);
		jedisClient.set("SESSIONID" + token, JsonUtils.objectToJson(user));
		// 4、使用String类型保存Session信息。可以使用“前缀:token”为key

		// 5、设置key的过期时间。模拟Session的过期时间。一般半个小时。
		jedisClient.expire("SESSIONID" + token, TOKEN_EXPIRE);
		// 6、返回e3Result包装token。

		return E3Result.ok(token);
	}

}
