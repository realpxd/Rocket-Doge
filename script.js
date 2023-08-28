

// Images and Audio Files
const player = new Image();
player.src = './assets/img/player.webp';
/*const player2 = new Image();
    player2.src = './assets/img/player2.webp';*/
const obsImg = new Image();
obsImg.src = './assets/img/obs.png';
const bg = new Image();
bg.src = './assets/img/bg.jpg';

const jumpSound = new Audio();
jumpSound.src = "./assets/sounds/jump.mp3"
const gameOverSound = new Audio();
gameOverSound.src = "./assets/sounds/gameover.mp3"
const uiSound = new Audio();
uiSound.src = "./assets/sounds/clickui.ogg"
const bgMusic = new Audio();
bgMusic.src = "./assets/sounds/bg-music.ogg"

// Main
window.onload = function () {
    // Important Variables

    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    var cx = canvas.width;
    var cy = canvas.height;

    // Player's initial parameters
    var s = (cx / 2) - (cy / 5);
    var x = cx / 4;
    var y = cy / 3;

    // Font's initial parameters
    var fs = (cx / 2) - (cy / 5);
    var fx = cx / 4.5;
    var fy = cy / 8;

    // Gravity & Physics
    var t;
    var timePassed;
    var speed = 70;
    var incSpeed = 1;

    // Loading Screen Vars
    var progress = document.getElementById("progressBar");
    var loader = document.getElementById("loader");

    // Play music function
    var musicBtn = document.getElementById("musicBtn");
    musicBtn.addEventListener("click", function () {
        if (bgMusic.paused) {
            bgMusic.play()
        } else {
            bgMusic.pause()
        }
    })

    // Initialing Game Background
    // Some imp variables
    const spriteWidth = bg.width;
    const spriteHeight = bg.height;

    let currentSprite = 0;
    let bx = 0;

    // Moving Game background function
    function animate() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.drawImage(
            bg,
            currentSprite * spriteWidth,
            0,
            spriteWidth,
            spriteHeight,
            bx,
            0,
            spriteWidth,
            spriteHeight
        );

        if (bx <= -spriteWidth + 500) {
            bx = 0;
            currentSprite = 0;
        }

        bx -= 0.02;

        if (bx < spriteWidth * (currentSprite - 1)) {
            currentSprite--;
        }
        window.requestAnimationFrame(animate);
    }

    // Loading & Home Screen Setup
    // Loading Screen
    // Not working poperly after page refresh
    /*if(gameOverSound.readyState == 4 || bgMusic.readyState == 4 || jumpSound.readyState == 4){
        for(var i = 25; i<=90; i++){
            progress.setAttribute("value", i)
        }
    }else{
        console.log("//Failed to load files")
    }*/
    // Manually setting it up
    setTimeout(function () {
        progress.setAttribute("value", 90)
        if (progress.getAttribute("value") == 90) {
            loader.style.display = "none";
            homeScreen()
        }
    }, 1000)

    // Render / Play game function
    var rendering = false;
    function renderEvent() {
        if (!rendering) {
            document.ontouchstart = start
            document.onkeydown = function (event) {
                if (event.key == 'Enter') {
                    start()
                }
            };
            rendering = true;
            return;
        }
    }

    // Home Screen function
    function homeScreen() {

        // Background	
        context.drawImage(
            bg,
            currentSprite * spriteWidth,
            0,
            spriteWidth,
            spriteHeight,
            bx,
            0,
            spriteWidth,
            spriteHeight
        );

        // Player
        context.beginPath();
        context.drawImage(player, x - s, y, s * 3, s * 3);
        context.stroke();

        // Text
        context.font = "700 " + fs + 'px Verdana';
        context.fillStyle = 'red';
        context.fillText("R o c k e t ", fx - fs, fy);
        context.fillStyle = 'pink';
        context.fillText(" D o g e ", fx + fx - fs, fy + fs + fs);

        // Text
        context.font = "300 " + fs / 1.5 + 'px Courier New';
        context.fillStyle = 'pink';
        context.fillText("Click anywhere to", fx - s, fx * 6);
        context.fillText("start the game", fx - s, fx * 6.5);

        renderEvent()
    }

    // Main - GamePlay function
    let c = 0;
    //let ty = 0;
    function draw() {
        canvas.focus();
        // User interactions
        document.onkeydown = function (event) {
            if (event.key == ' ' || event.key == 'ArrowUp') {
                c += 1;
                y -= 60;
                if (c % 5 == 0 && c != 0) {
                    speed = incSpeed + 25;
                    speed++;
                    incSpeed += 2;
                }
                jumpSound.play();
            }
        };


        document.ontouchstart = function () {
            c += 1;
            //console.log("// " + x, y + " click");
            y -= 60
            //ty = y;
            //ty-=1
            if (c % 5 == 0 && c != 0) {
                speed = incSpeed + 25;
                speed++;
                incSpeed += 2;
            }
            jumpSound.play()
        }

        // Gravity & Physics
        var intSpeed = Math.ceil(speed)
        timePassed = (Date.now() - t) / 1000;
        t = Date.now();
        // Make the player falls
        if (y <= cy) {
            speed += 70 * timePassed;
            y += speed * timePassed;
        }
        // Make the player get initial position when it exits bottom camvas
        if (y > cy) {
            c = 0
            y = 250
            speed = incSpeed - x
        }
        // Make the player to not exceed certain height
        if (y <= cy / 18) {
            y = cy / 18;
        }

        // Render Graphics
        context.clearRect(0, 0, cx, cy);

        // Layer 1 : Background
        animate();

        // Layer 2 : Player
        context.beginPath();
        context.drawImage(player, x - s, y, s * 3, s * 3);
        context.stroke();

        // Layer 3 : Text
        context.font = (fx / cx + fy - s - s) + 'px Arial';
        context.fillStyle = 'purple';
        context.fillText("Count: " + c, fx - fs, fy - fx + fs);
        // Layer 4: Text
        context.font = (fx / cx + fy - s - s) + 'px Arial';
        context.fillStyle = 'fuschia';
        context.fillText("Speed: " + intSpeed, cx - fx - s, fy - fx + fs);

        window.requestAnimationFrame(draw);
    }

    // Home Screen / Start game function
    function start() {

        // Setting initial value
        t = Date.now();
        timePassed = 0;
        // Calling main function
        draw()

        // Obstacles Function
        function obs(a, a2, b, b2, w, h, w2, h2) {
            // to check values console.log("// " + "a : " + a + " , a2 : " + a2 + " , b : " + b + " , b2 : " + b2 + " , w : " + w + " , h : " + h + " , w2 : " + w2 + " , h2 : " + h2 );

            //Clear exited obstacles
            context.clearRect(-cx, 0, cx, cy);
            // Layer 1 : North obstacles
            context.beginPath();
            context.drawImage(obsImg, a, b, w, h);
            context.stroke();
            // Layer 2 : South obstacles
            context.beginPath();
            context.drawImage(obsImg, a2, b2, w2, h2);
            context.stroke();

            // Take obstacles to left exit of canvas
            a -= 4;
            a2 -= 4;

            // Force push to left exit of canvas
            if (a <= 0 || a2 <= 0) {
                a = -100
                a2 = -150
            }

            window.requestAnimationFrame(function () { obs(a, a2, b, b2, w, h, w2, h2) });

            // Check collision for Game Over
            if (a + w >= x - s && a2 <= x + s && (b + h >= y - s || b2 <= y + s)) {
                //context.clearRect(0, 0, cx, cy);
                //window.requestAnimationFrame(function() {obs(a, a2, b, b2, w , h , w2 , h2 )});
                //window.cancelAnimationFrame(draw)
                //window.cancelAnimationFrame(function() {obs(a, a2, b, b2, w , h , w2 , h2 )})
                //window.cancelAnimationFrame(loopObs)

                bgMusic.pause();
                gameOverSound.play();
                console.log(" Game Over ");
                setTimeout(function () { location.reload(); }, 700)

                //return;
            }
        }

        // Loop the obstacles function
        function loopObs() {

            //Initial & changing values
            var h = Math.floor(Math.random() * (cy - cy / 1.8));
            var w = 50;

            var h2 = Math.floor(Math.random() * (cy - cy / 1.5));
            var w2 = 50;

            var a = cx;
            var b = 0;

            var a2 = cx;
            var b2 = cy - h2;

            // Call to render obstacles 
            obs(a, a2, b, b2, w, h, w2, h2);
        }
        // Call to loop obstacles
        setInterval(loopObs, 1000)
    }
}

