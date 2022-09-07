//时间转换(s => d:h:m:s)
function dealTime(seconds) {
    var seconds = seconds | 0;
    var day = (seconds / (3600 * 24)) | 0;
    var hours = ((seconds - day * 3600 * 24) / 3600) | 0;
    var minutes = ((seconds - day * 3600 * 24 - hours * 3600) / 60) | 0;
    var second = seconds % 60;
    day < 10 && (day = "0" + day);
    hours < 10 && (hours = "0" + hours);
    minutes < 10 && (minutes = "0" + minutes);
    second < 10 && (second = "0" + second);
    return [day, hours, minutes, second].join(":");
}
//内存换算(bit ==> G:M:KB:B )
function dealMem(mem) {
    var G = 0,
        M = 0,
        KB = 0;
    mem > 1 << 30 && (G = (mem / (1 << 30)).toFixed(2));
    mem > 1 << 20 && mem < 1 << 30 && (M = (mem / (1 << 20)).toFixed(2));
    mem > 1 << 10 && mem > 1 << 20 && (KB = (mem / (1 << 10)).toFixed(2));
    return G > 0 ? G + "G" : M > 0 ? M + "M" : KB > 0 ? KB + "KB" : mem + "B";
}
function timeStrToSec(timestr) {
    const isS_end = timestr.slice(-1);
    const isMin_end = timestr.slice(-3);
    if (isS_end === 's') {
        return parseInt(timestr.slice(0, timestr.length - 1))
    }
    else if (isMin_end === 'min') {
        return parseInt(timestr.slice(0, timestr.length - 3)) * 60000
    }
    return 0;
}
function secToTimeStr(sec) {
    let resultTime = sec / 1000;
    const endstr = resultTime >= 60 ? 'min' : 's';
    if (endstr === 'min') {
        resultTime /= 60;
    }
    return {
        time_num: resultTime,
        time_str: resultTime + endstr
    }
}
export default {
    dealMem,
    dealTime,
    timeStrToSec,
    secToTimeStr,
}