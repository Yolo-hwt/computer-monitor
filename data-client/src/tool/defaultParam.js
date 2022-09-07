
const basic_default = {
    exportType: {
        hostInfo: 'txt'
    },
    timer: {
        hostInfo: 300000,//5min
    },
    exportPath: {
        hostInfo: ''
    },
}
const cpu_default = {
    exportType: {
        cpuUsage: 'excel',
        cpuProcess: 'excel'
    },
    timer: {
        cpuUsageQuery: 1000,
        cpuEachQuery: 2000,
        cpuUsageSave: 60000,//1min
        cpuProcessQuery: 3000,
    },
    exportPath: {
        cpuUsage: '',
        cpuProcess: ''
    },
}
const mem_default = {
    exportType: {
        ramUsage: 'excel',
        diskInfo: 'txt'
    },
    timer: {
        ramUsageQuery: 1000,
        ramUsageSave: 60000,//1min
        diskInfo: 300000,
    },
    exportPath: {
        ramUsage: '',
        diskInfo: ''
    },
}
const net_default = {
    exportType: {
        netInfo: 'excel'
    },
    timer: {
        netInfo: 300000,//5min
    },
    exportPath: {
        netInfo: ''
    },
}
export default {
    basic_default,
    cpu_default,
    mem_default,
    net_default
}
