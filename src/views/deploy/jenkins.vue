<template>
  <div class="user-header">
    <el-form-item>
      选择账号：
      <el-select
        v-model="selectedAccount"
        placeholder="请选择Jenkins账号"
        style="width: 200px"
        @change="triggerAccountSelect"
      >
        <el-option
          v-for="item in dataSelect"
          :key="item.name"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-button class="syncaccount" type="primary" @click="triggerSyncAccount"
        >Sync</el-button
      >
    </el-form-item>

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
  <div class="table">
    <el-table :data="lists" style="width: 100%" height="500px">
      <el-table-column
        v-for="item in tableLabel"
        :show-overflow-tooltip="false"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        :width="item.width ? item.width : 125"
      >
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="180">
        <template #default="scope">
          <el-button size="small" @click="showDialog(scope.row)">
            <img
              style="height: 24px; width: 24px"
              src="../../assets/image/log2.png"
              alt=""
            />
          </el-button>
          <el-button size="small" @click="handleEdit(scope.row)"
            >构建</el-button
          >
          <!-- <el-button
                        type="danger"
                        size="small"
                        @click="handleDelete(scope.row)"
                        >删除</el-button
                    > -->
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
  <el-dialog v-model="dialogVisible" title="配置参数" width="550px">
    <el-form :model="selectedJob">
      <el-form-item
        v-for="(param, index) in dynamicForm"
        :key="index"
        :label="param.name"
      >
        <el-select
          v-if="param.inputType === 'select'"
          v-model="param.defaultParameterValue.value"
          placeholder="请选择"
        >
          <el-option
            v-for="(option, i) in param.choices"
            :key="i"
            :label="option"
            :value="option"
          />
        </el-select>
        <el-input
          v-else
          v-model="param.defaultParameterValue.value"
          :placeholder="`请输入 ${param.name}`"
        />
        <p>{{ param.description }}</p>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitForm">确定</el-button>
    </div>
  </el-dialog>
  <el-dialog v-model="wsDialogVisible" title="ConsoleLog" width="800px">
    <div v-if="wsData">
      <pre
        style="
          max-height: 400px;
          overflow-y: auto;
          word-wrap: break-word;
          white-space: pre-wrap;
          padding: 10px;
          background-color: #f9f9f9;
          border-radius: 5px;
        "
        >{{ wsData }}</pre
      >
    </div>
    <div v-else>
      <p>等待ConsoleOutput数据...</p>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="wsDialogVisible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script setup>
import { getCurrentInstance, onMounted, ref, reactive } from "vue";
import { ElMessage, ElNotification } from "element-plus";
import Cookie from "js-cookie";
const { proxy } = getCurrentInstance();
const currentPage4 = ref(1);
const pageSize4 = ref(20);
const lists = ref([]);
const size = "default";
const tableLabel = reactive([
  { prop: "UUID", label: "ID", width: "280px" },
  { prop: "belong", label: "属于", width: "140px" },
  { prop: "ip_addr", label: "URL", width: "280px" },
  { prop: "job_name", label: "项目名称", width: "180px" },
  { prop: "update_time", label: "同步时间", width: "160px" },
]);
onMounted(() => {
  getselect().then(() => {
    if (dataSelect.value.length > 0) {
      // 如果 dataSelect 不为空，则将第一个元素的 ID 设为默认选项
      selectedAccount.value = dataSelect.value[0].id;
      // 触发选中事件
      triggerAccountSelect();
    }
  });
});

// select user
// 处理选项框的
const selectedAccount = ref(null);
const triggerAccountSelect = async () => {
  // console.log('triggerAccountSelect:', dataSelect.value)
  if (selectedAccount.value) {
    config.id = selectedAccount.value;
    const res = await proxy.$api.jenkinstable(config);
    lists.value = (res.items || []).map((item) => {
      return item;
    });
    config.total = res.total;
    // console.log('lists', lists.value)
  } else {
    alert("请先选择一个账号");
  }
  // dialogVisible.value = true
};

//showdialog
const showDialog = (row) => {
  wsDialogVisible.value = true;
  buildconsole(row);
};
const buildconsole = async (row) => {
  formdata.belong = row.belong;
  formdata.job_name = row.job_name;
  formdata.params = {};
  wsData.value = "";
  let res = await proxy.$api.triggerjenkinsbuildconsole(formdata);
  // console.log('triggerjenkinsbuildconsole:', res)
  if (res == null) {
    ElNotification({
      title: "error",
      message: error,
      type: "error",
      position: "top-left",
    });
  }
  wsData.value = res;
};

