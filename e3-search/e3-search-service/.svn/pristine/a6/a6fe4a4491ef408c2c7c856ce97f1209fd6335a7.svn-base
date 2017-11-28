package com.lumall.search.service.impl;

import java.util.List;

import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.common.SolrInputDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lumall.common.pojo.SearchItem;
import com.lumall.common.util.E3Result;
import com.lumall.search.mapper.ItemMapper;
import com.lumall.search.service.ItemListService;

@Service
public class ItemListServiceImpl implements ItemListService {
	@Autowired
	private ItemMapper itemMapper;
	@Autowired
	private SolrServer solrServer;

	@Override
	public E3Result addAllItemToSolr() {
		try {
			List<SearchItem> itemList = itemMapper.getItemList();
			for (SearchItem searchItem : itemList) {
				// 创建文档对象
				SolrInputDocument document = new SolrInputDocument();
				// 向文档对象中添加域
				document.addField("id", searchItem.getId());
				document.addField("item_title", searchItem.getTitle());
				document.addField("item_sell_point", searchItem.getSell_point());
				document.addField("item_price", searchItem.getPrice());
				document.addField("item_image", searchItem.getImage());
				document.addField("item_category_name", searchItem.getCategory_name());
				// 把文档对象写入索引库
				solrServer.add(document);
			}
			// 提交
			solrServer.commit();
			// 返回导入成功
			return E3Result.ok();
		} catch (Exception e) {
			e.printStackTrace();
			return E3Result.build(500, "数据导入时发生异常");

		}
	}
/*
 * 2017-11-9
 * 15:53
 */
	public E3Result addDocument(long itemId) throws Exception {

		SearchItem searchItem = itemMapper.getItemById(itemId);
		// 2、创建一SolrInputDocument对象。
		SolrInputDocument document = new SolrInputDocument();
		// 3、使用SolrServer对象写入索引库。
		document.addField("id", searchItem.getId());
		document.addField("item_title", searchItem.getTitle());
		document.addField("item_sell_point", searchItem.getSell_point());
		document.addField("item_price", searchItem.getPrice());
		document.addField("item_image", searchItem.getImage());
		document.addField("item_category_name", searchItem.getCategory_name());
		
		// 5、向索引库中添加文档。
		solrServer.add(document);
		solrServer.commit();
		// 4、返回成功，返回e3Result。
		return E3Result.ok();

	}

}
