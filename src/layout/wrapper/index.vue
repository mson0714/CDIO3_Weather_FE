<template>
  <div class="header-wrapper">
    <!--start header -->
    <header>
      <div class="row">
        <div class="col-lg-12">
          <img class="img-fluid w-100" src="../../assets/images/products/MENU.png" />
        </div>
      </div>
      <nav class="navbar navbar-expand-lg bg-body-tertiary bg-primary">
        <div class="container-fluid">
          
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav">
              <li class="nav-item dropdown me-5">
                <a class="nav-link dropdown-toggle text-white "
                  style="font-size: 25px; font-family: 'Arial'; font-weight: bold;" href="#" role="button"
                  data-bs-toggle="dropdown" aria-expanded="false">
                  GIỚI THIỆU
                </a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Action</a></li>
                  <li><a class="dropdown-item" href="#">Another action</a></li>
                  <li><a class="dropdown-item" href="#">Something else here</a></li>
                </ul>
              </li>
              <li class="nav-item dropdown ms-5 me-5">
                <a class="nav-link dropdown-toggle text-white"
                  style="font-size: 25px; font-family: 'Arial'; font-weight: bold;" href="#" role="button"
                  data-bs-toggle="dropdown" aria-expanded="false">
                  THỜI TIẾT
                </a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Action</a></li>
                  <li><a class="dropdown-item" href="#">Another action</a></li>
                  <li><a class="dropdown-item" href="#">Something else here</a></li>
                </ul>
              </li>
              <li class="nav-item dropdown ms-5 me-5">
                <a class="nav-link dropdown-toggle text-white"
                  style="font-size: 25px; font-family: 'Arial'; font-weight: bold;" href="#" role="button"
                  data-bs-toggle="dropdown" aria-expanded="false">
                  LIÊN HỆ
                </a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Action</a></li>
                  <li><a class="dropdown-item" href="#">Another action</a></li>
                  <li><a class="dropdown-item" href="#">Something else here</a></li>
                </ul>
              </li>

              <li class="nav-item dropdown ms-5 me-5">
                <a class="nav-link dropdown-toggle text-white"
                  style="font-size: 25px; font-family: 'Arial'; font-weight: bold;" href="#" role="button"
                  data-bs-toggle="dropdown" aria-expanded="false">
                  DỊCH VỤ TƯ VẤN
                </a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Action</a></li>
                  <li><a class="dropdown-item" href="#">Another action</a></li>
                  <li><a class="dropdown-item" href="#">Something else here</a></li>
                </ul>
              </li>
              <div class="d-flex" role="search" style="margin-left: 150px;">
                <input class="form-control me-2 w-100"  type="search" placeholder="Search" aria-label="Search">
                <button class="btn btn-success " type="submit">Search</button>
              </div>
            </ul>
          </div>
        </div>
      </nav>
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
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css");
</style>
