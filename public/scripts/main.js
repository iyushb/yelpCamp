//AOS effects(on-scroll animation)
$(".inner-camp-container:odd").attr({
    'data-aos': 'zoom-in-right',
    'data-aos-duration': '1000',
    'data-aos-once': "true"
});
$('.inner-camp-container:even').attr({
    'data-aos': 'flip-left',
    'data-aos-duration': '1000',
    'data-aos-once': "true"
});
AOS.init();


var active = $('.show-container-left ul li');

$(active).on('click', function () {
    $(active).each(function (index) {
        $(this).removeClass('active');
    });
    $(this).addClass('active');
});