<template>
  <div class="base-datepicker-wrapper" ref="datepickerRef">
    <!-- Tiêu đề (Label) -->
    <label v-if="label" class="base-input-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    
    <!-- Input Container -->
    <div 
      class="base-input-container" 
      :class="{ 'base-input-focus': isFocused || isOpen }"
    >
      <input 
        type="text"
        class="base-input"
        :placeholder="placeholderText"
        :value="inputText"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.enter.prevent="closePopup"
        @keydown.esc="closePopup"
        v-bind="$attrs"
      >
      <!-- Nút mở popup nằm bên phải -->
      <div class="icon-group-right" @click.stop="togglePopup">
        <div class="icon_calendar"></div>
      </div>
    </div>

    <!-- Dropdown Popup Chọn Lịch -->
    <Transition name="fade-slide">
      <div class="datepicker-popup shadow-box" v-if="isOpen" @mousedown.prevent>
        <!-- Header: Điều hướng và Nhãn View -->
        <div class="datepicker-header">
          <div class="nav-btn" @click="prevStep">
             <!-- Dùng css thay nút trái "<" -->
            <div class="chevron left"></div>
          </div>

          <!-- Nhãn đổi view đang hiển thị tuỳ vào chế độ hiện tại -->
          <div class="header-title" @click="switchViewUp">
            <span class="title-text">{{ headerTitle }}</span>
          </div>

          <div class="nav-btn" @click="nextStep">
            <!-- Dùng css thay nút phải ">" -->
            <div class="chevron right"></div>
          </div>
        </div>

        <!-- Body: Các cấu trúc Ma trận hiển thị Lịch tương ứng -->
        
        <!-- 1. Day View (Chọn Ngày trong Tháng) -->
        <div class="datepicker-body day-view" v-if="currentView === 'date'">
          <div class="weekdays">
            <span v-for="day in ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']" :key="day" class="weekday-item">{{ day }}</span>
          </div>
          <div class="days-grid">
            <div 
              v-for="(dateObj, index) in daysMatrix" 
              :key="index"
              class="grid-cell day-cell"
              :class="{ 
                'not-current-month': !dateObj.isCurrentMonth, 
                'selected': isSelectedDate(dateObj.date),
                'today': isToday(dateObj.date)
              }"
              @click="selectDate(dateObj.date)"
            >
              <div class="cell-content">{{ dateObj.day }}</div>
            </div>
          </div>
        </div>

        <!-- 2. Month View (Chọn Tháng trong Năm) -->
        <div class="datepicker-body month-view" v-if="currentView === 'month'">
          <div class="months-grid">
            <div 
              v-for="(monthStr, index) in 12" 
              :key="index"
              class="grid-cell month-cell"
              :class="{ 'selected': isSelectedMonth(index) }"
              @click="selectMonth(index)"
            >
              <div class="cell-content">Tháng {{ index + 1 }}</div>
            </div>
          </div>
        </div>

        <!-- 3. Year View (Chọn Năm trong Thập kỷ) -->
        <div class="datepicker-body year-view" v-if="currentView === 'year'">
          <div class="years-grid">
            <div 
              v-for="year in yearsMatrix" 
              :key="year.value"
              class="grid-cell year-cell"
              :class="{ 
                'out-of-decade': !year.isCurrentDecade,
                'selected': isSelectedYear(year.value),
                'current-year': year.value === new Date().getFullYear()
              }"
              @click="selectYear(year.value)"
            >
              <div class="cell-content">{{ year.value }}</div>
            </div>
          </div>
        </div>

      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  label: { type: String, default: '' },
  required: { type: Boolean, default: false },
  modelValue: { type: [Date, String, Number], default: null }, // Nhận Date str hoặc null
  /**
   * type: loại chọn lịch (Đúng như câu hỏi mở: có thể tái cấu trúc truyền từ ngoài vào).
   * 'date': Chọn Ngày Tháng Năm (Mặc định)
   * 'month': Chọn Tháng Năm
   * 'year': Chỉ chọn Năm
   */
  type: {
    type: String,
    default: 'date',
    validator: (v) => ['date', 'month', 'year'].includes(v)
  }
});

