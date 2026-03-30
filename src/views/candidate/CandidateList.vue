<template>
  <div class="candidate_list">
    <Header class="candidate_list__header" @add-candidate="openAddModal" />
    <div class="candidate_list__content">
      <ToolbarGrid @search="handleSearch" />
      <div class="candidate_list__grid_wrapper">
        <BaseGridData :columns="columns" :data="tableData" class="grid_data_area" />
        <GridDataFooter
          :totalRecords="totalRecords"
          v-model:currentPage="currentPage"
          v-model:pageSize="pageSize"
        />
      </div>
    </div>
    
    <!-- Modal Thêm Ứng Viên -->
    <ManipulateCandidateDataModal 
       v-model="showAddModal" 
       :title="modalTitle" 
       @closeModal="showAddModal = false"
    />
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import Header from '@/components/candidatesComponents/Header.vue'
import ToolbarGrid from '@/components/candidatesComponents/ToolbarGrid.vue'
import BaseGridData from '@/components/base/baseGridData/GridData.vue'
import GridDataFooter from '@/components/base/baseGridData/GridDataFooter.vue'
import ManipulateCandidateDataModal from '@/components/base/baseModal/ManipulateCandidateDataModal.vue'
import { candidateService } from '@/services/candidateService'

const columns = [
  { key: 1, field: 'fullName', title: 'Họ và tên', width: '245px' },
  { key: 2, field: 'dob', title: 'Ngày sinh', width: '110px' },
  { key: 3, field: 'gender', title: 'Giới tính', width: '100px' },
  { key: 4, field: 'region', title: 'Khu vực', width: '150px' },
  { key: 5, field: 'phone', title: 'Số điện thoại', width: '150px' },
  { key: 6, field: 'email', title: 'Email', width: '200px' },
  { key: 7, field: 'country', title: 'Quốc gia', width: '150px' },
  { key: 8, field: 'city', title: 'Thành phố', width: '150px' },
  { key: 9, field: 'ward', title: 'Phường/Xã', width: '150px' },
  { key: 10, field: 'address', title: 'Địa chỉ', width: '200px' },
]

const currentPage = ref(1)
const pageSize = ref(25)
const searchKeyword = ref('')
const totalRecords = ref(0)
const tableData = ref([])

// Trạng thái của Modal Thêm Ứng viên
const showAddModal = ref(false)
const modalTitle = ref('')

const openAddModal = () => {
  modalTitle.value = 'Thêm ứng viên'
  showAddModal.value = true
}

const fetchCandidates = () => {
  const result = candidateService.getPaginated(
    currentPage.value,
    pageSize.value,
    searchKeyword.value
  )
  tableData.value = result.data
  totalRecords.value = result.totalRecords
}

const handleSearch = (keyword) => {
  searchKeyword.value = keyword
  currentPage.value = 1
}

watch([currentPage, pageSize, searchKeyword], fetchCandidates, {
  immediate: true,
})
</script>
<style lang="scss" scoped>
.candidate_list {
  padding: 0;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 0;

  &__content {
    flex: 1; //cho phần content chiếm toàn bộ không gian còn lại
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    padding: 24px;
  }

  &__grid_wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    background-color: #fff;
    /* Có thể thêm box-shadow / border radius nếu muốn container grid */
  }

  .grid_data_area {
    flex: 1; /* Để table lăn tự do, phần footer vẫn nằm ngang đáy */
    min-height: 0;
  }
}
</style>
