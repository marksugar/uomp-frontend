/**
 * 整个项目api的管理
// 这个mock如果是true的话 用的就是mockoon提供的本地json数据
// data:{total: 0,page: 1,}
 * 
 */

import request from "./request"
const createRequest = (baseName,basePath) => ({
    [`${baseName}List`](params, suffix = 'table') {
        return request({ url: `${basePath}/${suffix}`, method: 'POST', mock: false, data: params });
    },
    [`${baseName}Add`](params, suffix = 'add') {
        return request({ url: `${basePath}/${suffix}`, method: 'POST', mock: false, data: params });
    },
    [`${baseName}Update`](params, suffix = 'update') {
        return request({ url: `${basePath}/${suffix}`, method: 'PUT', mock: false, data: params });
    },
    [`${baseName}Del`](params, suffix = 'del') {
        const { id, ...data } = params;
        return request({ url: `${basePath}/${suffix}/${id}`, method: 'DELETE', mock: false, data: params });
    },
    customGet(urlSuffix) {
        return request({ url: `${basePath}/${urlSuffix}`, method: 'GET', mock: false });
    },
});
export default {
    // home组件 左侧表格数据获取
    getTableData(params) {return request({url: '/api/tableData',method: 'get',data: params,mock: true})},
    getCountData() {return request({url: '/api/countData',method: 'get',mock: true})},
    getChartData() { return request({url: '/api/echarts',method: 'get',mock: true})},
    // getUserData(params) {return request({url: '/user/getUser',method: 'get',mock: false, data: params }) },
    // addUser(params) { return request({url: '/user/add',method: 'post',mock: false,data: params})},
    // editUser(params) {return request({url: '/user/edit',method: 'post',mock: false,data: params})},
    // deleteUser(params) {return request({url: '/user/delete',method: 'get',mock: false,data: params})},
    // 根据用户的用户名不同 返回不一样的菜单列表
    getMenu(params) { return request({ url: '/permission/getMenu', method: 'post', mock: false, data: params }) },
    // uomp
    login(params) { return request({ url: '/system/user/login', method: 'post', mock: false, data: params }) },
    // user
    userlist(params) { return request({ url: '/system/user/table', method: 'post', mock: false, data: params }) },
    userAdd(params)  { return request({ url: '/system/user/add', method: 'post', mock: false, data: params }) },
    userUpdate(params) { return request({ url: '/system/user/update', method: 'post', mock: false, data: params }) },
    userDel(params) { return request({ url: '/system/user/del', method: 'post', mock: false, data: params }) },
    repassword(params) { return request({ url: '/system/user/repassword', method: 'post', mock: false, data: params }) },
    getuser() { return request({ url: '/system/user/getuser', method: 'GET', mock: false }) },
    // getnameinfo(params) { const { user, ...data } = params; return request({ url: `/system/user/getnameinfo/${user}`, method: 'PUT', mock: false, data: params }) },
    getnameinfo(params) { return request({ url: '/system/user/getnameinfo/:user', method: 'PUT', mock: false, data: params }) },    
    
    // menu
    menulist(params) { return request({ url: '/system/menu/table', method: 'post', mock: false, data: params }) },
    menuAdd(params)  { return request({ url: '/system/menu/add', method: 'post', mock: false, data: params }) },
    menuUpdate(params) { return request({ url: '/system/menu/update', method: 'post', mock: false, data: params }) },
    menuDel(params) { return request({ url: '/system/menu/del', method: 'post', mock: false, data: params }) },
    // api
    apilist(params) { return request({ url: '/system/api/table', method: 'post', mock: false, data: params }) },
    apiAdd(params)  { return request({ url: '/system/api/add', method: 'post', mock: false, data: params }) },
    apiUpdate(params) { return request({ url: '/system/api/update', method: 'post', mock: false, data: params }) },
    apiDel(params) { return request({ url: '/system/api/del', method: 'post', mock: false, data: params }) },
    // role
    rolelist(params) { return request({ url: '/system/role/table', method: 'post', mock: false, data: params }) },
    roleAdd(params)  { return request({ url: '/system/role/add', method: 'post', mock: false, data: params }) },
    roleUpdate(params) { return request({ url: '/system/role/update', method: 'post', mock: false, data: params }) },
    roleDel(params) { return request({ url: '/system/role/del', method: 'post', mock: false, data: params }) },
    roleOperate(params) { return request({ url: '/system/role/operate', method: 'post', mock: false, data: params }) },
    // secret
    secretlist(params) { return request({ url: '/system/secret/table', method: 'post', mock: false, data: params }) },
    secretAdd(params)  { return request({ url: '/system/secret/add', method: 'post', mock: false, data: params }) },
    secretUpdate(params) { return request({ url: '/system/secret/update', method: 'post', mock: false, data: params }) },
    secretDel(params) { return request({ url: '/system/secret/del', method: 'post', mock: false, data: params }) },
    getsecretname() { return request({ url: '/system/secret/getsecretname', method: 'get', mock: false }) },

    // cron
    cronlist(params) { return request({ url: '/system/cron/table', method: 'POST', mock: false, data: params }) },
    cronAdd(params)  { return request({ url: '/system/cron/add', method: 'POST', mock: false, data: params }) },
    cronUpdate(params) { return request({ url: '/system/cron/update', method: 'POST', mock: false, data: params }) },
    cronDel(params) { return request({ url: '/system/cron/del', method: 'POST', mock: false, data: params }) },
    getaskfunc() { return request({ url: '/system/cron/getaskfunc', method: 'GET', mock: false }) },

    // etcd
    // crons
    ...createRequest("crons",'/system/crons'),
    getaskfuncs() { return request({ url: '/system/crons/getaskfunc', method: 'GET', mock: false }); },

    // domain
    ...createRequest("domain",'/system/domain'),
    domainStatuslist(params) { return request({ url: '/system/domain/tableStatus', method: 'POST', mock: false, data: params }); },
    domainStatusDel(params) {const { id, ...data } = params; return request({ url: `/system/domain/delStatus/${id}`, method: 'DELETE', mock: false, data: params }); },
    domainTlsStatuslist(params) { return request({ url: '/system/domain/tableTlsStatus', method: 'POST', mock: false, data: params }); },
    domainTlsDel(params) { const { id, ...data } = params;return request({ url: `/system/domain/delTlsStatus/${id}`, method: 'DELETE', mock: false, data: params }); },
    domainAddmany(params) { return request({ url: '/system/domain/addmany', method: 'POST', mock: false, data: params }); },

    // host
    ...createRequest("host",'/system/host'),
    hostAddmany(params) { return request({ url: '/system/host/addmany', method: 'POST', mock: false, data: params }); },
    hostupdatepasswd(params) { return request({ url: '/system/host/updatepasswd', method: 'POST', mock: false, data: params }); },
    hostshowip() { return request({ url: '/system/host/showip', method: 'GET', mock: false}); },
    hostshowtable(params) { return request({ url: '/system/host/showtable', method: 'POST', mock: false, data: params }); },


    // jenkins
    showjenkins() { return request({ url: '/system/secret/showjenkins', method: 'GET', mock: false }) },
    syncjenkins(params) { const { id, ...data } = params; return request({ url: `/system/jenkins/sync/${id}`, method: 'PUT', mock: false, data: params }) },
    jenkinstable(params) { return request({ url: '/system/jenkins/table', method: 'POST', mock: false, data: params }) },
    triggerjenkinsbuild(params) { return request({ url: '/system/jenkins/triggerbuild', method: 'PUT', mock: false, data: params }) },
    triggerjenkinsbuildconsole(params) { return request({ url: '/system/jenkins/triggerbuild/console', method: 'POST', mock: false, data: params }) },

    // r.POST("/system/approval/table", controllers.Api.Approval.Table)
    // r.PUT("/system/approval/add", controllers.Api.Approval.Add)
    
    // approval
    ...createRequest("approval",'/system/approval'),
    approvalgetatask() { return request({ url: 'system/approval/getatask', method: 'GET', mock: false }) },
    approvalgetjenkinsitem(params) { return request({ url: '/system/approval/getjenkinsitem', method: 'POST', mock: false, data: params }) },
    approveactive(params) { return request({ url: '/system/approval/approveactive', method: 'PUT', mock: false, data: params }) },    
    // approveDels(params) { const { id, ...data } = params; return request({ url: `/system/approval/del/${id}`, method: 'DELETE', mock: false, data: params }) },

    ...createRequest("detection", '/system/detection'),
    detectionaddmany(params) { return request({ url: '/system/detection/addmany', method: 'POST', mock: false, data: params }) },
}

