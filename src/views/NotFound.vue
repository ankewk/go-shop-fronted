<template>
  <div class="not-found-page">
    <el-empty description="页面不存在">
      <el-button type="primary" @click="$router.push('/home')">
        返回首页
      </el-button>
    </el-empty>
  </div>
</template>

<style lang="scss" scoped>
.not-found-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}
</style> 