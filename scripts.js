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

var ZADIAC_TW = {
  '鼠':'鼠',
  '牛':'牛',
  '虎':'虎',
  '兔':'兔',
  '龙':'龍',
  '蛇':'蛇',
  '马':'馬',
  '羊':'羊',
  '猴':'猴',
  '鸡':'雞',
  '狗':'狗',
  '猪':'豬',
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

  var today = CONFIG.today;
  var weekday_en = WEEKDAYS_EN[ CONFIG.weekday ];
  var weekday_cn = WEEKDAY_TW[0] + NUMBERS_CN[ CONFIG.weekday ];
  var month_en = MONTHS_EN[CONFIG.m-1];
  var month_cn = NUMBERS_CN[CONFIG.m] + '月';
  var converter = window.index.NumberToChineseWords;

  $('.weekday-cn').text( weekday_cn );
  $('.weekday-en').text( weekday_en );
  $('.weekday-en-shorten').text( weekday_en.slice(0, 3) );
  $('.number-date').text( CONFIG.d );

  $('.number-date-cn').text( converter.toWords(CONFIG.d) +'日' );

  $('.month-en').text( month_en );
  $('.month-cn').text( month_cn );
  $('.number-year').text( CONFIG.y );
  $('.number-month').text( CONFIG.m );

  // for(var i=0; i<month_cn.length; i++) {
  //   $('.section-notosans .blocks').append('<div class="grid-18">'+month_cn[i]+'</div>');
  // }
  // var date_cn = '二十五';
  // for(var i=0; i<date_cn.length; i++) {
  //   $('.section-notosans .blocks').append('<div class="grid-18">'+date_cn[i]+'</div>');
  // }

  var lunar = window.LunarCalendar.solarToLunar(CONFIG.y,CONFIG.m,CONFIG.d);
  var festival = lunar.solarFestival ? lunar.solarFestival : lunar.lunarFestival;
  $('.ganzhi-day').text( lunar.GanZhiDay );
  $('.ganzhi-month').text( lunar.GanZhiMonth );
  $('.ganzhi-year').text( lunar.GanZhiYear );
  $('.lunar-day').text( lunar.lunarDay );
  if(lunar.lunarDayName.indexOf('初') !== -1) {
    $('.lunar-dayname').text( lunar.lunarDayName );
  } else {
    $('.lunar-dayname').text( lunar.lunarDayName + '日');
  }

  $('.lunar-month').text( lunar.lunarMonth );
  $('.lunar-monthname').text( lunar.lunarMonthName );
  $('.lunar-year').text( getChineseYearText( lunar.lunarYear ) );

  console.log('123', CONFIG.lang);
  if(CONFIG.lang=='tw') {
    $('.zodiac').text( ZADIAC_TW[lunar.zodiac] );
  } else {
    $('.zodiac').text( lunar.zodiac );
  }

  $('.term').text( lunar.term );
  $('.festival').text( festival ? festival : ''  );

  console.log( lunar );
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

  getDateInfo();

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
    createPages();
  });

  $('#button-use, #headerbar a').click(function(){
    $('body').toggleClass('use-font');
  });

});
