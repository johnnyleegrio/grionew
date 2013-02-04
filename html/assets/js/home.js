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
            return 'assets/css/images/'+file;
        },

        image_path: function(file) {
            return 'assets/images/'+file;
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

        SCROLLOFFSETMENUCLICK: 20, // tells the application when it has to switch the selected menu item
        SCROLLDOWNMENUCHANGE: 30,
        
        menuItem: 0,
        
        homeTopBuond: 0,
        servicesTopBound: 0,
        portFolioTopBuond: 0,
        ourteamTopBound: 0,
        blogTopBound: 0,
        contactTopBound: 0,
        
        servicesTimeout: null,
        
        extraNavTimeout: null,
        
        carouselTimeout: null,
        
        init: function () {
            this.initTeamCarousel();
            this.initShowcaseCarousel();
            this.initFloatingMenu();
            this.initAnchor();
            this.initServicesArea();
            this.initTopLink();
            this.initMoveBlogEntryLinks();
            this.initMap();
            this.initScrollBarHandler();
            this.initSectionBounds();
        },
        
        initAnchor: function() {
        	var anchor = window.location.hash;
        	if (anchor != '') {
	        	$('#menu > .primary-links a[href='+anchor+']').trigger('click');
        	}
        },
        
        initFloatingMenu: function () {
            // Building the floating menu and the highlighting logic

            var me = this;
            
            $('#menu > .primary-links a').bind('click', function(event) {
                var panel = $(this).attr('href');
                var step = $(panel).offset().top;
                var menu_margin = ( $('#menu').height() + 5 );
                $('html, body').animate({scrollTop: (step - me.SCROLLOFFSETMENUCLICK - menu_margin)}, 750, function() { });
                return false;
            });
            
            var slidingEffectSpeed = 'fast';
            
            if (!mobile && !tablet) {

                $('.extra-nav-item').mouseenter(function() {
                    $(this).addClass('selected');
                });

                $('.extra-nav-item').mouseleave(function() {
                    $(this).removeClass('selected');
                });

                var extra_icon_dance;

                $('#extra-nav-trigger').mouseenter( function() {
                    // have the icon "dance" left and right
                    extra_icon_dance = setInterval(function() {
                        // identify the icon image element which will move around
                        var obj = "#extra-nav-critter"
                        // toggle position of space critter sprite background image
                        if ( $(obj).hasClass("up") ) {
                            $(obj).removeClass("up");
                        } else {
                            $(obj).addClass("up");
                        }
                        // calculate left and right dimensions
                        var critter_left = ( $(obj).css("left") == 'auto' ) ? 0 : parseInt( $(obj).css("left") );
                    
                        if (critter_left < 70 && $(obj).attr('data-direction') != 'right' ) {
                            $(obj).css('left', (critter_left+5)+"px" );
                        } else {
                            $(obj).attr('data-direction','right');
                        }
                        if (critter_left > 0 && $(obj).attr('data-direction') == 'right' ) {
                            $(obj).css('left', (critter_left-5)+"px" );
                        } else {
                            $(obj).attr('data-direction','left');
                        }
                    }, 200);
                    // shift down the submenu
                    $('#extra-nav').slideDown(slidingEffectSpeed, function() {});
                    clearTimeout(me.extraNavTimeout);
                    return false;
                });
                $('#extra-nav-trigger').mouseleave( function() {
                    clearInterval(extra_icon_dance);
                    me.extraNavTimeout = setTimeout( function() {
                            $('#extra-nav').slideUp(slidingEffectSpeed, function() {});
                        }, 
                        500
                    );
                });

                $('#extra-nav').mouseenter( function() {
                    clearTimeout(me.extraNavTimeout);
                });

                $('#extra-nav').mouseleave( function() {
                    me.extraNavTimeout = setTimeout( function() {
                            $('#extra-nav').slideUp(slidingEffectSpeed, function() {});
                        },
                        500
                    );
                });
            } else {
                $('#extra-nav-critter-static, #extra-nav-critter').click( function() {
                    $('#extra-nav').toggle('slow');
                    return false;
                });
            }
            

        },
        
        initSectionBounds: function () {
            this.servicesTopBound = $('#services').offset().top;
            this.portfolioTopBuond = $('#portfolio').offset().top;
            this.ourteamTopBound = $('#our-team').offset().top;
            this.blogTopBound = $('#blog').offset().top;
            this.contactTopBound = $('#contact').offset().top;
        },
        
        initScrollBarHandler: function () {
            var me = this;
            $(document).bind('scroll', function() {
                //me.scrollMenuHandler();
                var currentPos = $(document).scrollTop() + me.SCROLLDOWNMENUCHANGE;
                var index = 0;
                var menu_margin = ( $('#menu').height() + 5 );

                if (!mobile) {
                    if (currentPos < me.servicesTopBound - menu_margin) {
                        if (me.menuItem != index) {
                            $('#menu a.selected').removeClass('selected');
                            $($('#menu a')[index]).toggleClass('selected');
                            me.menuItem = index;
                        }
                    } else if (currentPos > me.servicesTopBound - menu_margin && currentPos < me.portfolioTopBuond - menu_margin) {
                        index = 1;
                        if (me.menuItem != index) {
                            $('#menu a.selected').removeClass('selected');
                            $($('#menu a')[index]).toggleClass('selected');
                            me.menuItem = index;
                        }
                    } else if (currentPos > me.portfolioTopBuond - menu_margin && currentPos < me.ourteamTopBound - menu_margin) {
                        index = 2;
                        if (me.menuItem != index) {
                            $('#menu a.selected').removeClass('selected');
                            $($('#menu a')[index]).toggleClass('selected');
                            me.menuItem = index;
                        }
                    } else if (currentPos > me.ourteamTopBound - menu_margin && currentPos < me.blogTopBound - menu_margin) {
                        index = 3;
                        if (me.menuItem != index) {
                            $('#menu a.selected').removeClass('selected');
                            $($('#menu a')[index]).toggleClass('selected');
                            me.menuItem = index;
                        }
                    } else if (currentPos > me.blogTopBound - menu_margin && currentPos < me.contactTopBound - menu_margin) {
                        index = 4;
                        if (me.menuItem != index) {
                            $('#menu a.selected').removeClass('selected');
                            $($('#menu a')[index]).toggleClass('selected');
                            me.menuItem = index;
                        }
                    } else {
                        index = 5;
                        if (me.menuItem != index) {
                            $('#menu a.selected').removeClass('selected');
                            $($('#menu a')[index]).toggleClass('selected');
                            me.menuItem = index;
                        }
                    }
                }
            });
            
        },
        
        initServicesArea: function () {
            var me = this;
            
            $('#abilities article').live('mouseover', function(event) {
                clearTimeout(me.servicesTimeout);
                $('.abilities-diagram').hide();
                var id = $(this).attr('id');
                $('#services #img-' + id).show();
            });
            
            $('#abilities article').live('mouseleave', function(event) {
                me.servicesTimeout = setTimeout( function() {
                        $('.abilities-diagram').hide();
                        $('#img-general').show();
                    }, 
                    500
                );
            });
        },
        
        initTeamCarousel: function () {
            var items = 3;

            if (mobile && !tablet) {
                items = 1;
            }


            var $container = $('#team-carousel');
                $('#team-carousel').carouFredSel({
                    items   : {
                        visible: items,
                        minimum: 1,
                        start: 0
                    },
                    scroll  : {
                        items: 1,
                        wipe: true
                    },
                    auto    : {
                        items           : 1,
                        duration        : 1500,
                        easing          : 'linear',
                        pauseDuration   : 0
                    },
                    prev    : {
                        key: "left"
                    },
                    next    : {
                        key: "right"
                    }
                }).trigger('pause');


                var me = this;

                if (!mobile) {
                    $('#team-car-prev').hover(function() {
                        $('#team-carousel').trigger('configuration', ['direction', 'right']);
                        $('#team-carousel').trigger('play');
                    }, function() {
                        $('#team-carousel').trigger('pause');
                    });
                    $('#team-car-next').hover(function() {
                        $('#team-carousel').trigger('configuration', ['direction', 'left']);
                        $('#team-carousel').trigger('play');
                    }, function() {
                        $('#team-carousel').trigger('pause');
                    });
                }
                $('#team-car-prev').live('click', function() {
                    $('#team-carousel').trigger('pause', [null, true]);
                    $('#team-carousel').trigger('prev', items);
                    return false;
                });
                $('#team-car-next').live('click', function() {
                    $('#team-carousel').trigger('pause');
                    $('#team-carousel').trigger('next', items);
                    return false;
                });

                var w = (tablet) ? 720 : 850;

                // set initial width for these wrappers.
                $('#team-carousel, .caroufredsel_wrapper').width(w*items/3);
        },
        
        initShowcaseCarousel: function () {
            $("#showcase-carousel").carouFredSel({
                items       : 1,
                scroll      : {
                    wipe        : true
                },
                direction   : "left",
                auto : {
                    easing      : "linear",
                    duration    : 1000,
                    pauseDuration: 1750,
                    pauseOnHover: true
                },
                prev    : {
                    button: "#showcase-car-prev"
                },
                next    : {
                    button: "#showcase-car-next"
                }

            });

        },
        
        moveCarouselBackward: function () {
            $('#carousel').trigger('prev', 1);
            var me = this;
            this.carouselTimeout = setTimeout(function () {me.moveCarouselBackward();}, 0);
        },
        
        moveCarouselForward: function () {
            $('#carousel').trigger('next', 1);
            var me = this;
            this.carouselTimeout = setTimeout(function () {me.moveCarouselForward();}, 0);
        },
        
        initTopLink: function () {
            var pageAnchor = $('#top-link').attr('href');
            var offset = $(pageAnchor).offset().top;
            $('#top-link').live( 'click', function () {
                $(window).animate({scrollTop: offset}, 750, function() {});
                return false;
            });
        },
        
        initMoveBlogEntryLinks: function () {
            $.each($('.blog-entry section .meta-nav'), function() {
                var arrow = $(this).text();
                
                var link = $(this).closest('a').text('READ ON ').append(arrow);
                link.appendTo(link.closest('.blog-entry'));
            });
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
        }
    }
}) (jQuery, Grio);

