package com.lumall.activemq;

import javax.jms.Connection;
import javax.jms.ConnectionFactory;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageConsumer;
import javax.jms.MessageListener;
import javax.jms.MessageProducer;
import javax.jms.Queue;
import javax.jms.Session;
import javax.jms.TextMessage;

import org.apache.activemq.ActiveMQConnectionFactory;

import org.junit.Test;

public class TestActiveMQ {

public void testQueue() throws Exception{
//	第一步：创建ConnectionFactory对象，需要指定服务端ip及端口号。
	ConnectionFactory connectionFactory=new ActiveMQConnectionFactory("tcp://192.168.25.132:61616");
//	第二步：使用ConnectionFactory对象创建一个Connection对象。
	Connection connection= connectionFactory.createConnection();
//	第三步：开启连接，调用Connection对象的start方法。
	connection.start();
//	第四步：使用Connection对象创建一个Session对象。
	Session session=connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
//	第五步：使用Session对象创建一个Destination对象（topic、queue），此处创建一个Queue对象。
	Queue queue=session.createQueue("test-lu-queue!");
//	第六步：使用Session对象创建一个Producer对象。
	MessageProducer messageProducer=session.createProducer(queue);
//	第七步：创建一个Message对象，创建一个TextMessage对象。
	TextMessage textMessage=session.createTextMessage("uuuu");
//	第八步：使用Producer对象发送消息。
	messageProducer.send(textMessage);
//	第九步：关闭资源。
	messageProducer.close();
	session.close();
	connection.close();
}
@Test
public void testQueueConsumer() throws Exception {
	// 第一步：创建一个ConnectionFactory对象。
	ConnectionFactory connectionFactory = new ActiveMQConnectionFactory("tcp://192.168.25.132:61616");
	// 第二步：从ConnectionFactory对象中获得一个Connection对象。
	Connection connection = connectionFactory.createConnection();
	// 第三步：开启连接。调用Connection对象的start方法。
	connection.start();
	// 第四步：使用Connection对象创建一个Session对象。
	Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
	// 第五步：使用Session对象创建一个Destination对象。和发送端保持一致queue，并且队列的名称一致。
	Queue queue = session.createQueue("spring-queue");
	// 第六步：使用Session对象创建一个Consumer对象。
	MessageConsumer consumer = session.createConsumer(queue);
	// 第七步：接收消息。
	consumer.setMessageListener(new MessageListener() {

		public void onMessage(Message message) {
			try {
				TextMessage textMessage = (TextMessage) message;
				String text = null;
				//取消息的内容
				text = textMessage.getText();
				// 第八步：打印消息。
				System.out.println(text);
			} catch (JMSException e) {
				e.printStackTrace();
			}
		}
		
		
	});
	//等待键盘输入
	System.in.read();
	// 第九步：关闭资源
	consumer.close();
	session.close();
	connection.close();
}

}
