<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@ page session="false" %>
<%@ page import="com.bmind.marketing.util.*" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="com.bmind.marketing.db.WxTokenDB" %>
<%
    String queryStr = StringUtil.parseString(request.getQueryString());
    String fromOpenId = StringUtil.parseString((String) request.getAttribute("fromOpenid"));

    if ("fromOpenId".equals(fromOpenId)) {
        fromOpenId = StringUtil.parseString(request.getParameter("fromOpenid"));
    }

    String _access_token = (String) request.getAttribute("_access_token");

    String fullPath = request.getRequestURL().toString();
    if (queryStr != null && !"".equals(queryStr))
        fullPath += "?" + queryStr;

    String jumpTo = StringUtil.parseString(request.getParameter("jumpTo"), "index.jsp");

    HashMap<String, String> aMap = WxTokenDB.getInstance().getWxConfig(request, fullPath);

    //String name = request.getParameter("name") == null ? null : new String(request.getParameter("name").getBytes("UTF-8"));
    String name = request.getParameter("name");

    //out.println("<script>alert('"+name+"')</script>");

%>
<!DOCTYPE html>
<html>
<%--<head>
    <meta charset="utf-8">
    <!-- 设置移动端视图 -->
    <meta name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"/>
    <!-- 针对手持设备优化，主要是针对一些老的不识别viewport的浏览器，比如黑莓 -->
    <meta name="HandheldFriendly" content="true">
    <!-- 删除苹果默认的工具栏和菜单栏 -->
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <!-- 设置苹果工具栏颜色 -->
    <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
    <!-- 忽略页面中的数字识别为电话，忽略email识别 -->
    <meta name="format-detection" content="telphone=no, email=no"/>
    <!-- uc强制竖屏 -->
    <meta name="screen-orientation" content="portrait">
    <!-- QQ强制竖屏 -->
    <meta name="x5-orientation" content="portrait">
    <!-- UC强制全屏 -->
    <meta name="full-screen" content="yes">
    <!-- QQ强制全屏 -->
    <meta name="x5-fullscreen" content="true">
    <!-- UC应用模式 -->
    <meta name="browsermode" content="application">
    <!-- QQ应用模式 -->
    <meta name="x5-page-mode" content="app">
    <!-- windows phone 点击无高光 -->
    <meta name="msapplication-tap-highlight" content="no">
    <title>博曼之行</title>
</head>--%>

<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta http-equiv="content-type" content="text/html;charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
    <title>你还有多少天才脱单</title>
    <link rel="stylesheet" href="../public/css/reset.css">
    <link rel="stylesheet/less" href="css/style.less">
    <script src="../public/js/jquery-1.7.2.js"></script>
    <script src="../public/js/less2.5.1.js"></script>
    <script src="js/common.js"></script>
</head>

<body>
<jsp:include page="/functionsPart.jsp"/>
<div id="mn">
    <div id="index">
        <div class="banner">
            <img src="images/banner.jpg" alt="看看你离脱单还有多少天">
        </div>
        <form>
            <input class="js-input" type="text" placeholder="请输入你的名字"><br>
            <a class="js-begin" href="javascript:;">开始</a>
        </form>
    </div>
    <div id="day" style="display: none;">
        <div class="bg">
            <img src="images/line.png" alt="">
        </div>
        <div class="cnt">
            <p><em class="js-name">风中乱舞</em><br>距离脱单的天数是</p>
            <span class="js-score">88</span>
            <p class="js-cnt">看来光棍节前脱单对你来说有点难度<br>请珍惜你人生中的最后一个光棍节</p>
            <p>
                <br>
                <a href="javascript:;" class="btn js-index">我也要算</a>
                <a href="javascript:;" class="btn js-share">手动脱单</a>
            </p>
        </div>
        <div class="tips" style="display: none;">
            <div class="cur"></div>
            <p>点击分享，告诉大家<br>“我要脱单，你们怕了吗？”</p>
        </div>
    </div>
    <div id="footer">
        <div class="logo">
            <img src="images/logo.png" alt="">
        </div>
        <a href="javascript:;" class="btn">免费参与</a>
        <div class="cnt">
            <h2>你才是单身狗，你全家都是单身狗！</h2>
            <p>知名心理学家在线传授脱单秘籍</p>
        </div>
    </div>
</div>

<script type="text/javascript">
    var params = {
        openid: '<%=fromOpenId%>',
        appId: '<%=aMap.get("appid")%>',
        timestamp: '<%=aMap.get("timestamp")%>',
        nonceStr: '<%=aMap.get("noncestr")%>',
        signature: '<%=aMap.get("signature")%>',
        imgUrl: '<%=aMap.get("accessToken")%>',
        jumpTo: '<%=jumpTo%>',
        baseAjaxUrl: '${serverBasePath}'
    }

</script>

</body>

</html>