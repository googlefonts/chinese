var fontByLang = {
  'tc': {
    'About': '網站介绍',
    'NotoSans': '思源黑體',
    'NotoSerif': '思源宋體',
    'SetoFont': '瀨戶字體',
    'GenJyuuGothic': '思源柔黑體',
    'HanaMin': '花園明朝',
  },
  'sc': {
    'About': '网站介绍',
    'NotoSans': '思源黑体',
    'NotoSerif': '思源宋体',
    'HanaMin': '花园明朝',
  },
};

var BG = {
  'tc': ['#FFF','powderblue','blanchedalmond','khaki','honeydew','peachpuff'],
  'sc': ['#FFF','powderblue','honeydew','peachpuff']
};

var designerByFont = {
  'About': {'label':'Project by Yuin Chien', 'link':'http://www.yuinchien.com/'},
  'NotoSans': {'label':'Google', 'link':'https://www.google.com/get/noto/'},
  'NotoSerif': {'label':'Google / Adobe', 'link':'https://www.google.com/get/noto/'},
  'HanaMin': {'label':'GlyphWiki', 'link':'http://fonts.jp/hanazono/'},
  'SetoFont': {'label':'瀬戸のぞみ', 'link':'http://setofont.osdn.jp/'},
  'GenJyuuGothic': {'label':'自家製フォント工房', 'link':'http://jikasei.me/font/genjyuu/'},
};

var page_idx = 0;

var HOW_LABEL = {
  'tc':'號',
  'sc':'号'
};
var GANZHI_LABEL = {
  'tc':'紀',
  'sc':'纪'
};
var LUNAR_CALENDAR_LABEL = {
  'tc':'農曆',
  'sc':'农历'
};
var TERM_LABEL = {
  'tc':'節氣',
  'sc':'节气',
};

var fontListByLang = {
  'tc': Object.keys( fontByLang['tc'] ),
  'sc': Object.keys( fontByLang['sc'] ),
};

