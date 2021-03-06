if (!Grio) {
    var Grio = {};
}

Grio.init = function(callback) {
	Grio.data.load('app_config', function(data){
		if(data) {
			$.extend(Grio.config._vars, data);  
		}
		if(callback) callback();
	});
}

Grio.config = ( function($, Grio) {
    return {
        _vars : {
            asset_url : ''
        },

        asset_url: function(file) {
            if(/^http:\/\/.*/.test(file)) {
                return file;
            }

            var urlPrefix = this.get('asset_url');
            if(urlPrefix!='') urlPrefix += '/';
            return urlPrefix + file;
        },

        asset_path : function(file) {
            return 'assets/css/img/'+file;
        },

        image_path: function(file) {
            return 'assets/img/'+file;
        },

        data_path: function(file) {
            return 'assets/data/'+file;
        },

        get: function(varname) {
            return typeof this._vars[varname] != 'undefined' ? this._vars[varname] : '';
        },

        parseAssetUrl: function(images) {
            if($.isArray(images)) {
                var output = []
                ,   me = this;
                $.each(images, function(index, elm){
                    output.push(me.asset_url(elm));
                });
                return output;
            }
            else {
                return this.asset_url(images);
            }
        }
    }
}) (jQuery, Grio);

Grio.data = ( function($, Grio) {
	return {
		load: function(file, callback) {
			$.ajax({
				url: Grio.config.data_path(file+'.json'),
				async: false,
				dataType: 'json',
				contentType: 'application/json;charset=utf-8',
				success: function(data) {
                    if(callback) {
                        callback(data);
                    }
				},
				error: function(data) {
                    if(callback) {
                        callback({});
                    }
				},
				complete: function(data,status){
                }
			})
		}
	}
}) (jQuery, Grio);
// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require touchwipe
//= require imagesloaded
//= require carouFredSel
//= require application
//= require_self

if (!Grio) {
	var Grio = {};
}

Grio.home = ( function($, Grio) {
    return {

		init: function () {
			this.initMap();
			this.rotateText();
		},

		initMap: function () {
            if(mobile && !tablet) {
                $('#map_canvas').hide();
                return;
            }

            var latlng = new google.maps.LatLng(37.7866065, -122.3977734);  
                var grioStyles = [
                  {
                    stylers: [
                      { gamma: 1.69 },
                      { visibility: "simplified" },
                      { lightness: 16 },
                      { saturation: -98 }
                    ]
                  },{
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [
                      { visibility: "simplified" },
                      { hue: "#00b2ff" },
                      { saturation: 49 },
                      { lightness: -4 },
                      { gamma: 0.88 }
                    ]
                  },{
                    featureType: "poi",
                    elementType: "geometry",
                    stylers: [
                      { visibility: "on" },
                      { hue: "#00ffbb" },
                      { lightness: 1 },
                      { gamma: 1 },
                      { saturation: 29 }
                    ]
                  },{
                    featureType: "transit",
                    stylers: [
                      { visibility: "on" },
                      { saturation: 40 }
                    ]
                  },{
                    featureType: "road.local",
                    stylers: [
                      { visibility: "on" },
                      { lightness: 15 },
                      { gamma: 0.92 },
                      { saturation: -27 }
                    ]
                  },{
                    featureType: "road.arterial",
                    stylers: [
                      { visibility: "on" },
                      { invert_lightness: true },
                      { gamma: 3.51 },
                      { lightness: 46 },
                      { saturation: -36 }
                    ]
                  },{
                    featureType: "landscape.man_made",
                    stylers: [
                      { visibility: "simplified" },
                      { saturation: -55 },
                      { lightness: 24 },
                      { hue: "#00ff77" },
                      { gamma: 0.65 }
                    ]
                  },{
                    featureType: "poi.business",
                    stylers: [
                      { visibility: "on" },
                      { hue: "#80ff00" },
                      { lightness: 20 },
                      { gamma: 0.49 },
                      { saturation: -92 }
                    ]
                  }
                ]
                var settings = {
                    zoom: 15,
                    center: latlng,
                    scaleControl: false,
                    draggable: false,
                    scrollwheel: false,
                    mapTypeControl: true,
                    mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
                    navigationControl: true,
                    styles: grioStyles,
                    navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
                    mapTypeId: google.maps.MapTypeId.ROADMAP}
                    ;
                var map = new google.maps.Map(document.getElementById("map_canvas"), settings);

                
                var companyImage = new google.maps.MarkerImage(Grio.config.asset_path('grio_pin.png'),
                    new google.maps.Size(114,150),
                    new google.maps.Point(0,0),
                    new google.maps.Point(57,150)
                );

                var companyShadow = new google.maps.MarkerImage(Grio.config.asset_path('grio_shadow.png'),
                    new google.maps.Size(141,150),
                    new google.maps.Point(0,0),
                    new google.maps.Point(47, 150));

                var companyPos = new google.maps.LatLng(37.7866065, -122.3977734);

                var companyMarker = new google.maps.Marker({
                    position: companyPos,
                    map: map,
                    icon: companyImage,
                    shadow: companyShadow,
                    title:"grio",
                    zIndex: 3});

            /* for tablet mode only, apply an overlay on top of the map area so that an iPad user can scroll back up the homepage while touching the Grio map */
            if (tablet) {
                $('#map_canvas').append("<div id='map_tablet_overlay'></div>");
            }
        },
        
		rotateText: function() {
			var terms = ["bellissimo", "fabu", "brilliant", "shit-hot", "prima", "fuckin-'A"];
			function rotateTerm() {
				var ct = $("#rotate").data("term") || 0;
				$("#rotate").data("term", ct == terms.length -1 ? 0 : ct + 1).text(terms[ct]).fadeIn()
					.delay(4800).fadeOut(200, rotateTerm);
			}
			$(rotateTerm);
		}
        
    }
}) (jQuery, Grio);

/* functions to execute when site is fully loaded */
$(window).load(function() {
	$('.blueberry').blueberry();
});

/* functions to execute in general */
$(document).ready( function () {
	Grio.home.init();
});