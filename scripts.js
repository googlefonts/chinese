var fontByLang = {
  'tw': {
    'NotoSans': '思源黑體',
    'NotoSerif': '思源宋體',
    'SetoFont': '瀨戶字體',
    'HanaMin': '花園明朝',
    'GenJyuu': '思源柔黑體',
    'About': '網站介绍',
  },
  'cn': {
    'NotoSans': '思源黑体',
    'NotoSerif': '思源宋体',
    'HanaMin': '花园明朝',
    'About': '网站介绍',
  },
};

var designerByFont = {
  'NotoSans': '谷歌、奧多比',
  'NotoSerif': '谷歌、奧多比',
  'HanaMin': '上地宏一',
  'SetoFont': '瀬戸のぞみ',
  'GenJyuu': '自家製フォント工房'
};

var fontListByLang = {
  'tw': Object.keys( fontByLang['tw'] ),
  'cn': Object.keys( fontByLang['cn'] ),
};

var CONFIG = {
  'lang': 'tw',
  'font': fontListByLang['tw'][0],
};

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

  createPages();
  return;
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

  var titles = Object.values( fontByLang[CONFIG.lang] );
  titles.push('網站介紹');

  pages.pagepiling({
    direction: 'vertical',
    verticalCentered: false,
    sectionsColor: ['#BAFFF0','#999','#ccc','#FFFBC2','#FFD1C5'],
    scrollingSpeed: 100,
    navigation: {
      'textColor': '#000',
      'bulletsColor': '#000',
      'position': 'bottomleft',
      'tooltips': titles
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


});