const emit = defineEmits(['update:modelValue']);
defineOptions({ inheritAttrs: false });

const datepickerRef = ref(null);
const isFocused = ref(false);
const isOpen = ref(false);
const inputText = ref(''); // Text thực tế nằm trong thẻ Input (Dành cho việc người dùng tự gõ phím)

// --- QUẢN LÝ PANEL (Popup View State) ---
// currentView dùng để điều hướng các giao diện: 'date', 'month', 'year'. Khởi điểm dựa theo Props 'type'
const currentView = ref(props.type);

// panelDate là cái ngày dùng để show cái khung lịch (Không phải cái người dùng đã chọn nghen)
// Ví dụ: Hôm nay là tháng 3, nhưng mình đang lướt coi tháng 5, thì panelDate là tháng 5.
const panelDate = ref(new Date());

const selectedDateObj = ref(null); // Lưu Date form chuẩn của người dùng chọn/nhập

// --- PLACEHOLDER & FORMATTER ---
const placeholderText = computed(() => {
  if (props.type === 'year') return 'yyyy';
  if (props.type === 'month') return 'MM/yyyy';
  return 'dd/MM/yyyy';
});

// Hàm format ra text cho input
const formatDateToString = (date, formatType) => {
  if (!date || isNaN(date.getTime())) return '';
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();

  if (formatType === 'year') return `${y}`;
  if (formatType === 'month') return `${m}/${y}`;
  return `${d}/${m}/${y}`;
};

// Theo dõi modelValue bên ngoài truyền vào
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    const d = new Date(newVal);
    if (!isNaN(d.getTime())) {
      selectedDateObj.value = d;
      // Trỏ panel theo biến chọn
      panelDate.value = new Date(d.getTime());
      inputText.value = formatDateToString(d, props.type);
    } else {
      inputText.value = '';
      selectedDateObj.value = null;
    }
  } else {
    inputText.value = '';
    selectedDateObj.value = null;
    panelDate.value = new Date(); // reset
  }
}, { immediate: true });

// Khi đổi từ ngoài (VD: chọn 'Year' format sang 'Month' format)
watch(() => props.type, (newType) => {
  currentView.value = newType;
  inputText.value = formatDateToString(selectedDateObj.value, newType);
});


// --- SỰ KIỆN CLICK OUTSIDE & FOCUS ---
const openPopup = () => {
  isOpen.value = true;
  currentView.value = props.type; // Reset view về chế độ gốc
  if (selectedDateObj.value) {
    panelDate.value = new Date(selectedDateObj.value.getTime());
  } else {
    panelDate.value = new Date();
  }
};

const closePopup = () => {
  isOpen.value = false;
};

const togglePopup = () => {
  if (isOpen.value) closePopup();
  else {
    openPopup();
    isFocused.value = true;
  }
};

const handleFocus = () => {
  isFocused.value = true;
  openPopup();
};

const handleBlur = (e) => {
  isFocused.value = false;
  // Bóc tách logic nhập text thủ công ở đây
  parseManualInput(inputText.value);
};

