document.addEventListener('DOMContentLoaded', () => {
	initBasisMap();
	initContactsMap();
})


function initContactsMap() {
	const container = document.querySelector('.js-init-contacts-map');

	if (container) {
		const mapElement = container;

		const key = mapElement.dataset.apiKey;
		const url = mapElement.dataset.url;
		const iconPath = mapElement.dataset.icon;

		const initialLat = mapElement.dataset.initialLat;
		const initialLng = mapElement.dataset.initialLng;
		const initialZoom = mapElement.dataset.initialZoom;
		const maxZoom = mapElement.dataset.maxZoom;
		const minZoom = mapElement.dataset.minZoom;
		const scrollwheel = Boolean(mapElement.dataset.scrollwheel);

		loadApi("gmaps", `https://maps.googleapis.com/maps/api/js?key=${key}`, onMapInit);

		/**
		 * Основной код тут
		 */
		function onMapInit() {
			const center = {lat: Number(initialLat), lng: Number(initialLng)};
			const map = new google.maps.Map(mapElement, {
				zoom: Number(initialZoom),
				center,
				disableDefaultUI: true,
				gestureHandling: 'greedy',
				scrollwheel,
				styles,
				maxZoom,
				minZoom
			});

			// Получаем массив с данными с сервера
			fetch(url)
				.then(res => {
					return res.json()
				})
				.then(data => {
					const markers = data?.items.map(item => {
						const marker = addMarker(map, item, iconPath);
						return marker;
					});

					// Кластеризация
					// Если не надо, то можно закомментить
					// new markerClusterer.MarkerClusterer({markers, map});
				})
				.catch(err => {
					console.warn(err);
				})
				.finally(() => {

				})
		}

		/**
		 * Добавляет точку на карту
		 * @param {*} map
		 * @param {*} item
		 * @param {*} iconPath
		 * @returns
		 */
		function addMarker(map, item, iconPath) {
			const position = new google.maps.LatLng(item.coords.lat, item.coords.lng);

			const icon = {
				url: iconPath,
				scaledSize: new google.maps.Size(46, 46),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(23, 46)
			};

			const instance = new google.maps.Marker({
				position,
				map,
				icon,
				item
			});

			return instance;
		}
	}
}

/**
 * Инициализирует Google карту на странице "Карта базисов"
 */
