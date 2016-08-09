"use strict";

(function($){

	var $doc = $(document);

	$doc.ready(function(){

		var $window = $(window);
		var $body = $('body');
		var $htmlBody = $('html, body');

		var windowWidth = $window.width();
		var windowHeight = $window.height();

		// Set the correct values for the breakpoints to match Bootstrap etc
		var smallBreakpoint = 420;
		var mediumBreakpoint = 769;
		var largeBreakpoint = 1024;
		var isSmall;
		var isMedium;
		var isLarge;
		var isExtraLarge;

		/*
		if you have tasks that need to be run whenever window is resized add your function to the resizeTasks array
		 Eg: resizeTasks.push(myCustomResizeTask);
		 */
		var resizeTasks = [];

		/***************************
		 *
		 *	EXTERNAL LINKS
		 *
		 ***************************/

		$('a[rel="external"]').attr('target', '_blank');


		/***************************
		 *
		 *	FITVIDS
		 *
		 ***************************/

		if (typeof $.fitVids !== 'undefined') {
			$body.fitVids();
		}


		/***************************
		 *
		 *	EASY SCROLLTO LINKS
		 *
		 ***************************/
		$body.on('click', 'a.scrollto', function(e){
			var sel = $(this).attr('href');
			var $target = $(sel);
			if ($target.length) {
				e.preventDefault();
				$htmlBody.animate({ scrollTop: $target.offset().top - 30 }, 600);
			}
		});


		/***************************
		 *
		 *	RESPONSIVE / BREAKPOINTS
		 *
		 ***************************/

		function onWindowResize() {
			// Check breakpoints
			windowWidth = $window.width();
			windowHeight = $window.height();
			isSmall = (windowWidth <= smallBreakpoint);
			isMedium = (windowWidth > smallBreakpoint && windowWidth <= mediumBreakpoint);
			isLarge = (windowWidth > mediumBreakpoint);
			isExtraLarge = (windowWidth > largeBreakpoint);

			$.each(resizeTasks, function(i, func){
				if (typeof func === 'function') {
					func();
				}
			});
		}

		$window.on('resize', debounce(onWindowResize, 100));
		$window.trigger('resize');

		$window.on('load', onWindowResize);

	});


})(jQuery);
