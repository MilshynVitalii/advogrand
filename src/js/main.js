$( window ).on("load", function() {
    const $links = $('.header__navigation-link');
    $links.push($('.intro__button')[0]);
    const $btnUp = $('.btn-up');
    const pxPerSec = 7;

    /* scroll*/
    $links.on('click', function(e){
        e.preventDefault();
        removeSideMenu();
        const target = $(this).attr('href');
        const pos = $(target).offset().top;
        $('html, body').animate({scrollTop: pos - 50}, 500);
        
    });

    $btnUp.on('click', function(){
        const pos = $(window).scrollTop();
        $('html, body').animate({scrollTop: 0}, pos / pxPerSec, 'linear');
    });

    $(window).on('scroll', onScroll);
    onScroll();

    function onScroll(){
        const pos = $(window).scrollTop();
        if(pos < 500){
          $btnUp.stop().fadeOut(200)
        } else {
          $btnUp.stop().fadeIn(200);
        }
    }

    /* menu-toggle */
    const $div = $('<div>').addClass('body-shadow');
    const $burger = $('.header__burger');
    const $navigation = $('.header__navigation');
    const $nav = $('.header__nav');

    $burger.on('click', function(){
        $burger.addClass('active-burger');
        $navigation.addClass('active-menu');
        const $body = $('body');
        
        const scrollWidthPx = scrollWidth() + 'px';

        if($body.css('overflow') !== 'hidden') {
            $body.css({
                overflow: 'hidden',
                paddingRight: scrollWidthPx
            });
            $nav.css('paddingRight', scrollWidthPx);
            $body.append($div);
        }
        else {
            removeSideMenu();
        }
    });

    $div.on('click', removeSideMenu);

    function removeSideMenu() {
        $burger.removeClass('active-burger');
        $navigation.removeClass('active-menu')
        $('body').removeAttr('style');
        $nav.removeAttr('style');
        $div.detach();
    }

  function scrollWidth() {
    const $div = $('<div>');
    $div.css({
      overflowY: 'scroll',
      width: '50px',
      height: '50px',
    });
    $('body').append($div);
    const width = $div.outerWidth() - $div.width();
    $div.remove();
    return width;
  }

  /* Sliders */
  $('.partners__slider').on('init', function(event, slick){
    try {
      var $items = slick.$dots.find('li');
    }
    catch(e) {
      return;
    }
    $items.addClass('partners-dots');
    $items.find('button').remove();
  });

  $('.partners__slider').on('breakpoint', function(event, slick){
    try {
      var $items = slick.$dots.find('li');
    }
    catch(e) {
      return;
    }
    $items.addClass('partners-dots');
    $items.find('button').remove();
  });

  $('.partners__slider').slick({
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: '.partners-prev',
    nextArrow: '.partners-next',
    responsive: [
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 3,
          arrows: false,
          autoplay: true,
          dots: true
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
          arrows: false,
          dots: true
        }
      },
      {
        breakpoint: 440,
        settings: {
          slidesToShow: 1,
          arrows: false,
          dots: true
        }
      }
    ]
  });


  $('.reviews__slider').slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: '.reviews-prev',
    nextArrow: '.reviews-next',
    responsive: [
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  });

  $('.reviews__nav-button').on('click', function(e){
    const $target = $(e.target)
    const id = $target.data().navId;
    $('.reviews__nav-button').removeClass('active');
    $target.addClass('active');
    $('.reviews__slider').slick('slickUnfilter');


    if(id >= 0 && id < 5) {
      $('.reviews__slider').slick('slickFilter','div[data-nav="' + id + '"]');
    }
  });

  /* youtubeframe slider */
  $('.playbutton').on('click', function() {
    const src = $(this).data('src');
    const parent = $(this).closest('.playbutton-parent');
    parent.html('');
    $('<iframe/>', {
      src,
      class: 'iframe-video',
      width: '100%',
      height: '100%'
  }).appendTo(parent);

    // const iframe = $.create("iframe");
    // iframe.attr('src', src);
    // $(this).closest('.playbutton-parent').html(iframe);
  })

  /* Form Validation */

  $('#tel').inputmask("+380 (99) 999-99-99");

  $('#main-form').validate({
    rules: {
      name: {
        required: true,
        minlength: 4
      },
      tel: {
        required: true,
        minlength: 7
      },
      textarea: {
        required: true
      }
    },
    messages: {
      name: {
        required: "Введите имя",
        minlength: jQuery.validator.format("Имя должно содержать не менее {0} букв!")
      },
      tel: {
        required: "Введите номер телефон",
        minlength: jQuery.validator.format("Не менее {0} цифр!")
      },
      textarea: {
        required: "Поле обязательно для заполнения"
      }
    },
    submitHandler: function(form, e) {
      e.preventDefault();
      $('.contacts__form-title').text('Форма отправлена, спасибо!');
      $('#main-form').remove();
      // $(form).ajaxSubmit();
    }
  });

  /* Modal window */
  $('#telmodal').inputmask("+380 (99) 999-99-99");

  $('#modal-form').validate({
    rules: {
      namemodal: {
        required: true,
        minlength: 4
      },
      telmodal: {
        required: true,
        minlength: 7
      }
    },
    messages: {
      namemodal: {
        required: "Введите имя",
        minlength: jQuery.validator.format("Имя должно содержать не менее {0} букв!")
      },
      telmodal: {
        required: "Введите номер телефон",
        minlength: jQuery.validator.format("Не менее {0} цифр!")
      }
    },
    submitHandler: function(form, e) {
      e.preventDefault();
      $('.modal-message').addClass('active');
      $('#modal-form').remove();
    }
  });

  $('#open-modal').on('click', function() {
    $('.modal').css('display', 'flex');
    $('body').css('overflow', 'hidden');
  });

  $('.js-to-close').on('click', function(e){
    if(!$(e.target).hasClass('js-to-close')) {
      return;
    }
    $('.modal').css('display', 'none');
    $('body').css('overflow', '');
  })  

});
