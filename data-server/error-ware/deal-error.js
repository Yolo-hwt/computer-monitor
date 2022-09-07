
function dealWithError(err, req, res, next) {
    console.log("get error:" + err);
    res.send('ERROR:' + err.message)
}
module.exports = dealWithError
