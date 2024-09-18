<template>
  <div class="common-layout">
    <el-container>
      <CommonAside />
      <el-container>
        <CommonHeader />
        <CommonTab />
        <el-main>
          <RouterView />
        </el-main>
        <el-footer> <CommonFooter /></el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import CommonHeader from "../components/CommonHeader.vue";
import CommonAside from "../components/CommonAside.vue";
import CommonFooter from "../components/CommonFooter.vue";
import CommonTab from "../components/CommonTab.vue";
</script>
<style lang="less" scoped>
.r-container {
  flex-wrap: wrap;
  align-items: flex-start;
  height: 100%;
}
.common-layout {
  .lay-container {
    flex-wrap: nowrap;
    .right-main {
      height: calc(100% - 124px) !important;
    }
  }
  height: 100%;
  & > .el-container {
    height: 100%;
    & > .el-aside {
      height: 100%;
      //   background: #2a3f54;
      // background: #2a3f54;
      background: #425668;
    }
  }
}
</style>
