package com.lumall.search.service.impl;

import org.apache.solr.client.solrj.SolrQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.lumall.common.pojo.SearchResult;
import com.lumall.search.dao.SearchDao;
import com.lumall.search.service.SearchService;
@Service
public class SearchServiceImpl implements SearchService{
	@Value("${DEFAULT_FIELD}")
	private String DEFAULT_FIELD;
	@Autowired
	private SearchDao searchDao;

	/*
	 * 
	 */
	@Override
	public SearchResult search(String keyWord, int page, int rows) throws Exception {
		SolrQuery solrQuery=new SolrQuery();
		solrQuery.setHighlight(true);
		solrQuery.setHighlightSimplePre("<em style=\"color:red;\">");
		solrQuery.setHighlightSimplePost("</em>");
		solrQuery.set("df", DEFAULT_FIELD);
		//设置查询条件
		solrQuery.setQuery(keyWord);
		//设置分页条件
		solrQuery.setStart((page - 1) * rows);
		//设置rows
		solrQuery.setRows(rows);
		SearchResult searchResult=searchDao.search(solrQuery);
		//计算总页数
		int recourdCount = searchResult.getRecourdCount();
		int pages = recourdCount / rows;
		if (recourdCount % rows > 0) pages++;
		//设置到返回结果
		searchResult.setTotalPages(pages);
		return searchResult;
	}
}
