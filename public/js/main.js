

require(['jquery','underscore','backbone', "async!http://maps.googleapis.com/maps/api/js?key=" + document.body.getAttribute("data-gpk") + "&sensor=false", "application", "map"], 
	function($,_,Backbone, ga, a, Map){
		var map = new Map();
		map.init();
		console.log(map.map.map);

		//mapped urls
		var urls = ["/routes", "/profile/me", "/users/watching"];
		var current = (document.location.toString().replace(/^.*\/\/[^\/]+/, ''));
		if(_.contains(urls, current)) {
			map.draw_markers(current);
		} else if (current.indexOf("/routes/search")>=0) {
			map.draw_markers(current);
		}

		
	}
);
