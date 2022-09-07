const os = require('os')
const child = require('child_process')
const iconv = require('iconv-lite')
const exec = child.exec

const express = require('express')
//创建路由对象
const cpuRouter = express.Router()

//定义sleep方法
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

class CpuInfo {
    constructor() {
        this.cpuUsageMSDefault = 1000; // CPU 利用率默认时间段
    }

    /**
     * 获取某时间段 CPU 利用率
     * @param { Number } Options.ms [时间段，默认是 1000ms，即 1 秒钟]
     * @param { Boolean } Options.percentage [true（以百分比结果返回）|false] 
     * @returns { Promise }
     */
    async _getTotalCPUUsage(options = {}) {
        const that = this;
        let { cpuUsageMS, percentage } = options;
        cpuUsageMS = cpuUsageMS || that.cpuUsageMSDefault;
        const t1 = that.getTotalCPUInfo(); // t1 时间点 CPU 信息

        await sleep(cpuUsageMS);

        const t2 = that.getTotalCPUInfo(); // t2 时间点 CPU 信息
        const idle = t2.idle - t1.idle;
        const total = t2.total - t1.total;
        let usage = 1 - idle / total;
        // console.log(percentage, typeof (percentage));
        if (percentage) {
            usage = (usage * 100.0).toFixed(2) + "%"
        } else {
            usage = usage.toFixed(4)
        }

        return usage;
    }

    /**
     * 获取 CPU 利用率信息
     * @returns { Object } CPU 利用率信息
     */
    getTotalCPUInfo() {
        const cpus = os.cpus();
        let user = 0, nice = 0, sys = 0, idle = 0, irq = 0, total = 0;

        for (let cpu in cpus) {
            const times = cpus[cpu].times;
            user += times.user;
            nice += times.nice;
            sys += times.sys;
            idle += times.idle;
            irq += times.irq;
        }

        total += user + nice + sys + idle + irq;

        return {
            user,
            sys,
            idle,
            total,
        }
    }


    /**
     * 获取各个cpu利用率
     * //index,speed,usage
     * @returns 
     */
    async _getEachCpuUsage() {
        const t1 = this.getEachCpuInfo();
        await sleep(1000);
        const t2 = this.getEachCpuInfo();
        let eachUsage = [];
        for (let i = 0; i < t1.num; i++) {
            const idle = t2.idle[i] - t1.idle[i];
            const total = t2.total[i] - t1.total[i];
            let usage = ((1 - idle / total) * 100).toFixed(2);
            let cpuobj = {
                name: 'cpu' + i,
                usage: usage,
            }
            eachUsage.push(cpuobj)
        }
        return eachUsage;
    }
    /**
     * 获取多核 CPU 中各个 CPU 信息基本信息
     * 
     * @return {Object}
     */
    getEachCpuInfo() {
        const cpus = os.cpus();
        let user = [], sys = [], idle = [], total = [];
        let num = cpus.length;
        cpus.forEach((cpu, idx, arr) => {
            const times = cpus[idx].times;
            user.push(times.user)
            sys.push(times.sys)
            idle.push(times.idle)
            total.push(times.user + times.nice + times.idle + times.irq)
            // speed.push(cpu.speed)
        });
        return {
            user,
            sys,
            idle,
            total,
            num,
        }
    }

    /**
     * 获取 CPU 基本架构信息
     * 型号，架构，线程数，频率
     * @return {string}
     */
    _getCpuBasicInfo() {
        const cpus = os.cpus();

        return {
            model: cpus[0].model,//型号
            arch: os.arch(),       //架构
            nums: cpus.length,    //线程数
            freq: cpus[0].speed,     //频率(Mhz)
        }
        // return cpus
    }
    /**
 * 获取cpu进程信息
 * @param {console|services|all|default:console} searchMode 
 * @param {asc|dec|default:dec} sortMode 
 * @param {Number|default:10} limitNum
 * @returns {string}
 */
    async _getProcessMessage(searchMode, sortMode, limitNum) {
        const that = this;
        let tempArr = [];
        let cmd = process.platform === 'win32' ? 'tasklist' : 'ps aux'
        //参数判断
        searchMode = searchMode === 'all' ? '' : (searchMode === undefined ? 'console' : searchMode)
        sortMode = sortMode === undefined ? 'dec' : sortMode
        limitNum = limitNum === undefined ? 10 : limitNum

        let promise = new Promise(resolve => {
            //执行获取结果，解码
            exec(cmd, { encoding: "gbk" }, function (err, stdout, stderr) {
                if (err) {
                    return console.error(err)
                }
                iconv.decode(stdout, "GBK").split('\n').filter((line) => {
                    let processMessage = line.trim().split(/\s+/)
                    //匹配模式
                    // console.log(processMessage);
                    if ((processMessage[2] + '').toLocaleLowerCase().indexOf(searchMode) != -1) {
                        tempArr.push(processMessage)
                    }
                    // console.log(processMessage)
                    // let processName = processMessage[0] //processMessage[0]进程名称 ， processMessage[1]进程id
                    // if (processName === name) {
                    //     return cb(processMessage[1])
                    // }
                })
                // console.log('end');
                //保存最后结果
                let resultArr = that.mergeProcess(tempArr)
                let compareFlag = sortMode === 'dec' ? 1 : -1

                resultArr.sort((a, b) => {
                    if (a.used < b.used) {
                        return compareFlag
                    }
                    if (a.used > b.used) {
                        return -compareFlag
                    }
                    return 0
                })

                // console.log(resultArr);
                resolve(resultArr.slice(0, limitNum))

            })
        })
        return await promise
    }

