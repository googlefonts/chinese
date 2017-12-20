(function(){

  var MARGIN_LEFT = 24;
  var MARGIN_TOP = 20;
  var GUTTER = 20;
  var COLOR = '#FF5252';

  window.onload = function() {
    function createHorzGrid(style) {
      var el = document.createElement("div");
      el.setAttribute("style", style + "position: absolute; left: 0; right: 0; background: "+COLOR+"; height: 1px;");
      return el;
    }
    function createVertGrid(style) {
      var el = document.createElement("div");
      el.setAttribute("style", style + "position: absolute; top: 0; bottom: 0; background: "+COLOR+"; width: 1px;");
      return el;
    }

    var body = document.getElementsByTagName("body")[0];
    var grid = document.createElement("div");
    grid.setAttribute("style","display: block; position: fixed; left: 0; top: 0; right: 0; bottom: 0; z-index: 1000; pointer-events: none;");
    body.appendChild(grid);

    document.onkeyup = function(event){
      if(event.key=='G') {
        if(grid.style.display=='block') {
          grid.style.display = 'none';
        } else {
          grid.style.display = 'block';
        }
      }
    };

    var el = createHorzGrid('top: '+MARGIN_TOP+'px;');
    grid.appendChild(el);
    var el = createHorzGrid('bottom: '+MARGIN_TOP+'px;');
    grid.appendChild(el);
    var el = createVertGrid('left: '+MARGIN_LEFT+'px;');
    grid.appendChild(el);
    var el = createVertGrid('right: '+MARGIN_LEFT+'px;');
    grid.appendChild(el);


    var columns = document.createElement("div");
    columns.setAttribute('id', '_columns');
    columns.setAttribute("style","display: flex; flex-direction: row; position: absolute; top: 0; bottom: 0; right: "+(MARGIN_LEFT-GUTTER/2)+"px; left: "+(MARGIN_LEFT-GUTTER/2)+"px;");
    grid.appendChild(columns);
    for(var i=0; i<12; i++) {
      var col = document.createElement("div");
      col.setAttribute("style","flex: 1; height:100%; background:"+COLOR+"; opacity:.2; margin: 0 "+GUTTER/2+"px;");
      col.setAttribute("id", '_col'+i);
      columns.appendChild(col);
    }

    var handleMatchMedia = function (mediaQuery) {
      console.log('handleMatchMedia', mediaQuery.matches);
      var display = 'block';
      if (mediaQuery.matches) {

      } else {
        display = 'none';
      }
      for(var i=0; i<4; i++) {
        document.getElementById('_col'+i).style.display = display;
      }
    }
    var mql = window.matchMedia('all and (min-width: 1080px)');
    handleMatchMedia(mql); //Execute on load

    window.onresize = function(event) {
      handleMatchMedia(mql);
    };
  }

})();
