/*
jQuery.pgVideo

Author Paul Graffam
Version 1.0.0
Date: 8/06/2012
More: http://www.paulgraffix.com/
*/

(function($) {
	// plugin definition
	var pluginName = 'pgVideo';
	
	$.fn.pgVideo = function(options) {		
		var options = $.extend({}, $.fn.pgVideo.defaults, options);
		// determine if browser can play video element
		if(!!document.createElement('video').canPlayType) {
			var $pgVideo = $(this);
			
			// create html structure -
			// main wrapper
			var $video_wrap = $('<div />').addClass('vplayer').addClass(options.theme);
					
			// main video			 
			var $video = $("<video controls='controls' id='video1' class='pgvideo' />");
			
			// add optional attributes
			if(options.poster)		
				$video.prop('poster',options.poster);
			if(options.autoplay)
				$video.prop('autoplay',options.autoplay);
			if(options.preload)
				$video.prop('preload',options.preload);			
						
			// overlay that covers video screen			
			var $overlay = $('<div class="overlay"></div>');
			// controls wraper
			var $video_controls = $('<div class="vcontrols-container"><div class="vcontrols"><a class="vplay" title="Play/Pause"></a><a class="vstop" title="Stop"></a><div class="vbuffer" /><div class="vseek"/><div class="vtimer">00:00:00 / 00:00:00</div><a class="vfsoff" title="Full Screen"></a><br /><div class="nowplaying">NOW PLAYING</div><div class="vtitle" id="vtitle"><span class="ellipsis_text" ></span></div><div class="volume-box"><a class="volume-button" title="Mute/Unmute"></a><div class="volume-slider" /></div></div></div>');						
			// add video to container
			$pgVideo.append($video);
			// wrap main vplayer div around video
			$video.wrap($video_wrap);
			// add overlay div before video
			$video.before($overlay);
			// add video controls after video
			$video.after($video_controls);
			
			$('.vtitle .ellipsis_text').text(options.title);
			
			// have it load one video source if browser can play type
			if ($.fn.pgVideo.supportsVideo()) {
				// webm
				if ($.fn.pgVideo.supportType('webm')){
					$video.append($.fn.pgVideo.createSource(options.webm, 'video/webm'));	  		
				}
				// mp4
				else if ($.fn.pgVideo.supportType('mp4')) {		  		
					$video.append($.fn.pgVideo.createSource(options.mp4, 'video/mp4'));	  		
				}
				// ogv
				else {		  		
					$video.append($.fn.pgVideo.createSource(options.ogv, 'video/ogv'));	  
				}	  	
			}
			
			// possibly helps with iPad
			$video.load();
			
			// set elements to vars so not to have to go through DOM every time
			var $vplayer = $('.vplayer');
			var $vcontrols_container = $('.vcontrols-container');
			var $video_controls = $('.vcontrols');
			var $screen_pause = $('.screen_pause');
			var $vplay_btn = $('.vplay');
			var $vstop_btn = $('.vstop');
			var $vfullscreen_btn = $('.vfsoff');
			var $video_title = $('.vtitle');
			var $video_buffer = $('.vbuffer');
			var $video_seek = $('.vseek');
			var $video_timer = $('.vtimer');
			var $volume = $('.volume-slider');
			var $volume_btn = $('.volume-button');
			var $fade = $('#fade');
			
			// public vars
			var timer = null
			var videoOrigWidth, videoOrigHeight;
			
			$video_controls.hide(); // keep the controls hidden until video is in readyState
			
			/* video events to choose from:
			"abort", - data loading was aborted
			"canplay", - data loaded and ready to play but video not entirely loaded
			"canplaythrough", - video entirely loaded
			"canshowcurrentframe", - first frame available
			"dataunavailable", - no data
			"durationchange", - change in video duration
			"emptied", - data not present unexpectedly
			"empty", - no video
			"ended", - video ended
			"error", - video error occurred
			"loadedfirstframe", - first frame has been loaded
			"loadedmetadata", - metadata has been loaded
			"loadstart", - browser starts loading data
			"pause", - video paused (pause())
			"play", - video started playing (play())
			"playing", - video is playing
			"progress", - browser is loading data
			"ratechange", - rate of playback changed (fastforward or rewind)
			"seeked", - seeking set to false
			"seeking", - video being seeked
			"stalled", - data transfer stalled
			"suspend", - browser does not load data, waiting
			"timeupdate", - currenttime was changed
			"volumechange", - change to volume level
			"waiting", - waiting for more data to load
			 */
			
			// play video function
			var vPlay = function() {
				if($video.prop('paused') == false) {
					$video[0].pause();					
				} else {					
					$video[0].play();				
				}
				// code to determine if its first playthorugh
				// jquery doesnt have a string contains function so use indexof
				if($overlay.prop('class').indexOf("overlay show-play") != -1) { // indexOf returns -1 instead of false if not found
					$overlay.removeClass('show-play');
				};
			};
			
			// set play function to btn and main video
			$vplay_btn.click(vPlay);
			$video.click(vPlay);
			$overlay.click(vPlay);
			
			// stop function
			var vStop = function() {					
				$video[0].pause();
				$video.prop("currentTime", 0);
				$overlay.removeClass('show-pause')
					.addClass('show-play');
			};
			// set stop function to btn
			$vstop_btn.click(vStop);
			
			// if video starts buffering load progress bar
			// buffered not supported yet
			if (($video.buffered != undefined) && ($video.buffered.length != 0)) {
			$video.bind('progress', function() {
				$video_buffer.progressbar({
					value: parseInt((($video.buffered.end(0) / $video.duration) * 100), 10)
					// todo: set buffer bar to handle
					});
				});
			} else {
				$video_buffer.remove();
			}
			
			$video.bind('canplay', function() {				
				if (options.autoplay)
					// if set to autoplay then play as soon as ready
					$video[0].play();
			});			
			// if video is ready to be played show screen play
			$video.bind('loadstart', function() {
				$overlay.addClass('show-play');
			});
			// set width of seek bar and title to accomodate extra video space
			$video.bind("loadedmetadata", function () {
				var vWidth = this.videoWidth;
				var vHeight = this.videoHeight;
				var seekWidth = vWidth - 200;
				var titleWidth = vWidth - 230;
				$video_seek.css('width', seekWidth);
				$video_title.css('width', titleWidth);
				// set overlay to width and height of video
				$overlay.width(vWidth).height(vHeight);
				// set the video aspect ratio
				$video.aspectRatio = vWidth / vHeight;
    		});
			// if video playing then add pause btn over play btn and video screen
			$video.bind('playing', function() {
				$overlay.removeClass('show-pause')
					.removeClass('show-preloader');
			});
			// if video playing then add pause btn over play btn and video screen
			$video.bind('play', function() {
				$vplay_btn.addClass('vpause');
			});
			// if video paused then remove pause btn and show screen pause
			$video.bind('pause', function() {
				$vplay_btn.removeClass('vpause');
				$overlay.addClass('show-pause');
			});
			// if video ended then remove pause btn, go back to start and show screen pause
			$video.bind('ended', function() {
				$vplay_btn.removeClass('vpause');
				$video.prop("currentTime",0);
				$video[0].pause();
				// if meant to loop
				if(options.loop)
					// replay
					$video[0].play();
			});
			// if video is loading show preloader
			$video.bind('waiting', function() {
				$overlay.addClass('show-preloader');
			 });
			// if video seeking then show preloader
			$video.bind('seeking', function() {
				$overlay.addClass('show-preloader');
			 });
			// on end of seek wait a little bit and then remove preloader
			$video.bind('seeked', function() {
				setTimeout(function(){
					$overlay.removeClass('show-preloader');
				}, 300);
			 });
			
			// fullscreen video function
			var pgFullScreen = function() {
				// set the aspect ratio
				var windowWidth = $(window).width();
				var windowHeight = $(window).height();
								
				// going from fullscreen to normal
				if($video.attr('fs') == "true") {
					$video.attr('fs', "false")
						.removeClass('fullscreen')
						.width(videoOrigWidth).height(videoOrigHeight);
					$vplayer.css({cursor: 'default'})
						.removeClass('fullscreen');
					$fade.fadeOut();
					$overlay.width($video.width())
						.height($video.height())
						.removeClass('fullscreen-overlay')
						.unbind('mousemove');
					$video_controls.removeClass('fullscreen-vcontrols');
					$vcontrols_container.removeClass('fullscreen-vcontrols-container')
						.draggable('destroy')
						.unbind('mouseenter')
						.unbind('mouseleave')
						.fadeIn();
					$vfullscreen_btn.removeClass('vfson');
					$video.unbind('mousemove');
					// remove setTimeout
					clearTimeout(timer);
					timer = 0;
					// Unhide scroll bars
					document.documentElement.style.overflow = this.docOrigOverflow;
				// going from normal to fullscreen
				} else {
					console.log($video.width());
					videoOrigWidth = $video.width();
					videoOrigHeight = $video.height();
					$video.attr('fs', "true")
						.addClass('fullscreen');
					$vplayer.addClass('fullscreen');
					if (windowWidth / windowHeight > $video.aspectRatio) {
						$video.width(windowWidth).height('auto');
					} else {
						$video.height(windowHeight).width('auto');
					}
					$('body').append('<div id="fade"></div>'); //Add the fade layer to bottom of the body tag.
					$fade.css({'filter' : 'alpha(opacity=90)'}).fadeIn('slow'); //Fade in the fade layer - is used to fix the IE Bug on fading transparencies 
					// Apply fullscreen styles
					$overlay.addClass('fullscreen-overlay')
						.width("100%")
						.height("100%");
					$vcontrols_container.addClass('fullscreen-vcontrols-container')
						.draggable();
					$video_controls.addClass('fullscreen-vcontrols');
					$vfullscreen_btn.addClass('vfson');
					// Storing original doc overflow value to return to when fullscreen is off
					this.docOrigOverflow = document.documentElement.style.overflow;
					// Hide any scroll bars
					document.documentElement.style.overflow = 'hidden';
					// function for fading video controls in and out
					fadeControls();
				};
			};
			// set fullscreen function to btn
			$vfullscreen_btn.click(pgFullScreen);
			
			// loop for fading in and out video controls and mouse during fullscreen
			function fadeControls() {
				// initial loop to hide controls if no movement
				timer = setTimeout(function() { 
					$vcontrols_container.fadeOut('slow');
					$vplayer.css('cursor', 'none');
				}, 3000);
				if ($video.attr('fs') == "true") {
					$overlay.mousemove(mouseMoveFn)
					$video.mousemove(mouseMoveFn)
					// hover function for fullscreen controls
					$vcontrols_container.hover(function() {
						if (timer) {
							clearTimeout(timer);
							timer = 0;
						}
						$vcontrols_container.fadeIn('slow');
						$vplayer.css('cursor', 'default');
					});
				}
			}
			
			// mousemovement function for fullscreen controls
			var mouseMoveFn = function () {
				if (timer) {
					clearTimeout(timer);
					timer = 0;
				}
				$vcontrols_container.fadeIn('slow');
				$vplayer.css({cursor: 'default'});
				timer = setTimeout(function() {
					$vcontrols_container.fadeOut('slow');
					$vplayer.css({cursor: 'none'});
				}, 3000);
			};
			
			// escape key detection to remove fullscreen
			$(document).keypress(function(event) {
				if ($video.attr('fs') == "true" && event.keyCode == '27') {
					pgFullScreen();
					document.documentElement.style.overflow = 'visible'; // re-enable scrollbars as function doesn't do it.
				}
			});
							
			// seeking timeline function
			var seeksliding;			
			var createSeek = function(event) {
				// if video is ready
				if($video.prop('readyState')) {
					var video_duration = $video.prop('duration');
					$video_seek.slider({
						value: 0,
						step: 0.01,
						orientation: "horizontal",
						range: "min",
						max: video_duration,
						animate: false,	 // set to false due to poor video playing performance in safari				
						slide: function(){	
							seeksliding = true;
						},
						stop: function(e,ui){
							seeksliding = false;
							$video.prop("currentTime", ui.value);
						}
					});
					$video_controls.show();	// show video controls					
					$video_title.ThreeDots({max_rows:1, whole_word:false}) //truncate title if too long
					//.update();
				} else {
					setTimeout(createSeek, 150);
				}
			};
			
			createSeek();
			
			// format time into minutes and seconds
			var vTimeFormat=function(seconds){
				var h=Math.floor(seconds/3600)<10?"0"+Math.floor(seconds/3600):Math.floor(seconds/3600);
				var m=Math.floor(seconds/60)<10?"0"+Math.floor(seconds/60):Math.floor(seconds/60);
				var s=Math.floor(seconds-(m*60))<10?"0"+Math.floor(seconds-(m*60)):Math.floor(seconds-(m*60));
				return h+":"+m+":"+s;
			};
			
			// update time to current seek
			var seekUpdate = function() {
				var currenttime = $video.prop('currentTime');
				var totaltime = $video.prop('duration');
				if(!seeksliding) $video_seek.slider('value', currenttime);
				// fix for Safari where it displays NaN on load
				if (vTimeFormat(totaltime) == ("NaN:NaN:NaN")) {
					$video_timer.text("00:00:00 / 00:00:00")
				} else {
					$video_timer.text(vTimeFormat(currenttime) + " / " + vTimeFormat(totaltime));
				}
			};
			
			// set timeupdate to function
			$video.bind('timeupdate', seekUpdate);	
			
			// set current volume
			var video_volume = options.volume;
			// volume slider function
			$volume.slider({
				value: options.volume,
				orientation: "horizontal",
				range: "min",
				max: 1,
				step: 0.05,
				animate: true,
				slide: function(e,ui) {
					// remove mute and muted icon
					$video.prop('muted', false);
					$volume_btn.removeClass('volume-mute');
					// set volume to the slider value
					video_volume = ui.value;
					$video.prop('volume',ui.value);
				},
				stop: function() {
					if (video_volume < 0.01) { // if user moves volume handle to 0 change volume icon to mute
						$volume_btn.addClass('volume-mute');
					}
				}
			});
			
			// mute volume function
			var muteVolume = function() {
				if($video.prop('muted') == true) {
					$video.prop('muted', false);
					//set volume slider back to value of volume slider
					$volume.slider('value', video_volume);
					// remove mute btn
					$volume_btn.removeClass('volume-mute');					
				} else {
					$video.prop('muted', true);
					// set volume to 0
					$volume.slider('value', '0');
					// add mute btn
					$volume_btn.addClass('volume-mute');
				};
			};
			// set mute function to btn
			$volume_btn.click(muteVolume);
			
			// remove default controls
			$video.removeAttr('controls');
			
			// error handlers
			$video.bind('error', function(event) {
				console.log('error -- failed to load video');
				console.log(event);
				console.log($video.error);
			});
			$video.bind('empty', function() {
				console.log('error -- video is empty');
			});
			$video.bind('stalled', function() {
				console.log('error -- video has stalled');
			});
			
			// alert error handling - possibly only works in ie9, seems broken
			/*if($video.error) {
					switch($video.error.code) {
						case 1:
							alert("You aborted the video playback.");
							break;
						case 2:
							alert("Network error - please try again later.");
							break;
						case 3:
							alert("The video playback was aborted due to a corruption problem or because the video used features your browser did not support.");
							break;
						case 4:
							alert("The video could not be loaded, either because the server or network failed or because the format is not supported.");
							break;
						default:
							alert('An unknown error occurred.');
							break;
					}
				}	*/		
		return this;
		};
	};
	
	// check which type is supported
	$.fn.pgVideo.supportType = function(str) {
		
		// if not at all supported
		if (!$.fn.pgVideo.supportsVideo())
			return false;
		
		// create video
		var v = document.createElement('video');
		
		// check which is supported
		switch (str) {
			case 'webm' :
				return (v.canPlayType('video/webm; codecs="vp8, vorbis"'));
				break;
			case 'mp4' :
				return (v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"'));
				break;
			case 'ogv' :
				return (v.canPlayType('video/ogg; codecs="theora, vorbis"'));
				break;			
		}
		
		return false;	
	}
	
	// check if suports video
	$.fn.pgVideo.supportsVideo = function() {
		return (document.createElement('video').canPlayType);
	}
	
	// creates the src attribue for html5 video tag
	$.fn.pgVideo.createSource = function(src, type) {
		var source = document.createElement('source');
		source.src = src;
		source.type = type;
		return source;
	};
	
	// plugin defaults
	$.fn.pgVideo.defaults = {
		theme: 'grey',
		mp4: '',
		ogv: '',
		webm: '',
		poster: '',
		title: 'No Title',
		preload: "auto",
		autoplay: false,
		volume: 0.75,
		loop: false		
	};
})( jQuery );