function initBasisMap() {
	const container = document.querySelector('.js-init-map');

	if (container) {
		const mapElement = container.querySelector('.js-map');
		const mapFilters = Array.from(document.querySelectorAll('.js-map-filter'));

		// Костанты с бека
		const key = mapElement.dataset.apiKey;
		const url = mapElement.dataset.url;
		const iconPath = mapElement.dataset.icon;
		const activeIconPath = mapElement.dataset.activeIcon;
		const initialLat = mapElement.dataset.initialLat;
		const initialLng = mapElement.dataset.initialLng;
		const initialZoom = mapElement.dataset.initialZoom;
		const maxZoom = mapElement.dataset.maxZoom;
		const minZoom = mapElement.dataset.minZoom;
		const itemZoom = mapElement.dataset.itemZoom;
		const scrollwheel = Boolean(mapElement.dataset.scrollwheel);

		// Подсказки
		const pipeTip = mapElement.dataset.pipeTip;
		const truckTip = mapElement.dataset.truckTip;
		const tankTip = mapElement.dataset.tankTip;

		// Дичь с мобильной версией этой карты
		const breakpoint = mapElement.dataset.breakpoint;
		let isMobile = window.matchMedia(`(max-width: ${breakpoint}px)`).matches;

		window.addEventListener('resize', () => {
			isMobile = window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
		})

		const mobileInfoModal = document.querySelector('.js-mobile-info-window');
		const close = mobileInfoModal.querySelector('.js-close');
		const title = mobileInfoModal.querySelector('.js-title');
		const address = mobileInfoModal.querySelector('.js-address');
		const icons = mobileInfoModal.querySelectorAll('.shipping__item');
		const pricesContainer = mobileInfoModal.querySelector('.js-price-list');
		const info = mobileInfoModal.querySelector('.js-info');
		const link = mobileInfoModal.querySelector('.js-link');

		loadApi("gmaps", `https://maps.googleapis.com/maps/api/js?key=${key}`, onMapInit);

		/**
		 * Основной код тут
		 */
		function onMapInit() {
			const center = {lat: Number(initialLat), lng: Number(initialLng)};
			const map = new google.maps.Map(mapElement, {
				zoom: Number(initialZoom),
				center,
				disableDefaultUI: true,
				disableDoubleClickZoom: true,
				gestureHandling: 'greedy',
				scrollwheel,
				styles,
				maxZoom,
				minZoom
			});

			// Кнопки приближения и отдаления
			const zoomInButton = container.querySelector('.js-zoom-in');
			const zoomOutButton = container.querySelector('.js-zoom-out');

			zoomInButton.addEventListener('click', () => {
				map.setZoom(map.getZoom() + 1);
			});

			zoomOutButton.addEventListener('click', () => {
				map.setZoom(map.getZoom() - 1);
			});

			// Получаем массив с данными с сервера
			fetch(url)
				.then(res => {
					return res.json()
				})
				.then(data => {
					const markers = data?.items.map((item, i) => {
						const marker = addMarker(map, item, iconPath, i);
						return marker;
					});

					window.addEventListener('resize', () => {
						mobileInfoModal.classList.remove('map-card_open');
						if (window.openedInfoWindow) {
							window.openedInfoWindow.close();
						}
						if (window.openedtipInfoWindow) {
							window.openedtipInfoWindow.close();
						}
						markers.forEach(m => {
							m.setIcon(iconPath);
						});
					});

					// Закрытие карточки при клике на карту
					google.maps.event.addListener(map, "click", function() {
						mobileInfoModal.classList.remove('map-card_open');
						if (window.openedInfoWindow) {
							window.openedInfoWindow.close();
							window.infoWindowIsOpen = false;
						}
						markers.forEach(m => {
							m.setIcon(iconPath);
						});
					});

					function closeMobileInfoWindow() {
						mobileInfoModal.classList.remove('map-card_open');
						markers.forEach(m => {
							m.setIcon(iconPath);
						});
					}

					close.addEventListener('click', closeMobileInfoWindow);

					document.addEventListener('keydown', (event) => {
						if (event.key === 'Escape') {
							closeMobileInfoWindow();
						}
					});

					// Кластеризация
					// Если не надо, то можно закомментить
					// new markerClusterer.MarkerClusterer({markers, map});

					// Иконка активного элемента
					markers.forEach(marker => {
						marker.addListener('click', () => {
							if (isMobile) {
								setMobileInfoModal(marker.item);
								mobileInfoModal.classList.add('map-card_open');
							}

							markers.forEach(m => {
								m.setIcon(iconPath);
							});

							marker.setIcon(activeIconPath);
						});

						google.maps.event.addListener(marker.iw, 'closeclick', function () {
							marker.setIcon(iconPath);
							resetMobileInfoModal();
							window.infoWindowIsOpen = false;
						});

						google.maps.event.addListener(marker.iw, 'domready', function () {
							const cardInfo = document.querySelector(`#infoWindow-${marker.jsKey}`);
							const closeButton = cardInfo.querySelector('.map-card__close');
							closeButton.addEventListener('click', () => {
								marker.setIcon(iconPath);
								marker.iw.close();
								window.infoWindowIsOpen = false;
							});
							// tippy.js
							tippy('[data-tippy-content]');
						});
					});

					mapFilters.forEach(form => {
						const resetBtn = form.querySelector('.js-reset-form');

						// Фильтр
						form.addEventListener('submit', (e) => {
							e.preventDefault();
							window.hystModal.close();
							map.setZoom(Number(initialZoom));

							const formData = new FormData(form);
							const rowFilterData = [...formData.entries()];
							let filterData = {};
							rowFilterData.forEach(item => {
								if (Array.isArray(filterData[item[0]])) {
									filterData[item[0]].push(item[1]);
								} else {
									filterData[item[0]] = [item[1]];
								}
							});

							if (window.openedInfoWindow) {
								window.openedInfoWindow.close();
								window.infoWindowIsOpen = false;
							}

							markers.forEach(marker => {
								marker.setIcon(iconPath);
								if (
									checkDefaultFilter(filterData.basis, [marker.item.basis])
									&& checkDefaultFilter(filterData.region, [marker.item.region])
									&& checkDefaultFilter(filterData.type_of_fuel, marker.item.types)
									&& checkDefaultFilter(filterData["shipment_method[]"], marker.item.shipment.map(i => i.id))
									&& checkMinPriceFilter(filterData.price_from[0], marker.item.prices.min)
									&& checkMaxPriceFilter(filterData.price_to[0], marker.item.prices.min)
								) {
									marker.setVisible(true);
								} else {
									marker.setVisible(false);
								}
							})
						});

						resetBtn.addEventListener('click', () => {

							if (window.openedInfoWindow) {
								window.openedInfoWindow.close();
								window.infoWindowIsOpen = false;
							}
							map.setZoom(Number(initialZoom));
							form.reset();
							markers.forEach(marker => {
								marker.setVisible(true);
							});
						});
					})
				})
				.catch(err => {
					console.warn(err);
				})
				.finally(() => {

				})
		}

		/**
		 * Задаёт контент для InfoWindow на мобилке (он сделан через обычный html)
		 * @param {*} item
		 */
		function setMobileInfoModal(item) {
			title.textContent = item.name;
			address.textContent = item.address;
			icons.forEach(icon => {
				icon.classList.remove('shipping__item_active');
			});
			item.shipment.forEach(shipmentItem => {
				const icon = mobileInfoModal.querySelector(`.${shipmentItem.code}`);
				if (icon) {
					icon.classList.add('shipping__item_active');
				}
			});
			pricesContainer.innerHTML = "";
			item.prices.items.forEach(price => {
				const priceElement = document.querySelector('#priceItemTemplate').content.children[0].cloneNode(true);
				priceElement.querySelector('.js-price-link').href = price.link;
				priceElement.querySelector('.js-price-title').textContent = price.name;
				priceElement.querySelector('.js-price-description').textContent = price.price;

				pricesContainer.append(priceElement);
			});
			info.innerHTML = item.info;
			link.href = item.link;
		}

		function resetMobileInfoModal() {
			title.textContent = "";
			address.textContent = "";
			icons.forEach(icon => {
				icon.classList.remove('shipping__item_active');
			});
			pricesContainer.innerHTML = "";
			info.innerHTML = "";
			link.href = "#";
		}


		/**
		 * Добавляет точку на карту
		 * @param {*} map
		 * @param {*} item
		 * @param {*} iconPath
		 * @returns
		 */
		function addMarker(map, item, iconPath, key) {
			const position = new google.maps.LatLng(item.coords.lat, item.coords.lng);

			const icon = {
				url: iconPath,
				scaledSize: new google.maps.Size(46, 46),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(23, 46)
			};

			const instance = new google.maps.Marker({
				position,
				map,
				icon,
				anchorPoint: new google.maps.Point(0, 0),
				item
			});

			instance.jsKey = key;

			// Обычное окно с информацией
			const infoWindow = getInfoWindow(item, key);
			instance.addListener("click", () => {
				map.panTo(position);
				// map.setZoom(Number(itemZoom)); // Если надо будет зумить при клике на метку

				if (window.openedInfoWindow) {
					window.openedInfoWindow.close();
					window.infoWindowIsOpen = false;
				}

				if (!isMobile) {
					infoWindow.open({
						anchor: instance,
						map,
						shouldFocus: true,
					});

					window.infoWindowIsOpen = true;

					window.openedInfoWindow = infoWindow;

					if (window.openedtipInfoWindow) {
						window.openedtipInfoWindow.close();
					}
				}
			});
			instance.iw = infoWindow;

			// Окно с информацией на ховер
			const tipInfoWindow = getTipInfoWindow(item, key);

			instance.addListener('mouseover', function() {
				if (!window.infoWindowIsOpen && !isMobile) {
					tipInfoWindow.open({
						anchor: instance,
						animation: 'scale',
						map,
						shouldFocus: false,
					});

					window.openedtipInfoWindow = tipInfoWindow;
				}
			});

			instance.addListener('mouseout', function() {
				if (window.openedtipInfoWindow) {
					window.openedtipInfoWindow.close();
				}
			});

			return instance;
		}

		/**
		 * Создаёт разметку окна с заголовком при ховере
		 * @param {*} item
		 * @param {*} key
		 * @returns gmaps InfoWindow
		 */
		function getTipInfoWindow(item, key) {
			let contentString = `<div class="map-tooltip" id="tipInfoWindow-${key}">${item.name}</div>`;
			const instance = new google.maps.InfoWindow({
				content: contentString,
				pixelOffset: new google.maps.Size(0, -45)
			});

			return instance;
		}

		/**
		 * Создаёт разметку окна с информацией
		 * @param {*} item
		 * @param {*} key
		 * @returns gmaps InfoWindow
		 */
		function getInfoWindow(item, key) {
			let contentString = `
			<div class="map-card" id="infoWindow-${key}">
				<div class="map-card__close">
					<svg class="map-card__icon">
						<use xlink:href="/local/styles/img/svgSprite.svg#icon__cross"></use>
					</svg>
				</div>
				<div class="map-card__title">${item.name}</div>
				<div class="map-card__descr">${item.address}</div>`;

			if (item.shipment.length) {
				const shipmentCodes = item.shipment.map(shipmentItem => shipmentItem.code);

				contentString +=
					`<div class="shipping map-card__shipping">
						<div class="shipping__title">Способы отгрузки:</div>
						<div class="shipping__inner">
							<div class="shipping__item ${shipmentCodes.includes("js-pipe") ? "shipping__item_active" : ""}" data-tippy-content="${pipeTip}">
								<svg class="shipping__icon">
									<use xlink:href="/local/styles/img/svgSprite.svg#icon__solid_pipe"></use>
								</svg>
							</div>
							<div class="shipping__item ${shipmentCodes.includes("js-truck") ? "shipping__item_active" : ""}" data-tippy-content="${truckTip}">
								<svg class="shipping__icon">
									<use xlink:href="/local/styles/img/svgSprite.svg#icon__solid_truck"></use>
								</svg>
							</div>
							<div class="shipping__item ${shipmentCodes.includes("js-tank") ? "shipping__item_active" : ""}" data-tippy-content="${tankTip}">
								<svg class="shipping__icon">
									<use xlink:href="/local/styles/img/svgSprite.svg#icon__solid_tank"></use>
								</svg>
							</div>
						</div>
					</div>`;
			}

			if (item.prices.items.length) {
				contentString +=
					`<div class="map-card__scroll">
						<div class="map-card__list">`;

				item.prices.items.forEach(price => {
					contentString +=
						`<div class="map-card__li">
								<a class="map-card__link" href="${price.link}">
									<svg class="map-card__li-icon">
										<use xlink:href="/local/styles/img/svgSprite.svg#icon__shevron_right"></use>
									</svg>
									<div class="map-card__li-title">${price.name}</div>
									<div class="map-card__li-descr">${price.price}</div>
								</a>
							</div>`;
				});
				contentString +=
					`</div>
					</div>`;
			}

			if (item.info) {
				contentString +=
					`<div class="map-card__info">${item.info}</div>`
			}

			contentString +=
				`<a class="button button_secondary map-card__button" href="${item.link}">Все продукты базиса</a>
			</div>
			`;

			const instance = new google.maps.InfoWindow({
				content: contentString,
				pixelOffset: new google.maps.Size(220, 200)
			});

			return instance;
		}

		/**
		 * Возвращает true, если элемент проходит фильтрацию
		 * @param {*} filterArray Массив нужных параметров
		 * @param {*} itemArray Массив параметров элемента
		 * @returns
		 */
		function checkDefaultFilter(filterArray, itemArray) {
			if (!filterArray) {
				return true;
			}
			if (filterArray[0] == "all" || filterArray[0] == "" || filterArray.some(item => itemArray.includes(item))) {
				return true;
			}
			return false;
		}

		function checkMinPriceFilter(filterValue, itemValue) {
			if (!filterValue) {
				return true;
			}
			if (filterValue == "" || Number(itemValue.replace(/\D/g, '')) >= Number(filterValue.replace(/\D/g, ''))) {
				return true;
			}
			return false;
		}

		function checkMaxPriceFilter(filterValue, itemValue) {
			if (!filterValue) {
				return true;
			}
			if (filterValue == "" || Number(itemValue.replace(/\D/g, '')) <= Number(filterValue.replace(/\D/g, ''))) {
				return true;
			}
			return false;
		}
	}
}

