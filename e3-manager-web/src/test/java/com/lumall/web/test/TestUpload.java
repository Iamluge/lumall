package com.lumall.web.test;

import org.csource.fastdfs.ClientGlobal;
import org.csource.fastdfs.StorageClient;
import org.csource.fastdfs.StorageServer;
import org.csource.fastdfs.TrackerClient;
import org.csource.fastdfs.TrackerServer;
import org.junit.Test;
import org.omg.CORBA.PUBLIC_MEMBER;

import com.lumall.common.util.FastDFSClient;

public class TestUpload {
@Test
public void upload()throws Exception{
	//创建一个配置文件，文件名称任意，内容为tracker的服务器地址
	//使用全局对象来加载配置文件
	ClientGlobal.init("D:/javaee32/template-mars2/e3-manager-web/src/main/resources/conf/upload.conf");
	//创建一个trackerclient对象
	TrackerClient trackerClient=new TrackerClient();
	//通过trackerclient获得trackerserver对象
	TrackerServer trackerServer=trackerClient.getConnection();
	//创建一个storageserver的引用可以为null
	StorageServer storageServer=null;
	//创建一个storageClient
	StorageClient storageClient=new StorageClient(trackerServer, storageServer);
	//使用StorageClient上传文件。
	String[] strings = storageClient.upload_file("F:/f0t.jpg", "jpg", null);
	for (String string : strings) {
		System.out.println(string);
	}
	
}
@Test
public void testupload2()throws Exception{
	FastDFSClient fastDFSClient=new FastDFSClient("D:/javaee32/template-mars2/e3-manager-web/src/main/resources/conf/upload.conf");
String string=fastDFSClient.uploadFile("F:/test.png");
System.out.println(string);
}
}
