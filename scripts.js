$( document ).ready(function() {
  console.log( "ready!" );
  $('#pagepiling').pagepiling({
    direction: 'vertical',
    verticalCentered: false,
    sectionsColor: ['#ddd','#bbb','#999','#ccc','#eee'],
    scrollingSpeed: 100,
    navigation: {
      'textColor': '#000',
      'bulletsColor': '#000',
      'position': 'bottomleft',
      'tooltips': ['section1', 'section2', 'section3', 'section4']
    },
    onLeave: function(index, nextIndex, direction){
      console.log('onLeave');
    },
		afterLoad: function(anchorLink, index){
      console.log('afterLoad');
    },
		afterRender: function(){
      console.log('afterRender');
    },
  });
});
