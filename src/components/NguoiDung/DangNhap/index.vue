<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2><i class="fas fa-sign-in-alt"></i> Đăng Nhập</h2>
        <p>Đăng nhập để truy cập thông tin dự báo thời tiết cá nhân hóa</p>
      </div>
      
      <form class="login-form">
        <div class="form-group">
          <label for="email"><i class="fas fa-envelope"></i> Email</label>
          <input 
            type="email" 
            id="email" 
            placeholder="Nhập địa chỉ email của bạn"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password"><i class="fas fa-lock"></i> Mật khẩu</label>
          <div class="password-input">
            <input 
              type="password" 
              id="password" 
              placeholder="Nhập mật khẩu của bạn"
              required
            />
            <button type="button" class="toggle-password">
              <i class="fas fa-eye"></i>
            </button>
          </div>
        </div>
        
        <div class="form-options">
          <div class="remember-me">
            <input type="checkbox" id="remember" />
            <label for="remember">Ghi nhớ đăng nhập</label>
          </div>
          <a href="#" class="forgot-password">Quên mật khẩu?</a>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn-login">
            <i class="fas fa-sign-in-alt"></i> Đăng Nhập
          </button>
        </div>
      </form>
      
      <div class="login-divider">
        <span>Hoặc đăng nhập với</span>
      </div>
      
      <div class="social-login">
        
          <GoogleLogin :callback="callback"/>
        <button class="btn-social btn-facebook">
          <i class="fab fa-facebook-f"></i> Facebook
        </button>
      </div>
      
      <div class="login-footer">
        <p>Chưa có tài khoản? <router-link to="/dang-ky">Đăng ký ngay</router-link></p>
      </div>
    </div>
    
    <div class="login-features">
      <div class="weather-preview">
        <h3><i class="fas fa-cloud-sun"></i> Dự báo thời tiết hôm nay</h3>
        <div class="weather-card">
          <div class="weather-icon">
            <i class="fas fa-sun"></i>
          </div>
          <div class="weather-info">
            <div class="location">Hà Nội</div>
            <div class="temperature">28°C</div>
            <div class="description">Nắng, ít mây</div>
            <div class="details">
              <span><i class="fas fa-tint"></i> 65%</span>
              <span><i class="fas fa-wind"></i> 12 km/h</span>
            </div>
          </div>
        </div>
        <p class="preview-message">Đăng nhập để xem dự báo chi tiết và cá nhân hóa</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { decodeCredential } from 'vue3-google-login'
export default {
  name: 'DangNhap',
  data() {
    return {
      
    }
  },

  methods: {
    callback(response) {
      var thong_Tin = decodeCredential(response.credential)
      var user = {
        'email': thong_Tin.email,
        'ho_ten': thong_Tin.name,
        'anhDaiDien': thong_Tin.imageUrl
      }
      axios
      .post('http://127.0.0.1:8000/api/nguoi-dung/dang-nhap-gg', user)
      .then(response => {
        if(response.data.status == 1){
          this.$toast.success('Đăng nhập thành công')
          this.$router.push('/')
        }else{
          this.$toast.error('Đăng nhập thất bại')
        }
      })
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  gap: 30px;
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.login-card {
  flex: 1;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.login-features {
  flex: 0 0 350px;
  display: flex;
  flex-direction: column;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #0056b3;
  font-size: 1.8rem;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.login-header p {
  color: #666;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
  transition: all 0.3s;
}

.form-group input:focus {
  border-color: #0056b3;
  box-shadow: 0 0 0 2px rgba(0, 86, 179, 0.2);
  outline: none;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 5px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
}

.remember-me label {
  font-weight: normal;
  color: #555;
}

.forgot-password {
  color: #0056b3;
  font-size: 14px;
  transition: color 0.3s;
}

.forgot-password:hover {
  text-decoration: underline;
}

.form-actions {
  margin-bottom: 25px;
}

.btn-login {
  width: 100%;
  padding: 14px;
  background-color: #0056b3;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-login:hover {
  background-color: #003d7a;
}

.login-divider {
  position: relative;
  text-align: center;
  margin: 25px 0;
}

.login-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #eee;
}

.login-divider span {
  position: relative;
  background-color: white;
  padding: 0 15px;
  color: #777;
  font-size: 14px;
}

.social-login {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
}

.btn-social {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-google {
  background-color: #fff;
  color: #333;
  border: 1px solid #ddd;
}

.btn-facebook {
  background-color: #1877f2;
  color: white;
}

.btn-google:hover {
  background-color: #f1f1f1;
}

.btn-facebook:hover {
  background-color: #0e5fca;
}

.login-footer {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.login-footer a {
  color: #0056b3;
  font-weight: 500;
}

.login-footer a:hover {
  text-decoration: underline;
}

/* Weather Preview */
.weather-preview {
  background: linear-gradient(135deg, #0056b3, #00a0e9);
  border-radius: 10px;
  padding: 25px;
  color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.weather-preview h3 {
  font-size: 1.3rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.weather-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.weather-icon {
  font-size: 3rem;
  color: #FFD700;
}

.weather-info {
  flex: 1;
}

.location {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 5px;
}

.temperature {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 5px;
}

.description {
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.details {
  display: flex;
  gap: 15px;
  font-size: 0.9rem;
}

.details span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.preview-message {
  margin-top: auto;
  text-align: center;
  font-style: italic;
  opacity: 0.9;
  font-size: 0.9rem;
  padding-top: 20px;
}

/* Responsive */
@media (max-width: 992px) {
  .login-container {
    flex-direction: column;
  }
  
  .login-features {
    flex: 1;
  }
}

@media (max-width: 576px) {
  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .social-login {
    flex-direction: column;
  }
}
</style>