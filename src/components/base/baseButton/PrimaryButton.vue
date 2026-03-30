<template>
  <button class="primary_button" @click="$emit('click')">
    <div class="primary_button__icon" :class="iconClass"></div>
    <span class="primary_button__text">{{ buttonText }}</span>
  </button>
</template>
<script setup>
defineProps({
  iconClass: {
    type: String,
    default: '',
  },
  buttonText: {
    type: String,
    default: '',
  },
})
defineEmits(['click'])
</script>
<style lang="scss" scoped>
$primary-color: #2970f6;
.primary_button {
  display: flex;
  align-items: center;
  flex-shrink: 0; //chặn co button

  border: 1px solid #e0e0e0;
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
  &__icon {
    transition: color 0.2s;
  }
  &__text {
    padding-left: 8px;
    transition: color 0.2s;
  }
  &:hover {
    color: $primary-color;
    border-color: $primary-color;
    .primary_button__icon {
      background-color: $primary-color !important;
    }
  }
}
</style>
