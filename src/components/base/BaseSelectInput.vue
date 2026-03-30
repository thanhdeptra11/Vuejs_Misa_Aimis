<template>
  <div class="custom_select" ref="selectContainer">
    <!-- Nút hiển thị giá trị đã chọn -->
    <div
      class="custom_select__display"
      :class="{ 'custom_select__display--active': isOpen }"
      @click="toggleDropdown"
    >
      <span class="custom_select__value">{{ selectedLabel }}</span>
      <div class="icon_down custom_select__icon"></div>
    </div>

    <!-- Danh sách tuỳ chọn (Được thiết lập drop-up hiện lên trên theo ảnh) -->
    <ul class="custom_select__dropdown" v-if="isOpen">
      <li
        class="custom_select__item"
        v-for="option in props.options"
        :key="option.value"
        :class="{
          'custom_select__item--selected': option.value === modelValue,
        }"
        @click="selectOption(option)"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '25',
  },
  options: {
    type: Array,
    default: () => [
      { value: '15', label: '15' },
      { value: '25', label: '25' },
      { value: '50', label: '50' },
      { value: '100', label: '100' },
    ],
  },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const selectContainer = ref(null)

// Tính toán nhãn hiển thị cho giá trị modelValue hiện tại
const selectedLabel = computed(() => {
  const selected = props.options.find((opt) => opt.value == props.modelValue)
  return selected ? selected.label : ''
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

// Hàm cập nhật modelValue khi chọn option
const selectOption = (option) => {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

// Tắt dropdown khi bấm ra ngoài component
const handleClickOutside = (event) => {
  if (selectContainer.value && !selectContainer.value.contains(event.target)) {
    isOpen.value = false
  }
}

// Thiết lập và huỷ sự kiện click outside
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
.custom_select {
  position: relative;
  display: inline-block;
  min-width: 60px;
  user-select: none;

  &__display {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 32px;
    padding: 0 12px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    background-color: #fff;
    cursor: pointer;
    box-sizing: border-box;
    transition: all 0.2s ease;
    gap: 8px;

    &:hover {
      border-color: #2f80ed;
    }

    &--active {
      border-color: #2f80ed; // Xanh giống ảnh rải viền khi click
      .custom_select__value {
        color: #2f80ed;
      }
      .custom_select__icon {
        /* nếu bạn muốn xoay icon mũi tên khi form mở */
        transform: rotate(180deg);
      }
    }
  }

  &__value {
    font-size: 14px;
    /* Mặc định chữ theo ảnh mẫu có màu xanh */
    font-weight: 400;
  }

  &__icon {
    /* sử dụng icon class icon_down sẵn của bạn */
    display: flex;
    transition: transform 0.2s ease;
    opacity: 0.8;
  }

  &__dropdown {
    position: absolute;
    bottom: calc(100% + 4px); /* Tính năng Drop-up đẩy menu lên trên input giống tấm ảnh */
    left: 0;
    width: 100%;
    margin: 0;
    padding: 8px 0;
    list-style: none;
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }

  &__item {
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center; /* Trữ liệu dạng text căn giữa giống tham chiếu */
    padding: 0 8px;
    font-size: 14px;
    color: #454545;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f1f1f1;
    }

    &--selected {
      background-color: #e1eeff; /* Nền xanh cho thẻ đang chọn (tuỳ chọn) */
      color: #2f80ed;
      font-weight: 500;
    }
  }
}
</style>
