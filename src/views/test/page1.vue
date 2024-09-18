<template>
    <el-autocomplete
        v-model="query"
        :fetch-suggestions="fetchSuggestions"
        placeholder="请输入内容"
        @select="handleSelect"
    ></el-autocomplete>
</template>
  
  <script setup>
import { ref } from 'vue'
import { ElAutocomplete } from 'element-plus'

// 数据源示例
const suggestions = ['苹果', '香蕉', '橙子', '葡萄', '草莓', '蓝莓']

const query = ref('')

// 处理数据源和自动补全建议
const fetchSuggestions = (queryString, cb) => {
    const results = suggestions.filter((item) =>
        item.toLowerCase().includes(queryString.toLowerCase())
    )
    cb(results)
}

// 处理选择事件
const handleSelect = (item) => {
    console.log('选中了：', item)
}
</script>
  
  <style>
/* 可选：添加样式 */
</style>
  