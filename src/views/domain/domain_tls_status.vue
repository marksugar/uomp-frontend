<template>
    <div class="user-header">
        <el-button type="primary" @click="handleAdd" disabled>+新增</el-button>
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
                :show-overflow-tooltip="true"
                :key="item.prop"
                :label="item.label"
                :prop="item.prop"
            >
                <template #default="{ row, column, $index }">
                    <div>
                        <template v-if="item.prop === 'tls_statusLabel'">
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
                        <template v-else-if="item.prop === 'name_statusLabel'">
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
                        <template v-else-if="item.prop === 'statusLabel'">
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
                        <template v-else>
                            {{ row[item.prop] }}
                        </template>
                    </div>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" min-width="180">
                <template #default="scope">
                    <el-button size="small" @click="showDialog(scope.row)">
                        <el-icon size="20"> <ZoomIn /> </el-icon>
                    </el-button>
                    <!-- <el-button
                        size="small"
                        disabled
                        @click="handleEdit(scope.row)"
                        >编辑</el-button
                    > -->
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

    <el-dialog v-model="dialogshow" title="describe" class="custom-dialog">
        <el-descriptions
            title=""
            :column="2"
            border
            class="custom-descriptions"
        >
            <el-descriptions-item label="Name">
                {{ formdate.name }}
            </el-descriptions-item>
            <el-descriptions-item label="续费时间">
                {{ formdate.cert_notbefore }}
            </el-descriptions-item>
            <el-descriptions-item label="到期时间">
                {{ formdate.cert_notafter }}
            </el-descriptions-item>
            <el-descriptions-item label="有效时间">
                <el-tag>{{ formdate.expiration_time }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
                {{ formdate.create_time }}
            </el-descriptions-item>
            <el-descriptions-item label="更新时间">
                {{ formdate.update_time }}
            </el-descriptions-item>

            <el-descriptions-item label="cert_ipaddresses">
                {{ formdate.cert_ipaddresses }}
            </el-descriptions-item>
            <el-descriptions-item label="conn_remoteaddr">
                {{ formdate.conn_remoteaddr }}
            </el-descriptions-item>
            <el-descriptions-item label="cert_version">
                {{ formdate.cert_version }}
            </el-descriptions-item>
            <el-descriptions-item label="cert_serialnumber">
                {{ formdate.cert_serialnumber }}
            </el-descriptions-item>
            <el-descriptions-item label="cert_issuer">
                {{ formdate.cert_issuer }}
            </el-descriptions-item>
            <el-descriptions-item label="cert_subject">
                {{ formdate.cert_subject }}
            </el-descriptions-item>
            <el-descriptions-item label="expire_status">
                {{ formdate.expire_status }}
            </el-descriptions-item>
        </el-descriptions>
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
        prop: 'id',
        label: 'ID',
        width: '400'
    },
    {
        prop: 'name',
        label: '名称'
    },
    {
        prop: 'cert_notbefore',
        label: '续费时间'
    },
    {
        prop: 'cert_notafter',
        label: '到期时间'
    },
    // {
    //     prop: 'cert_issuer',
    //     label: '证书issuer'
    // },
    // {
    //     prop: 'cert_subject',
    //     label: '证书subject'
    // },

    {
        prop: 'expiration_time',
        label: '过期时间'
    },
    {
        prop: 'update_time',
        label: '更新时间'
    }
])
onMounted(() => {
    getData(config)
})

