var Map = function() {
	this.init = function() {
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

		var center = new google.maps.LatLng(-33, 151);

		if('geolocation' in navigator) {
			function show_map(position) {
				new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
			}

			function handle_error(e) {
				console.log(e);
			}

			var geoOptions = {
				enableHighAccuracy: true,
				timeout: 30000,
				maximumAge: 3000
			};

			navigator.geolocation.getCurrentPosition(show_map, handle_error, geoOptions);	
		};
		

		var Map = Backbone.View.extend({
			el: "#map_canvas",
			map: null,
			rebuild_map : false,
			map_options : {
				center: new google.maps.LatLng(-33, 151),
				zoom: 8,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				mapTypeControl: true,
			    mapTypeControlOptions: {
			        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			        position: google.maps.ControlPosition.BOTTOM_CENTER
			    },
			    panControl: true,
			    panControlOptions: {
			        position: google.maps.ControlPosition.TOP_RIGHT
			    },
			    zoomControl: true,
			    zoomControlOptions: {
			        style: google.maps.ZoomControlStyle.LARGE,
			        position: google.maps.ControlPosition.RIGHT_CENTER
			    },
			    scaleControl: true,
			    scaleControlOptions: {
			        position: google.maps.ControlPosition.TOP_LEFT
			    }
			},
			initialize: function() {
				var el = this.el;
				this.map = new google.maps.Map(el, this.map_options);
				
			},
			render: function() {
				var data = this.model.toJSON(),
					el = this.el;

				if($("#keep_directions").length == 0) {
					this.map = new google.maps.Map(el, this.map_options);	
				}
				
				
				var map = this.map;
				

				var marker1 = new google.maps.Marker({
					map: map,
					position: data.start_point
				}),
					marker2 = new google.maps.Marker({
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
			    	$("#route_steps").val(d);
			  	});

				directionsService.route(request, function(response, status) {
					if (status == google.maps.DirectionsStatus.OK) {
							
						directionsDisplay.setDirections(response);

						var rleg = directionsDisplay.directions.routes[0].legs[0],
							steps = rleg.steps, w = [], d = [];
						
						for(var i=0;i<steps.length;i++) {
							d.push(steps[i].instructions);
							w[i] = steps[1].lat_lngs;
						}
						var step_view = new StepView({ model: null});
						step_view.directions = d;
						step_view.render();
						$("#route_start_point").val(data.start_point);
						$("#route_end_point").val(data.end_point);
						$("#route_steps").val(d);
					}
				});
			  	
			}
		});

		var StepView = Backbone.View.extend({
			el: "#route_steps_data",
			directions: [],
			initialize: function() {},
			render: function() {
				var data = this.directions,
					el = this.el,
					html = "";

				$(el).children("ul").html("");
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

		var route = new Route(),
			my_map = new Map({model: route}),
			geocoder = new google.maps.Geocoder(),
			steps = [];

		route.set({start_point: -34.397, end_point: 150.644});

		if($("#route_start_point").length > 0 && $("#route_start_point").val()!="") {

			var data = $("#route_path").val().split("),(");
			for(var i=0; i<data.length; i++) {
				if(data[i]!="")
					steps.push({location: _makeln(data[i])})
			}

			route.set({
				start_point: _makeln($("#route_start_point").val()),
				end_point: _makeln($("#route_end_point").val()),
				steps: steps
			});

			my_map.render();	
		};

		$(document).on("click", "a.show_map", function() {
			var c = ($(this).parent().data("color")),
				url = $(this).attr("href");

			$(".routes_list li").removeClass("active");
			$(this).parent().addClass("active");

			$
			.when( $.ajax({url: url}) )
			.done(function(responseText) {

				var t = $(responseText), 
					s =  _makeln(t.filter("section").find("#route_start_point").val()),
					e =  _makeln(t.filter("section").find("#route_end_point").val()),
					data = t.filter("section").find("#route_path").val().split("),("),
					steps = [];

				for(var i=0; i<data.length; i++) {
					if(data[i]!="")
						steps.push({location: _makeln(data[i])})
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

		$(document).on("click", "a.favorite_item", function(event) {
			var btn = this;
			var url = $(this).attr("href");
			var type = $(this).data("type");

			$
			.when( $.ajax({url: url, type: type}) )
			.done(function(responseText) {

				$(btn).remove();
				$("body").append("<p id='notice' class='label label-success'>" + responseText + "</p>");
				$("#notice").fadeOut({
			    	duration: 2000,
			    	complete: function() {
				    	$("#notice").remove();
				    }
			    });

			});
			
			event.preventDefault();
		});
	};

	var _makeln = function(str) {
		var arr = str.replace("(", "").replace(")", "").split(",");
		return new google.maps.LatLng(arr[0], arr[1]);
	};
}
