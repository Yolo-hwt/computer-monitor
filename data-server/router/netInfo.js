const os = require('os')
const express = require('express')
const netRouter = express.Router()


// 名称：   netWorkName
// 地址：   address
// 掩码：   netmask
// mac地址：mac
// 协议族： family

/**
 * 获取网卡信息
 * @returns {Array}
 */
function getNetWorkInfo() {
    let netInfo = []
    const networksObj = os.networkInterfaces();
    for (let nw in networksObj) {
        let objArr = networksObj[nw];
        let netItem = {}
        netItem.netWorkName = nw;

        objArr.forEach((obj, index, arr) => {
            netItem.address = obj.address;
            netItem.netmask = obj.netmask;
            netItem.mac = obj.mac;
            netItem.family = obj.family;
        });
        netInfo.push(netItem)
    }
    return netInfo
}

netRouter.get('/netInfo/network', (req, res) => {
    let flag = 1
    let massage = '请求成功'
    let network = getNetWorkInfo()
    res.send({
        status: flag,
        msg: massage,
        data: network

    })
})

module.exports = netRouter






