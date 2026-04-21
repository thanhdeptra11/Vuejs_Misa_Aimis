<template>
  <component
    :is="rootTag"
    class="base_button"
    :class="`base_button--${variant}`"
    :title="title"
    @click="$emit('click')"
  >
    <div v-if="iconClass" class="base_button__icon" :class="iconClass"></div>
    <span v-if="variant !== 'icon-only'" class="base_button__text">{{ buttonText }}</span>
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    required: true,
    validator: (v) => ['primary', 'secondary', 'icon', 'icon-only'].includes(v),
  },
  iconClass: {
    type: String,
    default: '',
  },
  buttonText: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
})

defineEmits(['click'])

const rootTag = computed(() =>
  props.variant === 'icon' || props.variant === 'icon-only' ? 'div' : 'button',
)
</script>

<style lang="scss" scoped>
@use '@/assets/variables.scss' as *;

// --- primary: white bg, gray border, icon + text, hover turns blue ---
.base_button--primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-shrink: 0;

  border: 1px solid $border-gray;
  color: #1e2633;

  background-color: #ffffff;
  font-weight: 500;
  font-size: 14px !important;

  width: auto;
  height: 36px !important;

  padding: 8px 12px !important;
  border-radius: 4px !important;
  margin-left: 15px;
  cursor: pointer;

  .base_button__icon {
    transition: color 0.2s;
  }
  .base_button__text {
    transition: color 0.2s;
  }
  &:hover {
    color: $primary-blue;
    border-color: $primary-blue;
    .base_button__icon {
      background-color: $primary-blue !important;
    }
  }
}

// --- secondary: blue bg, white text ---
.base_button--secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-shrink: 0;

  background-color: $primary-blue;
  color: #ffffff;
  border-color: transparent;

  width: auto;
  font-weight: 500;
  font-size: 14px;
  height: 36px;
  padding: 8px 12px;
  margin-left: 15px;
  border-radius: 4px;
  cursor: pointer;

  .base_button__icon {
    background-color: #ffffff !important;
  }
  .base_button__text {
  }
  &:hover {
    transition: color 0.2s;
    background-color: #4097ff !important;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1) !important;
  }
}

// --- icon: thin border, small, hover-blue bg ---
.base_button--icon {
  margin-left: 8px;
  background-color: #ffffff;
  height: 35px;
  padding: 8px;
  border: 1px solid #e0e6ec;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    border-color: $primary-blue;
    background-color: #e2efff;
    .base_button__icon {
      background-color: $primary-blue !important;
    }
  }
}

// --- icon-only: bare icon, no chrome (grid row actions).
// Kept unstyled to match the original OnlyIconButton behavior — the
// consumer passes the icon class (e.g. icon_edit_table) via the outer
// `class` attribute, which carries its own background/size.
.base_button--icon-only {
}
</style>
