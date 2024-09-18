<template>
    <el-aside :width="$store.state.isCollapse ? '250px' : '80px'">
        <el-menu
            class="custom-menu"
            text-color="#fff"
            background-color="#2A3F54"
            active-text-color="#409eff"
            :collapse="!$store.state.isCollapse"
            :collapse-transition="false"
        >
            <h2 v-show="$store.state.isCollapse" class="header">
                <img
                    src="../assets/image/1.png"
                    class="header-image"
                />通用运维管理平台
            </h2>
            <h2 v-show="!$store.state.isCollapse" class="header">UOMP</h2>
            <el-menu-item
                :index="item.path"
                v-for="item in noChildren()"
                :key="item.path"
                @click="clickMenu(item)"
            >
                <!-- <i class="el-icon-item"></i> -->
                <component class="icons" :is="item.icon"></component>

                <span>{{ item.label }}</span>
            </el-menu-item>

            <el-sub-menu
                :index="item.label"
                v-for="item in hasChildren()"
                :key="item.path"
            >
                <template #title>
                    <!-- <component class="icons" :is="item.icon"></component> -->
                    <template v-if="item.name === 'kubernetes'">
                        <img
                            src="../assets/image/k8s/k8s-2.svg"
                            class="menu-icon-children"
                        />
                    </template>
                    <template v-else>
                        <!-- 否则使用 subitem.icon -->
                        <component
                            v-if="item.icon"
                            class="icons"
                            :is="item.icon"
                        ></component>
                    </template>

                    <span>{{ item.label }}</span>
                </template>

                <el-menu-item-group>
                    <el-menu-item
                        :index="subitem.path"
                        v-for="(subitem, subindex) in item.children || []"
                        :key="subindex"
                        @click="clickMenu(subitem)"
                    >
                        <template v-if="subitem.path === '/jenkins'">
                            <!-- 使用自定义图片作为图标 -->
                            <img
                                src="../assets/image/jenkins.svg"
                                class="menu-icon"
                            />
                        </template>

                        <template v-else-if="subitem.path === '/deployment'">
                            <!-- 使用自定义图片作为图标 -->
                            <img
                                src="../assets/image/k8s/deploy-128.png"
                                class="menu-icon"
                            />
                        </template>
                        <!-- <component class="icons" :is="subitem.icon"></component>
              -->
                        <!-- 如果icon为空就使用src配置，否则使用el-plus的icon -->
                        <template v-else>
                            <!-- 否则使用 subitem.icon -->
                            <component
                                v-if="subitem.icon"
                                class="icons"
                                :is="subitem.icon"
                            ></component>
                        </template>
                        <span>{{ subitem.label }}</span>
                    </el-menu-item>
                </el-menu-item-group>
            </el-sub-menu>
        </el-menu>
    </el-aside>
</template>

<script setup>
const list = []
const noChildren = () => {
    return asyncList.filter((item) => !item.children)
}
const hasChildren = () => {
    return asyncList.filter((item) => item.children)
}

import { useStore } from 'vuex'
const store = useStore()
import { useRouter } from 'vue-router'
const router = useRouter()

const asyncList = store.state.menu
const clickMenu = (item) => {
    router.push({
        name: item.name
    })
    store.commit('selectMenu', item)
}
</script>

<style lang="less" scoped>
.icons {
  width: 18px;
  height: 18px;
  padding: 3px;
}

.el-menu {
  width: 250px;
  background-color: #425668;
  color: #bfcbd9;
  height: 100vh;
  position: fixed;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  text-align: center;
  padding: 0 10px;
  font-size: 18px;
}

.header-image {
  width: 34px;
  height: 34px;
  margin-right: 10px;
  font-size: 26px;
  vertical-align: middle;
}

.custom-menu {
  width: 250px;
  min-height: 600px;
  font-size: 14px;
}

.custom-menu.el-menu--collapse {
  width: 80px;
  min-height: 600px;
  font-size: 14px;
}

.custom-menu .el-menu-item {
  height: 35px;
  line-height: 35px;
  // padding-left: 15px;
  display: flex;
  align-items: center;
  justify-content: flex-start; // 确保内容靠左对齐
}

.custom-menu .el-menu-item.is-active,
// .custom-menu .el-submenu__title {
//   height: 35px;
//   line-height: 35px;
// }
.custom-menu .el-submenu__title.is-active {
  background-color: rgb(147, 163, 182);
  color: #fff;
}

.custom-menu .el-menu-item .icons {
  margin-right: 1px; // 图标与文字之间的间距
}
// .el-icon-item {
//   margin-right: 5px; // 让图标与文字之间有一定间距
// }
.custom-menu .el-menu-item span {
  flex-grow: 1; // 确保 span 元素可以扩展并占满剩余空间
  text-align: left; // 强制文字左对齐
}
.menu-icon {
  width: 20px;
  height: 20px;
  vertical-align: middle;
  margin-right: 4px;
}
.menu-icon-children {
  width: 20px;
  height: 20px;
  vertical-align: middle;
  margin-right: 4px;
}
</style>
