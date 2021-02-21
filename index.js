window.addEventListener("resize", updateCanvas);
if(window.ontouchend===null){
window.addEventListener("touchend", function(event){
    x=event.changedTouches[0].pageX;
    y=event.changedTouches[0].pageY;

    onClick(x,y);
});}else{
window.addEventListener("click", function(event){
    var rect = event.target.getBoundingClientRect();
    x=event.clientX - rect.left;
    y=event.clientY - rect.top;

    onClick(x,y);
});}

var darkMode=true

var board;
var boardAnim;
var boardBuffer;

var turn=0;//順番（黒が0,白が1）
var boardSize;//盤面の直径
var marginSize=16;
var boardStroke=10;
var lineStroke=2;

var animDuration=100;
var animSpeed=5;
var animDiff=20;

window.onload=function(){
    setCanvasSize();
    init();
    draw();
}

function setCanvasSize(){
    var wrapperObj = document.getElementById("wrapper");
    var canvasObj = document.getElementById("canvas");
    canvasObj.width=wrapperObj.offsetWidth;
    canvasObj.height=wrapperObj.offsetHeight;

    // canvasObj.setAttribute("width", document.documentElement.clientWidth - 33);
    // canvasObj.setAttribute("height", document.documentElement.clientHeight - 33);
}

function updateCanvas(){
    setCanvasSize();
    draw();
}

function init(){
    //盤面の配列を初期化 黒=0 白=1
    board = new Array(8);
    for(var y=0;y<8;y++){board[y]=(new Array(8)).fill(3);}


    //盤面の状態を保持しておくバッファ(アニメーション用)
    boardBuffer = new Array(8);
    for(var y=0;y<8;y++){boardBuffer[y]=(new Array(8)).fill(3);}
    //boardBuffer = board.slice();
    
    //アニメーションの状態を保持しておく(0から1)
    boardAnim = new Array(8);
    for(var y=0;y<8;y++){boardAnim[y]=(new Array(8)).fill(animDuration);}

    //初期状態の４つの石を設置
    turnDisks(3,3,1,0);
    turnDisks(4,4,1,-2*animDiff);
    turnDisks(3,4,0,-animDiff);
    turnDisks(4,3,0,-animDiff);
    
    turn=0;

    requestAnimationFrame(update);
}

function onClick(x,y){
    //マス目を取得
    

    if(marginSize<x && marginSize<y && x<marginSize+boardSize && y<marginSize+boardSize){
        putDisks(Math.floor((x-marginSize)/(boardSize/8)),Math.floor((y-marginSize)/(boardSize/8)));
    }
}

