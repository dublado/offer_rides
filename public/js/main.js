

require(['jquery','underscore','backbone', "async!http://maps.googleapis.com/maps/api/js?key=AIzaSyAOPOE5a8Eoyn4YU_O3TW6Yxwkk3A-RHJQ&sensor=false", "application", "map"], 
	function($,_,Backbone, ga, a, Map){
		var map = new Map();
		map.init()
	}
);