// Lắng nghe click ra ngoài để đóng Popup Lịch
const handleClickOutside = (event) => {
  if (datepickerRef.value && !datepickerRef.value.contains(event.target)) {
    closePopup();
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

// --- MANUAL INPUT BẰNG TAY (PARSING) ---
const handleInput = (e) => {
  inputText.value = e.target.value;
};

const parseManualInput = (text) => {
  if (!text.trim()) {
    updateModel(null);
    return;
  }
  let parsedDate = null;
  const parts = text.split('/');
  
  try {
    if (props.type === 'year' && parts.length === 1 && parts[0].length === 4) {
      const y = parseInt(parts[0], 10);
      parsedDate = new Date(y, 0, 1);
    } else if (props.type === 'month' && parts.length === 2) {
      const m = parseInt(parts[0], 10) - 1;
      const y = parseInt(parts[1], 10);
      parsedDate = new Date(y, m, 1);
    } else if (props.type === 'date' && parts.length === 3) {
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const y = parseInt(parts[2], 10);
      parsedDate = new Date(y, m, d);
    }

    if (parsedDate && !isNaN(parsedDate.getTime())) {
      updateModel(parsedDate);
    } else {
      // Bị lỗi Parse do nhập sai định dạng -> revert lại giá trị đúng trươc đó
      inputText.value = formatDateToString(selectedDateObj.value, props.type);
    }
  } catch (e) {
    inputText.value = formatDateToString(selectedDateObj.value, props.type);
  }
};


// --- XỬ LÝ NAVIGATE & MATRIX (HEADER VÀ BODY) ---

const panelYear = computed(() => panelDate.value.getFullYear());
const panelMonth = computed(() => panelDate.value.getMonth());

// Khung thập kỷ cho Year Picker (e.g. 2020 - 2029)
const decadeStart = computed(() => Math.floor(panelYear.value / 10) * 10);
const decadeEnd = computed(() => decadeStart.value + 9);

const headerTitle = computed(() => {
  if (currentView.value === 'date') return `Tháng ${panelMonth.value + 1}, ${panelYear.value}`;
  if (currentView.value === 'month') return `${panelYear.value}`;
  if (currentView.value === 'year') return `${decadeStart.value} - ${decadeEnd.value}`;
  return '';
});

// Ấn nhãn để zoom out View (Date -> Month -> Year)
const switchViewUp = () => {
  if (currentView.value === 'date') currentView.value = 'month';
  else if (currentView.value === 'month') currentView.value = 'year';
};

// Nút tới/lui thời gian
const prevStep = () => {
  const d = new Date(panelDate.value.getTime());
  if (currentView.value === 'date') d.setMonth(d.getMonth() - 1);
  else if (currentView.value === 'month') d.setFullYear(d.getFullYear() - 1);
  else if (currentView.value === 'year') d.setFullYear(d.getFullYear() - 10);
  panelDate.value = d;
};

const nextStep = () => {
  const d = new Date(panelDate.value.getTime());
  if (currentView.value === 'date') d.setMonth(d.getMonth() + 1);
  else if (currentView.value === 'month') d.setFullYear(d.getFullYear() + 1);
  else if (currentView.value === 'year') d.setFullYear(d.getFullYear() + 10);
  panelDate.value = d;
};


// Dữ liệu 1: Year Matrix (Nhớ cấu trúc lưới 4 cột x 3 hàng = 12 item. Năm 2019 đến 2030 cho Decades 2020-2029)
const yearsMatrix = computed(() => {
  const years = [];
  const start = decadeStart.value - 1; // lùi lấy 1 năm mờ trên đầu
  const end = decadeEnd.value + 2;     // tiến lấy 2 năm mờ sau đít
  for (let y = start; y <= end; y++) {
    years.push({
      value: y,
      isCurrentDecade: y >= decadeStart.value && y <= decadeEnd.value
    });
  }
  // Nếu mảng dư 1 do vòng lặp thì pop ra cho chẵn 12 (4x3 grid)
  if(years.length > 12) years.pop();
  return years;
});

// Dữ liệu 2: Month Matrix (Tĩnh 12 ô từ T1 đến T12, không check computed)

// Dữ liệu 3: Day Matrix (Lưới Lịch tiêu chuẩn có số dư của tháng trước/tháng sau)
const daysMatrix = computed(() => {
  const days = [];
  const y = panelYear.value;
  const m = panelMonth.value;

  const firstDayOfMonth = new Date(y, m, 1).getDay(); // Thứ của ngày mùng 1
  const daysInMonth = new Date(y, m + 1, 0).getDate(); // Số ngày tháng này

  // Convert thứ VN (T2 làm đầu tuần, Chủ nhật=0 nhưng theo lịch của VN ta chuyển về: T2=0, ..., CN=6)
  let startOfWeekIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  // Lấy bớt ngày tháng cũ chèn lên đầu tiên (dùng để lấp đầy ô trống hàng trên cùng, làm mờ nó)
  const daysInPrevMonth = new Date(y, m, 0).getDate();
  for (let i = startOfWeekIndex - 1; i >= 0; i--) {
    days.push({ day: daysInPrevMonth - i, isCurrentMonth: false, date: new Date(y, m - 1, daysInPrevMonth - i) });
  }

  // Điền ngày tháng hiện tại
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, isCurrentMonth: true, date: new Date(y, m, i) });
  }

  // Khúc đuôi đổ sang ngày 1, 2 tháng sau (Lấp đầy ô lưới 6 hàng x 7 cột = 42 ô chuẩn mực đẹp đẽ nhất)
  const totalDays = days.length;
  let remainingSpaces = 42 - totalDays;
  // Nếu có thể bó gọn trong 5 dòng (35 ngày) thì chừa 35 ô
  if (totalDays <= 35) remainingSpaces = 35 - totalDays; 

  for (let i = 1; i <= remainingSpaces; i++) {
    days.push({ day: i, isCurrentMonth: false, date: new Date(y, m + 1, i) });
  }

  return days;
});

