<template>
  <div class="header-wrapper">
    <!--start header -->
    <header>
      <div class="topbar d-flex align-items-center">
        <nav class="navbar navbar-expand bg-primary">
          <div class="topbar-logo-header">
            <div class="">
              <img src="https://thoitiet24h.vn/imgs/weather_today/tt24h_doc.svg" 
              class="img-fluid logo-icon" style="width: 60px;" alt="logo icon" />
            </div>
            <div class="">
              <h4 class="logo-text text-white">DỰ BÁO THỜI TIẾT</h4>
            </div>
          </div>
          <div class="mobile-toggle-menu"><i class="bx bx-menu"></i></div>
          <div class="search-bar flex-grow-1">
            <div class="position-relative search-bar-box">
              <input type="text" class="form-control search-control" placeholder="Tìm Kiếm" />
              <span class="position-absolute top-50 search-show translate-middle-y"><i class="bx bx-search"></i></span>
              <span class="position-absolute top-50 search-close translate-middle-y"><i class="bx bx-x"></i></span>
            </div>
          </div>
        </nav>
      </div>
    </header>
    <!--end header -->
    <!--navigation-->
    
    <!--end navigation-->
  </div>
  <!--end header wrapper-->
  <!--start page wrapper -->
  <div class="page-wrapper">
    <router-view></router-view>
  </div>
  <div class="overlay toggle-icon">
    <!--end overlay-->
    <!--Start Back To Top Button-->
    <a href="javaScript:;" class="back-to-top"><i class="bx bxs-up-arrow-alt"></i></a>
    <!--End Back To Top Button-->
    <footer class="page-footer">
      <p class="mb-0">Copyright © 2021. All right reserved.</p>
    </footer>
  </div>
</template>
<script>
import "../../assets/js/bootstrap.bundle.min.js";
import "../../assets/js/jquery.min.js";
import "../../assets/plugins/simplebar/js/simplebar.min.js";
import "../../assets/plugins/metismenu/js/metisMenu.min.js";
import "../../assets/js/index.js";
import "../../assets/js/app.js";
export default {};
</script>
<style>
@import "../../assets/plugins/vectormap/jquery-jvectormap-2.0.2.css";
@import "../../assets/plugins/simplebar/css/simplebar.css";
@import "../../assets/plugins/perfect-scrollbar/css/perfect-scrollbar.css";
@import "../../assets/plugins/metismenu/css/metisMenu.min.css";
@import "../../assets/css/bootstrap.min.css";
@import "../../assets/css/bootstrap-extended.css";
@import "../../assets/css/app.css";
@import "../../assets/css/icons.css";
@import "../../assets/css/dark-theme.css";
@import "../../assets/css/semi-dark.css";
@import "../../assets/css/header-colors.css";
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css');
</style>