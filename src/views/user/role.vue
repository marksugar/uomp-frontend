<template>
    <div class="user-header">
        <el-button type="primary" @click="handleAdd">+新增</el-button>
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
                <el-button type="primary" @click="refreshPage"
                    ><el-icon size="23px"><Refresh /></el-icon
                ></el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="container">
        <div class="table">
            <!-- style="width: 100%" height="500px" row-key="id" :tree-props="{ children:
      'Children', hasChildren: 'hasChildren', }" :show-overflow-tooltip="false" -->
            <el-table :data="lists" style="width: 100%" height="500px">
                <el-table-column
                    v-for="item in tableLabel"
                    :key="item.prop"
                    :label="item.label"
                    :prop="item.prop"
                    :width="item.width ? item.width : 125"
                >
                    <template #default="{ row, column, $index }">
                        <div>
                            <template v-if="item.prop === 'url'">
                                <el-tag type="primary">{{
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
                            disabled
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
                    <el-col :span="12">
                        <el-form-item
                            label="角色名称"
                            prop="name"
                            :rules="[
                                { required: true, message: 'name是必选项' }
                            ]"
                        >
                            <el-input
                                v-model="formdate.name"
                                placeholder="请输入name"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item
                            label="角色标识"
                            prop="code"
                            :rules="[
                                { required: true, message: 'code是必选项' }
                            ]"
                        >
                            <el-input
                                v-model="formdate.code"
                                placeholder="请输入code"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item
                            label="描述信息"
                            prop="description"
                            :rules="[
                                { required: true, message: '描述是必填项' }
                            ]"
                        >
                            <el-input
                                v-model="formdate.description"
                                style="width: 240px"
                                autosize
                                type="textarea"
                                placeholder="描述信息"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item label="接口地址" prop="url">
                            <el-select
                                multiple
                                clearable
                                collapse-tags
                                collapse-tags-tooltip
                                multiple-limit
                                :max-collapse-tags="4"
                                v-model="formdate.url"
                                placeholder="接口地址列"
                            >
                                <el-option
                                    v-for="option in optionsdata"
                                    :key="option.id"
                                    :label="option.url"
                                    :value="option.id"
                                ></el-option>
                            </el-select>
                            <el-alert type="info" show-icon :closable="false">
                                <p>接口地址</p>
                            </el-alert>
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
const currentPage4 = ref(1) // 初始化为1
const pageSize4 = ref(20) // 每页条数
const lists = ref([])
const optionsdata = ref([]) // All options data for URL selection
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
        prop: 'code',
        label: '名称标识'
    },
    {
        prop: 'url',
        label: '接口列表',
        width: '300'
    },
    {
        prop: 'description',
        label: '描述信息'
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
    pageSize: 20, // 每页条数
    name: ''
})
const configApi = reactive({
    total: 0,
    page: 1, // 当前页
    pageSize: 10000, // 每页条数
    name: ''
})
const formInline = reactive({ keyword: '' })
const dialogVisible = ref(false)
const formdate = reactive({
    code: '',
    name: '',
    url: [], // Ensure this is an array of IDs for the URLs
    description: ''
})
const action = ref('add') // 'add' or 'edit'

// Fetch user data and options data
const getData = async (config) => {
    let res = await proxy.$api.rolelist(config)
    config.total = res.total // 设置总条数
    const roles = res.items.map((role) => {
        const iu = role.Operation.map((op) => ({
            id: op.id,
            url: op.url
        }))
        return { ...role, url: iu.map((op) => op.id) } // Store only IDs in URL array
    })
    lists.value = roles

    let url = await proxy.$api.apilist(configApi)
    optionsdata.value = url.items.map((item) => item)
}

// Handle pagination
const changePage = (page) => {
    config.page = page
    getData(config)
}
const handleSizeChange = (val) => {
    config.pageSize = val
    getData(config)
}

// Search handler
const handleSerch = () => {
    config.name = formInline.keyword
    getData(config)
}

// URL formatting function
const remarkUrl = (urlIds) => {
    let str = ''
    let count = 0

    optionsdata.value.forEach((option) => {
        if (urlIds.includes(option.id)) {
            // str += option.url + "; ";
            if (count < 20) {
                str += option.url + '; '
            }
            count++
        }
    })
    if (count > 20) {
        str += `... 共计: ${count}个`
    }
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
                let res = await proxy.$api.roleAdd(formdate)
                if (res) {
                    dialogVisible.value = false
                    proxy.$refs.dataForm.resetFields()
                    getData(config)
                }
                ElMessage({ message: res.msg, type: 'success' })
            } else {
                let formdateUrl = formdate.url.map((id) =>
                    typeof id === 'number' ? id : id.id
                )
                formdate.url = formdateUrl
                let res = await proxy.$api.roleUpdate(formdate)
                if (res) {
                    dialogVisible.value = false
                    proxy.$refs.dataForm.resetFields()
                    getData(config)
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
    formdate.name = row.name
    formdate.description = row.description
    formdate.url = row.url.map((op) => op.id) // Ensure URL is an array of IDs
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
            getData(config)
        })
        .catch(() => {})
}

onMounted(() => {
    getData(config)
})
function refreshPage() {
    getData(config)
}
</script>

<style>
/* Your styles remain the same */
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
