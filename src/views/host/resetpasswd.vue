<template>
    <div class="user-header">
        <el-form-item>
            <el-button type="primary" @click="handleAddMany"
                >批量更新密码</el-button
            ></el-form-item
        >
        <el-form :inline="true" :model="formInline">
            <el-form-item label="请输入">
                <el-input
                    clearable
                    class="keyword"
                    v-model="formInline.keyword"
                    placeholder="请输入名称"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSerch">搜索</el-button>
                <el-button type="primary" @click="refreshPage"
                    ><el-icon size="23px"><Refresh /></el-icon
                ></el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="table">
        <el-table :data="lists" style="width: 100%" height="500px">
            <el-table-column
                v-for="item in tableLabel"
                :show-overflow-tooltip="false"
                :key="item.prop"
                :label="item.label"
                :prop="item.prop"
                :width="item.width ? item.width : 125"
            >
                <template #default="{ row }">
                    <div>
                        <template v-if="item.prop === 'status'">
                            <div>
                                <el-icon
                                    v-if="row[item.prop] === 1"
                                    size="25px"
                                    style="--el-icon-size: 30px; color: #26b99a"
                                    ><CircleCheckFilled
                                /></el-icon>
                                <el-icon
                                    v-else-if="row[item.prop] === 2"
                                    size="25px"
                                    style="--el-icon-size: 30px; color: #ffa500"
                                    ><CircleCloseFilled
                                /></el-icon>
                                <el-icon
                                    v-else-if="row[item.prop] === 3"
                                    size="25px"
                                    style="--el-icon-size: 30px; color: #f56c6c"
                                    ><CircleCloseFilled
                                /></el-icon>
                            </div>
                        </template>
                        <template v-else-if="item.prop === 'ip_addr.local_ip'">
                            <span
                                v-if="
                                    row.ip_addr.local_ip &&
                                    row.ip_addr.local_ip.length > 0
                                "
                            >
                                {{ row.ip_addr.local_ip.join('\n') }}
                                <!-- <el-tag>
                  <span v-html="row.ip_addr.local_ip.join('<br>')"></span
                ></el-tag> -->
                            </span>
                            <span v-else> 无内网IP </span>
                        </template>
                        <template
                            v-else-if="item.prop === 'ip_addr.external_ip'"
                        >
                            <span
                                v-if="
                                    row.ip_addr.external_ip &&
                                    row.ip_addr.external_ip.length > 0
                                "
                            >
                                {{ row.ip_addr.external_ip.join(', ') }}
                            </span>
                            <span v-else> 无外部IP </span>
                        </template>

                        <template v-else-if="item.prop === 'type'">
                            <span>
                                {{ setStatusLabel(row.type) }}
                            </span>
                        </template>

                        <template v-else-if="item.prop === 'name'">
                            <span v-if="row.name > 0">
                                {{ row.name }}
                            </span>
                            <span v-else> {{ row.info.hostname }} </span>
                        </template>

                        <template v-else-if="item.prop === 'disk_info'">
                            <ul>
                                <li
                                    v-for="disk in row.info.disk_info"
                                    :key="disk.filesystem"
                                    style="font-size: small"
                                >
                                    <div v-if="disk.mounted_on !== '/boot'">
                                        {{ disk.mounted_on }}|size:{{
                                            disk.size
                                        }}|use:{{ disk['use%'] }}
                                    </div>
                                </li>
                            </ul>
                        </template>
                        <template v-else-if="item.prop === 'logical_cpu'">
                            <span>
                                {{
                                    row.info.logical_cpu +
                                    'c' +
                                    '/' +
                                    row.info.mem_info
                                }}
                            </span>
                        </template>

                        <template v-else>
                            {{ resolveNestedProp(row, item.prop) }}
                        </template>
                    </div>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" min-width="180">
                <template #default="scope">
                    <el-button
                        type="danger"
                        size="small"
                        @click="handleDelete(scope.row)"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            v-model:current-page="currentPage4"
            v-model:page-size="pageSize4"
            :page-sizes="[20, 50, 100]"
            :size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="config.total"
            @size-change="handleSizeChange"
            @current-change="changePage"
            class="pager mt-4"
        />
    </div>

    <!-- 批量新增 -->
    <el-dialog
        v-model="dialogVisibleMany"
        :title="action == 'addmany' ? '批量更新密码' : '编辑'"
        style="width: 550px; height: auto"
        :before-close="handleCloseMany"
    >
        <el-form :inline="true" :model="formdatemany" ref="dataFormMany">
            <el-row>
                <!-- label="主机填写列表" -->
                <el-form-item prop="datas">
                    <el-divider content-position="left"
                        >选择主机列表</el-divider
                    >
                    <el-tree-select
                        v-model="formdatemany.ip"
                        :data="optionsdata"
                        multiple
                        :render-after-expand="false"
                        show-checkbox
                        style="width: 460px"
                    />
                </el-form-item>
            </el-row>
            <div style="width: 480px">
                更新进度条<el-progress
                    :color="customColorMethod"
                    :percentage="progress"
                    style="padding: 0px 0px 20px 0"
                />
            </div>
            <el-row style="justify-content: flex-end">
                <el-form-item>
                    <el-button type="primary" @click="dialogVisibleMany = false"
                        >取消</el-button
                    >
                    <el-button type="primary" @click="submitDomains"
                        >确定</el-button
                    >
                </el-form-item>
            </el-row>
        </el-form>
    </el-dialog>
