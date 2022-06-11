'use strict';

let thanks;

window.onload = function() {
	// mobile nav
	let $body = document.body;
	let $menuTrigger = document.querySelector('.header__menu');
	$menuTrigger.addEventListener('click', function () {
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

	// producion-slider
	const swiper = new Swiper('.producion-slider', {
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
			el: '.producion-slider__pagination',
		},
		navigation: {
			nextEl: '.producion__slider-next',
			prevEl: '.producion__slider-prev',
		}
	});

	// tippy.js
	tippy('[data-tippy-content]');
};
