<template>
  <div class="header_search">
    <div class="header_search--icon">
      <div class="magnifying_glass_icon"></div>
    </div>
    <input type="text" class="header_search--input" :placeholder="placeholder" v-model="keyword" />
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  placeholder: {
    type: String,
    default: 'Tìm kiếm',
  },
})
const emit = defineEmits(['search'])
const keyword = ref('')
let timeout = null
</script>
<style lang="scss" scoped>
.header_search {
  display: flex;
  align-items: center;
  min-width: 365px;
  min-height: 32px;
  background-color: #f2f2f2;
  color: #9ea7b4;
  border-radius: 4px;
  &--input {
    flex: 1;
    border: none;
    background-color: transparent;
    padding: 0 8px;
    font-size: 14px;
    &:focus {
      outline: none;
    }
    &::placeholder {
      color: #9ca6b5;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  &--icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
