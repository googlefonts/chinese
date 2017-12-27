var fontByLang = {
  'tw': {
    'About': '網站介绍',
    'NotoSans': '思源黑體',
    'NotoSerif': '思源宋體',
    'SetoFont': '瀨戶字體',
    'HanaMin': '花園明朝',
    'GenJyuuGothic': '思源柔黑體',
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

var GANZHI_LABEL = {
  'tw':'紀',
  'cn':'纪'
};

var fontListByLang = {
  'tw': Object.keys( fontByLang['tw'] ),
  'cn': Object.keys( fontByLang['cn'] ),
};

var CONFIG = {
  'lang': 'tw',
  'font': fontListByLang['tw'][0],
  'y': null,
  'm': null,
  'd': null,
  'weekday': null,
  'today': null,
};
// '〇'
var WEEKDAYS_EN = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

var NUMBERS_CN = ['日','一','二','三','四','五','六','七','八','九','十','十一','十二'];
var NUMBERS_YEAR_CN = ['零','一','二','三','四','五','六','七','八','九','十'];
var MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var WEEKDAY_TW = ['星期','禮拜'];
var WEEKDAY_CN = ['星期','礼拜'];


var BG = {
  'tw': ['#FFF','powderblue','blanchedalmond','khaki','honeydew','peachpuff'],
  'cn': ['#FFF','powderblue','beige','lemonchiffon']
};

var DARK_THEMES = {
  'midnightblue':true,
};


var calendars = {};

function init() {
  var hash = window.location.hash;
  var hash = hash.replace('#','').split('-');
  if(hash[0]=='cn') {
    CONFIG.lang = 'cn';
    CONFIG.font = fontListByLang['cn'][0];
    $('body').attr('lang', CONFIG.lang);
  }
  if(hash.length>1) {
    if(fontByLang[CONFIG.lang][hash[1]]) {
      CONFIG.font = hash[1];
    }
  }

  try {
    CONFIG.y = parseInt( hash[2].slice(0, 4) );
    CONFIG.m = parseInt( hash[2].slice(4, 6) );
    CONFIG.d = parseInt( hash[2].slice(6, 8) );
    CONFIG.today = new Date(Date.UTC(CONFIG.y, CONFIG.m-1, CONFIG.d, 14, 0, 0));
    CONFIG.weekday = CONFIG.today.getDay();
  } catch(e) {
    console.log('error',e);

    CONFIG.today = new Date();
    CONFIG.d = CONFIG.today.getDate();
    CONFIG.m = CONFIG.today.getMonth() + 1;
    CONFIG.y = CONFIG.today.getFullYear();
    CONFIG.weekday = CONFIG.today.getDay();
  }

  console.log('CONFIG', CONFIG);

  createPages();
  return;
}


function getChineseYearText(y) {
  y = y.toString();
  var year = '';
  for(var i=0; i<y.length; i++) {
    year += NUMBERS_YEAR_CN[ y[i] ];
  }
  return year;
}

function getDateInfo() {

  var pages = $('#pages');

  pages.find('.ganzhi-label').text( GANZHI_LABEL[CONFIG.lang] );

  var today = CONFIG.today;
  var weekday_en = WEEKDAYS_EN[ CONFIG.weekday ];
  var weekday_cn = WEEKDAY_TW[0] + NUMBERS_CN[ CONFIG.weekday ];
  var month_en = MONTHS_EN[CONFIG.m-1];
  var month_cn = NUMBERS_CN[CONFIG.m] + '月';
  var converter = window.index.NumberToChineseWords;

  pages.find('.weekday-cn').text( weekday_cn );
  pages.find('.weekday-en').text( weekday_en );
  pages.find('.weekday-en-shorten').text( weekday_en.slice(0, 3) );
  pages.find('.number-date').text( CONFIG.d );

  pages.find('.number-date-cn').text( converter.toWords(CONFIG.d) +'日' );

  pages.find('.month-en').text( month_en );
  pages.find('.month-cn').text( month_cn );
  pages.find('.number-year').text( CONFIG.y );
  pages.find('.number-month').text( CONFIG.m );

  var lunar = CONFIG.lang=='tw'
    ? window.LunarCalendarTraditional.solarToLunar(CONFIG.y,CONFIG.m,CONFIG.d)
    : window.LunarCalendar.solarToLunar(CONFIG.y,CONFIG.m,CONFIG.d);

  var festival = lunar.solarFestival ? lunar.solarFestival : lunar.lunarFestival;
  pages.find('.ganzhi-day').text( lunar.GanZhiDay );
  pages.find('.ganzhi-month').text( lunar.GanZhiMonth );
  pages.find('.ganzhi-year').text( lunar.GanZhiYear );
  pages.find('.lunar-day').text( lunar.lunarDay );
  if(lunar.lunarDayName.indexOf('初') !== -1) {
    pages.find('.lunar-dayname').text( lunar.lunarDayName );
  } else {
    pages.find('.lunar-dayname').text( lunar.lunarDayName + '日');
  }

  pages.find('.lunar-month').text( lunar.lunarMonth );
  pages.find('.lunar-monthname').text( lunar.lunarMonthName );
  pages.find('.lunar-year').text( getChineseYearText( lunar.lunarYear ) );

  pages.find('.zodiac').text( lunar.zodiac );

  pages.find('.term').text( lunar.term );
  pages.find('.festival').text( festival ? festival : ''  );

    // for(var i=0; i<month_cn.length; i++) {
    //   $('.section-notosans .blocks').append('<div class="grid-18">'+month_cn[i]+'</div>');
    // }
    // var date_cn = '二十五';
    // for(var i=0; i<date_cn.length; i++) {
    //   $('.section-notosans .blocks').append('<div class="grid-18">'+date_cn[i]+'</div>');
    // }
}

function updateDesignerInfoAndHash(index) {
  CONFIG.font = fontListByLang[CONFIG.lang][index-1];
  var designer = designerByFont[CONFIG.font];
  $('#designer-info').text(designer);
  var hash = '#'+CONFIG.lang+'-'+CONFIG.font+'-'+CONFIG.y + ("0" + CONFIG.m ).slice(-2) + ("0" + CONFIG.d).slice(-2);

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

  var pages = $('<div id="pages"></div>');
  $('body').append(pages);

  var sectionTitles = Object.keys( fontByLang[CONFIG.lang] );
  for(var i=0; i<sectionTitles.length; i++) {
    var section = $('#templates-'+sectionTitles[i].toLowerCase()).clone();
    section.attr('id','section-'+sectionTitles[i].toLowerCase()).addClass('section').removeClass('templates');
    pages.append(section);
  }

  getDateInfo(); // TODO: MOVE TO BOTTOM

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
      families: ['Noto Serif TC:n7','GenJyuuGothic:n1,n3,n4,n5,n6,n7'],
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

  init();

  // init headerbar
  $('#headerbar .lang').click(function(ev){
    var lang = $(ev.target).attr('content');
    if(lang==CONFIG.lang) { return; }
    CONFIG.lang = lang;
    CONFIG.font = fontListByLang[lang][0];
    $('body').attr('lang', CONFIG.lang);
    createPages();
  });

  $('#button-use, #headerbar a').click(function(){
    $('body').toggleClass('use-font');
  });

});
