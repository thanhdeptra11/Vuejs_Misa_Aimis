<template>
  <div class="format-select-wrapper" ref="wrapperRef" @blur="closePopup" tabindex="0">
    <!-- Hiển thị Dòng chữ (Ví dụ: Tháng năm) và mũi tên xuống -->
    <div class="format-display" @click="togglePopup">
      <span class="format-text">{{ currentLabel }}</span>
      <div class="icon_down" :class="{ 'rotate-180': isOpen }"></div>
    </div>
    
    <!-- Menu Tuỳ Chọn -->
    <Transition name="fade-slide">
      <ul class="format-dropdown shadow-box" v-if="isOpen" @mousedown.prevent>
        <li 
          v-for="opt in options" 
          :key="opt.value" 
          class="format-item"
          :class="{'selected': opt.value === modelValue}"
          @click.stop="selectOption(opt.value)"
        >
          <span class="item-label">{{ opt.label }}</span>
          <!-- Dấu check bằng css hoặc emoji thay thế nếu hệ thống thiếu icon svg -->
          <svg v-if="opt.value === modelValue" class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13L9 17L19 7" stroke="#214BF5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  // Nhận vào mode format: 'date', 'month', 'year'. Mặc định tuỳ ý từ cha.
  modelValue: {
    type: String,
    default: 'date', // Mặc định là ngày tháng năm
    validator: v => ['year', 'month', 'date'].includes(v)
  }
});

const emit = defineEmits(['update:modelValue']);

// Các lựa chọn Option cố định theo thiết kế
const options = [
  { value: 'year', label: 'Năm' },
  { value: 'month', label: 'Tháng năm' },
  { value: 'date', label: 'Ngày tháng năm' }
];

const wrapperRef = ref(null);
const isOpen = ref(false);

const currentLabel = computed(() => {
  const f = options.find(o => o.value === props.modelValue);
  return f ? f.label : options[2].label;
});

const togglePopup = () => {
  isOpen.value = !isOpen.value;
};

const closePopup = () => {
  isOpen.value = false;
};

const selectOption = (val) => {
  emit('update:modelValue', val);
  closePopup();
};

const handleClickOutside = (e) => {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target)) {
    closePopup();
  }
};

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));
</script>

<style scoped>
.format-select-wrapper {
  position: relative;
  display: inline-block;
  user-select: none;
  font-family: inherit;
  outline: none; /* Khử viền khi tabindex focus */
}

/* Phần chữ hiển thị trên form thường là màu mờ giống trong ảnh số 2 */
.format-display {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #999999;
  font-size: 14px;
  font-weight: 500;
  gap: 4px; /* Khoảng cách chữ và mũi tên */
  transition: color 0.1s ease;
}

.format-display:hover {
  color: #555555;
}

.icon_down {
  width: 14px;
  height: 14px;
  background-color: currentColor;
  -webkit-mask-image: url('../../../assets/ICON.svg');
  -webkit-mask-position: -32px -48px;
  -webkit-mask-repeat: no-repeat;
  transition: transform 0.2s ease;
}
.icon_down.rotate-180 {
  transform: rotate(180deg);
}

/* Menu mở ra (Giống Dropdown) */
.format-dropdown {
  position: absolute;
  top: 100%; /* Căn vừa khít ngay mép dưới */
  left: 0;
  min-width: 160px;
  margin: 6px 0 0 0;
  padding: 4px 0;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  list-style: none;
}

.format-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 36px;
  padding: 0 12px;
  font-size: 14px;
  color: #111;
  cursor: pointer;
}

.format-item:hover {
  background-color: #f1f1f1;
}

/* Bôi xanh cho item đang chọn giống hình 2 */
.format-item.selected {
  background-color: #e5efff;
}

.item-label {
  flex: 1;
}

.check-icon {
  margin-left: 12px;
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
