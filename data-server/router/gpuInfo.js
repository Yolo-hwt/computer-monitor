const nodeCMD = require('node-cmd')
const express = require('express')
const gpuRouter = express.Router()

/**
 * 获取GPU使用率
 * @returns {Promise}
 */
async function getGPUUsage() {
    let promise = new Promise(resolve => {
        nodeCMD.run('nvidia-smi -q -d UTILIZATION', (e, b, c) => {
            if (!e) {
                let a = b.split('\r\n').find(s => s.indexOf('Gpu') >= 0 && s.indexOf('%') >= 0)
                let start = a.indexOf(':') + 2
                let end = a.indexOf('%') - 1
                let ss = a.substring(start, end)
                resolve(ss)
            }
        })
    })
    return await promise
}
/**
 * GPU基本信息
 * @returns {Promise}
 */
async function getGPUBasicInfo() {
    let promise = new Promise(resolve => {
        nodeCMD.run('nvidia-smi -q -d UTILIZATION', (err, data, c) => {
            if (!err) {
                resolve(data)
            } else (
                resolve(err)
            )
        })
    })
    return await promise
}

//获取gpu基本信息
gpuRouter.get('/gpuInfo/basic', (req, res) => {
    let flag = 1
    let massage = '请求成功'
    getGPUBasicInfo().then((value) => {
        let basicInfo = value;
        res.send({
            status: flag,
            msg: massage,
            data: basicInfo
        })
    })
})

//获取gpu使用率
gpuRouter.get('/gpuInfo/usage', (req, res) => {
    let flag = 1
    let massage = '请求成功'
    getGPUUsage().then((value) => {
        let usage = value;
        res.send({
            status: flag,
            msg: massage,
            data: usage
        })
    })
})

module.exports = gpuRouter