'use strict';

let thanks;

window.onload = function() {
	// aos
	AOS.init({
		disable: 'mobile',
		once: true
	});

	// scrollbar width
	let scrollBarWidth = window.innerWidth - document.body.clientWidth;
	document.documentElement.style.setProperty('--scrollbar-width', scrollBarWidth + 'px');

	// mobile nav
	let $body = document.body;
	let $menuTrigger = document.querySelector('.header__menu');
	let $sideNavTrigger = document.querySelector('.side-nav__button');
	$menuTrigger.addEventListener('click', function () {
		let bodyState = $body.getAttribute('data-state');
		bodyState === 'open' ? $body.dataset.state = '' : $body.dataset.state = 'open'
	});
	$sideNavTrigger.addEventListener('click', function () {
		let bodyState = $body.getAttribute('data-state');
		bodyState === 'open' ? $body.dataset.state = '' : $body.dataset.state = 'open'
	});

	// hero-slider
	const heroSlider = new Swiper('.hero-slider', {
		loop: true,
		slidesPerView: 1,
		spaceBetween: 20,
		pagination: {
			el: '.hero__slider-pagination',
		},
		navigation: {
			nextEl: '.hero__slider-next',
			prevEl: '.hero__slider-prev',
		}
	});

	// production-slider
	const productionSlider = new Swiper('.production-slider', {
		loop: true,
		slidesPerView: 'auto',
		spaceBetween: 10,
		centeredSlides: true,
		breakpoints: {
			1680: {
				centeredSlides: false,
				slidesPerView: 4,
			},
			1280: {
				centeredSlides: false,
				slidesPerView: 3,
				spaceBetween: 20,
			},
			768: {
				centeredSlides: false,
				slidesPerView: 2,
			}
		},
		pagination: {
			el: '.production-slider__pagination',
		},
		navigation: {
			nextEl: '.production__slider-next',
			prevEl: '.production__slider-prev',
		}
	});

	// tippy.js
	tippy('[data-tippy-content]');

	// modals
	const modal = new HystModal({
		linkAttributeName: "data-hystmodal"
	});
	window.hystModal = modal;

	thanks = function () {
		modal.open('#thanks')
	};

	// input
	let inputs = document.querySelectorAll('input');
	for (let input of inputs) {
		input.addEventListener('input', function() {
			if(this.value.length !== 0) {
				this.classList.add('input_has-value');
			}
			else {
				this.classList.remove('input_has-value');
			}
		})
	}

	// phone mask
	let phoneFields = document.querySelectorAll('input[type=tel]');
	for (let field of phoneFields) {
		let phoneMask = IMask(field, {
			mask: '+{7} (000) 000-00-00',
		});
	}
	// email mask
	let emailFields = document.querySelectorAll('input[type=email]');
	for (let field of emailFields) {
		let emailMask = IMask(field, {
			mask: /^\S*@?\S*$/
		});
	}
	// currency mask
	let currencyFields = document.querySelectorAll('input.input_currency');
	for (let field of currencyFields) {
		let currencyMask = IMask(field, {
			mask: Number,
			min: 0,
			max: 9999999,
			thousandsSeparator: ' '
		});
	}

	// catalog sections buttons
	let catalogSectionsItems = document.querySelectorAll('.catalog-sections__item');
	catalogSectionsItems.forEach(function (item) {
		item.addEventListener('click', function () {
			document.querySelector('.catalog-sections__item_active').classList.remove('catalog-sections__item_active');
			item.classList.add('catalog-sections__item_active');
		}, false)
	})
};
