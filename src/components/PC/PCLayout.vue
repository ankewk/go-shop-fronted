<template>
  <div class="pc-layout" :class="{ 'with-sidebar': showSidebar }">
    <div v-if="showSidebar" class="pc-sidebar">
      <slot name="sidebar" />
    </div>
    <div class="pc-main-content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PCLayout',
  props: {
    showSidebar: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.pc-layout {
  display: flex;
  min-height: 100vh;
  
  &.with-sidebar {
    .pc-main-content {
      margin-left: 260px;
      
      @media (max-width: 992px) {
        margin-left: 0;
      }
    }
  }
}

.pc-sidebar {
  position: fixed;
  left: 0;
  top: 64px;
  width: 260px;
  height: calc(100vh - 64px);
  background: #fff;
  border-right: 1px solid #e4e7ed;
  overflow-y: auto;
  z-index: 100;
  
  @media (max-width: 992px) {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
}

.pc-main-content {
  flex: 1;
  padding: 24px;
  
  @media (min-width: 1200px) {
    padding: 32px 40px;
  }
  
  @media (min-width: 1400px) {
    padding: 40px 48px;
  }
}
</style> 