var fontByLang = {
  'tw': {
    'About': '網站介绍',
    'NotoSans': '思源黑體',
    'NotoSerif': '思源宋體',
    'SetoFont': '瀨戶字體',
    'HanaMin': '花園明朝',
    'GenJyuu': '思源柔黑體',
  },
  'cn': {
    'About': '网站介绍',
    'NotoSans': '思源黑体',
    'NotoSerif': '思源宋体',
    'HanaMin': '花园明朝',
  },
};

var designerByFont = {
  'About': '',
  'NotoSans': '谷歌、奧多比',
  'NotoSerif': '谷歌、奧多比',
  'HanaMin': '上地宏一',
  'SetoFont': '瀬戸のぞみ',
  'GenJyuu': '自家製フォント工房',
};

var fontListByLang = {
  'tw': Object.keys( fontByLang['tw'] ),
  'cn': Object.keys( fontByLang['cn'] ),
};

var CONFIG = {
  'lang': 'tw',
  'font': fontListByLang['tw'][0],
};

var WEEKDAYS_EN = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var NUMBERS_CN = ['日','一','＝','三','四','五','六','七','八','九','十','十一','十二'];
var MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var WEEKDAY_TW = ['星期','禮拜'];
var WEEKDAY_CN = ['星期','礼拜'];

var BG = {
  'tw': ['#FFF','#FFFD00','beige','lemonchiffon','honeydew','mistyrose',],
  'cn': ['#FFF','#FFFD00','beige','lemonchiffon']
}

var calendars = {};

function init() {
  var hash = window.location.hash;
  var hash = hash.replace('#','').split('-');
  if(hash[0]=='cn') {
    CONFIG.lang = 'cn';
    CONFIG.font = fontListByLang['cn'][0];
  }
  if(hash.length>1) {
    if(fontByLang[CONFIG.lang][hash[1]]) {
      CONFIG.font = hash[1];
    }
  }
  getDateInfo();

  createPages();
  return;
}

function getDateInfo() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth();
  var yyyy = today.getFullYear();

  console.log(dd,mm,yyyy);

  // today = mm + '/' + dd + '/' + yyyy;
  // console.log(today, today);
  var weekday_en = WEEKDAYS_EN[ today.getDay() ];
  var weekday_cn = WEEKDAY_TW[0] + NUMBERS_CN[ today.getDay() ];
  var month_en = MONTHS_EN[mm];
  var month_cn = NUMBERS_CN[mm+1] + '月';
  console.log('MONTHS_EN', month_en);
  $('.weekday-cn').text( weekday_cn );
  $('.weekday-en').text( weekday_en );
  $('.number-date').text( dd );
  $('.month-en').text( month_en );
  $('.month-cn').text( month_cn );
  $('.number-year').text( yyyy );
  // Here's some magic to make sure the dates are happening this month.
    var thisMonth = moment().format('YYYY-MM');

    calendars.clndr1 = $('.cal1').clndr({
      // events: eventArray,
      multiDayEvents: {
        singleDay: 'date',
        endDate: 'endDate',
        startDate: 'startDate'
      },
      template: $('#clndr-template').html(),
    });

}

function updateDesignerInfoAndHash(index) {
  CONFIG.font = fontListByLang[CONFIG.lang][index-1];
  var designer = designerByFont[CONFIG.font];
  $('#designer-info').text(designer);

  var hash = '#'+CONFIG.lang+'-'+CONFIG.font;
  if(history.pushState) {
    history.pushState(null, null, hash);
  }
  else {
    location.hash = hash;
  }
}

function createPages() {
  $('#headerbar .lang').removeClass('selected');
  $('#headerbar .lang[content="'+CONFIG.lang+'"]').addClass('selected');
  $('#pages').remove();
  $('#pp-nav').remove();

  var pages = $('#pages-'+CONFIG.lang).clone();
  var pages = pages.attr('id','pages').attr('class','');
  pages.appendTo('body');
  pages.find('> div').addClass('section');

  pages.pagepiling({
    direction: 'vertical',
    verticalCentered: false,
    sectionsColor: BG[CONFIG.lang],
    scrollingSpeed: 100,
    navigation: {
      'textColor': '#000',
      'bulletsColor': '#000',
      'position': 'bottomleft',
      'tooltips': Object.values( fontByLang[CONFIG.lang] )
    },
    onLeave: function(index, nextIndex, direction){
      console.log('onLeave');
    },
		afterLoad: function(anchorLink, index){
      console.log('afterLoad');
      updateDesignerInfoAndHash(index);
    },
		afterRender: function(){
      console.log( 'afterRender');
      var idx = fontListByLang[CONFIG.lang].indexOf( CONFIG.font )+1;
      $.fn.pagepiling.moveTo(idx);
      updateDesignerInfoAndHash( idx );
    },
  });
}

$( document ).ready(function() {

  // font loader
  WebFontConfig = {
    custom: {
      families: ['Noto Serif TC:n7'],
      urls: ['styles.css'],
    },
    loading: function() {
      console.log('loading');
    },
    active: function() {
      console.log('active');
      $('body').removeClass('loading');
    },
    // inactive: function() {
    //   console.log('inactive');
    // },
    // fontloading: function(familyName, fvd) {
    //   console.log('fontloading');
    // },
    // fontactive: function(familyName, fvd) {
    //   console.log('fontactive');
    // },
    // fontinactive: function(familyName, fvd) {
    //   console.log('fontinactive');
    // }
  };
  WebFont.load(WebFontConfig);

  // init
  init();

  // init headerbar
  $('#headerbar .lang').click(function(ev){
    var lang = $(ev.target).attr('content');
    if(lang==CONFIG.lang) { return; }
    CONFIG.lang = lang;
    CONFIG.font = fontListByLang[lang][0];
    createPages();
  });

  $('#button-use, #headerbar a').click(function(){
    $('body').toggleClass('use-font');
  });

});
