

require(['jquery','underscore','backbone', "async!http://maps.googleapis.com/maps/api/js?key=" + document.body.getAttribute("data-gpk") + "&sensor=false", "application", "map"], 
	function($,_,Backbone, ga, a, Map){
		var map = new Map();
		map.init()
	}
);
