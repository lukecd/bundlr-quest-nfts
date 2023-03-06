window.addEventListener("load", function () {
	const canvas = document.getElementById("canvas2");
	const ctx = canvas.getContext("2d");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// modes drive the type of animation
	let shouldDance = false;
	let currentMode = "blob";
	let modes = ["random", "blob", "rain", "logo", "swirl"];

	// load custom font
	var fkFont = new FontFace("FKDisplay", "url(./FKDisplay-RegularAlt.ttf)");
	fkFont.load().then(function (font) {
		document.fonts.add(font);
		console.log("Font loaded");
	});

	const playButton = document.getElementById("playButton");

	function checkMobile() {
		let check = false;
		(function (a) {
			if (
				/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
					a,
				) ||
				/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
					a.substr(0, 4),
				)
			)
				check = true;
		})(navigator.userAgent || navigator.vendor || window.opera);
		return check;
	}
	const isMobile = checkMobile();
	if (isMobile) {
		document.getElementById("playPauseImage").style.display = "none";
	}
	// song is 75 bpm
	// Length of 1 beat: 0.8 second = 800 msec
	// Length of 1 bar (4 beats): 3.2 seconds
	const song = document.getElementById("nft-soundtrack");
	console.log("song loaded song=", song);
	song.addEventListener("playing", function () {
		console.log("playing event handler called");

		shouldAnimate = true;
		document.getElementById("playPauseImage").src = "./pause_circle.png";
	});

	song.addEventListener("ended", function () {
		console.log("ended event handler called");

		// TODO return to blob
		shouldAnimate = false;
		currentMode = "blob";
		document.getElementById("playPauseImage").src = "./play_circle.png";
	});

	song.addEventListener("pause", function () {
		console.log("pause event handler called");
		currentMode = "logo";
		document.getElementById("playPauseImage").src = "./play_circle.png";
	});

	let audioContext;
	let audioSource;
	let analyser;
	let audioDataArray;

	let sizeModifier = 1; // change according to the beat
	let speedModifier = 1; // change according to the volume
	let shouldAnimate = false; // set to true when song starts

	let bumpX = -1;
	let bumpY = -1;

	playButton.addEventListener("click", function () {
		if (song.duration > 0 && !song.paused) {
			song.pause();
			currentMode = "logo";
			document.getElementById("playPauseImage").src = "./play_circle.png";
		} else {
			song.play();
			audioContext = new AudioContext();
			audioSource = audioContext.createMediaElementSource(song);
			analyser = audioContext.createAnalyser();
			audioSource.connect(analyser);
			analyser.connect(audioContext.destination);
			analyser.fftSize = 64; // default is 2048
			const bufferLength = analyser.frequencyBinCount;
			audioDataArray = new Uint8Array(bufferLength);
			document.getElementById("playPauseImage").src = "./pause_circle.png";
		}
	});

	playButton.addEventListener("touchend", function () {
		if (song.duration > 0 && !song.paused) {
			song.pause();
			currentMode = "logo";
			document.getElementById("playPauseImage").src = "./play_circle.png";
		} else {
			song.play();
			audioContext = new AudioContext();
			audioSource = audioContext.createMediaElementSource(song);
			analyser = audioContext.createAnalyser();
			audioSource.connect(analyser);
			analyser.connect(audioContext.destination);
			analyser.fftSize = 64; // default is 2048
			const bufferLength = analyser.frequencyBinCount;
			audioDataArray = new Uint8Array(bufferLength);
			document.getElementById("playPauseImage").src = "./pause_circle.png";
		}
	});

	class Particle {
		constructor(x, y, size, effect) {
			this.x = x;
			this.y = y;

			this.effect = effect; // the effect that created me

			// position in the blog
			this.blobX = x;
			this.blobY = y;

			// position for the logo
			this.logoX = x;
			this.logoY = y;

			// destination when moving
			this.destinationX = x;
			this.destinationY = y;

			// for dealing with the mouse
			this.dx = 0;
			this.dy = 0;
			this.distance = 0;
			this.force = 0;
			this.friction = 0.95;

			// for swirling
			// 2000 is an arbitrary animation speed (which also depends on the frame rate)
			// The -1.5 exponent is due to Kepler's 3rd Law
			this.speed = Math.random() * 2 + 1;
			this.swirlAngle = Math.random() * 360;
			this.angle = 0;
			this.orbitAngle = 0; // degrees relative to x axis

			this.size = size;
			this.vx = 0; //randomFloat(-1, 1);
			this.vy = 0; //randomFloat(-1, 1);
			this.colors = ["#FF8451", "#FFC46C", "#EDE8DB", "#D3D9EF", "#DBDEE9"];
			this.color = this.colors[randomInt(0, this.colors.length - 1)];

			this.easeX = Math.random() * 0.1;
			this.easeY = Math.random() * 0.1;
			this.directionX = Math.random() / 10;
			this.directionY = Math.random() / 10;
			if (Math.random() > 0.5) this.directionX = -this.directionX;
			if (Math.random() > 0.5) this.directionY = -this.directionY;
			// should we be a circle or a square
			const shapeDecider = Math.random();
			if (shapeDecider > 0.5) this.shape = "CIRCLE";
			else this.shape = "SQUARE";
			this.degree = 0;
		}

		draw(ctx) {
			if (this.shape === "CIRCLE") {
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
				ctx.fillStyle = this.color;
				ctx.fill();
			} else {
				ctx.save();
				ctx.translate(this.x - this.size, this.y - this.size);
				if (shouldAnimate) ctx.rotate((this.degree * Math.PI) / 180);
				this.degree += Math.random();
				ctx.fillStyle = this.color;
				ctx.fillRect(0, 0, this.size * 2, this.size * 2);
				ctx.restore();
			}
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.size, this.size);
		}

		update() {
			// check mouse
			this.dx = this.effect.mouse.x - this.x;
			this.dy = this.effect.mouse.y - this.y;
			// this should be wrapped in Math.sqrt() but that's performance intensive
			// probably will work w/o it, but just need a big mouse radius
			this.distance = this.dx * this.dx + this.dy * this.dy;
			// closer particles pushed harder
			this.force = -this.effect.mouse.radius / this.distance;
			if (this.distance < this.effect.mouse.radius) {
				this.angle = Math.atan2(this.dy, this.dx);
				this.vx += this.force * Math.cos(this.angle);
				this.vy += this.force * Math.sin(this.angle);
			}

			// check edges
			if (this.x > canvas.width || this.x < 0) {
				this.directionX = -this.directionX;
			}
			if (this.y > canvas.height || this.y < 0) {
				this.directionY = -this.directionY;
			}
			// different animation modes
			if (currentMode === "blob") {
				this.x += (this.blobX - this.x) * this.easeX;
				this.y += (this.blobY - this.y) * this.easeY;
			} else if (currentMode === "logo") {
				this.x += (this.logoX - this.x) * this.easeX;
				this.y += (this.logoY - this.y) * this.easeY;
			} else if (currentMode === "random") {
				this.x += this.directionX * speedModifier;
				this.y += this.directionY * speedModifier;
			} else if (currentMode === "rain") {
				this.y += Math.abs(this.directionY * speedModifier);
				if (this.y > canvas.height) this.y = 0;
			}

			if (shouldDance) {
				if (bumpX !== -1) {
					this.dx = bumpX - this.x;
					this.dy = bumpY - this.y;
					// this should be wrapped in Math.sqrt() but that's performance intensive
					// probably will work w/o it, but just need a big mouse radius
					this.distance = this.dx * this.dx + this.dy * this.dy;
					// closer particles pushed harder
					this.force = -this.effect.mouse.radius / this.distance;
					if (this.distance < this.effect.mouse.radius + 4000) {
						this.angle = Math.atan2(this.dy, this.dx);
						this.vx += this.force * Math.cos(this.angle);
						this.vy += this.force * Math.sin(this.angle);
					}
					this.x += (this.blobX - this.x) * this.easeX;
					this.y += (this.blobY - this.y) * this.easeY;
				}
			}

			// don't let them fuck with the mouse during logo mode
			if (currentMode !== "logo") {
				this.x += (this.vx *= this.friction) + this.easeX;
				this.y += (this.vy *= this.friction) + this.easeY;
			}
		}

		setLogoXY(x, y) {
			this.logoX = x;
			this.logoY = y;
		}

		getTopLeft() {
			const x = this.x - this.size * sizeModifier;
			const y = this.y - this.size * sizeModifier;
			return { x, y };
		}

		// returns either the diameter or length of one side
		getSize() {
			return this.size * sizeModifier * 2;
		}
	}

	class Effect {
		constructor(width, height, ctx) {
			this.heartImage = document.getElementById("logo");
			this.logoImage = document.getElementById("logo");
			this.width = width;
			this.height = height;
			this.centerX = this.width / 2;
			this.centerY = this.height / 2;
			this.x = this.centerX - this.heartImage.width / 2;
			this.y = this.centerY - this.heartImage.height / 2;
			this.ctx = ctx;
			this.particlesArray = [];
			this.gap = 10;
			this.mouse = {
				radius: 3000,
				x: undefined,
				y: undefined,
			};

			// desktop
			window.addEventListener("mousemove", (event) => {
				this.mouse.x = event.x;
				this.mouse.y = event.y;
			});

			// mobile
			window.addEventListener("touchmove", (event) => {
				this.mouse.x = event.x;
				this.mouse.y = event.y;
			});
		}

		init() {
			// images need to be square, so figure out current size and pick the smaller
			// to make into image dimensions
			let imageWidth = this.width;
			let imageHeight = this.height;
			let imageX = 0;
			let imageY = 0;

			if (this.width > this.height) {
				imageX = (this.width - this.height) / 2;
			} else if (this.height > this.width) {
				imageY = (this.height - this.width) / 2;
			}
			if (imageWidth < imageHeight) imageHeight = imageWidth;
			else if (imageHeight < imageWidth) imageWidth = imageHeight;

			// get the logo pixels
			this.ctx.clearRect(0, 0, this.width, this.height);
			this.ctx.drawImage(this.logoImage, imageX, imageY, imageWidth, imageHeight);
			const logoPixels = this.ctx.getImageData(0, 0, this.width, this.height).data;
			const logoXY = [];
			for (let y = 0; y < this.height; y += this.gap) {
				for (let x = 0; x < this.width; x += this.gap) {
					const index = (y * this.width + x) * 4; // 4 because r, g, b, a have separate array positions

					const alpha = logoPixels[index + 3];
					if (alpha > 0) {
						logoXY.push({ x, y });
					}
				}
			}
			// create our particles
			let numParticles = 0;
			let maxParticles = logoXY.length; // max particles is same number we need for logo
			let blobRadius = 0;
			// base the blob radius off the smallest size
			if (canvas.width <= canvas.height) {
				blobRadius = Math.floor(canvas.width * 0.8);
			} else {
				blobRadius = Math.floor(canvas.height * 0.8);
			}
			blobRadius /= 2;
			let loopMax = maxParticles * 500; // protect against infinite loops
			let i = 0;
			while (numParticles < maxParticles && i < loopMax) {
				i++;
				const cluster = randomClusteredPoint(
					Math.floor(canvas.width / 2), // centerX
					Math.floor(canvas.height / 2) - canvas.height * 0.09, // centerY
					blobRadius, // inner blob radius
					0.09,
				);
				const clusterX = Math.floor(cluster[0]);
				const clusterY = Math.floor(cluster[1]);

				//the size should be a function of distance from center.
				let size = Math.floor(
					Math.sqrt(
						Math.pow(canvas.width / 2 - clusterX, 2) +
							Math.pow(canvas.height / 2 - canvas.height * 0.09 - clusterY, 2),
					),
				);

				// bigger towards the center
				size = Math.abs(canvas.width / 2 - size);
				// console.log("size=", size);

				// scale it down
				size /= 30;
				const newParticle = new Particle(clusterX, clusterY, size, this);
				// only add newParticle to the array if there are no collisions
				if (!doParticlesCollide(newParticle, this.particlesArray)) {
					newParticle.setLogoXY(logoXY[numParticles].x, logoXY[numParticles].y);
					this.particlesArray.push(newParticle);
					numParticles++;
				}
			}
		}

		update() {
			this.particlesArray.forEach((particle) => particle.update());
		}

		draw() {
			this.particlesArray.forEach((particle) => particle.draw(this.ctx));
		}

		// returns the x, y coordinates of a random point
		getRandomXY() {
			const rndParticle = this.particlesArray[randomInt(0, this.particlesArray.length - 1)];
			return { x: rndParticle.x, y: rndParticle.y };
		}
	}

	let effect = new Effect(canvas.width, canvas.height, ctx);
	effect.init();
	window.addEventListener("resize", () => {
		effect = new Effect(canvas.width, canvas.height, ctx);
		effect.init();
	});

	let lastBump = 0;
	function doBump(curTime) {
		if (curTime - lastBump >= 3.2) {
			const rndXY = effect.getRandomXY();
			bumpX = rndXY.x;
			bumpY = rndXY.y;
			lastBump = curTime;
		}
	}

	function animate() {
		if (analyser) {
			analyser.getByteFrequencyData(audioDataArray);
			const maxAmplitude = Math.max(...audioDataArray);
			speedModifier = scale(maxAmplitude, 0, 256, 1, 10);
			const currentTime = song.currentTime;
			if (currentTime < 5) currentMode = "random";
			else if (currentTime < 9) currentMode = "logo";
			else if (currentTime < 15) currentMode = "random";
			else if (currentTime < 43) currentMode = "rain";
			else if (currentTime < 50) currentMode = "blob";
			else if (currentTime < 102) {
				if (currentTime >= 51) doBump(currentTime);
				currentMode = "blob";
			} else if (currentTime < 105) {
				currentMode = "rain";
				doBump(currentTime);
			} else if (currentTime < 115) {
				// 1:55
				doBump(currentTime);
				currentMode = "random";
			} else if (currentTime < 153) {
				// 2:33
				doBump(currentTime);
				currentMode = "rain";
			} else if (currentTime < 204) {
				// 3:24
				doBump(currentTime);
				currentMode = "random";
			} else if (currentTime < 243) {
				// 4:03
				currentMode = "random";
			} else if (currentTime < 256) currentMode = "logo"; // 4:16
			else currentMode = "blob"; // 4:20 end

			// check should dance
			if (currentTime > 43 && currentTime < 204) shouldDance = true;
			else shouldDance = false;
		}
		console.log("song.currentTim=", song.currentTime);

		ctx.globalAlpha = 1.0;
		ctx.fillStyle = "#FEF4EE";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		effect.update();
		effect.draw();
		ctx.fillStyle = "#000000";

		let fontAlpha = 1 - song.currentTime / 10;
		if (song.currentTime >= 9) fontAlpha = 0.0;
		if (song.currentTime >= 243) {
			fontAlpha = (20 - (263 - song.currentTime)) / 10;
		}
		ctx.globalAlpha = fontAlpha;
		ctx.textAlign = "center";
		if (isMobile) {
			ctx.font = "40px FKDisplay";
			ctx.fillText("Bundlr Quests", canvas.width / 2, canvas.height * 0.7);
			ctx.font = "20px FKDisplay";
			ctx.fillText("Quest 1: SDK Quest", canvas.width / 2, canvas.height * 0.7 + 35);
		} else {
			ctx.font = "50px FKDisplay";
			ctx.fillText("Bundlr Quests", canvas.width / 2, canvas.height * 0.9);
			ctx.font = "30px FKDisplay";
			ctx.fillText("Quest 1: SDK Quest", canvas.width / 2, canvas.height * 0.9 + 35);
		}

		requestAnimationFrame(animate);
	}
	animate();

	// helper stuff
	function randomInt(lowerBound, upperBound) {
		return Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
	}

	function randomFloat(lowerBound, upperBound) {
		return Math.random() * (upperBound - lowerBound + 1) + lowerBound;
	}

	// ChatGPT wrote this
	function randomClusteredPoint(centerX, centerY, radius, outsideChance = 0.1) {
		//console.log(centerX + " " + centerY + " " + radius + " " + outsideChance);
		// Generate a random number between 0 and 1
		const random = Math.random();
		// Check if the point should be outside the cluster
		if (random < outsideChance) {
			// Generate a random angle between 0 and 2*PI
			const angle = Math.random() * 2 * Math.PI;

			// Generate a random distance from the center outside the radius
			const distance = Math.random() * radius + radius;

			// Calculate the x and y coordinates of the point
			const x = centerX + distance * Math.cos(angle);
			const y = centerY + distance * Math.sin(angle);

			return [x, y];
		} else {
			//Generate a random angle between 0 and 2*PI
			const angle = Math.random() * 2 * Math.PI;

			// Generate a random distance from the center within the radius
			const distance = Math.random() * radius;

			// Calculate the x and y coordinates of the point
			const x = centerX + distance * Math.cos(angle);
			const y = centerY + distance * Math.sin(angle);
			return [x, y];
		}
	}

	/**
	 * @notice Helper function to map one scale to another
	 */
	function scale(number, inMin, inMax, outMin, outMax) {
		return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
	}

	function doParticlesCollide(newParticle, existingParticles) {
		const rect1 = {
			x: newParticle.getTopLeft().x,
			y: newParticle.getTopLeft().y,
			width: newParticle.getSize(),
			height: newParticle.getSize(),
		};
		for (let i = 0; i < existingParticles.length; i++) {
			const rect2 = {
				x: existingParticles[i].getTopLeft().x,
				y: existingParticles[i].getTopLeft().y,
				width: existingParticles[i].getSize(),
				height: existingParticles[i].getSize(),
			};
			if (
				rect1.x > rect2.x + rect2.width ||
				rect1.x + rect1.width < rect2.x ||
				rect1.y > rect2.y + rect2.height ||
				rect1.y + rect1.height < rect2.y
			) {
				// no collision
			} else {
				return true; // collision
			}
		}
		return false;
	}
});
