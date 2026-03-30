<template>
  <div class="base-combobox-wrapper" ref="wrapperRef">
    <!-- Tiêu đề (Label) -->
    <label v-if="label" class="base-input-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>

    <!-- Khung nhập liệu (Input Area) -->
    <div
      class="base-input-container"
      :class="{ 'base-input-focus': isFocused || isOpen }"
      @click="triggerFocus"
    >
      <input
        ref="inputRef"
        class="base-input"
        type="text"
        :placeholder="placeholder"
        v-model="searchText"
        @focus="handleFocus"
        @input="handleInput"
        @keydown.down.prevent="navigateDown"
        @keydown.up.prevent="navigateUp"
        @keydown.enter.prevent="selectHighlighted"
        @keydown.esc.prevent="closeDropdown"
        v-bind="$attrs"
      />
      <!-- Icon thả xuống -->
      <div class="icon-group-right" @mousedown.prevent="toggleDropdown">
        <div class="icon_down" :class="{ 'rotate-180': isOpen }"></div>
      </div>
    </div>

    <!-- Danh sách Dropdown Menu -->
    <Transition name="fade-slide">
      <ul class="combobox-dropdown shadow-box" v-if="isOpen" @mousedown.prevent>
        <li
          v-for="(option, index) in filteredOptions"
          :key="option.value !== undefined ? option.value : index"
          class="combobox-item"
          :class="{
            selected: isSelected(option),
            highlighted: index === highlightedIndex,
          }"
          @click="selectOption(option)"
          @mouseenter="highlightedIndex = index"
        >
          <!-- Ưu tiên hiển thị text hoặc label (Tuỳ cấu trúc mảng cha truyền xuống) -->
          {{ option.label || option.text }}
        </li>
        <li v-if="filteredOptions.length === 0" class="combobox-item empty-msg">
          Không tìm thấy kết quả
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: 'Chọn giá trị' },
  modelValue: { type: [String, Number, Boolean, Object], default: null },
  /**
   * Cấu trúc options mẫu:
   * [ { value: 1, label: 'Nam' }, { value: 0, label: 'Nữ' } ]
   */
  options: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])
defineOptions({ inheritAttrs: false })

const wrapperRef = ref(null)
const inputRef = ref(null)

const searchText = ref('')
const isOpen = ref(false)
const isFocused = ref(false)
const highlightedIndex = ref(-1) // Hỗ trợ điều hướng bằng phím mũi tên

// Lấy thông tin option đã được chọn theo v-model
const selectedOption = computed(() => {
  return props.options.find((opt) => opt.value === props.modelValue)
})

// Cập nhật giá trị hiển thị khi v-model gốc thay đổi
watch(
  () => props.modelValue,
  () => {
    if (selectedOption.value) {
      searchText.value = selectedOption.value.label || selectedOption.value.text
    } else {
      searchText.value = ''
    }
  },
  { immediate: true },
)

// Danh sách gợi ý sau khi lọc thao tác gõ phím
const filteredOptions = computed(() => {
  if (!searchText.value) return props.options

  // Nếu chữ trong ô đang giống 100% với giá trị đã chọn => Chưa gõ thêm phím nào => Nhả toàn bộ Menu
  if (
    selectedOption.value &&
    (selectedOption.value.label === searchText.value ||
      selectedOption.value.text === searchText.value)
  ) {
    return props.options
  }

  // Chuyển về In thường và Lọc
  const searchLower = searchText.value.toString().toLowerCase()
  return props.options.filter((opt) => {
    const textStr = (opt.label || opt.text || '').toString().toLowerCase()
    return textStr.includes(searchLower)
  })
})

// --- CÁC HÀM TƯƠNG TÁC POPUP ---

const openDropdown = () => {
  isOpen.value = true
  highlightedIndex.value = -1 // Reset bôi đen điều hướng
}

const closeDropdown = () => {
  isOpen.value = false
  // Blur khỏi Popup: Rollback (Khôi phục) lại chữ khớp với giá trị đang lưu trong modelValue (Nếu user gõ sai hoặc bỏ dở)
  if (selectedOption.value) {
    searchText.value = selectedOption.value.label || selectedOption.value.text
  } else {
    searchText.value = ''
  }
}

const toggleDropdown = () => {
  if (isOpen.value) {
    closeDropdown()
  } else {
    openDropdown()
    if (inputRef.value) inputRef.value.focus()
  }
}

const triggerFocus = () => {
  if (inputRef.value) inputRef.value.focus()
}

