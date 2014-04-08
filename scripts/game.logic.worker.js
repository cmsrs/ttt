logic = (function() {
    var 
        cols ,
        rows ,
        len ,
        max_depth  ,
        inf ,
        human ,
        blank ,
        comp ;

    function init( conf ){
        cols = conf.cols;
        rows = conf.rows;
        len = conf.len;
        max_depth  = conf.max_depth;
        inf =  conf.inf;
        human =  conf.human;
        blank = conf.blank;
        comp = conf.comp;
    }


    function copyMarix( matrix ){
        var out = [];
        for (var x=0;x<cols;x++) {
            out[x] = [];
            for (var y=0;y<rows;y++) {
                out[x][y] = matrix[x][y];
            }
        }
        return out;
    }

    function possibleMoves(matrix, player){
        var k=0;
        var out = [];
        for (var x=0;x<cols;x++) {
            for (var y=0;y<rows;y++) {
                if( blank ==  matrix[x][y] ){
                    var matrix_tmp = copyMarix( matrix );
                    matrix_tmp[x][y] = player;
                    out[k] = matrix_tmp; 
                    k++;
                }
            }
        }
        return out;
    }

    function inArray(needle, haystack) {
        var length = haystack.length;
        for(var i = 0; i < length; i++) {
            if(haystack[i].v == needle) return true;
        }
        return false;
    }

    /**
     * todo:optymalizacja - proba wyciagniecia tego na zew aby raz bylo wyciagane
     */
    function getEvalEntity( matrix ){
        var k = 0;
        var eval_entity = [];
        for (var x=0;x<cols;x++) {
            for (var y=0;y<rows;y++) {
                if(  x <= (cols - len)  ){
                    eval_entity[k] =[];
                    for( i=0; i<len; i++  ){
                        eval_entity[k][i] = {};
                        eval_entity[k][i].x = x+i;
                        eval_entity[k][i].y = y;
                        eval_entity[k][i].v = matrix[x+i][y];
                    }
                    k++
                }
                if(  y <= (rows - len)  ){
                    eval_entity[k] =[];
                    for( i=0; i<len; i++  ){
                        eval_entity[k][i] = {};
                        eval_entity[k][i].x = x;
                        eval_entity[k][i].y = y+i;
                        eval_entity[k][i].v = matrix[x][y+i];
                    }
                    k++;
                }
                if(  (x <= (cols - len)) && (  y <= (rows - len)  )  ){
                    eval_entity[k] =[];
                    for( i=0; i<len; i++  ){
                        eval_entity[k][i] = {};
                        eval_entity[k][i].x = x+i;
                        eval_entity[k][i].y = y+i;
                        eval_entity[k][i].v = matrix[x+i][y+i];
                    }
                    k++;

                    eval_entity[k] =[];
                    for( i=0; i<len; i++  ){
                        eval_entity[k][i] = {};
                        eval_entity[k][i].x = x+len-1-i;
                        eval_entity[k][i].y = y+i;
                        eval_entity[k][i].v = matrix[x+ len-1-i][y+i];
                    }
                    k++;
                }
            }
        }
        return eval_entity;
    }

    function evaluate( matrix, player  ){
        var eval_entity =getEvalEntity( matrix );

        var score = 0;
        var win = 0;
        var win_xy = {};
        for( i=0; i<eval_entity.length; i++  ){
            var item = eval_entity[i];
            var is_min = inArray( -1, item );
            var is_max = inArray( 1, item );

            if( is_min &&  is_max ){
                score += 0;
            }else{
                if( !is_min && !is_max  ){
                    score += 1*player;
                }else{
                    var sum = 0;
                    for( j=0; j<item.length; j++ ){
                        sum += parseInt( item[j].v );
                    }
                    var sign = ( sum > 0  ) ? 1 : -1
                    var sum_abs = Math.abs(sum);
                    if( len == sum_abs ){
                        win = sign;
                        win_xy = item;
                    }
                    score += sign * Math.pow( 10, (sum_abs + 1)  ) ;
                }
            }
        }
        return { score: score, win: win, win_xy : win_xy };
    }

    function alphaBetaPruning( node, depth, alpha, beta, player ){

        var eval = evaluate(   node, player );
        if(  (eval['win'] != 0 ) || ( eval['score'] == 0 )  || (depth >= max_depth ) ){
            return  { 'alphabeta': eval['score'], 'tree' : null };
        }

        var children = possibleMoves( node, player );
        depth++;


        if( player == human ){
            var tree = [];
            for( var i=0;  i<children.length;  i++ ){
                tree[i] = {};
                tree[i].matrix = children[i];
                var tree_children  = alphaBetaPruning( children[i], depth, alpha, beta, -player  );
                var alpha = ( tree_children['alphabeta'] > alpha  ) ?  tree_children['alphabeta'] : alpha;

                tree[i].alphabeta = alpha;
                if( beta <= alpha ){
                    break;
                }
            }
            return {  'alphabeta':  alpha, 'tree': tree };
        }else{
            var tree = [];
            for( var i=0;  i<children.length;  i++ ){
                tree[i] = {};
                tree[i].matrix = children[i];
                var tree_children = alphaBetaPruning(  children[i], depth, alpha, beta, -player );
                var beta = ( tree_children['alphabeta'] < beta  ) ?  tree_children['alphabeta'] :  beta;  

                tree[i].alphabeta = beta;
                if( beta <= alpha ){
                    break;
                }
            }
            return {  'alphabeta':  beta, 'tree': tree };
        }
    }


    function getMatrix( tree , alphabeta  ){
        var tree_len = tree.length;

        for( var i=0; i<tree_len; i++ ){
            if( tree[i].alphabeta == alphabeta  ){
                return tree[i].matrix;
            }
        }
        return false;
    }

    function getBestMatix( matrix_in, player ){
        var tree_ab  = alphaBetaPruning( matrix_in, 0,  -inf, inf, player );
        var  matrix_out = getMatrix(  tree_ab.tree, tree_ab.alphabeta  );
        return  matrix_out
    }

    function getEntityMove( matrix_in, matrix_out ){
        for (var x=0;x<cols;x++) {
            for (var y=0;y<rows;y++) {
                if( matrix_in[x][y] != matrix_out[x][y] ){
                    return { 'x':x, 'y':y, 'value':matrix_out[x][y], 'is_finish':0 };
                }
            }
        }
        return false;
    }

    function isFinish( matrix, player  ){
        var eval = evaluate(   matrix, player  );
        if( (eval['win'] != 0 ) || ( eval['score'] == 0 ) ){
            return { 'is_finish': eval };
        }
        return 0;
    }

    function play( matrix_in ) {
        var player = comp;
        var is_finish = isFinish( matrix_in, -player  );
        if( is_finish != 0  ){
            return is_finish;
        }

        var  matrix_out =  getBestMatix( matrix_in, player );

        var is_finish = isFinish( matrix_out, player  );
        if( is_finish != 0  ){
            return is_finish;
        }

        var entity_move = getEntityMove( matrix_in, matrix_out );
        return entity_move;
    }

    return {
        init : init,
        play : play,
        evaluate : evaluate
    };

})();
