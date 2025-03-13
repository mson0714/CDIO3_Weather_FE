<template>
  <div class="weather-app">
    <!-- Header -->
    <header class="header">
      <div class="header-top">
        <div class="container">
          <div class="header-content">
            <div class="logo">
              <router-link to="/">
                <div class="logo-container">
                  <img src="https://files02.duytan.edu.vn/svruploads/dtu-duytan/upload/images/logoDT-70.png" alt="Logo" />
                  <span>DỰ BÁO THỜI TIẾT</span>
                </div>
              </router-link>
            </div>
            
            <div class="search">
              <input type="text" placeholder="Tìm kiếm thông tin thời tiết..." />
              <button><i class="fas fa-search"></i></button>
            </div>
            
            <!-- Thay đổi phần auth-buttons để hiển thị thông tin người dùng khi đã đăng nhập -->
            <div v-if="isLoggedIn" class="user-profile">
              <div class="user-profile-dropdown">
                <div class="user-info" @click="toggleDropdown">
                  <img :src="userInfo.anhDaiDien || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg'" alt="Avatar" class="user-avatar" />
                  <span class="user-name">{{ userInfo.ho_ten }}</span>
                  <i class="fas fa-chevron-down"></i>
                </div>
                <div class="user-dropdown-menu" v-show="showUserMenu">
                  <div class="user-dropdown-header">
                    <img :src="userInfo.anhDaiDien || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg'" alt="Avatar" class="dropdown-avatar" />
                    <div>
                      <div class="dropdown-name">{{ userInfo.ho_ten }}</div>
                      <div class="dropdown-email">{{ userInfo.email }}</div>
                    </div>
                  </div>
                  <div class="dropdown-divider"></div>
                  <ul class="dropdown-menu-items">
                    <li><router-link to="/thong-tin-ca-nhan"><i class="fas fa-user"></i> Thông tin cá nhân</router-link></li>
                    <li><router-link to="/theo-doi-thoi-tiet"><i class="fas fa-cloud"></i> Theo dõi thời tiết</router-link></li>
                    <li><router-link to="/cai-dat"><i class="fas fa-cog"></i> Cài đặt</router-link></li>
                    <li><a href="#" @click.prevent="logout"><i class="fas fa-sign-out-alt"></i> Đăng xuất</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div v-else class="auth-buttons">
              <router-link to="/dang-nhap" class="btn-auth btn-login">
                <i class="fas fa-sign-in-alt"></i> Đăng nhập
              </router-link>
              <router-link to="/dang-ky" class="btn-auth btn-register">
                <i class="fas fa-user-plus"></i> Đăng ký
              </router-link>
            </div>
            
          </div>
        </div>
      </div>
      
      <nav class="main-nav">
        <div class="container">
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/" class="nav-link"><i class="fa-solid fa-house text-white"></i> TRANG CHỦ</router-link>
            </li>
            <li class="nav-item ">
              <a href="/du-bao-thoi-tiet" class="nav-link"> <i class="fa-solid fa-cloud-sun-rain"></i> DỰ ĐOÁN BẰNG AI </a>
            </li>
            <li class="nav-item dropdown">
              <a href="/thoi-tiet" class="nav-link"><i class="fa-solid fa-cloud text-white"></i> THỜI TIẾT </a>
              
            </li>
            <li class="nav-item">
              <router-link to="/canh-bao/lu-lut" class="nav-link"><i class="fa-solid fa-house-flood-water"></i> CẢNH BÁO LŨ LỤT</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/thoi-tiet/10-ngay" class="nav-link"><i class="fa-solid fa-calendar-days"></i> THỜI TIẾT 10 NGÀY</router-link>
            </li> 
            <li class="nav-item dropdown">
              <a href="#" class="nav-link"><i class="fa-solid fa-cloud text-white"></i> CÁC CHỨC NĂNG KHÁC <i class="fas fa-angle-down"></i></a>
              <ul class="dropdown-menu nav-primary">
             
                <li><router-link to="/chat-luong-khong-khi"><b><i class="fa-solid fa-wind"></i> Chất lượng không khí</b></router-link></li>
                <li><router-link to="/tin-tuc"><b><i class="fa-solid fa-newspaper"></i> Tin tức</b></router-link></li>
                <li><router-link to="/ban-do"> <i class="fa-solid fa-map-location-dot"></i> <b>Bản đồ</b></router-link></li>
              </ul>
            </li>
            
          </ul>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="main">
      <div class="container">
        <slot></slot>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-about">
            <h3>TRUNG TÂM DỰ BÁO THỜI TIẾT</h3>
            <p>Cung cấp thông tin dự báo thời tiết chính xác, kịp thời và đáng tin cậy.</p>
            <div class="contact-info">
              <p><i class="fas fa-map-marker-alt"></i> Đại học duy tân - Đà nẵng</p>
              <p><i class="fas fa-phone"></i> 0876070104 </p>
              <p><i class="fas fa-envelope"></i> trinhminhson2004@gmail.com</p>
            </div>
          </div>
          
          <div class="footer-links">
            <h4>LIÊN KẾT NHANH</h4>
            <ul>
              <li><router-link to="/">Trang chủ</router-link></li>
              <li><router-link to="/du-bao-thoi-tiet">Dự đoán bằng AI</router-link></li>
              <li><router-link to="/thoi-tiet">Thời tiết</router-link></li>
              <li><router-link to="/ban-do">Bản đồ</router-link></li>
              <li><router-link to="/tin-tuc">Tin tức</router-link></li>
            </ul>
          </div>
          
          <div class="footer-subscribe">
            <h4>ĐĂNG KÝ NHẬN TIN</h4>
            <p>Nhận thông tin dự báo thời tiết hàng ngày qua email</p>
            <div class="subscribe-form">
              <input type="email" placeholder="Email của bạn" />
              <button>Đăng ký</button>
            </div>
            <div class="social-links">
              <a href="https://www.facebook.com/khunglongbaochuatapmuabale"><i class="fab fa-facebook-f"></i></a>
              <a href="#"><i class="fab fa-twitter"></i></a>
              <a href="#"><i class="fab fa-youtube"></i></a>
              <a href="#"><i class="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2024 Mô hình dự đoán thời tiết CDIO 3. Minh Son - Trần Lãnh.</p>
        </div>
      </div>
    </footer>
    
    <!-- Back to top button -->
    <div class="back-to-top">
      <a href="#"><i class="fas fa-arrow-up"></i></a>
    </div>
    
    <!-- Chat Bot Container -->
    <div id="coze-chat-container"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false,
      userInfo: {
        ho_ten: '',
        email: '',
        anhDaiDien: ''
      },
      showUserMenu: false
    }
  },
  
    // Thêm phương thức này ở phần created của wrapper
  created() {
    this.checkUserLoggedIn();
    
    // Thêm sự kiện lắng nghe thay đổi localStorage
    window.addEventListener('storage', this.handleStorageChange);
    
    // Thêm sự kiện lắng nghe custom event
    window.addEventListener('user-logged-in', this.checkUserLoggedIn);
    
    // Thêm event listener để đóng dropdown khi click ra ngoài
    document.addEventListener('click', this.closeDropdownOnClickOutside);
  },
  
  // Và thêm ở phần beforeDestroy/unmounted để dọn dẹp
  beforeDestroy() { // hoặc unmounted() trong Vue 3
    window.removeEventListener('storage', this.handleStorageChange);
    window.removeEventListener('user-logged-in', this.checkUserLoggedIn);
    document.removeEventListener('click', this.closeDropdownOnClickOutside);
  },
  
  methods: {
        checkUserLoggedIn() {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          this.userInfo = JSON.parse(userData);
          this.isLoggedIn = true;
          console.log('User logged in:', this.userInfo); // Debug
        } catch (error) {
          console.error('Lỗi khi phân tích dữ liệu người dùng:', error);
          this.logout();
        }
      } else {
        this.isLoggedIn = false;
        this.userInfo = {
          ho_ten: '',
          email: '',
          anhDaiDien: ''
        };
        console.log('No user data found'); // Debug
      }
    },
    
    toggleDropdown(event) {
      event.stopPropagation();
      this.showUserMenu = !this.showUserMenu;
    },
    
    closeDropdownOnClickOutside(event) {
      const userProfileDropdown = this.$el.querySelector('.user-profile-dropdown');
      if (userProfileDropdown && !userProfileDropdown.contains(event.target)) {
        this.showUserMenu = false;
      }
    },
        // Thêm vào phần methods
    handleStorageChange(event) {
      if (event.key === 'user') {
        this.checkUserLoggedIn();
      }
    },
        logout() {
      localStorage.removeItem('user');
      localStorage.removeItem('token_khach_hang');
      
      this.isLoggedIn = false;
      this.userInfo = {
        ho_ten: '',
        email: '',
        anhDaiDien: ''
      };
      this.showUserMenu = false;
      
      // Chuyển hướng về trang chủ sau khi đăng xuất
      if (this.$route.path !== '/') {
        this.$router.push('/');
      }
      
      // Tùy chọn: Làm mới trang
      // window.location.reload();
    },
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.user-profile {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: rgba(0, 86, 179, 0.1);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #0056b3;
}

