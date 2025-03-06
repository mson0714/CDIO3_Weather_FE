<template>
  <div class="flood-warning-container">
    <!-- Header -->
    <div class="page-header">
      <h1><i class="fas fa-water"></i> Cảnh Báo Lũ Lụt</h1>
      <div class="header-actions">
        <div class="location-search">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Tìm kiếm theo tỉnh, huyện..."
            @keyup.enter="searchWarnings"
          />
          <button class="search-btn" @click="searchWarnings">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div class="loading-container" v-if="loading">
      <div class="spinner"></div>
      <p>Đang tải dữ liệu cảnh báo lũ lụt...</p>
    </div>

    <!-- Error state -->
    <div class="error-container" v-else-if="error">
      <i class="fas fa-exclamation-circle"></i>
      <h3>Không thể tải dữ liệu cảnh báo</h3>
      <p>{{ error }}</p>
      <button class="retry-btn" @click="fetchWarnings">
        <i class="fas fa-sync-alt"></i> Thử lại
      </button>
    </div>

    <!-- No warnings state -->
    <!-- Thay thế -->
    <div class="no-warnings" v-else-if="warnings.length === 0">
      <i class="fas fa-check-circle text-success" style="font-size: 64px"></i>
      <h3>Không có cảnh báo lũ lụt nào</h3>
      <p>Hiện tại không có cảnh báo lũ lụt nào cho khu vực này.</p>
    </div>

    <!-- Has warnings -->
    <div v-else>
      <!-- Warning summary -->
      <div class="warning-summary">
        <div class="warning-count">
          <h3>{{ warnings.length }} cảnh báo lũ lụt hiện tại</h3>
          <div class="severity-indicators">
            <div class="severity high">
              <span class="dot"></span>
              <span>{{ countBySeverity("high") }} Nghiêm trọng</span>
            </div>
            <div class="severity medium">
              <span class="dot"></span>
              <span>{{ countBySeverity("medium") }} Trung bình</span>
            </div>
            <div class="severity low">
              <span class="dot"></span>
              <span>{{ countBySeverity("low") }} Nhẹ</span>
            </div>
          </div>
        </div>
        <div class="last-updated">
          <i class="far fa-clock"></i> Cập nhật lần cuối: {{ lastUpdated }}
        </div>
      </div>

      <!-- Warnings list -->
      <div class="warnings-list">
        <div
          v-for="warning in warnings"
          :key="warning.id"
          class="warning-card"
          :class="`severity-${warning.severity}`"
          @click="showWarningDetails(warning)"
        >
          <div class="warning-header">
            <span class="severity-badge" :class="warning.severity">
              {{ getSeverityText(warning.severity) }}
            </span>
            <div class="warning-location">
              <div class="location">
                {{ warning.district }}, {{ warning.province }}
              </div>
              <div class="time">{{ formatDate(warning.timestamp) }}</div>
            </div>
          </div>
          <div class="warning-body">
            <!-- Thay thế phần hiển thị icon -->
            <div class="warning-icon">
              <i
                :class="getWarningIconClass(warning.type)"
                aria-hidden="true"
              ></i>
            </div>
            <div class="warning-content">
              <h3>{{ warning.title }}</h3>
              <p>{{ truncateText(warning.description, 150) }}</p>
              <div class="metrics">
                <div class="metric">
                  <i class="fas fa-ruler-vertical"></i>
                  <span>Mực nước: {{ warning.waterLevel }}m</span>
                </div>
                <div class="metric">
                  <i class="fas fa-tint"></i>
                  <span>Lượng mưa: {{ warning.rainfall }}mm</span>
                </div>
              </div>
              <div class="warning-source">
                Nguồn: {{ warning.source || "Trung tâm Dự báo KTTV Quốc gia" }}
              </div>
            </div>
          </div>
          <div class="warning-footer">
            <button class="details-btn">
              Chi tiết <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Flood map -->
      <div class="flood-map-container">
        <h2><i class="fas fa-map-marked-alt"></i> Bản đồ cảnh báo lũ lụt</h2>
        <div class="map-wrapper">
          <div id="flood-map"></div>
          <div class="map-controls">
            <button @click="centerMapToVietnam">
              <i class="fas fa-home"></i> Việt Nam
            </button>
            <button @click="toggleMapLayers">
              <i class="fas fa-cloud-rain"></i>
              {{ showRainLayer ? "Ẩn lớp mưa" : "Hiện lớp mưa" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Warning details modal -->
      <div
        class="warning-modal-backdrop"
        v-if="selectedWarning"
        @click.self="closeWarningDetails"
      >
        <div class="warning-modal">
          <div
            class="modal-header"
            :class="`severity-${selectedWarning.severity}`"
          >
            <h2>{{ selectedWarning.title }}</h2>
            <button class="close-btn" @click="closeWarningDetails">
              &times;
            </button>
          </div>
          <div class="modal-body">
            <div class="warning-details">
              <div class="detail-group">
                <h3>Thông tin cơ bản</h3>
                <div class="detail-item">
                  <strong>Khu vực:</strong> {{ selectedWarning.district }},
                  {{ selectedWarning.province }}
                </div>
                <div class="detail-item">
                  <strong>Mức độ:</strong>
                  <span class="severity-text" :class="selectedWarning.severity">
                    {{ getSeverityText(selectedWarning.severity) }}
                  </span>
                </div>
                <div class="detail-item">
                  <strong>Thời gian:</strong>
                  {{ formatDate(selectedWarning.timestamp, true) }}
                </div>
                <div class="detail-item">
                  <strong>Loại lũ:</strong>
                  {{ getWarningTypeText(selectedWarning.type) }}
                </div>
              </div>

              <div class="detail-group">
                <h3>Đo lường</h3>
                <div class="measurements">
                  <div class="measurement">
                    <div class="measurement-icon">
                      <i class="fas fa-ruler-vertical"></i>
                    </div>
                    <div>
                      <div class="measurement-value">
                        {{ selectedWarning.waterLevel }}m
                      </div>
                      <div class="measurement-label">Mực nước</div>
                    </div>
                  </div>
                  <div class="measurement">
                    <div class="measurement-icon">
                      <i class="fas fa-tint"></i>
                    </div>
                    <div>
                      <div class="measurement-value">
                        {{ selectedWarning.rainfall }}mm
                      </div>
                      <div class="measurement-label">Lượng mưa</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="detail-group">
                <h3>Mô tả chi tiết</h3>
                <p>{{ selectedWarning.description }}</p>
              </div>

              <div class="detail-group">
                <h3>Khuyến nghị</h3>
                <ul class="recommendations">
                  <li
                    v-for="(rec, index) in selectedWarning.recommendations"
                    :key="index"
                  >
                    {{ rec }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="warning-location-map">
              <div id="detail-map" class="detail-map"></div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              class="evacuation-btn"
              v-if="selectedWarning.severity === 'high'"
            >
              <i class="fas fa-route"></i> Xem tuyến sơ tán
            </button>
            <button class="share-btn">
              <i class="fas fa-share-alt"></i> Chia sẻ
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';


export default {
  data() {
    return {
      loading: true,
      error: null,
      searchQuery: "",
      warnings: [],
      selectedWarning: null,
      lastUpdated: "",
      map: null,
      detailMap: null,
      warningMarkers: [],
      showRainLayer: false,
      rainLayer: null,
    };
  },
  mounted() {
    console.log("Component đã được mount");
    this.fetchWarnings();

    // KHÔNG gọi initializeMap() ở đây
    // Thay vào đó, nó sẽ được gọi sau khi dữ liệu đã được tải
  },
  methods: {
    getWarningIconClass(type) {
      const iconClasses = {
        "flash-flood": "fas fa-bolt text-danger fa-2x",
        "river-flood": "fas fa-water text-primary fa-2x",
        "urban-flood": "fas fa-city text-warning fa-2x",
        "coastal-flood": "fas fa-umbrella-beach text-info fa-2x",
      };
      return iconClasses[type] || "fas fa-exclamation-triangle fa-2x";
    },
    async fetchWarnings() {
      this.loading = true;
      this.error = null;

      try {
        setTimeout(() => {
          this.warnings = this.getMockWarnings();
          console.log("Cảnh báo đã tải:", this.warnings);
          this.lastUpdated = new Date().toLocaleString("vi-VN");
          this.loading = false;

          // Đảm bảo khởi tạo bản đồ sau khi dữ liệu đã được tải và DOM đã được cập nhật
          this.$nextTick(() => {
            console.log("DOM đã cập nhật, khởi tạo bản đồ");
            this.initializeMap();
          });
        }, 1500);
      } catch (error) {
        this.error =
          "Không thể kết nối đến máy chủ dữ liệu. Vui lòng thử lại sau.";
        this.loading = false;
      }
    },

    searchWarnings() {
      if (!this.searchQuery.trim()) {
        return this.fetchWarnings();
      }

      const query = this.searchQuery.toLowerCase().trim();
      const filteredWarnings = this.getMockWarnings().filter((warning) => {
        return (
          warning.province.toLowerCase().includes(query) ||
          warning.district.toLowerCase().includes(query) ||
          warning.title.toLowerCase().includes(query)
        );
      });

      this.warnings = filteredWarnings;
      this.displayWarningsOnMap();
    },

        // Cập nhật phương thức initializeMap để sử dụng mapbox-gl-leaflet đúng cách
        initializeMap() {
      // Xóa map cũ nếu đã tồn tại
      if (this.map) {
        this.map.remove();
      }
    
      // Kiểm tra phần tử DOM
      const mapElement = document.getElementById("flood-map");
      if (!mapElement) {
        console.error("Không tìm thấy phần tử #flood-map!");
        return;
      }
    
      console.log("Khởi tạo bản đồ MapBox");
    
      // Đảm bảo kích thước phần tử
      if (mapElement.clientHeight === 0) {
        mapElement.style.height = "500px";
      }
    
      try {
        // Token và style MapBox của bạn
        const MAPBOX_TOKEN = 'pk.eyJ1IjoibW9uaHNpbjA3MDEiLCJhIjoiY20zc3B5dGNrMDA5YzJqb2doOWxoa3I1dyJ9.Nl45MggpNqjbB2_w-rVUqg';
        mapboxgl.accessToken = MAPBOX_TOKEN;
    
        // Khởi tạo MapBox map với style custom của bạn
        this.map = new mapboxgl.Map({
          container: 'flood-map',
          style: 'mapbox://styles/monhsin0701/cm3sr6yzn009701s81bbp34rg',
          center: [106.0, 16.0], // [lng, lat] - MapBox sử dụng thứ tự ngược với Leaflet
          zoom: 6
        });
    
        // Thêm controls
        this.map.addControl(new mapboxgl.NavigationControl());
    
        // Sự kiện khi map đã load xong
        this.map.on('load', () => {
          // Thêm lớp mưa (rainfall layer) nếu cần
          this.setupRainLayer();
          
          // Thêm các marker cảnh báo
          if (this.warnings.length > 0) {
            this.displayWarningsOnMap();
          }
    
          // Thêm dữ liệu về Hoàng Sa, Trường Sa
          this.addTerritorialFeatures();
        });
      } catch (error) {
        console.error("Lỗi khởi tạo bản đồ:", error);
      }
    },
    displayWarningsOnMap() {
      if (!this.map || !this.warnings.length) return;

      // Xóa các marker cũ nếu có
      if (this.warningMarkers && this.warningMarkers.length) {
        this.warningMarkers.forEach((marker) => marker.remove());
      }

      this.warningMarkers = [];

      // Định nghĩa biểu tượng cho các mức độ cảnh báo
      const severityIcons = {
        high: L.divIcon({
          html: '<i class="fas fa-exclamation-triangle" style="color:red;font-size:24px;"></i>',
          className: "warning-marker high",
          iconSize: [30, 30],
        }),
        medium: L.divIcon({
          html: '<i class="fas fa-exclamation-circle" style="color:orange;font-size:24px;"></i>',
          className: "warning-marker medium",
          iconSize: [30, 30],
        }),
        low: L.divIcon({
          html: '<i class="fas fa-info-circle" style="color:yellow;font-size:24px;"></i>',
          className: "warning-marker low",
          iconSize: [30, 30],
        }),
      };

      // Thêm marker cho mỗi cảnh báo
      this.warnings.forEach((warning) => {
        if (warning.coordinates) {
          const marker = L.marker(
            [warning.coordinates.lat, warning.coordinates.lng],
            {
              icon: severityIcons[warning.severity] || severityIcons.low,
            }
          ).addTo(this.map).bindPopup(`
              <div class="warning-popup">
                <h4>${warning.title}</h4>
                <div class="popup-location">${warning.district}, ${warning.province}</div>
                <div class="popup-metrics">
                  <div><i class="fas fa-ruler-vertical"></i> ${warning.waterLevel} m</div>
                  <div><i class="fas fa-tint"></i> ${warning.rainfall} mm</div>
                </div>
                <button class="popup-details-btn" onclick="document.dispatchEvent(new CustomEvent('show-warning-details', {detail: ${warning.id}}))">
                  Chi tiết
                </button>
              </div>
            `);

          this.warningMarkers.push(marker);
        }
      });

      // Lắng nghe sự kiện từ popup để hiển thị chi tiết
      document.addEventListener("show-warning-details", (event) => {
        const warningId = event.detail;
        const warning = this.warnings.find((w) => w.id === warningId);
        if (warning) {
          this.showWarningDetails(warning);
        }
      });
    },

    centerMapToVietnam() {
      if (this.map) {
        this.map.setView([16.0, 106.0], 6);
      }
    },
        setupRainLayer() {
      // Đảm bảo map đã được khởi tạo
      if (!this.map) return;
    
      // Thêm nguồn dữ liệu cho lớp mưa
      this.map.addSource('rainfall', {
        type: 'raster',
        tiles: [
          'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=9c0b68c69792a1544c52532b132f7a8f'
        ],
        tileSize: 256,
        attribution: 'OpenWeatherMap'
      });
    
      // Thêm lớp mưa (không hiển thị ban đầu)
      this.map.addLayer({
        id: 'rainfall-layer',
        type: 'raster',
        source: 'rainfall',
        paint: {
          'raster-opacity': 0.6
        },
        layout: {
          visibility: 'none'
        }
      });
    
      this.rainLayer = 'rainfall-layer';
    },
        displayWarningsOnMap() {
      // Đảm bảo map đã được khởi tạo
      if (!this.map || !this.warnings.length) return;
    
      // Xóa markers cũ nếu có
      if (this.warningMarkers && this.warningMarkers.length) {
        this.warningMarkers.forEach(marker => marker.remove());
      }
    
      this.warningMarkers = [];
    
      // Tạo và thêm các markers mới
      this.warnings.forEach(warning => {
        if (warning.coordinates) {
          // Tạo phần tử HTML cho marker
          const el = document.createElement('div');
          el.className = `warning-marker ${warning.severity}`;
          
          // Thêm icon tùy theo loại cảnh báo
          el.innerHTML = `<i class="fas fa-${this.getWarningIconType(warning.type)}" style="color:${this.getSeverityColor(warning.severity)};font-size:24px;"></i>`;
    
          // Tạo popup
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="warning-popup">
                <h4>${warning.title}</h4>
                <div class="popup-location">${warning.district}, ${warning.province}</div>
                <div class="popup-metrics">
                  <div><i class="fas fa-ruler-vertical"></i> ${warning.waterLevel} m</div>
                  <div><i class="fas fa-tint"></i> ${warning.rainfall} mm</div>
                </div>
                <button class="popup-details-btn" onclick="document.dispatchEvent(new CustomEvent('show-warning-details', {detail: ${warning.id}}))">
                  Chi tiết
                </button>
              </div>
            `);
    
          // Tạo và thêm marker
          const marker = new mapboxgl.Marker(el)
            .setLngLat([warning.coordinates.lng, warning.coordinates.lat])
            .setPopup(popup)
            .addTo(this.map);
    
          this.warningMarkers.push(marker);
        }
      });
    
      // Lắng nghe sự kiện từ popup để hiển thị chi tiết
      document.addEventListener("show-warning-details", (event) => {
        const warningId = event.detail;
        const warning = this.warnings.find((w) => w.id === warningId);
        if (warning) {
          this.showWarningDetails(warning);
        }
      });
    },

       toggleMapLayers() {
      if (!this.map || !this.rainLayer) return;
    
      this.showRainLayer = !this.showRainLayer;
      
      // Thay đổi visibility của lớp mưa
      this.map.setLayoutProperty(
        this.rainLayer,
        'visibility',
        this.showRainLayer ? 'visible' : 'none'
      );
    },
    
    centerMapToVietnam() {
      if (this.map) {
        this.map.flyTo({
          center: [106.0, 16.0],
          zoom: 6,
          essential: true
        });
      }
    },

        // Cập nhật phương thức showWarningDetails để sử dụng MapBox
       // Cập nhật phương thức showWarningDetails
        showWarningDetails(warning) {
      this.selectedWarning = warning;
    
      // Tạo bản đồ chi tiết sau khi modal được hiển thị
      this.$nextTick(() => {
        if (this.detailMap) {
          this.detailMap.remove();
        }
    
        const mapboxToken = 'pk.eyJ1IjoibW9uaHNpbjA3MDEiLCJhIjoiY20zc3B5dGNrMDA5YzJqb2doOWxoa3I1dyJ9.Nl45MggpNqjbB2_w-rVUqg';
        mapboxgl.accessToken = mapboxToken;
    
        // Khởi tạo MapBox map với style custom của bạn
        this.detailMap = new mapboxgl.Map({
          container: 'detail-map',
          style: 'mapbox://styles/monhsin0701/cm3sr6yzn009701s81bbp34rg',
          center: [warning.coordinates.lng, warning.coordinates.lat],
          zoom: 12
        });
    
        // Thêm controls
        this.detailMap.addControl(new mapboxgl.NavigationControl());
    
        // Sự kiện khi map đã load xong
        this.detailMap.on('load', () => {
          // Tạo phần tử HTML cho marker
          const el = document.createElement('div');
          el.className = `warning-marker-detail ${warning.severity}`;
          el.innerHTML = `<i class="fas fa-${this.getWarningIconType(warning.type)}" style="color:${this.getSeverityColor(warning.severity)};font-size:24px;"></i>`;
    
          // Thêm marker
          new mapboxgl.Marker(el)
            .setLngLat([warning.coordinates.lng, warning.coordinates.lat])
            .setPopup(new mapboxgl.Popup({ offset: 25 })
              .setHTML(`<b>${warning.title}</b><br>${warning.district}, ${warning.province}`))
            .addTo(this.detailMap)
            .togglePopup();
    
          // Thêm vùng ảnh hưởng - circle
          const radius = this.getImpactRadius(warning);
          
          // Thêm nguồn dữ liệu cho circle
          this.detailMap.addSource('impact-area', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [warning.coordinates.lng, warning.coordinates.lat]
              },
              properties: {
                radius: radius * 1000 // Chuyển km thành m
              }
            }
          });
    
          // Thêm lớp circle
          this.detailMap.addLayer({
            id: 'impact-area-fill',
            type: 'circle',
            source: 'impact-area',
            paint: {
              'circle-radius': ['get', 'radius'],
              'circle-color': this.getSeverityColor(warning.severity),
              'circle-opacity': 0.2,
              'circle-stroke-color': this.getSeverityColor(warning.severity),
              'circle-stroke-width': 2
            }
          });
        });
      });
    },
    
    // Thêm các phương thức hỗ trợ cho MapBox
    getWarningIconType(type) {
      const icons = {
        'flash-flood': 'bolt',
        'river-flood': 'water',
        'urban-flood': 'city',
        'coastal-flood': 'umbrella-beach'
      };
      return icons[type] || 'exclamation-triangle';
    },
    
    getSeverityColor(severity) {
      const colors = {
        high: '#ff3d00',
        medium: '#ff9100',
        low: '#ffea00'
      };
      return colors[severity] || '#ff3d00';
    },
    
    getImpactRadius(warning) {
      // Tính toán bán kính ảnh hưởng dựa trên mức độ nghiêm trọng và loại lũ
      const baseRadius = {
        'flash-flood': 3,
        'river-flood': 5,
        'urban-flood': 2,
        'coastal-flood': 4
      }[warning.type] || 3;
      
      const severityMultiplier = {
        'high': 1.5,
        'medium': 1,
        'low': 0.7
      }[warning.severity] || 1;
      
      return baseRadius * severityMultiplier;
    },

    closeWarningDetails() {
      this.selectedWarning = null;
      if (this.detailMap) {
        this.detailMap.remove();
        this.detailMap = null;
      }
    },

    countBySeverity(severity) {
      return this.warnings.filter((w) => w.severity === severity).length;
    },

    getSeverityText(severity) {
      const texts = {
        high: "Nghiêm trọng",
        medium: "Trung bình",
        low: "Nhẹ",
      };
      return texts[severity] || "Không xác định";
    },

    formatDate(timestamp, includeTime = false) {
      const date = new Date(timestamp);
      const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };

      if (includeTime) {
        options.hour = "2-digit";
        options.minute = "2-digit";
      }

      return date.toLocaleDateString("vi-VN", options);
    },

    truncateText(text, maxLength) {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + "...";
    },

    // Thay thế phương thức getWarningIcon
    getWarningIcon(type) {
      // Thay vì dùng file, trả về lớp CSS của Font Awesome
      return type; // Sẽ dùng để xác định loại icon dưới dạng lớp CSS
    },

    getWarningTypeText(type) {
      const texts = {
        "flash-flood": "Lũ quét",
        "river-flood": "Lũ sông",
        "urban-flood": "Ngập lụt đô thị",
        "coastal-flood": "Ngập lụt ven biển",
      };
      return texts[type] || "Không xác định";
    },

    // Dữ liệu mẫu cho demo
    getMockWarnings() {
      return [
        {
          id: 1,
          title: "Lũ quét nghiêm trọng tại Mường Lát",
          description:
            "Lũ quét dự kiến sẽ xảy ra trong đêm nay do mưa lớn kéo dài. Người dân cần di chuyển đến nơi an toàn ngay lập tức.",
          severity: "high",
          type: "flash-flood",
          district: "Mường Lát",
          province: "Thanh Hóa",
          waterLevel: 3.8,
          rainfall: 250,
          timestamp: Date.now() - 3600000, // 1 giờ trước
          coordinates: { lat: 20.5067, lng: 104.6288 },
          source: "Trung tâm Dự báo KTTV Quốc gia",
          recommendations: [
            "Di chuyển đến khu vực cao hơn ngay lập tức",
            "Không cố gắng băng qua dòng nước chảy xiết",
            "Chuẩn bị các vật dụng cần thiết và đồ có giá trị",
            "Theo dõi thông báo từ chính quyền địa phương",
          ],
        },
        {
          id: 2,
          title: "Ngập lụt trong khu vực đô thị",
          description:
            "Mưa lớn gây ngập nhiều tuyến đường tại trung tâm thành phố. Các phương tiện nên tránh di chuyển trong các khu vực bị ngập.",
          severity: "medium",
          type: "urban-flood",
          district: "Ninh Kiều",
          province: "Cần Thơ",
          waterLevel: 0.7,
          rainfall: 150,
          timestamp: Date.now() - 7200000, // 2 giờ trước
          coordinates: { lat: 10.0326, lng: 105.787 },
          source: "Đài Khí tượng Thủy văn Cần Thơ",
          recommendations: [
            "Không đi vào khu vực ngập nước",
            "Tránh sử dụng các thiết bị điện trong khu vực bị ngập",
            "Theo dõi thông tin giao thông và lựa chọn đường đi thay thế",
          ],
        },
        {
          id: 3,
          title: "Lũ sông Hương vượt báo động cấp 2",
          description:
            "Mực nước sông Hương đã vượt mức báo động cấp 2 và tiếp tục dâng cao. Các hộ dân ven sông cần cảnh giác và có kế hoạch di dời nếu cần.",
          severity: "medium",
          type: "river-flood",
          district: "Phú Vang",
          province: "Thừa Thiên Huế",
          waterLevel: 3.2,
          rainfall: 180,
          timestamp: Date.now() - 14400000, // 4 giờ trước
          coordinates: { lat: 16.4673, lng: 107.6001 },
          source: "Đài Khí tượng Thủy văn Thừa Thiên Huế",
          recommendations: [
            "Theo dõi mực nước sông liên tục",
            "Chuẩn bị sẵn sàng việc di dời nếu nước tiếp tục dâng cao",
            "Đảm bảo an toàn cho người già và trẻ em",
            "Di chuyển tài sản, vật nuôi lên cao",
          ],
        },
        {
          id: 4,
          title: "Cảnh báo ngập ven biển khi thủy triều dâng cao",
          description:
            "Dự báo thủy triều dâng cao kết hợp với mưa lớn gây ngập các khu vực ven biển từ tối nay đến sáng mai.",
          severity: "low",
          type: "coastal-flood",
          district: "Vũng Tàu",
          province: "Bà Rịa - Vũng Tàu",
          waterLevel: 1.2,
          rainfall: 80,
          timestamp: Date.now() - 28800000, // 8 giờ trước
          coordinates: { lat: 10.346, lng: 107.0843 },
          source: "Đài Khí tượng Thủy văn Nam Bộ",
          recommendations: [
            "Hạn chế ra khơi đánh bắt hải sản",
            "Tránh các hoạt động gần bờ biển khi thủy triều dâng cao",
            "Bảo vệ tài sản và nhà cửa ở khu vực ven biển",
          ],
        },
        {
          id: 5,
          title: "Lũ quét tại các huyện miền núi",
          description:
            "Cảnh báo lũ quét và sạt lở đất tại các huyện miền núi do mưa lớn kéo dài trong những ngày qua.",
          severity: "high",
          type: "flash-flood",
          district: "Sa Pa",
          province: "Lào Cai",
          waterLevel: 2.5,
          rainfall: 220,
          timestamp: Date.now() - 43200000, // 12 giờ trước
          coordinates: { lat: 22.3363, lng: 103.8384 },
          source: "Trung tâm Dự báo KTTV Quốc gia",
          recommendations: [
            "Di chuyển khỏi khu vực có nguy cơ sạt lở",
            "Không đi qua các khu vực đồi núi dốc trong thời gian mưa lớn",
            "Theo dõi thông báo từ chính quyền địa phương",
            "Chuẩn bị phương án di tản khẩn cấp",
          ],
        },
      ];
    },
  },
    beforeUnmount() {
    // Dọn dẹp map khi component bị hủy
    if (this.map) {
      this.map.remove();
    }
    if (this.detailMap) {
      this.detailMap.remove();
    }
    
    // Xóa event listener
    document.removeEventListener("show-warning-details", this.showWarningDetails);
  },
};
</script>
<style scoped>
/* CSS cho MapBox markers */
.warning-marker {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.warning-marker-detail {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Các style khác giữ nguyên */
.flood-warning-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Roboto", sans-serif;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h1 {
  color: #0066cc;
  font-size: 2rem;
  margin: 0;
  display: flex;
  align-items: center;
}

.page-header h1 i {
  margin-right: 10px;
  color: #0077ff;
}

.header-actions {
  display: flex;
  align-items: center;
}

.location-search {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 25px;
  padding: 5px 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.location-search input {
  border: none;
  background: transparent;
  padding: 8px 0;
  width: 250px;
  font-size: 16px;
  outline: none;
}

.search-btn {
  background: none;
  border: none;
  color: #0066cc;
  cursor: pointer;
  padding: 8px;
}

/* Loading state */
.loading-container {
  text-align: center;
  padding: 50px 0;
}

.spinner {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #0066cc;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Error state */
.error-container {
  text-align: center;
  background-color: #fff4f4;
  border-radius: 10px;
  padding: 30px;
  margin: 20px 0;
  color: #d32f2f;
}

.error-container i {
  font-size: 36px;
  margin-bottom: 15px;
}

.retry-btn {
  background-color: #d32f2f;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  margin-top: 15px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.retry-btn:hover {
  background-color: #b71c1c;
}

/* No warnings state */
.no-warnings {
  text-align: center;
  background-color: #f5f9ff;
  border-radius: 10px;
  padding: 40px;
  margin: 20px 0;
}

.no-warnings img {
  width: 120px;
  margin-bottom: 20px;
}

.no-warnings h3 {
  color: #0066cc;
  margin-bottom: 10px;
}

.no-warnings p {
  color: #666;
}

/* Warning summary */
.warning-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f9ff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}

.warning-count h3 {
  color: #333;
  margin: 0 0 10px 0;
}

.severity-indicators {
  display: flex;
  gap: 20px;
}

.severity {
  display: flex;
  align-items: center;
}

.severity .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

.severity.high .dot {
  background-color: #ff3d00;
}

.severity.medium .dot {
  background-color: #ff9100;
}

.severity.low .dot {
  background-color: #ffea00;
}

.last-updated {
  color: #666;
  font-size: 14px;
}

/* Warnings list */
.warnings-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.warning-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.warning-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.warning-card.severity-high {
  border-top: 4px solid #ff3d00;
}

.warning-card.severity-medium {
  border-top: 4px solid #ff9100;
}

.warning-card.severity-low {
  border-top: 4px solid #ffea00;
}

.warning-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f9f9f9;
}

.severity-badge {
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 12px;
  text-transform: uppercase;
}

.severity-badge.high {
  background-color: #ffebee;
  color: #c62828;
}

.severity-badge.medium {
  background-color: #fff8e1;
  color: #ff8f00;
}

.severity-badge.low {
  background-color: #fffde7;
  color: #ffd600;
}

.location {
  font-size: 14px;
  font-weight: 500;
}

.time {
  font-size: 12px;
  color: #666;
}

.warning-body {
  display: flex;
  padding: 15px;
}

.warning-icon {
  width: 60px;
  height: 60px;
  margin-right: 15px;
  flex-shrink: 0;
}

.warning-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.warning-content h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.warning-content p {
  color: #555;
  font-size: 14px;
  margin-bottom: 10px;
}

.metrics {
  display: flex;
  gap: 15px;
  margin: 15px 0;
}

.metric {
  display: flex;
  align-items: center;
  background-color: #f5f9ff;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
}

.metric i {
  margin-right: 5px;
  color: #0066cc;
}

.warning-source {
  font-size: 12px;
  color: #888;
  font-style: italic;
}

.warning-footer {
  display: flex;
  justify-content: flex-end;
  padding: 10px 15px;
  border-top: 1px solid #eee;
}

.details-btn {
  background-color: transparent;
  color: #0066cc;
  border: 1px solid #0066cc;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.details-btn i {
  margin-left: 5px;
  font-size: 12px;
}

.details-btn:hover {
  background-color: #0066cc;
  color: white;
}

/* Flood map container */
.flood-map-container {
  margin-top: 30px;
}

.flood-map-container h2 {
  color: #333;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.flood-map-container h2 i {
  margin-right: 10px;
  color: #0066cc;
}

.map-wrapper {
  position: relative;
  height: 500px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

#flood-map {
  height: 100%;
  width: 100%;
}

.map-controls {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.map-controls button {
  background-color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.map-controls button:hover {
  background-color: #f5f5f5;
}

.map-controls button i {
  font-size: 14px;
}

/* Warning modal */
.warning-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.warning-modal {
  background-color: white;
  border-radius: 10px;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header.severity-high {
  background-color: #ffebee;
}

.modal-header.severity-medium {
  background-color: #fff8e1;
}

.modal-header.severity-low {
  background-color: #fffde7;
}

.modal-header h2 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #555;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  max-height: 70vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.warning-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-group {
  margin-bottom: 15px;
}

.detail-group h3 {
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-top: 0;
}

.detail-item {
  margin-bottom: 10px;
  font-size: 16px;
}

.detail-item strong {
  display: inline-block;
  width: 120px;
}

.severity-text {
  padding: 3px 8px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 14px;
}

.severity-text.high {
  background-color: #ffebee;
  color: #c62828;
}

.severity-text.medium {
  background-color: #fff8e1;
  color: #ff8f00;
}

.severity-text.low {
  background-color: #fffde7;
  color: #ffd600;
}

.measurements {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.measurement {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 10px;
  flex: 1;
}

.measurement-icon {
  font-size: 24px;
  color: #0066cc;
  margin-right: 15px;
}

.measurement-value {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.measurement-label {
  font-size: 14px;
  color: #666;
}

.recommendations {
  padding-left: 20px;
}

.recommendations li {
  margin-bottom: 8px;
}

.warning-location-map {
  height: 100%;
  min-height: 350px;
}

.detail-map {
  height: 100%;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
}

.modal-footer {
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.evacuation-btn,
.share-btn {
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.evacuation-btn {
  background-color: #d32f2f;
  color: white;
  border: none;
}

.evacuation-btn:hover {
  background-color: #b71c1c;
}

.share-btn {
  background-color: transparent;
  border: 1px solid #555;
  color: #555;
}

.share-btn:hover {
  background-color: #f5f5f5;
}

/* Popup styling */
.warning-popup {
  font-family: "Roboto", sans-serif;
  min-width: 200px;
}

.warning-popup h4 {
  margin: 0 0 5px 0;
  color: #333;
}

.popup-location {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.popup-metrics {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin: 8px 0;
}

.popup-details-btn {
  width: 100%;
  background-color: #0066cc;
  color: white;
  border: none;
  padding: 5px;
  border-radius: 3px;
  margin-top: 5px;
  cursor: pointer;
}

.popup-details-btn:hover {
  background-color: #005bb8;
}

/* Responsive styles */
@media screen and (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    margin-top: 20px;
  }

  .location-search {
    width: 100%;
  }

  .location-search input {
    width: 100%;
  }

  .warnings-list {
    grid-template-columns: 1fr;
  }

  .modal-body {
    grid-template-columns: 1fr;
  }

  .warning-location-map {
    order: -1;
    min-height: 200px;
  }

  .measurements {
    flex-direction: column;
    gap: 10px;
  }
}

/* Fix for marker icon in Leaflet */
.leaflet-div-icon {
  background: transparent;
  border: none;
}

.warning-marker {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Add generic animation for interactive elements */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.warning-card:active {
  animation: pulse 0.3s ease-in-out;
}
</style>