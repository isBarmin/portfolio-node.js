var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);








// parallax
var parallax = (function() {

  var bg        = $('.first__bg');
  var section   = $('.first__me  .me');
  var text      = $('.first__bg-text');
  var blogTitle = $('.first__title-wrap');

  return {
    move: function(el, windowScroll, strafeAmount) {
      var wScroll = $(window).scrollTop();

      var strafe = windowScroll / -strafeAmount + '%';
      var transformString = 'translate3d(0,' + strafe + ', 0)';

      el.css({
        'transform': transformString,
        '-webkit-transform': transformString
      });

    },

    init: function(wScroll) {
      this.move(bg, wScroll, 50);
      this.move(text, wScroll, 30);
      this.move(section, wScroll, 15);
      this.move(blogTitle, wScroll, 18);
    }
  };

})();




// blur
var blur = (function() {

  var blur      = $('[data-blur-elem="form"]');
  var container = $('[data-blur-container="form"]');


  return {
    set: function() {
      if (!blur.length || !container.length ) return;

      var imgWidth   = container.width();
      var offsetTop  = container.offset().top  - blur.offset().top;
      var offsetLeft = container.offset().left - blur.offset().left;

      blur.css({
        'background-size': imgWidth + 'px auto',
        'background-position': offsetLeft + 'px' + ' ' + offsetTop + 'px'
      });
    }
  };

})();




// graph init
var pie = (function() {
  var pieAll = null;



  return {
    init: function() {
      pieAll = $('.graph__in');
      if(pieAll.length === 0) return;

      pieAll.each(function(i, item) {
        var value = $(item).attr('stroke-dasharray');
        item.value = value;
        $(item).attr('stroke-dasharray', '0 100');
      });
    },

    getValue: function() {
      if(pieAll.length === 0) return;

      pieAll.each(function(i, item) {
        item.setAttribute('stroke-dasharray', item.value);
      });
    }
  };
})();





$( document ).ready(function() {

  pie.init();
  blur.set();
  parallax.init();

  // parallax on the welcome page
  var mouseParallax = (function() {

    var layerAll = $('.parallax__layer');

    $(window).on('mousemove', function(e) {
      var mouseX = e.pageX;
      var mouseY = e.pageY;

      var w = (window.innerWidth / 2)  - mouseX;
      var h = (window.innerHeight / 2) - mouseY;

      layerAll.map(function(i,item) {
         var wPos = w * ((i + 1) / 175);
         var hPos = h * ((i + 1) / 220);

         $(item).css({
            'transform': 'translate3d('+ wPos +'px,' + hPos + 'px, 0)'
         });
      });
    });

  })();

  // preloader
  (function() {

    var imgs = [];

    $('*').each(function () {
      var $this      = $(this);
      var background = $this.css('background-image');
      var isImg      = $this.is('img');

      if (background !== 'none') {
        var path = background.replace('url("', '').replace('")', '');

        if( path.indexOf('-gradient(') !== -1 ) return;

        imgs.push(path);
      }

      if (isImg) {
        var path = $this.attr('src');

        if (!path) return;
        imgs.push(path);
      }
    });


    var percentsTotal = 1;

    for (var i = 0; i < imgs.length; i++) {
      var image = $('<img>', {
        attr: {
          src: imgs[i]
        }
      });

      image.one({
        load : function () {
          setPercents(imgs.length, percentsTotal);
          percentsTotal++;
        },
        error : function () {
          percentsTotal++;
        }
      });
    }

    function setPercents(total, current) {
      var percent = Math.ceil(current / total * 100);

      if (percent >= 100) {
        $('.preloader').fadeOut();
      }

      $('.preloader__value').text(percent);
    }

  })();





  // Работа главного меню
  (function() {

    $(document).on('click', '.nav__trigger', function(e) {
      var trigger = $(this);
      var nav     = trigger.closest('.nav');
      var drop    = nav.find('.nav__drop');
      var header  = $('.header');


      if(nav.hasClass('nav--open')) {

        drop.fadeOut( 500 , function() {
          nav.removeClass('nav--open');
          $('body').css('overflow', '');
        });

        header.css('z-index', '');

      } else {

        drop.show(0, function() {
          nav.addClass('nav--open');
          header.css('z-index', 100);
        });

        $('body').css('overflow', 'hidden');

      }
    });

  })();





  // Табы в админке
  (function() {

    $(document).on('click', '.adm-tab__control', function(e) {
      var btn       = $(this);
      var idx       = btn.index();
      var container = btn.closest('.adm-tab');
      var bodyAll   = container.find('.adm-tab__body');

      btn
        .addClass('adm-tab__control--active')
        .siblings()
          .removeClass('adm-tab__control--active');

      bodyAll.removeClass('adm-tab__body--active');
      bodyAll.eq(idx)
        .addClass('adm-tab__body--active');

    });

  })();





  // Работа двухсторонней карточки на главной странице
  (function() {

    var welcome = $('.welcome');

    if( !welcome === 0 ) return;


    welcome.on('click', '[data-flip="toggle"]', function(e) {
      var trigger     = $(this);
      var initTrigger = welcome.find('.welcome__btn-auth');
      var flipper     = welcome.find('.welcome__flipper');
      var duration    = 500;


      flipper.toggleClass('welcome__flipper--flip');

      if(flipper.hasClass('welcome__flipper--flip')) {
        initTrigger.fadeOut( duration );
      } else {
        initTrigger.fadeIn( duration );
      }

    });

  })();





  // Прокрутить страницу до ...
  (function() {

    $(document).on('click', '[data-go]', function(e) {
      e.preventDefault();

      var btn        = $(this);
      var target     = btn.attr('data-go');
      var container  = null;


      function scrollToPosition(position, duration) {
        var position = position || 0;
        var duration = duration || 1000;


        $("body, html").animate({
          scrollTop: position
        }, duration);
      }


      if (target == 'top') {
        scrollToPosition();
      }

      if (target == 'next') {
        container = btn.closest('.section');
        scrollToPosition( container.height() );
      }
    });

  })();





  // sticky-меню на странице блога
  (function() {
    var container = $('.blog__in');
    var menu      = container.find('.blog__menu');

    if (menu.length === 0 || isMobile) return;

    var containerBottom = container.offset().top + container.height() - 40;
    var edgeTop         = menu.offset().top;
    var menuHeight      = menu.height();


    $(window).on('scroll', function() {
      if(edgeTop < $(window).scrollTop()) {
        if(containerBottom < $(window).scrollTop() + menuHeight) {
          menu
            .addClass('blog__menu--fix-bottom')
            .removeClass('blog__menu--sticky');
        } else {
          menu
            .addClass('blog__menu--sticky')
            .removeClass('blog__menu--fix-bottom');
        }
      } else {
        menu.removeClass('blog__menu--sticky');
      }
    });

  })();





  // Прокрутка до выбранной статьи в блоге
  (function() {
    var articleAll = $('.post');
    var linksAll   = $('.blog__menu .menu__link');

    if(articleAll.length === 0) return;

    showSection(window.location.hash, false);


    function showSection(section, isAnimate) {
      var target        = section.replace('#', '');
      var reqSection    = articleAll.filter('[data-id="' + target + '"]');
      var duration      = 750;

      if (reqSection.length === 0) return;
      var reqSectionPos = reqSection.offset().top;

      if(isAnimate) {
        $('body, html').animate({ scrollTop: reqSectionPos }, duration);
      } else {
        $('body, html').scrollTop(reqSectionPos);
      }
    }



    function checkSection() {
      articleAll.each(function(i, item) {
        var article    = $(item);
        var topEdge    = article.offset().top - 200;
        var bottomEdge = topEdge + article.height();
        var topScroll  = $(window).scrollTop();

        if (topEdge < topScroll && bottomEdge > topScroll) {
          var currentId = article.data('id');
          var reqLink   = linksAll.filter('[href="#' + currentId + '"]');

          reqLink.closest('.menu__item')
            .addClass('menu__item--active')
            .siblings()
              .removeClass('menu__item--active');

          window.location.hash = currentId;
        }
      });
    }


    $(window).on('scroll', function() {
      checkSection();
    });


    $(document).on('click', '.blog__menu .menu__link', function(e) {
      e.preventDefault();
      showSection($(this).attr('href'), true);
    });

  })();





  // Боковавя панель на странице блога
  (function() {
    var trigger     = $('.blog__side-trigger');
    var activeClass = 'blog__side--show';
    var container;

    if( trigger.length === 0) return;

    container = trigger.closest('.blog__side');;


    trigger.on('click', function(e) {
      e.preventDefault();
      container.toggleClass( activeClass );
    });


    $(document).on('click', '.blog__menu  .menu__item', function() {
      var item      = $(this);

      if(item.hasClass('menu__item--active')) return;
      container.removeClass( activeClass );
    });


    $(window).on('resize', function() {
      if( $(document).width() >= 960 && container.hasClass( activeClass ) ) {
        container.removeClass( activeClass );
      }
    });

  })();





  // Слайдер
  (function() {
    var transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd';

    function Slider(options) {
       var gallery     = options.elem;
       var prev        = gallery.find('.slider__control--prev');
       var next        = gallery.find('.slider__control--next');

       var slides         = gallery.find('.slider__view  .slides__item');
       var activeSlide    = slides.filter('.slides__item--active');
       var slidesCnt      = slides.length;
       var activeSlideIdx = activeSlide.index();

       var mainSlider = gallery.find('.slider__view  .slides');
       var mainSlides = mainSlider.find('.slides__item');

       var prevSlider = gallery.find('.slider__control--prev  .slides');
       var prevSlides = prevSlider.find('.slides__item');

       var nextSlider = gallery.find('.slider__control--next  .slides');
       var nextSlides = nextSlider.find('.slides__item');
       var isReady    = false;


       var desc  = gallery.find('.slider__desc');
       var title = desc.find('.slider__title');
       var tools = desc.find('.slider__info');
       var link  = desc.find('.slider__link');

       var data      = gallery.find('.slider__data');
       var dataItems = data.find('.slider-data__item');


       // init
       function init() {
          showedSlide(nextSlides, getIdx(activeSlideIdx, 'next'));
          showedSlide(prevSlides, getIdx(activeSlideIdx, 'prev'));
          updateDesc(dataItems.eq(activeSlideIdx));
          isReady = true;
       }
       init();

       function showedSlide(slider, idx) {
          slider
             .eq(idx).addClass('slides__item--active')
             .siblings().removeClass('slides__item--active');
       }

       function dataChange(direction) {
          activeSlideIdx = (direction === 'next') ? getIdx(activeSlideIdx, 'next') : getIdx(activeSlideIdx, 'prev');
       }

       function getIdx(currentIdx, dir) {
          if(dir === 'prev') {
            return (currentIdx - 1 < 0) ? slidesCnt - 1 : currentIdx - 1 ;
          }
          if(dir === 'next') {
            return (currentIdx + 1 >= slidesCnt) ? 0 : currentIdx + 1 ;
          }

          return currentIdx;
       }

       function changeSlide(slides, direction, className) {
          var currentSlide    = slides.filter('.slides__item--active');
          var currentSlideIdx = currentSlide.index();
          var newSlideIdx;

          if (direction === 'prev') {
             newSlideIdx = getIdx(currentSlideIdx, 'prev');
          }
          if (direction === 'next') {
             newSlideIdx = getIdx(currentSlideIdx, 'next');
          }

          slides.eq(newSlideIdx)
             .addClass( className )
             .one(transitionEnd, function() {
                $(this)
                   .removeClass( className )
                   .addClass('slides__item--active')
                   .trigger('changed-slide');
             });

          currentSlide
             .addClass( className )
             .one(transitionEnd, function() {
                $(this).removeClass('slides__item--active ' + className);
             });
       }

       function changeAll(direction) {
          changeSlide(mainSlides, direction, 'slides__item--animate-fade');
          changeSlide(prevSlides, direction, 'slides__item--animate-down');
          changeSlide(nextSlides, direction, 'slides__item--animate-up');
       }

       function updateDesc(data) {
          title.text( data.attr('data-title') );
          tools.text( data.attr('data-tools') );
          link.attr('href', data.attr('data-link') );
       }

       $(document).on('changed-slide', function() {
          isReady = true;
       });



       this.prev = function() {
          if( !isReady ) return;
          isReady = false;

          changeAll('prev')
          dataChange('prev');

          updateDesc(dataItems.eq(activeSlideIdx));
       };


       this.next = function() {
          if( !isReady ) return;
          isReady = false;

          changeAll('next')
          dataChange('next');

          updateDesc(dataItems.eq(activeSlideIdx));
       };

       prev.on('click', this.prev);
       next.on('click', this.next);
    } // Slider


    var slider = new Slider({
       elem: $('#js-slider')
    });
  })();





  // Обработка и отправка форм
  (function() {
    $('form').attr('novalidate', true);

    /* При фокусе убирать красную обводку */
    $(document).on('focus', 'input, textarea', function(e) {
      $(this)
        .removeClass('field--error')
        .removeClass('field--ok');
    });

    $(document).on('reset', 'form', function(e) {
      $(this).find('input, textarea')
        .removeClass('field--error')
        .removeClass('field--ok');
    });


    // Валидация полей формы
    function validateForm(form) {
      var inputs     = form.find('[required]');
      var isValidate = true;

      inputs.removeClass('field--error');

      inputs.each(function(i, item) {
        var input = $(item);
        var value = input.val();
        var type  = input.attr('type');

        if(type == 'checkbox') {
          if(!input.is(':checked')) {
            input.addClass('field--error');
            isValidate = false;
          }
          return;
        }

        if(value.trim() == '') {
          input.addClass('field--error');
          isValidate = false;
        } else {
          input
            .removeClass('field--error')
            .addClass('field--ok');
        }
      });

      return isValidate;
    } // validateForm();




    /* Отправка форм */
    function sendForm(form, method, url, dataType) {
        if( !validateForm(form) ) return;

        $.ajax({
          type: method,
          url:  url,
          data: form.serialize(),
          dataType: 'json'
        })
        .done(function(answer) {
          console.log( answer );
          if ('href' in answer) {
            location.href = answer.href;
          }
          form.trigger('reset');
        })
        .fail(function() {
          console.log('form send: error');
        });

    } // sendForm();


    $('.form-modal--callback').on('submit', function(e) {
      e.preventDefault();
      sendForm($(this), 'POST', '/mail');
    });


    $('#form-authorization').on('submit', function(e) {
      e.preventDefault();
      sendForm($(this), 'POST', '/login');
    });


    $('#form-admin-blog').on('submit', function(e) {
      e.preventDefault();
      sendForm($(this), 'POST', '/admin/addItem');
    });


    $('#form-admin-skills').on('submit', function(e) {
      e.preventDefault();
      sendForm($(this), 'POST', '/admin/addSkills');
    });


    (function() {
      var form = document.getElementById('form-admin-work');

      if(!form) return;

      form.addEventListener('submit', function(e) {
        e.preventDefault();
        if( !validateForm($(form)) ) return;

        var formData = new FormData( form );
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/admin/addWork');
        xhr.send( formData );
      });

    })();
  })();





  // Карта
  (function() {

    var map = document.getElementById('map');

    if( map === null ) return;


    // параметры карты
    var latitude  = 58.0223849;
    var longitude = 56.2338462;
    var mapZoom  = 15;


    // Стилизация карты
    var mainСolor = "#61DAC9";

    var style = [
      {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#444444"
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
          {
            "color": "#f2f2f2"
          }
        ]
      },
      {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
          {
            "saturation": -100
          },
          {
            "lightness": 45
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#d6d6d6"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
          {
            "color": "#46bcec"
          },
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": mainСolor
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      }
    ]



    // Настройки карты
    var mapOptions = {
      center: new google.maps.LatLng(latitude, longitude),
      zoom: mapZoom,
      panControl: false,
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scrollwheel: false,
      styles: style,
    }

    // Инициализация карты
    var googleMap = new google.maps.Map(map, mapOptions);

  })();

});





$(window).on('load', function() {
  $('body').addClass('loaded');
  pie.getValue();
});



$( window ).on('scroll', function() {
  parallax.init( $(window).scrollTop() );
});



