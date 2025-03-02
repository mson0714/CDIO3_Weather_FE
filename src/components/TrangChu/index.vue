<template>
  <div class="trang-chu">
    <!-- Banner chính -->
    <!-- Thay đổi hero-section HTML để thêm video -->
    <section class="hero-section">
      <video class="hero-video" autoplay muted loop>
        <source
          src="/public/videos/home/istockphoto-1667456740-640_adpp_is.mp4"
          type="video/mp4"
        />
      </video>
      <div class="hero-content">
        <h1>Dự Báo Thời Tiết Chính Xác</h1>
        <p>
          Cung cấp thông tin thời tiết tin cậy, kịp thời cho mọi vùng miền Việt
          Nam
        </p>
        <router-link to="/du-bao-thoi-tiet" class="btn-primary">
          <i class="fas fa-cloud-sun-rain"></i> Dự Đoán Ngay
        </router-link>
      </div>
    </section>

    <!-- Thời tiết các thành phố lớn -->
    <section class="city-weather">
      <div class="section-header">
        <h2>
          <i class="fas fa-map-marker-alt"></i> Thời Tiết Các Thành Phố Lớn
        </h2>
      </div>
      <div class="city-grid">
        <div class="city-card" v-for="(city, index) in cities" :key="index">
          <div class="city-name">{{ city.name }}</div>
          <div class="city-weather-icon">
            <img
              :src="city.icon"
              :alt="city.weather"
              @error="handleIconError(index)"
            />
          </div>
          <div class="city-temp">{{ city.temp }}°C</div>
          <div class="city-weather-desc">{{ city.weather }}</div>
          <div class="city-details">
            <div class="detail-item">
              <i class="fas fa-tint"></i> {{ city.humidity }}%
            </div>
            <div class="detail-item">
              <i class="fas fa-wind"></i> {{ city.wind }} km/h
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bản đồ thời tiết -->
    <section class="weather-map">
      <div class="section-header">
        <h2><i class="fas fa-map"></i> Bản Đồ Thời Tiết</h2>
      </div>
      <div class="map-container">
        <iframe
          width="1250"
          height="650"
          src="https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=°C&metricWind=km/h&zoom=5&overlay=wind&product=ecmwf&level=surface&lat=15.756&lon=106.902&message=true"
          frameborder="0"
        ></iframe>
        <div class="map-overlay">
          <router-link to="/ban-do" class="btn-secondary"
            >Xem Bản Đồ Chi Tiết</router-link
          >
        </div>
      </div>
    </section>

    <!-- Tin tức thời tiết -->
    <section class="weather-news">
      <div class="section-header">
        <h2><i class="fas fa-newspaper"></i> Tin Tức Thời Tiết Mới Nhất</h2>
        <router-link to="/tin-tuc" class="view-all"
          >Xem tất cả <i class="fas fa-arrow-right"></i
        ></router-link>
      </div>
      <div class="news-grid">
        <div
          class="news-card"
          v-for="(news, index) in weatherNews"
          :key="index"
        >
          <div class="news-image">
            <img :src="news.image" :alt="news.title" />
          </div>
          <div class="news-content">
            <div class="news-date">
              <i class="far fa-calendar-alt"></i> {{ news.date }}
            </div>
            <h3 class="news-title">{{ news.title }}</h3>
            <p class="news-excerpt">{{ news.excerpt }}</p>
            <router-link :to="news.link" class="read-more"
              >Đọc tiếp <i class="fas fa-angle-right"></i
            ></router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Công cụ dự báo -->
    <section class="weather-tools">
      <div class="section-header">
        <h2><i class="fas fa-tools"></i> Công Cụ Dự Báo</h2>
      </div>
      <div class="tools-grid">
        <div class="tool-card">
          <div class="tool-icon">
            <i class="fas fa-cloud-sun-rain"></i>
          </div>
          <h3>Dự Đoán Thời Tiết</h3>
          <p>Dự đoán thời tiết dựa trên các thông số đầu vào</p>
          <router-link to="/du-bao-thoi-tiet" class="btn-tool"
            >Sử dụng ngay</router-link
          >
        </div>
        <div class="tool-card">
          <div class="tool-icon">
            <i class="fas fa-calendar-alt"></i>
          </div>
          <h3>Dự Báo 10 Ngày</h3>
          <p>Xem dự báo thời tiết chi tiết trong 10 ngày tới</p>
          <router-link to="/thoi-tiet/10-ngay" class="btn-tool"
            >Xem dự báo</router-link
          >
        </div>
        <div class="tool-card">
          <div class="tool-icon">
            <i class="fas fa-water"></i>
          </div>
          <h3>Cảnh Báo Lũ Lụt</h3>
          <p>Thông tin cảnh báo lũ lụt tại các khu vực</p>
          <router-link to="/canh-bao/lu-lut" class="btn-tool"
            >Xem cảnh báo</router-link
          >
        </div>
        <div class="tool-card">
          <div class="tool-icon">
            <i class="fas fa-sun"></i>
          </div>
          <h3>Chỉ số UV & Chất lượng không khí</h3>
          <p>Theo dõi chỉ số UV và chất lượng không khí để bảo vệ sức khỏe</p>
          <router-link to="/chat-luong-khong-khi" class="btn-tool"
            >Kiểm tra ngay</router-link
          >
        </div>
      </div>
    </section>

    <!-- Chatbot giới thiệu -->
    <section class="chatbot-intro">
      <div class="chatbot-content">
        <div class="chatbot-text">
          <h2>Trợ Lý Thời Tiết Thông Minh</h2>
          <p>
            Đặt câu hỏi và nhận thông tin thời tiết ngay lập tức từ trợ lý ảo
            của chúng tôi.
          </p>
          <ul class="chatbot-features">
            <li>
              <i class="fas fa-check-circle"></i> Dự báo thời tiết theo địa điểm
            </li>
            <li>
              <i class="fas fa-check-circle"></i> Thông tin về nhiệt độ, độ ẩm,
              gió
            </li>
            <li><i class="fas fa-check-circle"></i> Cảnh báo thời tiết xấu</li>
            <li>
              <i class="fas fa-check-circle"></i> Gợi ý trang phục phù hợp
            </li>
          </ul>
          <button class="btn-chatbot" @click="openChatbot()">
            <i class="fas fa-comments"></i> Chat Ngay
          </button>
        </div>
        <div class="chatbot-image">
          <img
            src="https://chat360.io/wp-content/uploads/2021/05/Top-10-website-chatbot-examples-of-2022.svg"
            alt="Trợ lý thời tiết"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cities: [
        {
          name: "Hà Nội",
          temp: 0,
          weather: "",
          humidity: 0,
          wind: 0,
          icon: "",
        },
        {
          name: "Đà Nẵng",
          temp: 0,
          weather: "",
          humidity: 0,
          wind: 0,
          icon: "",
        },
        {
          name: "Ho Chi Minh", // Thay đổi từ "TP. Hồ Chí Minh" thành "Ho Chi Minh"
          displayName: "TP. Hồ Chí Minh", // Tên hiển thị giữ nguyên
          temp: 0,
          weather: "",
          humidity: 0,
          wind: 0,
          icon: "",
        },
        {
          name: "Huế",
          temp: 0,
          weather: "",
          humidity: 0,
          wind: 0,
          icon: "",
        },
        {
          name: "Cần Thơ",
          temp: 0,
          weather: "",
          humidity: 0,
          wind: 0,
          icon: "",
        },
      ],
      weatherNews: [
        {
          image:
            "https://bcp.cdnchinhphu.vn/334894974524682240/2022/9/7/mua-1662518286474221449839.jpg",
          date: "01/03/2025",
          title: "Cảnh báo mưa lớn tại các tỉnh miền Bắc trong tuần tới",
          excerpt:
            "Trung tâm Dự báo Khí tượng Thủy văn Quốc gia dự báo các tỉnh miền Bắc sẽ có mưa lớn trong tuần tới do ảnh hưởng của không khí lạnh kết hợp với hội tụ gió trên cao.",
          link: "/tin-tuc/mua-lon-mien-bac",
        },
        {
          image:
            "https://cdn.tuoitre.vn/thumb_w/480/471584752817336320/2024/6/19/vung-ap-thap-1718788829887564393957.jpg",
          date: "28/02/2025",
          title: "Biển Đông sắp hình thành áp thấp nhiệt đới",
          excerpt:
            "Theo dự báo mới nhất, một vùng áp thấp đang hình thành trên khu vực giữa Biển Đông và có khả năng mạnh lên thành áp thấp nhiệt đới trong 24-48 giờ tới.",
          link: "/tin-tuc/ap-thap-nhiet-doi",
        },
        {
          image:
            "https://img.cand.com.vn/resize/800x800/NewFiles/Images/2024/07/26/anh_16-1721947200045.jpg",
          date: "26/02/2025",
          title: "Nắng nóng gay gắt ở miền Trung, nhiệt độ lên tới 40 độ C",
          excerpt:
            "Các tỉnh miền Trung đang trải qua đợt nắng nóng gay gắt kéo dài với nhiệt độ nhiều nơi lên tới 40 độ C. Chuyên gia khuyến cáo người dân hạn chế ra ngoài trong khoảng thời gian từ 11-16 giờ.",
          link: "/tin-tuc/nang-nong-mien-trung",
        },
      ],
      API_KEY: "9c0b68c69792a1544c52532b132f7a8f", // API key OpenWeatherMap
    };
  },
  methods: {
    // Cập nhật phương thức openChatbot
    // Thay thế phương thức openChatbot
    // Cập nhật với selector chính xác sau khi kiểm tra DOM
    // Sửa phương thức openChatbot để tìm đúng phần tử chat
    openChatbot() {
      // Thêm dấu "." để chỉ định rằng đây là class name
      const chatButton = document.querySelector(".ab1ac9d9bab12da47298");

      if (chatButton) {
        // Click vào chính phần tử đó hoặc tìm thẻ img bên trong và click
        chatButton.click();
        console.log("Đã tìm thấy và click vào nút chat");
      } else {
        console.error("Không tìm thấy nút chat với class ab1ac9d9bab12da47298");

        // Phương án dự phòng: tìm kiếm các phần tử liên quan đến Coze
        const cozeElements = document.querySelectorAll(
          '[class*="coze"], [id*="coze"]'
        );
        if (cozeElements.length > 0) {
          console.log("Tìm thấy phần tử Coze thay thế:", cozeElements[0]);
          cozeElements[0].click();
        }
      }
    },

    // Hàm chuyển đổi tiếng Việt có dấu sang không dấu
    removeVietnameseAccents(str) {
      return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
    },
    getWeatherGif(iconCode) {
      // Xác định mã icon cơ bản (không có đuôi d/n)
      const baseCode = iconCode.substring(0, 2);
      // Xác định nếu là ngày (d) hay đêm (n)
      const isDaytime = iconCode.includes("d");

      // Các trường hợp cần phân biệt ngày/đêm
      const needsDayNightVersion = ["01", "02", "10"];

      if (needsDayNightVersion.includes(baseCode)) {
        // Sử dụng phiên bản ngày/đêm riêng biệt
        return `/weather-icons/${iconCode}.gif`;
      } else {
        // Sử dụng phiên bản chung (không phân biệt ngày/đêm)
        return `/weather-icons/${baseCode}.gif`;
      }
    },

    // Lấy dữ liệu thời tiết cho một thành phố
    // Sửa phương thức fetchCityWeather
    async fetchCityWeather(cityName, index) {
      try {
        // THÊM VÀO: Gọi API OpenWeatherMap để lấy dữ liệu thời tiết
        let response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${this.API_KEY}&lang=vi`
        );

        // Nếu không tìm thấy, thử với tên không dấu
        if (!response.ok) {
          const cityNoAccent = this.removeVietnameseAccents(cityName);
          response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityNoAccent}&units=metric&appid=${this.API_KEY}&lang=vi`
          );
        }

        if (response.ok) {
          const data = await response.json();

          // Cập nhật thông tin thời tiết cho thành phố
          this.cities[index].temp = Math.round(data.main.temp);
          this.cities[index].weather = data.weather[0].description;
          this.cities[index].humidity = data.main.humidity;
          this.cities[index].wind = Math.round(data.wind.speed * 3.6); // Chuyển từ m/s sang km/h

          // Lấy mã icon từ API
          const iconCode = data.weather[0].icon;

          // Sử dụng file GIF động từ thư mục local
          this.cities[index].icon = this.getWeatherGif(iconCode);

          // Lưu icon mặc định từ API làm phương án dự phòng nếu GIF không tải được
          this.cities[
            index
          ].fallbackIcon = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        }
      } catch (error) {
        console.error(`Lỗi khi lấy dữ liệu thời tiết cho ${cityName}:`, error);
      }
    },

    // Lấy dữ liệu thời tiết cho tất cả các thành phố
    async fetchAllCitiesWeather() {
      const promises = this.cities.map((city, index) =>
        this.fetchCityWeather(city.name, index)
      );

      await Promise.all(promises);
    },
    handleIconError(index) {
      // Nếu GIF không tải được, sử dụng icon mặc định từ OpenWeatherMap
      if (this.cities[index].fallbackIcon) {
        this.cities[index].icon = this.cities[index].fallbackIcon;
      }
    },
  },
  created() {
    // Lấy dữ liệu thời tiết khi component được tạo
    this.fetchAllCitiesWeather();
  },
};
</script>

