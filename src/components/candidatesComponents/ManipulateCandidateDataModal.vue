<template>
  <ModalBasis
    :modelValue="modelValue"
    @update:modelValue="val => $emit('update:modelValue', val)"
    :title="title"
    width="560px"
    maxHeight="90vh"
    overlayBg="rgba(0, 0, 0, 0.45)"
    @close="handleClose"
  >
    <div class="candidate-form-container">
      
      <!-- Vùng upload file -->
      <div class="upload-section">
        <!-- Input file ẩn để kích hoạt bằng JS -->
        <input 
          type="file" 
          ref="fileInput" 
          class="hidden-input" 
          @change="handleFileChange" 
          accept=".doc,.docx,.pdf,.jpg,.jpeg,.png" 
        />
        
        <!-- Trạng thái chưa có file -->
        <div 
          v-if="!selectedFile" 
          class="dropzone" 
          @click="triggerFileInput" 
          @dragover.prevent="isDragging = true" 
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          :class="{ 'dropzone--active': isDragging }"
        >
          <span class="dropzone-title">Kéo thả hoặc bấm vào đây để tải CV lên</span>
          <span class="dropzone-subtitle">Chấp nhận file .doc, .docx, .pdf, .jpg, .jpeg, .png (Dung lượng &lt; hơn 15 Mb)</span>
        </div>
        
        <!-- Đã tải file lên -->
        <div v-else class="uploaded-container">
          <div class="uploaded-info">
            <div class="icon_pdf file-icon"></div>
            <div class="file-details">
              <div class="file-name" :title="selectedFile.name">{{ selectedFile.name }}</div>
              <div class="file-size">{{ formatSize(selectedFile.size) }}</div>
            </div>
          </div>
          
          <BaseButton 
            variant="primary" 
            buttonText="Tải lại CV" 
            @click="triggerFileInput" 
          />
        </div>
      </div>

      <!-- Bố cục form nhập liệu -->
      <div class="form-section">
        <!-- Cột Avatar bên trái -->
        <div class="avatar-col">
          <div class="avatar-circle">Ảnh</div>
        </div>
        
        <div class="fields-col">
          <BaseInput 
            label="Họ và tên" 
            placeholder="Nhập họ và tên" 
            required 
            v-model="candidateName" 
          />

          <div class="form-row">
            <div class="col">
              <BaseDatePicker 
                label="Ngày sinh"
                v-model="candidateDOB"
              />
            </div>
            <div class="col">
              <BaseCombobox 
                label="Giới tính"
                placeholder="Chọn giới tính"
                v-model="candidateGender"
                :options="genderOptions"
              />
            </div>
          </div>
          <BaseInput 
            label="Khu vực" 
            placeholder="Chọn giá trị"  
            v-model="candidateRegion" 
          />
          <div class="form-row">
            <BaseInput 
            label="Số điện thoại" 
            placeholder="Nhập số điện thoại" 
            v-model="candidatePhone" 
          />
          <BaseInput 
            label="Email" 
            placeholder="Nhập Email" 
            v-model="candidateEmail" 
          />
          </div>
          <BaseCombobox 
                label="Quốc gia"
                placeholder="Chọn quốc gia"
                v-model="candidateCountry"
                :options="countryOptions"
              />
          <BaseCombobox 
                label="Tỉnh/Thành phố"
                placeholder="Chọn tỉnh/thành phố"
                v-model="candidateCity"
                :options="cityOptions"
                :disabled="!candidateCountry"
              />
          <BaseCombobox 
                label="Phường/Xã"
                placeholder="Chọn phường/xã"
                v-model="candidateWard"
                :options="wardOptions"
                :disabled="!candidateCity"
              />
          <BaseInput 
            label="Địa chỉ" 
            placeholder="Nhập địa chỉ" 
            v-model="candidateAddressDetail" 
          />
        </div>
        
      </div>

    </div>

    <!-- Phần Footer -->
    <template #footer>
      <BaseButton variant="primary" buttonText="Hủy" @click="handleClose" />
      <BaseButton variant="secondary" buttonText="Lưu" @click="save" />
    </template>
  </ModalBasis>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import ModalBasis from '@/components/base/baseModal/ModalBasis.vue'
import candidatesService from '@/services/candidatesService'
import regionService from '@/services/regionService'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Thêm ứng viên' }
})

const emit = defineEmits(['update:modelValue', 'closeModal', 'saved'])

// Quản lý dữ liệu người dùng
const candidateName = ref('')
const candidateDOB = ref('') // Store chuỗi string trả về từ DatePicker
const candidateGender = ref('')
const candidateRegion = ref('')
const candidateCountry = ref('')
const candidateCity = ref('')
const candidateWard = ref('')
const candidateAddressDetail = ref('')
const candidatePhone = ref('')
const candidateEmail = ref('')


