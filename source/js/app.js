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