var CONFIG = {
  'lang': 'tc',
  'font': fontListByLang['tc'][0],
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

function init() {
  var hash = window.location.hash;
  var hash = hash.replace('#','').split('-');
  if(hash[0]=='sc') {
    CONFIG.lang = 'sc';
    CONFIG.font = fontListByLang['sc'][0];
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

function updateContent() {

  var pages = $('#pages');

  pages.find('.ganzhi-label').text( GANZHI_LABEL[CONFIG.lang] );
  pages.find('.lunar-calendar-cn').text( LUNAR_CALENDAR_LABEL[CONFIG.lang] );
  pages.find('.lunar-calendar-cn-1').text( LUNAR_CALENDAR_LABEL[CONFIG.lang].slice(0,1) );
  pages.find('.lunar-calendar-cn-2').text( LUNAR_CALENDAR_LABEL[CONFIG.lang].slice(1,2) );
  pages.find('.term-cn').text( TERM_LABEL[CONFIG.lang] );

  var converter = window.index.NumberToChineseWords;
  var today = CONFIG.today;
  var weekday_en = WEEKDAYS_EN[ CONFIG.weekday ];
  var weekday_cn = WEEKDAY_TW[0] + NUMBERS_CN[ CONFIG.weekday ];
  var month_en = MONTHS_EN[CONFIG.m-1];
  var month_cn = NUMBERS_CN[CONFIG.m] + '月';
  var date_cn = converter.toWords(CONFIG.d);

  pages.find('.weekday-cn').text( weekday_cn );
  pages.find('.weekday-en').text( weekday_en );
  pages.find('.weekday-en-shorten').text( weekday_en.slice(0, 3) );
  pages.find('.month-en-shorten').text( month_en.slice(0, 3) );
  pages.find('.number-date').text( CONFIG.d );
  pages.find('.number-month').text( CONFIG.m );
  pages.find('.number-year').text( CONFIG.y );

  if( date_cn.length < 2 ) {
    pages.find('.date-cn').text( date_cn + '日' );
    pages.find('.date-cn-how').text( date_cn + HOW_LABEL[CONFIG.lang] );
    pages.find('.label-date-cn-how').addClass('short-title');
  } else if ( date_cn.length>2 ) {
    pages.find('.date-cn').text( date_cn );
    pages.find('.date-cn-how').text( date_cn );
  } else {
    pages.find('.date-cn').text( date_cn + '日' );
    pages.find('.date-cn-how').text( date_cn + HOW_LABEL[CONFIG.lang] );
  }

  if( (date_cn.length + month_cn.length) == 4 ) {
    pages.find('.month-date-cn').addClass('short-title');
    pages.find('.month-date-cn').text(month_cn + date_cn + '日');
  } else if( (date_cn.length + month_cn.length)<4 ) {
    pages.find('.month-date-cn').text( '西元' + month_cn + date_cn + '日');
  } else {
    pages.find('.month-date-cn').text(month_cn + date_cn);
  }

  if(month_cn.length==2) {
    pages.find('.label-year-month').addClass('short-title');
    pages.find('.label-month').addClass('short-title');
  }

  pages.find('.month-cn').text( month_cn );
  pages.find('.number-date-two-dgt').text( ("0" + CONFIG.d).slice(-2) );
  pages.find('.number-month-two-dgt').text( ("0" + CONFIG.m).slice(-2) );
  pages.find('.number-year-two-dgt').text( CONFIG.y.toString().slice(2,5) );

  var lunar = window.LunarCalendar.solarToLunar(CONFIG.y,CONFIG.m,CONFIG.d,CONFIG.lang);

  var festival = lunar.solarFestival ? lunar.solarFestival : lunar.lunarFestival;
  pages.find('.ganzhi-day').text( lunar.GanZhiDay );
  pages.find('.ganzhi-month').text( lunar.GanZhiMonth );
  pages.find('.ganzhi-year').text( lunar.GanZhiYear );

  var labeLunarMonthDateName = lunar.lunarMonthName + lunar.lunarDayName;

  pages.find('.year-cn').text( getChineseYearText(CONFIG.y) );

  if(lunar.lunarDayName.indexOf('初') == -1 && labeLunarMonthDateName.length<6) {
    labeLunarMonthDateName += '日';
  }
  pages.find('.lunar-month-date-name').text( labeLunarMonthDateName );

  pages.find('.label-lunardate').addClass('length-'+labeLunarMonthDateName.length);

  pages.find('.lunar-year').text( getChineseYearText( lunar.lunarYear ) );

  pages.find('.zodiac').text( lunar.zodiac );

  if(lunar.term) {
    pages.find('.term').text( lunar.term );
  } else {
    pages.find('.term-related').addClass('hide');
  }

}

function updateDesignerInfoAndHash(index) {
  CONFIG.font = fontListByLang[CONFIG.lang][index-1];
  var designer = designerByFont[CONFIG.font].label;
  var link = designerByFont[CONFIG.font].link;
  $('#designer-info').html('<a href="'+link+'" target="_blank">'+designer+'</a>');
  var hash = '#'+CONFIG.lang+'-'+CONFIG.font+'-'+CONFIG.y + ("0" + CONFIG.m ).slice(-2) + ("0" + CONFIG.d).slice(-2);

  // $('#font-title').text( fontByLang[CONFIG.lang][ CONFIG.font ] );
  // $("#font-title").attr('class', 'font-'+CONFIG.font.toLowerCase());

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

  var languages = ['tc', 'sc'];

  var pages = $('<div id="pages"></div>');
  $('body').append(pages);

  var sectionTitles = Object.keys( fontByLang[CONFIG.lang] );
  for(var i=0; i<sectionTitles.length; i++) {
    var section = $('#templates-'+sectionTitles[i].toLowerCase()).clone();
    section.attr('id','section-'+sectionTitles[i].toLowerCase()).addClass('section').removeClass('templates');
    pages.append(section);
  }

  updateContent(); // TODO: MOVE TO BOTTOM

  pages.pagepiling({
    direction: 'vertical',
    verticalCentered: false,
    sectionsColor: BG[CONFIG.lang],
    scrollingSpeed: 100,
    // loopBottom: true,
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
      page_idx = index;
      console.log('afterLoad page_idx', page_idx);
      updateDesignerInfoAndHash(index);
    },
		afterRender: function(){
      console.log( 'afterRender');
      var idx = fontListByLang[CONFIG.lang].indexOf( CONFIG.font )+1;
      $.fn.pagepiling.moveTo(idx);
      page_idx = idx;
      console.log('afterRender page_idx', page_idx);
      updateDesignerInfoAndHash( idx );
    },
  });

}

$( document ).ready(function() {

  // font loader
  WebFontConfig = {
    custom: {
      families: ['Noto Serif TC:n7','GenJyuuGothic:n1,n3,n4,n5,n6,n7','Seto Font'],
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
    if(page_idx==1 && $('body').hasClass('use-font') ) {
      $.fn.pagepiling.moveTo(2);
    }
  });

});
