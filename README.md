# bmind
心灵e站

#前端架构：
基础库：jquery 1.7

hash路由：director

模板编译：etpl

样式编译：less

#目录结构
<pre>
app
  css
    reset.css       css初始化
    style.css       less编译后的样式
    style.less      less样式
  images            图片文件目录
  js
    api.js          基础支撑api，包括数据持久化，app通讯接口定义，数据通讯接口，自定义history，调试函数，弹层等
    base.js         原生JS的一些功能扩展
    config.js       路由配置
    data.js         公共数据对象
    directive.js    路由组件
    etpls-3.js      etpls模板组件
    jquery-1.7.2.js jQuery库
    z-common.js     事件定义及初始化
  test              测试数据目录[最初数据本地化测试，已废弃]
  tpl
    main.min.css    发布的打包css
    main.min.js     发布的打包js
    template.html   模板
  index.html        静态入口页面
  index.jsp         动态入口页面
gulpfile.js         nodejs gulp 对less,css,js进行打包的执行程序
</pre>
