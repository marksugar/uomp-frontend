<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">Login</h2>
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginFormRef"
        label-width="80px"
      >
        <el-form-item label="Username" prop="username">
          <el-input
            type="input"
            v-model="loginForm.username"
            placeholder="Enter your username"
          ></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            placeholder="Enter your password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">Login</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { getCurrentInstance, reactive, ref, onMounted } from "vue";

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
import { ElMessageBox } from "element-plus";
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
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* background-color: #8fafc9; */
  /* background: linear-gradient(rgb(217, 217, 221), rgb(161, 208, 230)); */
  /* background: linear-gradient(to right, transparent, mistyrose),
     */

  background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 1)
    ),
    url("../assets/image/R.jpg");
}
.login-card {
  width: 400px;
  padding: 20px;
}
.login-title {
  text-align: center;
  margin-bottom: 20px;
}
</style>
