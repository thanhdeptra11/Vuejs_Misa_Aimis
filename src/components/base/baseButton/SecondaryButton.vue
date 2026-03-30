<template>
  <button class="secondary_button" @click="$emit('click')">
    <div class="secondary_button__icon" :class="iconClass"></div>
    <span class="secondary_button__text">{{ buttonText }}</span>
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
.secondary_button {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; //chặn co button

  background-color: #2680eb;
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

  &__icon {
    background-color: #ffffff !important;
  }
  &__text {
    padding-left: 8px;
  }
  &:hover {
    transition: color 0.2s;
    background-color: #4097ff !important;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1) !important;
  }
}
</style>
