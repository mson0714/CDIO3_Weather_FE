<template>
  <div class="news-container">
    <div class="news-header">
      <h1><i class="fas fa-newspaper"></i> Tin tức thời tiết</h1>
      
      <div class="news-filters">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Tìm kiếm tin tức..." 
            @input="filterNews"
          >
          <button><i class="fas fa-search"></i></button>
        </div>
        
        <div class="category-filters">
          <button 
            v-for="category in categories" 
            :key="category.id"
            :class="['category-btn', { active: selectedCategory === category.id }]"
            @click="selectCategory(category.id)"
          >
            <i :class="category.icon"></i> {{ category.name }}
          </button>
        </div>
      </div>
    </div>
    
    <div class="news-content">
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Đang tải tin tức...</p>
      </div>
      
      <div v-else-if="filteredNews.length === 0" class="no-news">
        <i class="fas fa-exclamation-circle"></i>
        <h3>Không tìm thấy tin tức</h3>
        <p>Không có tin tức nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
        <button @click="resetFilters" class="reset-btn">Xóa bộ lọc</button>
      </div>
      
      <div v-else class="news-grid">
        <div 
          v-for="article in displayedNews" 
          :key="article.id" 
          class="news-card"
          :class="`category-${article.categoryId}`"
        >
          <div class="news-image">
            <img :src="article.image" :alt="article.title">
            <span class="news-date">
              <i class="far fa-calendar-alt"></i> {{ article.date }}
            </span>
            <span class="news-category">{{ getCategoryName(article.categoryId) }}</span>
          </div>
          
          <div class="news-details">
            <h3>{{ article.title }}</h3>
            <p>{{ article.excerpt }}</p>
            
            <div class="news-meta">
              <span><i class="fas fa-user"></i> {{ article.author }}</span>
              <span><i class="fas fa-eye"></i> {{ article.views }}</span>
            </div>
            
            <router-link :to="article.link" class="read-more-btn">
              Đọc tiếp <i class="fas fa-arrow-right"></i>
            </router-link>
          </div>
        </div>
      </div>
      
      <div class="pagination">
        <button 
          :disabled="currentPage === 1" 
          @click="changePage(currentPage - 1)"
          class="page-btn"
        >
          <i class="fas fa-chevron-left"></i> Trước
        </button>
        
        <div class="page-numbers">
          <button 
            v-for="page in totalPages" 
            :key="page"
            :class="['page-number', { active: currentPage === page }]"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          :disabled="currentPage === totalPages" 
          @click="changePage(currentPage + 1)"
          class="page-btn"
        >
          Sau <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
    
    <div class="trending-news">
      <h2>Tin tức nổi bật</h2>
      <div class="trending-list">
        <div v-for="(article, index) in trendingNews" :key="`trending-${index}`" class="trending-item">
          <div class="trending-number">{{ index + 1 }}</div>
          <div class="trending-content">
            <h4>{{ article.title }}</h4>
            <div class="trending-meta">
              <span><i class="far fa-calendar-alt"></i> {{ article.date }}</span>
              <span><i class="fas fa-eye"></i> {{ article.views }}</span>
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
      loading: true,
      searchQuery: '',
      selectedCategory: 'all',
      currentPage: 1,
      itemsPerPage: 6,
      categories: [
        { id: 'all', name: 'Tất cả', icon: 'fas fa-globe' },
        { id: 'warning', name: 'Cảnh báo', icon: 'fas fa-exclamation-triangle' },
        { id: 'forecast', name: 'Dự báo', icon: 'fas fa-cloud-sun-rain' },
        { id: 'disaster', name: 'Thiên tai', icon: 'fas fa-water' },
        { id: 'climate', name: 'Khí hậu', icon: 'fas fa-temperature-high' }
      ],
      news: [
        {
          id: 1,
          categoryId: 'warning',
          title: 'Cảnh báo mưa lớn tại các tỉnh miền Trung trong 3 ngày tới',
          excerpt: 'Trung tâm Dự báo KTTV Quốc gia cho biết, từ ngày 27-29/05/2025, khu vực các tỉnh từ Hà Tĩnh đến Quảng Nam sẽ có mưa vừa, mưa to và dông với lượng mưa phổ biến 100-200mm.',
          image: 'https://i.ex-cdn.com/nongnghiep.vn/files/content/2024/11/02/mua-lon-ca-nuoc-18979453671048748198292-06580862852705703894030-114713_228-175720.jpeg',
          date: '26/05/2025',
          author: 'Nguyễn Văn A',
          views: 1250,
          link: '/tin-tuc/canh-bao-mua-lon-mien-trung'
        },
        {
          id: 2,
          categoryId: 'forecast',
          title: 'Dự báo nắng nóng gay gắt tại Bắc Bộ và Trung Bộ',
          excerpt: 'Trong những ngày tới, khu vực Bắc Bộ và Trung Bộ tiếp tục có nắng nóng và nắng nóng gay gắt với nhiệt độ cao nhất phổ biến 35-38 độ, có nơi trên 39 độ.',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_6WciZSg-VPaGpS6pIx9IAgE0Dl_2Hv2_7w&s',
          date: '25/05/2025',
          author: 'Trần Thị B',
          views: 980,
          link: '/tin-tuc/nang-nong-gay-gat-bac-bo-trung-bo'
        },
        {
          id: 3,
          categoryId: 'disaster',
          title: 'Bão Sanba gây thiệt hại nặng nề tại Philippines',
          excerpt: 'Cơn bão Sanba đã đổ bộ vào miền Trung Philippines gây thiệt hại nặng nề về người và tài sản. Theo cảnh báo, bão có thể di chuyển về phía Biển Đông trong những ngày tới.',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVK2Y1r218QQDeH9kM0n_LsBbuhQHDuw8lGg&s',
          date: '24/05/2025',
          author: 'Lê Văn C',
          views: 1520,
          link: '/tin-tuc/bao-sanba-gay-thiet-hai'
        },
        {
          id: 4,
          categoryId: 'climate',
          title: 'Biến đổi khí hậu làm tăng tần suất mưa cực đoan ở Việt Nam',
          excerpt: 'Nghiên cứu mới đây cho thấy biến đổi khí hậu đang làm tăng tần suất và cường độ các hiện tượng mưa cực đoan tại Việt Nam, đặc biệt là ở các tỉnh miền Trung.',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5UOADbmJevGUimOBfssYNhpVLfTdHtAIfIg&s',
          date: '23/05/2025',
          author: 'Phạm Văn D',
          views: 850,
          link: '/tin-tuc/bien-doi-khi-hau-tang-mua-cuc-doan'
        },
        {
          id: 5,
          categoryId: 'warning',
          title: 'Cảnh báo lốc xoáy và gió giật mạnh tại Nam Bộ',
          excerpt: 'Trung tâm Dự báo KTTV Quốc gia phát đi cảnh báo về hiện tượng lốc xoáy, sét và gió giật mạnh có thể xảy ra tại các tỉnh Nam Bộ trong chiều và tối nay.',
          image: 'https://cdn.quangnam.gov.vn/2023/09/24/852108b6-c056-40ec-93d7-7dd1d981b49c.jpeg',
          date: '22/05/2025',
          author: 'Nguyễn Thị E',
          views: 720,
          link: '/tin-tuc/canh-bao-loc-xoay-nam-bo'
        },
        {
          id: 6,
          categoryId: 'forecast',
          title: 'Dự báo thời tiết Hà Nội: Mưa rào và dông vào buổi chiều',
          excerpt: 'Theo dự báo, thời tiết Hà Nội trong 5 ngày tới sẽ có mưa rào và dông vào buổi chiều, nhiệt độ dao động từ 28-35 độ C, đề phòng khả năng xảy ra lốc, sét và gió giật mạnh.',
          image: 'https://static.kinhtedothi.vn/w960/images/upload/2022/06/07/ha-noi-mua-rao-va-dong-chieu-va-dem.jpg',
          date: '21/05/2025',
          author: 'Trần Văn F',
          views: 950,
          link: '/tin-tuc/du-bao-thoi-tiet-ha-noi'
        },
        {
          id: 7,
          categoryId: 'disaster',
          title: 'Sạt lở đất tại Lào Cai sau mưa lớn kéo dài',
          excerpt: 'Mưa lớn kéo dài những ngày qua đã gây ra tình trạng sạt lở đất nghiêm trọng tại một số khu vực thuộc tỉnh Lào Cai, khiến 2 người mất tích và nhiều nhà dân bị hư hại.',
          image: 'https://media.vietnamplus.vn/images/7255a701687d11cb8c6bbc58a6c8078520ec3364efc2a0322da559627e42c8b02700545efc91b3de6ef1b9af6bc0ecfb/sat_lo.jpg',
          date: '20/05/2025',
          author: 'Hoàng Văn G',
          views: 1100,
          link: '/tin-tuc/sat-lo-dat-lao-cai'
        },
        {
          id: 8,
          categoryId: 'climate',
          title: 'Mực nước biển dâng cao đe dọa vùng ven biển Việt Nam',
          excerpt: 'Báo cáo mới nhất của Bộ Tài nguyên và Môi trường cho thấy mực nước biển tại Việt Nam đang dâng cao với tốc độ khoảng 3mm/năm, đe dọa các vùng trũng thấp ven biển.',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8QhfnY3RTkHzk7cZBMDnG4jbham_qEGbgYQ&s',
          date: '19/05/2025',
          author: 'Lê Thị H',
          views: 830,
          link: '/tin-tuc/muc-nuoc-bien-dang-cao'
        },
        {
          id: 9,
          categoryId: 'warning',
          title: 'Cảnh báo nguy cơ cháy rừng cấp cực kỳ nguy hiểm tại Tây Nguyên',
          excerpt: 'Cục Kiểm lâm (Bộ NN&PTNT) vừa phát đi cảnh báo nguy cơ cháy rừng cấp cực kỳ nguy hiểm tại các tỉnh khu vực Tây Nguyên do thời tiết nắng nóng kéo dài.',
          image: 'https://file1.dangcongsan.vn/DATA/0/2016/02/chay_rung-10_51_47_022.jpg',
          date: '18/05/2025',
          author: 'Nguyễn Văn I',
          views: 760,
          link: '/tin-tuc/nguy-co-chay-rung-tay-nguyen'
        },
        {
          id: 10,
          categoryId: 'forecast',
          title: 'Dự báo thời tiết mùa hè 2025: Nắng nóng gay gắt và kéo dài',
          excerpt: 'Trung tâm Dự báo KTTV Quốc gia nhận định mùa hè năm 2025 sẽ có nhiều đợt nắng nóng gay gắt và kéo dài hơn so với trung bình nhiều năm do ảnh hưởng của hiện tượng El Nino.',
          image: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2025/3/2/1471025/Nang-Gay-Gat.jpeg?w=800&h=420&crop=auto&scale=both',
          date: '17/05/2025',
          author: 'Phạm Thị K',
          views: 1320,
          link: '/tin-tuc/du-bao-thoi-tiet-mua-he-2025'
        }
      ]
    };
  },
  computed: {
    filteredNews() {
      let result = [...this.news];
      
      // Lọc theo danh mục
      if (this.selectedCategory !== 'all') {
        result = result.filter(article => article.categoryId === this.selectedCategory);
      }
      
      // Lọc theo từ khóa tìm kiếm
      if (this.searchQuery.trim() !== '') {
        const searchLower = this.searchQuery.toLowerCase();
        result = result.filter(article => 
          article.title.toLowerCase().includes(searchLower) || 
          article.excerpt.toLowerCase().includes(searchLower)
        );
      }
      
      return result;
    },
    displayedNews() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredNews.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredNews.length / this.itemsPerPage);
    },
    trendingNews() {
      // Lấy 5 tin có lượt xem cao nhất
      return [...this.news]
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);
    }
  },
  mounted() {
    // Giả lập việc tải dữ liệu từ API
    setTimeout(() => {
      this.loading = false;
    }, 1500);
  },
  methods: {
    filterNews() {
      this.currentPage = 1; // Reset về trang đầu tiên khi lọc
    },
    
    selectCategory(categoryId) {
      this.selectedCategory = categoryId;
      this.currentPage = 1; // Reset về trang đầu tiên khi thay đổi danh mục
    },
    
    resetFilters() {
      this.searchQuery = '';
      this.selectedCategory = 'all';
      this.currentPage = 1;
    },
    
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    
    getCategoryName(categoryId) {
      const category = this.categories.find(cat => cat.id === categoryId);
      return category ? category.name : '';
    }
  }
};
</script>

