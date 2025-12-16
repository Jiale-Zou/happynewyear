// mask-button
playAll();
function playAll(){
    const playMask = document.querySelector('#mask');
    const playButton = playMask.querySelector('.mask-button');
    playButton.addEventListener('click', function(e) {
        e.stopPropagation();
        playMask.style.display = 'none';
        initCountDown();
    });

    // Set the mask couldn't been clicked
    playMask.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });
}

// page1
initMusic()
function initMusic(){
    const music = document.querySelector('#music');
    const musicAudio = music.querySelector('audio');
    musicAudio.volume = 0.2;
    music.addEventListener('click', function(){
        if(musicAudio.paused){
            this.className = 'run';
            musicAudio.play();
        }
        else {
            this.className = '';
            musicAudio.pause();
        }
    })
}

function initCountDown(){
    const page1Frame = document.querySelector('.page1-frame');
    const countNumber = page1Frame.querySelector('span');
    const page1 = document.querySelector('#page1')
    const page2 = document.querySelector('#page2')
    const tick = page1.querySelector('.tick')
    tick.play();
    const timer = setInterval(()=>{
        countNumber.innerHTML = ++countNumber.innerHTML;
        if(countNumber.innerHTML == 60){
            page1Frame.innerHTML = '<strong>2026.1.1 00:00:00</strong>'
            clearInterval(timer);

            setTimeout(() => {
                page1.style.display = 'none';
                page2.style.display = 'block';
                tick.pause();
                initFire();
            }, 900)
        }
    }, 1000);
}

