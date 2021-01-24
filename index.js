window.addEventListener("resize", updateCanvas);
window.addEventListener("click", onClick);

var board;
var turn=0;//順番（黒が0,白が1）
var boardSize;//盤面の直径
var marginSize=16;
var boardStroke=4;
var lineStroke=2;


window.onload=function(){
    setCanvasSize();
    init();
    draw();
    // alert("実行完了");
}

function setCanvasSize(){
    var canvasObj = document.getElementById("canvas");
    canvasObj.setAttribute("width", document.documentElement.clientWidth - 33);
    canvasObj.setAttribute("height", document.documentElement.clientHeight - 33);
}

function updateCanvas(){
    setCanvasSize();
    draw();
}

function init(){
    //盤面の配列を初期化 黒=0 白=1
    board=[
        [3,3,3,3,3,3,3,3],
        [3,3,3,3,3,3,3,3],
        [3,3,3,3,3,3,3,3],
        [3,3,3,1,0,3,3,3],
        [3,3,3,0,1,3,3,3],
        [3,3,3,3,3,3,3,3],
        [3,3,3,3,3,3,3,3],
        [3,3,3,3,3,3,3,3]
    ];
    turn=0;
}

function onClick(e){
    //マス目を取得
    var rect = e.target.getBoundingClientRect();
    x=e.clientX - rect.left;
    y=e.clientY - rect.top;

    if(marginSize<x && marginSize<y && x<marginSize+boardSize && y<marginSize+boardSize){
        putDisks(Math.floor((x-marginSize)/(boardSize/8)),Math.floor((y-marginSize)/(boardSize/8)));
    }
}

function putDisks(X,Y){
    if(board[Y][X]==3){

        
        board[Y][X]=turn;

        var turn_invert;
        if(turn==0)turn_invert=1;
        else turn_invert=0;

        //左方向
        if(board[Y][X-1]==turn_invert){
            for(var i=1; i<X;i++){
                if(board[Y][X-i]==3)break;
                if(board[Y][X-i]==turn){
                    for(var j=1;j<i;j++){board[Y][X-j]=turn;}break;
                }
            }
        }
        // 右方向
        if(board[Y][X+1]==turn_invert){
            for(var i=1; i<8-X;i++){
                if(board[Y][X+i]==3)break;
                if(board[Y][X+i]==turn){
                    for(var j=1;j<i;j++){board[Y][X+j]=turn;}break;
                }
            }
        }
        // 上方向
        if(Y!=0){
            if(board[Y-1][X]==turn_invert){
                for(var i=1; i<Y;i++){
                    if(board[Y-i][X]==3)break;
                    if(board[Y-i][X]==turn){
                        for(var j=1;j<i;j++){board[Y-j][X]=turn;}break;
                    }
                }
            }
        }
        // 下方向
        if(Y!=7){
            if(board[Y+1][X]==turn_invert){
                for(var i=1; i<8-Y;i++){
                    if(board[Y+i][X]==3)break;
                    if(board[Y+i][X]==turn){
                        for(var j=1;j<i;j++){board[Y+j][X]=turn;}break;
                    }
                }
            }
        }

        //ターンの切り替え
        if(turn==0) turn=1;
        else turn=0;

        draw();
    }
}

function checkCanPut(X,Y){

}

function draw(){
    
    var canvas = document.getElementById("canvas");
    // if(canvas.getContext){
        var ctx=canvas.getContext('2d');

        // ボードの直径を算出
        boardSize=canvas.clientWidth;
        if(boardSize>canvas.clientHeight) boardSize=canvas.clientHeight;
        boardSize-=marginSize*2;

        ctx.fillStyle="#f5f4f4";
        ctx.fillRect(0,0,canvas.clientWidth,canvas.clientHeight);//背景の描画

        //盤面の描画
        ctx.fillStyle="black";
        ctx.fillRect(marginSize,marginSize,boardSize,boardSize);
        ctx.fillStyle="#16c79a";
        ctx.fillRect(marginSize+boardStroke,marginSize+boardStroke,boardSize-boardStroke*2,boardSize-boardStroke*2);

        //枠の描画
        //縦線
        ctx.fillStyle="black";
        for(var i=0;i<7;i++){
            ctx.fillRect(marginSize+boardSize/8*(i+1),marginSize,lineStroke,boardSize);
        }
        for(var i=0;i<7;i++){
            ctx.fillRect(marginSize,marginSize+boardSize/8*(i+1),boardSize,lineStroke);
        }

        //石の描画
        for(var i=0;i<8;i++){
            for(var j=0;j<8;j++){
                
                if(board[i][j]!=3){
                    if(board[i][j]==0) ctx.fillStyle="white";
                    else ctx.fillStyle="black";
                    ctx.beginPath();
                    ctx.arc(marginSize+boardSize/8*j+boardSize/8/2,marginSize+boardSize/8*i+boardSize/8/2,boardSize/8/2/1.2,0,2*Math.PI,true);
                    ctx.fill();
    
                    if(board[i][j]==0) ctx.fillStyle="black";
                    else ctx.fillStyle="white";
                    ctx.beginPath();
                    ctx.arc(marginSize+boardSize/8*j+boardSize/8/2,marginSize+boardSize/8*i+boardSize/8/2,boardSize/8/2/1.22,0,2*Math.PI,true);
                    ctx.fill();
                }
            }
        }

        //スコア表描画
        //黒
        ctx.fillStyle="#433d3c";
        ctx.fillRect(marginSize*2+boardSize,marginSize,canvas.clientWidth-(marginSize*3+boardSize),canvas.clientHeight*0.5-marginSize);
        ctx.fillRect(marginSize*2+boardSize,marginSize+(canvas.clientHeight*0.5),canvas.clientWidth-(marginSize*3+boardSize),canvas.clientHeight*0.5-marginSize*2);
    // }
}