$( window ).on('resize', function() {
  blur.set();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBpc01vYmlsZSA9IC9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeXxJRU1vYmlsZXxPcGVyYSBNaW5pL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vLyBwYXJhbGxheFxyXG52YXIgcGFyYWxsYXggPSAoZnVuY3Rpb24oKSB7XHJcblxyXG4gIHZhciBiZyAgICAgICAgPSAkKCcuZmlyc3RfX2JnJyk7XHJcbiAgdmFyIHNlY3Rpb24gICA9ICQoJy5maXJzdF9fbWUgIC5tZScpO1xyXG4gIHZhciB0ZXh0ICAgICAgPSAkKCcuZmlyc3RfX2JnLXRleHQnKTtcclxuICB2YXIgYmxvZ1RpdGxlID0gJCgnLmZpcnN0X190aXRsZS13cmFwJyk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBtb3ZlOiBmdW5jdGlvbihlbCwgd2luZG93U2Nyb2xsLCBzdHJhZmVBbW91bnQpIHtcclxuICAgICAgdmFyIHdTY3JvbGwgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XHJcblxyXG4gICAgICB2YXIgc3RyYWZlID0gd2luZG93U2Nyb2xsIC8gLXN0cmFmZUFtb3VudCArICclJztcclxuICAgICAgdmFyIHRyYW5zZm9ybVN0cmluZyA9ICd0cmFuc2xhdGUzZCgwLCcgKyBzdHJhZmUgKyAnLCAwKSc7XHJcblxyXG4gICAgICBlbC5jc3Moe1xyXG4gICAgICAgICd0cmFuc2Zvcm0nOiB0cmFuc2Zvcm1TdHJpbmcsXHJcbiAgICAgICAgJy13ZWJraXQtdHJhbnNmb3JtJzogdHJhbnNmb3JtU3RyaW5nXHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24od1Njcm9sbCkge1xyXG4gICAgICB0aGlzLm1vdmUoYmcsIHdTY3JvbGwsIDUwKTtcclxuICAgICAgdGhpcy5tb3ZlKHRleHQsIHdTY3JvbGwsIDMwKTtcclxuICAgICAgdGhpcy5tb3ZlKHNlY3Rpb24sIHdTY3JvbGwsIDE1KTtcclxuICAgICAgdGhpcy5tb3ZlKGJsb2dUaXRsZSwgd1Njcm9sbCwgMTgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG59KSgpO1xyXG5cclxuXHJcblxyXG5cclxuLy8gYmx1clxyXG52YXIgYmx1ciA9IChmdW5jdGlvbigpIHtcclxuXHJcbiAgdmFyIGJsdXIgICAgICA9ICQoJ1tkYXRhLWJsdXItZWxlbT1cImZvcm1cIl0nKTtcclxuICB2YXIgY29udGFpbmVyID0gJCgnW2RhdGEtYmx1ci1jb250YWluZXI9XCJmb3JtXCJdJyk7XHJcblxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgc2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKCFibHVyLmxlbmd0aCB8fCAhY29udGFpbmVyLmxlbmd0aCApIHJldHVybjtcclxuXHJcbiAgICAgIHZhciBpbWdXaWR0aCAgID0gY29udGFpbmVyLndpZHRoKCk7XHJcbiAgICAgIHZhciBvZmZzZXRUb3AgID0gY29udGFpbmVyLm9mZnNldCgpLnRvcCAgLSBibHVyLm9mZnNldCgpLnRvcDtcclxuICAgICAgdmFyIG9mZnNldExlZnQgPSBjb250YWluZXIub2Zmc2V0KCkubGVmdCAtIGJsdXIub2Zmc2V0KCkubGVmdDtcclxuXHJcbiAgICAgIGJsdXIuY3NzKHtcclxuICAgICAgICAnYmFja2dyb3VuZC1zaXplJzogaW1nV2lkdGggKyAncHggYXV0bycsXHJcbiAgICAgICAgJ2JhY2tncm91bmQtcG9zaXRpb24nOiBvZmZzZXRMZWZ0ICsgJ3B4JyArICcgJyArIG9mZnNldFRvcCArICdweCdcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbn0pKCk7XHJcblxyXG5cclxuXHJcblxyXG4vLyBncmFwaCBpbml0XHJcbnZhciBwaWUgPSAoZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHBpZUFsbCA9IG51bGw7XHJcblxyXG5cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBwaWVBbGwgPSAkKCcuZ3JhcGhfX2luJyk7XHJcbiAgICAgIGlmKHBpZUFsbC5sZW5ndGggPT09IDApIHJldHVybjtcclxuXHJcbiAgICAgIHBpZUFsbC5lYWNoKGZ1bmN0aW9uKGksIGl0ZW0pIHtcclxuICAgICAgICB2YXIgdmFsdWUgPSAkKGl0ZW0pLmF0dHIoJ3N0cm9rZS1kYXNoYXJyYXknKTtcclxuICAgICAgICBpdGVtLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgJChpdGVtKS5hdHRyKCdzdHJva2UtZGFzaGFycmF5JywgJzAgMTAwJyk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRWYWx1ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmKHBpZUFsbC5sZW5ndGggPT09IDApIHJldHVybjtcclxuXHJcbiAgICAgIHBpZUFsbC5lYWNoKGZ1bmN0aW9uKGksIGl0ZW0pIHtcclxuICAgICAgICBpdGVtLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLWRhc2hhcnJheScsIGl0ZW0udmFsdWUpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9O1xyXG59KSgpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbiQoIGRvY3VtZW50ICkucmVhZHkoZnVuY3Rpb24oKSB7XHJcblxyXG4gIHBpZS5pbml0KCk7XHJcbiAgYmx1ci5zZXQoKTtcclxuICBwYXJhbGxheC5pbml0KCk7XHJcblxyXG4gIC8vIHBhcmFsbGF4IG9uIHRoZSB3ZWxjb21lIHBhZ2VcclxuICB2YXIgbW91c2VQYXJhbGxheCA9IChmdW5jdGlvbigpIHtcclxuXHJcbiAgICB2YXIgbGF5ZXJBbGwgPSAkKCcucGFyYWxsYXhfX2xheWVyJyk7XHJcblxyXG4gICAgJCh3aW5kb3cpLm9uKCdtb3VzZW1vdmUnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgIHZhciBtb3VzZVggPSBlLnBhZ2VYO1xyXG4gICAgICB2YXIgbW91c2VZID0gZS5wYWdlWTtcclxuXHJcbiAgICAgIHZhciB3ID0gKHdpbmRvdy5pbm5lcldpZHRoIC8gMikgIC0gbW91c2VYO1xyXG4gICAgICB2YXIgaCA9ICh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSAtIG1vdXNlWTtcclxuXHJcbiAgICAgIGxheWVyQWxsLm1hcChmdW5jdGlvbihpLGl0ZW0pIHtcclxuICAgICAgICAgdmFyIHdQb3MgPSB3ICogKChpICsgMSkgLyAxNzUpO1xyXG4gICAgICAgICB2YXIgaFBvcyA9IGggKiAoKGkgKyAxKSAvIDIyMCk7XHJcblxyXG4gICAgICAgICAkKGl0ZW0pLmNzcyh7XHJcbiAgICAgICAgICAgICd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlM2QoJysgd1BvcyArJ3B4LCcgKyBoUG9zICsgJ3B4LCAwKSdcclxuICAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gIH0pKCk7XHJcblxyXG4gIC8vIHByZWxvYWRlclxyXG4gIChmdW5jdGlvbigpIHtcclxuXHJcbiAgICB2YXIgaW1ncyA9IFtdO1xyXG5cclxuICAgICQoJyonKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyICR0aGlzICAgICAgPSAkKHRoaXMpO1xyXG4gICAgICB2YXIgYmFja2dyb3VuZCA9ICR0aGlzLmNzcygnYmFja2dyb3VuZC1pbWFnZScpO1xyXG4gICAgICB2YXIgaXNJbWcgICAgICA9ICR0aGlzLmlzKCdpbWcnKTtcclxuXHJcbiAgICAgIGlmIChiYWNrZ3JvdW5kICE9PSAnbm9uZScpIHtcclxuICAgICAgICB2YXIgcGF0aCA9IGJhY2tncm91bmQucmVwbGFjZSgndXJsKFwiJywgJycpLnJlcGxhY2UoJ1wiKScsICcnKTtcclxuXHJcbiAgICAgICAgaWYoIHBhdGguaW5kZXhPZignLWdyYWRpZW50KCcpICE9PSAtMSApIHJldHVybjtcclxuXHJcbiAgICAgICAgaW1ncy5wdXNoKHBhdGgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXNJbWcpIHtcclxuICAgICAgICB2YXIgcGF0aCA9ICR0aGlzLmF0dHIoJ3NyYycpO1xyXG5cclxuICAgICAgICBpZiAoIXBhdGgpIHJldHVybjtcclxuICAgICAgICBpbWdzLnB1c2gocGF0aCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICB2YXIgcGVyY2VudHNUb3RhbCA9IDE7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbWdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBpbWFnZSA9ICQoJzxpbWc+Jywge1xyXG4gICAgICAgIGF0dHI6IHtcclxuICAgICAgICAgIHNyYzogaW1nc1tpXVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpbWFnZS5vbmUoe1xyXG4gICAgICAgIGxvYWQgOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBzZXRQZXJjZW50cyhpbWdzLmxlbmd0aCwgcGVyY2VudHNUb3RhbCk7XHJcbiAgICAgICAgICBwZXJjZW50c1RvdGFsKys7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlcnJvciA6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHBlcmNlbnRzVG90YWwrKztcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNldFBlcmNlbnRzKHRvdGFsLCBjdXJyZW50KSB7XHJcbiAgICAgIHZhciBwZXJjZW50ID0gTWF0aC5jZWlsKGN1cnJlbnQgLyB0b3RhbCAqIDEwMCk7XHJcblxyXG4gICAgICBpZiAocGVyY2VudCA+PSAxMDApIHtcclxuICAgICAgICAkKCcucHJlbG9hZGVyJykuZmFkZU91dCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkKCcucHJlbG9hZGVyX192YWx1ZScpLnRleHQocGVyY2VudCk7XHJcbiAgICB9XHJcblxyXG4gIH0pKCk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAvLyDQoNCw0LHQvtGC0LAg0LPQu9Cw0LLQvdC+0LPQviDQvNC10L3RjlxyXG4gIChmdW5jdGlvbigpIHtcclxuXHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLm5hdl9fdHJpZ2dlcicsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgdmFyIHRyaWdnZXIgPSAkKHRoaXMpO1xyXG4gICAgICB2YXIgbmF2ICAgICA9IHRyaWdnZXIuY2xvc2VzdCgnLm5hdicpO1xyXG4gICAgICB2YXIgZHJvcCAgICA9IG5hdi5maW5kKCcubmF2X19kcm9wJyk7XHJcbiAgICAgIHZhciBoZWFkZXIgID0gJCgnLmhlYWRlcicpO1xyXG5cclxuXHJcbiAgICAgIGlmKG5hdi5oYXNDbGFzcygnbmF2LS1vcGVuJykpIHtcclxuXHJcbiAgICAgICAgZHJvcC5mYWRlT3V0KCA1MDAgLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIG5hdi5yZW1vdmVDbGFzcygnbmF2LS1vcGVuJyk7XHJcbiAgICAgICAgICAkKCdib2R5JykuY3NzKCdvdmVyZmxvdycsICcnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaGVhZGVyLmNzcygnei1pbmRleCcsICcnKTtcclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIGRyb3Auc2hvdygwLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIG5hdi5hZGRDbGFzcygnbmF2LS1vcGVuJyk7XHJcbiAgICAgICAgICBoZWFkZXIuY3NzKCd6LWluZGV4JywgMTAwKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCgnYm9keScpLmNzcygnb3ZlcmZsb3cnLCAnaGlkZGVuJyk7XHJcblxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgfSkoKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8vINCi0LDQsdGLINCyINCw0LTQvNC40L3QutC1XHJcbiAgKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuYWRtLXRhYl9fY29udHJvbCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgdmFyIGJ0biAgICAgICA9ICQodGhpcyk7XHJcbiAgICAgIHZhciBpZHggICAgICAgPSBidG4uaW5kZXgoKTtcclxuICAgICAgdmFyIGNvbnRhaW5lciA9IGJ0bi5jbG9zZXN0KCcuYWRtLXRhYicpO1xyXG4gICAgICB2YXIgYm9keUFsbCAgID0gY29udGFpbmVyLmZpbmQoJy5hZG0tdGFiX19ib2R5Jyk7XHJcblxyXG4gICAgICBidG5cclxuICAgICAgICAuYWRkQ2xhc3MoJ2FkbS10YWJfX2NvbnRyb2wtLWFjdGl2ZScpXHJcbiAgICAgICAgLnNpYmxpbmdzKClcclxuICAgICAgICAgIC5yZW1vdmVDbGFzcygnYWRtLXRhYl9fY29udHJvbC0tYWN0aXZlJyk7XHJcblxyXG4gICAgICBib2R5QWxsLnJlbW92ZUNsYXNzKCdhZG0tdGFiX19ib2R5LS1hY3RpdmUnKTtcclxuICAgICAgYm9keUFsbC5lcShpZHgpXHJcbiAgICAgICAgLmFkZENsYXNzKCdhZG0tdGFiX19ib2R5LS1hY3RpdmUnKTtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgfSkoKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8vINCg0LDQsdC+0YLQsCDQtNCy0YPRhdGB0YLQvtGA0L7QvdC90LXQuSDQutCw0YDRgtC+0YfQutC4INC90LAg0LPQu9Cw0LLQvdC+0Lkg0YHRgtGA0LDQvdC40YbQtVxyXG4gIChmdW5jdGlvbigpIHtcclxuXHJcbiAgICB2YXIgd2VsY29tZSA9ICQoJy53ZWxjb21lJyk7XHJcblxyXG4gICAgaWYoICF3ZWxjb21lID09PSAwICkgcmV0dXJuO1xyXG5cclxuXHJcbiAgICB3ZWxjb21lLm9uKCdjbGljaycsICdbZGF0YS1mbGlwPVwidG9nZ2xlXCJdJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICB2YXIgdHJpZ2dlciAgICAgPSAkKHRoaXMpO1xyXG4gICAgICB2YXIgaW5pdFRyaWdnZXIgPSB3ZWxjb21lLmZpbmQoJy53ZWxjb21lX19idG4tYXV0aCcpO1xyXG4gICAgICB2YXIgZmxpcHBlciAgICAgPSB3ZWxjb21lLmZpbmQoJy53ZWxjb21lX19mbGlwcGVyJyk7XHJcbiAgICAgIHZhciBkdXJhdGlvbiAgICA9IDUwMDtcclxuXHJcblxyXG4gICAgICBmbGlwcGVyLnRvZ2dsZUNsYXNzKCd3ZWxjb21lX19mbGlwcGVyLS1mbGlwJyk7XHJcblxyXG4gICAgICBpZihmbGlwcGVyLmhhc0NsYXNzKCd3ZWxjb21lX19mbGlwcGVyLS1mbGlwJykpIHtcclxuICAgICAgICBpbml0VHJpZ2dlci5mYWRlT3V0KCBkdXJhdGlvbiApO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGluaXRUcmlnZ2VyLmZhZGVJbiggZHVyYXRpb24gKTtcclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG5cclxuICB9KSgpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgLy8g0J/RgNC+0LrRgNGD0YLQuNGC0Ywg0YHRgtGA0LDQvdC40YbRgyDQtNC+IC4uLlxyXG4gIChmdW5jdGlvbigpIHtcclxuXHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnW2RhdGEtZ29dJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICB2YXIgYnRuICAgICAgICA9ICQodGhpcyk7XHJcbiAgICAgIHZhciB0YXJnZXQgICAgID0gYnRuLmF0dHIoJ2RhdGEtZ28nKTtcclxuICAgICAgdmFyIGNvbnRhaW5lciAgPSBudWxsO1xyXG5cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHNjcm9sbFRvUG9zaXRpb24ocG9zaXRpb24sIGR1cmF0aW9uKSB7XHJcbiAgICAgICAgdmFyIHBvc2l0aW9uID0gcG9zaXRpb24gfHwgMDtcclxuICAgICAgICB2YXIgZHVyYXRpb24gPSBkdXJhdGlvbiB8fCAxMDAwO1xyXG5cclxuXHJcbiAgICAgICAgJChcImJvZHksIGh0bWxcIikuYW5pbWF0ZSh7XHJcbiAgICAgICAgICBzY3JvbGxUb3A6IHBvc2l0aW9uXHJcbiAgICAgICAgfSwgZHVyYXRpb24pO1xyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgaWYgKHRhcmdldCA9PSAndG9wJykge1xyXG4gICAgICAgIHNjcm9sbFRvUG9zaXRpb24oKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRhcmdldCA9PSAnbmV4dCcpIHtcclxuICAgICAgICBjb250YWluZXIgPSBidG4uY2xvc2VzdCgnLnNlY3Rpb24nKTtcclxuICAgICAgICBzY3JvbGxUb1Bvc2l0aW9uKCBjb250YWluZXIuaGVpZ2h0KCkgKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gIH0pKCk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAvLyBzdGlja3kt0LzQtdC90Y4g0L3QsCDRgdGC0YDQsNC90LjRhtC1INCx0LvQvtCz0LBcclxuICAoZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgY29udGFpbmVyID0gJCgnLmJsb2dfX2luJyk7XHJcbiAgICB2YXIgbWVudSAgICAgID0gY29udGFpbmVyLmZpbmQoJy5ibG9nX19tZW51Jyk7XHJcblxyXG4gICAgaWYgKG1lbnUubGVuZ3RoID09PSAwIHx8IGlzTW9iaWxlKSByZXR1cm47XHJcblxyXG4gICAgdmFyIGNvbnRhaW5lckJvdHRvbSA9IGNvbnRhaW5lci5vZmZzZXQoKS50b3AgKyBjb250YWluZXIuaGVpZ2h0KCkgLSA0MDtcclxuICAgIHZhciBlZGdlVG9wICAgICAgICAgPSBtZW51Lm9mZnNldCgpLnRvcDtcclxuICAgIHZhciBtZW51SGVpZ2h0ICAgICAgPSBtZW51LmhlaWdodCgpO1xyXG5cclxuXHJcbiAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZihlZGdlVG9wIDwgJCh3aW5kb3cpLnNjcm9sbFRvcCgpKSB7XHJcbiAgICAgICAgaWYoY29udGFpbmVyQm90dG9tIDwgJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgbWVudUhlaWdodCkge1xyXG4gICAgICAgICAgbWVudVxyXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ2Jsb2dfX21lbnUtLWZpeC1ib3R0b20nKVxyXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2Jsb2dfX21lbnUtLXN0aWNreScpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBtZW51XHJcbiAgICAgICAgICAgIC5hZGRDbGFzcygnYmxvZ19fbWVudS0tc3RpY2t5JylcclxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdibG9nX19tZW51LS1maXgtYm90dG9tJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG1lbnUucmVtb3ZlQ2xhc3MoJ2Jsb2dfX21lbnUtLXN0aWNreScpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgfSkoKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8vINCf0YDQvtC60YDRg9GC0LrQsCDQtNC+INCy0YvQsdGA0LDQvdC90L7QuSDRgdGC0LDRgtGM0Lgg0LIg0LHQu9C+0LPQtVxyXG4gIChmdW5jdGlvbigpIHtcclxuICAgIHZhciBhcnRpY2xlQWxsID0gJCgnLnBvc3QnKTtcclxuICAgIHZhciBsaW5rc0FsbCAgID0gJCgnLmJsb2dfX21lbnUgLm1lbnVfX2xpbmsnKTtcclxuXHJcbiAgICBpZihhcnRpY2xlQWxsLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG5cclxuICAgIHNob3dTZWN0aW9uKHdpbmRvdy5sb2NhdGlvbi5oYXNoLCBmYWxzZSk7XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIHNob3dTZWN0aW9uKHNlY3Rpb24sIGlzQW5pbWF0ZSkge1xyXG4gICAgICB2YXIgdGFyZ2V0ICAgICAgICA9IHNlY3Rpb24ucmVwbGFjZSgnIycsICcnKTtcclxuICAgICAgdmFyIHJlcVNlY3Rpb24gICAgPSBhcnRpY2xlQWxsLmZpbHRlcignW2RhdGEtaWQ9XCInICsgdGFyZ2V0ICsgJ1wiXScpO1xyXG4gICAgICB2YXIgZHVyYXRpb24gICAgICA9IDc1MDtcclxuXHJcbiAgICAgIGlmIChyZXFTZWN0aW9uLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG4gICAgICB2YXIgcmVxU2VjdGlvblBvcyA9IHJlcVNlY3Rpb24ub2Zmc2V0KCkudG9wO1xyXG5cclxuICAgICAgaWYoaXNBbmltYXRlKSB7XHJcbiAgICAgICAgJCgnYm9keSwgaHRtbCcpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IHJlcVNlY3Rpb25Qb3MgfSwgZHVyYXRpb24pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICQoJ2JvZHksIGh0bWwnKS5zY3JvbGxUb3AocmVxU2VjdGlvblBvcyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGNoZWNrU2VjdGlvbigpIHtcclxuICAgICAgYXJ0aWNsZUFsbC5lYWNoKGZ1bmN0aW9uKGksIGl0ZW0pIHtcclxuICAgICAgICB2YXIgYXJ0aWNsZSAgICA9ICQoaXRlbSk7XHJcbiAgICAgICAgdmFyIHRvcEVkZ2UgICAgPSBhcnRpY2xlLm9mZnNldCgpLnRvcCAtIDIwMDtcclxuICAgICAgICB2YXIgYm90dG9tRWRnZSA9IHRvcEVkZ2UgKyBhcnRpY2xlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciB0b3BTY3JvbGwgID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG5cclxuICAgICAgICBpZiAodG9wRWRnZSA8IHRvcFNjcm9sbCAmJiBib3R0b21FZGdlID4gdG9wU2Nyb2xsKSB7XHJcbiAgICAgICAgICB2YXIgY3VycmVudElkID0gYXJ0aWNsZS5kYXRhKCdpZCcpO1xyXG4gICAgICAgICAgdmFyIHJlcUxpbmsgICA9IGxpbmtzQWxsLmZpbHRlcignW2hyZWY9XCIjJyArIGN1cnJlbnRJZCArICdcIl0nKTtcclxuXHJcbiAgICAgICAgICByZXFMaW5rLmNsb3Nlc3QoJy5tZW51X19pdGVtJylcclxuICAgICAgICAgICAgLmFkZENsYXNzKCdtZW51X19pdGVtLS1hY3RpdmUnKVxyXG4gICAgICAgICAgICAuc2libGluZ3MoKVxyXG4gICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnbWVudV9faXRlbS0tYWN0aXZlJyk7XHJcblxyXG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBjdXJyZW50SWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcclxuICAgICAgY2hlY2tTZWN0aW9uKCk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5ibG9nX19tZW51IC5tZW51X19saW5rJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHNob3dTZWN0aW9uKCQodGhpcykuYXR0cignaHJlZicpLCB0cnVlKTtcclxuICAgIH0pO1xyXG5cclxuICB9KSgpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgLy8g0JHQvtC60L7QstCw0LLRjyDQv9Cw0L3QtdC70Ywg0L3QsCDRgdGC0YDQsNC90LjRhtC1INCx0LvQvtCz0LBcclxuICAoZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgdHJpZ2dlciAgICAgPSAkKCcuYmxvZ19fc2lkZS10cmlnZ2VyJyk7XHJcbiAgICB2YXIgYWN0aXZlQ2xhc3MgPSAnYmxvZ19fc2lkZS0tc2hvdyc7XHJcbiAgICB2YXIgY29udGFpbmVyO1xyXG5cclxuICAgIGlmKCB0cmlnZ2VyLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnRhaW5lciA9IHRyaWdnZXIuY2xvc2VzdCgnLmJsb2dfX3NpZGUnKTs7XHJcblxyXG5cclxuICAgIHRyaWdnZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGNvbnRhaW5lci50b2dnbGVDbGFzcyggYWN0aXZlQ2xhc3MgKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmJsb2dfX21lbnUgIC5tZW51X19pdGVtJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBpdGVtICAgICAgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgaWYoaXRlbS5oYXNDbGFzcygnbWVudV9faXRlbS0tYWN0aXZlJykpIHJldHVybjtcclxuICAgICAgY29udGFpbmVyLnJlbW92ZUNsYXNzKCBhY3RpdmVDbGFzcyApO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmKCAkKGRvY3VtZW50KS53aWR0aCgpID49IDk2MCAmJiBjb250YWluZXIuaGFzQ2xhc3MoIGFjdGl2ZUNsYXNzICkgKSB7XHJcbiAgICAgICAgY29udGFpbmVyLnJlbW92ZUNsYXNzKCBhY3RpdmVDbGFzcyApO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgfSkoKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8vINCh0LvQsNC50LTQtdGAXHJcbiAgKGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHRyYW5zaXRpb25FbmQgPSAndHJhbnNpdGlvbmVuZCB3ZWJraXRUcmFuc2l0aW9uRW5kIG9UcmFuc2l0aW9uRW5kJztcclxuXHJcbiAgICBmdW5jdGlvbiBTbGlkZXIob3B0aW9ucykge1xyXG4gICAgICAgdmFyIGdhbGxlcnkgICAgID0gb3B0aW9ucy5lbGVtO1xyXG4gICAgICAgdmFyIHByZXYgICAgICAgID0gZ2FsbGVyeS5maW5kKCcuc2xpZGVyX19jb250cm9sLS1wcmV2Jyk7XHJcbiAgICAgICB2YXIgbmV4dCAgICAgICAgPSBnYWxsZXJ5LmZpbmQoJy5zbGlkZXJfX2NvbnRyb2wtLW5leHQnKTtcclxuXHJcbiAgICAgICB2YXIgc2xpZGVzICAgICAgICAgPSBnYWxsZXJ5LmZpbmQoJy5zbGlkZXJfX3ZpZXcgIC5zbGlkZXNfX2l0ZW0nKTtcclxuICAgICAgIHZhciBhY3RpdmVTbGlkZSAgICA9IHNsaWRlcy5maWx0ZXIoJy5zbGlkZXNfX2l0ZW0tLWFjdGl2ZScpO1xyXG4gICAgICAgdmFyIHNsaWRlc0NudCAgICAgID0gc2xpZGVzLmxlbmd0aDtcclxuICAgICAgIHZhciBhY3RpdmVTbGlkZUlkeCA9IGFjdGl2ZVNsaWRlLmluZGV4KCk7XHJcblxyXG4gICAgICAgdmFyIG1haW5TbGlkZXIgPSBnYWxsZXJ5LmZpbmQoJy5zbGlkZXJfX3ZpZXcgIC5zbGlkZXMnKTtcclxuICAgICAgIHZhciBtYWluU2xpZGVzID0gbWFpblNsaWRlci5maW5kKCcuc2xpZGVzX19pdGVtJyk7XHJcblxyXG4gICAgICAgdmFyIHByZXZTbGlkZXIgPSBnYWxsZXJ5LmZpbmQoJy5zbGlkZXJfX2NvbnRyb2wtLXByZXYgIC5zbGlkZXMnKTtcclxuICAgICAgIHZhciBwcmV2U2xpZGVzID0gcHJldlNsaWRlci5maW5kKCcuc2xpZGVzX19pdGVtJyk7XHJcblxyXG4gICAgICAgdmFyIG5leHRTbGlkZXIgPSBnYWxsZXJ5LmZpbmQoJy5zbGlkZXJfX2NvbnRyb2wtLW5leHQgIC5zbGlkZXMnKTtcclxuICAgICAgIHZhciBuZXh0U2xpZGVzID0gbmV4dFNsaWRlci5maW5kKCcuc2xpZGVzX19pdGVtJyk7XHJcbiAgICAgICB2YXIgaXNSZWFkeSAgICA9IGZhbHNlO1xyXG5cclxuXHJcbiAgICAgICB2YXIgZGVzYyAgPSBnYWxsZXJ5LmZpbmQoJy5zbGlkZXJfX2Rlc2MnKTtcclxuICAgICAgIHZhciB0aXRsZSA9IGRlc2MuZmluZCgnLnNsaWRlcl9fdGl0bGUnKTtcclxuICAgICAgIHZhciB0b29scyA9IGRlc2MuZmluZCgnLnNsaWRlcl9faW5mbycpO1xyXG4gICAgICAgdmFyIGxpbmsgID0gZGVzYy5maW5kKCcuc2xpZGVyX19saW5rJyk7XHJcblxyXG4gICAgICAgdmFyIGRhdGEgICAgICA9IGdhbGxlcnkuZmluZCgnLnNsaWRlcl9fZGF0YScpO1xyXG4gICAgICAgdmFyIGRhdGFJdGVtcyA9IGRhdGEuZmluZCgnLnNsaWRlci1kYXRhX19pdGVtJyk7XHJcblxyXG5cclxuICAgICAgIC8vIGluaXRcclxuICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAgICAgICBzaG93ZWRTbGlkZShuZXh0U2xpZGVzLCBnZXRJZHgoYWN0aXZlU2xpZGVJZHgsICduZXh0JykpO1xyXG4gICAgICAgICAgc2hvd2VkU2xpZGUocHJldlNsaWRlcywgZ2V0SWR4KGFjdGl2ZVNsaWRlSWR4LCAncHJldicpKTtcclxuICAgICAgICAgIHVwZGF0ZURlc2MoZGF0YUl0ZW1zLmVxKGFjdGl2ZVNsaWRlSWR4KSk7XHJcbiAgICAgICAgICBpc1JlYWR5ID0gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIGluaXQoKTtcclxuXHJcbiAgICAgICBmdW5jdGlvbiBzaG93ZWRTbGlkZShzbGlkZXIsIGlkeCkge1xyXG4gICAgICAgICAgc2xpZGVyXHJcbiAgICAgICAgICAgICAuZXEoaWR4KS5hZGRDbGFzcygnc2xpZGVzX19pdGVtLS1hY3RpdmUnKVxyXG4gICAgICAgICAgICAgLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ3NsaWRlc19faXRlbS0tYWN0aXZlJyk7XHJcbiAgICAgICB9XHJcblxyXG4gICAgICAgZnVuY3Rpb24gZGF0YUNoYW5nZShkaXJlY3Rpb24pIHtcclxuICAgICAgICAgIGFjdGl2ZVNsaWRlSWR4ID0gKGRpcmVjdGlvbiA9PT0gJ25leHQnKSA/IGdldElkeChhY3RpdmVTbGlkZUlkeCwgJ25leHQnKSA6IGdldElkeChhY3RpdmVTbGlkZUlkeCwgJ3ByZXYnKTtcclxuICAgICAgIH1cclxuXHJcbiAgICAgICBmdW5jdGlvbiBnZXRJZHgoY3VycmVudElkeCwgZGlyKSB7XHJcbiAgICAgICAgICBpZihkaXIgPT09ICdwcmV2Jykge1xyXG4gICAgICAgICAgICByZXR1cm4gKGN1cnJlbnRJZHggLSAxIDwgMCkgPyBzbGlkZXNDbnQgLSAxIDogY3VycmVudElkeCAtIDEgO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYoZGlyID09PSAnbmV4dCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChjdXJyZW50SWR4ICsgMSA+PSBzbGlkZXNDbnQpID8gMCA6IGN1cnJlbnRJZHggKyAxIDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZXR1cm4gY3VycmVudElkeDtcclxuICAgICAgIH1cclxuXHJcbiAgICAgICBmdW5jdGlvbiBjaGFuZ2VTbGlkZShzbGlkZXMsIGRpcmVjdGlvbiwgY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICB2YXIgY3VycmVudFNsaWRlICAgID0gc2xpZGVzLmZpbHRlcignLnNsaWRlc19faXRlbS0tYWN0aXZlJyk7XHJcbiAgICAgICAgICB2YXIgY3VycmVudFNsaWRlSWR4ID0gY3VycmVudFNsaWRlLmluZGV4KCk7XHJcbiAgICAgICAgICB2YXIgbmV3U2xpZGVJZHg7XHJcblxyXG4gICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3ByZXYnKSB7XHJcbiAgICAgICAgICAgICBuZXdTbGlkZUlkeCA9IGdldElkeChjdXJyZW50U2xpZGVJZHgsICdwcmV2Jyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAnbmV4dCcpIHtcclxuICAgICAgICAgICAgIG5ld1NsaWRlSWR4ID0gZ2V0SWR4KGN1cnJlbnRTbGlkZUlkeCwgJ25leHQnKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBzbGlkZXMuZXEobmV3U2xpZGVJZHgpXHJcbiAgICAgICAgICAgICAuYWRkQ2xhc3MoIGNsYXNzTmFtZSApXHJcbiAgICAgICAgICAgICAub25lKHRyYW5zaXRpb25FbmQsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKVxyXG4gICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCBjbGFzc05hbWUgKVxyXG4gICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGlkZXNfX2l0ZW0tLWFjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICAgICAudHJpZ2dlcignY2hhbmdlZC1zbGlkZScpO1xyXG4gICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgY3VycmVudFNsaWRlXHJcbiAgICAgICAgICAgICAuYWRkQ2xhc3MoIGNsYXNzTmFtZSApXHJcbiAgICAgICAgICAgICAub25lKHRyYW5zaXRpb25FbmQsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnc2xpZGVzX19pdGVtLS1hY3RpdmUgJyArIGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuXHJcbiAgICAgICBmdW5jdGlvbiBjaGFuZ2VBbGwoZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICBjaGFuZ2VTbGlkZShtYWluU2xpZGVzLCBkaXJlY3Rpb24sICdzbGlkZXNfX2l0ZW0tLWFuaW1hdGUtZmFkZScpO1xyXG4gICAgICAgICAgY2hhbmdlU2xpZGUocHJldlNsaWRlcywgZGlyZWN0aW9uLCAnc2xpZGVzX19pdGVtLS1hbmltYXRlLWRvd24nKTtcclxuICAgICAgICAgIGNoYW5nZVNsaWRlKG5leHRTbGlkZXMsIGRpcmVjdGlvbiwgJ3NsaWRlc19faXRlbS0tYW5pbWF0ZS11cCcpO1xyXG4gICAgICAgfVxyXG5cclxuICAgICAgIGZ1bmN0aW9uIHVwZGF0ZURlc2MoZGF0YSkge1xyXG4gICAgICAgICAgdGl0bGUudGV4dCggZGF0YS5hdHRyKCdkYXRhLXRpdGxlJykgKTtcclxuICAgICAgICAgIHRvb2xzLnRleHQoIGRhdGEuYXR0cignZGF0YS10b29scycpICk7XHJcbiAgICAgICAgICBsaW5rLmF0dHIoJ2hyZWYnLCBkYXRhLmF0dHIoJ2RhdGEtbGluaycpICk7XHJcbiAgICAgICB9XHJcblxyXG4gICAgICAgJChkb2N1bWVudCkub24oJ2NoYW5nZWQtc2xpZGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGlzUmVhZHkgPSB0cnVlO1xyXG4gICAgICAgfSk7XHJcblxyXG5cclxuXHJcbiAgICAgICB0aGlzLnByZXYgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGlmKCAhaXNSZWFkeSApIHJldHVybjtcclxuICAgICAgICAgIGlzUmVhZHkgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICBjaGFuZ2VBbGwoJ3ByZXYnKVxyXG4gICAgICAgICAgZGF0YUNoYW5nZSgncHJldicpO1xyXG5cclxuICAgICAgICAgIHVwZGF0ZURlc2MoZGF0YUl0ZW1zLmVxKGFjdGl2ZVNsaWRlSWR4KSk7XHJcbiAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICB0aGlzLm5leHQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGlmKCAhaXNSZWFkeSApIHJldHVybjtcclxuICAgICAgICAgIGlzUmVhZHkgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICBjaGFuZ2VBbGwoJ25leHQnKVxyXG4gICAgICAgICAgZGF0YUNoYW5nZSgnbmV4dCcpO1xyXG5cclxuICAgICAgICAgIHVwZGF0ZURlc2MoZGF0YUl0ZW1zLmVxKGFjdGl2ZVNsaWRlSWR4KSk7XHJcbiAgICAgICB9O1xyXG5cclxuICAgICAgIHByZXYub24oJ2NsaWNrJywgdGhpcy5wcmV2KTtcclxuICAgICAgIG5leHQub24oJ2NsaWNrJywgdGhpcy5uZXh0KTtcclxuICAgIH0gLy8gU2xpZGVyXHJcblxyXG5cclxuICAgIHZhciBzbGlkZXIgPSBuZXcgU2xpZGVyKHtcclxuICAgICAgIGVsZW06ICQoJyNqcy1zbGlkZXInKVxyXG4gICAgfSk7XHJcbiAgfSkoKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8vINCe0LHRgNCw0LHQvtGC0LrQsCDQuCDQvtGC0L/RgNCw0LLQutCwINGE0L7RgNC8XHJcbiAgKGZ1bmN0aW9uKCkge1xyXG4gICAgJCgnZm9ybScpLmF0dHIoJ25vdmFsaWRhdGUnLCB0cnVlKTtcclxuXHJcbiAgICAvKiDQn9GA0Lgg0YTQvtC60YPRgdC1INGD0LHQuNGA0LDRgtGMINC60YDQsNGB0L3Rg9GOINC+0LHQstC+0LTQutGDICovXHJcbiAgICAkKGRvY3VtZW50KS5vbignZm9jdXMnLCAnaW5wdXQsIHRleHRhcmVhJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAkKHRoaXMpXHJcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdmaWVsZC0tZXJyb3InKVxyXG4gICAgICAgIC5yZW1vdmVDbGFzcygnZmllbGQtLW9rJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKGRvY3VtZW50KS5vbigncmVzZXQnLCAnZm9ybScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgJCh0aGlzKS5maW5kKCdpbnB1dCwgdGV4dGFyZWEnKVxyXG4gICAgICAgIC5yZW1vdmVDbGFzcygnZmllbGQtLWVycm9yJylcclxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2ZpZWxkLS1vaycpO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIC8vINCS0LDQu9C40LTQsNGG0LjRjyDQv9C+0LvQtdC5INGE0L7RgNC80YtcclxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlRm9ybShmb3JtKSB7XHJcbiAgICAgIHZhciBpbnB1dHMgICAgID0gZm9ybS5maW5kKCdbcmVxdWlyZWRdJyk7XHJcbiAgICAgIHZhciBpc1ZhbGlkYXRlID0gdHJ1ZTtcclxuXHJcbiAgICAgIGlucHV0cy5yZW1vdmVDbGFzcygnZmllbGQtLWVycm9yJyk7XHJcblxyXG4gICAgICBpbnB1dHMuZWFjaChmdW5jdGlvbihpLCBpdGVtKSB7XHJcbiAgICAgICAgdmFyIGlucHV0ID0gJChpdGVtKTtcclxuICAgICAgICB2YXIgdmFsdWUgPSBpbnB1dC52YWwoKTtcclxuICAgICAgICB2YXIgdHlwZSAgPSBpbnB1dC5hdHRyKCd0eXBlJyk7XHJcblxyXG4gICAgICAgIGlmKHR5cGUgPT0gJ2NoZWNrYm94Jykge1xyXG4gICAgICAgICAgaWYoIWlucHV0LmlzKCc6Y2hlY2tlZCcpKSB7XHJcbiAgICAgICAgICAgIGlucHV0LmFkZENsYXNzKCdmaWVsZC0tZXJyb3InKTtcclxuICAgICAgICAgICAgaXNWYWxpZGF0ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodmFsdWUudHJpbSgpID09ICcnKSB7XHJcbiAgICAgICAgICBpbnB1dC5hZGRDbGFzcygnZmllbGQtLWVycm9yJyk7XHJcbiAgICAgICAgICBpc1ZhbGlkYXRlID0gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlucHV0XHJcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnZmllbGQtLWVycm9yJylcclxuICAgICAgICAgICAgLmFkZENsYXNzKCdmaWVsZC0tb2snKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcmV0dXJuIGlzVmFsaWRhdGU7XHJcbiAgICB9IC8vIHZhbGlkYXRlRm9ybSgpO1xyXG5cclxuXHJcblxyXG5cclxuICAgIC8qINCe0YLQv9GA0LDQstC60LAg0YTQvtGA0LwgKi9cclxuICAgIGZ1bmN0aW9uIHNlbmRGb3JtKGZvcm0sIG1ldGhvZCwgdXJsLCBkYXRhVHlwZSkge1xyXG4gICAgICAgIGlmKCAhdmFsaWRhdGVGb3JtKGZvcm0pICkgcmV0dXJuO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgdHlwZTogbWV0aG9kLFxyXG4gICAgICAgICAgdXJsOiAgdXJsLFxyXG4gICAgICAgICAgZGF0YTogZm9ybS5zZXJpYWxpemUoKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmRvbmUoZnVuY3Rpb24oYW5zd2VyKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnZm9ybSBzZW5kJyk7XHJcbiAgICAgICAgICBmb3JtLnRyaWdnZXIoJ3Jlc2V0Jyk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuZmFpbChmdW5jdGlvbigpIHtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdmb3JtIHNlbmQ6IGVycm9yJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IC8vIHNlbmRGb3JtKCk7XHJcblxyXG5cclxuICAgICQoJy5mb3JtLW1vZGFsLS1jYWxsYmFjaycpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgc2VuZEZvcm0oJCh0aGlzKSwgJ1BPU1QnLCAnbWFpbC5waHAnKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAkKCcjZm9ybS1hdXRob3JpemF0aW9uJykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBzZW5kRm9ybSgkKHRoaXMpLCAnUE9TVCcsICdhdXRob3JpemF0aW9uLnBocCcpO1xyXG4gICAgfSk7XHJcblxyXG4gIH0pKCk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAvLyDQmtCw0YDRgtCwXHJcbiAgKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIHZhciBtYXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJyk7XHJcblxyXG4gICAgaWYoIG1hcCA9PT0gbnVsbCApIHJldHVybjtcclxuXHJcblxyXG4gICAgLy8g0L/QsNGA0LDQvNC10YLRgNGLINC60LDRgNGC0YtcclxuICAgIHZhciBsYXRpdHVkZSAgPSA1OC4wMjIzODQ5O1xyXG4gICAgdmFyIGxvbmdpdHVkZSA9IDU2LjIzMzg0NjI7XHJcbiAgICB2YXIgbWFwWm9vbSAgPSAxNTtcclxuXHJcblxyXG4gICAgLy8g0KHRgtC40LvQuNC30LDRhtC40Y8g0LrQsNGA0YLRi1xyXG4gICAgdmFyIG1haW7QoW9sb3IgPSBcIiM2MURBQzlcIjtcclxuXHJcbiAgICB2YXIgc3R5bGUgPSBbXHJcbiAgICAgIHtcclxuICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIixcclxuICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLnRleHQuZmlsbFwiLFxyXG4gICAgICAgIFwic3R5bGVyc1wiOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIFwiY29sb3JcIjogXCIjNDQ0NDQ0XCJcclxuICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwibGFuZHNjYXBlXCIsXHJcbiAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImFsbFwiLFxyXG4gICAgICAgIFwic3R5bGVyc1wiOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIFwiY29sb3JcIjogXCIjZjJmMmYyXCJcclxuICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwibGFuZHNjYXBlLm1hbl9tYWRlXCIsXHJcbiAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5LmZpbGxcIixcclxuICAgICAgICBcInN0eWxlcnNcIjogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBcImNvbG9yXCI6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInBvaVwiLFxyXG4gICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcclxuICAgICAgICBcInN0eWxlcnNcIjogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkXCIsXHJcbiAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImFsbFwiLFxyXG4gICAgICAgIFwic3R5bGVyc1wiOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIFwic2F0dXJhdGlvblwiOiAtMTAwXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBcImxpZ2h0bmVzc1wiOiA0NVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkXCIsXHJcbiAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5LmZpbGxcIixcclxuICAgICAgICBcInN0eWxlcnNcIjogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBcImNvbG9yXCI6IFwiI2Q2ZDZkNlwiXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWQuaGlnaHdheVwiLFxyXG4gICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcclxuICAgICAgICBcInN0eWxlcnNcIjogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJzaW1wbGlmaWVkXCJcclxuICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicm9hZC5hcnRlcmlhbFwiLFxyXG4gICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMuaWNvblwiLFxyXG4gICAgICAgIFwic3R5bGVyc1wiOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9mZlwiXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInRyYW5zaXRcIixcclxuICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiYWxsXCIsXHJcbiAgICAgICAgXCJzdHlsZXJzXCI6IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib2ZmXCJcclxuICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwid2F0ZXJcIixcclxuICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiYWxsXCIsXHJcbiAgICAgICAgXCJzdHlsZXJzXCI6IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgXCJjb2xvclwiOiBcIiM0NmJjZWNcIlxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib25cIlxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJ3YXRlclwiLFxyXG4gICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeS5maWxsXCIsXHJcbiAgICAgICAgXCJzdHlsZXJzXCI6IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgXCJjb2xvclwiOiBtYWlu0KFvbG9yXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcIndhdGVyXCIsXHJcbiAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImxhYmVsc1wiLFxyXG4gICAgICAgIFwic3R5bGVyc1wiOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9mZlwiXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgICB9XHJcbiAgICBdXHJcblxyXG5cclxuXHJcbiAgICAvLyDQndCw0YHRgtGA0L7QudC60Lgg0LrQsNGA0YLRi1xyXG4gICAgdmFyIG1hcE9wdGlvbnMgPSB7XHJcbiAgICAgIGNlbnRlcjogbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhsYXRpdHVkZSwgbG9uZ2l0dWRlKSxcclxuICAgICAgem9vbTogbWFwWm9vbSxcclxuICAgICAgcGFuQ29udHJvbDogZmFsc2UsXHJcbiAgICAgIHpvb21Db250cm9sOiBmYWxzZSxcclxuICAgICAgbWFwVHlwZUNvbnRyb2w6IGZhbHNlLFxyXG4gICAgICBzdHJlZXRWaWV3Q29udHJvbDogZmFsc2UsXHJcbiAgICAgIG1hcFR5cGVJZDogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkLlJPQURNQVAsXHJcbiAgICAgIHNjcm9sbHdoZWVsOiBmYWxzZSxcclxuICAgICAgc3R5bGVzOiBzdHlsZSxcclxuICAgIH1cclxuXHJcbiAgICAvLyDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDQutCw0YDRgtGLXHJcbiAgICB2YXIgZ29vZ2xlTWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChtYXAsIG1hcE9wdGlvbnMpO1xyXG5cclxuICB9KSgpO1xyXG5cclxufSk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuJCh3aW5kb3cpLm9uKCdsb2FkJywgZnVuY3Rpb24oKSB7XHJcbiAgJCgnYm9keScpLmFkZENsYXNzKCdsb2FkZWQnKTtcclxuICBwaWUuZ2V0VmFsdWUoKTtcclxufSk7XHJcblxyXG5cclxuXHJcbiQoIHdpbmRvdyApLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcclxuICBwYXJhbGxheC5pbml0KCAkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKTtcclxufSk7XHJcblxyXG5cclxuXHJcbiQoIHdpbmRvdyApLm9uKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcclxuICBibHVyLnNldCgpO1xyXG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBpc01vYmlsZSA9IC9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeXxJRU1vYmlsZXxPcGVyYSBNaW5pL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vLyBwYXJhbGxheFxyXG52YXIgcGFyYWxsYXggPSAoZnVuY3Rpb24oKSB7XHJcblxyXG4gIHZhciBiZyAgICAgICAgPSAkKCcuZmlyc3RfX2JnJyk7XHJcbiAgdmFyIHNlY3Rpb24gICA9ICQoJy5maXJzdF9fbWUgIC5tZScpO1xyXG4gIHZhciB0ZXh0ICAgICAgPSAkKCcuZmlyc3RfX2JnLXRleHQnKTtcclxuICB2YXIgYmxvZ1RpdGxlID0gJCgnLmZpcnN0X190aXRsZS13cmFwJyk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBtb3ZlOiBmdW5jdGlvbihlbCwgd2luZG93U2Nyb2xsLCBzdHJhZmVBbW91bnQpIHtcclxuICAgICAgdmFyIHdTY3JvbGwgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XHJcblxyXG4gICAgICB2YXIgc3RyYWZlID0gd2luZG93U2Nyb2xsIC8gLXN0cmFmZUFtb3VudCArICclJztcclxuICAgICAgdmFyIHRyYW5zZm9ybVN0cmluZyA9ICd0cmFuc2xhdGUzZCgwLCcgKyBzdHJhZmUgKyAnLCAwKSc7XHJcblxyXG4gICAgICBlbC5jc3Moe1xyXG4gICAgICAgICd0cmFuc2Zvcm0nOiB0cmFuc2Zvcm1TdHJpbmcsXHJcbiAgICAgICAgJy13ZWJraXQtdHJhbnNmb3JtJzogdHJhbnNmb3JtU3RyaW5nXHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24od1Njcm9sbCkge1xyXG4gICAgICB0aGlzLm1vdmUoYmcsIHdTY3JvbGwsIDUwKTtcclxuICAgICAgdGhpcy5tb3ZlKHRleHQsIHdTY3JvbGwsIDMwKTtcclxuICAgICAgdGhpcy5tb3ZlKHNlY3Rpb24sIHdTY3JvbGwsIDE1KTtcclxuICAgICAgdGhpcy5tb3ZlKGJsb2dUaXRsZSwgd1Njcm9sbCwgMTgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG59KSgpO1xyXG5cclxuXHJcblxyXG5cclxuLy8gYmx1clxyXG52YXIgYmx1ciA9IChmdW5jdGlvbigpIHtcclxuXHJcbiAgdmFyIGJsdXIgICAgICA9ICQoJ1tkYXRhLWJsdXItZWxlbT1cImZvcm1cIl0nKTtcclxuICB2YXIgY29udGFpbmVyID0gJCgnW2RhdGEtYmx1ci1jb250YWluZXI9XCJmb3JtXCJdJyk7XHJcblxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgc2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKCFibHVyLmxlbmd0aCB8fCAhY29udGFpbmVyLmxlbmd0aCApIHJldHVybjtcclxuXHJcbiAgICAgIHZhciBpbWdXaWR0aCAgID0gY29udGFpbmVyLndpZHRoKCk7XHJcbiAgICAgIHZhciBvZmZzZXRUb3AgID0gY29udGFpbmVyLm9mZnNldCgpLnRvcCAgLSBibHVyLm9mZnNldCgpLnRvcDtcclxuICAgICAgdmFyIG9mZnNldExlZnQgPSBjb250YWluZXIub2Zmc2V0KCkubGVmdCAtIGJsdXIub2Zmc2V0KCkubGVmdDtcclxuXHJcbiAgICAgIGJsdXIuY3NzKHtcclxuICAgICAgICAnYmFja2dyb3VuZC1zaXplJzogaW1nV2lkdGggKyAncHggYXV0bycsXHJcbiAgICAgICAgJ2JhY2tncm91bmQtcG9zaXRpb24nOiBvZmZzZXRMZWZ0ICsgJ3B4JyArICcgJyArIG9mZnNldFRvcCArICdweCdcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbn0pKCk7XHJcblxyXG5cclxuXHJcblxyXG4vLyBncmFwaCBpbml0XHJcbnZhciBwaWUgPSAoZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHBpZUFsbCA9IG51bGw7XHJcblxyXG5cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBwaWVBbGwgPSAkKCcuZ3JhcGhfX2luJyk7XHJcbiAgICAgIGlmKHBpZUFsbC5sZW5ndGggPT09IDApIHJldHVybjtcclxuXHJcbiAgICAgIHBpZUFsbC5lYWNoKGZ1bmN0aW9uKGksIGl0ZW0pIHtcclxuICAgICAgICB2YXIgdmFsdWUgPSAkKGl0ZW0pLmF0dHIoJ3N0cm9rZS1kYXNoYXJyYXknKTtcclxuICAgICAgICBpdGVtLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgJChpdGVtKS5hdHRyKCdzdHJva2UtZGFzaGFycmF5JywgJzAgMTAwJyk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRWYWx1ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmKHBpZUFsbC5sZW5ndGggPT09IDApIHJldHVybjtcclxuXHJcbiAgICAgIHBpZUFsbC5lYWNoKGZ1bmN0aW9uKGksIGl0ZW0pIHtcclxuICAgICAgICBpdGVtLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLWRhc2hhcnJheScsIGl0ZW0udmFsdWUpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9O1xyXG59KSgpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbiQoIGRvY3VtZW50ICkucmVhZHkoZnVuY3Rpb24oKSB7XHJcblxyXG4gIHBpZS5pbml0KCk7XHJcbiAgYmx1ci5zZXQoKTtcclxuICBwYXJhbGxheC5pbml0KCk7XHJcblxyXG4gIC8vIHBhcmFsbGF4IG9uIHRoZSB3ZWxjb21lIHBhZ2VcclxuICB2YXIgbW91c2VQYXJhbGxheCA9IChmdW5jdGlvbigpIHtcclxuXHJcbiAgICB2YXIgbGF5ZXJBbGwgPSAkKCcucGFyYWxsYXhfX2xheWVyJyk7XHJcblxyXG4gICAgJCh3aW5kb3cpLm9uKCdtb3VzZW1vdmUnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgIHZhciBtb3VzZVggPSBlLnBhZ2VYO1xyXG4gICAgICB2YXIgbW91c2VZID0gZS5wYWdlWTtcclxuXHJcbiAgICAgIHZhciB3ID0gKHdpbmRvdy5pbm5lcldpZHRoIC8gMikgIC0gbW91c2VYO1xyXG4gICAgICB2YXIgaCA9ICh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSAtIG1vdXNlWTtcclxuXHJcbiAgICAgIGxheWVyQWxsLm1hcChmdW5jdGlvbihpLGl0ZW0pIHtcclxuICAgICAgICAgdmFyIHdQb3MgPSB3ICogKChpICsgMSkgLyAxNzUpO1xyXG4gICAgICAgICB2YXIgaFBvcyA9IGggKiAoKGkgKyAxKSAvIDIyMCk7XHJcblxyXG4gICAgICAgICAkKGl0ZW0pLmNzcyh7XHJcbiAgICAgICAgICAgICd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlM2QoJysgd1BvcyArJ3B4LCcgKyBoUG9zICsgJ3B4LCAwKSdcclxuICAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gIH0pKCk7XHJcblxyXG4gIC8vIHByZWxvYWRlclxyXG4gIChmdW5jdGlvbigpIHtcclxuXHJcbiAgICB2YXIgaW1ncyA9IFtdO1xyXG5cclxuICAgICQoJyonKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyICR0aGlzICAgICAgPSAkKHRoaXMpO1xyXG4gICAgICB2YXIgYmFja2dyb3VuZCA9ICR0aGlzLmNzcygnYmFja2dyb3VuZC1pbWFnZScpO1xyXG4gICAgICB2YXIgaXNJbWcgICAgICA9ICR0aGlzLmlzKCdpbWcnKTtcclxuXHJcbiAgICAgIGlmIChiYWNrZ3JvdW5kICE9PSAnbm9uZScpIHtcclxuICAgICAgICB2YXIgcGF0aCA9IGJhY2tncm91bmQucmVwbGFjZSgndXJsKFwiJywgJycpLnJlcGxhY2UoJ1wiKScsICcnKTtcclxuXHJcbiAgICAgICAgaWYoIHBhdGguaW5kZXhPZignLWdyYWRpZW50KCcpICE9PSAtMSApIHJldHVybjtcclxuXHJcbiAgICAgICAgaW1ncy5wdXNoKHBhdGgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXNJbWcpIHtcclxuICAgICAgICB2YXIgcGF0aCA9ICR0aGlzLmF0dHIoJ3NyYycpO1xyXG5cclxuICAgICAgICBpZiAoIXBhdGgpIHJldHVybjtcclxuICAgICAgICBpbWdzLnB1c2gocGF0aCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICB2YXIgcGVyY2VudHNUb3RhbCA9IDE7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbWdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBpbWFnZSA9ICQoJzxpbWc+Jywge1xyXG4gICAgICAgIGF0dHI6IHtcclxuICAgICAgICAgIHNyYzogaW1nc1tpXVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpbWFnZS5vbmUoe1xyXG4gICAgICAgIGxvYWQgOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBzZXRQZXJjZW50cyhpbWdzLmxlbmd0aCwgcGVyY2VudHNUb3RhbCk7XHJcbiAgICAgICAgICBwZXJjZW50c1RvdGFsKys7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlcnJvciA6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHBlcmNlbnRzVG90YWwrKztcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNldFBlcmNlbnRzKHRvdGFsLCBjdXJyZW50KSB7XHJcbiAgICAgIHZhciBwZXJjZW50ID0gTWF0aC5jZWlsKGN1cnJlbnQgLyB0b3RhbCAqIDEwMCk7XHJcblxyXG4gICAgICBpZiAocGVyY2VudCA+PSAxMDApIHtcclxuICAgICAgICAkKCcucHJlbG9hZGVyJykuZmFkZU91dCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkKCcucHJlbG9hZGVyX192YWx1ZScpLnRleHQocGVyY2VudCk7XHJcbiAgICB9XHJcblxyXG4gIH0pKCk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAvLyDQoNCw0LHQvtGC0LAg0LPQu9Cw0LLQvdC+0LPQviDQvNC10L3RjlxyXG4gIChmdW5jdGlvbigpIHtcclxuXHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLm5hdl9fdHJpZ2dlcicsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgdmFyIHRyaWdnZXIgPSAkKHRoaXMpO1xyXG4gICAgICB2YXIgbmF2ICAgICA9IHRyaWdnZXIuY2xvc2VzdCgnLm5hdicpO1xyXG4gICAgICB2YXIgZHJvcCAgICA9IG5hdi5maW5kKCcubmF2X19kcm9wJyk7XHJcbiAgICAgIHZhciBoZWFkZXIgID0gJCgnLmhlYWRlcicpO1xyXG5cclxuXHJcbiAgICAgIGlmKG5hdi5oYXNDbGFzcygnbmF2LS1vcGVuJykpIHtcclxuXHJcbiAgICAgICAgZHJvcC5mYWRlT3V0KCA1MDAgLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIG5hdi5yZW1vdmVDbGFzcygnbmF2LS1vcGVuJyk7XHJcbiAgICAgICAgICAkKCdib2R5JykuY3NzKCdvdmVyZmxvdycsICcnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaGVhZGVyLmNzcygnei1pbmRleCcsICcnKTtcclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIGRyb3Auc2hvdygwLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIG5hdi5hZGRDbGFzcygnbmF2LS1vcGVuJyk7XHJcbiAgICAgICAgICBoZWFkZXIuY3NzKCd6LWluZGV4JywgMTAwKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCgnYm9keScpLmNzcygnb3ZlcmZsb3cnLCAnaGlkZGVuJyk7XHJcblxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgfSkoKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8vINCi0LDQsdGLINCyINCw0LTQvNC40L3QutC1XHJcbiAgKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuYWRtLXRhYl9fY29udHJvbCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgdmFyIGJ0biAgICAgICA9ICQodGhpcyk7XHJcbiAgICAgIHZhciBpZHggICAgICAgPSBidG4uaW5kZXgoKTtcclxuICAgICAgdmFyIGNvbnRhaW5lciA9IGJ0bi5jbG9zZXN0KCcuYWRtLXRhYicpO1xyXG4gICAgICB2YXIgYm9keUFsbCAgID0gY29udGFpbmVyLmZpbmQoJy5hZG0tdGFiX19ib2R5Jyk7XHJcblxyXG4gICAgICBidG5cclxuICAgICAgICAuYWRkQ2xhc3MoJ2FkbS10YWJfX2NvbnRyb2wtLWFjdGl2ZScpXHJcbiAgICAgICAgLnNpYmxpbmdzKClcclxuICAgICAgICAgIC5yZW1vdmVDbGFzcygnYWRtLXRhYl9fY29udHJvbC0tYWN0aXZlJyk7XHJcblxyXG4gICAgICBib2R5QWxsLnJlbW92ZUNsYXNzKCdhZG0tdGFiX19ib2R5LS1hY3RpdmUnKTtcclxuICAgICAgYm9keUFsbC5lcShpZHgpXHJcbiAgICAgICAgLmFkZENsYXNzKCdhZG0tdGFiX19ib2R5LS1hY3RpdmUnKTtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgfSkoKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8vINCg0LDQsdC+0YLQsCDQtNCy0YPRhdGB0YLQvtGA0L7QvdC90LXQuSDQutCw0YDRgtC+0YfQutC4INC90LAg0LPQu9Cw0LLQvdC+0Lkg0YHRgtGA0LDQvdC40YbQtVxyXG4gIChmdW5jdGlvbigpIHtcclxuXHJcbiAgICB2YXIgd2VsY29tZSA9ICQoJy53ZWxjb21lJyk7XHJcblxyXG4gICAgaWYoICF3ZWxjb21lID09PSAwICkgcmV0dXJuO1xyXG5cclxuXHJcbiAgICB3ZWxjb21lLm9uKCdjbGljaycsICdbZGF0YS1mbGlwPVwidG9nZ2xlXCJdJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICB2YXIgdHJpZ2dlciAgICAgPSAkKHRoaXMpO1xyXG4gICAgICB2YXIgaW5pdFRyaWdnZXIgPSB3ZWxjb21lLmZpbmQoJy53ZWxjb21lX19idG4tYXV0aCcpO1xyXG4gICAgICB2YXIgZmxpcHBlciAgICAgPSB3ZWxjb21lLmZpbmQoJy53ZWxjb21lX19mbGlwcGVyJyk7XHJcbiAgICAgIHZhciBkdXJhdGlvbiAgICA9IDUwMDtcclxuXHJcblxyXG4gICAgICBmbGlwcGVyLnRvZ2dsZUNsYXNzKCd3ZWxjb21lX19mbGlwcGVyLS1mbGlwJyk7XHJcblxyXG4gICAgICBpZihmbGlwcGVyLmhhc0NsYXNzKCd3ZWxjb21lX19mbGlwcGVyLS1mbGlwJykpIHtcclxuICAgICAgICBpbml0VHJpZ2dlci5mYWRlT3V0KCBkdXJhdGlvbiApO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGluaXRUcmlnZ2VyLmZhZGVJbiggZHVyYXRpb24gKTtcclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG5cclxuICB9KSgpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgLy8g0J/RgNC+0LrRgNGD0YLQuNGC0Ywg0YHRgtGA0LDQvdC40YbRgyDQtNC+IC4uLlxyXG4gIChmdW5jdGlvbigpIHtcclxuXHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnW2RhdGEtZ29dJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICB2YXIgYnRuICAgICAgICA9ICQodGhpcyk7XHJcbiAgICAgIHZhciB0YXJnZXQgICAgID0gYnRuLmF0dHIoJ2RhdGEtZ28nKTtcclxuICAgICAgdmFyIGNvbnRhaW5lciAgPSBudWxsO1xyXG5cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHNjcm9sbFRvUG9zaXRpb24ocG9zaXRpb24sIGR1cmF0aW9uKSB7XHJcbiAgICAgICAgdmFyIHBvc2l0aW9uID0gcG9zaXRpb24gfHwgMDtcclxuICAgICAgICB2YXIgZHVyYXRpb24gPSBkdXJhdGlvbiB8fCAxMDAwO1xyXG5cclxuXHJcbiAgICAgICAgJChcImJvZHksIGh0bWxcIikuYW5pbWF0ZSh7XHJcbiAgICAgICAgICBzY3JvbGxUb3A6IHBvc2l0aW9uXHJcbiAgICAgICAgfSwgZHVyYXRpb24pO1xyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgaWYgKHRhcmdldCA9PSAndG9wJykge1xyXG4gICAgICAgIHNjcm9sbFRvUG9zaXRpb24oKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRhcmdldCA9PSAnbmV4dCcpIHtcclxuICAgICAgICBjb250YWluZXIgPSBidG4uY2xvc2VzdCgnLnNlY3Rpb24nKTtcclxuICAgICAgICBzY3JvbGxUb1Bvc2l0aW9uKCBjb250YWluZXIuaGVpZ2h0KCkgKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gIH0pKCk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAvLyBzdGlja3kt0LzQtdC90Y4g0L3QsCDRgdGC0YDQsNC90LjRhtC1INCx0LvQvtCz0LBcclxuICAoZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgY29udGFpbmVyID0gJCgnLmJsb2dfX2luJyk7XHJcbiAgICB2YXIgbWVudSAgICAgID0gY29udGFpbmVyLmZpbmQoJy5ibG9nX19tZW51Jyk7XHJcblxyXG4gICAgaWYgKG1lbnUubGVuZ3RoID09PSAwIHx8IGlzTW9iaWxlKSByZXR1cm47XHJcblxyXG4gICAgdmFyIGNvbnRhaW5lckJvdHRvbSA9IGNvbnRhaW5lci5vZmZzZXQoKS50b3AgKyBjb250YWluZXIuaGVpZ2h0KCkgLSA0MDtcclxuICAgIHZhciBlZGdlVG9wICAgICAgICAgPSBtZW51Lm9mZnNldCgpLnRvcDtcclxuICAgIHZhciBtZW51SGVpZ2h0ICAgICAgPSBtZW51LmhlaWdodCgpO1xyXG5cclxuXHJcbiAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZihlZGdlVG9wIDwgJCh3aW5kb3cpLnNjcm9sbFRvcCgpKSB7XHJcbiAgICAgICAgaWYoY29udGFpbmVyQm90dG9tIDwgJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgbWVudUhlaWdodCkge1xyXG4gICAgICAgICAgbWVudVxyXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ2Jsb2dfX21lbnUtLWZpeC1ib3R0b20nKVxyXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2Jsb2dfX21lbnUtLXN0aWNreScpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBtZW51XHJcbiAgICAgICAgICAgIC5hZGRDbGFzcygnYmxvZ19fbWVudS0tc3RpY2t5JylcclxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdibG9nX19tZW51LS1maXgtYm90dG9tJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG1lbnUucmVtb3ZlQ2xhc3MoJ2Jsb2dfX21lbnUtLXN0aWNreScpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgfSkoKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8vINCf0YDQvtC60YDRg9GC0LrQsCDQtNC+INCy0YvQsdGA0LDQvdC90L7QuSDRgdGC0LDRgtGM0Lgg0LIg0LHQu9C+0LPQtVxyXG4gIChmdW5jdGlvbigpIHtcclxuICAgIHZhciBhcnRpY2xlQWxsID0gJCgnLnBvc3QnKTtcclxuICAgIHZhciBsaW5rc0FsbCAgID0gJCgnLmJsb2dfX21lbnUgLm1lbnVfX2xpbmsnKTtcclxuXHJcbiAgICBpZihhcnRpY2xlQWxsLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG5cclxuICAgIHNob3dTZWN0aW9uKHdpbmRvdy5sb2NhdGlvbi5oYXNoLCBmYWxzZSk7XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIHNob3dTZWN0aW9uKHNlY3Rpb24sIGlzQW5pbWF0ZSkge1xyXG4gICAgICB2YXIgdGFyZ2V0ICAgICAgICA9IHNlY3Rpb24ucmVwbGFjZSgnIycsICcnKTtcclxuICAgICAgdmFyIHJlcVNlY3Rpb24gICAgPSBhcnRpY2xlQWxsLmZpbHRlcignW2RhdGEtaWQ9XCInICsgdGFyZ2V0ICsgJ1wiXScpO1xyXG4gICAgICB2YXIgZHVyYXRpb24gICAgICA9IDc1MDtcclxuXHJcbiAgICAgIGlmIChyZXFTZWN0aW9uLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG4gICAgICB2YXIgcmVxU2VjdGlvblBvcyA9IHJlcVNlY3Rpb24ub2Zmc2V0KCkudG9wO1xyXG5cclxuICAgICAgaWYoaXNBbmltYXRlKSB7XHJcbiAgICAgICAgJCgnYm9keSwgaHRtbCcpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IHJlcVNlY3Rpb25Qb3MgfSwgZHVyYXRpb24pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICQoJ2JvZHksIGh0bWwnKS5zY3JvbGxUb3AocmVxU2VjdGlvblBvcyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGNoZWNrU2VjdGlvbigpIHtcclxuICAgICAgYXJ0aWNsZUFsbC5lYWNoKGZ1bmN0aW9uKGksIGl0ZW0pIHtcclxuICAgICAgICB2YXIgYXJ0aWNsZSAgICA9ICQoaXRlbSk7XHJcbiAgICAgICAgdmFyIHRvcEVkZ2UgICAgPSBhcnRpY2xlLm9mZnNldCgpLnRvcCAtIDIwMDtcclxuICAgICAgICB2YXIgYm90dG9tRWRnZSA9IHRvcEVkZ2UgKyBhcnRpY2xlLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciB0b3BTY3JvbGwgID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG5cclxuICAgICAgICBpZiAodG9wRWRnZSA8IHRvcFNjcm9sbCAmJiBib3R0b21FZGdlID4gdG9wU2Nyb2xsKSB7XHJcbiAgICAgICAgICB2YXIgY3VycmVudElkID0gYXJ0aWNsZS5kYXRhKCdpZCcpO1xyXG4gICAgICAgICAgdmFyIHJlcUxpbmsgICA9IGxpbmtzQWxsLmZpbHRlcignW2hyZWY9XCIjJyArIGN1cnJlbnRJZCArICdcIl0nKTtcclxuXHJcbiAgICAgICAgICByZXFMaW5rLmNsb3Nlc3QoJy5tZW51X19pdGVtJylcclxuICAgICAgICAgICAgLmFkZENsYXNzKCdtZW51X19pdGVtLS1hY3RpdmUnKVxyXG4gICAgICAgICAgICAuc2libGluZ3MoKVxyXG4gICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnbWVudV9faXRlbS0tYWN0aXZlJyk7XHJcblxyXG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBjdXJyZW50SWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcclxuICAgICAgY2hlY2tTZWN0aW9uKCk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5ibG9nX19tZW51IC5tZW51X19saW5rJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHNob3dTZWN0aW9uKCQodGhpcykuYXR0cignaHJlZicpLCB0cnVlKTtcclxuICAgIH0pO1xyXG5cclxuICB9KSgpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgLy8g0JHQvtC60L7QstCw0LLRjyDQv9Cw0L3QtdC70Ywg0L3QsCDRgdGC0YDQsNC90LjRhtC1INCx0LvQvtCz0LBcclxuICAoZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgdHJpZ2dlciAgICAgPSAkKCcuYmxvZ19fc2lkZS10cmlnZ2VyJyk7XHJcbiAgICB2YXIgYWN0aXZlQ2xhc3MgPSAnYmxvZ19fc2lkZS0tc2hvdyc7XHJcbiAgICB2YXIgY29udGFpbmVyO1xyXG5cclxuICAgIGlmKCB0cmlnZ2VyLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnRhaW5lciA9IHRyaWdnZXIuY2xvc2VzdCgnLmJsb2dfX3NpZGUnKTs7XHJcblxyXG5cclxuICAgIHRyaWdnZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGNvbnRhaW5lci50b2dnbGVDbGFzcyggYWN0aXZlQ2xhc3MgKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmJsb2dfX21lbnUgIC5tZW51X19pdGVtJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBpdGVtICAgICAgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgaWYoaXRlbS5oYXNDbGFzcygnbWVudV9faXRlbS0tYWN0aXZlJykpIHJldHVybjtcclxuICAgICAgY29udGFpbmVyLnJlbW92ZUNsYXNzKCBhY3RpdmVDbGFzcyApO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmKCAkKGRvY3VtZW50KS53aWR0aCgpID49IDk2MCAmJiBjb250YWluZXIuaGFzQ2xhc3MoIGFjdGl2ZUNsYXNzICkgKSB7XHJcbiAgICAgICAgY29udGFpbmVyLnJlbW92ZUNsYXNzKCBhY3RpdmVDbGFzcyApO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgfSkoKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8vINCh0LvQsNC50LTQtdGAXHJcbiAgKGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHRyYW5zaXRpb25FbmQgPSAndHJhbnNpdGlvbmVuZCB3ZWJraXRUcmFuc2l0aW9uRW5kIG9UcmFuc2l0aW9uRW5kJztcclxuXHJcbiAgICBmdW5jdGlvbiBTbGlkZXIob3B0aW9ucykge1xyXG4gICAgICAgdmFyIGdhbGxlcnkgICAgID0gb3B0aW9ucy5lbGVtO1xyXG4gICAgICAgdmFyIHByZXYgICAgICAgID0gZ2FsbGVyeS5maW5kKCcuc2xpZGVyX19jb250cm9sLS1wcmV2Jyk7XHJcbiAgICAgICB2YXIgbmV4dCAgICAgICAgPSBnYWxsZXJ5LmZpbmQoJy5zbGlkZXJfX2NvbnRyb2wtLW5leHQnKTtcclxuXHJcbiAgICAgICB2YXIgc2xpZGVzICAgICAgICAgPSBnYWxsZXJ5LmZpbmQoJy5zbGlkZXJfX3ZpZXcgIC5zbGlkZXNfX2l0ZW0nKTtcclxuICAgICAgIHZhciBhY3RpdmVTbGlkZSAgICA9IHNsaWRlcy5maWx0ZXIoJy5zbGlkZXNfX2l0ZW0tLWFjdGl2ZScpO1xyXG4gICAgICAgdmFyIHNsaWRlc0NudCAgICAgID0gc2xpZGVzLmxlbmd0aDtcclxuICAgICAgIHZhciBhY3RpdmVTbGlkZUlkeCA9IGFjdGl2ZVNsaWRlLmluZGV4KCk7XHJcblxyXG4gICAgICAgdmFyIG1haW5TbGlkZXIgPSBnYWxsZXJ5LmZpbmQoJy5zbGlkZXJfX3ZpZXcgIC5zbGlkZXMnKTtcclxuICAgICAgIHZhciBtYWluU2xpZGVzID0gbWFpblNsaWRlci5maW5kKCcuc2xpZGVzX19pdGVtJyk7XHJcblxyXG4gICAgICAgdmFyIHByZXZTbGlkZXIgPSBnYWxsZXJ5LmZpbmQoJy5zbGlkZXJfX2NvbnRyb2wtLXByZXYgIC5zbGlkZXMnKTtcclxuICAgICAgIHZhciBwcmV2U2xpZGVzID0gcHJldlNsaWRlci5maW5kKCcuc2xpZGVzX19pdGVtJyk7XHJcblxyXG4gICAgICAgdmFyIG5leHRTbGlkZXIgPSBnYWxsZXJ5LmZpbmQoJy5zbGlkZXJfX2NvbnRyb2wtLW5leHQgIC5zbGlkZXMnKTtcclxuICAgICAgIHZhciBuZXh0U2xpZGVzID0gbmV4dFNsaWRlci5maW5kKCcuc2xpZGVzX19pdGVtJyk7XHJcbiAgICAgICB2YXIgaXNSZWFkeSAgICA9IGZhbHNlO1xyXG5cclxuXHJcbiAgICAgICB2YXIgZGVzYyAgPSBnYWxsZXJ5LmZpbmQoJy5zbGlkZXJfX2Rlc2MnKTtcclxuICAgICAgIHZhciB0aXRsZSA9IGRlc2MuZmluZCgnLnNsaWRlcl9fdGl0bGUnKTtcclxuICAgICAgIHZhciB0b29scyA9IGRlc2MuZmluZCgnLnNsaWRlcl9faW5mbycpO1xyXG4gICAgICAgdmFyIGxpbmsgID0gZGVzYy5maW5kKCcuc2xpZGVyX19saW5rJyk7XHJcblxyXG4gICAgICAgdmFyIGRhdGEgICAgICA9IGdhbGxlcnkuZmluZCgnLnNsaWRlcl9fZGF0YScpO1xyXG4gICAgICAgdmFyIGRhdGFJdGVtcyA9IGRhdGEuZmluZCgnLnNsaWRlci1kYXRhX19pdGVtJyk7XHJcblxyXG5cclxuICAgICAgIC8vIGluaXRcclxuICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAgICAgICBzaG93ZWRTbGlkZShuZXh0U2xpZGVzLCBnZXRJZHgoYWN0aXZlU2xpZGVJZHgsICduZXh0JykpO1xyXG4gICAgICAgICAgc2hvd2VkU2xpZGUocHJldlNsaWRlcywgZ2V0SWR4KGFjdGl2ZVNsaWRlSWR4LCAncHJldicpKTtcclxuICAgICAgICAgIHVwZGF0ZURlc2MoZGF0YUl0ZW1zLmVxKGFjdGl2ZVNsaWRlSWR4KSk7XHJcbiAgICAgICAgICBpc1JlYWR5ID0gdHJ1ZTtcclxuICAgICAgIH1cclxuICAgICAgIGluaXQoKTtcclxuXHJcbiAgICAgICBmdW5jdGlvbiBzaG93ZWRTbGlkZShzbGlkZXIsIGlkeCkge1xyXG4gICAgICAgICAgc2xpZGVyXHJcbiAgICAgICAgICAgICAuZXEoaWR4KS5hZGRDbGFzcygnc2xpZGVzX19pdGVtLS1hY3RpdmUnKVxyXG4gICAgICAgICAgICAgLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ3NsaWRlc19faXRlbS0tYWN0aXZlJyk7XHJcbiAgICAgICB9XHJcblxyXG4gICAgICAgZnVuY3Rpb24gZGF0YUNoYW5nZShkaXJlY3Rpb24pIHtcclxuICAgICAgICAgIGFjdGl2ZVNsaWRlSWR4ID0gKGRpcmVjdGlvbiA9PT0gJ25leHQnKSA/IGdldElkeChhY3RpdmVTbGlkZUlkeCwgJ25leHQnKSA6IGdldElkeChhY3RpdmVTbGlkZUlkeCwgJ3ByZXYnKTtcclxuICAgICAgIH1cclxuXHJcbiAgICAgICBmdW5jdGlvbiBnZXRJZHgoY3VycmVudElkeCwgZGlyKSB7XHJcbiAgICAgICAgICBpZihkaXIgPT09ICdwcmV2Jykge1xyXG4gICAgICAgICAgICByZXR1cm4gKGN1cnJlbnRJZHggLSAxIDwgMCkgPyBzbGlkZXNDbnQgLSAxIDogY3VycmVudElkeCAtIDEgO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYoZGlyID09PSAnbmV4dCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChjdXJyZW50SWR4ICsgMSA+PSBzbGlkZXNDbnQpID8gMCA6IGN1cnJlbnRJZHggKyAxIDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZXR1cm4gY3VycmVudElkeDtcclxuICAgICAgIH1cclxuXHJcbiAgICAgICBmdW5jdGlvbiBjaGFuZ2VTbGlkZShzbGlkZXMsIGRpcmVjdGlvbiwgY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICB2YXIgY3VycmVudFNsaWRlICAgID0gc2xpZGVzLmZpbHRlcignLnNsaWRlc19faXRlbS0tYWN0aXZlJyk7XHJcbiAgICAgICAgICB2YXIgY3VycmVudFNsaWRlSWR4ID0gY3VycmVudFNsaWRlLmluZGV4KCk7XHJcbiAgICAgICAgICB2YXIgbmV3U2xpZGVJZHg7XHJcblxyXG4gICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3ByZXYnKSB7XHJcbiAgICAgICAgICAgICBuZXdTbGlkZUlkeCA9IGdldElkeChjdXJyZW50U2xpZGVJZHgsICdwcmV2Jyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAnbmV4dCcpIHtcclxuICAgICAgICAgICAgIG5ld1NsaWRlSWR4ID0gZ2V0SWR4KGN1cnJlbnRTbGlkZUlkeCwgJ25leHQnKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBzbGlkZXMuZXEobmV3U2xpZGVJZHgpXHJcbiAgICAgICAgICAgICAuYWRkQ2xhc3MoIGNsYXNzTmFtZSApXHJcbiAgICAgICAgICAgICAub25lKHRyYW5zaXRpb25FbmQsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKVxyXG4gICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCBjbGFzc05hbWUgKVxyXG4gICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGlkZXNfX2l0ZW0tLWFjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICAgICAudHJpZ2dlcignY2hhbmdlZC1zbGlkZScpO1xyXG4gICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgY3VycmVudFNsaWRlXHJcbiAgICAgICAgICAgICAuYWRkQ2xhc3MoIGNsYXNzTmFtZSApXHJcbiAgICAgICAgICAgICAub25lKHRyYW5zaXRpb25FbmQsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnc2xpZGVzX19pdGVtLS1hY3RpdmUgJyArIGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuXHJcbiAgICAgICBmdW5jdGlvbiBjaGFuZ2VBbGwoZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICBjaGFuZ2VTbGlkZShtYWluU2xpZGVzLCBkaXJlY3Rpb24sICdzbGlkZXNfX2l0ZW0tLWFuaW1hdGUtZmFkZScpO1xyXG4gICAgICAgICAgY2hhbmdlU2xpZGUocHJldlNsaWRlcywgZGlyZWN0aW9uLCAnc2xpZGVzX19pdGVtLS1hbmltYXRlLWRvd24nKTtcclxuICAgICAgICAgIGNoYW5nZVNsaWRlKG5leHRTbGlkZXMsIGRpcmVjdGlvbiwgJ3NsaWRlc19faXRlbS0tYW5pbWF0ZS11cCcpO1xyXG4gICAgICAgfVxyXG5cclxuICAgICAgIGZ1bmN0aW9uIHVwZGF0ZURlc2MoZGF0YSkge1xyXG4gICAgICAgICAgdGl0bGUudGV4dCggZGF0YS5hdHRyKCdkYXRhLXRpdGxlJykgKTtcclxuICAgICAgICAgIHRvb2xzLnRleHQoIGRhdGEuYXR0cignZGF0YS10b29scycpICk7XHJcbiAgICAgICAgICBsaW5rLmF0dHIoJ2hyZWYnLCBkYXRhLmF0dHIoJ2RhdGEtbGluaycpICk7XHJcbiAgICAgICB9XHJcblxyXG4gICAgICAgJChkb2N1bWVudCkub24oJ2NoYW5nZWQtc2xpZGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGlzUmVhZHkgPSB0cnVlO1xyXG4gICAgICAgfSk7XHJcblxyXG5cclxuXHJcbiAgICAgICB0aGlzLnByZXYgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGlmKCAhaXNSZWFkeSApIHJldHVybjtcclxuICAgICAgICAgIGlzUmVhZHkgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICBjaGFuZ2VBbGwoJ3ByZXYnKVxyXG4gICAgICAgICAgZGF0YUNoYW5nZSgncHJldicpO1xyXG5cclxuICAgICAgICAgIHVwZGF0ZURlc2MoZGF0YUl0ZW1zLmVxKGFjdGl2ZVNsaWRlSWR4KSk7XHJcbiAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICB0aGlzLm5leHQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGlmKCAhaXNSZWFkeSApIHJldHVybjtcclxuICAgICAgICAgIGlzUmVhZHkgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICBjaGFuZ2VBbGwoJ25leHQnKVxyXG4gICAgICAgICAgZGF0YUNoYW5nZSgnbmV4dCcpO1xyXG5cclxuICAgICAgICAgIHVwZGF0ZURlc2MoZGF0YUl0ZW1zLmVxKGFjdGl2ZVNsaWRlSWR4KSk7XHJcbiAgICAgICB9O1xyXG5cclxuICAgICAgIHByZXYub24oJ2NsaWNrJywgdGhpcy5wcmV2KTtcclxuICAgICAgIG5leHQub24oJ2NsaWNrJywgdGhpcy5uZXh0KTtcclxuICAgIH0gLy8gU2xpZGVyXHJcblxyXG5cclxuICAgIHZhciBzbGlkZXIgPSBuZXcgU2xpZGVyKHtcclxuICAgICAgIGVsZW06ICQoJyNqcy1zbGlkZXInKVxyXG4gICAgfSk7XHJcbiAgfSkoKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8vINCe0LHRgNCw0LHQvtGC0LrQsCDQuCDQvtGC0L/RgNCw0LLQutCwINGE0L7RgNC8XHJcbiAgKGZ1bmN0aW9uKCkge1xyXG4gICAgJCgnZm9ybScpLmF0dHIoJ25vdmFsaWRhdGUnLCB0cnVlKTtcclxuXHJcbiAgICAvKiDQn9GA0Lgg0YTQvtC60YPRgdC1INGD0LHQuNGA0LDRgtGMINC60YDQsNGB0L3Rg9GOINC+0LHQstC+0LTQutGDICovXHJcbiAgICAkKGRvY3VtZW50KS5vbignZm9jdXMnLCAnaW5wdXQsIHRleHRhcmVhJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAkKHRoaXMpXHJcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdmaWVsZC0tZXJyb3InKVxyXG4gICAgICAgIC5yZW1vdmVDbGFzcygnZmllbGQtLW9rJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKGRvY3VtZW50KS5vbigncmVzZXQnLCAnZm9ybScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgJCh0aGlzKS5maW5kKCdpbnB1dCwgdGV4dGFyZWEnKVxyXG4gICAgICAgIC5yZW1vdmVDbGFzcygnZmllbGQtLWVycm9yJylcclxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2ZpZWxkLS1vaycpO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIC8vINCS0LDQu9C40LTQsNGG0LjRjyDQv9C+0LvQtdC5INGE0L7RgNC80YtcclxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlRm9ybShmb3JtKSB7XHJcbiAgICAgIHZhciBpbnB1dHMgICAgID0gZm9ybS5maW5kKCdbcmVxdWlyZWRdJyk7XHJcbiAgICAgIHZhciBpc1ZhbGlkYXRlID0gdHJ1ZTtcclxuXHJcbiAgICAgIGlucHV0cy5yZW1vdmVDbGFzcygnZmllbGQtLWVycm9yJyk7XHJcblxyXG4gICAgICBpbnB1dHMuZWFjaChmdW5jdGlvbihpLCBpdGVtKSB7XHJcbiAgICAgICAgdmFyIGlucHV0ID0gJChpdGVtKTtcclxuICAgICAgICB2YXIgdmFsdWUgPSBpbnB1dC52YWwoKTtcclxuICAgICAgICB2YXIgdHlwZSAgPSBpbnB1dC5hdHRyKCd0eXBlJyk7XHJcblxyXG4gICAgICAgIGlmKHR5cGUgPT0gJ2NoZWNrYm94Jykge1xyXG4gICAgICAgICAgaWYoIWlucHV0LmlzKCc6Y2hlY2tlZCcpKSB7XHJcbiAgICAgICAgICAgIGlucHV0LmFkZENsYXNzKCdmaWVsZC0tZXJyb3InKTtcclxuICAgICAgICAgICAgaXNWYWxpZGF0ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodmFsdWUudHJpbSgpID09ICcnKSB7XHJcbiAgICAgICAgICBpbnB1dC5hZGRDbGFzcygnZmllbGQtLWVycm9yJyk7XHJcbiAgICAgICAgICBpc1ZhbGlkYXRlID0gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlucHV0XHJcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnZmllbGQtLWVycm9yJylcclxuICAgICAgICAgICAgLmFkZENsYXNzKCdmaWVsZC0tb2snKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcmV0dXJuIGlzVmFsaWRhdGU7XHJcbiAgICB9IC8vIHZhbGlkYXRlRm9ybSgpO1xyXG5cclxuXHJcblxyXG5cclxuICAgIC8qINCe0YLQv9GA0LDQstC60LAg0YTQvtGA0LwgKi9cclxuICAgIGZ1bmN0aW9uIHNlbmRGb3JtKGZvcm0sIG1ldGhvZCwgdXJsLCBkYXRhVHlwZSkge1xyXG4gICAgICAgIGlmKCAhdmFsaWRhdGVGb3JtKGZvcm0pICkgcmV0dXJuO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgdHlwZTogbWV0aG9kLFxyXG4gICAgICAgICAgdXJsOiAgdXJsLFxyXG4gICAgICAgICAgZGF0YTogZm9ybS5zZXJpYWxpemUoKSxcclxuICAgICAgICAgIGRhdGFUeXBlOiAnanNvbidcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5kb25lKGZ1bmN0aW9uKGFuc3dlcikge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coIGFuc3dlciApO1xyXG4gICAgICAgICAgaWYgKCdocmVmJyBpbiBhbnN3ZXIpIHtcclxuICAgICAgICAgICAgbG9jYXRpb24uaHJlZiA9IGFuc3dlci5ocmVmO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZm9ybS50cmlnZ2VyKCdyZXNldCcpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmZhaWwoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnZm9ybSBzZW5kOiBlcnJvcicpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0gLy8gc2VuZEZvcm0oKTtcclxuXHJcblxyXG4gICAgJCgnLmZvcm0tbW9kYWwtLWNhbGxiYWNrJykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBzZW5kRm9ybSgkKHRoaXMpLCAnUE9TVCcsICcvbWFpbCcpO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgICQoJyNmb3JtLWF1dGhvcml6YXRpb24nKS5vbignc3VibWl0JywgZnVuY3Rpb24oZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHNlbmRGb3JtKCQodGhpcyksICdQT1NUJywgJy9sb2dpbicpO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgICQoJyNmb3JtLWFkbWluLWJsb2cnKS5vbignc3VibWl0JywgZnVuY3Rpb24oZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHNlbmRGb3JtKCQodGhpcyksICdQT1NUJywgJy9hZG1pbi9hZGRJdGVtJyk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgJCgnI2Zvcm0tYWRtaW4tc2tpbGxzJykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBzZW5kRm9ybSgkKHRoaXMpLCAnUE9TVCcsICcvYWRtaW4vYWRkU2tpbGxzJyk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgKGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb3JtLWFkbWluLXdvcmsnKTtcclxuXHJcbiAgICAgIGlmKCFmb3JtKSByZXR1cm47XHJcblxyXG4gICAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgaWYoICF2YWxpZGF0ZUZvcm0oJChmb3JtKSkgKSByZXR1cm47XHJcblxyXG4gICAgICAgIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSggZm9ybSApO1xyXG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICB4aHIub3BlbignUE9TVCcsICcvYWRtaW4vYWRkV29yaycpO1xyXG4gICAgICAgIHhoci5zZW5kKCBmb3JtRGF0YSApO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICB9KSgpO1xyXG4gIH0pKCk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAvLyDQmtCw0YDRgtCwXHJcbiAgKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIHZhciBtYXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJyk7XHJcblxyXG4gICAgaWYoIG1hcCA9PT0gbnVsbCApIHJldHVybjtcclxuXHJcblxyXG4gICAgLy8g0L/QsNGA0LDQvNC10YLRgNGLINC60LDRgNGC0YtcclxuICAgIHZhciBsYXRpdHVkZSAgPSA1OC4wMjIzODQ5O1xyXG4gICAgdmFyIGxvbmdpdHVkZSA9IDU2LjIzMzg0NjI7XHJcbiAgICB2YXIgbWFwWm9vbSAgPSAxNTtcclxuXHJcblxyXG4gICAgLy8g0KHRgtC40LvQuNC30LDRhtC40Y8g0LrQsNGA0YLRi1xyXG4gICAgdmFyIG1haW7QoW9sb3IgPSBcIiM2MURBQzlcIjtcclxuXHJcbiAgICB2YXIgc3R5bGUgPSBbXHJcbiAgICAgIHtcclxuICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIixcclxuICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLnRleHQuZmlsbFwiLFxyXG4gICAgICAgIFwic3R5bGVyc1wiOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIFwiY29sb3JcIjogXCIjNDQ0NDQ0XCJcclxuICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwibGFuZHNjYXBlXCIsXHJcbiAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImFsbFwiLFxyXG4gICAgICAgIFwic3R5bGVyc1wiOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIFwiY29sb3JcIjogXCIjZjJmMmYyXCJcclxuICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwibGFuZHNjYXBlLm1hbl9tYWRlXCIsXHJcbiAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5LmZpbGxcIixcclxuICAgICAgICBcInN0eWxlcnNcIjogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBcImNvbG9yXCI6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInBvaVwiLFxyXG4gICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcclxuICAgICAgICBcInN0eWxlcnNcIjogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkXCIsXHJcbiAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImFsbFwiLFxyXG4gICAgICAgIFwic3R5bGVyc1wiOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIFwic2F0dXJhdGlvblwiOiAtMTAwXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBcImxpZ2h0bmVzc1wiOiA0NVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkXCIsXHJcbiAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5LmZpbGxcIixcclxuICAgICAgICBcInN0eWxlcnNcIjogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBcImNvbG9yXCI6IFwiI2Q2ZDZkNlwiXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWQuaGlnaHdheVwiLFxyXG4gICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcclxuICAgICAgICBcInN0eWxlcnNcIjogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJzaW1wbGlmaWVkXCJcclxuICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicm9hZC5hcnRlcmlhbFwiLFxyXG4gICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMuaWNvblwiLFxyXG4gICAgICAgIFwic3R5bGVyc1wiOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9mZlwiXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInRyYW5zaXRcIixcclxuICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiYWxsXCIsXHJcbiAgICAgICAgXCJzdHlsZXJzXCI6IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib2ZmXCJcclxuICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwid2F0ZXJcIixcclxuICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiYWxsXCIsXHJcbiAgICAgICAgXCJzdHlsZXJzXCI6IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgXCJjb2xvclwiOiBcIiM0NmJjZWNcIlxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib25cIlxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJ3YXRlclwiLFxyXG4gICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeS5maWxsXCIsXHJcbiAgICAgICAgXCJzdHlsZXJzXCI6IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgXCJjb2xvclwiOiBtYWlu0KFvbG9yXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcIndhdGVyXCIsXHJcbiAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImxhYmVsc1wiLFxyXG4gICAgICAgIFwic3R5bGVyc1wiOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9mZlwiXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgICB9XHJcbiAgICBdXHJcblxyXG5cclxuXHJcbiAgICAvLyDQndCw0YHRgtGA0L7QudC60Lgg0LrQsNGA0YLRi1xyXG4gICAgdmFyIG1hcE9wdGlvbnMgPSB7XHJcbiAgICAgIGNlbnRlcjogbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhsYXRpdHVkZSwgbG9uZ2l0dWRlKSxcclxuICAgICAgem9vbTogbWFwWm9vbSxcclxuICAgICAgcGFuQ29udHJvbDogZmFsc2UsXHJcbiAgICAgIHpvb21Db250cm9sOiBmYWxzZSxcclxuICAgICAgbWFwVHlwZUNvbnRyb2w6IGZhbHNlLFxyXG4gICAgICBzdHJlZXRWaWV3Q29udHJvbDogZmFsc2UsXHJcbiAgICAgIG1hcFR5cGVJZDogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkLlJPQURNQVAsXHJcbiAgICAgIHNjcm9sbHdoZWVsOiBmYWxzZSxcclxuICAgICAgc3R5bGVzOiBzdHlsZSxcclxuICAgIH1cclxuXHJcbiAgICAvLyDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDQutCw0YDRgtGLXHJcbiAgICB2YXIgZ29vZ2xlTWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChtYXAsIG1hcE9wdGlvbnMpO1xyXG5cclxuICB9KSgpO1xyXG5cclxufSk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuJCh3aW5kb3cpLm9uKCdsb2FkJywgZnVuY3Rpb24oKSB7XHJcbiAgJCgnYm9keScpLmFkZENsYXNzKCdsb2FkZWQnKTtcclxuICBwaWUuZ2V0VmFsdWUoKTtcclxufSk7XHJcblxyXG5cclxuXHJcbiQoIHdpbmRvdyApLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcclxuICBwYXJhbGxheC5pbml0KCAkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKTtcclxufSk7XHJcblxyXG5cclxuXHJcbiQoIHdpbmRvdyApLm9uKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcclxuICBibHVyLnNldCgpO1xyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltRndjQzVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CSWl3aVptbHNaU0k2SW1Gd2NDNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW5aaGNpQnBjMDF2WW1sc1pTQTlJQzlCYm1SeWIybGtmSGRsWWs5VGZHbFFhRzl1Wlh4cFVHRmtmR2xRYjJSOFFteGhZMnRDWlhKeWVYeEpSVTF2WW1sc1pYeFBjR1Z5WVNCTmFXNXBMMmt1ZEdWemRDaHVZWFpwWjJGMGIzSXVkWE5sY2tGblpXNTBLVHRjY2x4dVhISmNibHh5WEc1Y2NseHVYSEpjYmx4eVhHNWNjbHh1WEhKY2JseHlYRzR2THlCd1lYSmhiR3hoZUZ4eVhHNTJZWElnY0dGeVlXeHNZWGdnUFNBb1puVnVZM1JwYjI0b0tTQjdYSEpjYmx4eVhHNGdJSFpoY2lCaVp5QWdJQ0FnSUNBZ1BTQWtLQ2N1Wm1seWMzUmZYMkpuSnlrN1hISmNiaUFnZG1GeUlITmxZM1JwYjI0Z0lDQTlJQ1FvSnk1bWFYSnpkRjlmYldVZ0lDNXRaU2NwTzF4eVhHNGdJSFpoY2lCMFpYaDBJQ0FnSUNBZ1BTQWtLQ2N1Wm1seWMzUmZYMkpuTFhSbGVIUW5LVHRjY2x4dUlDQjJZWElnWW14dloxUnBkR3hsSUQwZ0pDZ25MbVpwY25OMFgxOTBhWFJzWlMxM2NtRndKeWs3WEhKY2JseHlYRzRnSUhKbGRIVnliaUI3WEhKY2JpQWdJQ0J0YjNabE9pQm1kVzVqZEdsdmJpaGxiQ3dnZDJsdVpHOTNVMk55YjJ4c0xDQnpkSEpoWm1WQmJXOTFiblFwSUh0Y2NseHVJQ0FnSUNBZ2RtRnlJSGRUWTNKdmJHd2dQU0FrS0hkcGJtUnZkeWt1YzJOeWIyeHNWRzl3S0NrN1hISmNibHh5WEc0Z0lDQWdJQ0IyWVhJZ2MzUnlZV1psSUQwZ2QybHVaRzkzVTJOeWIyeHNJQzhnTFhOMGNtRm1aVUZ0YjNWdWRDQXJJQ2NsSnp0Y2NseHVJQ0FnSUNBZ2RtRnlJSFJ5WVc1elptOXliVk4wY21sdVp5QTlJQ2QwY21GdWMyeGhkR1V6WkNnd0xDY2dLeUJ6ZEhKaFptVWdLeUFuTENBd0tTYzdYSEpjYmx4eVhHNGdJQ0FnSUNCbGJDNWpjM01vZTF4eVhHNGdJQ0FnSUNBZ0lDZDBjbUZ1YzJadmNtMG5PaUIwY21GdWMyWnZjbTFUZEhKcGJtY3NYSEpjYmlBZ0lDQWdJQ0FnSnkxM1pXSnJhWFF0ZEhKaGJuTm1iM0p0SnpvZ2RISmhibk5tYjNKdFUzUnlhVzVuWEhKY2JpQWdJQ0FnSUgwcE8xeHlYRzVjY2x4dUlDQWdJSDBzWEhKY2JseHlYRzRnSUNBZ2FXNXBkRG9nWm5WdVkzUnBiMjRvZDFOamNtOXNiQ2tnZTF4eVhHNGdJQ0FnSUNCMGFHbHpMbTF2ZG1Vb1ltY3NJSGRUWTNKdmJHd3NJRFV3S1R0Y2NseHVJQ0FnSUNBZ2RHaHBjeTV0YjNabEtIUmxlSFFzSUhkVFkzSnZiR3dzSURNd0tUdGNjbHh1SUNBZ0lDQWdkR2hwY3k1dGIzWmxLSE5sWTNScGIyNHNJSGRUWTNKdmJHd3NJREUxS1R0Y2NseHVJQ0FnSUNBZ2RHaHBjeTV0YjNabEtHSnNiMmRVYVhSc1pTd2dkMU5qY205c2JDd2dNVGdwTzF4eVhHNGdJQ0FnZlZ4eVhHNGdJSDA3WEhKY2JseHlYRzU5S1NncE8xeHlYRzVjY2x4dVhISmNibHh5WEc1Y2NseHVMeThnWW14MWNseHlYRzUyWVhJZ1lteDFjaUE5SUNobWRXNWpkR2x2YmlncElIdGNjbHh1WEhKY2JpQWdkbUZ5SUdKc2RYSWdJQ0FnSUNBOUlDUW9KMXRrWVhSaExXSnNkWEl0Wld4bGJUMWNJbVp2Y20xY0lsMG5LVHRjY2x4dUlDQjJZWElnWTI5dWRHRnBibVZ5SUQwZ0pDZ25XMlJoZEdFdFlteDFjaTFqYjI1MFlXbHVaWEk5WENKbWIzSnRYQ0pkSnlrN1hISmNibHh5WEc1Y2NseHVJQ0J5WlhSMWNtNGdlMXh5WEc0Z0lDQWdjMlYwT2lCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lDQWdhV1lnS0NGaWJIVnlMbXhsYm1kMGFDQjhmQ0FoWTI5dWRHRnBibVZ5TG14bGJtZDBhQ0FwSUhKbGRIVnlianRjY2x4dVhISmNiaUFnSUNBZ0lIWmhjaUJwYldkWGFXUjBhQ0FnSUQwZ1kyOXVkR0ZwYm1WeUxuZHBaSFJvS0NrN1hISmNiaUFnSUNBZ0lIWmhjaUJ2Wm1aelpYUlViM0FnSUQwZ1kyOXVkR0ZwYm1WeUxtOW1abk5sZENncExuUnZjQ0FnTFNCaWJIVnlMbTltWm5ObGRDZ3BMblJ2Y0R0Y2NseHVJQ0FnSUNBZ2RtRnlJRzltWm5ObGRFeGxablFnUFNCamIyNTBZV2x1WlhJdWIyWm1jMlYwS0NrdWJHVm1kQ0F0SUdKc2RYSXViMlptYzJWMEtDa3ViR1ZtZER0Y2NseHVYSEpjYmlBZ0lDQWdJR0pzZFhJdVkzTnpLSHRjY2x4dUlDQWdJQ0FnSUNBblltRmphMmR5YjNWdVpDMXphWHBsSnpvZ2FXMW5WMmxrZEdnZ0t5QW5jSGdnWVhWMGJ5Y3NYSEpjYmlBZ0lDQWdJQ0FnSjJKaFkydG5jbTkxYm1RdGNHOXphWFJwYjI0bk9pQnZabVp6WlhSTVpXWjBJQ3NnSjNCNEp5QXJJQ2NnSnlBcklHOW1abk5sZEZSdmNDQXJJQ2R3ZUNkY2NseHVJQ0FnSUNBZ2ZTazdYSEpjYmlBZ0lDQjlYSEpjYmlBZ2ZUdGNjbHh1WEhKY2JuMHBLQ2s3WEhKY2JseHlYRzVjY2x4dVhISmNibHh5WEc0dkx5Qm5jbUZ3YUNCcGJtbDBYSEpjYm5aaGNpQndhV1VnUFNBb1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ2RtRnlJSEJwWlVGc2JDQTlJRzUxYkd3N1hISmNibHh5WEc1Y2NseHVYSEpjYmlBZ2NtVjBkWEp1SUh0Y2NseHVJQ0FnSUdsdWFYUTZJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnSUNCd2FXVkJiR3dnUFNBa0tDY3VaM0poY0doZlgybHVKeWs3WEhKY2JpQWdJQ0FnSUdsbUtIQnBaVUZzYkM1c1pXNW5kR2dnUFQwOUlEQXBJSEpsZEhWeWJqdGNjbHh1WEhKY2JpQWdJQ0FnSUhCcFpVRnNiQzVsWVdOb0tHWjFibU4wYVc5dUtHa3NJR2wwWlcwcElIdGNjbHh1SUNBZ0lDQWdJQ0IyWVhJZ2RtRnNkV1VnUFNBa0tHbDBaVzBwTG1GMGRISW9KM04wY205clpTMWtZWE5vWVhKeVlYa25LVHRjY2x4dUlDQWdJQ0FnSUNCcGRHVnRMblpoYkhWbElEMGdkbUZzZFdVN1hISmNiaUFnSUNBZ0lDQWdKQ2hwZEdWdEtTNWhkSFJ5S0NkemRISnZhMlV0WkdGemFHRnljbUY1Snl3Z0p6QWdNVEF3SnlrN1hISmNiaUFnSUNBZ0lIMHBPMXh5WEc0Z0lDQWdmU3hjY2x4dVhISmNiaUFnSUNCblpYUldZV3gxWlRvZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQWdJR2xtS0hCcFpVRnNiQzVzWlc1bmRHZ2dQVDA5SURBcElISmxkSFZ5Ymp0Y2NseHVYSEpjYmlBZ0lDQWdJSEJwWlVGc2JDNWxZV05vS0daMWJtTjBhVzl1S0drc0lHbDBaVzBwSUh0Y2NseHVJQ0FnSUNBZ0lDQnBkR1Z0TG5ObGRFRjBkSEpwWW5WMFpTZ25jM1J5YjJ0bExXUmhjMmhoY25KaGVTY3NJR2wwWlcwdWRtRnNkV1VwTzF4eVhHNGdJQ0FnSUNCOUtUdGNjbHh1SUNBZ0lIMWNjbHh1SUNCOU8xeHlYRzU5S1NncE8xeHlYRzVjY2x4dVhISmNibHh5WEc1Y2NseHVYSEpjYmlRb0lHUnZZM1Z0Wlc1MElDa3VjbVZoWkhrb1puVnVZM1JwYjI0b0tTQjdYSEpjYmx4eVhHNGdJSEJwWlM1cGJtbDBLQ2s3WEhKY2JpQWdZbXgxY2k1elpYUW9LVHRjY2x4dUlDQndZWEpoYkd4aGVDNXBibWwwS0NrN1hISmNibHh5WEc0Z0lDOHZJSEJoY21Gc2JHRjRJRzl1SUhSb1pTQjNaV3hqYjIxbElIQmhaMlZjY2x4dUlDQjJZWElnYlc5MWMyVlFZWEpoYkd4aGVDQTlJQ2htZFc1amRHbHZiaWdwSUh0Y2NseHVYSEpjYmlBZ0lDQjJZWElnYkdGNVpYSkJiR3dnUFNBa0tDY3VjR0Z5WVd4c1lYaGZYMnhoZVdWeUp5azdYSEpjYmx4eVhHNGdJQ0FnSkNoM2FXNWtiM2NwTG05dUtDZHRiM1Z6WlcxdmRtVW5MQ0JtZFc1amRHbHZiaWhsS1NCN1hISmNiaUFnSUNBZ0lIWmhjaUJ0YjNWelpWZ2dQU0JsTG5CaFoyVllPMXh5WEc0Z0lDQWdJQ0IyWVhJZ2JXOTFjMlZaSUQwZ1pTNXdZV2RsV1R0Y2NseHVYSEpjYmlBZ0lDQWdJSFpoY2lCM0lEMGdLSGRwYm1SdmR5NXBibTVsY2xkcFpIUm9JQzhnTWlrZ0lDMGdiVzkxYzJWWU8xeHlYRzRnSUNBZ0lDQjJZWElnYUNBOUlDaDNhVzVrYjNjdWFXNXVaWEpJWldsbmFIUWdMeUF5S1NBdElHMXZkWE5sV1R0Y2NseHVYSEpjYmlBZ0lDQWdJR3hoZVdWeVFXeHNMbTFoY0NobWRXNWpkR2x2YmlocExHbDBaVzBwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdkbUZ5SUhkUWIzTWdQU0IzSUNvZ0tDaHBJQ3NnTVNrZ0x5QXhOelVwTzF4eVhHNGdJQ0FnSUNBZ0lDQjJZWElnYUZCdmN5QTlJR2dnS2lBb0tHa2dLeUF4S1NBdklESXlNQ2s3WEhKY2JseHlYRzRnSUNBZ0lDQWdJQ0FrS0dsMFpXMHBMbU56Y3loN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNkMGNtRnVjMlp2Y20wbk9pQW5kSEpoYm5Oc1lYUmxNMlFvSnlzZ2QxQnZjeUFySjNCNExDY2dLeUJvVUc5eklDc2dKM0I0TENBd0tTZGNjbHh1SUNBZ0lDQWdJQ0FnZlNrN1hISmNiaUFnSUNBZ0lIMHBPMXh5WEc0Z0lDQWdmU2s3WEhKY2JseHlYRzRnSUgwcEtDazdYSEpjYmx4eVhHNGdJQzh2SUhCeVpXeHZZV1JsY2x4eVhHNGdJQ2htZFc1amRHbHZiaWdwSUh0Y2NseHVYSEpjYmlBZ0lDQjJZWElnYVcxbmN5QTlJRnRkTzF4eVhHNWNjbHh1SUNBZ0lDUW9KeW9uS1M1bFlXTm9LR1oxYm1OMGFXOXVJQ2dwSUh0Y2NseHVJQ0FnSUNBZ2RtRnlJQ1IwYUdseklDQWdJQ0FnUFNBa0tIUm9hWE1wTzF4eVhHNGdJQ0FnSUNCMllYSWdZbUZqYTJkeWIzVnVaQ0E5SUNSMGFHbHpMbU56Y3lnblltRmphMmR5YjNWdVpDMXBiV0ZuWlNjcE8xeHlYRzRnSUNBZ0lDQjJZWElnYVhOSmJXY2dJQ0FnSUNBOUlDUjBhR2x6TG1sektDZHBiV2NuS1R0Y2NseHVYSEpjYmlBZ0lDQWdJR2xtSUNoaVlXTnJaM0p2ZFc1a0lDRTlQU0FuYm05dVpTY3BJSHRjY2x4dUlDQWdJQ0FnSUNCMllYSWdjR0YwYUNBOUlHSmhZMnRuY205MWJtUXVjbVZ3YkdGalpTZ25kWEpzS0Z3aUp5d2dKeWNwTG5KbGNHeGhZMlVvSjF3aUtTY3NJQ2NuS1R0Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnYVdZb0lIQmhkR2d1YVc1a1pYaFBaaWduTFdkeVlXUnBaVzUwS0NjcElDRTlQU0F0TVNBcElISmxkSFZ5Ymp0Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnYVcxbmN5NXdkWE5vS0hCaGRHZ3BPMXh5WEc0Z0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQnBaaUFvYVhOSmJXY3BJSHRjY2x4dUlDQWdJQ0FnSUNCMllYSWdjR0YwYUNBOUlDUjBhR2x6TG1GMGRISW9KM055WXljcE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNCcFppQW9JWEJoZEdncElISmxkSFZ5Ymp0Y2NseHVJQ0FnSUNBZ0lDQnBiV2R6TG5CMWMyZ29jR0YwYUNrN1hISmNiaUFnSUNBZ0lIMWNjbHh1SUNBZ0lIMHBPMXh5WEc1Y2NseHVYSEpjYmlBZ0lDQjJZWElnY0dWeVkyVnVkSE5VYjNSaGJDQTlJREU3WEhKY2JseHlYRzRnSUNBZ1ptOXlJQ2gyWVhJZ2FTQTlJREE3SUdrZ1BDQnBiV2R6TG14bGJtZDBhRHNnYVNzcktTQjdYSEpjYmlBZ0lDQWdJSFpoY2lCcGJXRm5aU0E5SUNRb0p6eHBiV2MrSnl3Z2UxeHlYRzRnSUNBZ0lDQWdJR0YwZEhJNklIdGNjbHh1SUNBZ0lDQWdJQ0FnSUhOeVl6b2dhVzFuYzF0cFhWeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dUlDQWdJQ0FnZlNrN1hISmNibHh5WEc0Z0lDQWdJQ0JwYldGblpTNXZibVVvZTF4eVhHNGdJQ0FnSUNBZ0lHeHZZV1FnT2lCbWRXNWpkR2x2YmlBb0tTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNCelpYUlFaWEpqWlc1MGN5aHBiV2R6TG14bGJtZDBhQ3dnY0dWeVkyVnVkSE5VYjNSaGJDazdYSEpjYmlBZ0lDQWdJQ0FnSUNCd1pYSmpaVzUwYzFSdmRHRnNLeXM3WEhKY2JpQWdJQ0FnSUNBZ2ZTeGNjbHh1SUNBZ0lDQWdJQ0JsY25KdmNpQTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJSEJsY21ObGJuUnpWRzkwWVd3ckt6dGNjbHh1SUNBZ0lDQWdJQ0I5WEhKY2JpQWdJQ0FnSUgwcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJR1oxYm1OMGFXOXVJSE5sZEZCbGNtTmxiblJ6S0hSdmRHRnNMQ0JqZFhKeVpXNTBLU0I3WEhKY2JpQWdJQ0FnSUhaaGNpQndaWEpqWlc1MElEMGdUV0YwYUM1alpXbHNLR04xY25KbGJuUWdMeUIwYjNSaGJDQXFJREV3TUNrN1hISmNibHh5WEc0Z0lDQWdJQ0JwWmlBb2NHVnlZMlZ1ZENBK1BTQXhNREFwSUh0Y2NseHVJQ0FnSUNBZ0lDQWtLQ2N1Y0hKbGJHOWhaR1Z5SnlrdVptRmtaVTkxZENncE8xeHlYRzRnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBa0tDY3VjSEpsYkc5aFpHVnlYMTkyWVd4MVpTY3BMblJsZUhRb2NHVnlZMlZ1ZENrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lIMHBLQ2s3WEhKY2JseHlYRzVjY2x4dVhISmNibHh5WEc1Y2NseHVJQ0F2THlEUW9OQ3cwTEhRdnRHQzBMQWcwTFBRdTlDdzBMTFF2ZEMrMExQUXZpRFF2TkMxMEwzUmpseHlYRzRnSUNobWRXNWpkR2x2YmlncElIdGNjbHh1WEhKY2JpQWdJQ0FrS0dSdlkzVnRaVzUwS1M1dmJpZ25ZMnhwWTJzbkxDQW5MbTVoZGw5ZmRISnBaMmRsY2ljc0lHWjFibU4wYVc5dUtHVXBJSHRjY2x4dUlDQWdJQ0FnZG1GeUlIUnlhV2RuWlhJZ1BTQWtLSFJvYVhNcE8xeHlYRzRnSUNBZ0lDQjJZWElnYm1GMklDQWdJQ0E5SUhSeWFXZG5aWEl1WTJ4dmMyVnpkQ2duTG01aGRpY3BPMXh5WEc0Z0lDQWdJQ0IyWVhJZ1pISnZjQ0FnSUNBOUlHNWhkaTVtYVc1a0tDY3VibUYyWDE5a2NtOXdKeWs3WEhKY2JpQWdJQ0FnSUhaaGNpQm9aV0ZrWlhJZ0lEMGdKQ2duTG1obFlXUmxjaWNwTzF4eVhHNWNjbHh1WEhKY2JpQWdJQ0FnSUdsbUtHNWhkaTVvWVhORGJHRnpjeWduYm1GMkxTMXZjR1Z1SnlrcElIdGNjbHh1WEhKY2JpQWdJQ0FnSUNBZ1pISnZjQzVtWVdSbFQzVjBLQ0ExTURBZ0xDQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lHNWhkaTV5WlcxdmRtVkRiR0Z6Y3lnbmJtRjJMUzF2Y0dWdUp5azdYSEpjYmlBZ0lDQWdJQ0FnSUNBa0tDZGliMlI1SnlrdVkzTnpLQ2R2ZG1WeVpteHZkeWNzSUNjbktUdGNjbHh1SUNBZ0lDQWdJQ0I5S1R0Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnYUdWaFpHVnlMbU56Y3lnbmVpMXBibVJsZUNjc0lDY25LVHRjY2x4dVhISmNiaUFnSUNBZ0lIMGdaV3h6WlNCN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUdSeWIzQXVjMmh2ZHlnd0xDQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lHNWhkaTVoWkdSRGJHRnpjeWduYm1GMkxTMXZjR1Z1SnlrN1hISmNiaUFnSUNBZ0lDQWdJQ0JvWldGa1pYSXVZM056S0NkNkxXbHVaR1Y0Snl3Z01UQXdLVHRjY2x4dUlDQWdJQ0FnSUNCOUtUdGNjbHh1WEhKY2JpQWdJQ0FnSUNBZ0pDZ25ZbTlrZVNjcExtTnpjeWduYjNabGNtWnNiM2NuTENBbmFHbGtaR1Z1SnlrN1hISmNibHh5WEc0Z0lDQWdJQ0I5WEhKY2JpQWdJQ0I5S1R0Y2NseHVYSEpjYmlBZ2ZTa29LVHRjY2x4dVhISmNibHh5WEc1Y2NseHVYSEpjYmx4eVhHNGdJQzh2SU5DaTBMRFFzZEdMSU5DeUlOQ3cwTFRRdk5DNDBMM1F1dEMxWEhKY2JpQWdLR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNWNjbHh1SUNBZ0lDUW9aRzlqZFcxbGJuUXBMbTl1S0NkamJHbGpheWNzSUNjdVlXUnRMWFJoWWw5ZlkyOXVkSEp2YkNjc0lHWjFibU4wYVc5dUtHVXBJSHRjY2x4dUlDQWdJQ0FnZG1GeUlHSjBiaUFnSUNBZ0lDQTlJQ1FvZEdocGN5azdYSEpjYmlBZ0lDQWdJSFpoY2lCcFpIZ2dJQ0FnSUNBZ1BTQmlkRzR1YVc1a1pYZ29LVHRjY2x4dUlDQWdJQ0FnZG1GeUlHTnZiblJoYVc1bGNpQTlJR0owYmk1amJHOXpaWE4wS0NjdVlXUnRMWFJoWWljcE8xeHlYRzRnSUNBZ0lDQjJZWElnWW05a2VVRnNiQ0FnSUQwZ1kyOXVkR0ZwYm1WeUxtWnBibVFvSnk1aFpHMHRkR0ZpWDE5aWIyUjVKeWs3WEhKY2JseHlYRzRnSUNBZ0lDQmlkRzVjY2x4dUlDQWdJQ0FnSUNBdVlXUmtRMnhoYzNNb0oyRmtiUzEwWVdKZlgyTnZiblJ5YjJ3dExXRmpkR2wyWlNjcFhISmNiaUFnSUNBZ0lDQWdMbk5wWW14cGJtZHpLQ2xjY2x4dUlDQWdJQ0FnSUNBZ0lDNXlaVzF2ZG1WRGJHRnpjeWduWVdSdExYUmhZbDlmWTI5dWRISnZiQzB0WVdOMGFYWmxKeWs3WEhKY2JseHlYRzRnSUNBZ0lDQmliMlI1UVd4c0xuSmxiVzkyWlVOc1lYTnpLQ2RoWkcwdGRHRmlYMTlpYjJSNUxTMWhZM1JwZG1VbktUdGNjbHh1SUNBZ0lDQWdZbTlrZVVGc2JDNWxjU2hwWkhncFhISmNiaUFnSUNBZ0lDQWdMbUZrWkVOc1lYTnpLQ2RoWkcwdGRHRmlYMTlpYjJSNUxTMWhZM1JwZG1VbktUdGNjbHh1WEhKY2JpQWdJQ0I5S1R0Y2NseHVYSEpjYmlBZ2ZTa29LVHRjY2x4dVhISmNibHh5WEc1Y2NseHVYSEpjYmx4eVhHNGdJQzh2SU5DZzBMRFFzZEMrMFlMUXNDRFF0TkN5MFlQUmhkR0IwWUxRdnRHQTBMN1F2ZEM5MExYUXVTRFF1dEN3MFlEUmd0QyswWWZRdXRDNElOQzkwTEFnMExQUXU5Q3cwTExRdmRDKzBMa2cwWUhSZ3RHQTBMRFF2ZEM0MFliUXRWeHlYRzRnSUNobWRXNWpkR2x2YmlncElIdGNjbHh1WEhKY2JpQWdJQ0IyWVhJZ2QyVnNZMjl0WlNBOUlDUW9KeTUzWld4amIyMWxKeWs3WEhKY2JseHlYRzRnSUNBZ2FXWW9JQ0YzWld4amIyMWxJRDA5UFNBd0lDa2djbVYwZFhKdU8xeHlYRzVjY2x4dVhISmNiaUFnSUNCM1pXeGpiMjFsTG05dUtDZGpiR2xqYXljc0lDZGJaR0YwWVMxbWJHbHdQVndpZEc5bloyeGxYQ0pkSnl3Z1puVnVZM1JwYjI0b1pTa2dlMXh5WEc0Z0lDQWdJQ0IyWVhJZ2RISnBaMmRsY2lBZ0lDQWdQU0FrS0hSb2FYTXBPMXh5WEc0Z0lDQWdJQ0IyWVhJZ2FXNXBkRlJ5YVdkblpYSWdQU0IzWld4amIyMWxMbVpwYm1Rb0p5NTNaV3hqYjIxbFgxOWlkRzR0WVhWMGFDY3BPMXh5WEc0Z0lDQWdJQ0IyWVhJZ1pteHBjSEJsY2lBZ0lDQWdQU0IzWld4amIyMWxMbVpwYm1Rb0p5NTNaV3hqYjIxbFgxOW1iR2x3Y0dWeUp5azdYSEpjYmlBZ0lDQWdJSFpoY2lCa2RYSmhkR2x2YmlBZ0lDQTlJRFV3TUR0Y2NseHVYSEpjYmx4eVhHNGdJQ0FnSUNCbWJHbHdjR1Z5TG5SdloyZHNaVU5zWVhOektDZDNaV3hqYjIxbFgxOW1iR2x3Y0dWeUxTMW1iR2x3SnlrN1hISmNibHh5WEc0Z0lDQWdJQ0JwWmlobWJHbHdjR1Z5TG1oaGMwTnNZWE56S0NkM1pXeGpiMjFsWDE5bWJHbHdjR1Z5TFMxbWJHbHdKeWtwSUh0Y2NseHVJQ0FnSUNBZ0lDQnBibWwwVkhKcFoyZGxjaTVtWVdSbFQzVjBLQ0JrZFhKaGRHbHZiaUFwTzF4eVhHNGdJQ0FnSUNCOUlHVnNjMlVnZTF4eVhHNGdJQ0FnSUNBZ0lHbHVhWFJVY21sbloyVnlMbVpoWkdWSmJpZ2daSFZ5WVhScGIyNGdLVHRjY2x4dUlDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lIMHBPMXh5WEc1Y2NseHVJQ0I5S1NncE8xeHlYRzVjY2x4dVhISmNibHh5WEc1Y2NseHVYSEpjYmlBZ0x5OGcwSi9SZ05DKzBMclJnTkdEMFlMUXVOR0MwWXdnMFlIUmd0R0EwTERRdmRDNDBZYlJneURRdE5DK0lDNHVMbHh5WEc0Z0lDaG1kVzVqZEdsdmJpZ3BJSHRjY2x4dVhISmNiaUFnSUNBa0tHUnZZM1Z0Wlc1MEtTNXZiaWduWTJ4cFkyc25MQ0FuVzJSaGRHRXRaMjlkSnl3Z1puVnVZM1JwYjI0b1pTa2dlMXh5WEc0Z0lDQWdJQ0JsTG5CeVpYWmxiblJFWldaaGRXeDBLQ2s3WEhKY2JseHlYRzRnSUNBZ0lDQjJZWElnWW5SdUlDQWdJQ0FnSUNBOUlDUW9kR2hwY3lrN1hISmNiaUFnSUNBZ0lIWmhjaUIwWVhKblpYUWdJQ0FnSUQwZ1luUnVMbUYwZEhJb0oyUmhkR0V0WjI4bktUdGNjbHh1SUNBZ0lDQWdkbUZ5SUdOdmJuUmhhVzVsY2lBZ1BTQnVkV3hzTzF4eVhHNWNjbHh1WEhKY2JpQWdJQ0FnSUdaMWJtTjBhVzl1SUhOamNtOXNiRlJ2VUc5emFYUnBiMjRvY0c5emFYUnBiMjRzSUdSMWNtRjBhVzl1S1NCN1hISmNiaUFnSUNBZ0lDQWdkbUZ5SUhCdmMybDBhVzl1SUQwZ2NHOXphWFJwYjI0Z2ZId2dNRHRjY2x4dUlDQWdJQ0FnSUNCMllYSWdaSFZ5WVhScGIyNGdQU0JrZFhKaGRHbHZiaUI4ZkNBeE1EQXdPMXh5WEc1Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnSkNoY0ltSnZaSGtzSUdoMGJXeGNJaWt1WVc1cGJXRjBaU2g3WEhKY2JpQWdJQ0FnSUNBZ0lDQnpZM0p2Ykd4VWIzQTZJSEJ2YzJsMGFXOXVYSEpjYmlBZ0lDQWdJQ0FnZlN3Z1pIVnlZWFJwYjI0cE8xeHlYRzRnSUNBZ0lDQjlYSEpjYmx4eVhHNWNjbHh1SUNBZ0lDQWdhV1lnS0hSaGNtZGxkQ0E5UFNBbmRHOXdKeWtnZTF4eVhHNGdJQ0FnSUNBZ0lITmpjbTlzYkZSdlVHOXphWFJwYjI0b0tUdGNjbHh1SUNBZ0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUNBZ2FXWWdLSFJoY21kbGRDQTlQU0FuYm1WNGRDY3BJSHRjY2x4dUlDQWdJQ0FnSUNCamIyNTBZV2x1WlhJZ1BTQmlkRzR1WTJ4dmMyVnpkQ2duTG5ObFkzUnBiMjRuS1R0Y2NseHVJQ0FnSUNBZ0lDQnpZM0p2Ykd4VWIxQnZjMmwwYVc5dUtDQmpiMjUwWVdsdVpYSXVhR1ZwWjJoMEtDa2dLVHRjY2x4dUlDQWdJQ0FnZlZ4eVhHNGdJQ0FnZlNrN1hISmNibHh5WEc0Z0lIMHBLQ2s3WEhKY2JseHlYRzVjY2x4dVhISmNibHh5WEc1Y2NseHVJQ0F2THlCemRHbGphM2t0MEx6UXRkQzkwWTRnMEwzUXNDRFJnZEdDMFlEUXNOQzkwTGpSaHRDMUlOQ3gwTHZRdnRDejBMQmNjbHh1SUNBb1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQjJZWElnWTI5dWRHRnBibVZ5SUQwZ0pDZ25MbUpzYjJkZlgybHVKeWs3WEhKY2JpQWdJQ0IyWVhJZ2JXVnVkU0FnSUNBZ0lEMGdZMjl1ZEdGcGJtVnlMbVpwYm1Rb0p5NWliRzluWDE5dFpXNTFKeWs3WEhKY2JseHlYRzRnSUNBZ2FXWWdLRzFsYm5VdWJHVnVaM1JvSUQwOVBTQXdJSHg4SUdselRXOWlhV3hsS1NCeVpYUjFjbTQ3WEhKY2JseHlYRzRnSUNBZ2RtRnlJR052Ym5SaGFXNWxja0p2ZEhSdmJTQTlJR052Ym5SaGFXNWxjaTV2Wm1aelpYUW9LUzUwYjNBZ0t5QmpiMjUwWVdsdVpYSXVhR1ZwWjJoMEtDa2dMU0EwTUR0Y2NseHVJQ0FnSUhaaGNpQmxaR2RsVkc5d0lDQWdJQ0FnSUNBZ1BTQnRaVzUxTG05bVpuTmxkQ2dwTG5SdmNEdGNjbHh1SUNBZ0lIWmhjaUJ0Wlc1MVNHVnBaMmgwSUNBZ0lDQWdQU0J0Wlc1MUxtaGxhV2RvZENncE8xeHlYRzVjY2x4dVhISmNiaUFnSUNBa0tIZHBibVJ2ZHlrdWIyNG9KM05qY205c2JDY3NJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnSUNCcFppaGxaR2RsVkc5d0lEd2dKQ2gzYVc1a2IzY3BMbk5qY205c2JGUnZjQ2dwS1NCN1hISmNiaUFnSUNBZ0lDQWdhV1lvWTI5dWRHRnBibVZ5UW05MGRHOXRJRHdnSkNoM2FXNWtiM2NwTG5OamNtOXNiRlJ2Y0NncElDc2diV1Z1ZFVobGFXZG9kQ2tnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdiV1Z1ZFZ4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0F1WVdSa1EyeGhjM01vSjJKc2IyZGZYMjFsYm5VdExXWnBlQzFpYjNSMGIyMG5LVnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQXVjbVZ0YjNabFEyeGhjM01vSjJKc2IyZGZYMjFsYm5VdExYTjBhV05yZVNjcE8xeHlYRzRnSUNBZ0lDQWdJSDBnWld4elpTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNCdFpXNTFYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDNWhaR1JEYkdGemN5Z25ZbXh2WjE5ZmJXVnVkUzB0YzNScFkydDVKeWxjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdMbkpsYlc5MlpVTnNZWE56S0NkaWJHOW5YMTl0Wlc1MUxTMW1hWGd0WW05MGRHOXRKeWs3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHlYRzRnSUNBZ0lDQWdJRzFsYm5VdWNtVnRiM1psUTJ4aGMzTW9KMkpzYjJkZlgyMWxiblV0TFhOMGFXTnJlU2NwTzF4eVhHNGdJQ0FnSUNCOVhISmNiaUFnSUNCOUtUdGNjbHh1WEhKY2JpQWdmU2tvS1R0Y2NseHVYSEpjYmx4eVhHNWNjbHh1WEhKY2JseHlYRzRnSUM4dklOQ2YwWURRdnRDNjBZRFJnOUdDMExyUXNDRFF0TkMrSU5DeTBZdlFzZEdBMExEUXZkQzkwTDdRdVNEUmdkR0MwTERSZ3RHTTBMZ2cwTElnMExIUXU5QyswTFBRdFZ4eVhHNGdJQ2htZFc1amRHbHZiaWdwSUh0Y2NseHVJQ0FnSUhaaGNpQmhjblJwWTJ4bFFXeHNJRDBnSkNnbkxuQnZjM1FuS1R0Y2NseHVJQ0FnSUhaaGNpQnNhVzVyYzBGc2JDQWdJRDBnSkNnbkxtSnNiMmRmWDIxbGJuVWdMbTFsYm5WZlgyeHBibXNuS1R0Y2NseHVYSEpjYmlBZ0lDQnBaaWhoY25ScFkyeGxRV3hzTG14bGJtZDBhQ0E5UFQwZ01Da2djbVYwZFhKdU8xeHlYRzVjY2x4dUlDQWdJSE5vYjNkVFpXTjBhVzl1S0hkcGJtUnZkeTVzYjJOaGRHbHZiaTVvWVhOb0xDQm1ZV3h6WlNrN1hISmNibHh5WEc1Y2NseHVJQ0FnSUdaMWJtTjBhVzl1SUhOb2IzZFRaV04wYVc5dUtITmxZM1JwYjI0c0lHbHpRVzVwYldGMFpTa2dlMXh5WEc0Z0lDQWdJQ0IyWVhJZ2RHRnlaMlYwSUNBZ0lDQWdJQ0E5SUhObFkzUnBiMjR1Y21Wd2JHRmpaU2duSXljc0lDY25LVHRjY2x4dUlDQWdJQ0FnZG1GeUlISmxjVk5sWTNScGIyNGdJQ0FnUFNCaGNuUnBZMnhsUVd4c0xtWnBiSFJsY2lnblcyUmhkR0V0YVdROVhDSW5JQ3NnZEdGeVoyVjBJQ3NnSjF3aVhTY3BPMXh5WEc0Z0lDQWdJQ0IyWVhJZ1pIVnlZWFJwYjI0Z0lDQWdJQ0E5SURjMU1EdGNjbHh1WEhKY2JpQWdJQ0FnSUdsbUlDaHlaWEZUWldOMGFXOXVMbXhsYm1kMGFDQTlQVDBnTUNrZ2NtVjBkWEp1TzF4eVhHNGdJQ0FnSUNCMllYSWdjbVZ4VTJWamRHbHZibEJ2Y3lBOUlISmxjVk5sWTNScGIyNHViMlptYzJWMEtDa3VkRzl3TzF4eVhHNWNjbHh1SUNBZ0lDQWdhV1lvYVhOQmJtbHRZWFJsS1NCN1hISmNiaUFnSUNBZ0lDQWdKQ2duWW05a2VTd2dhSFJ0YkNjcExtRnVhVzFoZEdVb2V5QnpZM0p2Ykd4VWIzQTZJSEpsY1ZObFkzUnBiMjVRYjNNZ2ZTd2daSFZ5WVhScGIyNHBPMXh5WEc0Z0lDQWdJQ0I5SUdWc2MyVWdlMXh5WEc0Z0lDQWdJQ0FnSUNRb0oySnZaSGtzSUdoMGJXd25LUzV6WTNKdmJHeFViM0FvY21WeFUyVmpkR2x2YmxCdmN5azdYSEpjYmlBZ0lDQWdJSDFjY2x4dUlDQWdJSDFjY2x4dVhISmNibHh5WEc1Y2NseHVJQ0FnSUdaMWJtTjBhVzl1SUdOb1pXTnJVMlZqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJQ0FnWVhKMGFXTnNaVUZzYkM1bFlXTm9LR1oxYm1OMGFXOXVLR2tzSUdsMFpXMHBJSHRjY2x4dUlDQWdJQ0FnSUNCMllYSWdZWEowYVdOc1pTQWdJQ0E5SUNRb2FYUmxiU2s3WEhKY2JpQWdJQ0FnSUNBZ2RtRnlJSFJ2Y0VWa1oyVWdJQ0FnUFNCaGNuUnBZMnhsTG05bVpuTmxkQ2dwTG5SdmNDQXRJREl3TUR0Y2NseHVJQ0FnSUNBZ0lDQjJZWElnWW05MGRHOXRSV1JuWlNBOUlIUnZjRVZrWjJVZ0t5QmhjblJwWTJ4bExtaGxhV2RvZENncE8xeHlYRzRnSUNBZ0lDQWdJSFpoY2lCMGIzQlRZM0p2Ykd3Z0lEMGdKQ2gzYVc1a2IzY3BMbk5qY205c2JGUnZjQ2dwTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0JwWmlBb2RHOXdSV1JuWlNBOElIUnZjRk5qY205c2JDQW1KaUJpYjNSMGIyMUZaR2RsSUQ0Z2RHOXdVMk55YjJ4c0tTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNCMllYSWdZM1Z5Y21WdWRFbGtJRDBnWVhKMGFXTnNaUzVrWVhSaEtDZHBaQ2NwTzF4eVhHNGdJQ0FnSUNBZ0lDQWdkbUZ5SUhKbGNVeHBibXNnSUNBOUlHeHBibXR6UVd4c0xtWnBiSFJsY2lnblcyaHlaV1k5WENJakp5QXJJR04xY25KbGJuUkpaQ0FySUNkY0lsMG5LVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdJQ0J5WlhGTWFXNXJMbU5zYjNObGMzUW9KeTV0Wlc1MVgxOXBkR1Z0SnlsY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnTG1Ga1pFTnNZWE56S0NkdFpXNTFYMTlwZEdWdExTMWhZM1JwZG1VbktWeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBdWMybGliR2x1WjNNb0tWeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDNXlaVzF2ZG1WRGJHRnpjeWduYldWdWRWOWZhWFJsYlMwdFlXTjBhWFpsSnlrN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUNBZ2QybHVaRzkzTG14dlkyRjBhVzl1TG1oaGMyZ2dQU0JqZFhKeVpXNTBTV1E3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzRnSUNBZ0lDQjlLVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNibHh5WEc0Z0lDQWdKQ2gzYVc1a2IzY3BMbTl1S0NkelkzSnZiR3duTENCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lDQWdZMmhsWTJ0VFpXTjBhVzl1S0NrN1hISmNiaUFnSUNCOUtUdGNjbHh1WEhKY2JseHlYRzRnSUNBZ0pDaGtiMk4xYldWdWRDa3ViMjRvSjJOc2FXTnJKeXdnSnk1aWJHOW5YMTl0Wlc1MUlDNXRaVzUxWDE5c2FXNXJKeXdnWm5WdVkzUnBiMjRvWlNrZ2UxeHlYRzRnSUNBZ0lDQmxMbkJ5WlhabGJuUkVaV1poZFd4MEtDazdYSEpjYmlBZ0lDQWdJSE5vYjNkVFpXTjBhVzl1S0NRb2RHaHBjeWt1WVhSMGNpZ25hSEpsWmljcExDQjBjblZsS1R0Y2NseHVJQ0FnSUgwcE8xeHlYRzVjY2x4dUlDQjlLU2dwTzF4eVhHNWNjbHh1WEhKY2JseHlYRzVjY2x4dVhISmNiaUFnTHk4ZzBKSFF2dEM2MEw3UXN0Q3cwTExSanlEUXY5Q3cwTDNRdGRDNzBZd2cwTDNRc0NEUmdkR0MwWURRc05DOTBMalJodEMxSU5DeDBMdlF2dEN6MExCY2NseHVJQ0FvWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNCMllYSWdkSEpwWjJkbGNpQWdJQ0FnUFNBa0tDY3VZbXh2WjE5ZmMybGtaUzEwY21sbloyVnlKeWs3WEhKY2JpQWdJQ0IyWVhJZ1lXTjBhWFpsUTJ4aGMzTWdQU0FuWW14dloxOWZjMmxrWlMwdGMyaHZkeWM3WEhKY2JpQWdJQ0IyWVhJZ1kyOXVkR0ZwYm1WeU8xeHlYRzVjY2x4dUlDQWdJR2xtS0NCMGNtbG5aMlZ5TG14bGJtZDBhQ0E5UFQwZ01Da2djbVYwZFhKdU8xeHlYRzVjY2x4dUlDQWdJR052Ym5SaGFXNWxjaUE5SUhSeWFXZG5aWEl1WTJ4dmMyVnpkQ2duTG1Kc2IyZGZYM05wWkdVbktUczdYSEpjYmx4eVhHNWNjbHh1SUNBZ0lIUnlhV2RuWlhJdWIyNG9KMk5zYVdOckp5d2dablZ1WTNScGIyNG9aU2tnZTF4eVhHNGdJQ0FnSUNCbExuQnlaWFpsYm5SRVpXWmhkV3gwS0NrN1hISmNiaUFnSUNBZ0lHTnZiblJoYVc1bGNpNTBiMmRuYkdWRGJHRnpjeWdnWVdOMGFYWmxRMnhoYzNNZ0tUdGNjbHh1SUNBZ0lIMHBPMXh5WEc1Y2NseHVYSEpjYmlBZ0lDQWtLR1J2WTNWdFpXNTBLUzV2YmlnblkyeHBZMnNuTENBbkxtSnNiMmRmWDIxbGJuVWdJQzV0Wlc1MVgxOXBkR1Z0Snl3Z1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQWdJSFpoY2lCcGRHVnRJQ0FnSUNBZ1BTQWtLSFJvYVhNcE8xeHlYRzVjY2x4dUlDQWdJQ0FnYVdZb2FYUmxiUzVvWVhORGJHRnpjeWduYldWdWRWOWZhWFJsYlMwdFlXTjBhWFpsSnlrcElISmxkSFZ5Ymp0Y2NseHVJQ0FnSUNBZ1kyOXVkR0ZwYm1WeUxuSmxiVzkyWlVOc1lYTnpLQ0JoWTNScGRtVkRiR0Z6Y3lBcE8xeHlYRzRnSUNBZ2ZTazdYSEpjYmx4eVhHNWNjbHh1SUNBZ0lDUW9kMmx1Wkc5M0tTNXZiaWduY21WemFYcGxKeXdnWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNBZ0lHbG1LQ0FrS0dSdlkzVnRaVzUwS1M1M2FXUjBhQ2dwSUQ0OUlEazJNQ0FtSmlCamIyNTBZV2x1WlhJdWFHRnpRMnhoYzNNb0lHRmpkR2wyWlVOc1lYTnpJQ2tnS1NCN1hISmNiaUFnSUNBZ0lDQWdZMjl1ZEdGcGJtVnlMbkpsYlc5MlpVTnNZWE56S0NCaFkzUnBkbVZEYkdGemN5QXBPMXh5WEc0Z0lDQWdJQ0I5WEhKY2JpQWdJQ0I5S1R0Y2NseHVYSEpjYmlBZ2ZTa29LVHRjY2x4dVhISmNibHh5WEc1Y2NseHVYSEpjYmx4eVhHNGdJQzh2SU5DaDBMdlFzTkM1MExUUXRkR0FYSEpjYmlBZ0tHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdkbUZ5SUhSeVlXNXphWFJwYjI1RmJtUWdQU0FuZEhKaGJuTnBkR2x2Ym1WdVpDQjNaV0pyYVhSVWNtRnVjMmwwYVc5dVJXNWtJRzlVY21GdWMybDBhVzl1Ulc1a0p6dGNjbHh1WEhKY2JpQWdJQ0JtZFc1amRHbHZiaUJUYkdsa1pYSW9iM0IwYVc5dWN5a2dlMXh5WEc0Z0lDQWdJQ0FnZG1GeUlHZGhiR3hsY25rZ0lDQWdJRDBnYjNCMGFXOXVjeTVsYkdWdE8xeHlYRzRnSUNBZ0lDQWdkbUZ5SUhCeVpYWWdJQ0FnSUNBZ0lEMGdaMkZzYkdWeWVTNW1hVzVrS0NjdWMyeHBaR1Z5WDE5amIyNTBjbTlzTFMxd2NtVjJKeWs3WEhKY2JpQWdJQ0FnSUNCMllYSWdibVY0ZENBZ0lDQWdJQ0FnUFNCbllXeHNaWEo1TG1acGJtUW9KeTV6Ykdsa1pYSmZYMk52Ym5SeWIyd3RMVzVsZUhRbktUdGNjbHh1WEhKY2JpQWdJQ0FnSUNCMllYSWdjMnhwWkdWeklDQWdJQ0FnSUNBZ1BTQm5ZV3hzWlhKNUxtWnBibVFvSnk1emJHbGtaWEpmWDNacFpYY2dJQzV6Ykdsa1pYTmZYMmwwWlcwbktUdGNjbHh1SUNBZ0lDQWdJSFpoY2lCaFkzUnBkbVZUYkdsa1pTQWdJQ0E5SUhOc2FXUmxjeTVtYVd4MFpYSW9KeTV6Ykdsa1pYTmZYMmwwWlcwdExXRmpkR2wyWlNjcE8xeHlYRzRnSUNBZ0lDQWdkbUZ5SUhOc2FXUmxjME51ZENBZ0lDQWdJRDBnYzJ4cFpHVnpMbXhsYm1kMGFEdGNjbHh1SUNBZ0lDQWdJSFpoY2lCaFkzUnBkbVZUYkdsa1pVbGtlQ0E5SUdGamRHbDJaVk5zYVdSbExtbHVaR1Y0S0NrN1hISmNibHh5WEc0Z0lDQWdJQ0FnZG1GeUlHMWhhVzVUYkdsa1pYSWdQU0JuWVd4c1pYSjVMbVpwYm1Rb0p5NXpiR2xrWlhKZlgzWnBaWGNnSUM1emJHbGtaWE1uS1R0Y2NseHVJQ0FnSUNBZ0lIWmhjaUJ0WVdsdVUyeHBaR1Z6SUQwZ2JXRnBibE5zYVdSbGNpNW1hVzVrS0NjdWMyeHBaR1Z6WDE5cGRHVnRKeWs3WEhKY2JseHlYRzRnSUNBZ0lDQWdkbUZ5SUhCeVpYWlRiR2xrWlhJZ1BTQm5ZV3hzWlhKNUxtWnBibVFvSnk1emJHbGtaWEpmWDJOdmJuUnliMnd0TFhCeVpYWWdJQzV6Ykdsa1pYTW5LVHRjY2x4dUlDQWdJQ0FnSUhaaGNpQndjbVYyVTJ4cFpHVnpJRDBnY0hKbGRsTnNhV1JsY2k1bWFXNWtLQ2N1YzJ4cFpHVnpYMTlwZEdWdEp5azdYSEpjYmx4eVhHNGdJQ0FnSUNBZ2RtRnlJRzVsZUhSVGJHbGtaWElnUFNCbllXeHNaWEo1TG1acGJtUW9KeTV6Ykdsa1pYSmZYMk52Ym5SeWIyd3RMVzVsZUhRZ0lDNXpiR2xrWlhNbktUdGNjbHh1SUNBZ0lDQWdJSFpoY2lCdVpYaDBVMnhwWkdWeklEMGdibVY0ZEZOc2FXUmxjaTVtYVc1a0tDY3VjMnhwWkdWelgxOXBkR1Z0SnlrN1hISmNiaUFnSUNBZ0lDQjJZWElnYVhOU1pXRmtlU0FnSUNBOUlHWmhiSE5sTzF4eVhHNWNjbHh1WEhKY2JpQWdJQ0FnSUNCMllYSWdaR1Z6WXlBZ1BTQm5ZV3hzWlhKNUxtWnBibVFvSnk1emJHbGtaWEpmWDJSbGMyTW5LVHRjY2x4dUlDQWdJQ0FnSUhaaGNpQjBhWFJzWlNBOUlHUmxjMk11Wm1sdVpDZ25Mbk5zYVdSbGNsOWZkR2wwYkdVbktUdGNjbHh1SUNBZ0lDQWdJSFpoY2lCMGIyOXNjeUE5SUdSbGMyTXVabWx1WkNnbkxuTnNhV1JsY2w5ZmFXNW1ieWNwTzF4eVhHNGdJQ0FnSUNBZ2RtRnlJR3hwYm1zZ0lEMGdaR1Z6WXk1bWFXNWtLQ2N1YzJ4cFpHVnlYMTlzYVc1ckp5azdYSEpjYmx4eVhHNGdJQ0FnSUNBZ2RtRnlJR1JoZEdFZ0lDQWdJQ0E5SUdkaGJHeGxjbmt1Wm1sdVpDZ25Mbk5zYVdSbGNsOWZaR0YwWVNjcE8xeHlYRzRnSUNBZ0lDQWdkbUZ5SUdSaGRHRkpkR1Z0Y3lBOUlHUmhkR0V1Wm1sdVpDZ25Mbk5zYVdSbGNpMWtZWFJoWDE5cGRHVnRKeWs3WEhKY2JseHlYRzVjY2x4dUlDQWdJQ0FnSUM4dklHbHVhWFJjY2x4dUlDQWdJQ0FnSUdaMWJtTjBhVzl1SUdsdWFYUW9LU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQnphRzkzWldSVGJHbGtaU2h1WlhoMFUyeHBaR1Z6TENCblpYUkpaSGdvWVdOMGFYWmxVMnhwWkdWSlpIZ3NJQ2R1WlhoMEp5a3BPMXh5WEc0Z0lDQWdJQ0FnSUNBZ2MyaHZkMlZrVTJ4cFpHVW9jSEpsZGxOc2FXUmxjeXdnWjJWMFNXUjRLR0ZqZEdsMlpWTnNhV1JsU1dSNExDQW5jSEpsZGljcEtUdGNjbHh1SUNBZ0lDQWdJQ0FnSUhWd1pHRjBaVVJsYzJNb1pHRjBZVWwwWlcxekxtVnhLR0ZqZEdsMlpWTnNhV1JsU1dSNEtTazdYSEpjYmlBZ0lDQWdJQ0FnSUNCcGMxSmxZV1I1SUQwZ2RISjFaVHRjY2x4dUlDQWdJQ0FnSUgxY2NseHVJQ0FnSUNBZ0lHbHVhWFFvS1R0Y2NseHVYSEpjYmlBZ0lDQWdJQ0JtZFc1amRHbHZiaUJ6YUc5M1pXUlRiR2xrWlNoemJHbGtaWElzSUdsa2VDa2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ2MyeHBaR1Z5WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0F1WlhFb2FXUjRLUzVoWkdSRGJHRnpjeWduYzJ4cFpHVnpYMTlwZEdWdExTMWhZM1JwZG1VbktWeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0xuTnBZbXhwYm1kektDa3VjbVZ0YjNabFEyeGhjM01vSjNOc2FXUmxjMTlmYVhSbGJTMHRZV04wYVhabEp5azdYSEpjYmlBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdablZ1WTNScGIyNGdaR0YwWVVOb1lXNW5aU2hrYVhKbFkzUnBiMjRwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJR0ZqZEdsMlpWTnNhV1JsU1dSNElEMGdLR1JwY21WamRHbHZiaUE5UFQwZ0oyNWxlSFFuS1NBL0lHZGxkRWxrZUNoaFkzUnBkbVZUYkdsa1pVbGtlQ3dnSjI1bGVIUW5LU0E2SUdkbGRFbGtlQ2hoWTNScGRtVlRiR2xrWlVsa2VDd2dKM0J5WlhZbktUdGNjbHh1SUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQm1kVzVqZEdsdmJpQm5aWFJKWkhnb1kzVnljbVZ1ZEVsa2VDd2daR2x5S1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0JwWmloa2FYSWdQVDA5SUNkd2NtVjJKeWtnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdLR04xY25KbGJuUkpaSGdnTFNBeElEd2dNQ2tnUHlCemJHbGtaWE5EYm5RZ0xTQXhJRG9nWTNWeWNtVnVkRWxrZUNBdElERWdPMXh5WEc0Z0lDQWdJQ0FnSUNBZ2ZWeHlYRzRnSUNBZ0lDQWdJQ0FnYVdZb1pHbHlJRDA5UFNBbmJtVjRkQ2NwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJQ2hqZFhKeVpXNTBTV1I0SUNzZ01TQStQU0J6Ykdsa1pYTkRiblFwSUQ4Z01DQTZJR04xY25KbGJuUkpaSGdnS3lBeElEdGNjbHh1SUNBZ0lDQWdJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnWTNWeWNtVnVkRWxrZUR0Y2NseHVJQ0FnSUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0FnSUNCbWRXNWpkR2x2YmlCamFHRnVaMlZUYkdsa1pTaHpiR2xrWlhNc0lHUnBjbVZqZEdsdmJpd2dZMnhoYzNOT1lXMWxLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQjJZWElnWTNWeWNtVnVkRk5zYVdSbElDQWdJRDBnYzJ4cFpHVnpMbVpwYkhSbGNpZ25Mbk5zYVdSbGMxOWZhWFJsYlMwdFlXTjBhWFpsSnlrN1hISmNiaUFnSUNBZ0lDQWdJQ0IyWVhJZ1kzVnljbVZ1ZEZOc2FXUmxTV1I0SUQwZ1kzVnljbVZ1ZEZOc2FXUmxMbWx1WkdWNEtDazdYSEpjYmlBZ0lDQWdJQ0FnSUNCMllYSWdibVYzVTJ4cFpHVkpaSGc3WEhKY2JseHlYRzRnSUNBZ0lDQWdJQ0FnYVdZZ0tHUnBjbVZqZEdsdmJpQTlQVDBnSjNCeVpYWW5LU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0J1WlhkVGJHbGtaVWxrZUNBOUlHZGxkRWxrZUNoamRYSnlaVzUwVTJ4cFpHVkpaSGdzSUNkd2NtVjJKeWs3WEhKY2JpQWdJQ0FnSUNBZ0lDQjlYSEpjYmlBZ0lDQWdJQ0FnSUNCcFppQW9aR2x5WldOMGFXOXVJRDA5UFNBbmJtVjRkQ2NwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUc1bGQxTnNhV1JsU1dSNElEMGdaMlYwU1dSNEtHTjFjbkpsYm5SVGJHbGtaVWxrZUN3Z0oyNWxlSFFuS1R0Y2NseHVJQ0FnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdJQ0J6Ykdsa1pYTXVaWEVvYm1WM1UyeHBaR1ZKWkhncFhISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBdVlXUmtRMnhoYzNNb0lHTnNZWE56VG1GdFpTQXBYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQXViMjVsS0hSeVlXNXphWFJwYjI1RmJtUXNJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0pDaDBhR2x6S1Z4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdMbkpsYlc5MlpVTnNZWE56S0NCamJHRnpjMDVoYldVZ0tWeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnTG1Ga1pFTnNZWE56S0NkemJHbGtaWE5mWDJsMFpXMHRMV0ZqZEdsMlpTY3BYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBdWRISnBaMmRsY2lnblkyaGhibWRsWkMxemJHbGtaU2NwTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnZlNrN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUNBZ1kzVnljbVZ1ZEZOc2FXUmxYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQXVZV1JrUTJ4aGMzTW9JR05zWVhOelRtRnRaU0FwWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0F1YjI1bEtIUnlZVzV6YVhScGIyNUZibVFzSUdaMWJtTjBhVzl1S0NrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdKQ2gwYUdsektTNXlaVzF2ZG1WRGJHRnpjeWduYzJ4cFpHVnpYMTlwZEdWdExTMWhZM1JwZG1VZ0p5QXJJR05zWVhOelRtRnRaU2s3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0I5S1R0Y2NseHVJQ0FnSUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0FnSUNCbWRXNWpkR2x2YmlCamFHRnVaMlZCYkd3b1pHbHlaV04wYVc5dUtTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNCamFHRnVaMlZUYkdsa1pTaHRZV2x1VTJ4cFpHVnpMQ0JrYVhKbFkzUnBiMjRzSUNkemJHbGtaWE5mWDJsMFpXMHRMV0Z1YVcxaGRHVXRabUZrWlNjcE8xeHlYRzRnSUNBZ0lDQWdJQ0FnWTJoaGJtZGxVMnhwWkdVb2NISmxkbE5zYVdSbGN5d2daR2x5WldOMGFXOXVMQ0FuYzJ4cFpHVnpYMTlwZEdWdExTMWhibWx0WVhSbExXUnZkMjRuS1R0Y2NseHVJQ0FnSUNBZ0lDQWdJR05vWVc1blpWTnNhV1JsS0c1bGVIUlRiR2xrWlhNc0lHUnBjbVZqZEdsdmJpd2dKM05zYVdSbGMxOWZhWFJsYlMwdFlXNXBiV0YwWlMxMWNDY3BPMXh5WEc0Z0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJR1oxYm1OMGFXOXVJSFZ3WkdGMFpVUmxjMk1vWkdGMFlTa2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ2RHbDBiR1V1ZEdWNGRDZ2daR0YwWVM1aGRIUnlLQ2RrWVhSaExYUnBkR3hsSnlrZ0tUdGNjbHh1SUNBZ0lDQWdJQ0FnSUhSdmIyeHpMblJsZUhRb0lHUmhkR0V1WVhSMGNpZ25aR0YwWVMxMGIyOXNjeWNwSUNrN1hISmNiaUFnSUNBZ0lDQWdJQ0JzYVc1ckxtRjBkSElvSjJoeVpXWW5MQ0JrWVhSaExtRjBkSElvSjJSaGRHRXRiR2x1YXljcElDazdYSEpjYmlBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdKQ2hrYjJOMWJXVnVkQ2t1YjI0b0oyTm9ZVzVuWldRdGMyeHBaR1VuTENCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUdselVtVmhaSGtnUFNCMGNuVmxPMXh5WEc0Z0lDQWdJQ0FnZlNrN1hISmNibHh5WEc1Y2NseHVYSEpjYmlBZ0lDQWdJQ0IwYUdsekxuQnlaWFlnUFNCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUdsbUtDQWhhWE5TWldGa2VTQXBJSEpsZEhWeWJqdGNjbHh1SUNBZ0lDQWdJQ0FnSUdselVtVmhaSGtnUFNCbVlXeHpaVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdJQ0JqYUdGdVoyVkJiR3dvSjNCeVpYWW5LVnh5WEc0Z0lDQWdJQ0FnSUNBZ1pHRjBZVU5vWVc1blpTZ25jSEpsZGljcE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNBZ0lIVndaR0YwWlVSbGMyTW9aR0YwWVVsMFpXMXpMbVZ4S0dGamRHbDJaVk5zYVdSbFNXUjRLU2s3WEhKY2JpQWdJQ0FnSUNCOU8xeHlYRzVjY2x4dVhISmNiaUFnSUNBZ0lDQjBhR2x6TG01bGVIUWdQU0JtZFc1amRHbHZiaWdwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJR2xtS0NBaGFYTlNaV0ZrZVNBcElISmxkSFZ5Ymp0Y2NseHVJQ0FnSUNBZ0lDQWdJR2x6VW1WaFpIa2dQU0JtWVd4elpUdGNjbHh1WEhKY2JpQWdJQ0FnSUNBZ0lDQmphR0Z1WjJWQmJHd29KMjVsZUhRbktWeHlYRzRnSUNBZ0lDQWdJQ0FnWkdGMFlVTm9ZVzVuWlNnbmJtVjRkQ2NwTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0FnSUhWd1pHRjBaVVJsYzJNb1pHRjBZVWwwWlcxekxtVnhLR0ZqZEdsMlpWTnNhV1JsU1dSNEtTazdYSEpjYmlBZ0lDQWdJQ0I5TzF4eVhHNWNjbHh1SUNBZ0lDQWdJSEJ5WlhZdWIyNG9KMk5zYVdOckp5d2dkR2hwY3k1d2NtVjJLVHRjY2x4dUlDQWdJQ0FnSUc1bGVIUXViMjRvSjJOc2FXTnJKeXdnZEdocGN5NXVaWGgwS1R0Y2NseHVJQ0FnSUgwZ0x5OGdVMnhwWkdWeVhISmNibHh5WEc1Y2NseHVJQ0FnSUhaaGNpQnpiR2xrWlhJZ1BTQnVaWGNnVTJ4cFpHVnlLSHRjY2x4dUlDQWdJQ0FnSUdWc1pXMDZJQ1FvSnlOcWN5MXpiR2xrWlhJbktWeHlYRzRnSUNBZ2ZTazdYSEpjYmlBZ2ZTa29LVHRjY2x4dVhISmNibHh5WEc1Y2NseHVYSEpjYmx4eVhHNGdJQzh2SU5DZTBMSFJnTkN3MExIUXZ0R0MwTHJRc0NEUXVDRFF2dEdDMEwvUmdOQ3cwTExRdXRDd0lOR0UwTDdSZ05DOFhISmNiaUFnS0daMWJtTjBhVzl1S0NrZ2UxeHlYRzRnSUNBZ0pDZ25abTl5YlNjcExtRjBkSElvSjI1dmRtRnNhV1JoZEdVbkxDQjBjblZsS1R0Y2NseHVYSEpjYmlBZ0lDQXZLaURRbjlHQTBMZ2cwWVRRdnRDNjBZUFJnZEMxSU5HRDBMSFF1TkdBMExEUmd0R01JTkM2MFlEUXNOR0IwTDNSZzlHT0lOQyswTEhRc3RDKzBMVFF1dEdESUNvdlhISmNiaUFnSUNBa0tHUnZZM1Z0Wlc1MEtTNXZiaWduWm05amRYTW5MQ0FuYVc1d2RYUXNJSFJsZUhSaGNtVmhKeXdnWm5WdVkzUnBiMjRvWlNrZ2UxeHlYRzRnSUNBZ0lDQWtLSFJvYVhNcFhISmNiaUFnSUNBZ0lDQWdMbkpsYlc5MlpVTnNZWE56S0NkbWFXVnNaQzB0WlhKeWIzSW5LVnh5WEc0Z0lDQWdJQ0FnSUM1eVpXMXZkbVZEYkdGemN5Z25abWxsYkdRdExXOXJKeWs3WEhKY2JpQWdJQ0I5S1R0Y2NseHVYSEpjYmlBZ0lDQWtLR1J2WTNWdFpXNTBLUzV2YmlnbmNtVnpaWFFuTENBblptOXliU2NzSUdaMWJtTjBhVzl1S0dVcElIdGNjbHh1SUNBZ0lDQWdKQ2gwYUdsektTNW1hVzVrS0NkcGJuQjFkQ3dnZEdWNGRHRnlaV0VuS1Z4eVhHNGdJQ0FnSUNBZ0lDNXlaVzF2ZG1WRGJHRnpjeWduWm1sbGJHUXRMV1Z5Y205eUp5bGNjbHh1SUNBZ0lDQWdJQ0F1Y21WdGIzWmxRMnhoYzNNb0oyWnBaV3hrTFMxdmF5Y3BPMXh5WEc0Z0lDQWdmU2s3WEhKY2JseHlYRzVjY2x4dUlDQWdJQzh2SU5DUzBMRFF1OUM0MExUUXNOR0cwTGpSanlEUXY5QyswTHZRdGRDNUlOR0UwTDdSZ05DODBZdGNjbHh1SUNBZ0lHWjFibU4wYVc5dUlIWmhiR2xrWVhSbFJtOXliU2htYjNKdEtTQjdYSEpjYmlBZ0lDQWdJSFpoY2lCcGJuQjFkSE1nSUNBZ0lEMGdabTl5YlM1bWFXNWtLQ2RiY21WeGRXbHlaV1JkSnlrN1hISmNiaUFnSUNBZ0lIWmhjaUJwYzFaaGJHbGtZWFJsSUQwZ2RISjFaVHRjY2x4dVhISmNiaUFnSUNBZ0lHbHVjSFYwY3k1eVpXMXZkbVZEYkdGemN5Z25abWxsYkdRdExXVnljbTl5SnlrN1hISmNibHh5WEc0Z0lDQWdJQ0JwYm5CMWRITXVaV0ZqYUNobWRXNWpkR2x2YmlocExDQnBkR1Z0S1NCN1hISmNiaUFnSUNBZ0lDQWdkbUZ5SUdsdWNIVjBJRDBnSkNocGRHVnRLVHRjY2x4dUlDQWdJQ0FnSUNCMllYSWdkbUZzZFdVZ1BTQnBibkIxZEM1MllXd29LVHRjY2x4dUlDQWdJQ0FnSUNCMllYSWdkSGx3WlNBZ1BTQnBibkIxZEM1aGRIUnlLQ2QwZVhCbEp5azdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lHbG1LSFI1Y0dVZ1BUMGdKMk5vWldOclltOTRKeWtnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdhV1lvSVdsdWNIVjBMbWx6S0NjNlkyaGxZMnRsWkNjcEtTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHbHVjSFYwTG1Ga1pFTnNZWE56S0NkbWFXVnNaQzB0WlhKeWIzSW5LVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdhWE5XWVd4cFpHRjBaU0E5SUdaaGJITmxPMXh5WEc0Z0lDQWdJQ0FnSUNBZ2ZWeHlYRzRnSUNBZ0lDQWdJQ0FnY21WMGRYSnVPMXh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQWdJQ0FnYVdZb2RtRnNkV1V1ZEhKcGJTZ3BJRDA5SUNjbktTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNCcGJuQjFkQzVoWkdSRGJHRnpjeWduWm1sbGJHUXRMV1Z5Y205eUp5azdYSEpjYmlBZ0lDQWdJQ0FnSUNCcGMxWmhiR2xrWVhSbElEMGdabUZzYzJVN1hISmNiaUFnSUNBZ0lDQWdmU0JsYkhObElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUdsdWNIVjBYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDNXlaVzF2ZG1WRGJHRnpjeWduWm1sbGJHUXRMV1Z5Y205eUp5bGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0xtRmtaRU5zWVhOektDZG1hV1ZzWkMwdGIyc25LVHRjY2x4dUlDQWdJQ0FnSUNCOVhISmNiaUFnSUNBZ0lIMHBPMXh5WEc1Y2NseHVJQ0FnSUNBZ2NtVjBkWEp1SUdselZtRnNhV1JoZEdVN1hISmNiaUFnSUNCOUlDOHZJSFpoYkdsa1lYUmxSbTl5YlNncE8xeHlYRzVjY2x4dVhISmNibHh5WEc1Y2NseHVJQ0FnSUM4cUlOQ2UwWUxRdjlHQTBMRFFzdEM2MExBZzBZVFF2dEdBMEx3Z0tpOWNjbHh1SUNBZ0lHWjFibU4wYVc5dUlITmxibVJHYjNKdEtHWnZjbTBzSUcxbGRHaHZaQ3dnZFhKc0xDQmtZWFJoVkhsd1pTa2dlMXh5WEc0Z0lDQWdJQ0FnSUdsbUtDQWhkbUZzYVdSaGRHVkdiM0p0S0dadmNtMHBJQ2tnY21WMGRYSnVPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQWtMbUZxWVhnb2UxeHlYRzRnSUNBZ0lDQWdJQ0FnZEhsd1pUb2diV1YwYUc5a0xGeHlYRzRnSUNBZ0lDQWdJQ0FnZFhKc09pQWdkWEpzTEZ4eVhHNGdJQ0FnSUNBZ0lDQWdaR0YwWVRvZ1ptOXliUzV6WlhKcFlXeHBlbVVvS1Z4eVhHNGdJQ0FnSUNBZ0lIMHBYSEpjYmlBZ0lDQWdJQ0FnTG1SdmJtVW9ablZ1WTNScGIyNG9ZVzV6ZDJWeUtTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNCamIyNXpiMnhsTG14dlp5Z25abTl5YlNCelpXNWtKeWs3WEhKY2JpQWdJQ0FnSUNBZ0lDQm1iM0p0TG5SeWFXZG5aWElvSjNKbGMyVjBKeWs3WEhKY2JpQWdJQ0FnSUNBZ2ZTbGNjbHh1SUNBZ0lDQWdJQ0F1Wm1GcGJDaG1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDOHZJR052Ym5OdmJHVXViRzluS0NkbWIzSnRJSE5sYm1RNklHVnljbTl5SnlrN1hISmNiaUFnSUNBZ0lDQWdmU2s3WEhKY2JpQWdJQ0I5SUM4dklITmxibVJHYjNKdEtDazdYSEpjYmx4eVhHNWNjbHh1SUNBZ0lDUW9KeTVtYjNKdExXMXZaR0ZzTFMxallXeHNZbUZqYXljcExtOXVLQ2R6ZFdKdGFYUW5MQ0JtZFc1amRHbHZiaWhsS1NCN1hISmNiaUFnSUNBZ0lHVXVjSEpsZG1WdWRFUmxabUYxYkhRb0tUdGNjbHh1SUNBZ0lDQWdjMlZ1WkVadmNtMG9KQ2gwYUdsektTd2dKMUJQVTFRbkxDQW5iV0ZwYkM1d2FIQW5LVHRjY2x4dUlDQWdJSDBwTzF4eVhHNWNjbHh1WEhKY2JpQWdJQ0FrS0NjalptOXliUzFoZFhSb2IzSnBlbUYwYVc5dUp5a3ViMjRvSjNOMVltMXBkQ2NzSUdaMWJtTjBhVzl1S0dVcElIdGNjbHh1SUNBZ0lDQWdaUzV3Y21WMlpXNTBSR1ZtWVhWc2RDZ3BPMXh5WEc0Z0lDQWdJQ0J6Wlc1a1JtOXliU2drS0hSb2FYTXBMQ0FuVUU5VFZDY3NJQ2RoZFhSb2IzSnBlbUYwYVc5dUxuQm9jQ2NwTzF4eVhHNGdJQ0FnZlNrN1hISmNibHh5WEc0Z0lIMHBLQ2s3WEhKY2JseHlYRzVjY2x4dVhISmNibHh5WEc1Y2NseHVJQ0F2THlEUW10Q3cwWURSZ3RDd1hISmNiaUFnS0daMWJtTjBhVzl1S0NrZ2UxeHlYRzVjY2x4dUlDQWdJSFpoY2lCdFlYQWdQU0JrYjJOMWJXVnVkQzVuWlhSRmJHVnRaVzUwUW5sSlpDZ25iV0Z3SnlrN1hISmNibHh5WEc0Z0lDQWdhV1lvSUcxaGNDQTlQVDBnYm5Wc2JDQXBJSEpsZEhWeWJqdGNjbHh1WEhKY2JseHlYRzRnSUNBZ0x5OGcwTC9Rc05HQTBMRFF2TkMxMFlMUmdOR0xJTkM2MExEUmdOR0MwWXRjY2x4dUlDQWdJSFpoY2lCc1lYUnBkSFZrWlNBZ1BTQTFPQzR3TWpJek9EUTVPMXh5WEc0Z0lDQWdkbUZ5SUd4dmJtZHBkSFZrWlNBOUlEVTJMakl6TXpnME5qSTdYSEpjYmlBZ0lDQjJZWElnYldGd1dtOXZiU0FnUFNBeE5UdGNjbHh1WEhKY2JseHlYRzRnSUNBZ0x5OGcwS0hSZ3RDNDBMdlF1TkMzMExEUmh0QzQwWThnMExyUXNOR0EwWUxSaTF4eVhHNGdJQ0FnZG1GeUlHMWhhVzdRb1c5c2IzSWdQU0JjSWlNMk1VUkJRemxjSWp0Y2NseHVYSEpjYmlBZ0lDQjJZWElnYzNSNWJHVWdQU0JiWEhKY2JpQWdJQ0FnSUh0Y2NseHVJQ0FnSUNBZ0lDQmNJbVpsWVhSMWNtVlVlWEJsWENJNklGd2lZV1J0YVc1cGMzUnlZWFJwZG1WY0lpeGNjbHh1SUNBZ0lDQWdJQ0JjSW1Wc1pXMWxiblJVZVhCbFhDSTZJRndpYkdGaVpXeHpMblJsZUhRdVptbHNiRndpTEZ4eVhHNGdJQ0FnSUNBZ0lGd2ljM1I1YkdWeWMxd2lPaUJiWEhKY2JpQWdJQ0FnSUNBZ0lDQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lGd2lZMjlzYjNKY0lqb2dYQ0lqTkRRME5EUTBYQ0pjY2x4dUlDQWdJQ0FnSUNBZ0lIMWNjbHh1SUNBZ0lDQWdJQ0JkWEhKY2JpQWdJQ0FnSUgwc1hISmNiaUFnSUNBZ0lIdGNjbHh1SUNBZ0lDQWdJQ0JjSW1abFlYUjFjbVZVZVhCbFhDSTZJRndpYkdGdVpITmpZWEJsWENJc1hISmNiaUFnSUNBZ0lDQWdYQ0psYkdWdFpXNTBWSGx3WlZ3aU9pQmNJbUZzYkZ3aUxGeHlYRzRnSUNBZ0lDQWdJRndpYzNSNWJHVnljMXdpT2lCYlhISmNiaUFnSUNBZ0lDQWdJQ0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJRndpWTI5c2IzSmNJam9nWENJalpqSm1NbVl5WENKY2NseHVJQ0FnSUNBZ0lDQWdJSDFjY2x4dUlDQWdJQ0FnSUNCZFhISmNiaUFnSUNBZ0lIMHNYSEpjYmlBZ0lDQWdJSHRjY2x4dUlDQWdJQ0FnSUNCY0ltWmxZWFIxY21WVWVYQmxYQ0k2SUZ3aWJHRnVaSE5qWVhCbExtMWhibDl0WVdSbFhDSXNYSEpjYmlBZ0lDQWdJQ0FnWENKbGJHVnRaVzUwVkhsd1pWd2lPaUJjSW1kbGIyMWxkSEo1TG1acGJHeGNJaXhjY2x4dUlDQWdJQ0FnSUNCY0luTjBlV3hsY25OY0lqb2dXMXh5WEc0Z0lDQWdJQ0FnSUNBZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCY0ltTnZiRzl5WENJNklGd2lJMlptWm1abVpsd2lYSEpjYmlBZ0lDQWdJQ0FnSUNCOVhISmNiaUFnSUNBZ0lDQWdYVnh5WEc0Z0lDQWdJQ0I5TEZ4eVhHNGdJQ0FnSUNCN1hISmNiaUFnSUNBZ0lDQWdYQ0ptWldGMGRYSmxWSGx3WlZ3aU9pQmNJbkJ2YVZ3aUxGeHlYRzRnSUNBZ0lDQWdJRndpWld4bGJXVnVkRlI1Y0dWY0lqb2dYQ0poYkd4Y0lpeGNjbHh1SUNBZ0lDQWdJQ0JjSW5OMGVXeGxjbk5jSWpvZ1cxeHlYRzRnSUNBZ0lDQWdJQ0FnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JjSW5acGMybGlhV3hwZEhsY0lqb2dYQ0p2Wm1aY0lseHlYRzRnSUNBZ0lDQWdJQ0FnZlZ4eVhHNGdJQ0FnSUNBZ0lGMWNjbHh1SUNBZ0lDQWdmU3hjY2x4dUlDQWdJQ0FnZTF4eVhHNGdJQ0FnSUNBZ0lGd2labVZoZEhWeVpWUjVjR1ZjSWpvZ1hDSnliMkZrWENJc1hISmNiaUFnSUNBZ0lDQWdYQ0psYkdWdFpXNTBWSGx3WlZ3aU9pQmNJbUZzYkZ3aUxGeHlYRzRnSUNBZ0lDQWdJRndpYzNSNWJHVnljMXdpT2lCYlhISmNiaUFnSUNBZ0lDQWdJQ0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJRndpYzJGMGRYSmhkR2x2Ymx3aU9pQXRNVEF3WEhKY2JpQWdJQ0FnSUNBZ0lDQjlMRnh5WEc0Z0lDQWdJQ0FnSUNBZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCY0lteHBaMmgwYm1WemMxd2lPaUEwTlZ4eVhHNGdJQ0FnSUNBZ0lDQWdmVnh5WEc0Z0lDQWdJQ0FnSUYxY2NseHVJQ0FnSUNBZ2ZTeGNjbHh1SUNBZ0lDQWdlMXh5WEc0Z0lDQWdJQ0FnSUZ3aVptVmhkSFZ5WlZSNWNHVmNJam9nWENKeWIyRmtYQ0lzWEhKY2JpQWdJQ0FnSUNBZ1hDSmxiR1Z0Wlc1MFZIbHdaVndpT2lCY0ltZGxiMjFsZEhKNUxtWnBiR3hjSWl4Y2NseHVJQ0FnSUNBZ0lDQmNJbk4wZVd4bGNuTmNJam9nVzF4eVhHNGdJQ0FnSUNBZ0lDQWdlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQmNJbU52Ykc5eVhDSTZJRndpSTJRMlpEWmtObHdpWEhKY2JpQWdJQ0FnSUNBZ0lDQjlYSEpjYmlBZ0lDQWdJQ0FnWFZ4eVhHNGdJQ0FnSUNCOUxGeHlYRzRnSUNBZ0lDQjdYSEpjYmlBZ0lDQWdJQ0FnWENKbVpXRjBkWEpsVkhsd1pWd2lPaUJjSW5KdllXUXVhR2xuYUhkaGVWd2lMRnh5WEc0Z0lDQWdJQ0FnSUZ3aVpXeGxiV1Z1ZEZSNWNHVmNJam9nWENKaGJHeGNJaXhjY2x4dUlDQWdJQ0FnSUNCY0luTjBlV3hsY25OY0lqb2dXMXh5WEc0Z0lDQWdJQ0FnSUNBZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCY0luWnBjMmxpYVd4cGRIbGNJam9nWENKemFXMXdiR2xtYVdWa1hDSmNjbHh1SUNBZ0lDQWdJQ0FnSUgxY2NseHVJQ0FnSUNBZ0lDQmRYSEpjYmlBZ0lDQWdJSDBzWEhKY2JpQWdJQ0FnSUh0Y2NseHVJQ0FnSUNBZ0lDQmNJbVpsWVhSMWNtVlVlWEJsWENJNklGd2ljbTloWkM1aGNuUmxjbWxoYkZ3aUxGeHlYRzRnSUNBZ0lDQWdJRndpWld4bGJXVnVkRlI1Y0dWY0lqb2dYQ0pzWVdKbGJITXVhV052Ymx3aUxGeHlYRzRnSUNBZ0lDQWdJRndpYzNSNWJHVnljMXdpT2lCYlhISmNiaUFnSUNBZ0lDQWdJQ0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJRndpZG1semFXSnBiR2wwZVZ3aU9pQmNJbTltWmx3aVhISmNiaUFnSUNBZ0lDQWdJQ0I5WEhKY2JpQWdJQ0FnSUNBZ1hWeHlYRzRnSUNBZ0lDQjlMRnh5WEc0Z0lDQWdJQ0I3WEhKY2JpQWdJQ0FnSUNBZ1hDSm1aV0YwZFhKbFZIbHdaVndpT2lCY0luUnlZVzV6YVhSY0lpeGNjbHh1SUNBZ0lDQWdJQ0JjSW1Wc1pXMWxiblJVZVhCbFhDSTZJRndpWVd4c1hDSXNYSEpjYmlBZ0lDQWdJQ0FnWENKemRIbHNaWEp6WENJNklGdGNjbHh1SUNBZ0lDQWdJQ0FnSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWENKMmFYTnBZbWxzYVhSNVhDSTZJRndpYjJabVhDSmNjbHh1SUNBZ0lDQWdJQ0FnSUgxY2NseHVJQ0FnSUNBZ0lDQmRYSEpjYmlBZ0lDQWdJSDBzWEhKY2JpQWdJQ0FnSUh0Y2NseHVJQ0FnSUNBZ0lDQmNJbVpsWVhSMWNtVlVlWEJsWENJNklGd2lkMkYwWlhKY0lpeGNjbHh1SUNBZ0lDQWdJQ0JjSW1Wc1pXMWxiblJVZVhCbFhDSTZJRndpWVd4c1hDSXNYSEpjYmlBZ0lDQWdJQ0FnWENKemRIbHNaWEp6WENJNklGdGNjbHh1SUNBZ0lDQWdJQ0FnSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWENKamIyeHZjbHdpT2lCY0lpTTBObUpqWldOY0lseHlYRzRnSUNBZ0lDQWdJQ0FnZlN4Y2NseHVJQ0FnSUNBZ0lDQWdJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdYQ0oyYVhOcFltbHNhWFI1WENJNklGd2liMjVjSWx4eVhHNGdJQ0FnSUNBZ0lDQWdmVnh5WEc0Z0lDQWdJQ0FnSUYxY2NseHVJQ0FnSUNBZ2ZTeGNjbHh1SUNBZ0lDQWdlMXh5WEc0Z0lDQWdJQ0FnSUZ3aVptVmhkSFZ5WlZSNWNHVmNJam9nWENKM1lYUmxjbHdpTEZ4eVhHNGdJQ0FnSUNBZ0lGd2laV3hsYldWdWRGUjVjR1ZjSWpvZ1hDSm5aVzl0WlhSeWVTNW1hV3hzWENJc1hISmNiaUFnSUNBZ0lDQWdYQ0p6ZEhsc1pYSnpYQ0k2SUZ0Y2NseHVJQ0FnSUNBZ0lDQWdJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdYQ0pqYjJ4dmNsd2lPaUJ0WVdsdTBLRnZiRzl5WEhKY2JpQWdJQ0FnSUNBZ0lDQjlYSEpjYmlBZ0lDQWdJQ0FnWFZ4eVhHNGdJQ0FnSUNCOUxGeHlYRzRnSUNBZ0lDQjdYSEpjYmlBZ0lDQWdJQ0FnWENKbVpXRjBkWEpsVkhsd1pWd2lPaUJjSW5kaGRHVnlYQ0lzWEhKY2JpQWdJQ0FnSUNBZ1hDSmxiR1Z0Wlc1MFZIbHdaVndpT2lCY0lteGhZbVZzYzF3aUxGeHlYRzRnSUNBZ0lDQWdJRndpYzNSNWJHVnljMXdpT2lCYlhISmNiaUFnSUNBZ0lDQWdJQ0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJRndpZG1semFXSnBiR2wwZVZ3aU9pQmNJbTltWmx3aVhISmNiaUFnSUNBZ0lDQWdJQ0I5WEhKY2JpQWdJQ0FnSUNBZ1hWeHlYRzRnSUNBZ0lDQjlYSEpjYmlBZ0lDQmRYSEpjYmx4eVhHNWNjbHh1WEhKY2JpQWdJQ0F2THlEUW5kQ3cwWUhSZ3RHQTBMN1F1ZEM2MExnZzBMclFzTkdBMFlMUmkxeHlYRzRnSUNBZ2RtRnlJRzFoY0U5d2RHbHZibk1nUFNCN1hISmNiaUFnSUNBZ0lHTmxiblJsY2pvZ2JtVjNJR2R2YjJkc1pTNXRZWEJ6TGt4aGRFeHVaeWhzWVhScGRIVmtaU3dnYkc5dVoybDBkV1JsS1N4Y2NseHVJQ0FnSUNBZ2VtOXZiVG9nYldGd1dtOXZiU3hjY2x4dUlDQWdJQ0FnY0dGdVEyOXVkSEp2YkRvZ1ptRnNjMlVzWEhKY2JpQWdJQ0FnSUhwdmIyMURiMjUwY205c09pQm1ZV3h6WlN4Y2NseHVJQ0FnSUNBZ2JXRndWSGx3WlVOdmJuUnliMnc2SUdaaGJITmxMRnh5WEc0Z0lDQWdJQ0J6ZEhKbFpYUldhV1YzUTI5dWRISnZiRG9nWm1Gc2MyVXNYSEpjYmlBZ0lDQWdJRzFoY0ZSNWNHVkpaRG9nWjI5dloyeGxMbTFoY0hNdVRXRndWSGx3WlVsa0xsSlBRVVJOUVZBc1hISmNiaUFnSUNBZ0lITmpjbTlzYkhkb1pXVnNPaUJtWVd4elpTeGNjbHh1SUNBZ0lDQWdjM1I1YkdWek9pQnpkSGxzWlN4Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQXZMeURRbU5DOTBMalJodEM0MExEUXU5QzQwTGZRc05HRzBMalJqeURRdXRDdzBZRFJndEdMWEhKY2JpQWdJQ0IyWVhJZ1oyOXZaMnhsVFdGd0lEMGdibVYzSUdkdmIyZHNaUzV0WVhCekxrMWhjQ2h0WVhBc0lHMWhjRTl3ZEdsdmJuTXBPMXh5WEc1Y2NseHVJQ0I5S1NncE8xeHlYRzVjY2x4dWZTazdYSEpjYmx4eVhHNWNjbHh1WEhKY2JseHlYRzVjY2x4dUpDaDNhVzVrYjNjcExtOXVLQ2RzYjJGa0p5d2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdKQ2duWW05a2VTY3BMbUZrWkVOc1lYTnpLQ2RzYjJGa1pXUW5LVHRjY2x4dUlDQndhV1V1WjJWMFZtRnNkV1VvS1R0Y2NseHVmU2s3WEhKY2JseHlYRzVjY2x4dVhISmNiaVFvSUhkcGJtUnZkeUFwTG05dUtDZHpZM0p2Ykd3bkxDQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQndZWEpoYkd4aGVDNXBibWwwS0NBa0tIZHBibVJ2ZHlrdWMyTnliMnhzVkc5d0tDa2dLVHRjY2x4dWZTazdYSEpjYmx4eVhHNWNjbHh1WEhKY2JpUW9JSGRwYm1SdmR5QXBMbTl1S0NkeVpYTnBlbVVuTENCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNCaWJIVnlMbk5sZENncE8xeHlYRzU5S1RzaVhTd2ljMjkxY21ObFVtOXZkQ0k2SWk5emIzVnlZMlV2SW4wPVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
