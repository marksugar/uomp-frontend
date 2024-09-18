<template>
  <div class="tags">
    <el-tag
      v-for="(tag, index) in tags"
      :key="tag.name"
      :closable="tag.name !== 'home'"
      :disable-transitions="false"
      :effect="$route.name == tag.name ? 'plain' : 'dark'"
      :type="tag.type"
      @click="changeMenu(tag)"
      @close="handleClose(tag, index)"
    >
      {{ tag.label }}
    </el-tag>
  </div>
</template>
<script setup>
import { useStore } from "vuex";
const store = useStore();
const tags = store.state.tabsList;

import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const changeMenu = (item) => {
  router.push({ name: item.name });
};
const handleClose = (tag, index) => {
  let length = tags.length - 1;
  // 处理vuex中的tabslist
  store.commit("closeTab", tag);
  // 做第一个判断
  if (tag.name !== route.name) {
    return;
  }
  if (index === length) {
    router.push({
      name: tags[index - 1].name,
    });
  } else {
    router.push({
      name: tags[index].name,
    });
  }
};
</script>

<style lang="less" scoped>
.tags {
  padding: 10px;
  width: 100%;
  border-style: solid;
  .el-tag {
    margin-right: 5px;
    cursor: pointer;
  }
}
</style>
