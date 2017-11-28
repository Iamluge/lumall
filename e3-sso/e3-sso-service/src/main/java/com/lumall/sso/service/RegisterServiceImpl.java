package com.lumall.sso.service;

import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import com.lumall.common.util.E3Result;
import com.lumall.mapper.TbUserMapper;
import com.lumall.pojo.TbUser;
import com.lumall.pojo.TbUserExample;
import com.lumall.pojo.TbUserExample.Criteria;

@Service
public class RegisterServiceImpl implements RegisterService {
	@Autowired
	private TbUserMapper userMapper;

	@Override
	public E3Result checkData(String param, int type) {

		// 1、从tb_user表中查询数据
		TbUserExample example = new TbUserExample();
		Criteria criteria = example.createCriteria();
		// 2、查询条件根据参数动态生成。
		// 1、2、3分别代表username、phone、email

		if (type == 1) {
			criteria.andUsernameEqualTo(param);
		} else if (type == 2) {
			criteria.andPhoneEqualTo(param);
		} else if (type == 3) {
			criteria.andEmailEqualTo(param);
		} else {
			return E3Result.build(400, "非法参数！");
		}
		// 执行查询
		List<TbUser> list = userMapper.selectByExample(example);
		if (list.size() == 0 || list == null) {
			return E3Result.ok(true);
		}
		return E3Result.ok(false);
	}

	/*
	 * 用户注册
	 */
	@Override
	public E3Result register(TbUser user) {
		/*
		 * 校验数据
		 */
		if (StringUtils.isBlank(user.getUsername()) || StringUtils.isBlank(user.getPassword())
				|| StringUtils.isBlank(user.getPhone())) {
			return E3Result.build(400, "用户信息不完整！！");
		}
		// 1、2、3分别代表username、phone、email
		// 校验数据是否可用
		E3Result result1 = checkData(user.getUsername(), 1);
		if (!(boolean) result1.getData()) {
			return E3Result.build(400, "此用户名已经被使用");
		}
		E3Result result2 = checkData(user.getPhone(), 2);
		if (!(boolean) result2.getData()) {
			return E3Result.build(400, "此号码已经注册！");
		}
		if (user.getEmail() != null && !"".equals(user.getEmail())) {
			E3Result result3 = checkData(user.getEmail(), 3);
			if (!(boolean) result3.getData()) {
				return E3Result.build(400, "此邮箱已经被使用");
			}
		}

		// 补全数据
		user.setCreated(new Date());
		user.setUpdated(new Date());
		// 3、密码要进行MD5加密。
		String md5Pass = DigestUtils.md5DigestAsHex(user.getPassword().getBytes());
		user.setPassword(md5Pass);

		userMapper.insert(user);
		return E3Result.ok();
	}

}
