package com.lumall.testsolr;

import java.util.List;

import org.apache.solr.client.solrj.SolrQuery;

import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrServer;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrDocumentList;
import org.junit.Test;

public class TestSolr {
	
	public void testSimpleSolr() throws Exception {
		/*
		 * 简单查询
		 */
		SolrServer solrServer = new HttpSolrServer("http://192.168.170.247:9999/solr/collection1");
		SolrQuery solrQuery = new SolrQuery();
		solrQuery.set("q", "*:*");
		QueryResponse response = solrServer.query(solrQuery);
		SolrDocumentList solrDocumentList = response.getResults();
		System.out.println("the numfound id:" + solrDocumentList.getNumFound());
		for (SolrDocument document : solrDocumentList) {
			/*
			 * "id": "536563", "item_title":
			 * "new2 - 阿尔卡特 (OT-927) 炭黑 联通3G手机 双卡双待", "item_sell_point":
			 * "清仓！仅北京，武汉仓有货！", "item_price": 11111000, "item_image":
			 * "http://192.168.25.133/group1/M00/00/00/wKgZhVn0S6uAe3nrAAFiKFHKKxU864.jpg",
			 * "item_category_name": "手机", "_version_": 1583027433749086200
			 */
			System.out.println(document.get("id"));
			System.out.println(document.get("item_title"));
			System.out.println(document.get("item_sell_point"));
			System.out.println(document.get("item_price"));
			System.out.println(document.get("item_category_name"));
			System.out.println(document.get("_version_"));

		}

	}

	/*
	 * 复杂查询
	 */
	
	public void TestSolrComplex() throws Exception {
		SolrServer server = new HttpSolrServer("http://192.168.170.247:9999/solr/collection1");
		SolrQuery solrQuery = new SolrQuery();
		solrQuery.set("q", "手机");
		// 设置默认搜索域
		solrQuery.set("df", "item_title");
		// 第几条开始和查询记录数
		solrQuery.setStart(6);
		solrQuery.setRows(7);
		// 开启查询高亮
		solrQuery.setHighlight(true);
		solrQuery.setHighlightSimplePre("<h1>");
		solrQuery.setHighlightSimplePost("</h1>");
		QueryResponse queryResponse = server.query(solrQuery);
		SolrDocumentList solrDocumentList = queryResponse.getResults();
		System.out.println("记录数为：" + solrDocumentList.getNumFound());
		for (SolrDocument document : solrDocumentList) {
			/*
			 * "id": "536563", "item_title":
			 * "new2 - 阿尔卡特 (OT-927) 炭黑 联通3G手机 双卡双待", "item_sell_point":
			 * "清仓！仅北京，武汉仓有货！", "item_price": 11111000, "item_image":
			 * "http://192.168.25.133/group1/M00/00/00/wKgZhVn0S6uAe3nrAAFiKFHKKxU864.jpg",
			 * "item_category_name": "手机", "_version_": 1583027433749086200
			 */
			System.out.println(document.get("id"));
			String title = "";
			List<String> list = queryResponse.getHighlighting().get(document.get("id")).get("item_title");
			if (list != null && list.size() > 0) {
				title = list.get(0);
			}else{
				//title=(String) document.get("item_title");
			}
			System.out.println(title);
			System.out.println(document.get("item_sell_point"));
			System.out.println(document.get("item_price"));
			System.out.println(document.get("item_category_name"));
			System.out.println(document.get("_version_"));

		}

	}
}
