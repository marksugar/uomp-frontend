<template>
  <div class="login-page">
    <div class="container">
      <el-card class="login-card" shadow="always">
        <img src="../assets/image/1.png" alt="Logo1" class="logo" />
        <h2 style="text-align: center">通用运维管理平台</h2>
        <el-form
          :model="loginForm"
          ref="loginFormRef"
          label-width="0"
          :rules="rules"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="Enter your username"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="Enter your password"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLogin">Login</el-button>
          </el-form-item>
        </el-form>
        <div style="font-size: 13px; text-align: center">
          @2024 All Rights Reserved. Privacy and Terms
        </div>
        <div style="font-size: 13px; text-align: center; padding: 2px">
          Universal OPS Management Platform
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, reactive, ref, onMounted } from "vue";
import { ElMessageBox } from "element-plus";
const loginForm = reactive({
  username: "",
  password: "",
});

const rules = {
  username: [
    {
      required: true,
      message: "Please enter your username",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "Please enter your password",
      trigger: "blur",
    },
  ],
};
const loginFormRef = ref(null);

const { proxy } = getCurrentInstance();
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useStore();
const handleLogin = async () => {
  const res2 = await loginFormRef.value.validate((valid) => {
    if (valid) {
      return true;
    } else {
      ElMessageBox.confirm("Please fill in the form correctly?", "Warning", {
        confirmButtonText: "OK",
        type: "warning",
        center: true,
      });
      return false;
    }
  });
  if (await res2) {
    const res = await proxy.$api.login(loginForm);
    console.log("username:", res);
    store.commit("setUsername", res.username);
    store.commit("setUserid", res.user_id);
    console.log("res setMenu:", res);
    store.commit("setMenu", res.menu);
    console.log("res addMenu:", router);
    store.commit("addMenu", router);
    console.log("res setToken:", res.token);
    store.commit("setToken", res.token);
    router.push({
      name: "home",
    });
  }
  // const res = (await res2) && (await proxy.$api.login(loginForm))
  // console.log('res menu:', res)
  // store.commit('setMenu', res.menu)
  // store.commit('addMenu', router)
  // console.log('res token:', res.token)
  // store.commit('setToken', res.token)
  // router.push({
  //     name: 'home'
  // })
};
onMounted(() => {
  // 确保在组件挂载后表单引用可用
  if (!loginFormRef.value) {
    console.error("组件挂载时表单引用不可用");
  }
});
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.el-card {
  --el-card-border-color: var(--el-card-border-color);
}
.el-card.is-always-shadow {
  box-shadow: none;
}
.login-card {
  width: 400px;
  height: 100%;
  padding: 2px;
  border-radius: 10px;
  /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); */
  background-color: #f0f2f5;
  /* margin-top: -260px; */
}

.logo {
  display: block;
  margin: 0 auto 20px;
  max-width: 150px;
}

h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-input {
  border-radius: 4px;
}

.el-button {
  width: 100%;
}

.footer {
  margin-top: 20px;
  font-size: 14px;
  color: #888;
  text-align: center;
}
</style>
