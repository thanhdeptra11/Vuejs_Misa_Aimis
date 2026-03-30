<template>
  <div class="main_layout">
    <Header class="main_layout--header" />
    <div class="main_layout--body">
      <Sidebar class="main_layout--sidebar" />
      <div class="main_layout--content">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script setup>
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'
</script>
<style lang="scss" scoped>
//Kích thước của header và sidebar
$header-height: 48px;
$sidebar-width: 233px;
//setup main layout
.main_layout {
  //Ép toàn bộ layout bằng 100% màn hình
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: hidden; //khóa scroll toàn màn hình

  &--header {
    height: $header-height;
    flex-shrink: 0; //chặn co header
  }
  &--body {
    position: relative;
    display: flex;
    flex: 1; //cho phần body chiếm toàn bộ không gian còn lại
    overflow: hidden; //khóa scroll body
    background: url(https://amisplatform.misacdn.net/images/imagesapps/recruit/background_default1.jpg);
    &::before {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 50%;
      z-index: 0;
      top: 0;
      left: 0;
      background: linear-gradient(rgba(0, 26, 62, 0.8) 0, rgba(255, 255, 255, 0) 50%);
    }
  }

  &--sidebar {
    width: $sidebar-width;
    flex-shrink: 0; //chặn co sidebar
    z-index: 1; //đẩy sidebar lên trên background
  }
  &--content {
    flex: 1; //cho phần content chiếm toàn bộ không gian còn lại
    z-index: 1; //đẩy content lên trên background
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
}
</style>
