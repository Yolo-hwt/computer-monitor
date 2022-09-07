# data-server

基于node的本地服务端

## 部署

- 使用node的os模块实现本机硬件信息获取，作为后端，打包为exe可直接运行
- 前端页面部署腾讯云服务器（http://1.117.143.11/）

## 交互

**！！！关闭本机防火墙**

- 本地node程序获取本机硬件信息
- node建立本地服务器127.0.0.1
- 前端部分根据本地服务器数据不断渲染页面

<img src="https://cdn.jsdelivr.net/gh/Yolo-hwt/PicGo-res/images/computer-monitor/image-20220625160128761.png" alt="image-20220625160128761" style="zoom:67%;" />

## node基本结构

监听本地的3000端口

http://127.0.0.1:3000/

使用路由分别处理不同请求，获取本地硬件信息，

根据请求功能不同分为五个路由模块

1.basicInfo（基本信息）
2.cpuInfo（cpu信息）
3.diskInfo（磁盘信息）
4.gpuInfo（gpu信息）
5.netInfo（网络信息）

| 模块      | 请求地址             | 参数                                                     | 返回值       |
| --------- | -------------------- | -------------------------------------------------------- | ------------ |
| basicInfo | /api/basicInfo/os    |                                                          | 系统基本信息 |
| basicInfo | /api/basicInfo/mem   |                                                          | 内存信息     |
| cpuInfo   | /api/cpuInfo/basic   |                                                          | cpu基本信息  |
| cpuInfo   | /api/cpuInfo/cores   |                                                          | cpu线程信息  |
| cpuInfo   | /api/cpuInfo/usage   | flag:true/false,time(ms)                                 | cpu使用率    |
| cpuInfo   | /api/cpuinfo/process | searchMode:console(default)\|services\|all               | cpu进程信息  |
|           |                      | sortMode:asc\|dec(default)  limitNum:Number\|10(default) |              |
| diskInfo  | /api/diskInfo/disks  |                                                          | 磁盘信息     |
| gpuInfo   | /api/gpuInfo/basic   |                                                          | gpu基本信息  |
| gpuInfo   | /api/gpuInfo/usage   |                                                          | gpu使用率    |
| netInfo   | /api/netInfo/network |                                                          | 网卡信息     |



### 待完善接口

1.网速

2.磁盘读写速度

3.gpu存储大小

4.cpu进程

### 补充设计实现

4.cpu进程

```javascript
/*child_process获取当前运行进程*/
/*iconv-lite字符串编码转换*/
const child = require('child_process')
const iconv = require('iconv-lite')
/**
 * 获取cpu进程信息
 * @param {console|services|all} searchMode 
 * @param {asc|dec|} sortMode 
 * @param {Number|10} limitNum
 * @returns {string}
 */
function getProcessMessage(searchMode, sortMode, limitNum) {
    
}

/////////////return model
/*子进程信息包括
*0:映像名称
*1:PID
*2:会话(console|services)
*3:会话
*4:内存使用
*5:k(此处指kb)
*/
[
    {//进程
        name:'chrome',
        child:[
        [...],//线程1
    	[...],//线程2
         ...
        ],
        totalMem:'...'//总占用内存
    },
    {...},
    ...
]

```

客户端需携带参数请求

search

sort

limit

