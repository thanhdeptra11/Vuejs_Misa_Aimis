<template>
  <div class="icon_button" @click="$emit('click')">
    <div class="icon_button__icon" :class="iconClass"></div>
    <span class="icon_button__text">{{ buttonText }}</span>
  </div>
</template>
<script setup>
const props = defineProps({
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
.icon_button {
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
    border-color: #2680eb;
    background-color: #e2efff;
    .icon_button__icon {
      background-color: #2680eb !important;
    }
  }
}
</style>