function putDisks(X,Y){
    if(board[Y][X]==3){
        var turn_invert;
        if(turn==0)turn_invert=1;
        else turn_invert=0;

        turnDisks(X,Y,turn);

        //左方向
        if(board[Y][X-1]==turn_invert){
            for(var i=1; i<X+1;i++){
                if(board[Y][X-i]==3)break;
                if(board[Y][X-i]==turn){
                    // turnDisks(X,Y,turn);
                    for(var j=1;j<i;j++){turnDisks(X-j,Y,turn,-j*animDiff);}break;
                }
            }
        }
        // 右方向
        if(board[Y][X+1]==turn_invert){
            for(var i=1; i<8-X;i++){
                if(board[Y][X+i]==3)break;
                if(board[Y][X+i]==turn){
                    // turnDisks(X,Y,turn);
                    for(var j=1;j<i;j++){turnDisks(X+j,Y,turn,-j*animDiff);}break;
                }
            }
        }
        // 上方向
        if(Y!=0){
            if(board[Y-1][X]==turn_invert){
                for(var i=1; i<Y+1;i++){
                    if(board[Y-i][X]==3)break;
                    if(board[Y-i][X]==turn){
                        // turnDisks(X,Y,turn);
                        for(var j=1;j<i;j++){turnDisks(X,Y-j,turn,-j*animDiff);}break;
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
                        // turnDisks(X,Y,turn);
                        for(var j=1;j<i;j++){turnDisks(X,Y+j,turn,-j*animDiff);}break;
                    }
                }
            }
        }

        //右上
        if(X!=7 && Y!=0){
            for(var i=1;X+i<7 && Y-i>0;i++){
                if(board[Y-i][X+i]==3)break;
                if(board[Y-i][X+i]==turn){
                    // turnDisks(X,Y,turn);
                    for(var j=1;j<i;j++){turnDisks(X+j,Y-j,turn,-j*animDiff);}break;
                }
            }
        }

        //右下
        if(X!=7 && Y!=7){
            for(var i=1;X+i<7 && Y+i<7;i++){
                if(board[Y+i][X+i]==3)break;
                if(board[Y+i][X+i]==turn){
                    // turnDisks(X,Y,turn);
                    for(var j=1;j<i;j++){turnDisks(X+j,Y+j,turn,-j*animDiff);}break;
                }
            }
        }

        //左上
        if(X!=0 && Y!=0){
            for(var i=1;X-i>0 && Y-i>0;i++){
                if(board[Y-i][X-i]==3)break;
                if(board[Y-i][X-i]==turn){
                    // turnDisks(X,Y,turn);
                    for(var j=1;j<i;j++){turnDisks(X-j,Y-j,turn,-j*animDiff);}break;
                }
            }
        }

        //左下
        if(X!=0 && Y!=7){
            for(var i=1;X-i>0 && Y+i<7;i++){
                if(board[Y+i][X-i]==3)break;
                if(board[Y+i][X-i]==turn){
                    // turnDisks(X,Y,turn);
                    for(var j=1;j<i;j++){turnDisks(X-j,X+j,turn,-j*animDiff);}break;
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

function turnDisks(x,y,turn,TimeOffset){
    board[y][x]=turn;

    if(TimeOffset==null)boardAnim[y][x]=0;
        else boardAnim[y][x]=TimeOffset;
}

function update(){
    draw();
    requestAnimationFrame(update);
}

function draw(){
    
    //アニメーションの状態の加算
    for(var y=0;y<8;y++){
        for(var x=0;x<8;x++){
            boardAnim[y][x]+=animSpeed;
            if(boardAnim[y][x]>=animDuration)boardBuffer[y][x]=board[y][x];
        }
    }

    var canvas = document.getElementById("canvas");
    // if(canvas.getContext){
        var ctx=canvas.getContext('2d');

        // ボードの直径を算出
        boardSize=canvas.clientWidth;
        if(boardSize>canvas.clientHeight) boardSize=canvas.clientHeight;
        boardSize-=marginSize*2;

        //色の定義
        var mainColor="#121212"

        ctx.fillStyle=mainColor;
        ctx.fillRect(0,0,canvas.clientWidth,canvas.clientHeight);//背景の描画


        //盤面の描画
        ctx.fillStyle="black";

        ctx.shadowColor="black";//影の設定
        ctx.shadowBlur=10;
        ctx.shadowOffsetX=0;
        ctx.shadowOffsetY=0;

        //スコアボードの表示
        // ctx.fillRect(0,0,canvas.clientWidth)
        ctx.fillStyle="#1F1B24";
        ctx.fillRect(marginSize,marginSize,boardSize,boardSize);
        ctx.shadowBlur=0;
        ctx.fillStyle="#16c79a";//盤面の背景
        ctx.fillRect(marginSize+boardStroke,marginSize+boardStroke,boardSize-boardStroke*2,boardSize-boardStroke*2);

        //枠の描画
        //縦線
        ctx.fillStyle="#1F1B24";
        for(var i=0;i<7;i++){
            ctx.fillRect(marginSize+boardSize/8*(i+1),marginSize,lineStroke,boardSize);
        }
        for(var i=0;i<7;i++){
            ctx.fillRect(marginSize,marginSize+boardSize/8*(i+1),boardSize,lineStroke);
        }

        //石の描画
        
        for(var i=0;i<8;i++){
            for(var j=0;j<8;j++){
                if(boardBuffer[i][j]!=3){
                    //アニメーション用の石描画
                    if(boardAnim[i][j]<animDuration)
                    {
                        ctx.shadowBlur=3;
                        // 枠の描画
                        if(boardBuffer[i][j]==0) ctx.fillStyle="white";
                        else ctx.fillStyle="#1F1B24";

                        ctx.beginPath();
                        ctx.arc(marginSize+boardStroke/2+boardSize/8/2+j*(boardSize-boardStroke)/8,marginSize+boardStroke/2+boardSize/8/2+i*(boardSize-boardStroke)/8,boardSize/8/2/1.2,0,2*Math.PI,true);
                        ctx.fill();

                        // 中身
                        ctx.shadowBlur=0;
                        if(boardBuffer[i][j]==0) ctx.fillStyle="#1F1B24";
                        else ctx.fillStyle="white";

                        ctx.beginPath();
                        ctx.arc(marginSize+boardStroke/2+boardSize/8/2+j*(boardSize-boardStroke)/8,marginSize+boardStroke/2+boardSize/8/2+i*(boardSize-boardStroke)/8,boardSize/8/2/1.22,0,2*Math.PI,true);
                        ctx.fill();
                    }
                }

                if(board[i][j]!=3){
                    
                    //石の描画
                    ctx.shadowBlur=3;
                    if(board[i][j]==0) ctx.fillStyle="white";
                    else ctx.fillStyle="#1F1B24";
                    

                    ctx.beginPath();
                    ctx.arc(marginSize+boardStroke/2+boardSize/8/2+j*(boardSize-boardStroke)/8,marginSize+boardStroke/2+boardSize/8/2+i*(boardSize-boardStroke)/8,boardSize/8/2/1.2*Math.max(EaseOutExpo(boardAnim[i][j]),0),0,2*Math.PI,true);
                    ctx.fill();
    
                    ctx.shadowBlur=0;
                    if(board[i][j]==0) ctx.fillStyle="#1F1B24";
                    else ctx.fillStyle="white";
                    ctx.beginPath();
                    ctx.arc(marginSize+boardStroke/2+boardSize/8/2+j*(boardSize-boardStroke)/8,marginSize+boardStroke/2+boardSize/8/2+i*(boardSize-boardStroke)/8,boardSize/8/2/1.22*Math.max(EaseOutExpo(boardAnim[i][j]),0),0,2*Math.PI,true);
                    ctx.fill();
                }
            }
        }

        //スコア表描画
        //ctx.fillStyle="white";
        ctx.shadowBlur=3;
        ctx.fillStyle="#1F1B24";
        if(canvas.clientHeight>=canvas.clientWidth)
        {
            // 画面アスペクト比縦長用

            // 領域の計算
            var boxSize=(canvas.clientHeight-2*marginSize-boardSize)/3;

            ctx.fillRect(canvas.clientWidth-boxSize-marginSize, 2*marginSize+boardSize, boxSize, boxSize-marginSize);
            ctx.fillRect(canvas.clientWidth-2*(boxSize+marginSize), 2*marginSize+boardSize, boxSize, boxSize-marginSize);
            ctx.fillRect(canvas.clientWidth-3*(boxSize+marginSize), 2*marginSize+boardSize, boxSize, boxSize-marginSize);

            ctx.fillRect(marginSize, 2*marginSize+boardSize+boxSize, boardSize, boxSize-marginSize);
            ctx.fillRect(marginSize, 2*marginSize+boardSize+2*boxSize, boardSize, boxSize-marginSize);
        }
        else
        {
            //画面アスペクト比横長用
            ctx.fillRect(marginSize*2+boardSize,marginSize,canvas.clientWidth-(marginSize*3+boardSize),canvas.clientHeight*0.5-marginSize);
            ctx.fillRect(marginSize*2+boardSize,marginSize+(canvas.clientHeight*0.5),canvas.clientWidth-(marginSize*3+boardSize),canvas.clientHeight*0.5-marginSize*2);
        }
}

function EaseOutExpo(t)
    {
        var b=0;
        var c=1;
        var d=animDuration;
        return (t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b;
    }