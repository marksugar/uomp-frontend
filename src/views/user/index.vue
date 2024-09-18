<template>
    <div class="user-header">
        <el-button type="primary" @click="handleAdd">+新增</el-button>
        <el-form :inline="true" :model="formInline">
            <el-form-item label="请输入">
                <el-input
                    v-model="formInline.keyword"
                    placeholder="请输入用户名"
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
        <el-table :data="list" style="width: 100%" height="500px">
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
                    <el-button size="small" @click="handleEdel(scope.row)"
                        >修改密码</el-button
                    >
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
        :title="action == 'add' ? '新增用户' : '编辑用户'"
        style="width: 650px; height: auto"
        :before-close="handleClose"
    >
        <el-form :inline="true" :model="formdate" ref="userForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="用户名"
                        prop="username"
                        :rules="[{ required: true, message: '用户名是必填项' }]"
                    >
                        <el-input
                            v-model="formdate.username"
                            placeholder="请输入用户名"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="action === 'add'">
                    <el-form-item
                        label="密码"
                        prop="password"
                        :rules="[{ required: true, message: '密码是必填项' }]"
                    >
                        <el-input
                            v-model="formdate.password"
                            placeholder="请输入密码"
                            type="password"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item
                        label="性别"
                        prop="gender"
                        :rules="[{ required: true, message: '性别是必选项' }]"
                    >
                        <el-select
                            v-model="formdate.gender"
                            placeholder="请选择"
                            style="width: 100px"
                        >
                            <el-option label="男" :value="0" />
                            <el-option label="女" :value="1" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="邮箱" prop="email" :rules="rules">
                        <el-input
                            v-model="formdate.email"
                            placeholder="请输入邮箱地址"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="地址" prop="address">
                        <el-cascader
                            v-model="formdate.address"
                            :options="regionOptions"
                            placeholder="请选择地区"
                            :props="{ checkStrictly: true }"
                            style="width: 250px"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="手机号" prop="phone" :rules="rules">
                        <el-input
                            v-model="formdate.phone"
                            placeholder="请输入手机号地址"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="备注" prop="mark">
                        <el-input
                            v-model="formdate.mark"
                            placeholder="请输入备注"
                            type="textarea"
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
    <el-dialog
        v-model="dialogVisibleDel"
        :title="action == 'repasswd' ? '修改密码' : '编辑'"
        :before-close="handleCloseRepasswd"
        style="width: 450px; height: auto"
    >
        <el-form :inline="true" :model="formdateRepasswd" ref="dataForm">
            <el-row>
                <el-form-item
                    label="旧密码"
                    prop="old_password"
                    :rules="[
                        {
                            required: true,
                            message: '旧密码是必选项',
                            trigger: 'blur'
                        }
                    ]"
                >
                    <el-input
                        style="width: 340px"
                        :autosize="{ minRows: 5, maxRows: 14 }"
                        v-model.number="formdateRepasswd.old_password"
                        placeholder="请输入旧密码"
                        type="password"
                    />
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item
                    label="新密码"
                    prop="new_password"
                    :rules="[
                        {
                            required: true,
                            message: '新密码是必选项',
                            trigger: 'blur'
                        }
                    ]"
                >
                    <el-input
                        style="width: 340px"
                        :autosize="{ minRows: 5, maxRows: 14 }"
                        v-model.number="formdateRepasswd.new_password"
                        placeholder="请输入新密码"
                        type="password"
                    />
                </el-form-item>
            </el-row>
            <el-row style="justify-content: flex-end; margin-top: 20px">
                <el-form-item>
                    <el-button type="primary" @click="dialogVisibleDel = false"
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
import { ElMessage, ElMessageBox } from 'element-plus'
const { proxy } = getCurrentInstance()
const value = ref(false)
const currentPage4 = ref(4)
const pageSize4 = ref(20)
const list = ref([])
const tableLabel = reactive([
    {
        prop: 'ID',
        label: 'ID'
    },
    {
        prop: 'username',
        label: '用户名'
    },
    {
        prop: 'email',
        label: '邮箱'
    },
    {
        prop: 'genderLabel',
        label: '性别'
    },
    {
        prop: 'create_time',
        label: '创建时间',
        width: '200'
    },
    {
        prop: 'update_time',
        label: '上次修改时间',
        width: '200'
    }
])
onMounted(() => {
    getUserData(config)
})

const getUserData = async (config) => {
    let res = await proxy.$api.userlist(config)
    config.total = res.total
    list.value = res.items.map((item) => {
        item.genderLabel = item.gender === 0 ? '女' : '男'
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
            proxy.$refs.userForm.resetFields()
            done()
        })
        .catch(() => {
            // catch error
        })
}

