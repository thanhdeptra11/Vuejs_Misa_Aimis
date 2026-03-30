<template>
  <div class="base-avatar-wrapper">
    <!-- Component Trực Giác Để Nhấn Tải Ảnh Lên với Form Tròn -->
    <div 
      class="avatar-dropzone" 
      :class="{ 'has-image': previewUrl }"
       @click="triggerAvatarInput"
    >
      <!-- Khung Hiển Thị Ảnh Preview nếu đã Cố Tình Chọn 1 Tấm Định Dạng Hợp Lệ -->
      <img 
        v-if="previewUrl" 
        :src="previewUrl" 
        alt="Avatar Preview" 
        class="avatar-image-preview" 
      />
      <!-- Hoặc Nếu Chưa Có Thì Render Mặc Định Giao Diện Nét Đứt Số 2 -->
      <span v-else class="avatar-placeholder-text">Ảnh</span>

      <input 
        type="file" 
        ref="avatarInputRef" 
        class="hidden-input"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        @change="handleAvatarSelect"
      />
    </div>

    <!-- Nút Bấm Xoá Hoặc Sửa (Chỉ hiện khi đã chọn ảnh) -->
    <div v-if="previewUrl" class="avatar-actions">
      <span class="action-btn text-blue" @click.stop="triggerAvatarInput">Đổi ảnh</span>
      <span class="action-btn text-red" @click.stop="removeAvatar">Xoá</span>
    </div>

    <div class="error-msg" v-if="errorMessage">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue';

const props = defineProps({
  // Có thể truyền url ảnh tĩnh ban đầu vào (Nếu sửa data ứng viên)
  modelValue: { type: [File, String], default: null },
  maxSizeMb: { type: Number, default: 5 } // Avatars thường nhỏ
});

const emit = defineEmits(['update:modelValue', 'error']);

const avatarInputRef = ref(null);
const fileData = ref(null);
const previewUrl = ref('');
const errorMessage = ref('');

// Theo dõi data nếu người dùng truyền string URL vào
watch(() => props.modelValue, (newVal) => {
  if (typeof newVal === 'string') {
    previewUrl.value = newVal; // load avatar server URL
  } else if (!newVal) {
    previewUrl.value = '';
    fileData.value = null;
  }
}, { immediate: true });

// Tránh rò rỉ bộ nhớ (memory leak) của Object URL
onUnmounted(() => {
  if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl.value);
  }
});

const triggerAvatarInput = () => {
  if (avatarInputRef.value) {
    avatarInputRef.value.click();
  }
};

const removeAvatar = () => {
  fileData.value = null;
  errorMessage.value = '';
  if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl.value);
  }
  previewUrl.value = '';
  emit('update:modelValue', null); // Reset về null
};

// --- VALIDATION NHANH VÀ RENDER ---
const handleAvatarSelect = (event) => {
  errorMessage.value = '';
  const file = event.target.files[0];
  if (!file) {
    // Không thao tác gì nếu user huỷ bảng file chọn
    return;
  }

  // Check type
  if (!file.type.startsWith('image/')) {
    errorMessage.value = 'Chỉ chấp nhận tải lên tệp tin dạng hình ảnh (PNG, JPG, v.v).';
    emit('error', errorMessage.value);
    event.target.value = ''; 
    return;
  }

  // Check size 
  if (file.size / (1024 * 1024) > props.maxSizeMb) {
    errorMessage.value = `Dung lượng hình ảnh quá lớn (vượt mức ${props.maxSizeMb}MB).`;
    emit('error', errorMessage.value);
    event.target.value = ''; 
    return;
  }

  // Xoá memory cũ (Nếu người dùng chọn liên tiếp 2 3 cái ảnh vào form sửa)
  if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl.value);
  }

  // Render ra view bằng BLOB format
  previewUrl.value = URL.createObjectURL(file);
  fileData.value = file;
  
  // Trả tệp Object thực tế về Component cha để xử lý POST upload backend
  emit('update:modelValue', file);
  
  // Clear file input tag để cho phép chọn lại cùng 1 file 
  event.target.value = ''; 
};
</script>

<style scoped>
.base-avatar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center; /* Canh giữa component */
  justify-content: center;
  gap: 8px;
  width: max-content;
}

/* Khung Viền Nét Đứt Tròn (Ảnh Mẫu Số 2) */
.avatar-dropzone {
  width: 90px;
  height: 90px;
  border-radius: 50%; /* Tròn 100% */
  border: 1px dashed #d4d7dc; /* Khung nét đứt xám nhạt */
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden; /* Che viền góc của khung hình vuông dư */
  cursor: pointer;
  transition: all 0.2s ease;
}

.avatar-dropzone:hover {
  border-color: #214BF5; /* Nhúm xanh */
}

/* Loại bỏ gạch đứt khi đã có ảnh chèn kín vòng tròn */
.avatar-dropzone.has-image {
  border: none;
}

.avatar-placeholder-text {
  font-size: 16px; 
  color: #b0b0b0; /* Chữ "Ảnh" màu xám nhạt */
  font-weight: 500;
  user-select: none;
}

/* Ảnh hiển thị vừa khít hình tròn */
.avatar-image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Hình không bị dãn biến dạng */
  display: block;
}

.hidden-input {
  display: none;
}

/* Vùng Nút Đổi/Xóa hiển thị sau khi chọn hình */
.avatar-actions {
  display: flex;
  gap: 12px;
  font-size: 13px;
  user-select: none;
}

.action-btn {
  cursor: pointer;
  font-weight: 500;
}
.action-btn:hover {
  text-decoration: underline;
}

.text-blue { color: #214BF5; }
.text-red { color: #ff5050; }

.error-msg {
  font-size: 12px;
  color: #ff5050;
  text-align: center;
  max-width: 150px;
}
</style>
