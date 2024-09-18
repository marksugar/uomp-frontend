<template>
    <div class="user-header">
        <el-button type="primary" disabled @click="handleAdd">+新增</el-button>
        <el-form :inline="true" :model="formInline">
            <el-form-item label="请输入">
                <el-input
                    v-model="formInline.keyword"
                    placeholder="请输入名称"
                    clearable
                    class="keyword"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSerch">搜索</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="container">
        <div class="table">
            <el-table
                :show-overflow-tooltip="false"
                :data="lists"
                style="width: 100%"
                height="500px"
                row-key="id"
                :tree-props="{
                    children: 'Children',
                    hasChildren: 'hasChildren'
                }"
            >
                <el-table-column
                    v-for="item in tableLabel"
                    :key="item.prop"
                    :label="item.label"
                    :prop="item.prop"
                    :width="item.width ? item.width : 125"
                >
                    <template #default="{ row, column, $index }">
                        <div>
                            <template v-if="item.prop === 'codes'">
                                <el-tag style="width: auto" type="primary">{{
                                    remarkUrl(row[item.prop])
                                }}</el-tag>
                            </template>
                            <template v-else>
                                {{ row[item.prop] }}
                            </template>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" min-width="180">
                    <template #default="scope">
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
                size="default"
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
            class="dialog"
        >
            <el-form :inline="true" :model="formdate" ref="dataForm">
                <el-row>
                    <el-col>
                        <el-form-item label="用户名" prop="username">
                            <el-input
                                v-model.number="formdate.username"
                                disabled
                                type="text"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <!-- {{ remarkUrl(formdate.url) }} -->
                        <!-- {{ formdate.url }} -->
                        <el-form-item
                            label="角色列表"
                            prop="codes"
                            style="width: auto"
                        >
                            <el-select
                                multiple
                                clearable
                                collapse-tags
                                collapse-tags-tooltip
                                :max-collapse-tags="4"
                                v-model="formdate.codes"
                                placeholder="角色地址列"
                            >
                                <el-option
                                    v-for="option in optionsdata"
                                    :key="option.id"
                                    :label="option.code"
                                    :value="option.id"
                                ></el-option>
                            </el-select>
                            <el-alert type="info" show-icon :closable="false">
                                <p>角色配置选项卡</p></el-alert
                            >
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="justify-content: flex-end">
                    <el-form-item>
                        <el-button type="primary" @click="handleCancel"
                            >取消</el-button
                        >
                        <el-button type="primary" @click="onSubmit"
                            >确定</el-button
                        >
                    </el-form-item>
                </el-row>
            </el-form>
        </el-dialog>
    </div>
</template>

<script setup>
import { getCurrentInstance, onMounted, ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const { proxy } = getCurrentInstance()
const currentPage4 = ref(1)
const pageSize4 = ref(20)
const lists = ref([])
const optionsdata = ref([]) // All options data for URL selection
const tableLabel = reactive([
    {
        prop: 'ID',
        label: 'id'
    },
    {
        prop: 'username',
        label: '用户名',
        width: '300'
    },
    {
        prop: 'codes',
        label: '关联角色列表'
    },
    {
        prop: 'update_time',
        label: '更新时间',
        width: '200'
    }
])
const config = reactive({
    total: 0,
    page: 1, // 当前页
    name: '',
    pageSize: 20
})
const formInline = reactive({ keyword: '' })
const dialogVisible = ref(false)
const formdate = reactive({
    ID: '',
    username: '',
    codes: [], // Ensure this is an array of IDs for the URLs
    description: ''
})
const action = ref('add') // 'add' or 'edit'

// Fetch user data and options data
const getUserData = async (config) => {
    let res = await proxy.$api.userlist(config)
    config.total = res.total

    const roles = res.items.map((role) => {
        const iu = role.Roles.map((op) => ({
            id: op.id,
            code: op.code
        }))
        return { ...role, codes: iu.map((op) => op.id) } // Store only IDs in URL array
    })
    lists.value = roles

    let grole = await proxy.$api.rolelist(config)
    optionsdata.value = grole.items.map((item) => item)
}

// Handle pagination
const changePage = (page) => {
    config.page = page
    getUserData(config)
}
const handleSizeChange = (val) => {
    config.pageSize = val
    getUserData(config)
}

// Search handler
const handleSerch = () => {
    config.name = formInline.keyword
    getUserData(config)
}

// URL formatting function
const remarkUrl = (urlIds) => {
    let str = ''
    optionsdata.value.forEach((option) => {
        if (urlIds.includes(option.id)) {
            str += option.code + '; '
        }
    })
    return str
}

// Dialog control
const handleClose = (done) => {
    ElMessageBox.confirm('确定关闭吗?')
        .then(() => {
            proxy.$refs.dataForm.resetFields()
            done()
        })
        .catch(() => {})
}

// Form submission
const onSubmit = async () => {
    proxy.$refs.dataForm.validate(async (valid) => {
        if (valid) {
            if (action.value === 'add') {
                ElMessage({ message: res.msg, type: 'success' })
            } else {
                let formdateUrl = formdate.codes.map((id) =>
                    typeof id === 'number' ? id : id.id
                )
                formdate.codes = formdateUrl
                let res = await proxy.$api.roleOperate(formdate)
                if (res) {
                    dialogVisible.value = false
                    proxy.$refs.dataForm.resetFields()
                    getUserData(config)
                }
                ElMessage({ message: res.msg, type: 'success' })
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

// Cancel dialog
const handleCancel = () => {
    dialogVisible.value = false
    proxy.$refs.dataForm.resetFields()
}

// Edit handler
const handleEdit = (row) => {
    action.value = 'edit'
    dialogVisible.value = true

    formdate.codes = row.codes.map((op) => op.id) // Ensure URL is an array of IDs
    proxy.$nextTick(() => {
        Object.assign(formdate, row)
    })
}

// Add handler
const handleAdd = () => {
    action.value = 'add'
    dialogVisible.value = true
}

// Delete handler
const handleDelete = (row) => {
    ElMessageBox.confirm('你确定删除吗?')
        .then(async () => {
            let res = await proxy.$api.roleDel({ id: row.id })
            ElMessage({ showClose: true, message: res.msg, type: 'success' })
            getUserData(config)
        })
        .catch(() => {})
}

onMounted(() => {
    getUserData(config)
})
</script>

<style>
/* Your styles remain the same */
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
.dialog {
    height: 35%;
    width: 35%;
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
.el-table td.el-table__cell div span {
    width: 100%;
    display: inline-block;
    word-wrap: break-word;
    white-space: pre-wrap;
    overflow: hidden;
    height: auto;
    line-height: 14px;
}
.keyword {
    width: 200px;
}
</style>
