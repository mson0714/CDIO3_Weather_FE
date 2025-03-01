<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h2><i class="fas fa-user-plus"></i> Đăng Ký Tài Khoản</h2>
        <p>Đăng ký để nhận thông tin dự báo thời tiết hàng ngày</p>
      </div>
      
      <form class="register-form">
        <div class="form-group">
          <label for="fullname"><i class="fas fa-user"></i> Họ và tên</label>
          <input 
            type="text" 
            id="fullname" 
            placeholder="Nhập họ và tên của bạn"
            required
          />
        </div>
        
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
          <label for="phone"><i class="fas fa-phone"></i> Số điện thoại</label>
          <input 
            type="tel" 
            id="phone" 
            placeholder="Nhập số điện thoại của bạn"
            required
          />
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="password"><i class="fas fa-lock"></i> Mật khẩu</label>
            <div class="password-input">
              <input 
                type="password" 
                id="password" 
                placeholder="Nhập mật khẩu"
                required
              />
              <button type="button" class="toggle-password">
                <i class="fas fa-eye"></i>
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label for="confirm-password"><i class="fas fa-lock"></i> Xác nhận mật khẩu</label>
            <div class="password-input">
              <input 
                type="password" 
                id="confirm-password" 
                placeholder="Nhập lại mật khẩu"
                required
              />
              <button type="button" class="toggle-password">
                <i class="fas fa-eye"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="location"><i class="fas fa-map-marker-alt"></i> Địa điểm</label>
          <select id="location" required>
            <option value="" disabled selected>Chọn thành phố của bạn</option>
            <option value="hanoi">Hà Nội</option>
            <option value="danang">Đà Nẵng</option>
            <option value="hcm">TP. Hồ Chí Minh</option>
            <option value="hue">Huế</option>
            <option value="cantho">Cần Thơ</option>
            <option value="other">Khác</option>
          </select>
        </div>
        
        <div class="form-group checkbox-group">
          <input type="checkbox" id="terms" required />
          <label for="terms">Tôi đồng ý với <a href="#">Điều khoản sử dụng</a> và <a href="#">Chính sách bảo mật</a></label>
        </div>
        
        <div class="form-group checkbox-group">
          <input type="checkbox" id="newsletter" />
          <label for="newsletter">Tôi muốn nhận thông tin dự báo thời tiết qua email</label>
        </div>
        
        <div class="form-actions">
          <button v-on:click="dangKy()" type="submit" class="btn-register">
            <i class="fas fa-user-plus"></i> Đăng Ký
          </button>
        </div>
      </form>
      
      <div class="register-footer">
        <p>Đã có tài khoản? <router-link to="/dang-nhap">Đăng nhập ngay</router-link></p>
        <div class="social-login">
          <p>Hoặc đăng ký với</p>
          <div class="social-buttons">
            <button class="btn-social btn-google">
              <i class="fab fa-google"></i> Google
            </button>
            <button class="btn-social btn-facebook">
              <i class="fab fa-facebook-f"></i> Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="register-benefits">
      <div class="benefits-header">
        <h3>Lợi ích khi đăng ký tài khoản</h3>
      </div>
      <ul class="benefits-list">
        <li>
          <i class="fas fa-bell"></i>
          <div>
            <h4>Thông báo thời tiết</h4>
            <p>Nhận thông báo kịp thời về thay đổi thời tiết và cảnh báo nguy hiểm</p>
          </div>
        </li>
        <li>
          <i class="fas fa-map-marked-alt"></i>
          <div>
            <h4>Dự báo theo vị trí</h4>
            <p>Nhận dự báo thời tiết chính xác cho vị trí của bạn</p>
          </div>
        </li>
        <li>
          <i class="fas fa-history"></i>
          <div>
            <h4>Lịch sử tra cứu</h4>
            <p>Lưu lại lịch sử tra cứu thời tiết của bạn</p>
          </div>
        </li>
        <li>
          <i class="fas fa-cloud-download-alt"></i>
          <div>
            <h4>Tải xuống báo cáo</h4>
            <p>Tải xuống báo cáo thời tiết chi tiết dưới dạng PDF</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DangKy',
  methods: {
    dangKy() {
      console.log('dang ky');
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.register-card {
  flex: 1;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.register-benefits {
  flex: 0 0 350px;
  background: linear-gradient(135deg, #0056b3, #00a0e9);
  border-radius: 10px;
  padding: 30px;
  color: white;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h2 {
  color: #0056b3;
  font-size: 1.8rem;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.register-header p {
  color: #666;
}

.register-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-row .form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
  display: flex;
  align-items: center;
  gap: 8px;
}

input[type="text"],
input[type="email"],
input[type="tel"],
input[type="password"],
select {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus,
select:focus {
  border-color: #0056b3;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 86, 179, 0.1);
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

.checkbox-group {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.checkbox-group input[type="checkbox"] {
  margin-top: 3px;
}

.checkbox-group label {
  margin-bottom: 0;
  font-weight: normal;
}

.checkbox-group a {
  color: #0056b3;
  text-decoration: underline;
}

.form-actions {
  margin-top: 30px;
}

.btn-register {
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

.btn-register:hover {
  background-color: #003d7a;
}

.register-footer {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.register-footer p {
  margin-bottom: 15px;
  color: #666;
}

.register-footer a {
  color: #0056b3;
  font-weight: 500;
}

.social-login p {
  margin-bottom: 10px;
  color: #666;
}

.social-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn-social {
  flex: 1;
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
  max-width: 150px;
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

/* Benefits Section */
.benefits-header {
  margin-bottom: 20px;
}

.benefits-header h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.benefits-list {
  list-style: none;
  padding: 0;
}

.benefits-list li {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 8px;
}

.benefits-list i {
  font-size: 1.5rem;
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
}

.benefits-list h4 {
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.benefits-list p {
  font-size: 0.9rem;
  opacity: 0.9;
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 992px) {
  .register-container {
    flex-direction: column;
  }
  
  .register-benefits {
    flex: 1;
    position: static;
  }
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .social-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-social {
    max-width: 200px;
    width: 100%;
  }
}
</style>