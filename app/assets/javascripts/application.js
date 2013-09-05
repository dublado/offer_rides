// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
// require jquery
// require jquery_ujs
// require_tree .

define([
	'jquery',
	"scroll"], function($) {

		$('.scrollfeed').jscroll({
	      autoTrigger : false,
	      nextSelector: '.myscroll:last',
	      contentSelector: ".routes_list"
	    });

	    $("#notice").fadeOut({
	    	duration: 2000
	    });

	    $(".btn-danger").on("click", function() {
	    	var link = $(this);

			var href = $(link).attr("href"),
			method = link.data('method'),
			csrf_token = $('meta[name=csrf-token]').attr('content'),
			csrf_param = $('meta[name=csrf-param]').attr('content'),
			form = $('<form method="post" action="' + href + '"></form>'),
			metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

			if (csrf_param !== undefined && csrf_token !== undefined) {
				metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
			}

			

			form.append(metadata_input).appendTo('body');
			form.submit();
			return false;
	    });

	}
);


