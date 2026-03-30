<template>
  <div class="icon_button" @click="$emit('click')" :title="title">
    <div :class="iconClass"></div>
  </div>
</template>
<script setup>
defineProps({
  iconClass: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
})
defineEmits(['click'])
</script>
<style lang="scss" scoped></style>