const selectOption = (opt) => {
  emit('update:modelValue', opt.value)
  searchText.value = opt.label || opt.text
  isOpen.value = false
  // Giữ lại pointer vào Input để có trọn cảm giác thao tác form nếu cần
}

const isSelected = (opt) => {
  return (
    props.modelValue !== null && props.modelValue !== undefined && opt.value === props.modelValue
  )
}

// --- CÁC HÀM LẮNG NGHE SỰ KIỆN KEYBOARD CHUỘT ---

const handleFocus = () => {
  isFocused.value = true
  openDropdown()
}

const handleInput = () => {
  openDropdown()
  // Nếu ô không có chữ => Remove value trong Object
  if (!searchText.value.trim()) {
    emit('update:modelValue', null)
  }
}

// Keyboard Arrow Down
const navigateDown = () => {
  if (!isOpen.value) {
    openDropdown()
    return
  }
  if (highlightedIndex.value < filteredOptions.value.length - 1) {
    highlightedIndex.value++
  }
}

// Keyboard Arrow Up
const navigateUp = () => {
  if (isOpen.value && highlightedIndex.value > 0) {
    highlightedIndex.value--
  }
}

// Keyboard Arrow Enter
const selectHighlighted = () => {
  if (
    isOpen.value &&
    highlightedIndex.value >= 0 &&
    highlightedIndex.value < filteredOptions.value.length
  ) {
    selectOption(filteredOptions.value[highlightedIndex.value])
  } else if (!isOpen.value) {
    openDropdown()
  }
}

// Bấm chuột ra ngoài Form
const handleClickOutside = (e) => {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target)) {
    isFocused.value = false
    closeDropdown()
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))
</script>

<style scoped>
/* =========== CONTAINERS & INPUT =========== */
.base-combobox-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  width: 100%;
}

.base-input-label {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  width: fit-content;
}

.required-mark {
  color: #d9363e;
  margin-left: 2px;
}

.base-input-container {
  display: flex;
  align-items: center;
  height: 36px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #ffffff;
  transition: border-color 0.2s ease;
  cursor: text;
}
.base-input-container input {
  overflow: hidden;
  text-overflow: ellipsis;
}
.base-input-focus {
  border-color: #214bf5; /* Focus border color like image */
}

.base-input {
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  padding: 0 12px;
  font-size: 14px;
  color: #333333;
  background: transparent;
  width: 100%;
}

.base-input::placeholder {
  color: #999999;
}

/* Biểu tượng Mũi tên Dropdown */
.icon-group-right {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  cursor: pointer;
}

.icon_down {
  width: 16px;
  height: 16px;
  min-width: 16px;
  background-color: #555555;
  -webkit-mask-image: url('../../../assets/ICON.svg');
  -webkit-mask-position: -32px -48px;
  -webkit-mask-repeat: no-repeat;
  transition: transform 0.2s ease;
}

.icon_down.rotate-180 {
  transform: rotate(180deg); /* Xoay mũi tên lên trên khi mở Popup */
}

/* Ánh sáng khi xanh focus */
.base-input-focus .icon-group-right .icon_down {
  background-color: #214bf5;
}

/* =========== DROPDOWN MENU =========== */
.combobox-dropdown {
  position: absolute;
  top: calc(100% + 4px); /* Khoảng cách cách đuôi input 4px */
  left: 0;
  z-index: 1000;
  width: 100%;
  margin: 0;
  padding: 4px 0; /* Padding trên dưới Menu gọn gàng */
  list-style: none;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  max-height: 250px;
  overflow-y: auto; /* Cuộn nếu list quá dài */
}

/* Option Items */
.combobox-item {
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  font-size: 14px;
  color: #333333;
  cursor: pointer;
  transition:
    background-color 0.2s,
    color 0.2s;
}

/* Hiệu ứng di chuột Hover hoặc chọn Option Bằng phím Keyboard (Highlighted) */
.combobox-item:hover,
.combobox-item.highlighted {
  background-color: #f1f1f1;
}

/* Trạng thái Data đã chọn (Màu xanh light blue nhẹ của nền MISA theo ảnh) */
.combobox-item.selected {
  background-color: #e5efff; /* Nền xanh nhạt giống ảnh */
  color: #111111; /* Màu chữ giữ nguyên hoặc hơi đậm */
  font-weight: 500;
}

.combobox-item.empty-msg {
  color: #999999;
  font-style: italic;
  justify-content: center;
  pointer-events: none;
  background-color: transparent;
}

/* Animations Vue Transition Fade Slide */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
