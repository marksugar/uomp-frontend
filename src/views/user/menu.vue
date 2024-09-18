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
    <div class="container">
        <div class="sidebar">
            <el-tree
                style="height: 100%; width: 150px"
                :data="treeData"
                :props="defaultProps"
                @node-click="handleNodeClick"
            />
        </div>
        <div class="table">
            <el-table
                :data="treeData"
                style="width: 100%"
                height="500px"
                row-key="id"
                :tree-props="{
                    children: 'Children',
                    hasChildren: 'hasChildren'
                }"
            >
                <el-table-column
                    :show-overflow-tooltip="true"
                    v-for="item in tableLabel"
                    :key="item.prop"
                    :label="item.label"
                    :prop="item.prop"
                    :width="item.width ? item.width : 125"
                />
                <el-table-column fixed="right" label="操作" min-width="180">
                    <template #default="scope">
                        <el-button size="small" @click="handleEdit(scope.row)"
                            >编辑</el-button
                        >
                        <el-button
                            type="danger"
                            size="small"
                            @click="handleDelete(scope.row)"
                            disabled
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
        >
            <el-form :inline="true" :model="formdate" ref="dataForm">
                <el-row>
                    <el-col :span="12">
                        <el-form-item
                            label="method"
                            prop="method"
                            :rules="[
                                { required: true, message: 'method是必填项' }
                            ]"
                        >
                            <!-- <el-input
                                v-model="formdate.method"
                                placeholder="请输入method"
                            /> -->

                            <el-select
                                v-model="formdate.method"
                                placeholder="选择method"
                                style="width: 240px"
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
                    <el-col :span="12">
                        <el-form-item
                            label="路径"
                            prop="path"
                            :rules="[
                                { required: true, message: 'path是必填项' }
                            ]"
                        >
                            <el-input
                                v-model.number="formdate.path"
                                placeholder="请输入path"
                                type="path"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item
                            label="名称"
                            prop="name"
                            :rules="[
                                { required: true, message: 'name是必选项' }
                            ]"
                        >
                            <el-input
                                v-model.number="formdate.name"
                                placeholder="请输入name"
                                type="name"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item
                            label="标签"
                            prop="label"
                            :rules="[
                                { required: true, message: 'label是必填项' }
                            ]"
                        >
                            <el-input
                                v-model="formdate.label"
                                placeholder="请输入label"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item
                            label="类型"
                            prop="type"
                            :rules="[
                                { required: true, message: '类型是必选项' }
                            ]"
                        >
                            <el-select
                                v-model="formdate.type"
                                placeholder="请选择"
                                style="width: 200px"
                            >
                                <el-option label="主页面" :value="3" />
                                <el-option label="次级页面" :value="0" />
                                <el-option label="API接口" :value="1" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item
                            label="图标"
                            prop="icon"
                            :rules="[
                                { required: true, message: 'icon是必选项' }
                            ]"
                        >
                            <el-select
                                v-model="formdate.icon"
                                placeholder="请选择图标"
                            >
                                <el-option
                                    v-for="icon in icons"
                                    :key="icon"
                                    :label="icon"
                                    :value="icon"
                                >
                                    <el-icon :name="icon">
                                        <component :is="icon"></component>
                                    </el-icon>
                                    {{ icon }}
                                </el-option>
                            </el-select>
                            <el-alert type="info" show-icon :closable="false">
                                <p>
                                    使用element-plus插件,
                                    <a
                                        href="https://element-plus.org/zh-CN/component/icon.html#icon-collection"
                                        >前往element-plus icon选择图标</a
                                    >
                                    <br />
                                </p>
                            </el-alert>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item
                            label="URL"
                            prop="url"
                            :rules="[
                                { required: true, message: 'url是必填项' }
                            ]"
                        >
                            <el-input
                                v-model="formdate.url"
                                placeholder="请输入url"
                            />
                            <el-alert type="info" show-icon :closable="false">
                                <p>url对应views下的文件</p></el-alert
                            >
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item label="父路径" prop="url">
                            <el-select
                                v-model="formdate.ParentID"
                                placeholder="选择父菜单"
                                style="width: 240px"
                            >
                                <el-option
                                    v-for="item in list"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                            <el-alert type="info" show-icon :closable="false">
                                <p>父路径为空则为一级菜单</p></el-alert
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
import {
    getCurrentInstance,
    onMounted,
    ref,
    reactive,
    defineComponent
} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as ElIcons from '@element-plus/icons-vue'

const { proxy } = getCurrentInstance()
const currentPage4 = ref(4)
const pageSize4 = ref(20)
const lists = ref([])
const list = ref([])
const menu = ref([])
const treeData = ref([])
const defaultProps = {
    children: 'Children',
    label: 'label'
}

const icons = Object.keys(ElIcons)

const findById = (node, id) => {
    // 如果当前节点的 id 匹配，返回该节点
    if (node.id === id) {
        return { ...node, Children: [] } // 返回匹配节点，并清空 Children
    }

    // 如果当前节点有子节点，递归查找子节点
    if (node.Children) {
        for (const child of node.Children) {
            const result = findById(child, id)
            if (result) {
                return result
            }
        }
    }

    // 如果没有找到匹配的节点，返回 null
    return null
}
const buildTree = (menu) => {
    // console.log('buildTree:', menu)
    const idMapping = menu.reduce((acc, el, i) => {
        acc[el.id] = i
        return acc
    }, {})
    let root = []
    menu.forEach((el) => {
        if (el.ParentID === null) {
            root.push(el)
            // console.log('el root:', el)
        } else {
            // console.log('el ParentID:', menu[idMapping[el.ParentID]])
            const parentEl = menu[idMapping[el.ParentID]]
            if (parentEl) {
                // console.log('el parentEl:', parentEl)
                parentEl.Children = [...(parentEl.Children || []), el]
                // parentEl.Children.push(el)
            }
        }
    })
    return root
}

const handleNodeClick = (data) => {
    console.log('Node clicked:', data)
}
const handleSelectChange = (value) => {
    console.log('Selected:', value)
    // 在这里处理选中项的逻辑
}
const tableLabel = reactive([
    {
        prop: 'label',
        label: '标签'
    },
    {
        prop: 'method',
        label: 'method'
    },
    {
        prop: 'path',
        label: '路径'
    },
    {
        prop: 'name',
        label: '名称'
    },
    {
        prop: 'icon',
        label: '菜单图标'
    },
    {
        prop: 'url',
        label: '菜单路径'
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
    let res = await proxy.$api.menulist(config)
    config.total = res.total
    treeData.value = buildTree(res.items)

    // select op
    let pp = res.items.filter((item) => item.ParentID == null)
    list.value = Array.from(pp.values()).map((item) => ({
        value: item.id,
        label: item.label
    }))
    // treeData.value = res.items.map((item) => {
    //     item.type = getTypeDescription(config.type)
    //     return item
    // })
}
// 分页页面
const config = reactive({
    total: 0,
    page: 1, // 当前页
    name: '',
    pageSize: 20
})
const changePage = (page) => {
    // console.log(page);
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
    path: '',
    name: '',
    label: '',
    icon: '',
    url: '',
    type: '',
    label: '',
    ParentID: null
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
                let res = await proxy.$api.menuAdd(formdate)
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
                let res = await proxy.$api.menuUpdate(formdate)
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
    row.sex == 1 ? (row.sex = '男') : (row.sex = '女')
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
            let res = await proxy.$api.menuDel({
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
    width: 90%;
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
.keyword {
    width: 200px;
}
</style>
