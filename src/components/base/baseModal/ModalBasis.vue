<template>
  <Teleport to="body">
    <Transition name="base-modal">
      <div 
        v-if="modelValue" 
        class="base-modal-overlay" 
        :style="{ backgroundColor: overlayColor }"
        @click.self="handleOverlayClick"
      >
        <div class="base-modal-container" role="dialog" aria-modal="true" v-bind="$attrs">
          <slot></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  // Quản lý trạng thái mở/đóng modal (v-model)
  modelValue: {
    type: Boolean,
    required: true,
    default: false
  },
  // Màu nền cho Overlay, mặc định là đen mờ
  overlayColor: {
    type: String,
    default: 'rgba(0, 0, 0, 0.4)'
  },
  // Bật/tắt tính năng nhấn ESC để đóng
  closeOnEscape: {
    type: Boolean,
    default: true
  },
  // Bật/tắt tính năng nhấn ra ngoài overlay để đóng
  clickOutsideToClose: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue', 'close']);

// Xử lý sự kiện nhấn phím tắt (ESC)
const handleKeydown = (e) => {
  if (props.closeOnEscape && e.key === 'Escape' && props.modelValue) {
    close();
  }
};

// Xử lý sự kiện nhấn vào Overlay
const handleOverlayClick = () => {
  if (props.clickOutsideToClose) {
    close();
  }
};

// Thực hiện đóng Modal
const close = () => {
  emit('update:modelValue', false);
  emit('close');
};

// Ngăn người dùng cuộn trang web khi đang mở Modal
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
  // Áp dụng chống cuộn ngay nếu modal khởi tạo ở trạng thái mở
  if (props.modelValue) {
    document.body.style.overflow = 'hidden';
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = ''; // Trả lại trạng thái cuộn ban đầu
});

// Cho phép component cha có thể truyền thêm class hoặc style vào child container mà không bị Teleport ghi đè 
defineOptions({
  inheritAttrs: false
});
</script>

<style scoped>
/* Lớp Overlay phủ kín màn hình */
.base-modal-overlay {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Base Modal Container */
.base-modal-container {
  /* Các thuộc tính về size, padding, border-radius của body modal sẽ 
     do slot truyền vào (hoặc component kế thừa) từ bên ngoài quyết định, 
     ở đây chỉ đảm bảo vị trí hiển thị hợp lý. */
  position: relative;
  z-index: 10000;
}

/* -- ANIMATIONS (Vue Transition) -- */

/* Quá trình áp dụng animation (duration, easing options) */
.base-modal-enter-active,
.base-modal-leave-active {
  transition: opacity 0.3s ease;
}

/* Áp dụng animation cho phần tử Modal Container bên trong */
.base-modal-enter-active .base-modal-container,
.base-modal-leave-active .base-modal-container {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Hiệu ứng nảy mượt (bounce back) */
}

/* Trạng thái bắt đầu của enter và kết thúc của leave */
.base-modal-enter-from,
.base-modal-leave-to {
  opacity: 0;
}

/* Transform khi vào / ra cho Modal Container */
.base-modal-enter-from .base-modal-container,
.base-modal-leave-to .base-modal-container {
  transform: scale(0.9) translateY(-30px);
  opacity: 0;
}
</style>
