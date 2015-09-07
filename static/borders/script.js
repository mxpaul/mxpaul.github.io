var canvas, context;
var color = new Array ("red", "magenta", "blue", "green", "yellow");

document.addEventListener("DOMContentLoaded", main, true);
document.addEventListener("mouseup", onmouseup, true);

function onmouseup(/*MouseEvent*/ e){
    var aStar = new Star();
    aStar.x = e.clientX;
    aStar.y = e.clientY;
    star.push(aStar);
    document.title = star.length;
}

var star = new Array(); // в этом массиве будут храниться все объекты
var count = 300; // начальное количество объектов
var HEIGHT = window.innerHeight, WIDTH = window.innerWidth;
var timer;

//var G = 10; // задаём константу методом подбора
var dt = 0.02; // шаг вычисления

function main(){
    // создаём холст на весь экран и прикрепляем его на страницу
	canvas = document.createElement('canvas');
	canvas.height = HEIGHT;
	canvas.width = WIDTH;
	canvas.id = 'canvas';
	canvas.style.position = 'absolute';
	canvas.style.top = '0';
	canvas.style.left = '0';
	document.body.appendChild(canvas);
    context = canvas.getContext("2d");
    
    var aStar;
    for(var i = 0; i < count; i++){
        aStar = new Star();
        aStar.x = Math.random() * WIDTH;
        aStar.y = Math.random() * HEIGHT;
        star.push(aStar);
    }
    
    // запуск таймер, ваш кэп ;-)
    timer = setInterval(Step, dt * 1000);
}

function Star(){
		var maxspeed = 300;
    this.x     = 0;
    this.y     = 0;
    this.vx    = maxspeed * ( Math.random() - 0.5);
    this.vy    = maxspeed * ( Math.random() - 0.5);
    this.r     = 2 *( Math.random() + 1) ; // Radius
    this.color = color[parseInt(Math.random() * (color.length))];
}

function gravity(){
    var a, ax, ay, dx, dy, r;
    for(var i = 0; i < star.length; i++) // считаем текущей
        for(var j = 0; j < star.length; j++) // считаем второй
        {
            if(i == j) continue;
            dx = star[j].x - star[i].x;
            dy = star[j].y - star[i].y;
            
            r = dx * dx + dy * dy;// тут R^2
            if(r < 0.5) r = 0.5; // избегаем деления на очень маленькое число
            a = G * star[j].m / r;
            
            r = Math.sqrt(r); // тут R
            ax = a * dx / r; // a * cos
            ay = a * dy / r; // a * sin
            
            star[i].vx += ax * dt;
            star[i].vy += ay * dt;
        }
}

function Step(){
    
    // важно провести вычисление каждый с каждым
    // координаты меняем позже, потому что они влияют на вычисление ускорения
    for(var i = 0; i < star.length; i++){
				if (gonnaBounceLeft(star[i])) {
					bounceLeft(star[i]);
				} else if ( gonnaBounceRight(star[i])) {
					bounceRight(star[i]);
				}
				if (gonnaBounceTop(star[i])) {
					bounceTop(star[i]);
				} else if ( gonnaBounceBottom(star[i])) {
					bounceBottom(star[i]);
				}
        star[i].y += star[i].vy * dt;
        star[i].x += star[i].vx * dt;
    }
    
    // выводим на экран
    Draw();
}

function gonnaBounceLeft( ourStar ){
	return ourStar.x - ourStar.r + ourStar.vx * dt < 0 ? true : false;
}
function gonnaBounceRight( ourStar ){
	return ourStar.x + ourStar.r + ourStar.vx * dt > WIDTH ? true : false;
}
function gonnaBounceTop( ourStar ){
	return ourStar.y - ourStar.r + ourStar.vy * dt < 0 ? true : false;
}
function gonnaBounceBottom( ourStar ){
	return ourStar.y + ourStar.r + ourStar.vy * dt > HEIGHT ? true : false;
}

function bounceLeft(ourStar) {
	var timeGoback = dt -(ourStar.x - ourStar.r)/ourStar.vx;
	ourStar.vx = - ourStar.vx;
	ourStar.x = ourStar.r + ourStar.vx * timeGoback;
}
function bounceRight(ourStar) {
	var timeGoback = dt -(ourStar.x + ourStar.r - WIDTH)/ourStar.vx;
	ourStar.vx = - ourStar.vx;
	ourStar.x = WIDTH - ourStar.r + ourStar.vx * timeGoback;
}
function bounceTop(ourStar) {
	var timeGoback = dt -(ourStar.y - ourStar.r)/ourStar.vy;
	ourStar.vy = - ourStar.vy;
	ourStar.y = ourStar.r + ourStar.vy * timeGoback;
}
function bounceBottom(ourStar) {
	var timeGoback = dt -(ourStar.y + ourStar.r - HEIGHT)/ourStar.vy;
	ourStar.vy = - ourStar.vy;
	ourStar.y = HEIGHT - ourStar.r + ourStar.vy * timeGoback;
}

function drawStar(ourStar, context) {
				context.fillStyle= ourStar.color;
				context.strokeStyle= ourStar.color;
        context.beginPath();
        context.arc(
            ourStar.x,
            ourStar.y,
            ourStar.r,
            0,
            Math.PI * 2
        );
        context.closePath();
        context.fill();
        //context.stroke();
}

function Draw(){
    // очищение экрана
    context.fillStyle = "#111111";
    context.fillRect(0, 0, WIDTH, HEIGHT);
    
    // рисование кругов
    context.fillStyle = "#ffffff";
    for(var i = 0; i < star.length; i++){
			drawStar(star[i], context);
    }
}
