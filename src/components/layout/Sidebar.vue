<template>
  <div class="sidebar" :class="{ 'sidebar--collapsed': isCollapsed }" :style="sidebarStyle">
    <div class="sidebar_item_list">
      <div class="sidebar_content">
        <BaseSidebarMenu
          :items="menuItems"
          :activeKey="activeKey"
          :collapsed="isCollapsed"
          @select="handleSelect"
        />
      </div>
    </div>
    <button class="sidebar_toggle" type="button" @click="toggleSidebar">
      <div class="sidebar_toggle_icon" :class="isCollapsed ? 'icon_right' : 'icon_left'"></div>
      <span class="sidebar_toggle_text">{{ isCollapsed ? '' : 'Thu gọn' }}</span>
    </button>
  </div>
</template>
<script setup>
import BaseSidebarMenu from '@/components/base/BaseSidebarMenu.vue'
import { computed, ref } from 'vue'

const EXPANDED_WIDTH = 233
const COLLAPSED_WIDTH = 72

const activeKey = ref('candidates')
const isCollapsed = ref(false)

const sidebarStyle = computed(() => ({
  width: `${isCollapsed.value ? COLLAPSED_WIDTH : EXPANDED_WIDTH}px`,
}))

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleSelect = (item) => {
  activeKey.value = item.key
}

const menuItems = [
  {
    key: 'news',
    title: 'Tin tuyển dụng',
    iconClass: 'icon_news_posting',
  },
  {
    key: 'candidates',
    title: 'Ứng viên',
    iconClass: 'icon_candidates',
  },
  {
    key: 'calendar',
    title: 'Lịch',
    iconClass: 'icon_calendar',
  },
  {
    key: 'potential',
    title: 'Kho tiềm năng',
    iconClass: 'icon_potential_candidates',
  },
  {
    key: 'campaign',
    title: 'Chiến dịch tuyển dụng',
    iconClass: 'icon_campaign',
  },
  {
    key: 'work',
    title: 'Công việc',
    iconClass: 'icon_work',
  },
  {
    key: 'aiMarketing',
    title: 'aiMarketing',
    iconClass: 'icon_aiMarketing',
  },
  {
    key: 'report',
    title: 'Báo cáo',
    iconClass: 'icon_report',
  },
  {
    key: 'setting',
    title: 'Thiết lập',
    iconClass: 'icon_setting',
  },
  {
    key: 'knowledge',
    title: 'Kiến thức hữu ích',
    iconClass: 'icon_knowledge',
  },
]
</script>
<style lang="scss" scoped>
.sidebar {
  position: relative;
  background-color: rgba(0, 0, 0, 0.6509803922);
  backdrop-filter: blur(14px);
  background-image: url(https://amisplatform.misacdn.net/apps/recruit2/event-sidebar.b836f9e63b28d1c0.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
  transition:
    width 0.28s ease,
    box-shadow 0.28s ease;

  &_item_list {
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    padding-top: 32px;
    padding-bottom: 72px;
    transition: padding 0.28s ease;
  }

  &_content {
    height: calc(100% - 56px);
  }

  &_toggle {
    position: absolute;
    bottom: 16px;
    left: 12px;
    height: 40px;
    width: 210px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    border: 1px solid #dee2e6 !important;
    padding: 8px;
    cursor: pointer;
    box-sizing: border-box;
    transition:
      width 0.28s ease,
      left 0.28s ease,
      background-color 0.28s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.18);
    }

    &_icon {
      background-color: #ffffff !important;
      flex-shrink: 0;
      transition: transform 0.28s ease;
    }

    &_text {
      margin-left: 12px;
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      opacity: 1;
      transform: translateX(0);
      transition:
        opacity 0.2s ease,
        transform 0.28s ease,
        margin 0.28s ease;
    }
  }

  &--collapsed {
    .sidebar_item_list {
      padding-top: 20px;
    }

    .sidebar_toggle {
      width: 48px;
      left: 8px;
      justify-content: center;
    }

    .sidebar_toggle_text {
      margin-left: 0;
      opacity: 0;
      transform: translateX(-8px);
      pointer-events: none;
    }
  }
}
</style>