// https://mapstyle.withgoogle.com/
const styles = [
	{
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#f5f5f5"
			}
		]
	},
	{
		"elementType": "labels.icon",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#616161"
			}
		]
	},
	{
		"elementType": "labels.text.stroke",
		"stylers": [
			{
				"color": "#f5f5f5"
			}
		]
	},
	{
		"featureType": "administrative.land_parcel",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#bdbdbd"
			}
		]
	},
	{
		"featureType": "poi",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#eeeeee"
			}
		]
	},
	{
		"featureType": "poi",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#757575"
			}
		]
	},
	{
		"featureType": "poi.park",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#e5e5e5"
			}
		]
	},
	{
		"featureType": "poi.park",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#9e9e9e"
			}
		]
	},
	{
		"featureType": "road",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#ffffff"
			}
		]
	},
	{
		"featureType": "road.arterial",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#757575"
			}
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#dadada"
			}
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#616161"
			}
		]
	},
	{
		"featureType": "road.local",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#9e9e9e"
			}
		]
	},
	{
		"featureType": "transit.line",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#e5e5e5"
			}
		]
	},
	{
		"featureType": "transit.station",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#eeeeee"
			}
		]
	},
	{
		"featureType": "water",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#ccf2e6"
			}
		]
	},
	{
		"featureType": "water",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#99E6CC"
			}
		]
	}
];


/**
 * Позволяет подключать скрипты на определенных страницах
 * @param {*} name
 * @param {*} url
 * @param {*} callback
 */
function loadApi(name, url, callback) {
	const apiLoaded = name + 'Loaded';
	if (!window[apiLoaded]) {
		const script = document.createElement('script');

		window[apiLoaded] = true;

		script.src = url;
		if (callback)
			script.onload = callback;

		const firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
	}
}
