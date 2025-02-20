<!-- src/components/WeatherPredict.vue -->
<template>
  <div class="weather-predict">
    <h2>Dự Báo Thời Tiết</h2>
    <form @submit.prevent="predictWeather">
      <div class="form-group">
        <label>Lượng mưa (mm)</label>
        <input
          v-model="weatherData.precipitation"
          type="number"
          step="0.1"
          required
        />
      </div>

      <div class="form-group">
        <label>Nhiệt độ cao nhất (°C)</label>
        <input
          v-model="weatherData.temp_max"
          type="number"
          step="0.1"
          required
        />
      </div>

      <div class="form-group">
        <label>Nhiệt độ thấp nhất (°C)</label>
        <input
          v-model="weatherData.temp_min"
          type="number"
          step="0.1"
          required
        />
      </div>

      <div class="form-group">
        <label>Tốc độ gió (km/h)</label>
        <input v-model="weatherData.wind" type="number" step="0.1" required />
      </div>

      <button type="submit">Dự đoán</button>
    </form>

    <div v-if="prediction" class="prediction-result">
      <h3>Kết quả dự đoán:</h3>
      <p>{{ prediction }}</p>
    </div>

    <!-- Thêm phần hiển thị lỗi -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
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
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept'
          }
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
    }
  }
}
</script>

<style scoped>
.error-message {
  color: red;
  margin-top: 1rem;
  padding: 0.5rem;
  border: 1px solid red;
  border-radius: 4px;
  background-color: #fff3f3;
}
</style>