.user-name {
  font-weight: 500;
  color: #333;
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 280px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  margin-top: 10px;
  overflow: hidden;
}

.user-dropdown-header {
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: #f8f9fa;
}

.dropdown-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #0056b3;
}

.dropdown-name {
  font-weight: 600;
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
}

.dropdown-email {
  font-size: 13px;
  color: #666;
  word-break: break-all;
}

.dropdown-divider {
  height: 1px;
  background-color: #eee;
  margin: 0;
}

.dropdown-menu-items {
  list-style: none;
  padding: 10px 0;
}

.dropdown-menu-items li a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  color: #333;
  transition: background-color 0.3s;
}

.dropdown-menu-items li a:hover {
  background-color: #f5f5f5;
}

.dropdown-menu-items li a i {
  width: 20px;
  color: #0056b3;
}
body {
  font-family: 'Roboto', sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
}
.dropdown-menu {
    min-width: 250px; /* Điều chỉnh độ rộng */
    padding: 10px 20px; /* Tăng padding để dài hơn */
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

a {
  text-decoration: none;
  color: inherit;
}

ul {
  list-style: none;
}

/* Header Styles */
.header {
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-top {
  padding: 15px 0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.logo {
  flex: 0 0 auto;
}

.logo-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.logo img {
  height: 40px;
  width: 40px;
  margin-right: 12px;
}

.logo span {
  font-size: 18px;
  font-weight: 700;
  color: #0056b3;
  letter-spacing: 1px;
}

.search {
  flex: 1;
  max-width: 500px;
  margin: 0 20px;
  position: relative;
}

.search input {
  width: 100%;
  padding: 10px 40px 10px 15px;
  border: 1px solid #ddd;
  border-radius: 30px;
  font-size: 14px;
  transition: all 0.3s;
}

.search input:focus {
  border-color: #0056b3;
  box-shadow: 0 0 0 2px rgba(0, 86, 179, 0.2);
  outline: none;
}

.search button {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #0056b3;
  font-size: 16px;
  cursor: pointer;
  padding: 8px;
}

.auth-buttons {
  display: flex;
  gap: 10px;
  flex: 0 0 auto;
}

.btn-auth {
  padding: 8px 15px;
  border-radius: 5px;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s;
}

.btn-login {
  background-color: transparent;
  color: #0056b3;
  border: 1px solid #0056b3;
}

.btn-register {
  background-color: #0056b3;
  color: white;
  border: 1px solid #0056b3;
}

.btn-login:hover {
  background-color: rgba(0, 86, 179, 0.1);
}

.btn-register:hover {
  background-color: #003d7a;
}

/* Navigation Styles */
.main-nav {
  background-color: #0056b3;
  color: white;
}

.nav-list {
  display: flex;
  justify-content: space-between;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: block;
  padding: 15px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: #003d7a;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 200px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s;
  z-index: 100;
}

.nav-item:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-menu li a {
  display: block;
  padding: 10px 15px;
  color: #333;
  transition: background-color 0.3s;
}

.dropdown-menu li a:hover {
  background-color: #f5f5f5;
}

/* Main Content Styles */
.main {
  padding: 30px 0;
  min-height: 500px;
}

/* Footer Styles */
.footer {
  background-color: #222;
  color: #fff;
  padding: 50px 0 20px;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
}

.footer h3, .footer h4 {
  color: #fff;
  margin-bottom: 20px;
  font-weight: 500;
}

.contact-info p {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.contact-info i {
  margin-right: 10px;
  color: #0056b3;
}

.footer-links ul li {
  margin-bottom: 10px;
}

.footer-links ul li a {
  transition: color 0.3s;
}

.footer-links ul li a:hover {
  color: #0056b3;
}

.subscribe-form {
  display: flex;
  margin-bottom: 15px;
}

.subscribe-form input {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px 0 0 4px;
}

.subscribe-form button {
  padding: 10px 15px;
  background: #0056b3;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.social-links {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: #333;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.social-links a:hover {
  background-color: #0056b3;
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #444;
}

/* Back to top button */
.back-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 99;
}

.back-to-top a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #0056b3;
  color: white;
  border-radius: 50%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s;
}

.back-to-top a:hover {
  background-color: #003d7a;
}

/* Chat container */
#coze-chat-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 98;
}

/* Responsive styles */
@media (max-width: 992px) {
  .header-content {
    flex-wrap: wrap;
    gap: 15px;
  }
  
  .search {
    order: 3;
    max-width: 100%;
    margin: 10px 0 0;
    flex: 0 0 100%;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: center;
  }
  
  .logo {
    margin-bottom: 15px;
  }
  
  .auth-buttons {
    margin-top: 15px;
  }
  
  .nav-list {
    flex-direction: column;
  }
  
  .dropdown-menu {
    position: static;
    width: 100%;
    opacity: 1;
    visibility: visible;
    transform: none;
    box-shadow: none;
    display: none;
  }
  
  .nav-item:hover .dropdown-menu {
    display: block;
  }
  
  .footer-grid {
    grid-template-columns: 1fr;
  }
}
</style>
