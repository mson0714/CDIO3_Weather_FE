<!-- src/components/WeatherPredict.vue -->
<template>
  <div class="weather-predict-container">
    <div class="weather-predict-card">
      <div class="card-header">
        <h2><i class="fas fa-cloud-sun-rain"></i> Dự Báo Thời Tiết</h2>
      </div>
      
      <form @submit.prevent="predictWeather" class="prediction-form">
        <div class="form-row">
          <div class="form-group">
            <label><i class="fas fa-tint"></i> Lượng mưa (mm)</label>
            <input
              v-model="weatherData.precipitation"
              type="number"
              step="0.1"
              min="0"
              required
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label><i class="fas fa-temperature-high"></i> Nhiệt độ cao nhất (°C)</label>
            <input
              v-model="weatherData.temp_max"
              type="number"
              step="0.1"
              required
              class="form-control"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label><i class="fas fa-temperature-low"></i> Nhiệt độ thấp nhất (°C)</label>
            <input
              v-model="weatherData.temp_min"
              type="number"
              step="0.1"
              required
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label><i class="fas fa-wind"></i> Tốc độ gió (km/h)</label>
            <input 
              v-model="weatherData.wind" 
              type="number" 
              step="0.1" 
              min="0"
              required 
              class="form-control"
            />
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-predict">
            <i class="fas fa-search"></i> Dự đoán
          </button>
        </div>
      </form>

      <div v-if="prediction" class="prediction-result">
        <h3><i class="fas fa-chart-line"></i> Kết quả dự đoán:</h3>
        <div class="result-card">
          <div class="result-content">
            <div class="weather-icon">
              <img :src="getWeatherIcon()" alt="Weather icon" />
            </div>
            <div class="weather-text">
              <p class="prediction-text">{{ prediction }}</p>
              <p class="prediction-description">{{ getWeatherDescription() }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="error" class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>{{ error }}</p>
      </div>
    </div>
    
    <div class="weather-info-card">
      <div class="card-header">
        <h3><i class="fas fa-info-circle"></i> Hướng dẫn sử dụng</h3>
      </div>
      <div class="info-content">
        <p>Nhập các thông số thời tiết vào form để nhận dự đoán thời tiết chính xác.</p>
        <ul>
          <li><strong>Lượng mưa:</strong> Lượng mưa dự kiến (mm)</li>
          <li><strong>Nhiệt độ cao nhất:</strong> Nhiệt độ cao nhất trong ngày (°C)</li>
          <li><strong>Nhiệt độ thấp nhất:</strong> Nhiệt độ thấp nhất trong ngày (°C)</li>
          <li><strong>Tốc độ gió:</strong> Tốc độ gió trung bình (km/h)</li>
        </ul>
      </div>
    </div>
  </div>
</template>
  
<script>
import axios from 'axios';

export default {
  data() {
    return {
      weatherData: {
        precipitation: 0,
        temp_max: 0,
        temp_min: 0,
        wind: 0
      },
      prediction: null,
      error: null
    }
  },
  methods: {
    async predictWeather() {
      try {
        this.error = null;
        const response = await axios.post('http://127.0.0.1:8000/api/predict', {
          precipitation: parseFloat(this.weatherData.precipitation),
          temp_max: parseFloat(this.weatherData.temp_max), 
          temp_min: parseFloat(this.weatherData.temp_min),
          wind: parseFloat(this.weatherData.wind)
        });
        
        if (response.data) {
          this.prediction = response.data.prediction;
          this.error = null;
        } else {
          this.error = 'Không nhận được kết quả dự đoán từ máy chủ';
        }
      } catch (error) {
        console.error('Lỗi khi dự đoán:', error);
        if (error.code === 'ECONNREFUSED') {
          this.error = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra xem máy chủ đã được khởi động chưa.';
        } else if (error.response && error.response.data) {
          this.error = error.response.data.message;
        } else {
          this.error = 'Có lỗi xảy ra khi thực hiện dự đoán. Vui lòng thử lại sau.';
        }
      }
    },
    
    getWeatherIcon() {
      if (!this.prediction) return '';
      
      const predictionLower = this.prediction.toLowerCase();
      
      if (predictionLower.includes('nắng') || predictionLower.includes('sun')) {
        return '/images/weather/sun.png';
      } else if (predictionLower.includes('tuyết') || predictionLower.includes('snow')) {
        return '/images/weather/snow.png';
      } else if (predictionLower.includes('mưa lớn') || predictionLower.includes('rain')) {
        return '/images/weather/rain.png';
      } else if (predictionLower.includes('mưa phùn') || predictionLower.includes('drizzle')) {
        return '/images/weather/drizzle.png';
      } else if (predictionLower.includes('sương mù') || predictionLower.includes('fog')) {
        return '/images/weather/fog.png';
      } else {
        // Mặc định nếu không tìm thấy từ khóa phù hợp
        return '/images/weather/sun.png';
      }
    },
    
    getWeatherDescription() {
      if (!this.prediction) return '';
      
      const predictionLower = this.prediction.toLowerCase();
      let description = '';
      
      if (predictionLower.includes('nắng')) {
        description = 'Thời tiết nắng đẹp, thích hợp cho các hoạt động ngoài trời.';
      } 
      else if (predictionLower.includes('mây')) {
        description = 'Thời tiết có mây, nhiệt độ dễ chịu.';
      }
      else if (predictionLower.includes('mưa')) {
        if (predictionLower.includes('mưa nhẹ')) {
          description = 'Có mưa nhẹ, nên mang theo ô khi ra ngoài.';
        } else if (predictionLower.includes('mưa lớn')) {
          description = 'Mưa lớn, hạn chế di chuyển và cẩn thận ngập lụt.';
        } else {
          description = 'Có mưa, nên chuẩn bị ô hoặc áo mưa.';
        }
      }
      else if (predictionLower.includes('giông')) {
        description = 'Có giông, nên tránh các khu vực trống trải và cao.';
      }
      
      return description || 'Hãy chuẩn bị phù hợp với điều kiện thời tiết.';
    }
  }
}
</script>

<style scoped>
.weather-predict-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.weather-predict-card {
  flex: 1;
  min-width: 300px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.3s ease;
}

.weather-predict-card:hover {
  transform: translateY(-5px);
}

.weather-info-card {
  flex: 0 0 300px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  height: fit-content;
}

.card-header {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.card-header h2, .card-header h3 {
  color: #0056b3;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}

.prediction-form {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 15px;
}

.form-group {
  flex: 1;
  min-width: 200px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-control:focus {
  border-color: #0056b3;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 86, 179, 0.1);
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.btn-predict {
  background: #0056b3;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-predict:hover {
  background: #003d7a;
}

.prediction-result {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #f0f0f0;
}

.prediction-result h3 {
  color: #0056b3;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.result-card {
  background: #f8f9fa;
  border-left: 4px solid #0056b3;
  padding: 15px;
  border-radius: 6px;
}

.result-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.weather-icon {
  flex: 0 0 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.weather-icon img {
  width: 100%;
  height: auto;
  max-height: 120px;
  object-fit: contain;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s ease;
}

.weather-icon img:hover {
  transform: scale(1.05);
}

.weather-text {
  flex: 1;
  font-size: 18px;
}

.error-message {
  margin-top: 20px;
  padding: 15px;
  border-radius: 6px;
  background-color: #fff3f3;
  color: #d32f2f;
  border: 1px solid #ffcdd2;
  display: flex;
  align-items: center;
  gap: 10px;
}

.error-message i {
  font-size: 20px;
}

.info-content {
  color: #555;
  line-height: 1.6;
}

.info-content ul {
  padding-left: 20px;
  margin-top: 10px;
}

.info-content li {
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 15px;
  }
  
  .weather-info-card {
    flex: 1 1 100%;
  }
  
  .result-content {
    flex-direction: column;
    text-align: center;
  }
  
  .weather-icon {
    margin: 0 auto;
  }
}

.prediction-text {
  font-weight: 600;
  margin-bottom: 8px;
  color: #0056b3;
}

.prediction-description {
  font-size: 14px;
  color: #555;
  font-style: italic;
}
</style>