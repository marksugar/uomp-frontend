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
            </el-form-item>
        </el-form>
    </div>
    <div class="table">
        <!-- <div class="table"> -->
        <!-- :show-overflow-tooltip="true"
          
          row-key="id"
          :tree-props="{
            children: 'Children',
            hasChildren: 'hasChildren',
          }" -->
        <el-table :data="lists" style="width: 100%" height="500px">
            <el-table-column
                v-for="item in tableLabel"
                :key="item.prop"
                :label="item.label"
                :prop="item.prop"
            >
                <!-- :width="item.width ? item.width : 125" -->
                <template #default="{ row, column, $index }">
                    <div>
                        <template v-if="item.prop === 'url'">
                            <el-tag type="primary" style="width: auto">{{
                                row[item.prop]
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
                        disabled
                        size="small"
                        @click="handleDelete(scope.row)"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
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
        <el-form :inline="true" :model="formdate" ref="dataForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="名称"
                        prop="name"
                        :rules="[{ required: true, message: 'name是必选项' }]"
                    >
                        <el-input
                            v-model.number="formdate.name"
                            :disabled="isApiKeyAndSecretDisabled"
                            placeholder="请输入name"
                            type="name"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                        label="method"
                        prop="method"
                        :rules="[{ required: true, message: 'method是必填项' }]"
                    >
                        <el-select
                            :disabled="isApiKeyAndSecretDisabled"
                            v-model="formdate.method"
                            placeholder="选择method"
                            style="width: 200px"
                        >
                            <el-option
                                v-for="item in MethodOP"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item
                        label="URL"
                        prop="url"
                        :rules="[{ required: true, message: 'url是必填项' }]"
                    >
                        <el-input
                            v-model="formdate.url"
                            placeholder="请输入url"
                            :disabled="isApiKeyAndSecretDisabled"
                        />
                        <el-alert type="info" show-icon :closable="false">
                            <p>接口地址</p></el-alert
                        >
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-form-item
                    label="类型"
                    prop="type"
                    :rules="[{ required: true, message: '类型是必选项' }]"
                >
                    <el-select
                        v-model="formdate.type"
                        placeholder="请选择"
                        style="width: 200px"
                    >
                        <el-option label="API 接口" :value="1" />
                        <el-option label="父页面" :value="3" />
                        <el-option label="静态页面" :value="0" />
                    </el-select>
                </el-form-item>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item
                        label="描述信息"
                        prop="url"
                        :rules="[{ required: true, message: 'url是必填项' }]"
                    >
                        <el-input
                            v-model="formdate.description"
                            style="width: 240px"
                            :disabled="isApiKeyAndSecretDisabled"
                            autosize
                            type="textarea"
                            placeholder="描述信息"
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
    <!-- </div> -->
</template>

<script setup>
import { getCurrentInstance, onMounted, ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const { proxy } = getCurrentInstance()
const currentPage = ref(1)
const pageSize = ref(20)
const lists = ref([])
const size = 'default'
const list = ref([])
const tableLabel = reactive([
    {
        prop: 'id',
        label: 'id'
    },
    {
        prop: 'method',
        label: 'method'
    },
    {
        prop: 'name',
        label: '名称'
    },
    {
        prop: 'url',
        label: '接口路径',
        width: '200'
    },
    {
        prop: 'typeLabel',
        label: '类型'
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
onMounted(() => {
    getUserData(config)
})

const getUserData = async (config) => {
    let res = await proxy.$api.apilist(config)
    config.total = res.total

    lists.value = res.items.map((item) => {
        item.typeLabel = item.type === 1 ? '接口地址' : '菜单地址'
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
    getUserData(config)
}
const handleSizeChange = (val) => {
    config.pageSize = val
    getUserData(config)
    console.log(`${val} items per page`)
}
const formInline = reactive({
    keyword: ''
})
const handleSerch = () => {
    config.name = formInline.keyword
    getUserData(config)
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
    method: '', // 添加用户的 用户名
    name: '',
    url: '',
    type: '',
    description: ''
})
const MethodOP = [
    { value: 'GET', label: 'GET' },
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'DELETE', label: 'DELETE' }
]
// 添加用户
const onSubmit = () => {
    proxy.$refs.dataForm.validate(async (valid) => {
        if (valid) {
            // const formdates = { ...formdate }
            if (action.value == 'add') {
                let res = await proxy.$api.apiAdd(formdate)
                console.log('result:', res)
                if (res) {
                    dialogVisible.value = false
                    proxy.$refs.dataForm.resetFields()
                    getUserData(config)
                }
                ElMessage({
                    message: res.msg,
                    grouping: true,
                    type: 'success'
                })
            } else {
                // 编辑的接口
                let res = await proxy.$api.apiUpdate(formdate)
                if (res) {
                    dialogVisible.value = false
                    proxy.$refs.dataForm.resetFields()
                    getUserData(config)
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
    // row.sex == 1 ? (row.sex = '男') : (row.sex = '女')
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
            let res = await proxy.$api.apiDel({
                id: row.id
            })
            ElMessage({
                showClose: true,
                message: res.msg,
                type: 'success'
            })
            getUserData(config)
        })
        .catch(() => {
            // catch error
        })
}
const isApiKeyAndSecretDisabled = computed(() => {
    return formdate.type === 3 || formdate.type === 0
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