// page2
let colors = [
    [220, 20, 60],
    [255, 215, 0],
    [127, 255, 0],
    [128, 0, 128],
    [255, 140, 0],
];
function initFire(){
    loadStatic(['../static/img/Cover/fireText.png',
        '../static/img/Cover/new.png',
        '../static/img/Cover/year.png',
        '../static/img/Cover/quick.png',
        '../static/img/Cover/happy.png',
        '../static/img/Cover/wa.png',]).then((st)=>{

        const musicAudio = document.querySelector('#page2 audio');
        const page2 = document.querySelector('#page2');
        const page3 = document.querySelector('#page3')
        const canvas = page2.querySelector('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true }); // Attain 2-d plot context
        const width = page2.clientWidth;
        const height = page2.clientHeight;
        canvas.width = width; // set canvas's width and height
        canvas.height = height;
        let balls = [];
        let fires = [];
        let textFires = [];
        let timer = null;
        let count = 0; // number of ball have been generated this moment
        let ballAll = 15; // number of ball should be generated
        let ballTrails = new Map(); // key: ball, value: trials[{x,y,alpha}]
        let fireTrails = new Map(); // key: fire, value: trials[{x,y,alpha}]

        let pc = getImagePoints(st[0]);
        let HappyNewYear = [];
        for(let i=1; i<st.length; i++){
            HappyNewYear[i-1] = getImagePoints(st[i], 1);
        }
        let textLocation = [
            [width/6, width/3, width/2, 2*width/3, 5*width/6], // x
            [-17, -18, -16, -17, -16], // vy
            [0, 1, 4, 2, 3], // color
        ];

        timer = setInterval(()=>{
            if(count === ballAll){
                clearInterval(timer);
                count = 0;
                timer = null;
                const textBall = new Ball({
                    r: 8,
                    x: width/2,
                    y: 2*height/3,
                    vx: 0,
                    vy: -17,
                    end(){ endTextBall(this, pc);}
                });
                balls.push(textBall);
                ballTrails.set(textBall, []);
            }
            else{
                count ++;
                if(count === 5 || count === 6 || count === 7 || count === 8 || count === 9){
                    let idx = count-5;
                    const happyBall = new Ball({
                        color: textLocation[2][idx],
                        r: 3,
                        x: textLocation[0][idx],
                        y: 2*height/3,
                        vx: 0,
                        vy: textLocation[1][idx],
                        end(){
                            if(this.vy > 1){
                                ballTrails.delete(this);
                                balls.splice(balls.indexOf(this), 1);
                                for(let i=0; i<60;i++){
                                    let power = (0.25 + Math.random()) * 10; // Each direction of each fire's radius
                                    let vx = Math.cos(i*6*Math.PI/180) * power;
                                    let vy = Math.sin(i*6*Math.PI/180) * power;
                                    const newFire = new Fire({
                                        color: this.color,
                                        r: 3,
                                        x: this.x,
                                        y: this.y,
                                        vx: vx,
                                        vy: vy,
                                        g: 0.05,
                                        end(){
                                            if(this.life < 10){
                                                fireTrails.delete(this);
                                                fires.splice(fires.indexOf(this), 1);
                                            }
                                        }
                                    });
                                    fires.push(newFire);
                                    fireTrails.set(newFire, [])
                                }
                                let p = HappyNewYear[idx][0];
                                let c = HappyNewYear[idx][1];
                                for(let i=0; i<p.length;i++){
                                    let power = 0.05;
                                    let vx = (p[i].x - p.w/2)*power;
                                    let vy = (p[i].y - p.h/2)*power;
                                    let textF = new textFire({
                                        color: c[i],
                                        x: this.x,
                                        y: this.y,
                                        vx: vx,
                                        vy: vy,
                                        life: 200,
                                        end(){
                                            if(this.life < 10){
                                                textFires.splice(textFires.indexOf(this), 1);
                                            }
                                        }
                                    });
                                    textFires.push(textF);
                                }
                            }
                        }
                    });
                    balls.push(happyBall);
                    ballTrails.set(happyBall, []);
                }
                const newBall = new Ball({
                    color: Math.floor(Math.random()*colors.length),
                    r: 5, // radius
                    x: (1 + Math.random()) * width / 3, // x position
                    y: height * 0.78, // y position
                    vx: (Math.random() * 2 - 1)*3, // v of x
                    vy: (-Math.random()*2 - 9)*1.8, // v of y
                    end(){
                        if(this.vy > 1){
                            ballTrails.delete(this);
                            balls.splice(balls.indexOf(this), 1);
                            let size = 1 + Math.random()*14; // Each fire's radius
                            for(let i=0; i<60;i++){
                                let power = (0.25 + Math.random()) * size; // Each direction of each fire's radius
                                let vx = Math.cos(i*6*Math.PI/180) * power;
                                let vy = Math.sin(i*6*Math.PI/180) * power;
                                const newFire = new Fire({
                                    color: this.color,
                                    r: 3,
                                    x: this.x,
                                    y: this.y,
                                    vx: vx,
                                    vy: vy,
                                    g: 0.05,
                                    end(){
                                        if(this.life < 10){
                                            fireTrails.delete(this);
                                            fires.splice(fires.indexOf(this), 1);
                                        }
                                    }
                                });
                                fires.push(newFire);
                                fireTrails.set(newFire, [])
                            }
                        }
                    }
                });
                balls.push(newBall);
                ballTrails.set(newBall, []);
            }
        }, 500)

        musicAudio.play();
        loop();
        function loop(){
            ctx.clearRect(0, 0, width, height);
            // Update ball trials memory
            balls.forEach(ball => {
                ball.update();
                const trails = ballTrails.get(ball);
                trails.push({ x: ball.x, y: ball.y, alpha: 1});
                if (trails.length > 20) {
                    trails.shift();
                }
                trails.forEach((trail, index) => {
                    trail.alpha = index / trails.length;
                });
            });
            if(ballTrails.size>0){
                // Plot the history balls
                ballTrails.forEach((trails, ball) => {
                    let colorRgba = colors[ball.color];
                    trails.forEach(trail => {
                        ctx.beginPath();
                        ctx.fillStyle = `rgba(${colorRgba[0]}, ${colorRgba[1]}, ${colorRgba[2]}, ${trail.alpha})`;
                        ctx.arc(trail.x, trail.y, ball.r * trail.alpha, 0, 2 * Math.PI);
                        ctx.closePath();
                        ctx.fill();
                    });
                });
            }
            // Update fire trials memory
            fires.forEach(fire => {
                fire.update();
                const trails = fireTrails.get(fire);
                trails.push({ x: fire.x, y: fire.y, alpha: 1});
                if (trails.length > 20) {
                    trails.shift();
                }
                trails.forEach((trail, index) => {
                    trail.alpha = index / trails.length;
                });
            });
            if(fireTrails.size>0){
                // Plot the history fires
                fireTrails.forEach((trails, fire) => {
                    let colorRgba = colors[fire.color];
                    trails.forEach(trail => {
                        ctx.beginPath();
                        ctx.fillStyle = `rgba(${colorRgba[0]}, ${colorRgba[1]}, ${colorRgba[2]}, ${trail.alpha})`;
                        ctx.arc(trail.x, trail.y, fire.r * trail.alpha, 0, 2 * Math.PI);
                        ctx.closePath();
                        ctx.fill();
                    });
                });
            }
            // Update textFire trials
            textFires.forEach(fire => {
                fire.update();
            });

            // Plot the current balls and fires and textFires
            if(balls.length>0){
                balls.forEach(ball => {
                    ball.render();
                });
            }
            if(fires.length>0) {
                fires.forEach(fire => {
                    fire.render();
                })
            }
            if(textFires.length>0) {
                textFires.forEach(fire => {
                    fire.render();
                })
            }

             if (balls.length === 0 && fires.length === 0 && textFires.length === 0 && timer == null) {
                 musicAudio.pause();
                 page2.style.display = 'none';
                 page3.classList.add('show');
                 setTimeout(() => {
                     page3.style.opacity = '1';
                 },10); // Reserve enough time for website to play up
                 initTypeWriter();
                 return;
            }
            // Monitor loop 60 times 1 second
            requestAnimationFrame(loop);
        }

        ctx.clearRect(0, 0, width, height);

        class Ball {
            // Set Ball's attributions
            constructor(options) {
                this.settings = Object.assign({
                    color: 1,
                    r: 5,
                    g: 0.2, // gravity
                    end(){}
                }, options);
                for(let attr in this.settings){
                    this[attr] = this.settings[attr];
                }
            }
            update(){
                this.x += this.vx;
                this.y += this.vy;
                this.vy += this.g;
            }
            render(){
                // Plot circle in canvas
                let colorRgba = colors[this.color]
                ctx.beginPath();
                ctx.fillStyle = `rgba(${colorRgba[0]}, ${colorRgba[1]}, ${colorRgba[2]})`;
                ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI); // plot circle(x, y, radius, angle begin, agnle end)
                ctx.closePath();
                ctx.fill();
                this.end();
            }
        }

        class Fire {
            // Set Ball's attributions
            constructor(options) {
                this.settings = Object.assign({
                    color: 1,
                    r: 5,
                    g: 0.2, // gravity
                    life: 100, // determine when the fire disappear
                    fs: 0.95, // the fs to make the v descend
                    end(){}
                }, options);
                for(let attr in this.settings){
                    this[attr] = this.settings[attr];
                }
            }
            update(){
                this.x += this.vx;
                this.y += this.vy;
                this.vy += this.g;
                this.vx *= this.fs;
                this.vy *= this.fs;
                if(this.life >0 && this.life < 300){
                    this.life = this.life-1.2;
                }
            }
            render(){
                // Plot circle in canvas
                let colorRgba = colors[this.color]
                ctx.beginPath();
                ctx.fillStyle = `rgba(${colorRgba[0]}, ${colorRgba[1]}, ${colorRgba[2]})`;
                ctx.arc(this.x, this.y, this.r, this.r * Math.min(this.life, 100)/100, 2*Math.PI); // plot circle(x, y, radius, angle begin, agnle end)
                ctx.closePath();
                ctx.fill();
                this.end();
            }
        }

        class textFire{
            constructor(options) {
                this.settings = Object.assign({
                    color: [0,0,0],
                    r: 1,
                    g: 0.1,
                    life: 120,
                    fs: 0.95,
                    end(){}
                }, options);
                for(let attr in this.settings){
                    this[attr] = this.settings[attr];
                }
            }
            update(){
                this.x += this.vx;
                this.y += this.vy;
                this.vy += this.g;
                this.vx *= this.fs;
                this.vy *= this.fs;
                if(this.life >0 && this.life < 300){
                    this.life = this.life-1.2;
                }
            }
            render(){
                // Plot circle in canvas
                ctx.beginPath();
                ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]})`;
                ctx.arc(this.x, this.y, this.r, this.r * Math.min(this.life, 100)/100, 2*Math.PI);
                ctx.closePath();
                ctx.fill();
                this.end();
            }
        }

        function endTextBall(obj, pointColor){
            if(obj.vy > 1){
                ballTrails.delete(obj);
                balls.splice(balls.indexOf(obj, 1));
                for(let i=0; i<60;i++){
                    let power = (0.25+Math.random()) * 10; // Each direction of each fire's radius
                    let vx = Math.cos(i*6*Math.PI/180) * power;
                    let vy = Math.sin(i*6*Math.PI/180) * power;
                    const newFire = new Fire({
                        color: obj.color,
                        r: 3,
                        x: obj.x,
                        y: obj.y,
                        vx: vx,
                        vy: vy,
                        g: 0.05,
                        end(){
                            if(this.life < 10){
                                fireTrails.delete(this);
                                fires.splice(fires.indexOf(this), 1);
                            }
                        }
                    });
                    fires.push(newFire);
                    fireTrails.set(newFire, [])
                }
                addTextFire(obj, pointColor);
            }
        }
        function addTextFire(obj, pointColor){
            let p = pointColor[0];
            let c = pointColor[1];
            for(let i=0; i<p.length;i++){
                let power = 0.05;
                let vx = (p[i].x - p.w/2)*power;
                let vy = (p[i].y - p.h/2)*power;
                let textF = new textFire({
                    color: c[i],
                    x: obj.x,
                    y: obj.y,
                    vx: vx,
                    vy: vy,
                    end(){
                        if(this.life < 10){
                            textFires.splice(textFires.indexOf(this), 1);
                        }
                    }
                });
                textFires.push(textF);
            }
        }
        function getImagePoints(img, level=4){
            let width = img.width;
            let height = img.height;
            let points = [];
            points.w = width;
            points.h = height;
            let colors = [];
            let x = Math.floor(width/level);
            let y = Math.floor(height/level);
            let imgData = null;
            ctx.clearRect(0,0,width,height);
            ctx.beginPath();
            ctx.drawImage(img,0,0);
            ctx.closePath();
            imgData = ctx.getImageData(0,0,width,height);
            ctx.clearRect(0,0,width,height);
            for(let i=0;i<x;i++){
                for(let j=0;j<y;j++){
                    let color = getImageColor(imgData, i*level, j*level);
                    if(color[0] === 0 && color[1] === 0 && color[2] === 0 && color[3] === 0){

                    }else{
                        points.push({x: i*level, y: j*level});
                        colors.push(color);
                    }
                }
            }
            return [points, colors];
        }
        function getImageColor(imgData, x, y){
            let w = imgData.width;
            let h = imgData.height;
            let d = imgData.data;
            let colors = [];
            colors[0] = d[(y*w+x)*4];
            colors[1] = d[(y*w+x)*4 + 1];
            colors[2] = d[(y*w+x)*4 + 2];
            colors[3] = d[(y*w+x)*4 + 3];
            return colors
        }
    });
}
function loadStatic(arr){
    let promises = [];
    for(let i=0;i<arr.length;i++){
        let promise = new Promise(function(resolve, reject){
            let img = new Image();
            img.src = arr[i];
            img.onload = function(){
                resolve(img);
            };
        });
        promises.push(promise);
    }
    return Promise.all(promises)
}


// page3
const config = {
    // \n signifies new line breaking, and {} signifies highlight
    text: "Dear：\n新年快乐哇~\n愿君马到成功, 快乐常随!\n",
    textHighlight: "来岁如今好时节，\n看君高步蹑鹏程。",
    speed: 100,
    lineBreakDelay: 500
};
function initTypeWriter() {
    let index = 0;
    const textEl = document.getElementById('blessingText');
    const highlightEl = document.getElementById('highlightText');
    const cursorEl = document.getElementById('cursor');
    const musicAudio = document.querySelector('#page3 audio');

    commonChar(index, textEl, highlightEl, cursorEl, musicAudio);

    // document.querySelector('#page3').addEventListener('click', () => {
    //     index = 0;
    //     textEl.innerHTML = '';
    //     highlightEl.innerHTML = '';
    //     cursorEl.style.display = 'inline-block';
    //     commonChar(index, textEl, highlightEl, cursorEl, musicAudio);
    // });
}

function commonChar(index, textEl, highlightEl, cursorEl, musicAudio) {
    if (musicAudio.paused){
        musicAudio.play();
    }
    if (index >= config.text.length) {
        highlightChar(0, highlightEl, cursorEl, musicAudio)
        return;
    }

    const currentChar = config.text[index];
    let htmlToAdd = '';
    let delay = config.speed;

    if (currentChar === '\n') {
        htmlToAdd = '<br>';
        delay = config.speed + config.lineBreakDelay;
        index++;
    }
    else {
        htmlToAdd = currentChar;
        index++;
    }

    textEl.innerHTML += htmlToAdd;

    setTimeout(() => {
        commonChar(index, textEl, highlightEl, cursorEl, musicAudio);
    }, delay);
}
function highlightChar(index, textEl, cursorEl, musicAudio) {
    if (index >= config.textHighlight.length) {
        cursorEl.style.display = 'none';
        musicAudio.pause();
        return;
    }

    const currentChar = config.textHighlight[index];
    let htmlToAdd = '';
    let delay = config.speed;

    if (currentChar === '\n') {
        htmlToAdd = '<br>';
        delay = config.speed + config.lineBreakDelay;
        index++;
    }
    else {
        htmlToAdd = currentChar;
        index++;
    }

    textEl.innerHTML += htmlToAdd;

    setTimeout(() => {
        highlightChar(index, textEl, cursorEl, musicAudio);
    }, delay);
}












