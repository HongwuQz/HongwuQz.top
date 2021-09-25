let config = {
    // 游戏的状态  0:游戏未开始  1：游戏进行中   2: 游戏结束  3:游戏暂停
    status: 0,
    // 病毒生成的时间间隔
    interval:800,
    // 病毒动画的速度
    speed:3,
    // 设置过关需要连击次数
    passRequire:5
}

// 得分
let score = 0;

// 是否过关的状态  0：没过关  1：过关了  2：暂停状态
let isPass = 0;

// 开始页面
let startAlert = document.querySelector('#start-alert')
// logo
let gameDesc = document.querySelector('.game-desc')

let footer = document.querySelector('#start-alert footer')

function begin(){
    // console.log('游戏开始')

    gameDesc.classList.add('slide-up')
    footer.classList.add('slide-down')

    setTimeout(function(){
        startAlert.style.display = 'none'
    },500)
    startGame()

    // 更新游戏状态
    config.status = 1;
}

startAlert.onclick = begin;

var timer,updater;
function startGame(){
    // console.log('start')
    config.status = 1;
    isPass = 0;
    gameOverAlert.style.display = 'none'
    timer = setInterval(function(){
        makeVirus()
    },config.interval)

    updater = setInterval(function(){
        update()
    },16)
    
}

let game = document.querySelector('#game')

let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
    'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]

// 获得游戏场景
let stage = document.querySelector("#stage")

// ui层
let uiLayer = document.querySelector('#ui')

let virues = []
// 生成病毒元素
function makeVirus(){
    let virus = document.createElement('div')
    virus.setAttribute('class','virus')
    let p = document.createElement('p')
    p.classList.add('letter')

    virus.appendChild(p)

    // 设置病毒的颜色
    switch(Math.floor(Math.random() * 6)){
        case 0:
            p.style.backgroundImage = 'radial-gradient(rgba(255,150,150,0),rgba(255,0,0,1))';
            p.style.boxShadow = '0 0 15px #f00';break;
        case 1:
            p.style.backgroundImage = 'radial-gradient(rgba(0, 255, 0, 0),rgba(0,255,0,1))';
            p.style.boxShadow = '0 0 15px #f00'; break;
        case 2:
            p.style.backgroundImage = 'radial-gradient(rgba(0, 0, 255, 0),rgba(0,0,255,1))';
            p.style.boxShadow = '0 0 15px #f00'; break;
        case 3:
            p.style.backgroundImage = 'radial-gradient(rgba(255, 255, 0, 0),rgba(255,255,0,1))';
            p.style.boxShadow = '0 0 15px #f00'; break;
        case 4:
            p.style.backgroundImage = 'radial-gradient(rgba(0, 255, 255, 0),rgba(0,255,255,1))';
            p.style.boxShadow = '0 0 15px #f00'; break;
        case 5:
            p.style.backgroundImage = 'radial-gradient(rgba(255, 0, 255, 0),rgba(255,0,255,1))';
            p.style.boxShadow = '0 0 15px #f00'; break;
    }


    let letter = letters[Math.floor(Math.random() * 26)]
    p.innerHTML = letter;

    virus.style.left = Math.random() * (stage.offsetWidth - 100) + 'px'

    virus.letter = letter;

    game.appendChild(virus)

    virues.push(virus)
}

let winH = stage.offsetHeight;

// update 动画，刷新元素的位置
function update(){

    for(let i = 0;i < virues.length;i++){
        let virus = virues[i];
        virus.style.top = virus.offsetTop + config.speed + 'px'

        if(virus.offsetTop > (winH - 200) && !uiLayer.warning ){
            showWarning()
            uiLayer.warning = true;
        }else if(virus.offsetTop >= winH){
            // game over
            isPass = 2;
            levelUpSign.innerHTML = '任务失败';
            restartBtn.innerHTML = '重  玩';
            gameOver();
            config.status = 3;
        }
    }
}

function showWarning(){
    let warningLayer = document.createElement('div')
    warningLayer.setAttribute('class','warning')
    uiLayer.appendChild(warningLayer)
}

let gameOverAlert = document.querySelector('#game-over-alert')
// 游戏介绍
function gameOver(){
    clearInterval(timer)
    clearInterval(updater)
    // console.log('pause')
    config.status = 2;
    gameOverAlert.style.display = 'block'
}


let scoreLabel = document.getElementById('score-label')
let speedLabel = document.getElementById('speed-label')

let xmEffect = document.querySelector('#xm')

// 监听键盘事件
window.addEventListener('keyup',function(e){
    let key = e.key;


    // 按空格暂停/继续
    if(key == ' '){
        // console.log(isPass,config.status)
        if(isPass == 2 && config.status == 2){
            startGame();
        }else if(isPass == 0 && config.status == 1){
            pasuseGame();
        }else if(isPass == 1 && config.status == 2){
            nextLevel();
        }else if(isPass == 2 && config.status == 3){
            resetGame();
        }else if(isPass == 0 && config.status == 0){
            begin();
        }
    }

    for(let i = 0;i < virues.length;i++){
        let virus = virues[i]

        if(virus.letter.toLowerCase() === key.toLocaleLowerCase() && config.status === 1){

            // 切换病毒
            let dieImg = document.createElement('img')
            game.appendChild(dieImg)
            dieImg.src = '/public/src/virus-die.png'
            dieImg.style.position = 'absolute'
            dieImg.style.left = virus.offsetLeft + 'px'
            dieImg.style.top = virus.offsetTop + 'px'
            dieImg.classList.add('fade-out')
            setTimeout(function(){
                game.removeChild(dieImg)
            },1000)
            game.removeChild(virus)
            virues.splice(i,1)

            score++;
            scoreLabel.innerHTML = score

            // 播放消灭音效
            xmEffect.currentTime = 0;
            xmEffect.play()

        }
    }

    if(score == config.passRequire){
        isPass == 1;
        levelUp();
        config.passRequire *= 2; 
    }
})


// 重玩
let restartBtn = document.querySelector('#restart-btn')
restartBtn.onclick = function(){
    // console.log(isPass);
    gameOverAlert.style.display = 'none'
    if(isPass == 0) resetGame();
    if(isPass == 1) nextLevel();
    if(isPass == 2) startGame();
    
}

// 暂停游戏
function pasuseGame(){
    levelUpSign.innerHTML = '游戏暂停';
    restartBtn.innerHTML = '继  续';
    gameOver();
    config.status = 2;
    isPass = 2;
}

function resetGame(){
    config.status = 1;
    score = 0;
    scoreLabel.innerHTML = score;
    game.innerHTML = ''
    virues = []
    uiLayer.removeChild(document.querySelector('.warning'))
    uiLayer.warning = false;
    startGame()
}

let levelUpSign = document.querySelector('#game-over-alert h1');

// 游戏关卡逻辑
function levelUp(){
    isPass = 1;
    levelUpSign.innerHTML = '恭喜过关';
    restartBtn.innerHTML = '下一关';
    gameOver()
}

function nextLevel(){
    // config.speed = Number(1.25*config.speed).toFixed(2);
    config.speed *= 1.25;
    config.status = 1;
    speedLabel.innerHTML = Number(config.speed).toFixed(2)
    game.innerHTML = ''
    virues = []
    startGame()
}

