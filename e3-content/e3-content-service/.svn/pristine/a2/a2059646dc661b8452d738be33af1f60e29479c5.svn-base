/*
 * 2017-11-1;
 * 21:22
 */
package com.lumall.testRedis;

import java.util.HashSet;
import java.util.Set;

import org.junit.Test;

import redis.clients.jedis.HostAndPort;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisCluster;
import redis.clients.jedis.JedisPool;

public class TestRedis {
@Test
public void testJedis()throws Exception{
	Jedis jedis=new Jedis("192.168.25.132", 7001);
	jedis.set("jedis", "the first time use jedis");
	System.out.println(jedis.get("jedis"));
	jedis.close();
}
@Test
public void testJedisPool()throws Exception{
	JedisPool jedisPool=new JedisPool("192.168.25.132", 7001);

	Jedis jedis= jedisPool.getResource();
	jedis.set("jedispool", "the first time use jedispool");
	System.out.println(jedis.get("jedispool"));
	jedis.close();
}
@Test
public void testJediscluster()throws Exception{
	Set<HostAndPort> set=new HashSet<>();
	set.add(new HostAndPort("192.168.25.132", 7001));
	set.add(new HostAndPort("192.168.25.132", 7002));
	set.add(new HostAndPort("192.168.25.132", 7003));
	set.add(new HostAndPort("192.168.25.132", 7004));
	set.add(new HostAndPort("192.168.25.132", 7005));
	set.add(new HostAndPort("192.168.25.132", 7006));
	JedisCluster jedisCluster=new JedisCluster(set);
	

	System.out.println(jedisCluster.del("jedis"));
	jedisCluster.close();
}
}
