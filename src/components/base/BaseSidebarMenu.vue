<template>
  <div class="sidebar_menu">
    <div
      v-for="item in items"
      :key="item.key"
      class="sidebar_menu__item"
      :class="{ 'sidebar_menu__item--active': activeKey === item.key }"
      :title="collapsed ? item.title : ''"
      @click="$emit('select', item)"
    >
      <div class="sidebar_menu__icon">
        <div class="icon" :class="item.iconClass"></div>
      </div>
      <span class="sidebar_menu__title">{{ item.title }}</span>
    </div>
  </div>
</template>
<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  activeKey: {
    type: String,
    default: '',
  },
  collapsed: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['select'])
</script>
<style lang="scss" scoped>
$primary-color: #2680eb;

.sidebar_menu {
  display: flex;
  flex-direction: column;

  &__item {
    box-sizing: border-box;
    color: #c5ccd5;
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 40px;
    padding: 8px 12px;
    border-radius: 4px;
    margin-left: 12px;
    margin-right: 12px;
    margin-bottom: 12px;
    cursor: pointer;
    transition:
      background-color 0.25s ease,
      margin 0.28s ease,
      padding 0.28s ease,
      gap 0.28s ease;

    &--active {
      background-color: $primary-color;
      color: #ffff !important;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    &--active:hover {
      background-color: $primary-color;
      color: #ffff !important;
    }
  }

  &__icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__title {
    color: inherit;
    font-size: 14px;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    opacity: 1;
    max-width: 140px;
    transform: translateX(0);
    transition:
      opacity 0.18s ease,
      max-width 0.28s ease,
      transform 0.28s ease;
  }
}

.sidebar_menu__item--active .icon {
  background-color: #ffff !important;
}

.sidebar_menu__item--active .icon_knowledge {
  background-color: unset !important;
}
</style>
