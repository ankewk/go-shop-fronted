<template>
  <div 
    class="pc-card" 
    :class="[
      `pc-card--${size}`,
      { 'pc-card--hover': hover, 'pc-card--shadow': shadow }
    ]"
  >
    <div v-if="$slots.header" class="pc-card__header">
      <slot name="header" />
    </div>
    <div class="pc-card__body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="pc-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PCCard',
  props: {
    size: {
      type: String,
      default: 'medium',
      validator: value => ['small', 'medium', 'large'].includes(value)
    },
    hover: {
      type: Boolean,
      default: true
    },
    shadow: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
.pc-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
  
  &--shadow {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }
  
  &--hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }
  
  &--small {
    .pc-card__body {
      padding: 16px;
    }
    .pc-card__header,
    .pc-card__footer {
      padding: 12px 16px;
    }
  }
  
  &--medium {
    .pc-card__body {
      padding: 24px;
    }
    .pc-card__header,
    .pc-card__footer {
      padding: 16px 24px;
    }
  }
  
  &--large {
    .pc-card__body {
      padding: 32px;
    }
    .pc-card__header,
    .pc-card__footer {
      padding: 20px 32px;
    }
  }
}

.pc-card__header {
  border-bottom: 1px solid #f0f2f5;
  font-weight: 600;
  color: #303133;
}

.pc-card__footer {
  border-top: 1px solid #f0f2f5;
  background: #fafafa;
}
</style> 