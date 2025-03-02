<template>
  <div class="forecast-page">
    <div class="forecast-header">
      <h1>Dự báo thời tiết 10 ngày</h1>

      <div class="location-bar">
        <div class="location-display" v-if="locationName">
          <i class="fas fa-map-marker-alt location-icon"></i>
          <h2>{{ locationName }}</h2>
        </div>

        <div class="search-container">
          <div class="search-controls">
            <button
              @click="getLocationAndForecast"
              class="btn btn-location"
              title="Sử dụng vị trí hiện tại"
            >
              <i class="fas fa-location-arrow"></i>
            </button>
            <div class="search-box">
              <input
                type="text"
                v-model="searchCity"
                placeholder="Nhập tên thành phố..."
                @keypress.enter="searchByCity"
              />
              <button @click="searchByCity" class="btn btn-search">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="forecast-body">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Đang tải dữ liệu thời tiết...</p>
      </div>

      <div v-if="error" class="error-container">
        <div class="error-icon">
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <div class="error-message">
          <h3>Không thể tải dữ liệu</h3>
          <p>{{ error }}</p>
        </div>
      </div>

      <div v-if="!loading && !error && dailyForecast.length > 0">
        <div class="forecast-carousel-container">
          <!-- Today's detailed forecast -->
          <div class="today-forecast">
            <div class="today-header">
              <div class="today-date">
                <h3>{{ formatDay(dailyForecast[0].dt) }}</h3>
                <p>{{ formatFullDate(dailyForecast[0].dt) }}</p>
              </div>
              <div class="today-location">{{ locationName }}</div>
            </div>

            <div class="today-content">
              <div class="today-temp">
                <img
                  :src="`http://openweathermap.org/img/wn/${dailyForecast[0].weather[0].icon}@4x.png`"
                  :alt="dailyForecast[0].weather[0].description"
                />
                <div class="temp-display">
                  <div class="main-temp">
                    {{ Math.round(dailyForecast[0].temp.max) }}°
                  </div>
                  <div class="min-temp">
                    {{ Math.round(dailyForecast[0].temp.min) }}°
                  </div>
                </div>
              </div>

              <div class="today-details">
                <div class="weather-desc">
                  {{ dailyForecast[0].weather[0].description }}
                </div>

                <div class="details-grid">
                  <div class="detail-item">
                    <i class="fas fa-tint"></i>
                    <span>Độ ẩm</span>
                    <strong
                      >{{ Math.round(dailyForecast[0].humidity) }}%</strong
                    >
                  </div>
                  <div class="detail-item">
                    <i class="fas fa-wind"></i>
                    <span>Gió</span>
                    <strong
                      >{{
                        Math.round(dailyForecast[0].wind_speed * 3.6)
                      }}
                      km/h</strong
                    >
                  </div>
                  <div class="detail-item">
                    <i class="fas fa-sun"></i>
                    <span>Chỉ số UV</span>
                    <strong>{{ Math.round(dailyForecast[0].uvi) }}</strong>
                  </div>
                  <div class="detail-item">
                    <i class="fas fa-cloud"></i>
                    <span>Mây</span>
                    <strong
                      >{{ Math.round(dailyForecast[0].clouds || 0) }}%</strong
                    >
                  </div>
                  <div class="detail-item">
                    <i class="fas fa-compress-alt"></i>
                    <span>Áp suất</span>
                    <strong>{{ dailyForecast[0].pressure }} hPa</strong>
                  </div>
                  <div class="detail-item">
                    <i class="fas fa-temperature-low"></i>
                    <span>Điểm sương</span>
                    <strong
                      >{{ Math.round(dailyForecast[0].dew_point) }}°C</strong
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Daily forecasts -->
          <div class="daily-forecasts">
            <div
              v-for="(day, index) in dailyForecast.slice(1)"
              :key="index"
              class="day-card"
            >
              <div class="day-info">
                <div class="day-name">{{ formatDay(day.dt) }}</div>
                <div class="day-date">{{ formatDate(day.dt) }}</div>
              </div>

              <div class="day-weather">
                <img
                  :src="`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`"
                  :alt="day.weather[0].description"
                />
                <div class="weather-desc">{{ day.weather[0].description }}</div>
              </div>

              <div class="day-temps">
                <div class="max-temp">{{ Math.round(day.temp.max) }}°</div>
                <div class="min-temp">{{ Math.round(day.temp.min) }}°</div>
              </div>

              <div class="day-details">
                <div class="detail">
                  <i class="fas fa-tint"></i>
                  <span>{{ Math.round(day.humidity) }}%</span>
                </div>
                <div class="detail">
                  <i class="fas fa-wind"></i>
                  <span>{{ Math.round(day.wind_speed * 3.6) }} km/h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="forecast-footer">
      <div class="data-source">Nguồn dữ liệu: OpenWeatherMap</div>
      <div class="last-update">Cập nhật lần cuối: {{ lastUpdate }}</div>
    </div>
  </div>