//
function setPlatformLabel(item) {
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
const getData = async (config) => {
    let res = await proxy.$api.domainTlsStatuslist(config)
    config.total = res.total

    // let funclist = await proxy.$api.getaskfuncs()
    // optionsdata.value = funclist.map((item) => item)

    lists.value = (res.items || []).map((item) => {
        item.expiration_time = item.expiration_time + '天'
        return item
    })
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
// 控制模态框的显示隐藏
const dialogVisible = ref(false)
const handleClose = (done) => {
    ElMessageBox.confirm('确定关闭吗?')
        .then(() => {
            proxy.$refs.dataForm.resetFields()
            done()
        })
        .catch(() => {
            // catch error
        })
}
// 添加用户的form数据
const formdate = reactive({
    id: '',
    name: '',
    status: '',
    cert_notbefore: '',
    cert_notafter: '',
    expiration_time: '',
    cert_ipaddresses: '',
    conn_remoteaddr: '',
    cert_version: '',
    cert_serialnumber: '',
    cert_issuer: '',
    cert_subject: '',
    expire_status: '',
    created_time: '',
    updated_time: ''
})
// 添加用户
const onSubmit = () => {
    proxy.$refs.dataForm.validate(async (valid) => {
        if (valid) {
            if (action.value == 'add') {
                let res = await proxy.$api.domainAdd(formdate)
                if (res) {
                    dialogVisible.value = false
                    proxy.$refs.dataForm.resetFields()
                    getData(config)
                }
                ElMessage({
                    message: res.msg,
                    grouping: true,
                    type: 'success'
                })
            } else {
                // 编辑的接口
                let res = await proxy.$api.null(formdate)
                if (res) {
                    dialogVisible.value = false
                    proxy.$refs.dataForm.resetFields()
                    getData(config)
                }
                ElMessage({
                    message: res.msg,
                    grouping: true,
                    type: 'success'
                })
            }
        } else {
            ElMessage({
                showClose: true,
                message: '请输入正确的内容',
                type: 'error'
            })
        }
    })
}
// 取消
const handleCancel = () => {
    dialogVisible.value = false
    proxy.$refs.dataForm.resetFields()
}
// 区分编辑和新增
const action = ref('add')
// 编辑用户
const handleEdit = (row) => {
    // 浅拷贝
    action.value = 'edit'
    dialogVisible.value = true
    proxy.$nextTick(() => {
        Object.assign(formdate, row)
    })
}
// 新增用户
const handleAdd = () => {
    action.value = 'add'
    dialogVisible.value = true
}
// 删除用户
const handleDelete = (row) => {
    ElMessageBox.confirm('你确定删除吗?')
        .then(async () => {
            let res = await proxy.$api.domainTlsDel({
                id: row.name
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
//.查看
const dialogshow = ref(false)
const showDialog = (row) => {
    proxy.$nextTick(() => {
        Object.assign(formdate, row)
    })
    formdate.name = row.name
    formdate.status = row.status
    formdate.cert_notbefore = row.cert_notbefore
    formdate.cert_notafter = row.cert_notafter
    formdate.expiration_time = row.expiration_time
    formdate.cert_ipaddresses = row.cert_ipaddresses
    formdate.conn_remoteaddr = row.conn_remoteaddr
    formdate.cert_version = row.cert_version
    formdate.cert_serialnumber = row.cert_serialnumber
    formdate.cert_issuer = row.cert_issuer
    formdate.cert_subject = row.cert_subject
    formdate.expire_status = setPlatformLabel(row.expire_status)
    formdate.update_time = row.update_time
    formdate.create_time = row.create_time
    dialogshow.value = true
}
function formatDuration(seconds) {
    const years = Math.floor(seconds / (365 * 24 * 60 * 60))
    const months = Math.floor(
        (seconds % (365 * 24 * 60 * 60)) / (30 * 24 * 60 * 60)
    )
    const days = Math.floor((seconds % (30 * 24 * 60 * 60)) / (24 * 60 * 60))
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((seconds % (60 * 60)) / 60)

    if (years > 0) {
        return `${years}年${months}月${days}天`
    } else if (months > 0) {
        return `${months}月${days}天${hours}小时`
    } else if (days > 0) {
        return `${days}天${hours}小时${minutes}分钟`
    } else if (hours > 0) {
        return `${hours}小时${minutes}分钟`
    } else {
        return `${minutes}分钟`
    }
}
//refresh
function refreshPage() {
    //   window.location.reload();
    //   location.reload(true);
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
    min-width: 354px; /* 最小宽度 */
    max-width: 900px; /* 最大宽度 */
}

.custom-descriptions {
    width: 100%; /* 使 descriptions 占据 dialog 内的 100% 宽度 */
    max-height: 400px; /* 设置一个最大高度，防止内容过多时撑开 dialog */
    overflow-y: auto; /* 内容超出时显示滚动条 */
}
.keyword {
    width: 200px;
}
</style>