![image-20220627215645440](https://cdn.jsdelivr.net/gh/Yolo-hwt/PicGo-res/images/computer-monitor/image-20220627215645440.png)

## 常见问题

### 浏览器隐私策略

请求的地址不能比自身更加私密

![image-20220625160520542](https://cdn.jsdelivr.net/gh/Yolo-hwt/PicGo-res/images/computer-monitor/image-20220625160520542.png)

解决：

1. chrome://flags/#site-isolation-trial-opt-out
   使用上面的配置地址
2. 搜索 : Block insecure private network requests
   设置为 : Disabled
3. 重启谷歌浏览器



### 跨域问题

接口通过http请求，而网页通过file请求导致跨域（协议不同）

或者违反浏览器的同源策略，**协议、域名、端口号都相同，只要有一个不相同，那么都是非同源**

1.cors

2.jsonp（只解决了get请求）

使用cors第三方中间件解决跨域（必须在路由之前配置）

# data-client

## cpu

```javascript
//cpu基本信息
model: cpus[0].model,//型号
arch: os.arch(),       //架构
nums: cpus.length,    //线程数
freq: cpus[0].speed,     //频率(Mhz)
//cpu逻辑处理器信息
name|usage
//cpu进程信息

```

1.设计仪表盘显示cpu实时利用率信息

2.表格形式动态记录利用率变化

3.各个cpu逻辑处理器利用率用y轴方向条形图展示

4.进程信息模拟任务管理器表格形式呈现，使用element-ui可扩展表格

### 实现逻辑

- echarts绘制图表

- vue对echarts实现数据代理

- **axios+setInterval()定时器 **实现指定一段时间的后端数据持续循环获取

- 利用vue的computed结合watch实现数据监测（watch监测computed变化）

*//deep:true可检测对象中值的变化，若要检测指定对象值就需要用上述方式*

- 数据变化后echarts重绘图形

### 实现效果（第一版）

<img src="https://cdn.jsdelivr.net/gh/Yolo-hwt/PicGo-res/images/computer-monitor/image-20220702114125416.png" alt="image-20220702114125416" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/Yolo-hwt/PicGo-res/images/computer-monitor/image-20220705155248537.png" alt="image-20220705155248537" style="zoom:50%;" />

## 存储（磁盘+内存）

存储部分分为内存与磁盘两部分展示

### 内存

内存部分沿用cpu展示

绘制仪表盘展示实时内存使用率

绘制echarts表格记录数据变化

### 磁盘

磁盘部分利用echarts水球图容器展示当前总磁盘使用量，

下方使用进度条结合磁盘图标展示各个磁盘基本信息

### 实现效果（第一版）

<img src="https://cdn.jsdelivr.net/gh/Yolo-hwt/PicGo-res/images/computer-monitor/image-20220705155835161.png" alt="image-20220705155835161" style="zoom:50%;" />

## 网络

网络页面展示当前计算机设备中的网卡信息，考虑使用卡片形式

<img src="https://cdn.jsdelivr.net/gh/Yolo-hwt/PicGo-res/images/computer-monitor/image-20220705160034174.png" alt="image-20220705160034174" style="zoom:50%;" />

## 文件存储

文件支持导出为excel和txt两种格式

### txt导出

添加第三方库file-sever

利用file-sever导出文件为txt格式

```javascript
downloadTxt() {
      let str = JSON.stringify(this.cpuInfo.cpuBasicInfo);
      console.log(str);
      let strData = new Blob([str], { type: "text/plain;charset=utf-8" });
      saveAs(strData, "E:/cpu基本信息.txt");
    },
```

### excel导出

添加第三方库xlsx

将原先的processInfo重新格式化，即将嵌套对象扁平化为一个一维对象数组，并添加index

将整理后数据导出为excel表格

```javascript
downloadProcessInfo() {
      const data = XLSX.utils.json_to_sheet(
        this.initProcessinfoForExcel(this.cpuInfo.cpuProcessInfo)
      );
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, data, "processdata");
      XLSX.writeFile(wb, "process.xlsx");
    },
```

这里考虑支持导出的各种数据格式，并为其指定推荐的默认导出方式

### 默认导出方式

| 名称               | 默认导出格式 | 备注           |
| ------------------ | ------------ | -------------- |
| 电脑信息           | txt          | 数据量小、离散 |
| cpu一段时间利用率  | excel        | 数据量大       |
| 进程表格快照       | excel        | 数据类目多     |
| 内存一段时间利用率 | excel        | 数据量大       |
| 磁盘快照           | txt          | 数据量小       |
| 网卡快照           | excel        | 数据类目多     |

## 设置

目前设置部分主要考虑系统各模块时钟频率和文件存储路径的设置

### 默认设置参数表

导出格式如上表[默认导出方式](####默认导出方式)

时钟信息默认表

| 名称               | 默认值       | 是否可设置   |
| ------------------ | ------------ | ------------ |
| 电脑信息timer      | 5min(300000) | 是           |
| cpu查询频率        | 1s           | 是（不推荐） |
| cpu默认导出时间段  | 1min         | 是           |
| cpuToplist刷新频率 | 3s           | 否           |
| 内存查询频率       | 1s           | 是（不推荐） |
| 内存默认导出时间段 | 1min         | 是           |
| 磁盘信息timer      | 5min         | 是           |
| 网卡信息timer      | 5min         | 是           |
|                    |              |              |

### 存储路径默认表

| 名称     | 路径                   | 是否可设置 |
| -------- | ---------------------- | ---------- |
| 默认路径 | 当前浏览器默认下载路径 | 是         |
|          |                        |            |