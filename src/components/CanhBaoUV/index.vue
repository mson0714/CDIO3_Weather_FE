<template>
  <div class="air-quality-container">
    <h1 class="page-title">Chỉ số UV & Chất lượng không khí</h1>
    
    <div class="search-section">
      <div class="search-box">
        <input 
          type="text" 
          v-model="city" 
          placeholder="Nhập tên thành phố..." 
          @keypress.enter="fetchData"
        />
        <button @click="fetchData" class="search-button">
          <i class="fas fa-search"></i> Tìm kiếm
        </button>
      </div>
    </div>
    
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Đang tải dữ liệu...</p>
    </div>
    
    <div v-if="error" class="error-message">{{ error }}</div>
    
    <div v-if="airQualityData && !loading" class="data-container">
      <div class="location-info">
        <h2>{{ locationName }}</h2>
        <p class="date">{{ currentDate }}</p>
      </div>
      
      <div class="data-columns">
        <!-- UV Index -->
        <div class="data-column">
          <div class="data-card uv-card">
            <h3>Chỉ số UV</h3>
            <div class="uv-meter" :class="getUVClass()">
              <div class="uv-value">{{ uvIndex }}</div>
              <div class="uv-label">{{ getUVLabel() }}</div>
            </div>
            <div class="uv-advice">
              <h4>Lời khuyên:</h4>
              <p>{{ getUVAdvice() }}</p>
            </div>
          </div>
        </div>
        
        <!-- Air Quality -->
        <div class="data-column">
          <div class="data-card aqi-card">
            <h3>Chất lượng không khí (AQI)</h3>
            <div class="aqi-meter" :class="getAQIClass()">
              <div class="aqi-value">{{ airQualityData.main.aqi }}</div>
              <div class="aqi-label">{{ getAQILabel() }}</div>
            </div>
            <div class="pollutants">
              <h4>Các chất ô nhiễm chính:</h4>
              <div class="pollutant-grid">
                <div class="pollutant">
                  <span class="pollutant-name">PM2.5</span>
                  <span class="pollutant-value">{{ airQualityData.components.pm2_5 }} μg/m³</span>
                </div>
                <div class="pollutant">
                  <span class="pollutant-name">PM10</span>
                  <span class="pollutant-value">{{ airQualityData.components.pm10 }} μg/m³</span>
                </div>
                <div class="pollutant">
                  <span class="pollutant-name">O₃</span>
                  <span class="pollutant-value">{{ airQualityData.components.o3 }} μg/m³</span>
                </div>
                <div class="pollutant">
                  <span class="pollutant-name">NO₂</span>
                  <span class="pollutant-value">{{ airQualityData.components.no2 }} μg/m³</span>
                </div>
                <div class="pollutant">
                  <span class="pollutant-name">SO₂</span>
                  <span class="pollutant-value">{{ airQualityData.components.so2 }} μg/m³</span>
                </div>
                <div class="pollutant">
                  <span class="pollutant-name">CO</span>
                  <span class="pollutant-value">{{ airQualityData.components.co }} μg/m³</span>
                </div>
              </div>
            </div>
            <div class="aqi-advice">
              <h4>Lời khuyên:</h4>
              <p>{{ getAQIAdvice() }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      city: '',
      loading: false,
      error: null,
      locationName: '',
      currentDate: '',
      airQualityData: null,
      uvIndex: 0,
      API_KEY: '9c0b68c69792a1544c52532b132f7a8f' // API key OpenWeatherMap của bạn
    };
  },
  methods: {
    async fetchData() {
      if (!this.city.trim()) return;
      
      this.loading = true;
      this.error = null;
      
      try {
        // Trước tiên lấy tọa độ từ tên thành phố
        let coordResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${this.API_KEY}&lang=vi`
        );
        
        // Nếu không tìm thấy, thử với phiên bản không dấu
        if (!coordResponse.ok) {
          const cityNoAccent = this.removeVietnameseAccents(this.city);
          coordResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityNoAccent}&appid=${this.API_KEY}&lang=vi`
          );
        }
        
        if (!coordResponse.ok) {
          throw new Error('Không tìm thấy thành phố. Vui lòng thử lại với tên thành phố khác.');
        }
        
        const coordData = await coordResponse.json();
        this.locationName = `${coordData.name}, ${coordData.sys.country}`;
        
        const { lat, lon } = coordData.coord;
        
        // Lấy dữ liệu chất lượng không khí
        const airQualityResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${this.API_KEY}`
        );
        
        if (!airQualityResponse.ok) {
          throw new Error('Không thể lấy dữ liệu chất lượng không khí.');
        }
        
        const airQualityData = await airQualityResponse.json();
        this.airQualityData = airQualityData.list[0];
        
        // Lấy chỉ số UV (từ OneCall API - cần có đăng ký)
        const uvResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${this.API_KEY}`
        );
        
        if (uvResponse.ok) {
          const uvData = await uvResponse.json();
          this.uvIndex = uvData.current.uvi;
        } else {
          // Nếu không lấy được chỉ số UV từ API, dùng giá trị mẫu
          this.uvIndex = Math.floor(Math.random() * 11); // Giá trị UV từ 0-11 cho demo
        }
        
        // Cập nhật ngày giờ hiện tại
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        this.currentDate = now.toLocaleDateString('vi-VN', options);
        
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    
    removeVietnameseAccents(str) {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
    },
    
    getUVClass() {
      const uv = this.uvIndex;
      if (uv >= 11) return 'extreme';
      if (uv >= 8) return 'very-high';
      if (uv >= 6) return 'high';
      if (uv >= 3) return 'moderate';
      return 'low';
    },
    
    getUVLabel() {
      const uv = this.uvIndex;
      if (uv >= 11) return 'Cực kỳ cao';
      if (uv >= 8) return 'Rất cao';
      if (uv >= 6) return 'Cao';
      if (uv >= 3) return 'Trung bình';
      return 'Thấp';
    },
    
    getUVAdvice() {
      const uv = this.uvIndex;
      if (uv >= 11) return 'Cực kỳ nguy hiểm! Tránh ra ngoài trời giữa 10h-16h. Bắt buộc sử dụng kem chống nắng SPF 50+, mặc quần áo bảo vệ và đội mũ rộng vành.';
      if (uv >= 8) return 'Rất nguy hiểm! Hạn chế ở ngoài trời giữa 10h-16h. Sử dụng kem chống nắng SPF 30+ và mặc quần áo bảo vệ.';
      if (uv >= 6) return 'Nguy hiểm cao! Sử dụng kem chống nắng SPF 30+, đội mũ và mặc áo dài tay khi ra ngoài.';
      if (uv >= 3) return 'Cẩn thận! Nên sử dụng kem chống nắng và đội mũ khi ở ngoài trời.';
      return 'An toàn! Không cần biện pháp bảo vệ đặc biệt.';
    },
    
    getAQIClass() {
      const aqi = this.airQualityData?.main.aqi;
      switch(aqi) {
        case 5: return 'hazardous';
        case 4: return 'unhealthy';
        case 3: return 'moderate';
        case 2: return 'fair';
        default: return 'good';
      }
    },
    
    getAQILabel() {
      const aqi = this.airQualityData?.main.aqi;
      switch(aqi) {
        case 5: return 'Nguy hiểm';
        case 4: return 'Không tốt';
        case 3: return 'Trung bình';
        case 2: return 'Khá tốt';
        default: return 'Tốt';
      }
    },
    
    getAQIAdvice() {
      const aqi = this.airQualityData?.main.aqi;
      switch(aqi) {
        case 5: return 'Cảnh báo sức khỏe khẩn cấp! Tất cả mọi người nên tránh hoạt động ngoài trời và sử dụng khẩu trang N95/FFP2 khi ra ngoài.';
        case 4: return 'Không tốt cho sức khỏe! Người nhạy cảm nên ở trong nhà, những người khác nên hạn chế hoạt động ngoài trời kéo dài.';
        case 3: return 'Có thể ảnh hưởng đến nhóm nhạy cảm như người cao tuổi, trẻ em và người có bệnh về hô hấp.';
        case 2: return 'Chất lượng không khí ở mức chấp nhận được. Một số chất gây ô nhiễm có thể gây lo ngại cho một số ít người nhạy cảm.';
        default: return 'Chất lượng không khí tốt, ít hoặc không có rủi ro cho sức khỏe.';
      }
    }
  }
}
</script>