// 添加用户的form数据
const formdate = reactive({
    username: '', // 添加用户的 用户名
    password: '',
    email: '',
    gender: '',
    address: ref([]),
    phone: '',
    mark: ''
})
const timeFormat = (time) => {
    var time = new Date(time)
    var year = time.getFullYear()
    var month = time.getMonth() + 1
    var date = time.getDate()
    function add(m) {
        return m < 10 ? '0' + m : m
    }
    return year + '-' + add(month) + '-' + add(date)
}
const timeFormatT = (time) => {
    const date = new Date(time)
    const yy = String(date.getFullYear()) // 获取年份的最后两位
    const mm = String(date.getMonth() + 1).padStart(2, '0') // 获取月份并补零
    const dd = String(date.getDate()).padStart(2, '0') // 获取日期并补零
    const hh = String(date.getHours()).padStart(2, '0') // 获取小时并补零
    const min = String(date.getMinutes()).padStart(2, '0') // 获取分钟并补零
    return `${yy}-${mm}-${dd} ${hh}:${min}`
}
// 添加用户
const onSubmit = () => {
    proxy.$refs.userForm.validate(async (valid) => {
        if (valid) {
            const formdates = { ...formdate }
            if (action.value == 'add') {
                formdates.password = formdates.password.toString()
                let res = await proxy.$api.userAdd(formdates)
                if (res) {
                    dialogVisible.value = false
                    proxy.$refs.userForm.resetFields()
                    getUserData(config)
                }
                ElMessage({
                    message: res.msg,
                    grouping: true,
                    type: 'success'
                })
            } else {
                // 编辑的接口
                delete formdates.password // 编辑模式下不发送密码字段
                formdate.sex == '男' ? (formdate.sex = 1) : (formdate.sex = 0)
                let res = await proxy.$api.userUpdate(formdate)
                if (res) {
                    dialogVisible.value = false
                    proxy.$refs.userForm.resetFields()
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
    proxy.$refs.userForm.resetFields()
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
// 修改密码
const handleCloseRepasswd = (done) => {
    ElMessageBox.confirm('确定关闭吗?')
        .then(() => {
            proxy.$refs.dataForm.resetFields()
            done()
        })
        .catch(() => {
            // catch error
        })
}
const dialogVisibleDel = ref(false)
const handleEdel = (row) => {
    action.value = 'repasswd'
    dialogVisibleDel.value = true
    proxy.$nextTick(() => {
        Object.assign(formdateRepasswd, row)
    })
}
const formdateRepasswd = reactive({
    user_id: '',
    old_password: '',
    new_password: ''
})
const submitDomains = async (row) => {
    const formRef = proxy.$refs.dataForm
    formRef.validate(async (valid) => {
        if (valid) {
            if (action.value == 'repasswd') {
                try {
                    const res = await proxy.$api.repassword({
                        user_id: formdateRepasswd.user_id,
                        old_password: formdateRepasswd.old_password.toString(),
                        new_password: formdateRepasswd.new_password.toString()
                    })

                    if (res) {
                        // formRef.resetFields();
                        ElMessage({
                            message: res.msg,
                            type: 'success',
                            duration: 2000
                        })
                        dialogVisibleDel.value = false
                        getUserData(config) // Ensure `config` and `getData` are defined in your component
                    }
                } catch (error) {
                    console.log('er:', error)
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
// 新增用户
const handleAdd = () => {
    action.value = 'add'
    dialogVisible.value = true
}
// 删除用户
const handleDelete = (row) => {
    ElMessageBox.confirm('你确定删除吗?')
        .then(async () => {
            let res = await proxy.$api.userDel({
                ID: row.ID
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

import provinces from 'china-division/dist/provinces.json'
import cities from 'china-division/dist/cities.json'
import areas from 'china-division/dist/areas.json'
const selectedRegion = ref([])
// 地区
const regionOptions = provinces.map((province) => {
    const provinceCities = cities.filter(
        (city) => city.provinceCode === province.code
    )
    return {
        value: province.code,
        label: province.name,
        children: provinceCities.map((city) => {
            const cityAreas = areas.filter(
                (area) => area.cityCode === city.code
            )
            return {
                value: city.code,
                label: city.name,
                children: cityAreas.map((area) => ({
                    value: area.code,
                    label: area.name
                }))
            }
        })
    }
})
// 手机号验证规则（中国大陆手机号）
const validatePhone = (rule, value, callback) => {
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!value) {
        return callback(new Error('手机号不能为空'))
    }
    if (!phoneRegex.test(value)) {
        return callback(new Error('请输入正确的手机号'))
    }
    callback()
}

// 邮箱验证规则
const validateEmail = (rule, value, callback) => {
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    if (!value) {
        return callback(new Error('邮箱不能为空'))
    }
    if (!emailRegex.test(value)) {
        return callback(new Error('请输入正确的邮箱地址'))
    }
    callback()
}
const rules = ref({
    phone: [{ validator: validatePhone, trigger: 'blur' }],
    email: [{ validator: validateEmail, trigger: 'blur' }]
})
</script>

<style lang="less" scoped>
.table {
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
