package com.lumall.common.pojo;

import java.io.Serializable;

public class EasyUIDataTreeNode implements Serializable{
long id;
String text;
String state;
public long getId() {
	return id;
}
public void setId(long id) {
	this.id = id;
}
public String getText() {
	return text;
}
public void setText(String text) {
	this.text = text;
}
public String getState() {
	return state;
}
public void setState(String state) {
	this.state = state;
}

}
