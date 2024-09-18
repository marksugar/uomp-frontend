<template>
    <div class="user-header">
        <el-form-item>
            <el-button type="primary" @click="handleAdd">新增</el-button>
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
                        <template v-if="item.prop === 'Status'">
                            <div>
                                <el-icon
                                    v-if="row[item.prop] === 'pending'"
                                    size="25px"
                                    style="--el-icon-size: 30px; color: #26b99a"
                                >
                                    <img
                                        src="../../assets/image/icons8-hourglass-1.png"
                                        style="
                                            height: 30px;
                                            width: 30px;
                                            justify-content: center;
                                            align-items: center;
                                            display: flex;
                                        "
                                    />
                                </el-icon>
                                <el-icon
                                    v-else-if="row[item.prop] === 'approved'"
                                    size="25px"
                                    style="--el-icon-size: 30px; color: #26b99a"
                                    ><CircleCheckFilled
                                /></el-icon>
                                <el-icon
                                    v-else-if="row[item.prop] === 'rejected'"
                                    size="25px"
                                    style="--el-icon-size: 30px; color: #f56c6c"
                                    ><CircleCloseFilled
                                /></el-icon>
                            </div>
                        </template>

                        <template
                            v-else-if="item.prop === 'TaskJenkins.jenkins_item'"
                        >
                            <span v-if="row.TaskJenkins.jenkins_item">
                                {{ row.TaskJenkins.jenkins_item }}
                            </span>
                            <span v-else> 无外部IP </span>
                        </template>
                        <template v-else-if="item.prop === 'describe'">
                            <span
                                v-if="row.describe && row.describe.length > 0"
                            >
                                {{ row.describe }}
                            </span>
                            <span v-else> 没有描述 </span>
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
                    <el-button @click="viewApprovalInfo(scope.row)" size="small"
                        >查看审批信息</el-button
                    >
                    <!-- <el-button size="small" @click="handleEdit(scope.row)"
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
    <el-dialog
        v-model="dialogVisible"
        :title="action == 'add' ? '新增' : '编辑'"
        class="custom-dialog"
        :before-close="handleClose"
    >
        <el-form
            :model="formdate"
            ref="dataForm"
            label-width="100px"
            label-position="left"
            size="default"
            class="custom-form"
        >
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item
                        label="任务名称"
                        prop="name"
                        :rules="[
                            { required: true, message: '任务名称是必选项' }
                        ]"
                    >
                        <el-input
                            v-model="formdate.name"
                            placeholder="请输入任务名称"
                            :disabled="action !== 'add'"
                        />
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="任务选项" prop="type">
                        <el-select
                            v-model="formdate.type"
                            placeholder="请选择一个项目"
                            @click="getatask"
                        >
                            <el-option
                                v-for="item in optionsdata2"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="Jenkins账号" prop="jenkins">
                        <el-select
                            v-model="formdate.jenkins"
                            placeholder="请选择Jenkins账号"
                            @click="getjenkins"
                        >
                            <el-option
                                v-for="item in optionsdata3"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="参与人员" prop="approverIDs">
                        <el-select
                            v-model="formdate.approverIDs"
                            placeholder="请选择参与人员"
                            multiple
                            clearable
                            @click="getuser"
                        >
                            <el-option
                                v-for="item in optionsdata1"
                                :key="item.user_id"
                                :label="item.username"
                                :value="item.user_id"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="项目列表" prop="jenkinsItem">
                        <el-select
                            v-model="formdate.jenkinsItem"
                            placeholder="请选择Jenkins项目"
                        >
                            <el-option
                                v-for="item in optionsdata4"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row
                :gutter="20"
                v-if="projectParameters.length > 0"
                class="item-args"
            >
                <el-col :span="24">
                    <el-form-item
                        v-for="(param, index) in projectParameters"
                        :key="index"
                        :label="param.name"
                        :prop="param.name"
                        class="param-item"
                    >
                        <el-input
                            v-if="param.type === 'StringParameterDefinition'"
                            v-model="param.defaultParameterValue.value"
                            :placeholder="'请输入' + param.description"
                        />
                        <!--                             v-model="formdate[param.name]" -->
                        <el-select
                            v-if="param.type === 'ChoiceParameterDefinition'"
                            v-model="param.defaultParameterValue.value"
                            :placeholder="'请选择' + param.description"
                        >
                            <el-option
                                v-for="choice in param.choices"
                                :key="choice"
                                :label="choice"
                                :value="choice"
                            />
                        </el-select>
                        <p class="param-description" v-if="param.description">
                            {{ param.description }}
                        </p>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="描述信息" prop="describe">
                        <el-input
                            v-model="formdate.describe"
                            type="textarea"
                            placeholder="描述信息"
                        />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="20" justify="end">
                <el-col :span="24">
                    <el-form-item>
                        <el-button type="primary" @click="handleCancel"
                            >取消</el-button
                        >
                        <el-button type="primary" @click="onSubmit"
                            >确定</el-button
                        >
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-dialog>

    <!-- 审批信息区域 -->
    <el-drawer
        v-model="showApprovalInfo"
        title="审批详情"
        direction="ltr"
        :before-close="ApprovalhandleClose"
        size="35%"
        class="custom-drawer"
    >
        <el-divider content-position="left">任务简讯</el-divider>
        <el-descriptions class="margin-top" :column="1" :size="size" border>
            <el-descriptions-item label="类型">
                {{ taskData.Type }}</el-descriptions-item
            >
            <el-descriptions-item label="构建凭据名称">{{
                taskData.TaskJenkins.jenkins_name
            }}</el-descriptions-item>
            <el-descriptions-item label="构建地址">{{
                taskData.TaskJenkins.address
            }}</el-descriptions-item>
            <el-descriptions-item label="构建项目名称">
                {{ taskData.TaskJenkins.jenkins_item }}
            </el-descriptions-item>
            <el-descriptions-item label="构建参数">
                {{ taskData.TaskJenkins.params }}
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
                {{ taskData.create_time }}
            </el-descriptions-item>
        </el-descriptions>
        <div class="timelinecontainer">
            <el-divider content-position="left">审批人员</el-divider>
            <el-timeline>
                <el-timeline-item
                    v-for="approval in taskData.AlApproval"
                    :key="approval.id"
                    :timestamp="approval.approval_time || '未审批'"
                    :color="getTimelineColor(approval.status)"
                >
                    <p>审批人: {{ approval.AlUser.name }}</p>
                    <p>审批人ID: {{ approval.AlUser.approverID }}</p>
                    <p>状态: {{ getApprovalStatusText(approval.status) }}</p>
                    <p>评论: {{ approval.comment || '没有' }}</p>
                    <!-- 判断当前登录的用户ID是否等于审批人ID -->
                </el-timeline-item>
                <el-divider />
            </el-timeline>
        </div>
        <!-- 判断当前用户是否为审批人 -->
        <template v-if="ReviewPermission">
            <el-autocomplete
                v-model="dcomment.comment"
                style="width: 100%; margin-bottom: 15px"
                placeholder="请填写评论"
                :autosize="{ minRows: 3, maxRows: 6 }"
                type="textarea"
                :fetch-suggestions="querySearch"
                @select="handleSelect"
            />
            <el-row justify="end" style="text-align: right">
                <el-button type="success" @click="approveTask">同意</el-button>
                <el-button type="danger" @click="rejectTask">驳回</el-button>
            </el-row>
        </template>
    </el-drawer>
