var SKY = SKY || {};

(function($, window, document, SKY, undefined){
	SKY.xmas = (function(){
		function _xmas(){
			var that = this,
				$doc = $(document);
			
			this.init = function(){
				var $win = $(window),
					winWidth = $win.width(),
					winHeight = $win.height;
				
				attachEvents();
				if (winWidth < 768){
					setVidIframeSize(winWidth, winHeight);
				}
			};
			
			this.load = function(){
				initFlexSlider();
				deepLinking();
			};
			
			this.resize = function(){
				var $win = $(window),
					winWidth = $win.width(),
					winHeight = $win.height;
				if (winWidth < 768){
					setVidIframeSize(winWidth, winHeight);
				}else{
					resetVidIframeSize();
				}
			};
			
			this.scroll = function(){
				var scrollTop = $(window).scrollTop();
				fixedHeader(scrollTop);
			};
			
			var attachEvents = function(){
				$doc.on('click', '.flex-control-nav li', function(){
					var $this = $(this),
						index = $this.index();
						
					activateVideo($this, index);
				});
				
				$doc.on('click', '.video-carousel .placeholder .play', function(evt){
					var $this = $(this),
						$slide = $this.parents('li'),
						ytId = $slide.attr('data-ytid'),
						$iframe = $slide.find('iframe.video-iframe'),
						$placeholder = $slide.find('.placeholder'),
						queryStr = (IDPT.coreUtils.checkBrowserForIE() != "non IE") ? 'wmode=transparent&rel=0&enablejsapi=1&modestbranding=1&showinfo=0&autohide=1&autoplay=1' : 'rel=0&enablejsapi=1&modestbranding=1&showinfo=0&autohide=1&autoplay=1',
						iframeSrc = 'http://www.youtube.com/embed/' +ytId+ '?'+queryStr;
						
					if($iframe.attr('src').length == 0){
						$iframe.attr('src', iframeSrc);
						$placeholder.addClass('hidden');
						$iframe.removeClass('hidden');
						$($('.flex-control-paging li')[0]).addClass('play');
					}
				});
			
				$doc.on('click', '.flex-direction-nav a', function(evt){
					var $this = $(this),
						direction = ($this.hasClass('flex-next')) ? 'next' : 'prev',
						$thisNavLi = $('.flex-control-nav li'),
						$elem = $('.flex-control-nav li.flex-active'),
						index = $elem.index();
						
					activateVideo($elem, index);
				});
				
				$doc.on('click', '.social-sharing .fb a', function(evt){
					evt.preventDefault();
				    var $this = $(this),
						sectionId = $this.attr('data-section'),
						href = window.location.href.split('?')[0],
						currentVidId = $('.flex-control-nav li.flex-active').attr('data-trackid'),
						url = href+'?vid='+sectionId+"|"+currentVidId;

				    IDPT.coreUtils.facebookShare($this.attr('data-appid'), url, $this.attr('data-redirecturi'), $this.attr('data-image'), $this.attr('data-name'), $this.attr('data-caption'), $this.attr('data-desc'));
				});
				
				$doc.on('click', '.social-sharing .twitter a', function(evt){
					evt.preventDefault();
					var $this = $(this),
						sectionId = $this.attr('data-section'),
						href = window.location.href.split('?')[0],
						currentVidId = $('.flex-control-nav li.flex-active').attr('data-trackid'),
						url = href+'?vid='+sectionId+"|"+currentVidId;
						
					IDPT.coreUtils.twitterShare(url, $this.attr('data-title')+url, $this.attr('data-hashtags'));
				});
			};
						
			var deepLinking = function(){
				var url = location.href,
					query = location.href.split('?')[1];
					
				if (query && query.length){
					var queryArr = query.split('&');
						
					for (var qs=0, qsLen=queryArr.length; qs<qsLen; qs++){
						var thisQuery = queryArr[qs],
							thisQueryArr = thisQuery.split('=');
						
						if (thisQueryArr[0] == 'vid'){
							var sectionArr = thisQueryArr[1].split('|'),
								section = sectionArr[0],
								video = sectionArr[1];
							
							// Scroll to the required Section.
							
							// Open the required tab.
							($('.flex-control-nav li[data-trackid='+video+']').length > 0) && ($('.flex-control-nav li[data-trackid='+video+']').trigger('click'));
						}
					}
				}
			};
			
			var initFlexSlider = function(){
				$(".flexslider").flexslider({
					animation: "slide",
					controlsContainer: $('.flexslider .flexslider-container'),
					manualControls: $(".video-carousel ol.flex-control-nav li"),
					prevText: "prev",
					nextText: "next",
					slideshow: false,
					video : true,
					animationLoop : false
				});
			};
			
			var setVidIframeSize = function(){
				var requiredRatio = 0.56,
					$li = $('.flexslider .slides > li'),
					liWidth = $li.width(),
					liHeight = liWidth*0.56,
					$placeholderImg = $('.video-carousel .placeholder');
				
				$li.height(liHeight);
				$placeholderImg.height(liHeight);
			};
			
			var resetVidIframeSize = function(){
				$('.flexslider .slides > li, .video-carousel .placeholder').css('height', '');
			}
			
			var activateVideo = function($elem, index){
				var $slide = $($('.flexslider .slides > li')[index]),
					ytId = $slide.attr('data-ytid'),
					$iframe = $slide.find('iframe.video-iframe'),
					queryStr = (IDPT.coreUtils.checkBrowserForIE() != "non IE") ? 'wmode=transparent&rel=0&enablejsapi=1&modestbranding=1&showinfo=0&autohide=1&autoplay=1' : 'rel=0&enablejsapi=1&modestbranding=1&showinfo=0&autohide=1&autoplay=1',
					iframeSrc = 'http://www.youtube.com/embed/' +ytId+ '?'+queryStr;
					
				($iframe.attr('src').length == 0) && ($iframe.attr('src', iframeSrc));
				$('.flex-control-nav li.play').removeClass('play');
				$elem.addClass('play');
				if(index == 0){
					$slide.find(".placeholder").addClass('hidden');
					$iframe.removeClass('hidden');
				}
				$iframe[0].contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
				resetYtPlayers($iframe[0]);				
			};
			
			var resetYtPlayers = function(thisIframe){
				var remIframeArr = $('.video-carousel ul.slides iframe').not(thisIframe);
				
				for (var i=0, l=remIframeArr.length; i<l; i++){
					remIframeArr[i].contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
				}
			};
			
			var fixedHeader = function(scrollVal){
				var scrollThreshold = ($(window).width() > 767) ? 120 : 36;
				if (scrollVal > scrollThreshold){
					$('body').addClass('fixed');
				}else{
					$('body').removeClass('fixed');
				}
			};
			
			return this;
		}
		return new _xmas();
	}());
	
	$(function(){
		SKY.xmas.init();
	});
	
	$(window).on('load', function(){
		SKY.xmas.load();
	}).on('resize', function(){
		SKY.xmas.resize();
	}).on('scroll', function(){
		SKY.xmas.scroll();
	});
	
})(jQuery, this, this.document, SKY);