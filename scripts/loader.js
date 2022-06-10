var ttt = {
    lang : 'en',
    path : '',
    text : {
        pl : {
            title : 'Kółko i krzyżyk',
            alternative : 'Aby zagrać w grę musisz posiadać nową wersję przeglądarki (rekomendowane przeglądarki: firefox lub chrome)',
            draw : 'Remis.',
            you_win : 'Gratuluje wygraleś!',
            cpu_win : 'Przegrałeś!',
            play_again : 'Zagraj jeszcze raz!',
            level : 'Poziom:',
            you : 'TY',
            cpu : 'CPU'
        },
        en : {
            title : 'Tic-tac-toe',
            alternative : 'In order to play with this game, You have to install a new web browser (recommend: firefox or chrome)',
            draw : 'Draw.',
            you_win : 'Congratulations!',
            cpu_win : 'You lose!',
            play_again : 'Play again!',
            level : 'Level:',
            you : 'YOU',
            cpu : 'CPU'
        }
    },
    color :{
        theme_logo_blue: '#b1ccdd',
        theme_black: '#050505',
        theme_light_black: '#191919',
        theme_logo_red: '#ff5050',
        theme_light_blue: '#d9d9d9',
        theme_a_blue:'#174f82'
    },
    settings : {
        sizeLoader : 1,
        ticPadding : 4,
        ticWidth : 2,
        animateCrossPoints : 20
    },
    score :{
        you: 0,
        cpu: 0
    },
    action :{
        rows : 9,
        cols : 9,
        len : 5,
        max_level : 3,
        max_depth : 2,
        inf : 1000000,
        human : 1,
        blank : 0,
        comp  : -1,
        who_first : 1
    }
};

window.requestAnimationFrame = (function() {
        return window.requestAnimationFrame
            || window.webkitRequestAnimationFrame
            || window.mozRequestAnimationFrame
            || window.oRequestAnimationFrame
            || window.msRequestAnimationFrame
            || function(callback, element) {
                return window.setTimeout(
                    function() {
                        callback(+new Date);
                    }, 1000 / 60
                );
            };
})();


if (Modernizr.canvas && Modernizr.webworkers ){

    window.addEventListener("load", function() {
        if(typeof  lang !==  'undefined' ){
            ttt.lang =  lang;
        }
        if(typeof pathToTtt !==  'undefined' ){
            ttt.path = pathToTtt;
        }


        var jewelProto = document.getElementById("square-size");
        var rect = jewelProto.getBoundingClientRect();
        ttt.settings.ticSize = rect.width;
        display.initialize( ttt );

    }, false);

}else{
    alert(  ttt.text['pl'].alternative +  " / " +    ttt.text['en'].alternative );
}
