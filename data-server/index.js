const express = require('express')
const errorWare = require('./error-ware/deal-error.js')
const cors = require('cors')

//创建应用
const app = express()
const port = 3000
const hostname = '127.0.0.1'
//cors中间件注册
app.use(cors())
//路由导入
const basicRouter = require('./router/basicInfo.js')
const cpuRouter = require('./router/cpuInfo.js')
const diskRouter = require('./router/diskInfo.js')
const gpuRouter = require('./router/gpuInfo.js')
const netRouter = require('./router/netInfo.js')
//注册路由
app.use('/api', basicRouter)
app.use('/api', cpuRouter)
app.use('/api', diskRouter)
app.use('/api', gpuRouter)
app.use('/api', netRouter)


//注册错误中间件
app.use(errorWare)
//监听本地3000端口
app.listen(port, () => {
    console.log(`server is running at http://${hostname}:${port}`)
    console.log('Please visit the website at http://1.117.143.11/');
})