function form_submit(){
	document.getElementById("login").submit();
}

function keyLogin(event){
  if (event.keyCode==13)   //回车键的键值为13
     document.getElementById("login").submit();  //调用登录按钮的登录事件
}
