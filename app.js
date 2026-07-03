// ============================================
// Open-Meteo 版本 - 动态自然背景（修复版）
// 修复：下雨隐藏太阳、晚上显示月亮、多云遮挡太阳
// ============================================

class WeatherApp {
  constructor() {
    this.elements = {
      searchInput: document.querySelector('.search-input'),
      searchBtn: document.querySelector('.search-btn'),
      cityName: document.querySelector('.city-name'),
      dateTime: document.querySelector('.date-time'),
      weatherIcon: document.querySelector('.weather-icon'),
      temperature: document.querySelector('.temperature'),
      weatherDesc: document.querySelector('.weather-desc'),
      detailsContainer: document.querySelector('.weather-details'),
      forecastList: document.querySelector('.forecast-list'),
      aqiProgress: document.querySelector('.aqi-progress'),
      aqiBadge: document.querySelector('.aqi-badge'),
      loadingOverlay: document.querySelector('.loading-overlay'),
      errorMessage: document.querySelector('.error-message'),
      app: document.querySelector('.weather-app'),
      // 背景元素
      sun: document.getElementById('sun'),
      moon: document.getElementById('moon'),
      stars: document.getElementById('stars'),
      rain: document.getElementById('rain'),
      snow: document.getElementById('snow'),
      lightning: document.getElementById('lightning'),
      clouds: document.getElementById('clouds')
    };

    this.config = {
      apiBase: 'https://api.open-meteo.com/v1',
      geoBase: 'https://geocoding-api.open-meteo.com/v1',
      defaultCity: 'Beijing',
      defaultLat: 39.9042,
      defaultLon: 116.4074
    };

    this.weatherCodes = {
      0: { desc: 'Clear Sky', icon: 'sun', theme: 'sunny' },
      1: { desc: 'Mainly Clear', icon: 'sun-cloud', theme: 'sunny' },
      2: { desc: 'Partly Cloudy', icon: 'cloud', theme: 'cloudy' },
      3: { desc: 'Overcast', icon: 'cloud', theme: 'cloudy' },
      45: { desc: 'Fog', icon: 'fog', theme: 'foggy' },
      48: { desc: 'Depositing Rime Fog', icon: 'fog', theme: 'foggy' },
      51: { desc: 'Light Drizzle', icon: 'rain', theme: 'rainy' },
      53: { desc: 'Moderate Drizzle', icon: 'rain', theme: 'rainy' },
      55: { desc: 'Dense Drizzle', icon: 'rain', theme: 'rainy' },
      61: { desc: 'Slight Rain', icon: 'rain', theme: 'rainy' },
      63: { desc: 'Moderate Rain', icon: 'rain', theme: 'rainy' },
      65: { desc: 'Heavy Rain', icon: 'rain', theme: 'rainy' },
      71: { desc: 'Slight Snow', icon: 'snow', theme: 'snowy' },
      73: { desc: 'Moderate Snow', icon: 'snow', theme: 'snowy' },
      75: { desc: 'Heavy Snow', icon: 'snow', theme: 'snowy' },
      80: { desc: 'Slight Showers', icon: 'rain', theme: 'rainy' },
      81: { desc: 'Moderate Showers', icon: 'rain', theme: 'rainy' },
      82: { desc: 'Violent Showers', icon: 'rain', theme: 'stormy' },
      95: { desc: 'Thunderstorm', icon: 'storm', theme: 'stormy' },
      96: { desc: 'Thunderstorm with Hail', icon: 'storm', theme: 'stormy' },
      99: { desc: 'Heavy Thunderstorm', icon: 'storm', theme: 'stormy' }
    };

    this.initBackground();
    this.init();
  }

  // 初始化动态背景元素
  initBackground() {
    // 生成星星
    if (this.elements.stars) {
      this.elements.stars.innerHTML = '';
      for (let i = 0; i < 80; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 60}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        star.style.width = `${Math.random() * 3 + 1}px`;
        star.style.height = star.style.width;
        this.elements.stars.appendChild(star);
      }
    }

    // 生成雨滴
    if (this.elements.rain) {
      this.elements.rain.innerHTML = '';
      for (let i = 0; i < 100; i++) {
        const drop = document.createElement('div');
        drop.className = 'raindrop';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDuration = `${Math.random() * 0.5 + 0.5}s`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        drop.style.height = `${Math.random() * 20 + 10}px`;
        this.elements.rain.appendChild(drop);
      }
    }

    // 生成雪花
    if (this.elements.snow) {
      this.elements.snow.innerHTML = '';
      for (let i = 0; i < 50; i++) {
        const flake = document.createElement('div');
        flake.className = 'snowflake';
        flake.innerHTML = '❄';
        flake.style.left = `${Math.random() * 100}%`;
        flake.style.animationDuration = `${Math.random() * 3 + 2}s`;
        flake.style.animationDelay = `${Math.random() * 5}s`;
        flake.style.fontSize = `${Math.random() * 15 + 10}px`;
        flake.style.opacity = Math.random() * 0.6 + 0.4;
        this.elements.snow.appendChild(flake);
      }
    }