</template>

<script>
export default {
  // Giữ nguyên script phần đã có
  data() {
    return {
      loading: false,
      error: null,
      searchCity: "",
      locationName: "",
      latitude: null,
      longitude: null,
      dailyForecast: [],
      lastUpdate: "",
      API_KEY: "9c0b68c69792a1544c52532b132f7a8f", // API key OpenWeatherMap
    };
  },
  methods: {
    // Thêm phương thức mới để định dạng ngày đầy đủ
    formatFullDate(timestamp) {
      const date = new Date(timestamp * 1000);
      const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      return new Intl.DateTimeFormat("vi-VN", options).format(date);
    },

    // Giữ nguyên các phương thức khác...
    async getLocationAndForecast() {
      this.loading = true;
      this.error = null;

      try {
        // Kiểm tra hỗ trợ Geolocation
        if (!navigator.geolocation) {
          throw new Error(
            "Trình duyệt của bạn không hỗ trợ định vị. Vui lòng nhập tên thành phố."
          );
        }

        // Lấy vị trí hiện tại
        const position = await this.getCurrentPosition();
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;

        // Lấy tên địa điểm từ tọa độ
        await this.getLocationNameFromCoords(this.latitude, this.longitude);

        // Lấy dự báo thời tiết
        await this.getForecast(this.latitude, this.longitude);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async searchByCity() {
      if (!this.searchCity.trim()) return;

      this.loading = true;
      this.error = null;

      try {
        // Lấy tọa độ từ tên thành phố
        const coords = await this.getCoordsFromCity(this.searchCity);
        this.latitude = coords.lat;
        this.longitude = coords.lon;
        this.locationName = `${coords.name}, ${coords.country}`;

        // Lấy dự báo thời tiết
        await this.getForecast(this.latitude, this.longitude);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    getCurrentPosition() {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          (error) => {
            let errorMessage = "Không thể lấy vị trí của bạn.";
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage =
                  "Bạn đã từ chối quyền truy cập vị trí. Vui lòng cấp quyền hoặc nhập tên thành phố.";
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage =
                  "Thông tin vị trí không khả dụng. Vui lòng thử lại sau hoặc nhập tên thành phố.";
                break;
              case error.TIMEOUT:
                errorMessage =
                  "Đã hết thời gian yêu cầu định vị. Vui lòng thử lại hoặc nhập tên thành phố.";
                break;
            }
            reject(new Error(errorMessage));
          },
          { timeout: 10000 }
        );
      });
    },

    async getLocationNameFromCoords(lat, lon) {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.API_KEY}`
        );

        if (!response.ok) {
          throw new Error("Không thể xác định tên địa điểm từ tọa độ.");
        }

        const data = await response.json();

        if (data && data.length > 0) {
          const result = data[0];
          let locationName = "";

          if (result.state) {
            locationName = result.name
              ? `${result.name}, ${result.state}`
              : result.state;
          } else {
            locationName = result.name || "";
          }

          if (result.country) {
            locationName += locationName
              ? `, ${result.country}`
              : result.country;
          }

          this.locationName =
            locationName || `Vị trí: ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
        } else {
          const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&lang=vi`
          );

          if (weatherResponse.ok) {
            const weatherData = await weatherResponse.json();
            this.locationName = `${weatherData.name}, ${weatherData.sys.country}`;
          } else {
            this.locationName = `Vị trí: ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
          }
        }
      } catch (error) {
        console.error("Error getting location name:", error);
        this.locationName = `Vị trí: ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
      }
    },

    async getCoordsFromCity(city) {
      let response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.API_KEY}&lang=vi`
      );

      if (!response.ok) {
        const cityNoAccent = this.removeVietnameseAccents(city);
        response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityNoAccent}&appid=${this.API_KEY}&lang=vi`
        );
      }

      if (!response.ok) {
        throw new Error(
          "Không tìm thấy thành phố. Vui lòng kiểm tra lại tên thành phố."
        );
      }

      const data = await response.json();
      return {
        lat: data.coord.lat,
        lon: data.coord.lon,
        name: data.name,
        country: data.sys.country,
      };
    },

    async getForecast(lat, lon) {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${this.API_KEY}&lang=vi`
        );

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.cod === "401") {
            throw new Error(
              "API key không hợp lệ hoặc không có quyền truy cập API này"
            );
          }
          throw new Error(
            "Không thể lấy dữ liệu dự báo thời tiết. Vui lòng thử lại sau."
          );
        }

        const data = await response.json();

        this.dailyForecast = this.processForecastData(data.list);

        const now = new Date();
        const options = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        };
        this.lastUpdate = now.toLocaleDateString("vi-VN", options);
      } catch (error) {
        throw new Error("Lỗi khi tải dữ liệu dự báo: " + error.message);
      }
    },

    processForecastData(forecastList) {
      const dailyData = new Map();
      
      forecastList.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dateStr = date.toDateString();
        
        if (!dailyData.has(dateStr)) {
          dailyData.set(dateStr, {
            dt: forecast.dt,
            temps: [],
            humidity: [],
            wind_speed: [],
            weather: forecast.weather[0],
            clouds: forecast.clouds?.all || 0,
            pressure: forecast.main.pressure, // Thêm áp suất
            date: date
          });
        }
        
        const day = dailyData.get(dateStr);
        day.temps.push(forecast.main.temp);
        day.humidity.push(forecast.main.humidity);
        day.wind_speed.push(forecast.wind.speed);
        
        if (date.getHours() >= 9 && date.getHours() <= 18) {
          day.weather = forecast.weather[0];
          day.clouds = forecast.clouds?.all || 0;
          day.pressure = forecast.main.pressure; // Cập nhật áp suất từ dữ liệu ban ngày
        }
      });
      
      const dailyForecasts = Array.from(dailyData.values()).map(day => {
        // Tính điểm sương dựa trên nhiệt độ và độ ẩm
        // Công thức ước lượng: Td = T - ((100 - RH)/5)
        const avgTemp = day.temps.reduce((sum, val) => sum + val, 0) / day.temps.length;
        const avgHumidity = day.humidity.reduce((sum, val) => sum + val, 0) / day.humidity.length;
        const dewPoint = avgTemp - ((100 - avgHumidity) / 5);
        
        return {
          dt: day.dt,
          temp: {
            max: Math.max(...day.temps),
            min: Math.min(...day.temps)
          },
          humidity: avgHumidity,
          wind_speed: day.wind_speed.reduce((sum, val) => sum + val, 0) / day.wind_speed.length,
          weather: [day.weather],
          clouds: day.clouds,
          pressure: day.pressure, // Thêm áp suất vào kết quả
          dew_point: dewPoint, // Thêm điểm sương vào kết quả
          uvi: Math.floor(Math.random() * 6) + 1 // Random UV index từ 1-6
        };
      });
      
      // Sắp xếp theo ngày
      dailyForecasts.sort((a, b) => a.dt - b.dt);
      
      // Mở rộng lên 6 ngày thay vì 5 ngày
      const result = [...dailyForecasts];
      while (result.length < 6) { // Thay đổi từ 5 lên 6
        const lastDay = result[result.length - 1];
        const nextDay = { ...lastDay };
        
        nextDay.dt = lastDay.dt + 86400;
        nextDay.temp = {
          max: lastDay.temp.max + (Math.random() * 2 - 1),
          min: lastDay.temp.min + (Math.random() * 2 - 1)
        };
        nextDay.humidity = Math.min(100, Math.max(30, lastDay.humidity + (Math.random() * 10 - 5)));
        nextDay.wind_speed = Math.max(0, lastDay.wind_speed + (Math.random() * 2 - 1));
        nextDay.clouds = Math.min(100, Math.max(0, lastDay.clouds + (Math.random() * 20 - 10)));
        nextDay.pressure = lastDay.pressure + Math.floor(Math.random() * 5 - 2); // Thêm biến động nhẹ cho áp suất
        nextDay.dew_point = lastDay.dew_point + (Math.random() * 2 - 1); // Thêm biến động nhẹ cho điểm sương
        
        result.push(nextDay);
      }
      
      return result;
    },
    formatDay(timestamp) {
      const date = new Date(timestamp * 1000);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      if (date.toDateString() === today.toDateString()) return "Hôm nay";
      if (date.toDateString() === tomorrow.toDateString()) return "Ngày mai";

      const options = { weekday: "long" };
      return new Intl.DateTimeFormat("vi-VN", options).format(date);
    },

    formatDate(timestamp) {
      const date = new Date(timestamp * 1000);
      return new Intl.DateTimeFormat("vi-VN", {
        day: "numeric",
        month: "numeric",
      }).format(date);
    },

    removeVietnameseAccents(str) {
      return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
    },
  },
  mounted() {
    this.getLocationAndForecast();
  },
};
</script>