Grio.blog = ( function($, Grio) {
    return {
        init: function() {
            this.getFeed();
        },

        getFeed: function() {
            var self = this;

            $.ajax({
                url: Grio.config.get('blog_feed'),
                type: 'GET',
                dataType: 'xml',
                cache: false,
                success: function(xml) {
                    self.render($(xml));
                },
                error: function() {

                }
            });
        },

        render: function($xml) {
            var tpl = [
                '<section class="blog-entry">',
                    '<hgroup>',
                        '<h6><span></span></h6>',
                        '<a href="#" target="_blank"><h2><span></span></h2></a>',
                        '<h4><span><span style="font-style:italic"> by</span> </span></h4>',
                    '</hgroup>',
                    '<section></section>',
                    '<a href="#" class="read-on">READ ON &#8594;</a>',
                '</section>'
            ];

            var $div = $('#entries');

            $xml.find('item').each(function(index){
                if(index>2)
                    return false;

                var item = $(this);
                var html = $(tpl.join("\n"));
                var cls = (index==0) ? 'first span3' : 'span2';
                
                var title, link, pubdate, author;
                $.each(item.children(),function(index){
                    var val = $(this).text();

                    switch(this.nodeName) {
                        case 'title'      : title   = val; break;
                        case 'link'       : link    = val; break;
                        case 'pubDate'    : pubdate = val; break; 
                        case 'dc:creator' : author  = val; break;
                    }

                });

                html.addClass(cls);
                html.find('h6 > span').html(pubdate.replace(/^\w+, (\d+ \w+ \d+) \d+.*$/,'$1'));
                html.find('h2 > span').html(title);
                html.find('hgroup > a, a.read-on').attr('href', link);
                html.find('h4 > span').append(' '+author);
                html.find('section').html(item.find('description').text());
                html.find('.meta-nav').parent().remove();
                $div.append(html);
            });
        }
    }
}) (jQuery, Grio);


