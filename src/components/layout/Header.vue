<template>
  <header class="header">
    <div class="header--left">
      <!-- div pattern -->
      <div class="header--left_pattern"></div>
      <div class="icon icon_app_switcher"></div>
      <div class="header--brand">
        <div class="icon icon_logo_tuyendung"></div>
        <span class="header--brand_name">Tuyển dụng</span>
      </div>
      <BaseHeaderSearch
        placeholder="TÌm kiếm tin tuyển dụng, ứng viên, nhân tài..."
        class="header--search"
      />
    </div>
    <div class="header--right">
      <div class="recruitment_page_redirect">
        <div class="icon icon_global"></div>
        <span>Website tuyển dụng</span>
      </div>
      <div class="icon icon_speaker"></div>
      <div class="icon icon_cart"></div>
      <BaseHeaderIconGroup class="header--right_icon_group" />
      <BaseAvatarHeader src="" alt="User Avatar" name="John Doe" />
    </div>
  </header>
</template>
<script setup>
import BaseHeaderSearch from '../base/BaseHeaderSearch.vue'
import BaseHeaderIconGroup from '../base/BaseHeaderIconGroup.vue'
import BaseAvatarHeader from '../base/BaseAvatarHeader.vue'
</script>
<style lang="scss" scoped>
$primary-color: #2680eb;
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding-right: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  color: #1e2633;
  &--left {
    position: relative;
    height: 100%;
    padding-left: 16px;
    display: flex;
    align-items: center;
    gap: 20px;
    background-image: url(https://amisplatform.misacdn.net/apps/recruit/navbar-bg-event.7d974ba87d2e462e.svg);
    background-repeat: no-repeat;
    flex-shrink: 0; //chặn co header left
    &_pattern {
      position: absolute;
      width: 210px;
      height: 48px;
      background-image: url(https://amisplatform.misacdn.net/apps/recruit/event-header.0e849439aff9dcfd.png);
      background-repeat: no-repeat;
      background-size: contain;
      top: 0;
      left: 1px;
    }
  }
  &--brand {
    display: flex;
    align-items: center;
    gap: 8px;
    &_name {
      font-size: 18px;
      font-weight: 700;
      color: #1f1f1f;
      margin-left: 8px;
      margin-right: 8px;
    }
  }
  &--right {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-right: 14px;
    color: #1e2633;
    height: 48px;
    .recruitment_page_redirect {
      margin-right: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      font-weight: 400;
    }
    // hover vào recruitment_page_redirect thì đổi màu chữ và icon
    .recruitment_page_redirect:hover {
      cursor: pointer;
      color: $primary-color;
      .icon_global {
        background-color: $primary-color;
      }
    }
  }
}
.icon_speaker {
  margin-right: 8px;
}
</style>
