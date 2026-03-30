<template>
  <div class="base-input-wrapper">
    <!-- Tiêu đề (Label) của Input -->
    <label v-if="label" class="base-input-label" :for="id">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    
    <!-- Vùng bao ngoài Input chứa thanh viền, thay đổi viền khi focus -->
    <div 
      class="base-input-container" 
      :class="{ 'base-input-focus': isFocused }"
    >
      <input 
        class="base-input"
        :id="id"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="isFocused = true"
        @blur="isFocused = false"
        v-bind="$attrs"
      >
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  // Chuỗi label hiển thị bên trên input
  label: {
    type: String,
    default: ''
  },
  // Bật dấu sao màu đỏ báo hiệu vùng bắt buộc
  required: {
    type: Boolean,
    default: false
  },
  // Dữ liệu ràng buộc với v-model của component cha
  modelValue: {
    type: [String, Number],
    default: ''
  },
  // ID dùng để gán nhãn label với input cho chuẩn accessibility (a11y)
  id: {
    type: String,
    default: () => 'input-' + Math.random().toString(36).substr(2, 9)
  }
});

defineEmits(['update:modelValue']);
defineOptions({
  inheritAttrs: false // Chặn thuộc tính trôi vào thẻ root (wrapper), để đưa vào thẻ input thông qua v-bind="$attrs"
});

// Trạng thái focus của input để css viền
const isFocused = ref(false);
</script>

<style scoped>
.base-input-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 8px; /* Khoảng cách giữa nhãn và khung nhập */
  width: 100%;
}

.base-input-label {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  width: fit-content;
}

.required-mark {
  color: #d9363e; /* Màu đỏ cho dấu sao */
  margin-left: 2px;
}

.base-input-container {
  display: flex;
  align-items: center;
  height: 36px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #ffffff;
  transition: border-color 0.2s ease;
  overflow: hidden;
}

/* Khi người dùng click vào text box */
.base-input-focus {
  border-color: #214BF5; /* Màu xanh focus như thiết kế */
}

.base-input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding: 0 12px;
  font-size: 14px;
  color: #333333;
  background: transparent;
  box-sizing: border-box;
}

.base-input::placeholder {
  color: #999999;
  font-style: italic; /* Hình mẫu placeholder hơi mờ */
}

/* Trường hợp input bị disable */
.base-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.base-input-container:has(.base-input:disabled) {
  background-color: #f5f5f5;
}
</style>