Grio.view = ( function($, Grio) {
    return {        
        init: function() {
            this.initMenu();
            this.initNav();
            this.initServices();
            this.initShowCase();
            this.initTeam();
        },

        initMenu: function() {
            Grio.data.load('menu', function(data){
                var menu = $('#menu').find('.primary-links');
                var ipod_menu = $('#menu_ipod');

                $.each(data, function(index, item){
                    var cls = index==0 ? ' class="selected"' : '';
                    var html = '<a href="'+item.link+'"'+cls+'>'+item.label+'</a>';
                    menu.append(html);
                    ipod_menu.append(html);
                }); 
            });
        },
        

        initNav: function() {
            Grio.data.load('side_nav', function(data){
                var menu = $('#extra-nav');
                $.each(data, function(index, item){
                    menu.append('<li class="extra-nav-item"><a href="'+item.link+'" target="_blank">'+item.label+'</a></li>');
                });
            });
        },

        initServices: function() {
            Grio.data.load('services', function(data){
                var div1 = $('#abilities');
                var div2 = $('#img-abilities');

                $.each(data, function(index, item){
                    var cls = index==0 ? ' style="display:block"' : '';
                    var image_url = Grio.config.asset_url(item.image);
                    var html1 = '<article id="'+item.id+'"><hgroup><h5>'+item.title+'</h5></hgroup><detail>'+item.detail+'</detail></article>';
                    var html2 = '<img id="img-'+item.id+'" class="abilities-diagram" src="'+image_url+'"'+cls+' />';
                    if(item.show) 
                        div1.append(html1);
                    div2.append(html2);             
                });
            });

        },

        initShowCase: function() {
            Grio.data.load('showcases', function(data){
                var div = $('#showcaseSlider .iosSlider .slider');
                $.each(data, function(index, item){
                    var image_url = Grio.config.asset_url(item.image);
                    div.append('<div class="slide"><img alt="'+item.name+'" src="'+image_url+'" title="'+item.title+'"/></div>');
                });
				/* activate iosSlider */
				$('#showcaseSlider .iosSlider').iosSlider({
					snapToChildren: true,
					scrollbar: false,
					desktopClickDrag: true,
					navPrevSelector: $('#showcase-car-prev'),
					navNextSelector: $('#showcase-car-next'),
					infiniteSlider: true,
					autoSlide: true,
					autoSlideTimer: 2000
				});
            });
        },

        initTeam: function() {
            Grio.data.load('team', function(data){
                var div = $('#teamSlider .iosSlider .slider');
                $.each(data, function(index, item){
                    var image_url = Grio.config.asset_url(item.image);
                    div.append('<div class="slide"><img alt="'+item.name+'" src="'+image_url+'" title="'+item.name+'" /></div>');
                });
				/* activate iosSlider */
				$('#teamSlider .iosSlider').iosSlider({
					snapToChildren: true,
					scrollbar: false,
					desktopClickDrag: true,
					scrollbarLocation: 'bottom',
					scrollbarHeight: '6px',
					scrollbarBackground: 'repeat 0 0',
					scrollbarBorder: '1px solid #000',
					scrollbarMargin: '0 30px 16px 30px',
					scrollbarOpacity: '0.75',
					navPrevSelector: $('#team-car-prev'),
					navNextSelector: $('#team-car-next'),
					infiniteSlider: true,
					imagesPerSlide: 3
				});
            });
        },
        
        initLinkedMenu: function() {
            Grio.data.load('menu', function(data){
                var menu = $('#menu-linked').find('.primary-links');
                var ipod_menu = $('#menu_ipod');
                var url = 'http://' + window.location.hostname;
                console.log(url);

                $.each(data, function(index, item){
                    var cls = ( (index==0 && window.location.pathname!='/jobs.html') || (index==6 && window.location.pathname=='/jobs.html') ) ? ' class="selected"' : '';
                    var html = '<a href="'+ url + item.link+'"'+cls+'>'+item.label+'</a>';
                    menu.append(html);
                    ipod_menu.append(html);
                }); 
            });
        }
    }
}) (jQuery, Grio);

$(document).ready( function () {
    Grio.init(function(){
        Grio.view.init();
        Grio.blog.init();
        Grio.home.init();
    });

});