</template>
<script setup>
import {
    getCurrentInstance,
    onMounted,
    ref,
    reactive,
    watch,
    computed
} from 'vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

const { proxy } = getCurrentInstance()
const currentPage4 = ref(1)
const pageSize4 = ref(20)
const lists = ref([])
const size = 'default'
const tableLabel = reactive([
    {
        prop: 'ID',
        label: 'ID'
    },
    {
        prop: 'name',
        label: '名称'
    },
    {
        prop: 'Type',
        label: '类型'
    },
    {
        prop: 'TaskJenkins.jenkins_item',
        label: '项目名称'
    },
    {
        prop: 'Status',
        label: '状态'
    },
    {
        prop: 'describe',
        label: '描述信息'
    },
    {
        prop: 'create_time',
        label: '创建时间'
    }
])
// form数据
const formdate = reactive({
    name: '',
    user: '',
    type: '',
    status: '',
    params: '',
    describe: '',
    created_time: '',
    updated_time: '',
    approverIDs: '',
    jenkins: '',
    jenkinsItem: ''
})

onMounted(() => {
    getData(config)
    restaurants.value = commentOptions()
})

// 数据表单
const getData = async (config) => {
    let res = await proxy.$api.approvalList(config)
    config.total = res.total

    lists.value = (res.items || []).map((item) => {
        return item
    })
}
const optionsdata1 = ref([])
const getuser = async () => {
    let funclist = await proxy.$api.getuser()
    optionsdata1.value = funclist.map((item) => item)
}

