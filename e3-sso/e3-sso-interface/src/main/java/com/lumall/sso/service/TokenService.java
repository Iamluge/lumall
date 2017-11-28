package com.lumall.sso.service;

import com.lumall.common.util.E3Result;

public interface TokenService {
public E3Result getUser(String token);
}
