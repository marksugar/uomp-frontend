<template>
    <el-header>
        <div class="l-content">
            <el-button size="small" plain @click="handeleCollapse">
                <el-icon size="20"> <Menu /></el-icon>
            </el-button>
            <!-- <el-breadcrumb :separator-icon="ArrowRight" class="bread"> -->
            <el-breadcrumb separator=">" class="bread">
                <el-breadcrumb-item :to="{ path: '/' }"
                    >Home</el-breadcrumb-item
                >
                <el-breadcrumb-item :to="current.path" v-if="current">{{
                    current.label
                }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="r-content">
            <el-dropdown>
                <img class="user" :src="getimg('cat')" />
                <span class="el-dropdown-link"></span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="showDialog"
                            >个人中心</el-dropdown-item
                        >
                        <el-dropdown-item @click="RepasswdDialog"
                            >修改密码</el-dropdown-item
                        >
                        <el-dropdown-item @click="handleLoginOut"
                            >退出</el-dropdown-item
                        >
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <el-dialog
                v-model="dialogVisible"
                title="个人中心"
                style="width: 700px; height: auto"
            >
                <el-descriptions title="" class="margin-top" :column="2" border>
                    <el-descriptions-item label="Username">
                        {{ formdate.username }}
                    </el-descriptions-item>

                    <el-descriptions-item label="Email">
                        {{ formdate.email }}
                    </el-descriptions-item>
                    <el-descriptions-item label="Telephone">
                        {{ formdate.phone }}
                    </el-descriptions-item>
                    <el-descriptions-item label="Address">
                        <el-cascader
                            :options="options"
                            v-model="formdate.address"
                            placeholder="请选择地址"
                        ></el-cascader>
                    </el-descriptions-item>
                    <el-descriptions-item label="Remarks">
                        <el-tag>{{ formdate.mark }}</el-tag>
                    </el-descriptions-item>
                </el-descriptions>
            </el-dialog>

            <el-dialog
                v-model="dialogVisibleRepasswd"
                :title="action == 'repasswd' ? '修改密码' : '编辑'"
                :before-close="handleCloseRepasswd"
                style="width: 400px; height: auto"
            >
                <el-form
                    :inline="true"
                    :model="formdateRepasswd"
                    ref="dataForm"
                >
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
                            style="width: 300px"
                            v-model.number="formdateRepasswd.old_password"
                            placeholder="请输入旧密码"
                            type="password"
                        />
                    </el-form-item>

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
                            style="width: 300px"
                            v-model.number="formdateRepasswd.new_password"
                            placeholder="请输入新密码"
                            type="password"
                        />
                    </el-form-item>

                    <el-row class="form-actions">
                        <el-form-item>
                            <el-button
                                type="primary"
                                @click="dialogVisibleRepasswd = false"
                                >取消</el-button
                            >
                            <el-button type="primary" @click="submitDomains"
                                >确定</el-button
                            >
                        </el-form-item>
                    </el-row>
                </el-form>
            </el-dialog>
        </div>
    </el-header>
</template>
<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getCurrentInstance, onMounted, ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const { proxy } = getCurrentInstance()
const getimg = (res) => {
    return new URL(`../assets/image/${res}.jpg`, import.meta.url).href
}
let store = useStore()
let handeleCollapse = () => {
    // 调用vuex的mutations
    return store.commit('updateIsCollapse')
}

// 面包屑菜单
// 计算属性
import { computed } from 'vue-demi'
const current = computed(() => {
    return store.state.currentMent
})
// quit
const router = useRouter()
const handleLoginOut = () => {
    store.commit('cleanUsername')
    store.commit('cleanUserid')
    store.commit('cleanMenu')
    router.push({
        name: 'login'
    })
}

//
import provinces from 'china-division/dist/provinces.json'
import cities from 'china-division/dist/cities.json'
import areas from 'china-division/dist/areas.json'

const showDialog = () => {
    dialogVisible.value = true
}

const formatOptions = () => {
    const provinceOptions = provinces.map((province) => {
        const provinceChildren = cities
            .filter((city) => city.provinceCode === province.code)
            .map((city) => {
                const cityChildren = areas
                    .filter((area) => area.cityCode === city.code)
                    .map((area) => ({
                        value: area.code,
                        label: area.name
                    }))
                return {
                    value: city.code,
                    label: city.name,
                    children: cityChildren
                }
            })
        return {
            value: province.code,
            label: province.name,
            children: provinceChildren
        }
    })
    return provinceOptions
}
const options = ref(formatOptions())
const dialogVisible = ref(false)

const formdate = reactive({
    username: '', // 添加用户的 用户名
    password: '',
    email: '',
    gender: '',
    address: ref([]),
    phone: '',
    mark: ''
})
const config = reactive({
    total: 0,
    page: 1, // 当前页
    name: '',
    pageSize: 20
})
onMounted(() => {
    getUserData()
})
const getUserData = async () => {
    const user_name = localStorage.getItem('username')
    const user = user_name.replace(/"/g, '')
    let res = await proxy.$api.getnameinfo({
        user: user
    })
    if (res) {
        const users = res.find((item) => item.username === user)
        if (users) {
            formdate.username = users.username
            formdate.email = users.email
            formdate.phone = users.phone
            formdate.address = users.address
            formdate.mark = users.mark
        }
    }
}
// 修改密码
const action = ref('repasswd')
const dialogVisibleRepasswd = ref(false)
const RepasswdDialog = () => {
    if (action.value === 'repasswd') {
        dialogVisibleRepasswd.value = true
    }
}
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
            console.log('valid', valid)
            console.log('row', formdateRepasswd.user_id)
            console.log('action.value', action.value)
            if (action.value == 'repasswd') {
                try {
                    const user_ids = JSON.parse(localStorage.getItem('user_id'))
                    const res = await proxy.$api.repassword({
                        user_id: user_ids,
                        old_password: formdateRepasswd.old_password.toString(),
                        new_password: formdateRepasswd.new_password.toString()
                    })
                    console.log(res)
                    if (res) {
                        formRef.resetFields()
                        ElMessage({
                            message: res.msg,
                            type: 'success',
                            duration: 2000
                        })
                        dialogVisibleRepasswd.value = false
                        // getData(config); // Ensure `config` and `getData` are defined in your component
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
</script>

<style lang="less" scoped>
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background: #ededed;
}
.r-content {
    .user {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }
}
.l-content {
    display: flex;
    align-items: center;

    .el-button {
        margin-right: 20px;
    }
    h3 {
        color: #fff;
    }
}
// .bread /deep/ span {
//     color: #fff !important;
//     cursor: pointer !important;
// }
:deep(.bread span) {
    color: #545c64 !important;
    cursor: pointer !important;
}

.form-actions {
    justify-content: flex-end;
    margin-top: 20px;
}
</style>
