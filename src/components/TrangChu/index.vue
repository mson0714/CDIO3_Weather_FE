<template>
  <div class="trang-chu">
    <!-- Banner chính -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>Dự Báo Thời Tiết Chính Xác</h1>
        <p>Cung cấp thông tin thời tiết tin cậy, kịp thời cho mọi vùng miền Việt Nam</p>
        <router-link to="/du-bao-thoi-tiet" class="btn-primary">
          <i class="fas fa-cloud-sun-rain"></i> Dự Đoán Ngay
        </router-link>
      </div>
    </section>

    <!-- Thời tiết các thành phố lớn -->
    <section class="city-weather">
      <div class="section-header">
        <h2><i class="fas fa-map-marker-alt"></i> Thời Tiết Các Thành Phố Lớn</h2>
      </div>
      <div class="city-grid">
        <div class="city-card" v-for="(city, index) in cities" :key="index">
          <div class="city-name">{{ city.name }}</div>
          <div class="city-weather-icon">
            <img :src="city.icon" :alt="city.weather" />
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
        <iframe width="1250" height="650" src="https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=°C&metricWind=km/h&zoom=5&overlay=wind&product=ecmwf&level=surface&lat=15.756&lon=106.902&message=true" frameborder="0"></iframe>
        <div class="map-overlay">
          <router-link to="/ban-do" class="btn-secondary">Xem Bản Đồ Chi Tiết</router-link>
        </div>
      </div>
    </section>

    <!-- Tin tức thời tiết -->
    <section class="weather-news">
      <div class="section-header">
        <h2><i class="fas fa-newspaper"></i> Tin Tức Thời Tiết Mới Nhất</h2>
        <router-link to="/tin-tuc" class="view-all">Xem tất cả <i class="fas fa-arrow-right"></i></router-link>
      </div>
      <div class="news-grid">
        <div class="news-card" v-for="(news, index) in weatherNews" :key="index">
          <div class="news-image">
            <img :src="news.image" :alt="news.title" />
          </div>
          <div class="news-content">
            <div class="news-date">
              <i class="far fa-calendar-alt"></i> {{ news.date }}
            </div>
            <h3 class="news-title">{{ news.title }}</h3>
            <p class="news-excerpt">{{ news.excerpt }}</p>
            <router-link :to="news.link" class="read-more">Đọc tiếp <i class="fas fa-angle-right"></i></router-link>
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
          <router-link to="/du-bao-thoi-tiet" class="btn-tool">Sử dụng ngay</router-link>
        </div>
        <div class="tool-card">
          <div class="tool-icon">
            <i class="fas fa-calendar-alt"></i>
          </div>
          <h3>Dự Báo 10 Ngày</h3>
          <p>Xem dự báo thời tiết chi tiết trong 10 ngày tới</p>
          <router-link to="/thoi-tiet/10-ngay" class="btn-tool">Xem dự báo</router-link>
        </div>
        <div class="tool-card">
          <div class="tool-icon">
            <i class="fas fa-water"></i>
          </div>
          <h3>Cảnh Báo Lũ Lụt</h3>
          <p>Thông tin cảnh báo lũ lụt tại các khu vực</p>
          <router-link to="/canh-bao/lu-lut" class="btn-tool">Xem cảnh báo</router-link>
        </div>
      </div>
    </section>

    <!-- Chatbot giới thiệu -->
    <section class="chatbot-intro">
      <div class="chatbot-content">
        <div class="chatbot-text">
          <h2>Trợ Lý Thời Tiết Thông Minh</h2>
          <p>Đặt câu hỏi và nhận thông tin thời tiết ngay lập tức từ trợ lý ảo của chúng tôi.</p>
          <ul class="chatbot-features">
            <li><i class="fas fa-check-circle"></i> Dự báo thời tiết theo địa điểm</li>
            <li><i class="fas fa-check-circle"></i> Thông tin về nhiệt độ, độ ẩm, gió</li>
            <li><i class="fas fa-check-circle"></i> Cảnh báo thời tiết xấu</li>
            <li><i class="fas fa-check-circle"></i> Gợi ý trang phục phù hợp</li>
          </ul>
          <button class="btn-chatbot" @click="openChatbot">
            <i class="fas fa-comments"></i> Chat Ngay
          </button>
        </div>
        <div class="chatbot-image">
          <img src="/images/chatbot.png" alt="Trợ lý thời tiết" />
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
          name: 'Hà Nội',
          temp: 28,
          weather: 'Có mây',
          humidity: 75,
          wind: 12,
          icon: 'https://cdn.haitrieu.com/wp-content/uploads/2022/06/Logo-Ha-Noi.png'
        },
        {
          name: 'Đà Nẵng',
          temp: 32,
          weather: 'Nắng',
          humidity: 65,
          wind: 8,
          icon: 'https://cdn.haitrieu.com/wp-content/uploads/2022/06/Logo-Thanh-Pho-Da-Nang.png'
        },
        {
          name: 'TP. Hồ Chí Minh',
          temp: 33,
          weather: 'Nắng nóng',
          humidity: 70,
          wind: 10,
          icon: 'https://cdn.haitrieu.com/wp-content/uploads/2022/07/Thanh-pho-Ho-Chi-Minh-1.png'
        },
        {
          name: 'Huế',
          temp: 30,
          weather: 'Mưa rào',
          humidity: 80,
          wind: 15,
          icon: 'https://sp-ao.shortpixel.ai/client/q_glossy,ret_img,w_300,h_300/https://onedesign.com.vn/wp-content/uploads/2021/02/thi%E1%BA%BFt-k%E1%BA%BF-logo-th%C3%A0nh-ph%E1%BB%91-hu%E1%BA%BF-300x300.png'
        },
        
        {
          name: 'Cần Thơ',
          temp: 32,
          weather: 'Mây rải rác',
          humidity: 72,
          wind: 7,
          icon: 'https://cdn.haitrieu.com/wp-content/uploads/2022/06/Logo-Thanh-Pho-Can-Tho.png'
        }
      ],
      weatherNews: [
        {
          title: 'Cảnh báo mưa lớn tại các tỉnh miền Trung trong tuần tới',
          excerpt: 'Theo dự báo, các tỉnh miền Trung sẽ có mưa lớn kéo dài từ ngày 15/7 đến 20/7, người dân cần đề phòng ngập lụt...',
          date: '12/07/2024',
          image: '/images/news/rain-news.jpg',
          link: '/tin-tuc/mua-lon-mien-trung'
        },
        {
          title: 'Nắng nóng gay gắt tại miền Bắc, nhiệt độ có thể lên tới 40 độ C',
          excerpt: 'Đợt nắng nóng mới đang ảnh hưởng đến các tỉnh miền Bắc với nhiệt độ cao nhất có thể lên tới 40 độ C...',
          date: '10/07/2024',
          image: '/images/news/hot-news.jpg',
          link: '/tin-tuc/nang-nong-mien-bac'
        },
        {
          title: 'Bão số 3 đang hình thành trên biển Đông, dự kiến đổ bộ vào cuối tuần',
          excerpt: 'Cơn bão số 3 đang hình thành trên biển Đông và dự kiến sẽ đổ bộ vào các tỉnh ven biển miền Trung vào cuối tuần...',
          date: '08/07/2024',
          image: '/images/news/storm-news.jpg',
          link: '/tin-tuc/bao-so-3'
        }
      ]
    }
  },
  methods: {
    openChatbot() {
      // Mở chatbot
      const chatbotContainer = document.getElementById('coze-chat-container');
      if (chatbotContainer) {
        // Tìm nút mở chatbot và click vào nó
        const chatbotButton = chatbotContainer.querySelector('button');
        if (chatbotButton) {
          chatbotButton.click();
        }
      }
    }
  }
}
</script>

<style scoped>
.trang-chu {
  margin-bottom: 40px;
}

/* Hero Section */
.hero-section {
  height: 500px;
  background-image: url('https://www.weathercompany.com/wp-content/uploads/2024/01/hero-data-vis-world-weather-explainer-vid.jpg');
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

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  padding: 0 20px;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 30px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
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
  
  .news-grid, .tools-grid {
    grid-template-columns: 1fr;
  }
}
</style>