// dialog
const dataSelect = ref([]);
const selectedJob = ref(null);
const dynamicForm = ref([]);
const dialogVisible = ref(false);

// const config = {}; // Assuming you have some default config
const handleEdit = (row) => {
  selectedJob.value = row; // 存储当前选择的任务
  dialogVisible.value = true; // 显示对话框
  setupDynamicForm(row); // 配置动态表单
};

const setupDynamicForm = (row) => {
  formdata.belong = row.belong;
  formdata.job_name = row.job_name;
  dynamicForm.value = row.parameter.parameterDefinitions.map((param) => {
    return {
      ...param,
      inputType:
        param.type === "ChoiceParameterDefinition" ? "select" : "input",
    };
  });
  // console.log('dynamicForm', dynamicForm.value)
};

const formdata = reactive({
  job_name: "",
  params: "",
  belong: "",
});
const mapData = ref({});
const wsData = ref(null);
const wsDialogVisible = ref(false);

const submitForm = async () => {
  // console.log('构建参数:', dynamicForm.value)
  mapData.value = dynamicForm.value.reduce((acc, item) => {
    acc[item.defaultParameterValue.name] = item.defaultParameterValue.value;

    return acc;
  }, {});
  formdata.params = mapData.value;
  try {
    let res = await proxy.$api.triggerjenkinsbuild(formdata);
    // console.log('triggerjenkinsbuild:', res)
    ElNotification({
      title: "Success",
      message: res.msg,
      type: "success",
      position: "top-left",
    });
    // WebSocket 连接
    // wsDialogVisible.value = true;
    const job_name = formdata.job_name;
    const belong = formdata.belong;
    const params = formdata.params;
    const queueID = res.queueID;
    const loginName = JSON.parse(localStorage.getItem("username"));
    const token = Cookie.get("token");
    // req.headers.Authorization = `Bearer ${token}`

    wsData.value = "";
    wsDialogVisible.value = true;
    const ws = new WebSocket(
      `ws://127.0.0.1:1570/system/jenkins/triggerbuild/ws?token=${token}&username=${loginName}&job_name=${job_name}&belong=${belong}&params=${params}&queueID=${queueID}`
    );
    // console.log('Sending data:', ws)
    ws.onopen = () => {
      // const message = JSON.stringify(buildParams);
      // // 通过 WebSocket 发送 JSON 字符串
      // ws.value.send(message);
      console.log("WebSocket connection opened");
    };
    ws.onmessage = (event) => {
      wsData.value += event.data;
      dialogVisible.value = false;
    };
  } catch (error) {
    // console.error('Error:', error)
    ElNotification({
      title: "error",
      message: error,
      type: "error",
      position: "top-left",
    });
  }
};

// 处理select选项框数据的处理
// const dataSelect = ref([]);
const getselect = async () => {
  let res = await proxy.$api.showjenkins();
  dataSelect.value = (res || []).map((item) => {
    return item;
  });

  if (dataSelect.value.length > 0 && !selectedAccount.value) {
    // selectedAccount.value = dataSelect.value[0].id
    selectedAccount.value = dataSelect.value;
    // console.log('0000:', selectedAccount.value)
    // await proxy.$api.postToInterfaceB(selectedAccount.value)
  }
};

// triggerB sync
// 处理点击同步的按钮
const triggerSyncAccount = async () => {
  if (selectedAccount.value) {
    // console.log('1123:', selectedAccount.value)
    await proxy.$api.syncjenkins({ id: selectedAccount.value });
  } else {
    alert("请先选择一个账号");
  }
};

// 分页页面
const config = reactive({
  total: 0,
  page: 1, // 当前页
  name: "",
  pageSize: 20,
  id: null,
});
const changePage = (page) => {
  config.page = page;
  triggerAccountSelect(config);
};
const handleSizeChange = (val) => {
  config.pageSize = val;
  triggerAccountSelect(config);
};
const formInline = reactive({
  keyword: "",
});
// 搜索
const handleSerch = () => {
  config.name = formInline.keyword;
  triggerAccountSelect(config);
};

//refresh
function refreshPage() {
  triggerAccountSelect(config);
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
  width: 50%; /* 设定 dialog 的宽度，可以根据需要调整 */
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
  width: 350px;
}
.syncaccount {
  margin-left: 8px;
}
.keyword {
  width: 200px;
}
</style>
