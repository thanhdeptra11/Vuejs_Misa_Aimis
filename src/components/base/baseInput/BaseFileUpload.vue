<template>
  <div class="base-file-wrapper">
    <label v-if="label" class="base-input-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>

    <div 
      class="dropzone-container"
      :class="{ 'is-dragover': isDragover, 'has-file': file }"
      @dragover.prevent="isDragover = true"
      @dragleave.prevent="isDragover = false"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <!-- Khi chưa có file chọn thì hiện giao diện hướng dẫn -->
      <div class="dropzone-content" v-if="!file">
        <div class="main-text">
          <slot name="title">Kéo thả hoặc bấm vào đây để tải CV lên</slot>
        </div>
        <div class="sub-text">
          <slot name="subtitle">Chấp nhận file .doc, .docx, .pdf, .jpg, .jpeg, .png (Dung lượng < hơn 15 Mb)</slot>
        </div>
      </div>

      <!-- Khi đã chọn file thì hiện tên file đó -->
      <div class="file-preview-content" v-else>
        <span class="file-name">{{ file.name }}</span>
        <!-- Bấm X để xoá -->
        <span class="remove-btn" @click.stop="removeFile">✕</span>
      </div>

      <input 
        type="file" 
        ref="fileInputRef" 
        class="hidden-input"
        :accept="accept"
        @change="handleFileSelect"
      />
    </div>

    <!-- Thông báo lỗi validate (dung lượng lớn, sai đuôi) nếu có -->
    <div class="error-text" v-if="errorMessage">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  label: { type: String, default: '' },
  required: { type: Boolean, default: false },
  modelValue: { type: [File, Object], default: null }, // Trả ra Object File cho cha upload
  accept: { 
    type: String, 
    default: '.doc,.docx,.pdf,.jpg,.jpeg,.png' 
  },
  maxSizeMb: {
    type: Number,
    default: 15
  }
});

const emit = defineEmits(['update:modelValue', 'error']);

const fileInputRef = ref(null);
const isDragover = ref(false);
const file = ref(props.modelValue);
const errorMessage = ref('');

// --- XỬ LÝ SỰ KIỆN CLICK VÀ KÉO THẢ ---
const triggerFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
};

const handleDrop = (e) => {
  isDragover.value = false;
  const droppedFiles = e.dataTransfer.files;
  if (droppedFiles && droppedFiles.length > 0) {
    validateAndSaveFile(droppedFiles[0]);
  }
};

const handleFileSelect = (e) => {
  const selectedFiles = e.target.files;
  if (selectedFiles && selectedFiles.length > 0) {
    validateAndSaveFile(selectedFiles[0]);
  }
  // Reset input value để user có thể click chọn lại đúng file đó lỡ vô tình xoá
  e.target.value = '';
};

const removeFile = () => {
  file.value = null;
  errorMessage.value = '';
  emit('update:modelValue', null);
};


// --- KIỂM TRA FILE (VALIDATION) ---
const validateAndSaveFile = (newFile) => {
  errorMessage.value = '';

  // 1. Kiểm tra dung lượng (Bytes -> MB)
  const fileSizeMb = newFile.size / (1024 * 1024);
  if (fileSizeMb > props.maxSizeMb) {
    errorMessage.value = `Dung lượng file tải lên quá lớn (${fileSizeMb.toFixed(2)}MB). Vui lòng chọn file nhỏ hơn ${props.maxSizeMb}MB.`;
    emit('error', errorMessage.value);
    return;
  }

  // 2. Chấp nhận dạng file (Đuôi mở rộng)
  if (props.accept) {
    const listExts = props.accept.split(',').map(ext => ext.trim().toLowerCase());
    const fileName = newFile.name.toLowerCase();
    
    // Kiểm tra xem tên file có kết thúc bởi các đuôi hợp lệ không
    const isValidFormat = listExts.some(ext => {
      // ext có thể là đuôi .pdf hoặc định dạng image/*
      if (ext.startsWith('.')) {
        return fileName.endsWith(ext);
      } else if (ext.includes('/*')) {
        const mimeType = ext.split('/')[0];
        return newFile.type.startsWith(mimeType);
      }
      return newFile.type === ext;
    });

    if (!isValidFormat) {
      errorMessage.value = `Định dạng file không được hỗ trợ. Vui lòng chọn đúng loại file (${props.accept}).`;
      emit('error', errorMessage.value);
      return;
    }
  }

  // Valid thành công
  file.value = newFile;
  emit('update:modelValue', newFile);
};

</script>

<style scoped>
.base-file-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  width: 100%;
}

.base-input-label {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
}
.required-mark {
  color: #d9363e;
  margin-left: 2px;
}

/* Khung Kéo thả có viền đứt nét gạch ngang gạch dọc */
.dropzone-container {
  width: 100%;
  height: 60px; /* Độ cao phù hợp dựa trên tỉ lệ ảnh số 1 */
  border: 1px dashed #d4d7dc; /* Viền nét đứt màu xám nhạt */
  border-radius: 4px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

/* Đổi màu nền mờ khi kéo thả file đè lên hoặc rê chuột chạm vào*/
.dropzone-container:hover,
.dropzone-container.is-dragover {
  border-color: #214BF5;
  background-color: #f7fbff;
}

/* Thông tin text mô tả form */
.dropzone-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  row-gap: 4px;
}

.main-text {
  font-size: 14px;
  color: #214BF5; /* Màu text màu xanh như ảnh chỉ định */
  font-weight: 500;
}

.sub-text {
  font-size: 13px;
  color: #7a8188; /* Màu xám mờ như ảnh */
}

/* Chỗ chứa input type="file" ẩn cho gọn */
.hidden-input {
  display: none;
}

/* Chế độ hiển thị file khi chọn thành công */
.file-preview-content {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #e5efff;
  border: 1px solid #cce0ff;
  border-radius: 4px;
  padding: 6px 12px;
  color: #214BF5;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-btn {
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  color: #ff4d4f;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
}
.remove-btn:hover {
  filter: brightness(0.8);
}

.error-text {
  font-size: 12px;
  color: #ff4d4f;
  margin-top: 4px;
}
</style>
