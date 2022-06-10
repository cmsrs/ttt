display = (function() {
    var
        lang,
        cols,
        rows,
        ticSize,
        ticPadding,
        ticWidth,
        sizeLoader,
        theme_black,
        theme_logo_red,

        divWrapLevel,
        divLevel,
        levelTextPadding,
        levelLengthCircle,
        boardElement,
        divThink,
        divDisplayText,
        matrix,
        ctx,
        anim,
        canvas,

        t,
        points1,
        points2,
        animateCrossPoints

        ;


    function createBackground( bgctx ){
        var x_start = 0;
        var y_itart = 0;

        matrix = [];
        for (var x=0;x<cols;x++) {
            matrix[x] = [];
            for (var y=0;y<rows;y++) {
                x_start = x * ticSize;
                y_start = y * ticSize;
                bgctx.fillStyle =( ((x+y) % 2) ? ttt.color.theme_light_blue : '#FFFFFF' );
                bgctx.fillRect( x_start, y_start, ticSize, ticSize);
                matrix[x][y] = ttt.action.blank;
            }
        }
    }

    function drawTic( x_p, y_p, tic, style, isAnim ){
        for (var x=0;x<cols;x++) {
            for (var y=0;y<rows;y++) {
                if( (y ==  y_p) && ( x == x_p )  ){
                    x_start = x * ticSize;
                    y_start = y * ticSize;
                    (tic == 1) ? drawO(ctx, x_start, y_start, style) : drawX(ctx, x_start, y_start, style, isAnim);
                }
            }
        }
    }
    function drawLevelCircle( lctx,  numberLevel ){
        var r = Math.floor(levelLengthCircle/2);
        lctx.beginPath();
        lctx.fillStyle =  ( parseInt(numberLevel) == ttt.action.max_depth  ) ? ttt.color.theme_light_blue : '#FFFFFF';
        lctx.arc( r, r , r, 0, 2 * Math.PI, false);
        lctx.lineWidth =  2;
        lctx.strokeStyle = theme_light_black;
        lctx.stroke();
        lctx.fill();
    }
    function drawLevelNumber( lctx, numberLevel ){
        var x_start_point;
        var x_stop_point;
        var y_start_point = Math.floor(levelLengthCircle/4);
        var y_stop_point = Math.floor(levelLengthCircle*3/4);

        x_start_point = 0;
        lctx.beginPath();
        for(var i=0; i<numberLevel; i++ ){
            x_start_point = Math.floor(levelLengthCircle/2) + i*levelTextPadding -  numberLevel * Math.floor(levelTextPadding/3);
            x_stop_point = x_start_point;

            lctx.moveTo( x_start_point , y_start_point );
            lctx.lineTo( x_stop_point  , y_stop_point  );
            lctx.lineWidth = 1;
            lctx.strokeStyle = theme_light_black;
        }
        lctx.stroke();
    }

    function drawO( octx, start_x, start_y, style ){
        var half = Math.floor(ticSize/2);
        var r =  half - ticPadding;

        octx.beginPath();
        octx.arc(  start_x + half, start_y + half,  r  , 0, 2 * Math.PI, false);
        octx.lineWidth =  ticWidth;
        octx.strokeStyle =( (style == 'black') ?  theme_black :  theme_logo_red );
        octx.stroke();

    }

    function drawX( xctx,  start_x, start_y, style, isAnim  ){
        var endP = ticSize - ticPadding;
        var x_start_point = start_x + ticPadding;
        var x_stop_point = start_x + endP;
        var y_start_point =  start_y +  ticPadding;
        var y_stop_point =  start_y + endP;

        xctx.lineWidth =  ticWidth;
        xctx.strokeStyle =( (style == 'black') ?  theme_black :  theme_logo_red );

        if(isAnim === true){
          wrapAnimateCross(x_start_point, x_stop_point, y_start_point, y_stop_point);
        }else{
          //without anim
          xctx.beginPath();
          xctx.moveTo( x_start_point , y_start_point );
          xctx.lineTo( x_stop_point  , y_stop_point  );
          xctx.moveTo( x_start_point , y_stop_point  );
          xctx.lineTo( x_stop_point  , y_start_point );
          xctx.stroke();
        }


    }

    function wrapAnimateCross( x_start_point, x_stop_point, y_start_point, y_stop_point )
    {
      var line1 = [{x:x_start_point, y:y_start_point}, {x: x_stop_point, y:y_stop_point}];
      var line2 = [{x:x_start_point, y:y_stop_point}, {x:x_stop_point, y:y_start_point}];

      t = 1;
      points1 = [];
      points1 = calcWaypoints( line1[0], line1[1] );
      points2 = [];
      points2 = calcWaypoints( line2[0], line2[1] );

      requestAnimationFrame(animateCross);
    }

    function calcWaypoints(pt0, pt1) {
        var waypoints = [];
        var dx = pt1.x - pt0.x;
        var dy = pt1.y - pt0.y;
        for (var j = 0; j <= animateCrossPoints; j++) {
            var x = pt0.x + dx * j / animateCrossPoints;
            var y = pt0.y + dy * j / animateCrossPoints;
            waypoints.push({
                x: x,
                y: y
            });
        }
        return waypoints;
    }

    function animateCross() {
        if (t > points1.length - 1) {
          return false;
        }
        if (t > points2.length - 1) {
          return false;
        }

        ctx.beginPath();
        ctx.moveTo(points1[t - 1].x, points1[t - 1].y);
        ctx.lineTo(points1[t].x, points1[t].y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(points2[t - 1].x, points2[t - 1].y);
        ctx.lineTo(points2[t].x, points2[t].y);
        ctx.stroke();

        t++;
        requestAnimationFrame(animateCross);
    }

    function createLevelCanvas( level ){
        var lCanvas = document.createElement("canvas");
        lCanvas.width = levelLengthCircle;
        lCanvas.height = levelLengthCircle;
        lCanvas.className = "circle";
        lCanvas.style.marginRight =   Math.floor(ticSize/2)+ "px";
        var lctx = lCanvas.getContext("2d");
        drawLevelCircle( lctx, level );
        drawLevelNumber( lctx, level );
        return lCanvas;
    }


    function setup( ttt ) {
        lang = ttt.lang,
        cols = ttt.action.cols,
        rows = ttt.action.rows,
        ticSize = ttt.settings.ticSize,
        ticPadding = ttt.settings.ticPadding,
        ticWidth = ttt.settings.ticWidth,
        theme_black = ttt.color.theme_black,
        theme_logo_red = ttt.color.theme_logo_red,
        theme_light_black = ttt.color.theme_light_black,
        sizeLoader = ttt.settings.sizeLoader,
        animateCrossPoints = ttt.settings.animateCrossPoints
        ;


        canvas = document.createElement("canvas");
        canvas.id = "main_canvas";
        canvas.width = cols * ticSize;
        canvas.height = rows * ticSize;
        ctx = canvas.getContext("2d");
        createBackground( ctx );


        boardElement = document.getElementById("game-board");
        boardElement.appendChild(canvas);

        divThink = document.getElementById('think');
        divThink.style.height = (sizeLoader * ticSize) +"px";

        var widthGame = cols  * ticSize;

        var el_h1 =  document.getElementsByTagName('h1');
        var el_header =  document.getElementsByTagName('header');

        if(  el_header.length   ){
            el_header[0].style.width = widthGame + "px";
            el_header[0].style.height = ticSize + "px";
        }
        //el_h1[0].style.width = widthGame + "px";
        document.getElementById('score').style.width = widthGame + "px";


        divWrapLevel = document.getElementById('wrapLevel');
        divLevel = document.createElement('div');
        divLevel.id  = 'level';
        divWrapLevel.appendChild(divLevel);


        levelLengthCircle =  Math.floor( ticSize/2 );

        divLevel.style.marginLeft = "3px";
        divLevel.style.width = widthGame + "px";
        divLevel.style.height = levelLengthCircle  + "px";

        var divLevelText = document.createElement("div");
        divLevelText.textContent = ttt.text[lang].level;
        divLevelText.style.marginRight = levelLengthCircle + "px";
        divLevel.appendChild( divLevelText  );

        levelTextPadding = Math.floor( ticSize/8 );

        //console.log( el_h1[0]  );
        //el_h1[0].textContent = 'trstttt';
        //
        if(  el_h1.length  ){
            el_h1[0].textContent = ttt.text[lang].title;
        }
        document.getElementById('cpu').textContent = ttt.text[lang].cpu;
        document.getElementById('you').textContent = ttt.text[lang].you;
    }

    function displayFinish(  eval ){
        divDisplayText = document.createElement("div");
        divDisplayText.id = "display_text";
        divDisplayText.style.width = (cols  * ticSize ) + "px";
        divDisplayText.style.paddingTop =  '3px';
        divThink.appendChild(  divDisplayText );
        if(  eval['score'] == 0  ){
            divDisplayText.textContent =  ttt.text[lang].draw;
        }else if( eval['win'] != 0  ){
            for( var i=0; i<eval['win_xy'].length; i++  ){
                drawTic( eval['win_xy'][i].x, eval['win_xy'][i].y,  eval['win'] , 'red', false );
            }
            if(eval['win'] == 1){
                ttt.score.you += 1;
                divDisplayText.textContent =  ttt.text[lang].you_win;
            }
            if(eval['win'] == -1){
                ttt.score.cpu += 1;
                divDisplayText.textContent =  ttt.text[lang].cpu_win;
            }
        }
    }

    function displayScore( ttt_in ){
        document.getElementById('you_score').textContent = ttt_in.score.you;
        document.getElementById('cpu_score').textContent = ttt_in.score.cpu;
    }

    function startThink(){
        var marginLeft = Math.floor((cols -  sizeLoader)/2);

        anim = document.createElement("div");
        anim.id = "anim";
        anim.style.marginLeft = marginLeft * ticSize +'px' ;

        divThink.appendChild( anim );
        requestAnimationFrame(animate);
    }
    function stopThink(){
        divThink.removeChild( anim );
    }
    function onError(e) {
        document.getElementById('error').textContent = [
        'ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message].join('');
    }

    function animate(time) {
        var r = (sizeLoader * ticSize/2) * 0.8;
        anim.style.left = (r + Math.cos(time /30) * r) + "px";
        anim.style.top = ( r + Math.sin(time /30) * r) + "px";

        requestAnimationFrame(animate);
    }

    function initialize( ttt ) {
        setup( ttt  );
        divThink.textContent = '';
        displayScore( ttt );

        var think = 0;
        var play_again = 0;
        var worker = new Worker( ttt.path + 'scripts/do.work.js');
        worker.postMessage({cmd:'init', conf: ttt.action });

        worker.addEventListener('message', function(e) {
            //console.log( e.data  );
            if( e.data.cmd == 'play'  ){
                var move =   e.data.move;
                if( move.is_finish != 0 ){

                    stopThink();
                    displayFinish( move.is_finish );
                    displayScore( ttt );

                    setTimeout(function(){
                        boardElement.removeChild(canvas);
                        divWrapLevel.removeChild(divLevel);
                        ttt.action.who_first = -1*ttt.action.who_first;
                        worker.terminate();
                        initialize( ttt  );
                    },3000);

                }else{
                    drawTic( move.x, move.y, move.value, 'black', true );
                    matrix[move.x][move.y] = ttt.action.comp;
                    stopThink();
                    think = 0;
                }
            }
        }, false);


        if( ttt.action.who_first == ttt.action.comp ){
            think = 1;
            startThink();
            worker.postMessage({cmd:'play', matrix: matrix});
        }

        for(var i=1; i<=ttt.action.max_level; i++ ){
            var lCanvas = createLevelCanvas( i );
            lCanvas.id = 'level_'+i;
            lCanvas.addEventListener("click", function(e){
                boardElement.removeChild(canvas);
                divWrapLevel.removeChild(divLevel);
                var level = parseInt( this.id.match( /\d+$/ ) );
                ttt.action.max_depth = level;
                worker.terminate();
                initialize( ttt  );
            }, false);

            divLevel.appendChild(lCanvas);
        }

        canvas.addEventListener("click", function(e){
            if( think == 1  ){
                return false;
            }

            rect = canvas.getBoundingClientRect()

            relX = e.clientX - rect.left;
            relY = e.clientY - rect.top;

            ticX = Math.floor( (relX / rect.width) * cols);
            ticY = Math.floor( (relY / rect.width) * rows);
            if(  matrix[ticX][ticY] != 0 ){
                return false;
            }
            startThink();
            think = 1;

            drawTic( ticX, ticY, ttt.action.human, 'black', true );
            matrix[ticX][ticY] = ttt.action.human;


            worker.postMessage({cmd:'play', matrix: matrix});

        }, false);

        worker.addEventListener('error', onError, false);

    }

    return {
        initialize : initialize
    }
})();