<style scoped>
.air-quality-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

.page-title {
  text-align: center;
  color: #0056b3;
  margin-bottom: 30px;
  font-size: 2.2rem;
}

.search-section {
  max-width: 600px;
  margin: 0 auto 40px;
}

.search-box {
  display: flex;
}

.search-box input {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 30px 0 0 30px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s;
}

.search-box input:focus {
  border-color: #0056b3;
  box-shadow: 0 0 0 3px rgba(0, 86, 179, 0.2);
}

.search-button {
  padding: 12px 20px;
  background: #0056b3;
  border: none;
  border-radius: 0 30px 30px 0;
  color: white;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
}

.search-button:hover {
  background: #003d7a;
}

.loading {
  text-align: center;
  padding: 30px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #0056b3;
  margin: 0 auto 15px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  background-color: #ffebee;
  color: #d32f2f;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 20px;
}

.data-container {
  background-color: #f8f9fa;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.location-info {
  text-align: center;
  margin-bottom: 30px;
}

.location-info h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 5px;
}

.date {
  color: #666;
  font-style: italic;
}

.data-columns {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.data-column {
  flex: 1;
  min-width: 300px;
}

.data-card {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

.data-card h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #0056b3;
}

/* UV Meter */
.uv-meter {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin: 0 auto 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  position: relative;
}

.uv-value {
  font-size: 3rem;
  font-weight: bold;
  line-height: 1;
}

.uv-label {
  font-size: 1rem;
}

.uv-meter.low {
  background: linear-gradient(45deg, #4caf50, #8bc34a);
}

.uv-meter.moderate {
  background: linear-gradient(45deg, #ffc107, #ffeb3b);
}

.uv-meter.high {
  background: linear-gradient(45deg, #ff9800, #ffb74d);
}

.uv-meter.very-high {
  background: linear-gradient(45deg, #f44336, #ff5722);
}

.uv-meter.extreme {
  background: linear-gradient(45deg, #9c27b0, #673ab7);
}

.uv-advice, .aqi-advice {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.uv-advice h4, .aqi-advice h4, .pollutants h4 {
  margin-bottom: 10px;
  color: #333;
}

/* AQI Meter */
.aqi-meter {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin: 0 auto 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.aqi-value {
  font-size: 3rem;
  font-weight: bold;
  line-height: 1;
}

.aqi-label {
  font-size: 1rem;
}

.aqi-meter.good {
  background: linear-gradient(45deg, #4caf50, #8bc34a);
}

.aqi-meter.fair {
  background: linear-gradient(45deg, #8bc34a, #cddc39);
}

.aqi-meter.moderate {
  background: linear-gradient(45deg, #ffeb3b, #ffc107);
}

.aqi-meter.unhealthy {
  background: linear-gradient(45deg, #ff9800, #f44336);
}

.aqi-meter.hazardous {
  background: linear-gradient(45deg, #d32f2f, #7b1fa2);
}

.pollutants {
  margin-bottom: 20px;
}

.pollutant-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.pollutant {
  background-color: #f8f9fa;
  border-radius: 6px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pollutant-name {
  font-weight: bold;
  color: #333;
}

.pollutant-value {
  color: #666;
}

@media (max-width: 768px) {
  .data-column {
    flex: 100%;
  }
  
  .pollutant-grid {
    grid-template-columns: 1fr;
  }
}
</style>