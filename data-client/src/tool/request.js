import $axios from 'axios'

//请求本地数据
async function requestLocalData(baseurl, address) {
    // var that = this;
    let promise = new Promise((resolve, reject) => {
        $axios
            .get(baseurl + address)
            .then((res) => {
                // console.log(res);
                let resObj = res.data.data;
                resolve(resObj);
            });
    });
    return await promise;
}
//请求本地数据(带参数)
async function requestLocalDataWithParams(baseurl, address, paramsObj) {
    // var that = this;
    let promise = new Promise((resolve, reject) => {
        $axios
            .get(baseurl + address, {
                params: paramsObj,
            })
            .then((res) => {
                // console.log(res);
                let resObj = res.data.data;
                resolve(resObj);
            });
    });
    return await promise;
}
export default {
    requestLocalData,
    requestLocalDataWithParams
}