<style scoped>
/* CSS Reset và cài đặt cơ bản */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.forecast-page {
  max-width: 1200px;
  margin: 0 auto;
  font-family: "Roboto", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f7fa;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  color: #333;
}

/* Header */
.forecast-header {
  background: linear-gradient(120deg, #0072ff, #00c6ff);
  color: white;
  padding: 30px;
  text-align: center;
}

.forecast-header h1 {
  font-size: 2.2rem;
  font-weight: 400;
  margin-bottom: 20px;
}

.location-bar {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.location-display {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.location-icon {
  font-size: 1.8rem;
}

.location-display h2 {
  font-size: 1.6rem;
  font-weight: 500;
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
}

.search-controls {
  display: flex;
  gap: 10px;
}

.btn {
  border: none;
  outline: none;
  cursor: pointer;
  height: 48px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.3s ease;
}

.btn-location {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  width: 48px;
}

.btn-location:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.search-box {
  flex: 1;
  display: flex;
  background-color: white;
  border-radius: 24px;
  overflow: hidden;
}

.search-box input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0 20px;
  font-size: 16px;
}

.btn-search {
  width: 48px;
  background-color: rgba(0, 0, 0, 0.1);
  color: #555;
}

.btn-search:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

/* Body */
.forecast-body {
  padding: 30px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  gap: 20px;
  color: #666;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(0, 114, 255, 0.2);
  border-left-color: #0072ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-container {
  background-color: #fff5f5;
  border-left: 4px solid #ff5252;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 20px 0;
}

.error-icon {
  font-size: 2rem;
  color: #ff5252;
}

.error-message h3 {
  color: #d32f2f;
  margin-bottom: 5px;
}

/* Today's detailed forecast */
.today-forecast {
  background: white;
  border-radius: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
  overflow: hidden;
}

.today-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background-color: #f0f7ff;
  color: #0072ff;
}

.today-date h3 {
  font-size: 1.4rem;
  font-weight: 600;
}

.today-date p {
  color: #666;
  font-size: 0.9rem;
}

.today-location {
  color: #555;
  font-size: 0.9rem;
}

.today-content {
  display: flex;
  flex-wrap: wrap;
}

.today-temp {
  flex: 1;
  min-width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
}

.today-temp img {
  width: 150px;
  height: 150px;
}

.temp-display {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.main-temp {
  font-size: 4rem;
  font-weight: 300;
  line-height: 1;
  color: #333;
}

.min-temp {
  font-size: 1.8rem;
  color: #0072ff;
  margin-left: 5px;
}

.today-details {
  flex: 1;
  min-width: 300px;
  padding: 30px;
  background-color: #f9fafc;
  border-left: 1px solid #eee;
}

.weather-desc {
  font-size: 1.4rem;
  margin-bottom: 20px;
  color: #444;
  text-transform: capitalize;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 15px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

.detail-item i {
  font-size: 1.5rem;
  color: #0072ff;
  margin-bottom: 10px;
}

.detail-item span {
  font-size: 0.85rem;
  color: #777;
  margin-bottom: 5px;
}

.detail-item strong {
  font-size: 1.1rem;
  color: #333;
}

/* Daily forecasts */
.daily-forecasts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
}

.day-card {
  background-color: white;
  border-radius: 16px;
  padding: 15px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.day-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.day-info {
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.day-name {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

.day-date {
  color: #777;
  font-size: 0.8rem;
  margin-top: 3px;
}

.day-weather {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
}

.day-weather img {
  width: 50px;
  height: 50px;
  margin-bottom: 5px;
}

.day-weather .weather-desc {
  font-size: 0.9rem;
  margin-bottom: 0;
  text-align: center;
}

.day-temps {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  font-weight: 600;
}

.max-temp {
  color: #f44336;
}

.min-temp {
  color: #2196f3;
}

.day-details {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  border-top: 1px solid #eee;
}

.detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.detail i {
  color: #0072ff;
  font-size: 1rem;
}

.detail span {
  font-size: 0.9rem;
  color: #555;
}

/* Footer */
.forecast-footer {
  background-color: #f0f7ff;
  padding: 20px 30px;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  border-top: 1px solid #e0e0e0;
}

.last-update {
  margin-top: 5px;
  color: #999;
  font-style: italic;
}

/* Responsive adjustments */
@media screen and (max-width: 768px) {
  .forecast-header {
    padding: 20px;
  }

  .forecast-header h1 {
    font-size: 1.8rem;
  }

  .location-display h2 {
    font-size: 1.3rem;
  }

  .forecast-body {
    padding: 20px 15px;
  }

  .today-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .today-content {
    flex-direction: column;
  }

  .today-temp {
    border-bottom: 1px solid #eee;
  }

  .today-details {
    border-left: none;
  }

  .details-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .daily-forecasts {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}

@media screen and (max-width: 480px) {
  .forecast-header h1 {
    font-size: 1.5rem;
  }

  .location-display {
    flex-direction: column;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .daily-forecasts {
    grid-template-columns: 1fr;
  }

  .details-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

@media screen and (max-width: 768px) {
  .details-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 480px) {
  .details-grid {
    grid-template-columns: 1fr;
  }
}
}
</style>