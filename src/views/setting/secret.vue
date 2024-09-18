<template>
    <div class="user-header">
        <el-button type="primary" @click="handleAdd">+新增</el-button>
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
                :key="item.prop"
                :label="item.label"
                :prop="item.prop"
            >
                <template #default="{ row, column, $index }">
                    <div>
                        <template v-if="item.prop === 'statusLabel'">
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
                                    ><WarningFilled
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
                        label="名称"
                        prop="name"
                        :rules="[{ required: true, message: 'name是必选项' }]"
                    >
                        <el-input
                            v-model.number="formdate.name"
                            placeholder="请输入name"
                            type="name"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="platform" prop="platform">
                        <el-select
                            v-model="formdate.platform"
                            placeholder="选择类型"
                            style="width: 200px"
                            @change="handlePlatformChange"
                        >
                            <el-option label="Dingtalk" :value="1" />
                            <el-option label="Telegram" :value="2" />
                            <!-- <el-option label="微信" :value="3" />
              <el-option label="飞书" :value="4" /> -->
                            <el-option label="Jenkins" :value="5" />
                            <el-option label="用户名密码" :value="0" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row v-if="isDingtalk || isTelegram">
                <el-col :span="12">
                    <el-form-item
                        v-if="isDingtalk"
                        label="apikey"
                        prop="api_key"
                    >
                        <el-input
                            v-model="formdate.api_key"
                            placeholder="请输入apikey"
                        />
                    </el-form-item>
                    <el-form-item
                        v-if="isTelegram"
                        label="Toekn"
                        prop="tg_token"
                    >
                        <el-input
                            v-model="formdate.tg_token"
                            placeholder="请输入tg token"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        v-if="isDingtalk"
                        label="secret"
                        prop="secret"
                    >
                        <el-input
                            v-model="formdate.secret"
                            placeholder="请输入secret"
                        />
                    </el-form-item>
                    <el-form-item
                        v-if="isTelegram"
                        label="Chat-ID"
                        prop="tg_group_id"
                    >
                        <el-input
                            v-model.number="formdate.tg_group_id"
                            placeholder="请输入tg_group_id"
                        />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row v-if="isUserAuth || isJenkins">
                <el-col :span="12">
                    <el-form-item label="用户名" prop="username">
                        <el-input
                            v-model="formdate.username"
                            placeholder="请输入username"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="密码" prop="password">
                        <el-input
                            v-model="formdate.password"
                            placeholder="请输入密码"
                        />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12" v-if="isUserAuth || isJenkins">
                    <el-form-item label="地址" prop="address">
                        <el-input
                            v-model="formdate.address"
                            placeholder="请输入url路径"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="状态" prop="status">
                        <el-select
                            v-model="formdate.status"
                            placeholder="请选择"
                            style="width: 200px"
                        >
                            <el-option label="激活中" :value="1" />
                            <el-option label="未激活" :value="2" />
                            <el-option label="已废弃" :value="3" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="isDingtalk || isTelegram">
                    <el-form-item label="标记用途" prop="usage">
                        <el-select
                            v-model="formdate.usage"
                            placeholder="选择类型"
                            style="width: 200px"
                            @change="handlePlatformChange"
                        >
                            <el-option label="域名告警" :value="1" />
                            <el-option label="域名证书告警" :value="2" />
                            <el-option label="接口告警" :value="3" />
                            <el-option label="默认" :value="0" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-form-item label="描述信息" prop="mark">
                    <el-input
                        v-model="formdate.mark"
                        style="width: 530px; margin-bottom: 15px"
                        :autosize="{ minRows: 3, maxRows: 6 }"
                        type="textarea"
                        placeholder="描述信息"
                    />
                </el-form-item>
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
    <!-- </div> -->
    <el-dialog
        v-model="dialogshow"
        title="describe"
        style="width: 700px; height: auto"
    >
        <el-descriptions title="" class="margin-top" :column="1" border>
            <el-descriptions-item label="Name">
                {{ formdate.name }}
            </el-descriptions-item>
            <el-descriptions-item label="Platform">
                {{ formdate.platform }}
            </el-descriptions-item>

            <el-descriptions-item label="Token">
                {{ formdate.tg_token }}
            </el-descriptions-item>
            <el-descriptions-item label="Chat-ID">
                {{ formdate.tg_group_id }}
            </el-descriptions-item>
            <el-descriptions-item label="address">
                {{ formdate.address }}
            </el-descriptions-item>
            <el-descriptions-item label="Username">
                {{ formdate.username }}
            </el-descriptions-item>
            <el-descriptions-item label="Password">
                {{ formdate.password }}
            </el-descriptions-item>
            <el-descriptions-item label="ApiKey">
                {{ formdate.api_key }}
            </el-descriptions-item>
            <el-descriptions-item label="Secret">
                {{ formdate.secret }}
            </el-descriptions-item>
            <el-descriptions-item label="Status">
                {{ formdate.status }}
            </el-descriptions-item>
            <el-descriptions-item label="标记用途">
                {{ formdate.usage }}
            </el-descriptions-item>
            <el-descriptions-item label="CreateTime">
                {{ formdate.create_time }}
            </el-descriptions-item>
            <el-descriptions-item label="UpdateTime">
                {{ formdate.update_time }}
            </el-descriptions-item>
            <el-descriptions-item label="Remarks">
                <el-tag>{{ formdate.mark }}</el-tag>
            </el-descriptions-item>
        </el-descriptions>
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
const list = ref([])
const tableLabel = reactive([
    {
        prop: 'id',
        label: 'id'
    },
    {
        prop: 'name',
        label: '名称'
    },
    {
        prop: 'platformLabel',
        label: '类型'
    },
    {
        prop: 'mark',
        label: '描述信息'
    },
    {
        prop: 'statusLabel',
        label: '状态'
    },
    {
        prop: 'update_time',
        label: '更新时间',
        width: '200'
    }
])
onMounted(() => {
    getData(config)
})
function setPlatformLabel(item) {
    if (item.platform) {
        switch (item.platform) {
            case 0:
                return '用户名密码'
            case 1:
                return '钉钉'
            case 2:
                return '纸飞机'
            case 3:
                return '微信'
            case 4:
                return '飞书'
            case 5:
                return 'Jenkins'
            default:
                return '未知地址'
        }
    } else {
        switch (item) {
            case 0:
                return '用户名密码'
            case 1:
                return '钉钉'
            case 2:
                return '纸飞机'
            case 3:
                return '微信'
            case 4:
                return '飞书'
            case 5:
                return 'Jenkins'
            default:
                return '未知地址'
        }
    }
}
const getData = async (config) => {
    let res = await proxy.$api.secretlist(config)
    config.total = res.total

    lists.value = (res.items || []).map((item) => {
        item.platformLabel = setPlatformLabel(item)
        // item.statusLabel = item.status === 1 ? '激活' : '未激活'
        item.statusLabel = item.status
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
    console.log('page', page)
    config.page = page
    getData(config)
}
const handleSizeChange = (val) => {
    config.pageSize = val
    getData(config)
    console.log(`${val} items per page`)
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
    username: '',
    platform: '',
    api_key: '',
    secret: '',
    status: null,
    address: '',
    mark: '',
    created_time: '',
    updated_time: '',
    tg_token: '',
    tg_group_id: null,
    usage: null,
    password: ''
})
//
const ensureHttpPrefix = (address) => {
    if (!address.startsWith('http://') && !address.startsWith('https://')) {
        return `http://${address}`
    }
    return address
}
// 添加用户
const onSubmit = () => {
    proxy.$refs.dataForm.validate(async (valid) => {
        if (valid) {
            // const formdates = { ...formdate }
            if (action.value == 'add') {
                formdate.address = ensureHttpPrefix(formdate.address)
                let res = await proxy.$api.secretAdd(formdate)
                console.log('result:', res)
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
                formdate.address = ensureHttpPrefix(formdate.address)
                let res = await proxy.$api.secretUpdate(formdate)
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
            let res = await proxy.$api.secretDel({
                id: row.id
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
const dialogshow = ref(false)
const MethodOP = [
    { value: '0', label: '用户名密码' },
    { value: '1', label: '钉钉' },
    { value: '2', label: '纸飞机' },
    { value: '3', label: '微信' },
    { value: '4', label: '飞书' }
]
const SystemOP = [
    { value: 0, label: '无特殊用途' },
    { value: 1, label: '域名告警' },
    { value: 2, label: '域名证书告警' }
]
const getUsageLabel = (usageValue) => {
    const option = SystemOP.find((op) => op.value === usageValue)
    return option ? option.label : '未知' // 如果没有找到对应的值，可以返回一个默认值，如"未知"
}
const showDialog = (row) => {
    proxy.$nextTick(() => {
        Object.assign(formdate, {
            ...row,
            usage: getUsageLabel(row.usage),
            platform: setPlatformLabel(row.platform),
            status: row.status === 1 ? '激活' : '未激活'
        })
    })
    dialogshow.value = true
}
//refresh
function refreshPage() {
    //   window.location.reload();
    //   location.reload(true);
    getData(config)
}
// options shudown input
const isTokenDisabled = computed(() => {
    return formdate.platform === 1
})
const isUserAuthDisabled = computed(() => {
    return formdate.platform === 0
})

const isApiKeyAndSecretDisabled = computed(() => {
    return formdate.platform === 2
})

watch([formdate], () => {
    ;() => formdate.platform,
        (newVal) => {
            if (newVal === null) {
                formdate.token = ''
                formdate.api_key = ''
                formdate.secret = ''
            }
        }
})
//
const isJenkins = computed(() => formdate.platform === 5)
const isUserAuth = computed(() => formdate.platform === 0)
const isTelegram = computed(() => formdate.platform === 2)
const isDingtalk = computed(() => formdate.platform === 1)
const isSingleCol = computed(() => {
    return isUserAuth.value || isTelegram.value
})
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