    // 生成闪电
    if (this.elements.lightning) {
      this.elements.lightning.innerHTML = '';
      for (let i = 0; i < 3; i++) {
        const bolt = document.createElement('div');
        bolt.className = 'lightning';
        bolt.style.left = `${Math.random() * 80 + 10}%`;
        bolt.style.top = `${Math.random() * 30}%`;
        bolt.style.animationDelay = `${Math.random() * 3}s`;
        this.elements.lightning.appendChild(bolt);
      }
    }

    // 生成云朵
    if (this.elements.clouds) {
      this.elements.clouds.innerHTML = '';
      for (let i = 0; i < 5; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.style.left = `${Math.random() * 80 + 10}%`;
        cloud.style.top = `${Math.random() * 30 + 5}%`;
        cloud.style.animationDelay = `${Math.random() * 10}s`;
        cloud.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
        this.elements.clouds.appendChild(cloud);
      }
    }
  }

  // 更新背景主题 - 核心逻辑：控制太阳/月亮/天气动画的显示隐藏
  updateBackgroundTheme(weatherCode, isDay) {
    const theme = this.weatherCodes[weatherCode]?.theme || 'sunny';
    
    // 设置 body 主题类
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);

    // 判断天气类型
    const isRainy = ['rainy', 'stormy'].includes(theme);
    const isSnowy = theme === 'snowy';
    const isStormy = theme === 'stormy';
    const isCloudy = ['cloudy', 'foggy'].includes(theme);
    const isClear = theme === 'sunny' && (weatherCode === 0 || weatherCode === 1);

    // 控制太阳显示：只有白天 + 非雨天/雪天/暴风雨 才显示
    const showSun = isDay && !isRainy && !isSnowy && !isStormy;
    if (this.elements.sun) {
      this.elements.sun.style.display = showSun ? 'block' : 'none';
      this.elements.sun.style.opacity = isCloudy ? '0.3' : '1'; // 多云时太阳变暗
    }

    // 控制月亮显示：只有晚上 + 非雨天/雪天/暴风雨 才显示
    const showMoon = !isDay && !isRainy && !isSnowy && !isStormy;
    if (this.elements.moon) {
      this.elements.moon.style.display = showMoon ? 'block' : 'none';
    }

    // 控制星星显示：晚上才显示
    if (this.elements.stars) {
      this.elements.stars.style.display = isDay ? 'none' : 'block';
    }

    // 控制雨滴显示
    if (this.elements.rain) {
      this.elements.rain.style.display = isRainy ? 'block' : 'none';
    }

    // 控制雪花显示
    if (this.elements.snow) {
      this.elements.snow.style.display = isSnowy ? 'block' : 'none';
    }

    // 控制闪电显示
    if (this.elements.lightning) {
      this.elements.lightning.style.display = isStormy ? 'block' : 'none';
    }

    // 控制云朵显示
    if (this.elements.clouds) {
      this.elements.clouds.style.display = isCloudy || isRainy ? 'block' : 'none';
    }
  }

  init() {
    this.bindEvents();
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 1000);
    this.loadWeather(this.config.defaultLat, this.config.defaultLon, this.config.defaultCity);
  }

  bindEvents() {
    this.elements.searchBtn.addEventListener('click', () => this.handleSearch());
    this.elements.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleSearch();
    });
    
    let debounceTimer;
    this.elements.searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => this.hideError(), 300);
    });
  }

  async handleSearch() {
    const city = this.elements.searchInput.value.trim();
    if (!city) {
      this.showError('Please enter a city name');
      return;
    }

    this.showLoading();
    this.hideError();

    try {
      const geoData = await this.fetchGeocoding(city);
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('City not found');
      }

      const { latitude, longitude, name, country } = geoData.results[0];
      const displayName = `${name}, ${country}`;
      await this.loadWeather(latitude, longitude, displayName);
      this.elements.searchInput.value = '';
      
    } catch (error) {
      console.error('Search failed:', error);
      this.showError(error.message);
      this.showMockData(city);
    } finally {
      this.hideLoading();
    }
  }

  async fetchGeocoding(city) {
    const url = `${this.config.geoBase}/search?name=${encodeURIComponent(city)}&count=5&language=en&format=json`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  async loadWeather(lat, lon, cityName) {
    try {
      const weatherData = await this.fetchWeather(lat, lon);
      if (weatherData) {
        this.renderWeather(weatherData, cityName);
        this.showError('✅ Real-time data loaded');
        setTimeout(() => this.hideError(), 2000);
        return;
      }
    } catch (error) {
      console.log('Real data failed:', error);
    }
    
    console.log('Using mock data');
    this.showMockData(cityName);
    this.showError('⚠️ Showing mock data (real data unavailable)');
    setTimeout(() => this.hideError(), 3000);
  }

  async fetchWeather(lat, lon) {
    // 关键修改：添加 is_day 参数来判断白天/晚上
    const url = `${this.config.apiBase}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`;
    
    console.log('Weather URL:', url);
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather data fetch failed');
    
    const data = await response.json();
    console.log('Weather data:', data);
    
    return data;
  }

  renderWeather(data, cityName) {
    const current = data.current;
    const daily = data.daily;
    const weatherInfo = this.weatherCodes[current.weather_code] || this.weatherCodes[0];

    // 关键修改：传递 weatherCode 和 isDay 给背景更新函数
    const isDay = current.is_day === 1;
    this.updateBackgroundTheme(current.weather_code, isDay);

    this.elements.cityName.textContent = cityName;
    this.elements.weatherDesc.textContent = weatherInfo.desc;
    this.elements.weatherIcon.innerHTML = this.getWeatherIcon(weatherInfo.icon);
    this.elements.temperature.innerHTML = `${Math.round(current.temperature_2m)}<sup>°C</sup>`;
    
    this.renderDetails({
      humidity: current.relative_humidity_2m,
      wind: current.wind_speed_10m,
      pressure: current.pressure_msl,
      feelsLike: current.apparent_temperature
    });
    
    this.renderForecast(daily);
    this.renderAQI(Math.floor(Math.random() * 80) + 20);
  }

  renderForecast(daily) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    
    let html = '';
    for (let i = 1; i <= 5; i++) {
      const dayName = i === 1 ? 'Tomorrow' : days[(today + i) % 7];
      const weatherInfo = this.weatherCodes[daily.weather_code[i]] || this.weatherCodes[0];
      const maxTemp = Math.round(daily.temperature_2m_max[i]);
      const minTemp = Math.round(daily.temperature_2m_min[i]);
      
      html += `
        <div class="forecast-item">
          <div class="forecast-day">${dayName}</div>
          <div class="forecast-icon">${this.getWeatherIcon(weatherInfo.icon)}</div>
          <div class="forecast-temps">
            <span class="temp-high">${maxTemp}°</span>
            <span class="temp-low">${minTemp}°</span>
          </div>
        </div>
      `;
    }
    
    this.elements.forecastList.innerHTML = html;
  }

  renderDetails(details) {
    const detailsHtml = `
      <div class="detail-item">
        <div class="detail-icon">💧</div>
        <div class="detail-label">Humidity</div>
        <div class="detail-value">${details.humidity}%</div>
      </div>
      <div class="detail-item">
        <div class="detail-icon">💨</div>
        <div class="detail-label">Wind</div>
        <div class="detail-value">${details.wind} km/h</div>
      </div>
      <div class="detail-item">
        <div class="detail-icon">📊</div>
        <div class="detail-label">Pressure</div>
        <div class="detail-value">${details.pressure} hPa</div>
      </div>
      <div class="detail-item">
        <div class="detail-icon">🌡️</div>
        <div class="detail-label">Feels Like</div>
        <div class="detail-value">${Math.round(details.feelsLike)}°C</div>
      </div>
    `;
    
    this.elements.detailsContainer.innerHTML = detailsHtml;
  }

  renderAQI(aqi) {
    let status = 'Good';
    let color = '#4ade80';
    
    if (aqi > 50) { status = 'Moderate'; color = '#fbbf24'; }
    if (aqi > 100) { status = 'Unhealthy'; color = '#f87171'; }
    if (aqi > 150) { status = 'Very Unhealthy'; color = '#a78bfa'; }
    
    this.elements.aqiProgress.style.width = `${Math.min(aqi, 200) / 2}%`;
    this.elements.aqiProgress.style.background = color;
    this.elements.aqiBadge.textContent = `${aqi} - ${status}`;
    this.elements.aqiBadge.style.background = color;
  }

  getWeatherIcon(type) {
    const icons = {
      'sun': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
      'sun-cloud': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>',
      'cloud': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>',
      'rain': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 13v8M8 13v8M12 15v8M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>',
      'snow': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/><path d="M8 16h.01M8 20h.01M12 18h.01M12 22h.01M16 16h.01M16 20h.01"/></svg>',
      'storm': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/><path d="M13 11l-4 6h6l-4 6"/></svg>',
      'fog': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15h16M4 18h16M4 12h16M4 9h16M4 6h16"/></svg>'
    };
    
    return icons[type] || icons['sun'];
  }

  showMockData(cityName) {
    // 模拟数据：北京晚上8点，多云
    const mockData = {
      current: {
        temperature_2m: 25,
        relative_humidity_2m: 60,
        apparent_temperature: 26,
        weather_code: 2, // 多云
        wind_speed_10m: 12,
        pressure_msl: 1013,
        is_day: 0 // 晚上
      },
      daily: {
        weather_code: [1, 2, 3, 61, 1],
        temperature_2m_max: [26, 24, 22, 20, 25],
        temperature_2m_min: [18, 17, 16, 15, 19]
      }
    };
    
    this.renderWeather(mockData, cityName);
  }

  updateDateTime() {
    const now = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    this.elements.dateTime.textContent = now.toLocaleDateString('en-US', options);
  }

  showLoading() {
    this.elements.loadingOverlay.classList.add('active');
  }

  hideLoading() {
    this.elements.loadingOverlay.classList.remove('active');
  }

  showError(message) {
    this.elements.errorMessage.textContent = message;
    this.elements.errorMessage.classList.add('show');
  }

  hideError() {
    this.elements.errorMessage.classList.remove('show');
  }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  new WeatherApp();
});