<template>
  <div class="weather-container">
    <h1 class="weather-title">Weather Forecast</h1>
    
    <div class="search-box">
      <input 
        type="text" 
        class="search-input" 
        placeholder="Nhập tên thành phố" 
        v-model="city" 
        @keypress.enter="getWeather"
      />
      <button class="search-button" @click="getWeather">
        <i class="fas fa-search"></i> Tìm kiếm
      </button>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Đang tải dữ liệu...</p>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="weatherData && !loading" class="weather-info">
      <div class="location">
        <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
        <p class="date">{{ getCurrentDate() }}</p>
      </div>
      
      <div class="weather-details">
        <div class="temperature-container">
          <div class="temperature">
            <h1>{{ Math.round(weatherData.main.temp) }}°C</h1>
            <p class="feels-like">Cảm giác như: {{ Math.round(weatherData.main.feels_like) }}°C</p>
          </div>
          <div class="weather-icon">
            <img :src="`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`" :alt="weatherData.weather[0].description" />
            <p>{{ weatherData.weather[0].description }}</p>
          </div>
        </div>
        
        <div class="additional-info">
          <div class="info-item">
            <i class="fas fa-tint"></i>
            <span>Độ ẩm: {{ weatherData.main.humidity }}%</span>
          </div>
          <div class="info-item">
            <i class="fas fa-wind"></i>
            <span>Gió: {{ weatherData.wind.speed }} m/s</span>
          </div>
          <div class="info-item">
            <i class="fas fa-cloud"></i>
            <span>Mây: {{ weatherData.clouds.all }}%</span>
          </div>
        </div>
      </div>

      <!-- Thêm phần dự báo thời tiết 5 ngày -->
      <div v-if="forecastData && forecastData.length > 0" class="forecast-container">
        <h3>Dự báo 5 ngày tới</h3>
        <div class="forecast-items">
          <div v-for="(forecast, index) in forecastData" :key="index" class="forecast-item">
            <p class="forecast-date">{{ formatDay(forecast.dt) }}</p>
            <img :src="`http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`" :alt="forecast.weather[0].description" />
            <p class="forecast-temp">{{ Math.round(forecast.main.temp) }}°C</p>
            <p class="forecast-desc">{{ forecast.weather[0].description }}</p>
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
      weatherData: null,
      forecastData: null, // Thêm biến forecastData để lưu trữ dự báo 5 ngày
      loading: false,
      error: null,
      API_KEY: '9c0b68c69792a1544c52532b132f7a8f' // Thay thế bằng API key của OpenWeatherMap
    }
  },
  methods: {
    // Hàm chuyển đổi tiếng Việt có dấu sang không dấu
    removeVietnameseAccents(str) {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
    },
    
    async getWeather() {
      if (!this.city.trim()) return;
      
      this.loading = true;
      this.error = null;
      
      try {
        // Thử tìm kiếm với cả ký tự tiếng Việt gốc
        let response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&appid=${this.API_KEY}&lang=vi`
        );
        
        let cityToUse = this.city;
        
        // Nếu không tìm thấy, thử tìm kiếm với phiên bản không dấu
        if (!response.ok) {
          cityToUse = this.removeVietnameseAccents(this.city);
          response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityToUse}&units=metric&appid=${this.API_KEY}&lang=vi`
          );
        }
        
        if (!response.ok) {
          throw new Error('Không tìm thấy thành phố. Vui lòng thử lại với tên thành phố khác.');
        }
        
        const data = await response.json();
        this.weatherData = data;
        
        // Lấy dữ liệu dự báo 5 ngày
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${cityToUse}&units=metric&appid=${this.API_KEY}&lang=vi`
        );
        
        if (forecastResponse.ok) {
          const forecastData = await forecastResponse.json();
          this.forecastData = this.processForecastData(forecastData.list);
        } else {
          this.forecastData = null;
        }
      } catch (error) {
        this.error = error.message;
        this.weatherData = null;
        this.forecastData = null;
      } finally {
        this.loading = false;
      }
    },
    
    // Xử lý dữ liệu dự báo để lấy một điểm dự báo mỗi ngày
    processForecastData(forecastList) {
      const dailyForecasts = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Dùng Map để đảm bảo mỗi ngày chỉ lấy một điểm dữ liệu
      const forecastMap = new Map();
      
      forecastList.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toDateString();
        
        // Bỏ qua dữ liệu của ngày hiện tại
        if (date.getDate() === today.getDate() && date.getMonth() === today.getMonth()) {
          return;
        }
        
        // Lưu trữ dữ liệu cho thời gian gần 12:00 (trưa)
        if (!forecastMap.has(dateKey) || 
            Math.abs(date.getHours() - 12) < Math.abs(new Date(forecastMap.get(dateKey).dt * 1000).getHours() - 12)) {
          forecastMap.set(dateKey, item);
        }
      });
      
      // Chuyển Map thành mảng và giới hạn 5 ngày
      forecastMap.forEach(value => {
        dailyForecasts.push(value);
      });
      
      return dailyForecasts.slice(0, 5);
    },
    
    formatDay(timestamp) {
      const date = new Date(timestamp * 1000);
      const options = { weekday: 'short', day: 'numeric', month: 'numeric' };
      return date.toLocaleDateString('vi-VN', options);
    },
    
    getCurrentDate() {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return now.toLocaleDateString('vi-VN', options);
    }
  }
}
</script>

<style>
.weather-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 15px;
  background-color: #f8f9fa;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
}

.weather-title {
  color: #3a7bd5;
  text-align: center;
  margin-bottom: 20px;
  font-size: 2rem;
}

.search-box {
  display: flex;
  margin-bottom: 30px;
}

.search-input {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 30px 0 0 30px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s;
}

.search-input:focus {
  border-color: #3a7bd5;
  box-shadow: 0 0 0 3px rgba(58, 123, 213, 0.2);
}

.search-button {
  padding: 12px 20px;
  background: linear-gradient(to right, #3a7bd5, #00d2ff);
  border: none;
  border-radius: 0 30px 30px 0;
  color: white;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
}

.search-button:hover {
  background: linear-gradient(to right, #2a6ac5, #00b2df);
}

.loading {
  text-align: center;
  padding: 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #3a7bd5;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  color: #e74c3c;
  text-align: center;
  padding: 15px;
  background-color: #ffeaea;
  border-radius: 8px;
  margin-bottom: 20px;
}

.weather-info {
  background: linear-gradient(to bottom right, #ffffff, #f0f8ff);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.location {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.date {
  color: #666;
  font-style: italic;
  margin-top: 5px;
}

.temperature-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 25px;
}

.temperature {
  text-align: center;
  margin-right: 30px;
}

.temperature h1 {
  font-size: 4rem;
  margin: 0;
  color: #3a7bd5;
}

.feels-like {
  color: #666;
  margin-top: 5px;
}

.weather-icon {
  text-align: center;
}

.weather-icon img {
  width: 100px;
  height: 100px;
}

.weather-icon p {
  margin-top: 5px;
  text-transform: capitalize;
  font-weight: bold;
}

.additional-info {
  display: flex;
  justify-content: space-between;
  background-color: #f1f7ff;
  padding: 15px;
  border-radius: 10px;
}

.info-item {
  display: flex;
  align-items: center;
  color: #555;
}

.info-item i {
  margin-right: 8px;
  color: #3a7bd5;
}

/* Thêm CSS cho phần dự báo 5 ngày */
.forecast-container {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eaeaea;
}

.forecast-container h3 {
  text-align: center;
  color: #3a7bd5;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.forecast-items {
  display: flex;
  justify-content: space-between;
  overflow-x: auto;
  padding-bottom: 10px;
}

.forecast-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100px;
  padding: 10px;
  background-color: #f1f7ff;
  border-radius: 10px;
  margin: 0 5px;
  transition: all 0.3s;
}

.forecast-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.forecast-date {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: #555;
}

.forecast-temp {
  font-size: 1.2rem;
  font-weight: bold;
  color: #3a7bd5;
  margin: 5px 0;
}

.forecast-desc {
  font-size: 0.8rem;
  color: #666;
  text-align: center;
  text-transform: capitalize;
}

@media (max-width: 600px) {
  .weather-container {
    padding: 15px;
    margin: 0 10px;
  }
  
  .temperature-container {
    flex-direction: column;
  }
  
  .temperature {
    margin-right: 0;
    margin-bottom: 20px;
  }
  
  .additional-info {
    flex-direction: column;
  }
  
  .info-item {
    margin-bottom: 10px;
  }
  
  .forecast-items {
    flex-wrap: nowrap;
    justify-content: flex-start;
  }
}
</style>