<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div 
        v-if="modelValue" 
        class="modal-overlay" 
        :style="{ backgroundColor: overlayBg }" 
        @mousedown="handleOverlayClick"
      >
        <div 
          class="modal-container" 
          :style="{ width: width, height: height }" 
          @mousedown.stop
        >
          <div class="modal-header">
            <h3 class="modal-title">{{ title }}</h3>
            <div class="close-btn icon_close" @click="closeModal">
             
            </div>
          </div>
          
          <div class="modal-body">
            <slot name="default"></slot>
          </div>
          <!-- Kiểm tra xem component cha có truyền footer không -->
          <div class="modal-footer" v-if="$slots.footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  width: { type: String, default: '600px' },
  height: { type: String, default: 'auto' },
  overlayBg: { type: String, default: 'rgba(0, 0, 0, 0.45)' },
  closeOnOverlayClick: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'close'])

const closeModal = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlayClick) {
    closeModal()
  }
}

watch(() => props.modelValue, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.modal-container {
  background-color: #ffffff;
  border-radius: 6px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  max-height: 90vh; /* Ngăn Modal quá dài so với màn hình */
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #111;
  margin: 0;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  cursor: pointer;
  transition: color 0.2s;
}
.close-btn:hover {
  color: #111;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 24px 24px 24px;
}

.modal-footer {
  padding: 16px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #e0e0e0;
}

/* Hiệu ứng Transition cho Overlay mờ dần và Modal trượt */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container {
  animation: slide-down 0.3s ease-out;
}
.modal-fade-leave-active .modal-container {
  animation: slide-up 0.3s ease-in forwards;
}

@keyframes slide-down {
  from { transform: translateY(-30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
@keyframes slide-up {
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(-30px); opacity: 0; }
}
</style>
