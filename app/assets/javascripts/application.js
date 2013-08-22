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
//= require jquery
//= require jquery_ujs
//= require_tree .

function initialize() {
	
	return false;
	
	var map = new google.maps.Map(document.getElementById("map_canvas"),
	    mapOptions);
};



$(document).ready(function() {

	$('.scrollfeed').jscroll({
      autoTrigger : false,
      nextSelector: '.myscroll:last',
      contentSelector: ".routes_list"
    });

    $("#notice").fadeOut({
    	duration: 2000
    });

	$("#trace_route").on("click", function(e) {

		geocoder.geocode({ address: $("#route_start_address").val()},
			function(results, status) {
				route.set("start_point", results[0].geometry.location);
			}
		);

		geocoder.geocode({ address: $("#route_end_address").val()},
			function(results, status) {
				route.set("end_point", results[0].geometry.location);
				route.set("steps", steps);
				route.set("mode", "edit");
				my_map.render();
			}
		);
		e.preventDefault();
	});

	var Map = Backbone.View.extend({
		el: "#map_canvas",
		map: null,
		rebuild_map : false,
		initialize: function() {
			var el = this.el;
			
			var mapOptions = {
			  center: new google.maps.LatLng(-33, 151),
			  zoom: 8,
			  mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			this.map = new google.maps.Map(el, mapOptions);
			
		},
		render: function() {
			var data = this.model.toJSON();
			var el = this.el;

			if($("#keep_directions").length == 0) {
				var mapOptions = {
				  center: new google.maps.LatLng(-33, 151),
				  zoom: 8,
				  mapTypeId: google.maps.MapTypeId.ROADMAP
				};
				this.map = new google.maps.Map(el, mapOptions);	
			}
			
			
			var map = this.map;
			

			var marker1 = new google.maps.Marker({
				map: map,
				position: data.start_point
			});
			var marker2 = new google.maps.Marker({
				map: map,
				position: data.end_point
			});

			var request = {
				origin: data.start_point,
				destination: data.end_point,
				waypoints: data.steps,
				//optimizeWaypoints: true,
				travelMode: google.maps.TravelMode.DRIVING
			};

			var rendererOptions = {
			  draggable: true,
			  map: map
			};

			if(data.color) {
				rendererOptions.polylineOptions = {
				  	strokeColor: data.color
				  }
			}
			

			var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
			directionsService = new google.maps.DirectionsService();

			//if(data.mode == "view") {
			//	directionsService.route(request, function(response, status) {
			//		if (status == google.maps.DirectionsStatus.OK) {
			//			directionsDisplay.setDirections(response);
			//		}
			//	});
			//} else {
				var first_time = true;
				google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
					if(first_time) {
						first_time = false;
						return false;
					}
					var rs = directionsDisplay.directions.routes[0];
					var arr = [], d = [];
					for(var i=0; i<rs.legs.length; i++) {
						var leg = rs.legs[i];
						if(leg.via_waypoints!="")
							arr.push(leg.via_waypoints);
						
						for(var k=0;k<leg.steps.length;k++) {
							d.push(leg.steps[k].instructions);
						}
					}

					var step_view = new StepView({ model: null});
					step_view.directions = d;
					step_view.render();

			    	$("#route_path").val(arr);
			  	});

				directionsService.route(request, function(response, status) {
					if (status == google.maps.DirectionsStatus.OK) {
							
						directionsDisplay.setDirections(response);

						var rleg = directionsDisplay.directions.routes[0].legs[0];

						var steps = rleg.steps, w = [], d = [];
						
						for(var i=0;i<steps.length;i++) {
							d.push(steps[i].instructions);
							w[i] = steps[1].lat_lngs;
						}
						var step_view = new StepView({ model: null});
						step_view.directions = d;
						step_view.render();
						$("#route_start_point").val(data.start_point);
						$("#route_end_point").val(data.end_point);
					}
				});
			//}
		  	
		}
	});

	var StepView = Backbone.View.extend({
		el: "#route_steps",
		directions: [],
		initialize: function() {},
		render: function() {
			var data = this.directions;
			var el = this.el;

			$(el).children("ul").html("");
			var html = "";
			for(var i=0; i<data.length; i++) {
				html+= "<li class=\"list-group-item\">" + data[i] + "</li>";
			}
			$(el).children("ul").html(html);
		}
	});


	var Route = Backbone.Model.extend({
		defaults: {
			start_point: null,
			end_point: null
		}
	});

	var route = new Route();
	route.set({start_point: -34.397, end_point: 150.644});
	

	var my_map = new Map({model: route});
	var geocoder;
	geocoder = new google.maps.Geocoder();


	var steps = [];
	route.set("mode", "view");

	if($("#route_start_point").length > 0 && $("#route_start_point").val()!="") {
		route.set("start_point", make_ln($("#route_start_point").val()));
		route.set("end_point", make_ln($("#route_end_point").val()));

		
		var data = $("#route_path").val().split("),(");
		for(var i=0; i<data.length; i++) {
			if(data[i]!="")
				steps.push({location: make_ln(data[i])})
		}
		route.set("steps", steps);
		my_map.render();	
	};

	$(document).on("click", "a.show_map", function() {

		var c = ($(this).parent().parent().data("color"));
		var url = $(this).attr("href");
		$
		.when( $.ajax({url: url}) )
		.done(function(responseText) {

			var t = $(responseText), 
				s =  make_ln(t.filter("section").find("#route_start_point").val()),
				e =  make_ln(t.filter("section").find("#route_end_point").val()),
				data = t.filter("section").find("#route_path").val().split("),("),
				steps = [];

			for(var i=0; i<data.length; i++) {
				if(data[i]!="")
					steps.push({location: make_ln(data[i])})
			}

			route.set({
				"start_point": s,
				"end_point": e,
				"steps": steps,
				"color": c
			});

			my_map.render();
			var h = t.filter("section").find(".route_data");
			$(".current_route_data").html(h);

		});
		event.preventDefault();
	});

	$(document).on("click", "a.favorite_delete", function(event) {
		var btn = this;
		var url = $(this).attr("href");

		$
		.when( $.ajax({url: url, type: "delete"}) )
		.done(function(responseText) {

			$(btn).remove();
			$("body").append("<p id='notice' class='label label-success'>" + responseText + "</p>");
			$("#notice").fadeOut({
		    	duration: 2000
		    });

		});
		
		event.preventDefault();
	});

	$(document).on("click", "a.favorite_add", function(event) {
		var btn = this;
		var url = $(this).attr("href");

		$
		.when( $.ajax({url: url, type: "put"}) )
		.done(function(responseText) {

			$(btn).remove();
			$("body").append("<p id='notice' class='label label-success'>" + responseText + "</p>")

			$("#notice").fadeOut({
		    	duration: 2000
		    });

		});
		
		event.preventDefault();
	});
	
	
});

var make_ln = function(str) {
	var arr = str.replace("(", "").replace(")", "").split(",");
	return new google.maps.LatLng(arr[0], arr[1]);
};