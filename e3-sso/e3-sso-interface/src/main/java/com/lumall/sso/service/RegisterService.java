package com.lumall.sso.service;

import com.lumall.common.util.E3Result;
import com.lumall.pojo.TbUser;

public interface RegisterService {
public E3Result checkData(String param,int type);
public E3Result register(TbUser user);
}
