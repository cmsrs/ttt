importScripts('game.logic.worker.js' );

self.addEventListener('message', function(e) {

    if( e.data.cmd == 'play'  ){
        var move = logic.play( e.data.matrix  );
        self.postMessage( { cmd : 'play', move : move});
        
    }else if(  e.data.cmd == 'init' ){
        logic.init( e.data.conf );
    }
}, false);

