'use strict';

let thanks;

window.onload = function() {
	let $body = document.body;
	let $menuTrigger = document.querySelector('.header__menu');
	//-let $navLinks = document.querySelectorAll('.nav .nav__links-item');
	//-let $navCallBack = document.querySelector('.nav .connections__callback');
	$menuTrigger.addEventListener('click', function () {
		let bodyState = $body.getAttribute('data-state');
		bodyState === 'open' ? $body.dataset.state = '' : $body.dataset.state = 'open'
	});
	// $navCallBack.addEventListener('click', function () {
	// 	$body.dataset.state = ''
	// });
	// for (let i = 0; i < $navLinks.length; i++) {
	// 	$navLinks[i].addEventListener('click', function () {
	// 		$body.dataset.state = ''
	// 	});
	// }
};
