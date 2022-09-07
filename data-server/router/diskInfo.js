const os = require('os')
const express = require('express')
const diskRouter = express.Router()
/**
 * 获取本机内存信息
 * @returns {Object}
 */
function getMemInfo() {
    let res = {}
    res.totalMem = os.totalmem();//总内存容量
    res.freeMem = os.freemem();//可用内存容量
    return res;
}

//参数表
//         磁盘：             mounted
//         磁盘总内存：        blocks
//         磁盘已用内存：      used
//         磁盘可用内存：      available
//         磁盘已用内存百分比：capacity

diskRouter.get('/diskInfo/disks', (req, res) => {


    let flag = 1
    let massage = '请求成功'
    const getDrives = require('diskinfo').getDrives
    getDrives((err, diskinfo) => {

        res.send({
            status: flag,
            msg: massage,
            data: diskinfo
        })
    });


})
diskRouter.get('/diskInfo/mem', (req, res) => {
    // const query = req.query
    let basicData = [getMemInfo()]
    let flag = 1
    let massage = '请求成功'

    res.send({
        status: flag,
        msg: massage,
        data: basicData
    })
})
module.exports = diskRouter
