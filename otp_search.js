(function($){
  Drupal.behaviors.otpSearchDialog = {
    attach: function (context, settings) {
			
			$.searchbox = {}
			
			$.extend(true, $.searchbox, {
				settings: {
					url: '/search',
					param: 'query',
					dom_id: '#results',
					delay: 100,
					loading_css: '#loading'
				},
				
				loading: function() {
					$($.searchbox.settings.loading_css).show()
				},
				
				resetTimer: function(timer) {
					if (timer) clearTimeout(timer)
				},
				
				idle: function() {
					$($.searchbox.settings.loading_css).hide()
				},
				
				process: function(terms) {
					var data            = 'search=' + terms;
					
					$.ajax({
						type: 'POST',
						url: '/ajax/otp_search/data',
						data: data,
						dataType: 'html',
						success: function (qqq) {

							if(qqq.indexOf('[{') + 1) {
								pos = qqq.indexOf('[{');
								qqq = qqq.substr(0,pos); ;
							}

							 $($.searchbox.settings.loading_css).html(qqq);
							 //console.log(data);
						}
					});
				},
				
				start: function() {
					$(document).trigger('before.searchbox')
					$.searchbox.loading()
				},
				
				stop: function() {
					$.searchbox.idle()
					$(document).trigger('after.searchbox')
				}
			})
			
			$.fn.searchbox = function(config) {
				var settings = $.extend(true, $.searchbox.settings, config || {})
				
				$(document).trigger('init.searchbox')
				//$.searchbox.idle()
				
				return this.each(function() {
					var $input = $(this)
					
					$input
					.focus()
					.ajaxStart(function() { $.searchbox.start() })
					.keyup(function() {
						if ($input.val() != this.previousValue) {
							$.searchbox.resetTimer(this.timer)
							this.timer = setTimeout(function() { $.searchbox.process($input.val())}, $.searchbox.settings.delay)
							this.previousValue = $input.val()
						}	
					})
				})
			}
			
		$('input#edit-search-block-form--2').searchbox({
			url: '/search/otp_search/',
			param: 'query',
			dom_id: 'ol.search-results.otp_search-results',
			delay: 1500,
			loading_css: '#spinner'
		});
		
		$('input#edit-search-block-form--2').on("hover", function() { 
			if($('input#edit-search-block-form--2').val() != '') {$('#spinner').show()}
			//console.log($('input#edit-search-block-form--2').val() );
		});
		$('#header').on("mouseleave", function() { 
			setTimeout(function () {	$('#spinner').hide(500)}, 500);
		});
		$('input#edit-search-block-form--2').on("focusout", function() { 
			$('#spinner').hide(500);
		});
							
    }
  };
})(jQuery);