    /**
     * 整合同名线程
     * @param {*} tempArr 
     * @returns {string[Object]}
     */
    mergeProcess(tempArr) {
        //整合同名线程
        let resultArr = []
        let id = 1;
        tempArr.forEach((value, index, arr) => {
            //查找resultArr中是否已经记录当前线程名称
            let findIndex = resultArr.findIndex(element => element.name === value[0])
            const obj = this.valueToObj(value)
            if (findIndex !== -1) {
                resultArr[findIndex].children.push(obj)//存在则直接添加进子进程
                resultArr[findIndex].childNum += 1;
                resultArr[findIndex].used += obj.used//更新内存占用                   
            } else {
                // console.log(value);
                //新建一个进程对象
                let temp = {}
                temp.name = obj.name;
                temp.pid = id++;
                temp.used = obj.used
                temp.session = obj.session
                temp.status = obj.status
                temp.children = []; temp.children.push(obj);
                // let num = parseInt(value[4].split(',').join(''))
                temp.childNum = 1
                resultArr.push(temp)
            }
        })
        return resultArr
    }

    /**
     * 将线程数组转化为对象
     * @param {Array} value 
     */
    valueToObj(value) {
        return {
            name: value[0],
            pid: value[1],
            session: value[2],
            status: value[3],
            used: parseInt(value[4].split(',').join(''))
        }

    }
}

//请求cpu基本信息
cpuRouter.get('/cpuInfo/basic', (req, res) => {
    let cpuInfo = new CpuInfo();
    const basicInfo = cpuInfo._getCpuBasicInfo()
    let flag = 1
    let massage = '请求成功'

    res.send({
        status: flag,
        msg: massage,
        data: basicInfo
    })
})

//请求多核cpu信息(序号、频率、使用率)
cpuRouter.get('/cpuInfo/cores', (req, res) => {
    let cpuInfo = new CpuInfo();
    cpuInfo._getEachCpuUsage().then((eachCpuInfo) => {
        let flag = 1
        let massage = '请求成功'

        res.send({
            status: flag,
            msg: massage,
            data: eachCpuInfo
        })
    })

})

//请求cpu一段时间内总使用率
//客户端参数
/**
 * flag:true/false  是否返回百分比形式
 * time:(Number)  查询的时间间隔
 */
cpuRouter.get('/cpuInfo/usage', (req, res) => {
    const query = req.query
    // console.log(query);
    let cpuInfo = new CpuInfo();

    let precent = (typeof (query.flag) === 'undefined' ? 'true' : query.flag) === 'true';
    cpuInfo.cpuUsageMSDefault = typeof (query.time) === 'undefined' ? 1000 : query.time;

    var totalUsage = '0'

    cpuInfo._getTotalCPUUsage({ percentage: precent }).then((value) => {
        totalUsage = value;
        let flag = 1
        let massage = '请求成功'
        // console.log(value);
        res.send({
            status: flag,
            msg: massage,
            data: totalUsage
        })
    })
})

/**
 * 获取cpu进程信息
 * search:查找模式
 * sort:排序方式（以内存占用为标准）
 * limit:查找进程数量
 */
//要么全写参数要么全不写
cpuRouter.get('/cpuInfo/process', (req, res) => {
    const query = req.query
    let cpuInfo = new CpuInfo()
    let params = ['console', 'dec', 10]
    if (query !== undefined) {
        params[0] = query.search
        params[1] = query.sort
        params[2] = query.limit
    }
    cpuInfo._getProcessMessage(...params).then((value) => {
        processMessage = value;
        let flag = 1
        let massage = '请求成功'
        res.send({
            status: flag,
            msg: massage,
            data: processMessage
        })
    })

})
module.exports = cpuRouter