<style scoped>
.news-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
}

.news-header {
  grid-column: 1 / -1;
}

.news-header h1 {
  color: #1565C0;
  font-size: 2rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.news-header h1 i {
  margin-right: 10px;
}

.news-filters {
  margin-bottom: 30px;
}

.search-box {
  display: flex;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
}

.search-box input {
  flex: 1;
  padding: 12px 15px;
  border: none;
  font-size: 16px;
}

.search-box button {
  background-color: #1565C0;
  color: white;
  border: none;
  padding: 0 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-box button:hover {
  background-color: #0D47A1;
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-btn {
  padding: 8px 15px;
  border: none;
  border-radius: 20px;
  background-color: #f0f0f0;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
}

.category-btn i {
  margin-right: 6px;
}

.category-btn:hover {
  background-color: #e0e0e0;
}

.category-btn.active {
  background-color: #1565C0;
  color: white;
}

.news-content {
  grid-column: 1 / 2;
}

.loading-container {
  text-align: center;
  padding: 50px 0;
}

.spinner {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 5px solid rgba(21, 101, 192, 0.1);
  border-radius: 50%;
  border-top-color: #1565C0;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.no-news {
  text-align: center;
  padding: 50px 0;
  color: #666;
}

.no-news i {
  font-size: 40px;
  color: #1565C0;
  margin-bottom: 15px;
}

.reset-btn {
  background-color: #1565C0;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  margin-top: 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.reset-btn:hover {
  background-color: #0D47A1;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.news-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.news-image {
  position: relative;
  height: 180px;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-date {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.news-category {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #1565C0;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.news-details {
  padding: 15px;
}

.news-details h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 18px;
  line-height: 1.3;
  color: #333;
}

.news-details p {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 15px;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #888;
  margin-bottom: 15px;
}

.news-meta span {
  display: flex;
  align-items: center;
}

.news-meta i {
  margin-right: 5px;
}

.read-more-btn {
  display: inline-flex;
  align-items: center;
  background-color: transparent;
  color: #1565C0;
  border: 1px solid #1565C0;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.3s;
}

.read-more-btn i {
  margin-left: 5px;
  transition: transform 0.3s;
}

.read-more-btn:hover {
  background-color: #1565C0;
  color: white;
}

.read-more-btn:hover i {
  transform: translateX(3px);
}

.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.page-btn {
  background-color: transparent;
  border: 1px solid #ccc;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn:not(:disabled):hover {
  background-color: #f0f0f0;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.page-number {
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.3s;
}

.page-number:hover {
  background-color: #f0f0f0;
}

.page-number.active {
  background-color: #1565C0;
  color: white;
  border-color: #1565C0;
}

/* Styles for trending news sidebar */
.trending-news {
  grid-column: 2 / 3;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  align-self: start;
}

.trending-news h2 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #1565C0;
  font-size: 1.2rem;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.trending-item {
  display: flex;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.trending-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.trending-number {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: #1565C0;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-right: 10px;
  flex-shrink: 0;
}

.trending-content {
  flex: 1;
}

.trending-content h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
  line-height: 1.3;
}

.trending-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
}

/* Customize colors for different categories */
.category-warning .news-category {
  background-color: #FF5722;
}

.category-forecast .news-category {
  background-color: #2196F3;
}

.category-disaster .news-category {
  background-color: #F44336;
}

.category-climate .news-category {
  background-color: #4CAF50;
}

/* Responsive design */
@media (max-width: 992px) {
  .news-container {
    grid-template-columns: 1fr;
  }
  
  .trending-news {
    grid-column: 1 / -1;
    margin-top: 30px;
  }
}

@media (max-width: 768px) {
  .news-grid {
    grid-template-columns: 1fr;
  }
  
  .category-filters {
    overflow-x: auto;
    padding-bottom: 10px;
    flex-wrap: nowrap;
  }
  
  .category-btn {
    white-space: nowrap;
  }
}
</style>