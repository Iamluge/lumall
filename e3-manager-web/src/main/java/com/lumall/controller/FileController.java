package com.lumall.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.lumall.common.util.FastDFSClient;
import com.lumall.common.util.JsonUtils;

@Controller
public class FileController {
@Value("${IMAGE_SERVER_ADDRESS}")
private String IMAGE_SERVER_ADDRESS;
@RequestMapping(value="/pic/upload",produces=MediaType.TEXT_PLAIN_VALUE+";charset=utf-8")
@ResponseBody
public String imageUpload(MultipartFile uploadFile){
	try {
		FastDFSClient fastDFSClient=new FastDFSClient("classpath:conf/upload.conf");
		String filename=uploadFile.getOriginalFilename();
		String extName=filename.substring(filename.lastIndexOf(".")+1);
		String path=fastDFSClient.uploadFile(uploadFile.getBytes(), extName);
		String url=IMAGE_SERVER_ADDRESS+path;
		Map map=new HashMap<>();
		map.put("error", 0);
		map.put("url", url);
		return JsonUtils.objectToJson(map);
	} catch (Exception e) {
		e.printStackTrace();
		Map map=new HashMap<>();
		map.put("error", 1);
		map.put("message", "图片上传失败");
		return JsonUtils.objectToJson(map);
	}

}
}