const genderOptions = [
  { label: 'Nam', value: 1 },
  { label: 'Nữ', value: 0 },
  { label: 'Khác', value: 2 }
]

const countryOptions = ref([])
const cityOptions = ref([])
const wardOptions = ref([])

onMounted(async () => {
  countryOptions.value = await fetchRegions(null)
})

const fetchRegions = async (parentId) => {
  try {
    const filters = []
    if (parentId) {
      filters.push({ property: 'ParentId', operator: '=', value: parentId })
    } else {
      // Dùng '=' và giá trị null thay vì 'IS NULL'
      filters.push({ property: 'ParentId', operator: '=', value: null })
    }
    const res = await regionService.getPaging({
      pageNumber: 1,
      pageSize: 1000,
      searchTerm: '',
      filters
    })
    const items = res.data || res.Data || res.items || res || []
    return items.map(x => ({ label: x.regionName || x.name || x.label, value: x.id || x.value }))
  } catch (error) {
    console.error('Failed to fetch regions:', error)
    return []
  }
}

// Logic load Tỉnh thao Quốc gia
watch(candidateCountry, async (newVal) => {
  candidateCity.value = ''
  candidateWard.value = ''
  
  if (newVal) {
    cityOptions.value = await fetchRegions(newVal)
  } else {
    cityOptions.value = []
  }
})

// Logic load Xã theo Tỉnh
watch(candidateCity, async (newVal) => {
  candidateWard.value = ''
  
  if (newVal) {
    wardOptions.value = await fetchRegions(newVal)
  } else {
    wardOptions.value = []
  }
})

// Quản lý trạng thái File Upload
const fileInput = ref(null)
const selectedFile = ref(null)
const isDragging = ref(false)

const handleClose = () => {
  emit('update:modelValue', false)
  emit('closeModal')
}

const save = async () => {
  const payload = {
    candidateName: candidateName.value,
    candidateDob: candidateDOB.value || null,
    candidateGender: candidateGender.value,
    candidatePhoneNumber: candidatePhone.value,
    candidateEmail: candidateEmail.value,
    candidateRegion: candidateRegion.value,
    candidateCountry: candidateCountry.value,
    candidateProvince: candidateCity.value,
    candidateWard: candidateWard.value,
    candidateAddressDetail: candidateAddressDetail.value
  }

  try {
    await candidatesService.create(payload)
    emit('saved')
    handleClose()
  } catch (error) {
    console.error('Failed to create candidate:', error)
  }
}

// Logic định dạng dung lượng file
const formatSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Kích hoạt input file
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

// Nhận file từ input
const handleFileChange = (event) => {
  const files = event.target.files
  if (files && files.length > 0) {
    selectedFile.value = files[0]
  }
}

// Nhận file từ thao tác kéo thả
const handleDrop = (event) => {
  isDragging.value = false
  const files = event.dataTransfer.files
  if (files && files.length > 0) {
    selectedFile.value = files[0]
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/variables.scss' as *;

.candidate-form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 8px 0;
}

// Upload file
.upload-section {
  width: 100%;
  height: 100px;
}
.hidden-input {
  display: none;
}

// Dropzone
.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px dashed #d4d7dc;
  border-radius: 4px;
  background-color: #ffffff;
  padding: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
  height: 100px;
  box-sizing: border-box;
}
.dropzone:hover {
  background-color: #f1f4f8;
  border-color: $primary-blue;
}
.dropzone--active {
  background-color: #e2efff;
  border-color: $primary-blue;
}

.dropzone-title {
  color: $primary-blue;
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 4px;
}
.dropzone-subtitle {
  color: #7a8188;
  font-size: 13px;
}

// Uploaded file
.uploaded-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px dashed #e0e0e0;
  border-radius: 4px;
  background-color: #f8f9fa; 
  height: 100px;
  width: 100%;
  font-size: 11px;
  box-sizing: border-box;
  padding-left: 10px;
  padding-right: 10px;
}

.uploaded-info {
  display: flex;
  align-items: center;
  gap: 16px;
  overflow: hidden; 
}


.file-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
}

.file-name {
  color: $primary-blue;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 450px;
}
.file-size {
  color: #7a8188;
  font-size: 13px;
}

// Form nhập liệu
.form-section {
  display: flex;
  gap: 14px;
}
.avatar-col {
  width: 80px;
  flex-shrink: 0;
}
.avatar-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 1px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
  margin-top: 10px;
}
.fields-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.form-row {
  display: flex;
  gap: 16px;
  width: 100%;
}
.form-row .col {
  flex: 1;
  min-width: 0;
}
</style>
