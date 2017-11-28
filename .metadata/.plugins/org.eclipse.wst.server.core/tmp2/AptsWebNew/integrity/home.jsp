<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="../integrity/style.css" />
<title>${company.headImage}</title>
</head>
<%session.setAttribute("companyPinyin", request.getParameter("com")); %>
<body style="margin:0;">
<iframe src="../index/formset.action" style="height:900px;width:100%; border-width:0px;">
</iframe>
</body>
</html>
