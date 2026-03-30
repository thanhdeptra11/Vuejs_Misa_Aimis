<template>
  <!-- Bọc nội dung bằng Base Modal Basis -->
  <ModalBasis
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    overlayColor="rgba(0, 0, 0, 0.4)"
  >
    <div class="candidate-modal-container">
      <!-- HEADER -->
      <div class="modal-header">
        <h2 class="title">{{ title }}</h2>
        <!-- Nút Đóng bằng CSS chữ X đơn giản hoặc dùng icon có sẵn -->
        <div class="close-btn" @click="closeModal">✕</div>
      </div>

      <!-- BODY SCROLL ZONE -->
      <!-- class custom-scrollbar xử lý thanh cuộn to nhỏ theo chuẩn yêu cầu -->
      <div class="modal-body custom-scrollbar">
        <!-- 1. Upload CV (Full Width Tầng trên cùng) -->
        <div class="form-row">
          <BaseFileUpload />
        </div>

        <!-- 2. Avatar & Info (Tầng kế tiếp xếp Ngang) -->
        <div class="user-profile-row">
          <!-- Cột trái chứa Avatar Tròn -->
          <div class="avatar-col">
            <BaseAvatarUpload />
          </div>

          <!-- Cột phải chứa Input Tên và cụm Ngày Sinh -->
          <div class="info-col">
            <div class="form-row">
              <BaseInput label="Họ và tên" required placeholder="Nhập họ và tên" />
            </div>

            <div class="col-2-grid form-row">
              <!-- Nhóm Ngày sinh có chứa Label Dropdown định dạng -->
              <div class="date-group">
                <div class="date-header-group">
                  <label class="custom-lbl">Ngày sinh</label>
                  <BaseDateFormatSelect v-model="dateFormatMode" />
                </div>
                <!-- Binding type bằng định dạng từ Dropdown Label -->
                <BaseDatePicker :type="dateFormatMode" />
              </div>

              <!-- Input Giới tính -->
              <div class="gender-group">
                <BaseCombobox
                  label="Giới tính"
                  placeholder="Chọn giới tính"
                  :options="[
                    { value: 1, label: 'Nam' },
                    { value: 0, label: 'Nữ' },
                  ]"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Khu Vực (Quay lại Layout Full Width) -->
        <div class="form-row">
          <div class="flex-row-with-btn">
            <BaseCombobox style="flex: 1" label="Khu vực" placeholder="Chọn giá trị" />
            <div class="more-btn">...</div>
          </div>
        </div>

        <!-- 4. SĐT & Email (Chia 2) -->
        <div class="form-row col-2-grid">
          <BaseInput label="Số điện thoại" placeholder="Nhập số điện thoại" />
          <BaseInput label="Email" placeholder="Nhập Email" />
        </div>

        <!-- 5. Địa chỉ chi tiết (Lần lượt đè thẳng hàng) -->
        <div class="form-row">
          <BaseCombobox label="Quốc gia" placeholder="Nhập Quốc gia" />
        </div>
        <div class="form-row">
          <BaseCombobox label="Tỉnh/Thành phố" placeholder="Chọn Tỉnh/Thành phố" />
        </div>
        <div class="form-row">
          <BaseCombobox label="Phường/Xã" placeholder="Chọn Phường/Xã" />
        </div>
        <div class="form-row">
          <BaseInput label="Địa chỉ" placeholder="Nhập địa chỉ" />
        </div>

        <!-- 6. HỌC VẤN SECTION (Để test thanh Scroll) -->
        <div class="section-divider">HỌC VẤN</div>

        <div class="form-row">
          <BaseInput label="▪ Trình độ đào tạo" placeholder="Nhập trình độ đào tạo" />
        </div>
        <div class="form-row">
          <BaseInput label="▪ Nơi đào tạo" placeholder="Nhập nơi đào tạo" />
        </div>
        <div class="form-row" style="margin-bottom: 30px">
          <BaseInput label="▪ Chuyên ngành" placeholder="Nhập chuyên ngành" />
        </div>
      </div>

      <!-- FOOTER -->
      <div class="modal-footer">
        <button class="btn btn-cancel" @click="closeModal">Hủy</button>
        <button class="btn btn-save" @click="saveForm">Lưu</button>
      </div>
    </div>
  </ModalBasis>
</template>

<script setup>
import { ref } from 'vue'

