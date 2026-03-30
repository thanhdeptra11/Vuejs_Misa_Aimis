<template>
  <div class="header">
    <span class="header_title">Ứng viên</span>
    <div class="header_right">
      <PrimaryButton
        iconClass="icon_delete_candidate"
        buttonText="Xóa dữ liệu ứng viên không trúng tuyển"
        @click="handleDeleteCandidate"
      />
      <div class="header_right__double_button">
        <SecondaryButton
          class="header_right__double_button__btnAdd"
          iconClass="icon_add"
          buttonText="Thêm ứng viên"
          @click="addCandidate"
        >
        </SecondaryButton>
        <SecondaryButton
          class="header_right__double_button__btnDown"
          iconClass="icon_down"
          buttonText=""
          @click="handleToggleHeaderDown"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import PrimaryButton from '../base/baseButton/PrimaryButton.vue'
import SecondaryButton from '../base/baseButton/SecondaryButton.vue'
const emit = defineEmits(['add-candidate'])

const handleDeleteCandidate = () => {
  // Logic để xóa dữ liệu ứng viên không trúng tuyển
  console.log('Xóa dữ liệu ứng viên không trúng tuyển')
}
const addCandidate = () => {
  emit('add-candidate')
}
const handleToggleHeaderDown = () => {
  // Logic để hiển thị menu tùy chọn khi click vào icon_down
  console.log('Hiển thị menu tùy chọn')
}
</script>
<style lang="scss" scoped>
.header {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px 0 24px;
  box-sizing: border-box;

  &_title {
    color: #fff;
    font-size: 20px;
    font-weight: 700;
    padding-top: 8px;
    flex-shrink: 0;
  }
  &_right {
    display: flex;
    align-items: center;
    &__double_button {
      display: flex;
      align-items: center;

      &__btnAdd {
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
      }

      &__btnDown {
        width: 40px !important;
        height: 36px !important;

        border: 0px !important;
        border-left: 1px solid rgb(98 98 98 / 50%) !important;
        margin-left: 0px !important;

        border-top-right-radius: 4px !important;
        border-bottom-right-radius: 4px !important;
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;

        padding: 0 !important;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
