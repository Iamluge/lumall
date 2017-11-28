package com.lumall.service.impl;

import java.util.Date;
import java.util.List;

import javax.annotation.Resource;
import javax.jms.Destination;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;
import javax.jms.TextMessage;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.jms.core.MessageCreator;
import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.lumall.common.jedis.JedisClient;
import com.lumall.common.pojo.EasyUIDataGridResult;
import com.lumall.common.util.E3Result;
import com.lumall.common.util.IDUtils;
import com.lumall.common.util.JsonUtils;
import com.lumall.mapper.TbItemDescMapper;
import com.lumall.mapper.TbItemMapper;
import com.lumall.pojo.TbItem;
import com.lumall.pojo.TbItemDesc;
import com.lumall.pojo.TbItemExample;
import com.lumall.pojo.TbItemExample.Criteria;
import com.lumall.pojo.TbItemExample.Criterion;
import com.lumall.service.ItemService;

@Service
public class ItemServiceImpl implements ItemService {

	@Autowired
	private TbItemMapper itemMapper;
	@Autowired
	private TbItemDescMapper itemDescMapper;
	@Autowired
	private JmsTemplate jmsTemplate;
	@Resource
	private Destination topicDestination;
	@Autowired
	private JedisClient jedisClient;
	@Value("${ITEM_CACHE}")
	private String ITEM_CACHE;
	@Value("${CACHE_TIEM}")
	private Integer CACHE_TIEM;

	@Override
	public TbItem tbItem(long itemid) {
		// 查询缓存
		try {
			String json = jedisClient.get(ITEM_CACHE + ":" + itemid + ":BASE");
			if (StringUtils.isNotBlank(json)) {
				// 把json转换为java对象
				TbItem item = JsonUtils.jsonToPojo(json, TbItem.class);
				return item;
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		// 根据主键查询
		// TbItem tbItem = itemMapper.selectByPrimaryKey(itemid);
		TbItemExample example = new TbItemExample();
		Criteria criteria = example.createCriteria();
		// 设置查询条件
		criteria.andIdEqualTo(itemid);
		// 执行查询
		List<TbItem> list = itemMapper.selectByExample(example);
		if (list != null && list.size() > 0) {
			// 添加缓存
			try {
				jedisClient.set(ITEM_CACHE + ":" + itemid + ":BASE", JsonUtils.objectToJson(list.get(0)));
				jedisClient.expire(ITEM_CACHE + ":" + itemid + ":BASE", CACHE_TIEM);
			} catch (Exception e) {
				e.printStackTrace();
			}
			return list.get(0);
		}
		return null;
	}

	@Override
	public EasyUIDataGridResult findEasyUIDataGridResult(int page, int row) {
		PageHelper.startPage(page, row);
		TbItemExample tbItemExample = new TbItemExample();
		List<TbItem> list = itemMapper.selectByExample(tbItemExample);
		EasyUIDataGridResult result = new EasyUIDataGridResult();
		result.setRows(list);
		PageInfo<TbItem> pageInfo = new PageInfo<>(list);
		long total = pageInfo.getTotal();
		result.setTotal(total);
		return result;
	}

	@Override
	public E3Result addItem(TbItem item, String desc) {
		final long itemid = IDUtils.genItemId();
		item.setId(itemid);
		item.setCreated(new Date());
		item.setUpdated(new Date());
		// 1、2、3分别代表正常，下架,删除
		item.setStatus((byte) 1);
		itemMapper.insert(item);
		// 创建一个商品描述pojo对象
		TbItemDesc tbItemDesc = new TbItemDesc();
		tbItemDesc.setItemId(itemid);
		tbItemDesc.setItemDesc(desc);
		tbItemDesc.setCreated(new Date());
		tbItemDesc.setUpdated(new Date());
		itemDescMapper.insert(tbItemDesc);

		/*
		 * 添加同步索引库功能2017-11-9
		 */
		// 发送一个商品添加消息
		jmsTemplate.send(topicDestination, new MessageCreator() {

			@Override
			public Message createMessage(Session session) throws JMSException {
				TextMessage textMessage = session.createTextMessage(itemid + "");
				return textMessage;
			}

		});

		return E3Result.ok();
	}

	/*
	 * 编辑商品
	 */
	@Override
	public E3Result editItem(TbItem item, String desc) {
		TbItem tbItem = itemMapper.selectByPrimaryKey(item.getId());
		tbItem.setUpdated(new Date());
		tbItem.setBarcode(item.getBarcode());
		tbItem.setImage(item.getImage());
		tbItem.setNum(item.getNum());
		tbItem.setPrice(item.getPrice());
		tbItem.setCid(item.getCid());
		tbItem.setSellPoint(item.getSellPoint());
		tbItem.setTitle(item.getTitle());

		itemMapper.updateByPrimaryKey(tbItem);
		TbItemDesc tbItemDesc = new TbItemDesc();
		tbItemDesc.setItemDesc(desc);
		tbItemDesc.setItemId(item.getId());
		tbItemDesc.setCreated(tbItem.getCreated());
		tbItemDesc.setUpdated(tbItem.getUpdated());

		itemDescMapper.updateByPrimaryKey(tbItemDesc);
		return E3Result.ok();
	}

	/*
	 * 抽取更新商品状态方法
	 */
	public E3Result updateStatus(String ids, byte status) {
		// 1、2、3分别代表正常，下架,删除
		String[] id = ids.split(",");
		for (int i = 0; i < id.length; i++) {
			// System.out.println(Long.parseLong(id[i]));
			TbItem tbItem = itemMapper.selectByPrimaryKey(Long.parseLong(id[i]));
			tbItem.setStatus(status);
			itemMapper.updateByPrimaryKey(tbItem);
		}

		return E3Result.ok();
	}

	@Override
	public TbItemDesc geTbItemDesc(long itemId) {
		// 查询缓存
		try {
			String json=jedisClient.get(ITEM_CACHE + ":" + itemId + ":DESC");
			if(StringUtils.isNotBlank(json))
			{
			TbItemDesc tbItemDesc = JsonUtils.jsonToPojo(json, TbItemDesc.class);
			return tbItemDesc;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		TbItemDesc itemDesc = itemDescMapper.selectByPrimaryKey(itemId);
		// 添加缓存
		try {
			jedisClient.set(ITEM_CACHE + ":" + itemId + ":DESC", JsonUtils.objectToJson(itemDesc));
			jedisClient.expire(ITEM_CACHE + ":" + itemId + ":DESC", CACHE_TIEM);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return itemDesc;
	}

}
