<template>
  <ModalBasis
    :modelValue="modelValue"
    @update:modelValue="val => $emit('update:modelValue', val)"
    :title="title"
    width="680px"
    height="auto"
    overlayBg="rgba(0, 0, 0, 0.45)"
    @close="handleClose"
  >
    <!-- Phần Body (Content) tạm thời để trống hoặc cho text placeholder để bạn test Base -->
    <div class="placeholder-content">
      Phần nội dung form sẽ được thêm vào sau...
    </div>

    <!-- Phần Footer -->
    <template class="footer" #footer>
      <span  @click="handleClose">Hủy</span>
      <BaseButton variant="secondary" 
      buttonText="Lưu" 
      @click="save"></BaseButton>
    </template>
  </ModalBasis>
</template>

<script setup>
import ModalBasis from './ModalBasis.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Thêm ứng viên' }
})

const emit = defineEmits(['update:modelValue', 'closeModal'])

const handleClose = () => {
  emit('update:modelValue', false)
  emit('closeModal')
}

const save = () => {
  // Tạm thời nhấn Lưu cũng đóng form
  handleClose()
}
</script>

<style scoped>
.footer {
  width: 100% !important;
  height: 56px !important;
  padding: 9px 24px !important;
  border-top: 1px solid #dddde4;
  background-color: #f1f2f5 !important;
}
span{
  cursor: pointer;
  display: flex;
  align-items: center;
  
}
.placeholder-content {
  padding: 40px 20px;
  text-align: center;
  color: #888;
  font-style: italic;
  font-size: 14px;
}


</style>