const optionsdata2 = ref([])
const getatask = async () => {
    let funclist = await proxy.$api.approvalgetatask()
    optionsdata2.value = funclist.map((item) => item)
}

// list jenkins user
const optionsdata3 = ref([])
const getjenkins = async () => {
    let res = await proxy.$api.showjenkins()
    // optionsdata3.value = (res || []).map((item) => item)
    optionsdata3.value = (res || []).map((item) => {
        return item
    })
}

// list jenkins item
const optionsdata4 = ref([])
const getjenkinsitem = async (selectedJenkins) => {
    const { username, password, address } = selectedJenkins
    const data = {
        username: username,
        password: password,
        address: address
    }
    let res = await proxy.$api.approvalgetjenkinsitem(data)
    if (res.msg) {
        ElNotification({
            title: 'error',
            message: res.msg,
            type: 'error',
            position: 'top-left',
            duration: 0
        })
    }
    optionsdata4.value = (res || []).map((item) => item)
}

// watch jenkins的选中字段，将选中字段通过item返回，传递给后端拉出项目列表
// watch formdate.jenkins的选中id后，根据此id在已经获取到数据中查询出所有的数据
// 将数据传给getjenkinsitem函数
watch(
    () => formdate.jenkins,
    (selecte) => {
        if (selecte) {
            const selectedJenkins = optionsdata3.value.find(
                (item) => item.id === selecte
            )
            getjenkinsitem(selectedJenkins)
        }
    }
)
// 自动处理参数
const projectParameters = ref([]) // 用于存储项目的参数定义
const setJenkinsParameters = async (selected) => {
    // 在optionsdata4中查找选中的项目名称获取数据

    console.log('setJenkins:', selected.parameterDefinitions)
    // 处理返回的数据
    if (
        selected.parameterDefinitions &&
        selected.parameterDefinitions.length > 0
    ) {
        projectParameters.value = selected.parameterDefinitions.map((param) => {
            if (param.type === 'ChoiceParameterDefinition') {
                param.choices = param.choices || []
            }
            // 初始化 formdate 中的默认值
            formdate[param.name] = param.defaultParameterValue.value
            return param
        })
    }
}
// watch jenkinsItem的选中字段，将选中字段通过item返回,自动配置参数
watch(
    () => formdate.jenkinsItem,
    (selected) => {
        if (selected) {
            //   const { username, password, address } = selected;
            const selectedJenkinsitem = optionsdata4.value.find(
                (item) => item.name === selected
            )
            setJenkinsParameters(selectedJenkinsitem)
        }
    }
)

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