// Import các Component cấu thành đã được tạo
import ModalBasis from './ModalBasis.vue'
import BaseInput from '../baseInput/BaseInput.vue'
import BaseCombobox from '../baseInput/BaseCombobox.vue'
import BaseDatePicker from '../baseInput/BaseDatePicker.vue'
import BaseDateFormatSelect from '../baseInput/BaseDateFormatSelect.vue'
import BaseFileUpload from '../baseInput/BaseFileUpload.vue'
import BaseAvatarUpload from '../baseInput/BaseAvatarUpload.vue'

// Trạng thái bật/tắt do component cha (Danh sách) quản lý truyền vào
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: 'Thêm ứng viên',
  },
})

const emit = defineEmits(['update:modelValue', 'closeModal'])

const dateFormatMode = ref('year') // Khởi tạo mặc định theo hình mẫu nhập Năm

const closeModal = () => {
  emit('update:modelValue', false)
  emit('closeModal')
}

const saveForm = () => {
  // Logic Save
  closeModal()
}
</script>

<style scoped>
/* KHUNG CHÍNH (Chiếm 650px fix cứng hoặc responsve) */
.candidate-modal-container {
  background-color: #ffffff;
  width: 560px;
  max-height: calc(100vh - 48px); /* Cách lề trên 24 và dưới 24 */
  border-radius: 6px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

/* ======== HEADER ======== */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid #eeeeee;
}

.modal-header .title {
  font-size: 20px;
  font-weight: 700;
  color: #111111;
  margin: 0;
}

.close-btn {
  cursor: pointer;
  font-size: 18px;
  color: #666666;
  font-weight: 500;
  padding: 4px;
}
.close-btn:hover {
  color: #ff4d4f;
}

/* ======== BODY & SCROLLBAR ======== */
.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1; /* Tự động nở chiếm khoảng trống thừa và cho phép sinh scroll */
  min-height: 0; /* Quan trọng để scrollbar hoạt động tốt với flex */
  display: flex;
  flex-direction: column;
  row-gap: 20px; /* Nhúng margin 20px giữa các row input luôn cho lẹ */
}

/* --- YÊU CẦU: Scrollbar Phóng to khi hover --- */
/* Trạng thái bình thường: 6px, xám nhạt trong suốt để thanh lịch */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  background-color: transparent;
  transition: width 0.3s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e0e0e0;
  border-radius: 10px;
}

/* Trạng thái Hover: Thanh cuộn to hẳn lên 10px, xám đậm ra */
.custom-scrollbar:hover::-webkit-scrollbar {
  width: 10px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #caced5;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #9fa4ac;
}

/* ======== CÁC ROW FORM LAYOUT ======== */
.form-row {
  width: 100%;
}

/* Hàng profile đặc biệt: Ảnh trái, Input Phải */
.user-profile-row {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.avatar-col {
  flex: 0 0 auto;
}

.info-col {
  flex: 1; /* Chiếm hết phần còn lại của hàng */
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Class lưới 2 cột chia đôi tỉ lệ 50-50 */
.col-2-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Phần Ngày Sinh header nối liên tiếp label và dropdown format */
.date-header-group {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.custom-lbl {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
}

/* Flex chứa btn dấu 3 chấm "..." cạnh dropdown */
.flex-row-with-btn {
  display: flex;
  align-items: flex-end; /* Để label không bị ảnh hưởng */
  gap: 8px;
}
.more-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  font-weight: 700;
  margin-bottom: 0px; /* Nới lên cho bằng với ô input bên cạnh */
}
.more-btn:hover {
  background-color: #f5f5f5;
}

/* ======== SECTION THÔNG TIN KHÁC ======== */
.section-divider {
  font-size: 14px;
  font-weight: 600;
  color: #666666;
  text-transform: uppercase;
  margin-top: 10px;
  margin-bottom: -4px;
}

/* ======== FOOTER ======== */
.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #eeeeee;
  background-color: #fcfcfc;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-radius: 0 0 6px 6px;
}

/* CSS Buttons basic */
.btn {
  min-width: 80px;
  height: 36px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-cancel {
  background-color: transparent;
  color: #555555;
  border: 1px solid transparent;
}
.btn-cancel:hover {
  background-color: #f1f1f1;
}

.btn-save {
  background-color: #214bf5;
  color: #ffffff;
}
.btn-save:hover {
  background-color: #1a3cc4;
}
</style>