</template>
<script setup>
import { getCurrentInstance, onMounted, ref, reactive } from 'vue'
import { ElMessage, ElMessageBox, formProps } from 'element-plus'

const { proxy } = getCurrentInstance()
const currentPage4 = ref(1)
const pageSize4 = ref(20)
const lists = ref([])
const size = 'default'
const tableLabel = reactive([
    {
        prop: 'uuid',
        label: 'uuid',
        width: '180px'
    },
    {
        prop: 'ip',
        label: 'ip',
        width: '140px'
    },
    {
        prop: 'type',
        label: '平台',
        width: '80px'
    },
    {
        prop: 'type',
        label: '平台',
        width: '80px'
    },
    {
        prop: 'user',
        label: '用户名',
        width: '80px'
    },
    {
        prop: 'password',
        label: '密码',
        width: '80px'
    },
    {
        prop: 'port',
        label: '端口',
        width: '80px'
    },
    {
        prop: 'status',
        label: '当前状态'
    },
    {
        prop: 'mark',
        label: '错误信息'
    },
    {
        prop: 'c',
        label: '创建时间'
    }
])
onMounted(() => {
    getData(config)
})

//
function setStatusLabel(item) {
    switch (item) {
        case 0:
            return 'defaut'
        case 1:
            return '激活中'
        case 2:
            return '未激活'
        case 3:
            return '已废弃'
        default:
            return '未标记状态'
    }
}

