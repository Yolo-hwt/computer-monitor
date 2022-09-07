const os = require('os')
const express = require('express')
const child = require('child_process')
const iconv = require('iconv-lite')
const exec = child.exec
//创建路由对象
const basicRouter = express.Router()

/**
 * 时间转换(s => d:h:m:s)
 * @param {*} seconds 
 * @returns {string}
 */
var dealTime = (seconds) => {
    var seconds = seconds | 0;
    var day = (seconds / (3600 * 24)) | 0;
    var hours = ((seconds - day * 3600) / 3600) | 0;
    var minutes = ((seconds - day * 3600 * 24 - hours * 3600) / 60) | 0;
    var second = seconds % 60;
    (day < 10) && (day = '0' + day);
    (hours < 10) && (hours = '0' + hours);
    (minutes < 10) && (minutes = '0' + minutes);
    (second < 10) && (second = '0' + second);
    return [day, hours, minutes, second].join(':');
};

/**
 * 内存换算(bit ==> G:M:KB:B )
 * @param {*} mem 
 * @returns {string}
 */
var dealMem = (mem) => {
    var G = 0,
        M = 0,
        KB = 0;
    (mem > (1 << 30)) && (G = (mem / (1 << 30)).toFixed(2));
    (mem > (1 << 20)) && (mem < (1 << 30)) && (M = (mem / (1 << 20)).toFixed(2));
    (mem > (1 << 10)) && (mem > (1 << 20)) && (KB = (mem / (1 << 10)).toFixed(2));
    return G > 0 ? G + 'G' : M > 0 ? M + 'M' : KB > 0 ? KB + 'KB' : mem + 'B';
};

/**
* 获取本机系统基本信息
* @return {Object}
*/
function getBasicInfo() {
    let res = {}
    res.platForm = os.platform()//os平台
    res.type = os.type();     //os内核
    res.arch = os.arch();    //cpu架构
    res.upTime = os.uptime();   //开机时间
    res.hostName = os.hostname();     //主机名
    res.homeDir = os.homedir();    //主目录

    res.release = os.release();     //发行版本
    res.userInfo = os.userInfo();   //用户信息
    res.endianness = os.endianness();//cpu字节序
    res.version = os.version();     //操作系统版本
    return res;
}

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

/**
 * 输出信息
 */
function outputInfo() {
    const basicRes = getBasicInfo()
    const memRes = getMemInfo()

    console.log("操作系统内核：" + basicRes.type);
    console.log("平台：" + basicRes.platForm);
    console.log("cpu架构：" + basicRes.cpuArch)
    console.log("开机时间：" + dealTime(basicRes.upTime));
    console.log("主机名：" + basicRes.hostName);
    console.log("主目录：" + basicRes.homeDir);
    console.log("内存大小：" + dealMem(memRes.totaLMem) + ' 空闲内存：' + dealMem(memRes.freeMem));
}
async function getSystemInfo() {
    let cmd = 'systeminfo'
    let resultArr = []
    let promise = new Promise(resolve => {
        //执行获取结果，解码
        exec(cmd, { encoding: "gbk" }, function (err, stdout, stderr) {
            if (err) {
                return console.error(err)
            }
            iconv.decode(stdout, "GBK").split('\n').filter((line) => {
                let processMessage = line.trim().split(/\s+/)
                resultArr.push(processMessage)
            })
            resolve(resultArr)
        })
    })
    return await promise
}
//挂载路由
//请求基本系统信息
basicRouter.get('/basicInfo/os', (req, res) => {
    // const query = req.query
    // let basicData = JSON.stringify(getBasicInfo())
    let basicData = [getBasicInfo()]
    let flag = 1
    let massage = '请求成功'

    res.send({
        status: flag,
        msg: massage,
        data: basicData
    })
})

//挂载路由
//请求内存信息
basicRouter.get('/basicInfo/mem', (req, res) => {
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

basicRouter.get('/basicInfo/sys', (req, res) => {
    // const query = req.query
    getSystemInfo().then((sysinfo) => {
        console.log(sysinfo);
        let sysData = sysinfo
        let flag = 1
        let massage = '请求成功'

        res.send({
            status: flag,
            msg: massage,
            data: sysData
        })
    })

})
module.exports = basicRouter



