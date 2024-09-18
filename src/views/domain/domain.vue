<template>
    <div class="user-header">
        <el-form-item>
            <el-button type="primary" @click="handleAdd">添加域名</el-button>
            <el-button type="primary" @click="handleAddMany"
                >批量添加</el-button
            >
        </el-form-item>
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
                        <template v-else-if="item.prop === 'lastday'">
                            {{ row[item.prop] }}天
                        </template>
                        <template v-else>
                            {{ row[item.prop] }}
                        </template>
                    </div>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" min-width="180">
                <template #default="scope">
                    <!-- <el-button size="small" @click="showDialog(scope.row)">
                        <el-icon size="20"> <ZoomIn /> </el-icon>
                    </el-button> -->
                    <el-button size="small" @click="handleEdit(scope.row)"
                        >编辑</el-button
                    >
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
    <el-dialog
        v-model="dialogVisible"
        :title="action == 'add' ? '新增' : '编辑'"
        style="width: 700px; height: auto"
        :before-close="handleClose"
    >
        <el-form
            :inline="true"
            :model="formdate"
            ref="dataForm"
            label-width="80px"
        >
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="域名"
                        prop="name"
                        :rules="[{ required: true, message: '域名是必选项' }]"
                    >
                        <el-input
                            v-model="formdate.name"
                            placeholder="请输入域名"
                            type="name"
                            :disabled="action !== 'add'"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="域名检测" prop="name_status">
                        <el-select
                            v-model="formdate.name_status"
                            placeholder="请选择是否激活"
                            style="width: 200px"
                        >
                            <el-option label="激活中" :value="1" />
                            <el-option label="未激活" :value="2" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="启用状态" prop="status">
                        <el-select
                            v-model="formdate.status"
                            placeholder="请选择是否激活"
                            style="width: 200px"
                        >
                            <el-option label="激活中" :value="1" />
                            <el-option label="未激活" :value="2" />
                            <el-option label="已废弃" :value="3" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="证书检测" prop="tls_status">
                        <el-select
                            v-model="formdate.tls_status"
                            placeholder="请选择是否激活"
                            style="width: 200px"
                        >
                            <el-option label="激活中" :value="1" />
                            <el-option label="未激活" :value="2" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="描述信息" prop="mark">
                        <el-input
                            v-model="formdate.mark"
                            style="width: auto"
                            autosize
                            type="textarea"
                            placeholder="描述信息"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <!-- <el-form-item label="时间周期" prop="interval">
                        <el-input-number
                            v-model="inputNumber"
                            placeholder="输入数字"
                            @input="updateInterval"
                        ></el-input-number>
                        <el-select
                            v-model="selectedUnit"
                            placeholder="选择单位"
                            style="width: 75px"
                        >
                            <el-option label="分钟" value="minute"></el-option>
                            <el-option label="小时" value="hour"></el-option>
                            <el-option label="天" value="day"></el-option>
                            <el-option label="周" value="week"></el-option>
                            <el-option label="个月" value="month"></el-option>
                            <el-option label="秒" value="second"></el-option>
                        </el-select> 
                    </el-form-item>-->
                    <el-form-item label="到期通知" prop="interval">
                        <el-input-number
                            v-model="formdate.lastday"
                            placeholder="请输入天数"
                            type="text"
                        ></el-input-number>
                        天
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row style="justify-content: flex-end">
                <el-form-item>
                    <el-button type="primary" @click="handleCancel"
                        >取消</el-button
                    >
                    <el-button type="primary" @click="onSubmit">确定</el-button>
                </el-form-item>
            </el-row>
        </el-form>
    </el-dialog>
    <el-dialog
        v-model="dialogVisibleMany"
        :title="action == 'addmany' ? '新增' : '编辑'"
        style="width: 550px; height: auto"
        :before-close="handleCloseMany"
    >
        <el-form :inline="true" :model="formdatemany" ref="dataFormMany">
            <el-row>
                <el-form-item
                    label="域名列表"
                    prop="domains"
                    :rules="[
                        {
                            required: true,
                            message: '域名是必选项',
                            trigger: 'blur'
                        }
                    ]"
                >
                    <el-input
                        style="width: 340px"
                        :autosize="{ minRows: 5, maxRows: 14 }"
                        v-model="formdatemany.domains"
                        placeholder="请输入域名，多个域名用逗号或者空格分隔"
                        type="textarea"
                    />
                </el-form-item>
            </el-row>

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
import {
    getCurrentInstance,
    onMounted,
    ref,
    reactive,
    computed,
    watch
} from 'vue'
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
        prop: 'name_statusLabel',
        label: '域名检测'
    },
    {
        prop: 'tls_statusLabel',
        label: '证书检测'
    },

    {
        prop: 'statusLabel',
        label: '状态'
    },
    {
        prop: 'lastday',
        label: '过期通知时间',
        width: '400'
    },
    {
        prop: 'mark',
        label: '描述信息'
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
    if (item.platform) {
        switch (item.platform) {
            case 1:
                return '激活中'
            case 2:
                return '未激活'
            case 3:
                return '已废弃'
            default:
                return '未知地址'
        }
    } else {
        switch (item) {
            case 1:
                return '激活中'
            case 2:
                return '未激活'
            case 3:
                return '已废弃'
            default:
                return '未知地址'
        }
    }
}
const getData = async (config) => {
    let res = await proxy.$api.domainList(config)
    config.total = res.total

    // let funclist = await proxy.$api.getaskfuncs()
    // optionsdata.value = funclist.map((item) => item)

    lists.value = (res.items || []).map((item) => {
        // item.statusLabel = setPlatformLabel(item.status)
        // item.name_statusLabel = setPlatformLabel(item.name_status)
        // item.tls_statusLabel = setPlatformLabel(item.tls_status)
        item.statusLabel = item.status
        item.name_statusLabel = item.name_status
        item.tls_statusLabel = item.tls_status
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
    name: '',
    name_status: '',
    tls_status: '',
    lastday: '',
    status: '',
    mark: '',
    created_time: '',
    updated_time: ''
})

// 添加多条域名

const formdatemany = reactive({
    domains: ref([])
})
const handleCloseMany = (done) => {
    ElMessageBox.confirm('确定关闭吗?')
        .then(() => {
            proxy.$refs.dataFormMany.resetFields()
            done()
        })
        .catch(() => {
            // catch error
        })
}
const processedDomains = ref([])
// 验证域名的正则表达式
const domainPattern = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.(?:[A-Z|a-z]{2,})$/
// 处理域名的函数
const processDomains = (domains) => {
    // 正则表达式验证域名
    const domainRegex =
        /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/

    // 处理输入数据，去除空格和换行符
    return domains
        .split(/[\s,]+/) // 根据空格、换行和逗号分隔
        .map((domain) => domain.trim())
        .filter((domain) => domain.length > 0 && domainRegex.test(domain))
}
// 处理

const submitDomains = async () => {
    const formRef = proxy.$refs.dataFormMany
    formRef.validate(async (valid) => {
        if (valid) {
            if (action.value == 'addmany') {
                try {
                    processedDomains.value = processDomains(
                        formdatemany.domains
                    )
                    const res = await proxy.$api.domainAddmany({
                        domains: processedDomains.value
                    })
                    if (res) {
                        formRef.resetFields()
                        ElMessage({
                            message: res.msg,
                            type: 'success',
                            duration: 2000
                        })
                        dialogVisibleMany.value = false
                        getData(config) // Ensure `config` and `getData` are defined in your component
                    }
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
                let res = await proxy.$api.domainUpdate(formdate)
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
// 批量增加
const dialogVisibleMany = ref(false)
const handleAddMany = () => {
    action.value = 'addmany'
    dialogVisibleMany.value = true
}
// 删除用户
const handleDelete = (row) => {
    ElMessageBox.confirm('你确定删除吗?')
        .then(async () => {
            let res = await proxy.$api.domainDel({
                id: row.name
                // id: row.id,
                // name: row.name
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
// 时间转换
// 时间格式转换
const inputNumber = ref(0) // 用户输入的数字
const selectedUnit = ref('second') // 默认单位
const updateInterval = () => {
    const number = parseFloat(inputNumber.value)
    if (isNaN(number)) {
        return
    }

    let seconds = 0
    switch (selectedUnit.value) {
        case 'month':
            seconds = number * 30 * 24 * 60 * 60
            break
        case 'week':
            seconds = number * 7 * 24 * 60 * 60
            break
        case 'day':
            seconds = number * 24 * 60 * 60
            break
        case 'hour':
            seconds = number * 60 * 60
            break
        case 'minute':
            seconds = number * 60
            break
        case 'second':
            seconds = number
            break
    }
    formdate.lastday = seconds
}
const updateSelectFromSeconds = (seconds) => {
    if (seconds % (30 * 24 * 60 * 60) === 0) {
        selectedUnit.value = 'month'
        inputNumber.value = seconds / (30 * 24 * 60 * 60)
    } else if (seconds % (7 * 24 * 60 * 60) === 0) {
        selectedUnit.value = 'week'
        inputNumber.value = seconds / (7 * 24 * 60 * 60)
    } else if (seconds % (24 * 60 * 60) === 0) {
        selectedUnit.value = 'day'
        inputNumber.value = seconds / (24 * 60 * 60)
    } else if (seconds % (60 * 60) === 0) {
        selectedUnit.value = 'hour'
        inputNumber.value = seconds / (60 * 60)
    } else if (seconds % 60 === 0) {
        selectedUnit.value = 'minute'
        inputNumber.value = seconds / 60
    } else {
        selectedUnit.value = 'second'
        inputNumber.value = seconds
    }
}
watch([inputNumber, selectedUnit], updateInterval)
const formatInterval = (interval) => {
    if (interval >= 30 * 24 * 60 * 60) {
        return `${Math.floor(interval / (30 * 24 * 60 * 60))} 个月`
    } else if (interval >= 7 * 24 * 60 * 60) {
        return `${Math.floor(interval / (7 * 24 * 60 * 60))} 周`
    } else if (interval >= 24 * 60 * 60) {
        return `${Math.floor(interval / (24 * 60 * 60))} 天`
    } else if (interval >= 60 * 60) {
        return `${Math.floor(interval / (60 * 60))} 小时`
    } else if (interval >= 60) {
        return `${Math.floor(interval / 60)} 分钟`
    } else {
        return `${interval} 秒`
    }
}
watch(
    () => formdate.lastday,
    (newVal) => {
        updateSelectFromSeconds(newVal)
    }
)
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
.keyword {
    width: 200px;
}
</style>
