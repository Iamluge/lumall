package com.lumall.common.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import org.junit.Test;

public class UploadUtils {
public static void uploadImg(Long fileSize,InputStream is,String filename){
	AliyunOSSClientUtil.uploadObject2OSS(fileSize,AliyunOSSClientUtil.getOSSClient(),is,filename, OSSClientConstants.BACKET_NAME, OSSClientConstants.FOLDER);
}
@Test 
public void test() throws FileNotFoundException{
	File file=new File("d:/image/hello.png");
	//uploadImg(file.length(), new FileInputStream(file),"hello.png");
	AliyunOSSClientUtil.uploadObject2OSS(AliyunOSSClientUtil.getOSSClient(),file, OSSClientConstants.BACKET_NAME, OSSClientConstants.FOLDER);
}
}
