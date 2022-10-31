function letItSnow() {
	//create canvas
	var canvas = document.getElementById('snow-canvas');
	var context = canvas.getContext('2d');
	
	// The initial angle 
	var angle = 0;
	
	//Get canvas width and height
	var width = window.innerWidth;
	var height = window.innerHeight;
	
	//Set canvas width and height
	canvas.width = width;
	canvas.height = height;
	
	//Create the snow particles
	var snowParticles = 250;
	var flakes = [];
	
	for (var i = 0; i < snowParticles; i++){
		flakes.push({
			x: Math.random()*width,
			y: Math.random()*height,
			radius: Math.random()*4+1,
			density: Math.random()*snowParticles
		});
	}
	//console.log('The snow flakes array ', flakes);
	
	function drawFlakes() {
		context.clearRect(0, 0, width, height);
		context.fillStyle = 'rgba(255, 255, 255, 0.8)';
		context.beginPath();
		
		for (var i = 0; i < snowParticles; i++) {
			var f = flakes[i];
			context.moveTo(f.x, f.y);
			context.arc(f.x, f.y, f.radius, 0, Math.PI * 2, true);
		}
		context.fill()
		updateCanvas();
	}
	
	function updateCanvas() {
		angle += 0.01
		for (var i = 0; i < snowParticles; i++) {
			var f = flakes[i];
			
			//update the snowflakes coordinates
			f.y += Math.cos(angle + f.density) + 1 + f.radius / 2;
			f.x += Math.sin(angle) * 2;
			
			if(f.x > width + 5 || f.x < -5 || f.y > height) {
				if(i % 3 > 0) {
					flakes[i] = {x: Math.random()* width, y: -10, radius: f.radius, density: f.density};
				} else {
					if(Math.sin(angle) > 0) {
						flakes[i] = {x: - 5, y: Math.random()*height, radius: f.radius, density: f.density};
					} else {
						flakes[i] = {x: width + 5, y: Math.random()*height, radius: f.radius, density: f.density};
					}
				}
			}
		}
	}
	setInterval(drawFlakes, 33);
}

window.onload = letItSnow();