// --- SELECT ACTION CHỌN CHỈ ĐỊNH ---
const selectYear = (y) => {
  const d = new Date(panelDate.value.getTime());
  d.setFullYear(y);
  panelDate.value = d;
  if (props.type === 'year') {
    commitDate(d);
  } else {
    currentView.value = 'month'; // Đi xuống tầng month
  }
};

const selectMonth = (m) => {
  const d = new Date(panelDate.value.getTime());
  d.setMonth(m);
  panelDate.value = d;
  if (props.type === 'month') {
    commitDate(d);
  } else {
    currentView.value = 'date'; // Đi xuống tầng date
  }
};

const selectDate = (dateOb) => {
  panelDate.value = new Date(dateOb.getTime()); 
  commitDate(dateOb); // Pick trúng node leaf thì save data
};

const commitDate = (date) => {
  selectedDateObj.value = new Date(date.getTime());
  inputText.value = formatDateToString(date, props.type);
  updateModel(selectedDateObj.value);
  closePopup();
};

const updateModel = (valObj) => {
  // Trả về YYYY-MM-DD dạng chuẩn string hoặc Object Date cho cha
  if (!valObj) {
    emit('update:modelValue', null);
  } else {
    emit('update:modelValue', valObj); 
    // Tuỳ dự án họ chuộng trả string ("2023-01-01") hay Object. Ở đây giả lập trả Date obj.
  }
};


// --- ACTIVE CHECK (Trạng thái đánh dấu lên ô đang chọn) ---
const isSelectedYear = (y) => {
  if (!selectedDateObj.value) return false;
  return selectedDateObj.value.getFullYear() === y && props.type === 'year'; 
  // chỉ đánh dấu year view cuối cùng nếu TYPE là YEAR.
}

const isSelectedMonth = (m) => {
  if (!selectedDateObj.value) return false;
  return selectedDateObj.value.getMonth() === m && selectedDateObj.value.getFullYear() === panelYear.value && (props.type === 'month' || props.type === 'date');
}

const isSelectedDate = (dObj) => {
  if (!selectedDateObj.value || props.type !== 'date') return false;
  return dObj.getFullYear() === selectedDateObj.value.getFullYear() &&
         dObj.getMonth() === selectedDateObj.value.getMonth() &&
         dObj.getDate() === selectedDateObj.value.getDate();
}