<style scoped>
.trang-chu {
  margin-bottom: 40px;
}

/* Hero Section */
.hero-section {
  height: 500px;
  background-image: url("https://www.weathercompany.com/wp-content/uploads/2024/01/hero-data-vis-world-weather-explainer-vid.jpg");
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  position: relative;
  margin-bottom: 40px;
  border-radius: 10px;
  overflow: hidden;
}

.hero-section {
  height: 500px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  margin-bottom: 40px;
  border-radius: 10px;
  overflow: hidden;
}

.hero-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.hero-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 0 20px;
  font-size: larger;
}

.btn-primary {
  display: inline-block;
  padding: 12px 24px;
  background-color: #0056b3;
  color: white;
  border-radius: 30px;
  font-weight: 500;
  font-size: 1.1rem;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover {
  background-color: #003d7a;
  transform: translateY(-3px);
}

/* Section Headers */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

.section-header h2 {
  color: #0056b3;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.view-all {
  color: #0056b3;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 0.3s;
}

.view-all:hover {
  color: #003d7a;
}

/* City Weather */
.city-weather {
  margin-bottom: 40px;
}

.city-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.city-card {
  background: white;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.city-card:hover {
  transform: translateY(-5px);
}

.city-name {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #0056b3;
}

.city-weather-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 10px;
}

.city-weather-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.city-temp {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 5px;
}

.city-weather-desc {
  color: #555;
  margin-bottom: 10px;
}

.city-details {
  display: flex;
  justify-content: space-around;
  color: #666;
  font-size: 0.9rem;
}

/* Weather Map */
.weather-map {
  margin-bottom: 40px;
}

.map-container {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  height: 400px;
}

.map-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.map-overlay {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.btn-secondary {
  display: inline-block;
  padding: 10px 20px;
  background-color: rgba(0, 86, 179, 0.8);
  color: white;
  border-radius: 5px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.btn-secondary:hover {
  background-color: rgba(0, 61, 122, 0.9);
}

/* Weather News */
.weather-news {
  margin-bottom: 40px;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.news-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.news-card:hover {
  transform: translateY(-5px);
}

.news-image {
  height: 180px;
  overflow: hidden;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.news-card:hover .news-image img {
  transform: scale(1.05);
}

.news-content {
  padding: 15px;
}

.news-date {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.news-title {
  font-size: 1.1rem;
  margin-bottom: 10px;
  line-height: 1.4;
  color: #333;
}

.news-excerpt {
  color: #555;
  font-size: 0.95rem;
  margin-bottom: 15px;
  line-height: 1.5;
}

.read-more {
  color: #0056b3;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
}

.read-more:hover {
  text-decoration: underline;
}

/* Weather Tools */
.weather-tools {
  margin-bottom: 40px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.tool-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.tool-card:hover {
  transform: translateY(-5px);
}

.tool-icon {
  font-size: 2.5rem;
  color: #0056b3;
  margin-bottom: 15px;
}

.tool-card h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
}

.tool-card p {
  color: #555;
  margin-bottom: 20px;
  line-height: 1.5;
}

.btn-tool {
  display: inline-block;
  padding: 8px 16px;
  background-color: #f0f0f0;
  color: #333;
  border-radius: 5px;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-tool:hover {
  background-color: #0056b3;
  color: white;
}

/* Chatbot Intro */
.chatbot-intro {
  background: linear-gradient(135deg, #0056b3, #00a0e9);
  border-radius: 10px;
  padding: 30px;
  color: white;
}

.chatbot-content {
  display: flex;
  align-items: center;
  gap: 30px;
}

.chatbot-text {
  flex: 1;
}

.chatbot-text h2 {
  font-size: 1.8rem;
  margin-bottom: 15px;
}

.chatbot-text p {
  margin-bottom: 20px;
  line-height: 1.6;
}

.chatbot-features {
  margin-bottom: 25px;
}

.chatbot-features li {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.chatbot-features i {
  color: #4caf50;
}

.btn-chatbot {
  display: inline-block;
  padding: 10px 20px;
  background-color: white;
  color: #0056b3;
  border: none;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-chatbot:hover {
  background-color: #f0f0f0;
  transform: translateY(-3px);
}

.chatbot-image {
  flex: 0 0 300px;
  display: flex;
  justify-content: center;
}

.chatbot-image img {
  max-width: 100%;
  height: auto;
}

/* Responsive */
@media (max-width: 992px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }

  .chatbot-content {
    flex-direction: column;
  }

  .chatbot-image {
    order: -1;
    margin-bottom: 20px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    height: 400px;
  }

  .hero-content h1 {
    font-size: 2rem;
  }

  .city-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .map-container {
    height: 300px;
  }
}

@media (max-width: 576px) {
  .hero-section {
    height: 350px;
  }

  .hero-content h1 {
    font-size: 1.8rem;
  }

  .city-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .news-grid,
  .tools-grid {
    grid-template-columns: 1fr;
  }
}
</style>