//
function setTypeLabel(item) {
    switch (item) {
        case 0:
            return '默认'
        case 1:
            return '本地节点'
        case 2:
            return '阿里云'
        case 3:
            return '华为云'
        case 4:
            return '腾讯云'
        case 5:
            return '亚马逊'
        default:
            return '未标记状态'
    }
}
// 批量增加
const dialogVisibleMany = ref(false)
const handleAddMany = () => {
    action.value = 'addmany'
    dialogVisibleMany.value = true
    getList()
}
const formdatemany = reactive({
    ip: ref([])
})
// 控制进度条显示和进度
const progressVisible = ref(false)
const progress = ref(0)
// 进度条
const customColorMethod = (percentage) => {
    if (percentage < 30) {
        return '#909399'
    }
    if (percentage < 70) {
        return '#e6a23c'
    }
    return '#67c23a'
}
const submitDomains = async () => {
    const formRef = proxy.$refs.dataFormMany
    formRef.validate(async (valid) => {
        if (valid) {
            if (action.value == 'addmany') {
                try {
                    progressVisible.value = true
                    progress.value = 0

                    const totalIPs = formdatemany.ip.length
                    let completedIPs = 0
                    for (const ip of formdatemany.ip) {
                        const res = await proxy.$api.hostupdatepasswd({
                            ip: [ip]
                        })
                        completedIPs++
                        progress.value = Math.round(
                            (completedIPs / totalIPs) * 100
                        )

                        if (completedIPs === totalIPs) {
                            ElMessage({
                                message: '密码批量更新完成',
                                type: 'success',
                                duration: 2000
                            })
                            dialogVisibleMany.value = false
                            progressVisible.value = false
                            getData(config) // Ensure `config` and `getData` are defined in your component
                        }
                    }
                    // const res = await proxy.$api.hostupdatepasswd({
                    //     ip: formdatemany.ip
                    // })
                    // console.log('formdatemany:', formdatemany)
                    // if (res) {
                    //     formRef.resetFields()
                    //     ElMessage({
                    //         message: res.msg,
                    //         type: 'success',
                    //         duration: 2000
                    //     })
                    //     dialogVisibleMany.value = false
                    //     getData(config) // Ensure `config` and `getData` are defined in your component
                    // }
                } catch (error) {
                    ElMessage({
                        message: '提交失败，请重试',
                        type: 'error',
                        duration: 2000
                    })
                }
            }
        }
    })
}
const handleCloseMany = (done) => {
    ElMessageBox.confirm('确定关闭吗?')
        .then(() => {
            proxy.$refs.dataFormMany.resetFields()
            progressVisible.value = false
            progress.value = 0
            done()
        })
        .catch(() => {
            // catch error
        })
}
//
const optionsdata = ref([])
const getList = async () => {
    // 列表
    let funclist = await proxy.$api.hostshowip()
    const groupedData = funclist.reduce((acc, its) => {
        const typeLabel = setTypeLabel(its.type)

        if (!acc[typeLabel]) {
            acc[typeLabel] = {
                value: typeLabel,
                label: typeLabel,
                children: []
            }
        }

        acc[typeLabel].children.push({
            value: its.ip,
            label: its.ip
        })

        return acc
    }, {})
    optionsdata.value = Object.values(groupedData)
}
const getData = async (config) => {
    let res = await proxy.$api.hostshowtable(config)
    config.total = res.total
    lists.value = (res.items || []).map((item) => {
        return item
    })
    console.log('lists', lists.value)
}
// 分页页面
const config = reactive({
    total: 0,
    page: 1, // 当前页
    name: '',
    pageSize: 20
})
const changePage = (page) => {
    config.page = page
    getData(config)
}
const handleSizeChange = (val) => {
    config.pageSize = val
    getData(config)
}
const formInline = reactive({
    keyword: ''
})
const handleSerch = () => {
    config.name = formInline.keyword
    getData(config)
}
// 解构
const resolveNestedProp = (obj, prop) => {
    return prop.split('.').reduce((o, p) => (o ? o[p] : ''), obj)
}

// 区分编辑和新增
const action = ref('add')
// 删除用户
const handleDelete = (row) => {
    ElMessageBox.confirm('你确定删除吗?')
        .then(async () => {
            let res = await proxy.$api.hostDel({
                id: row.id,
                ip: row.ip_addr.ip
            })
            ElMessage({
                showClose: true,
                message: res.msg,
                type: 'success'
            })
            getData(config)
        })
        .catch(() => {
            // catch error
        })
}
// 查看
function refreshPage() {
    getData(config)
}
</script>

<style>
/* 你可以在这里添加你的样式 */
html,
body {
    height: 100%;
    margin: 0;
}
.container {
    display: flex;
    height: 100%; /* 让容器占满整个视口高度 */
}

.table {
    width: 100%;
    padding: 10px;
    position: relative;
    height: 520px;
    .pager {
        position: absolute;
        right: 0;
        bottom: -20px;
    }
}
.user-header {
    display: flex;
    justify-content: space-between;
}
.url-column {
    background-color: blue;
    color: white;
}
.method-column {
    background-color: rgb(55, 207, 149);
    color: white;
}
.flex-container {
    display: flex;
    gap: 8px; /* 使用 gap 属性创建间隙，你可以根据需要调整间隙大小 */
}
.custom-dialog {
    width: 50%; /* 设定 dialog 的宽度，可以根据需要调整 */
}

.custom-descriptions {
    width: 100%; /* 使 descriptions 占据 dialog 内的 100% 宽度 */
    max-height: 400px; /* 设置一个最大高度，防止内容过多时撑开 dialog */

    overflow-y: auto; /* 内容超出时显示滚动条 */
}
/* key */
.el-descriptions__body
    .el-descriptions__table.is-bordered
    .el-descriptions__cell {
    border: var(--el-descriptions-table-border);
    padding: 8px 11px;
}
.el-descriptions__content.el-descriptions__cell.is-bordered-content {
    /* color: var(--el-text-color-primary); */
    width: 350px;
}

.keyword {
    width: 200px;
}
</style>