const isToday = (dObj) => {
  const today = new Date();
  return dObj.getDate() === today.getDate() &&
         dObj.getMonth() === today.getMonth() &&
         dObj.getFullYear() === today.getFullYear();
};

</script>

<style scoped>
/* =========== CONTAINERS & INPUT =========== */
.base-datepicker-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  width: 100%;
}

.base-input-label {
  font-size: 14px;
  font-weight: 500;
  color: #111111;
  width: fit-content;
}

.required-mark {
  color: #d9363e;
  margin-left: 2px;
}

.base-input-container {
  position: relative;
  display: flex;
  align-items: center;
  height: 36px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #ffffff;
  transition: border-color 0.2s ease;
}

.base-input-focus {
  border-color: #214BF5;
}

.base-input {
  /* Cho phép input dài chiếm phần lớn flex */
  flex: 1; 
  height: 100%;
  border: none;
  outline: none;
  padding: 0 12px;
  font-size: 14px;
  color: #111111;
  background: transparent;
  min-width: 0;
}

.base-input::placeholder {
  color: #999999;
}

.icon-group-right {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  cursor: pointer;
  border-left: 1px solid transparent;
}
.icon-group-right:hover {
  background-color: #f1f1f1;
}

/* Biểu tượng lịch dùng từ file ICON.svg như config - Nếu lỗi chưa load icon thì sẽ hiện cái div vuông */
.icon_calendar {
  width: 24px;
  height: 24px;
  min-width: 24px;
  background-color: #c5ccd5;
  -webkit-mask-image: url('../../../assets/ICON.svg');
  -webkit-mask-position: -144px -113px;
  -webkit-mask-repeat: no-repeat;
  mask-image: url('../../../assets/ICON.svg');
  mask-position: -144px -113px;
  mask-repeat: no-repeat;
}
.base-input-focus .icon-group-right .icon_calendar {
  background-color: #214BF5; /* Nhúm icon Lịch màu xanh khi active (Tương tự hình 3) */
}


/* =========== DROPDOWN POPUP LỊCH =========== */
.datepicker-popup {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 1000;
  background-color: #ffffff;
  border: 1px solid #e3e3e3;
  border-radius: 4px;
  width: 280px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 16px;
  user-select: none;
}

.datepicker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.header-title {
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  color: #212121;
}

.header-title:hover {
  color: #214BF5;
}

.nav-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.nav-btn:hover {
  background-color: #f5f5f5;
}

/* Vẽ nút Chevron qua CSS bằng border-width để giống với Nút Hình Số 3 */
.chevron {
  width: 8px;
  height: 8px;
  border-style: solid;
  border-color: #333333;
  border-width: 1.5px 1.5px 0 0;
}
.chevron.left {
  transform: rotate(-135deg);
  margin-left: 2px;
}
.chevron.right {
  transform: rotate(45deg);
  margin-right: 2px;
}

/* ==== DAY GRID ==== */
.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 8px;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  color: #666;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

/* ==== YEAR / MONTH GRID ==== */
.months-grid, .years-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  row-gap: 24px;
}


/* CELL STYLES */
.grid-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  color: #111111;
  font-size: 14px;
}

.day-cell {
  height: 32px;
}
.month-cell, .year-cell {
  height: 48px;
  font-weight: 500;
}

.grid-cell:hover {
  background-color: #e5ebff;
  color: #214BF5;
}

/* Not in bounds elements (Mờ xám như số "2019" và "2030" màn 3) */
.not-current-month, .out-of-decade {
  color: #bbbbbb;
  font-weight: 400;
}

/* Trạng thái đã chọn (Màu xanh đè lên) */
.grid-cell.selected {
  background-color: #214BF5;
  color: #ffffff;
  font-weight: 600;
}

.grid-cell.selected:hover {
  background-color: #1636c0;
}

/* Trạng thái hôm nay trong phần Lịch */
.grid-cell.day-cell.today {
  border: 1px solid #214BF5; 
}


/* Animation */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
