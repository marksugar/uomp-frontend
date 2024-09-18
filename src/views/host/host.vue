<template>
    <div class="user-header">
        <el-form-item>
            <el-button type="primary" @click="handleAdd">新增</el-button>
            <el-button type="primary" @click="handleAddMany"
                >批量添加</el-button
            >
            <el-button
                type="primary"
                :disabled="selectedRows.length === 0"
                @click="ExportExcel"
                ><img
                    src="../../assets/image/icons8-excel-48.png"
                    style="height: 20px"
                />导出Excel</el-button
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
        <el-table
            :data="lists"
            style="width: 100%"
            height="500px"
            v-model:selected="selectedRows"
            @selection-change="handleSelectionChange"
        >
            <!-- 多选框列 -->
            <el-table-column type="selection" width="55"></el-table-column>
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
            class="form-container"
            label-width="80px"
        >
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item
                        label="名称"
                        prop="name"
                        :rules="[{ required: true, message: 'name是必选项' }]"
                    >
                        <el-input
                            v-model="formdate.name"
                            placeholder="请输入name"
                            type="text"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="别名" prop="label">
                        <el-input
                            v-model="formdate.label"
                            placeholder="请输入别名"
                            type="text"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="用户名"
                        prop="user"
                        :rules="[{ required: true, message: '用户名是必选项' }]"
                    >
                        <el-input
                            v-model="formdate.user"
                            placeholder="请输入用户名"
                            type="text"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="密码"
                        prop="password"
                        :rules="[{ required: true, message: '密码是必选项' }]"
                    >
                        <el-input
                            v-model="formdate.password"
                            placeholder="请输入密码"
                            type="text"
                        />
                        <!-- clearable -->
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item
                        label="IP地址"
                        prop="ip_addr.ip"
                        :rules="[{ required: true, message: 'IP是必选项' }]"
                    >
                        <el-input
                            v-model="formdate.ip_addr.ip"
                            placeholder="请输入IP地址"
                            type="text"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="主机端口"
                        prop="port"
                        :rules="[{ required: true, message: '端口是必选项' }]"
                    >
                        <el-input
                            v-model="formdate.port"
                            placeholder="请输入主机端口"
                            type="text"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="内网地址" prop="ip_addr.local_ip">
                        <el-input
                            v-model="formdate.ip_addr.local_ip"
                            placeholder="请输入IP地址,多个地址用逗号隔开"
                            type="textarea"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="公开地址" prop="ip_addr.external_ip">
                        <el-input
                            v-model="formdate.ip_addr.external_ip"
                            placeholder="请输入IP地址,多个地址用逗号隔开"
                            type="textarea"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col>
                    <el-form-item
                        label="私钥"
                        prop="private_key"
                        style="width: 630px"
                    >
                        <el-input
                            v-model="formdate.private_key"
                            placeholder="请输入私钥内容,如果有的话作为备选"
                            type="textarea"
                            :rows="3"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
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
                    <el-form-item label="选择平台" prop="type">
                        <el-select
                            v-model="formdate.type"
                            placeholder="请选择是否激活"
                            style="width: 200px"
                        >
                            <el-option label="其他" :value="0" />
                            <el-option label="本地节点" :value="1" />
                            <el-option label="阿里云" :value="2" />
                            <el-option label="华为云" :value="3" />
                            <el-option label="腾讯云" :value="4" />
                            <el-option label="亚马逊" :value="5" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="描述信息" prop="mark">
                        <el-input
                            v-model="formdate.mark"
                            type="textarea"
                            placeholder="描述信息"
                            style="width: 550px"
                            :rows="2"
                        />
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
            <el-descriptions-item label="标签">
                {{ formdate.label }}
            </el-descriptions-item>
            <el-descriptions-item label="uuid">
                {{ formdate.uuid }}
            </el-descriptions-item>
            <el-descriptions-item label="状态">
                <el-tag>{{ setStatusLabel(formdate.status) }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="所属平台">
                {{ setTypeLabel(formdate.type) }}
            </el-descriptions-item>
            <el-descriptions-item label="ip">
                {{ formdate.ip_addr.ip }}
            </el-descriptions-item>
            <el-descriptions-item label="内部IP">
                {{ formdate.ip_addr.local_ip }}
            </el-descriptions-item>
            <el-descriptions-item label="外部IP">
                {{ formdate.ip_addr.external_ip }}
            </el-descriptions-item>
            <el-descriptions-item label="用户名">
                {{ formdate.user }}
            </el-descriptions-item>
            <el-descriptions-item label="密码">
                {{ formdate.password }}
            </el-descriptions-item>
            <el-descriptions-item label="旧密码">
                {{ formdate.old_password }}
            </el-descriptions-item>
            <el-descriptions-item label="SSH端口">
                {{ formdate.port }}
            </el-descriptions-item>
            <el-descriptions-item label="SSH密钥">
                {{ formdate.private_key }}
            </el-descriptions-item>

            <el-descriptions-item label="OS">
                {{ formdate.info.os_version }}
            </el-descriptions-item>
            <el-descriptions-item label="cpu型号">
                {{ formdate.info.cpu_info }}
            </el-descriptions-item>
            <el-descriptions-item label="CPU数">
                {{ formdate.info.cpu_cores }}
            </el-descriptions-item>
            <el-descriptions-item label="CPU逻辑数">
                {{ formdate.info.logical_cpu }}
            </el-descriptions-item>
            <el-descriptions-item label="内存">
                {{ formdate.info.mem_info }}
            </el-descriptions-item>
            <el-descriptions-item label="disk_info">
                <!-- {{ setDiskinfo(formdate.info.disk_info) }} -->
                <ul>
                    <li
                        v-for="disk in formdate.info.disk_info"
                        :key="disk.filesystem"
                        style="font-size: small"
                    >
                        <div v-if="disk.mounted_on !== '/boot'">
                            分区:{{ disk.mounted_on }}，总大小:{{
                                disk.size
                            }}，已使用:{{ disk['use%'] }}，剩余{{ disk.avail }}
                        </div>
                    </li>
                </ul>
            </el-descriptions-item>

            <el-descriptions-item label="备注">
                {{ formdate.mark }}
            </el-descriptions-item>
        </el-descriptions>
    </el-dialog>
    <!-- 批量新增 -->
    <el-dialog
        v-model="dialogVisibleMany"
        :title="action == 'addmany' ? '新增' : '编辑'"
        style="width: 550px; height: auto"
        :before-close="handleCloseMany"
    >
        <el-form :inline="true" :model="formdatemany" ref="dataFormMany">
            <el-row>
                <el-form-item
                    label="主机填写列表"
                    prop="datas"
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
                        v-model="formdatemany.datas"
                        placeholder="IP1,端口,密码
IP2,端口,密码"
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
import { getCurrentInstance, onMounted, ref, reactive } from 'vue'
import { ElMessage, ElMessageBox, formProps } from 'element-plus'

const { proxy } = getCurrentInstance()
const currentPage4 = ref(1)
const pageSize4 = ref(20)
const lists = ref([])
const size = 'default'
const tableLabel = reactive([
    {
        prop: 'name',
        label: '名称',
        width: '180px'
    },
    {
        prop: 'ip_addr.ip',
        label: 'ip',
        width: '140px'
    },
    {
        prop: 'type',
        label: '平台',
        width: '80px'
    },
    {
        prop: 'ip_addr.local_ip',
        label: '内网IP',
        width: '140px'
    },
    {
        prop: 'ip_addr.external_ip',
        label: '外部IP',
        width: '140px'
    },
    {
        prop: 'logical_cpu',
        label: '内存CPU'
    },
    {
        prop: 'disk_info',
        label: '磁盘状态',
        width: '200px'
    },
    {
        prop: 'status',
        label: '当前状态'
    },
    {
        prop: 'update_time',
        label: '更新时间'
    }
])
onMounted(() => {
    getData(config)
})

// 选中
// 定义一个 ref 来存储选中的行
const selectedRows = ref([])
const handleSelectionChange = (selection) => {
    selectedRows.value = selection
}
import * as XLSX from 'xlsx'
const flattenData = (data) => {
    return data.map((row) => {
        let flatRow = {}
        for (let key in row) {
            if (typeof row[key] === 'object' && !Array.isArray(row[key])) {
                for (let nestedKey in row[key]) {
                    flatRow[`${key}.${nestedKey}`] = row[key][nestedKey]
                }
            } else if (Array.isArray(row[key])) {
                flatRow[key] = row[key].join(', ') // Convert arrays to comma-separated strings
            } else {
                flatRow[key] = row[key]
            }
        }
        return flatRow
    })
}
const ExportExcel = () => {
    // Handle the selected data here
    // console.log('Selected rows for export:', selectedRows.value)
    const flatData = flattenData(selectedRows.value)
    const ws = XLSX.utils.json_to_sheet(flatData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

    const now = new Date()
    const formattedTime = `${now.getFullYear()}${String(
        now.getMonth() + 1
    ).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(
        now.getHours()
    ).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(
        now.getSeconds()
    ).padStart(2, '0')}`
    const fileName = `uomp_excel_host_${formattedTime}.xlsx`

    XLSX.writeFile(wb, fileName)
}
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
const processeddata = ref([])
const dialogVisibleMany = ref(false)
const handleAddMany = () => {
    action.value = 'addmany'
    dialogVisibleMany.value = true
}
const formdatemany = reactive({
    datas: ref([])
})
const jsonData = ref([])
const processData = (ds) => {
    // 分割输入数据，按空格或换行符
    const entries = ds.split(/[\s\n]+/)

    // 解析每条记录，并转换为 JSON 对象
    return (jsonData.value = entries
        .map((entry) => {
            const [ip, port, password] = entry.split(',')
            return { ip, port, password }
        })
        .filter((item) => item.ip && item.port && item.password))
}
const submitDomains = async () => {
    const formRef = proxy.$refs.dataFormMany
    formRef.validate(async (valid) => {
        if (valid) {
            if (action.value == 'addmany') {
                try {
                    processeddata.value = processData(formdatemany.datas)

                    const res = await proxy.$api.hostAddmany({
                        datas: processeddata.value
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
//
const getData = async (config) => {
    let res = await proxy.$api.hostList(config)
    config.total = res.total

    // let funclist = await proxy.$api.getaskfuncs()
    // optionsdata.value = funclist.map((item) => item)

    lists.value = (res.items || []).map((item) => {
        return item
    })
    // console.log('lists', lists.value)
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
    label: '',
    uuid: '',
    status: '',
    //   ip: "",
    //   local_ip: ref([]),
    //   external_ip: ref([]),
    ip_addr: {
        ip: '',
        local_ip: [],
        external_ip: []
    },
    user: '',
    password: '',
    old_password: '',
    port: '',
    private_key: '',
    mark: '',
    type: '',
    created_time: '',
    updated_time: ''
})
// 解构
const resolveNestedProp = (obj, prop) => {
    return prop.split('.').reduce((o, p) => (o ? o[p] : ''), obj)
}
// 添加用户
const onSubmit = () => {
    proxy.$refs.dataForm.validate(async (valid) => {
        if (valid) {
            if (action.value == 'add') {
                let res = await proxy.$api.hostAdd(formdate)
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
                let res = await proxy.$api.hostUpdate(formdate)
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
            let res = await proxy.$api.hostDel({
                id: row.ip_addr.ip
                // id: row.id,
                // ip: row.ip_addr.ip
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
const showDialog = (row) => {
    proxy.$nextTick(() => {
        Object.assign(formdate, row)
    })
    // formdate.name = row.name
    // formdate.status = setStatusLabel(row.status)
    // formdate.label = row.label
    // formdate.ip_addr.ip = row.ip
    // formdate.ip_addr.local_ip = row.local_ip
    // formdate.ip_addr.external_ip = row.external_ip
    // formdate.user = row.user
    // formdate.password = row.password
    // formdate.old_password = row.old_password
    // formdate.port = row.port
    // formdate.idrsa = row.idrsa
    // formdate.mark = row.mark
    // formdate.update_time = row.update_time
    // formdate.created_time = row.created_time
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
/* key */
.el-descriptions__body
    .el-descriptions__table.is-bordered
    .el-descriptions__cell {
    border: var(--el-descriptions-table-border);
    padding: 8px 11px;
}
.el-descriptions__content.el-descriptions__cell.is-bordered-content {
    /* color: var(--el-text-color-primary); */
    width: 300px;
}
.keyword {
    width: 200px;
}
</style>