// onSubmit按钮处理
const approverIDs = ref([])
const mapData = ref({})
const onSubmit = () => {
    proxy.$refs.dataForm.validate(async (valid) => {
        if (valid) {
            if (action.value == 'add') {
                console.log('projectParameters.value:', projectParameters.value)
                mapData.value = projectParameters.value.reduce((acc, item) => {
                    acc[item.defaultParameterValue.name] =
                        item.defaultParameterValue.value
                    return acc
                }, {})
                formdate.params = mapData.value

                let res = await proxy.$api.approvalAdd(formdate)
                console.log('add:', formdate, approverIDs)
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
                //let res = await proxy.$api.domainUpdate(formdate)
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
//评论
const commentOptions = () => {
    return [
        { value: '同意，审批通过' },
        { value: '本次同意,下次需要邮件说明' },
        { value: '需要其他补充,本次驳回' },
        { value: '不同意，驳回' }
    ]
}
const restaurants = ref([])
const querySearch = (queryString, cb) => {
    const results = queryString
        ? restaurants.value.filter(createFilter(queryString))
        : restaurants.value
    cb(results)
}
const createFilter = (queryString) => {
    console.log('queryString:', queryString)
    return (restaurant) => {
        return (
            restaurant.value
                .toLowerCase()
                .indexOf(queryString.toLowerCase()) === 0
        )
    }
}
const handleSelect = (item) => {
    console.log(item)
}

// 控制审批信息的显示
const showApprovalInfo = ref(false)
const ApprovalhandleClose = (done) => {
    ElMessageBox.confirm('确定关闭吗?')
        .then(() => {
            done()
        })
        .catch(() => {
            // catch error
        })
}
const taskData = ref({})
// 点击查看审批信息
const viewApprovalInfo = async (row) => {
    console.log(isCurrentUserApprover)
    showApprovalInfo.value = true
    isCurrentUserApprover(row)

    // showApprovalInfo.value = !showApprovalInfo.value
}

// 从 localStorage 获取当前用户的ID
const currentUserID = parseInt(localStorage.getItem('user_id')) // 获取当前登录的用户id
const ReviewPermission = ref(false)
const isCurrentUserApprover = (row) => {
    taskData.value = row
    // 遍历 AlApproval 数组，找到至少一个 approverID 等于 currentUserID 且 status 为 pending 的项
    ReviewPermission.value = row.AlApproval.some(
        (approval) =>
            approval.AlUser.approverID === currentUserID &&
            approval.status === 'pending'
    )
}

// 处理审批操作
const dcomment = reactive({
    taskid: '',
    comment: '',
    status: '',
    approverIDs: ''
})
const approveTask = async () => {
    try {
        // 在这里调用API进行任务审批操作
        dcomment.taskid = taskData.value.ID
        dcomment.approverIDs = currentUserID
        dcomment.status = 'approved'
        let res = await proxy.$api.approveactive(dcomment)
        if (res) {
            ElMessage({
                message: '任务已同意',
                type: 'success'
            })
            showApprovalInfo.value = false
            // 更新审批信息...
        }
    } catch (error) {
        ElMessage({
            message: '审批失败',
            type: 'error'
        })
    }
}
const rejectTask = async () => {
    try {
        // 在这里调用API进行任务驳回操作
        dcomment.status = 'rejected'
        dcomment.taskid = taskData.value.ID
        dcomment.approverIDs = currentUserID
        let res = await proxy.$api.approveactive(dcomment)
        if (res) {
            ElMessage({
                message: '任务已驳回',
                type: 'success'
            })
            showApprovalInfo.value = false
            // 更新审批信息...}
        }
    } catch (error) {
        ElMessage({
            message: '驳回失败',
            type: 'error'
        })
    }
}
// 获取时间轴颜色
const getTimelineColor = (status) => {
    switch (status) {
        case 'approved':
            return 'green'
        case 'rejected':
            return 'red'
        default:
            return 'blue'
    }
}
// 获取审批状态文本
const getApprovalStatusText = (status) => {
    switch (status) {
        case 'approved':
            return '通过审批'
        case 'rejected':
            return '驳回'
        default:
            return '待审批'
    }
}

// 区分编辑和新增
const action = ref('add')
// 编辑
const handleEdit = (row) => {
    // 浅拷贝
    action.value = 'edit'
    dialogVisible.value = true
    proxy.$nextTick(() => {
        Object.assign(formdate, row)
    })
}
// 新增
const handleAdd = () => {
    action.value = 'add'
    dialogVisible.value = true
}
// 取消
const handleCancel = () => {
    dialogVisible.value = false
    proxy.$refs.dataForm.resetFields()
}
// 删除按钮
const handleDelete = (row) => {
    ElMessageBox.confirm('你确定删除吗?')
        .then(async () => {
            let res = await proxy.$api.approvalDel({
                id: row.ID
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

watch(
    () => formdate.lastday,
    (newVal) => {
        updateSelectFromSeconds(newVal)
    }
)

// 刷新按钮
function refreshPage() {
    //   window.location.reload();
    //   location.reload(true);
    getData(config)
}

// 分页配置部分
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

/*  dialog */
.custom-dialog {
    width: 40%;
    max-width: 700px;
    min-width: 500px;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.custom-form {
    padding: 20px;
}

.param-description {
    font-size: 12px;
    color: #888;
    margin-top: 5px;
}
.param-item {
    margin-bottom: 20px;
}
.item-args {
    border-radius: 10px;
    padding-left: 15px;
    border: 1px solid rgb(203, 203, 209);
    padding-block: 10px;
}

.el-drawer__header {
    align-items: center;
    color: rgb(114, 118, 123);
    display: flex;
    margin-bottom: 0px;
    padding: var(--el-drawer-padding-primary);
    padding-bottom: 0;
}
/* 审批人员样式 */
.timelinecontainer {
    max-height: 400px; /* 设置固定的最大高度 */
    overflow-y: auto; /* 超出时显示滚动条 */
    margin: 0 auto; /* 如果需要居中对齐 */
    padding: 10px; /* 为容器添加一些内边距 */
}

.el-timeline {
    margin: 0;
    padding: 0;
}
.custom-drawer {
    width: 400px; /* 固定宽度 */
    min-width: 354px; /* 最小宽度 */
    max-width: 600px; /* 最大宽度 */
}
.custom-drawer .el-drawer__body {
    width: 100%; /* 保持内容区域与抽屉一致 */
}
</style>
