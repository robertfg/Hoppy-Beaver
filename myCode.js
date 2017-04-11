var sketchProc = function( processingInstance ){
	with ( processingInstance ){

		/* **********	BEGIN GENERAL NONCUSTOM CODE	********** */

		processingInstance.size(400, 400);
		processingInstance.background(0xFFF);

		var mouseIsPressed = false;
		processingInstance.mousePressed = function () { mouseIsPressed = true; };
		processingInstance.mouseReleased = function () { mouseIsPressed = false; };

		var keyIsPressed = false;
		processingInstance.keyPressed = function () { keyIsPressed = true; };
		processingInstance.keyReleased = function () { keyIsPressed = false; };

		// This function is required to use "getImage"
		function getImage(s) {
			processingInstance.externals.sketch.imageCache.add(s);
			return processingInstance.loadImage(s);
		}
		
		/* **********	BEGIN GENERAL CUSTOM CODE	********** */
		
		// Set the size of the canvas, draw rate, and background color
		//size(400, 400);
		//background(235, 235, 235);

		/* **********	BEGIN SPECIFIC CUSTOM CODE	********** */

		// Constants
		const SPACE_BAR = 0;

		const HOP_RATE = 5;
		const FALL_RATE = 5;
		const POOP_FALL_RATE = 3;
		const SIDE_RATE = 1;
		const POOPER_SPEED = 2;
		
		/* ******************************
		*			Beaver				*
		******************************* */

		// Create Beaver object
		var Beaver = function(x, y) {
			this.x = x;
			this.y = y;
			this.img = getImage("Hopper-Happy.png");
			this.sticks = 0;
		};

		// Method to draw the Beaver
		Beaver.prototype.draw = function() {
			fill(255, 0, 0);
			this.x = constrain(this.x, 0, width-40);
			this.y = constrain(this.y, 0, height-50);
			image(this.img, this.x, this.y, 40, 40);
		};

		// Method to hop
		Beaver.prototype.hop = function() {
			this.img = getImage("Hopper-Jumping.png");
			this.y -= HOP_RATE;
		};

		// Method to fall
		Beaver.prototype.fall = function() {
			this.img = getImage("Hopper-Happy.png");
			this.y += FALL_RATE;
		};

		// Method to move side to side
		Beaver.prototype.sideways = function(rate) {
			this.x += rate;
		};
		
		// Method to grab sticks
		Beaver.prototype.checkForStickGrab = function(stick) {
			if ( ( stick.x >= this.x && stick.x <= (this.x + 40) ) &&
				 ( stick.y >= this.y && stick.y <= (this.y + 40) ) ) {
				stick.y = -400;
				this.sticks++;
			}
		};

		// Method to check for collision with pooper 
		Beaver.prototype.pooperCollision = function(pooper) {
			// pooper on left, right: 60, 40; pooper on top, bottom; 60, 40
			if ( ( pooper.x >= (this.x-40) ) && ( pooper.x <= (this.x + 20) ) &&
				 ( pooper.y >= (this.y-40) ) && ( pooper.y <= (this.y + 20) ) ) {
				return 1;
			}
			return 0;
		};

		// Method to check for collision with poops
		Beaver.prototype.poopCollision = function(poop) {
			if ( ( poop.x >= this.x && poop.x <= (this.x + 40) ) &&
				 ( poop.y >= this.y && poop.y <= (this.y + 40) ) ) {
				return 1;
			}
			return 0;
		};

		/* ******************************
		*			Stick				*
		******************************* */
		
		// Create Stick object
		var Stick = function(x, y) {
			this.x = x;
			this.y = y;
		};

		// Method to draw the stick, draw rectangle from center
		Stick.prototype.draw = function() {
			fill(89, 71, 0);
			rectMode(CENTER);
			rect(this.x, this.y, 5, 40);
		};

		// Initialize the sticks array with 40 sticks, x & y coordinates
		var sticks = [];
		for (var i = 0; i < 40; i++) {
			sticks.push(new Stick(i * 40 + 300, random(20, 260)));
		}

		/* ******************************
		*			Grass				*
		******************************* */
		
		// Initialize the grass array
		var grassXs = [];
		for (var i = 0; i < 25; i++) {
			grassXs.push(i*20);
		}
		
		/* ******************************
		*			Poop				*
		****************************** */

		// Initialize the poop array
		var poops = [];
		
		// Create Poop object
		var Poop = function(x, y) {
			this.x = x+30;
			this.y = y+55;
		};
		
		// Method to draw the poop from the center
		Poop.prototype.draw = function() {
			fill(130, 79, 43);
			ellipseMode(CENTER);
			ellipse(this.x, this.y, 5, 5);
		};

		// Method to drop the poop
		Poop.prototype.drop = function() {
			this.y += POOP_FALL_RATE;
		};

		/* ******************************
		 *			Pooper				*
		 ****************************** */

		// Create Pooper object
		var Pooper = function() {
			this.x = random(400, 1860);	// based on sticks
			this.y = random(20, 260);	// same as sticks
			this.img = getImage("mr-pants.png");
		};
		
		// Method to draw the Pooper
		Pooper.prototype.draw = function() {
			image(this.img, this.x, this.y, 60, 60);
		};

		// Method to move
		Pooper.prototype.move = function() {
			this.img = getImage("mr-pants.png");
			this.x -= POOPER_SPEED;
		};

		// Method to poop
		Pooper.prototype.poop = function() {
			this.img = getImage("mr-pants-green.png");
			this.x -= POOPER_SPEED;
			
			// Add to the array
			poops.push(new Poop(this.x, this.y));
		};

		 /* ******************************
		 *			Draw				*
		 ****************************** */
		
		// Draw the beaver and the pooper
		var beaver = new Beaver(180, 350);
		var pooper = new Pooper();
		
		// Draw function 
		draw = function() {
			/*	BACKGROUND	*/
			
			// Draw the sky and ground
			background(227, 254, 255);
			fill(130, 79, 43);
			rectMode(CORNER);
			rect(0, height*0.90, width, height*0.10);		

			// Draw the grass
			for (var i = 0; i < grassXs.length; i++) {
				// The grass starts at 87% of the screen and is 3% high
				image(getImage("GrassBlock.png"), grassXs[i], height*0.87, 20, height*0.03);
				
				// grass speed
				grassXs[i] -= 1;
				
				// Wrap grass so it flows continuously
				if ( grassXs[i] <= -20 ) {
					grassXs[i] = width;
				}
			}
			
			// Draw the sticks
			for (var i = 0; i < sticks.length; i++) {
				sticks[i].draw();

				// Call the routine to check for stick grabs
				beaver.checkForStickGrab(sticks[i]);

				// stick speed
				sticks[i].x -= 1;
			}
			
			// Move the pooper
			if ( ( floor(random(1, 14)) ) === 7 ) {
				pooper.poop();
			} else {
				pooper.move();
			}
			
			// Display the score
			textSize(18);
			text("Score: " + beaver.sticks, 20, 20);

			// If you get 95%, display the "win" message
			if ( beaver.sticks / sticks.length >= 0.95 ) {
				fill(255, 0, 0);
				textSize(36);
				text("YOU WIN!!!!", 100, 200);
				exit();
			}

			// Check for the key pressed
			if ( keyIsPressed ) {
				switch ( keyCode ) {
					case SPACE_BAR:
						beaver.hop();
						break;
					case LEFT:
						beaver.sideways(-SIDE_RATE);
						beaver.fall();
						break;  
					case RIGHT:
						beaver.sideways(SIDE_RATE); 
						beaver.fall();
						break;
				}
			} else {
				beaver.fall();
			}
			
			// Draw the poops
			for (var i = 0; i < poops.length; i++) {
				poops[i].draw();
				poops[i].drop();
				
				// Check for a collision
				if ( beaver.poopCollision(poops[i]) ) {
					fill(255, 0, 0);
					textSize(36);
					text("YOU LOSE!!!!", 100, 200);
					exit();
					
				}
			}
		
			// Draw the beaver and the pooper
			beaver.draw();
			pooper.draw();
			
			// Check for a collision
			if ( beaver.pooperCollision(pooper) ) {
				fill(255, 0, 0);
				textSize(36);
				text("YOU LOSE!!!!", 100, 200);
				exit();
			}
		};

		/* **********	END SPECIFIC CUSTOM CODE	********** */
	}
};
