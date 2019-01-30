$(function() {
	
	var intervalId;

	var canvas$ = $('#canvas');

	let horizontalDirection = 'RIGHT';
	let verticalDirection = 'TOP';
	var arrBalls = [];

	class Ball {
		constructor(ball$) {
			this.ball$ = ball$;
			this.verticalDirection = 'TOP';
			this.horizontalDirection = 'LEFT';
			this.top = 0;
			this.left = 0;
			this.width = this.ball$.width();
			this.height = this.ball$.height();
		}

		changeDirection(_canvas, _arrBalls) {
			if(this.left + this.width === parseInt(_canvas.width())) {
				this.horizontalDirection = 'LEFT';
			} else if(this.left  === 0) {
				this.horizontalDirection = 'RIGHT';
			}

			if(this.top + this.width  === parseInt(_canvas.height())) {
				this.verticalDirection = 'TOP';
			} else if(this.top  === 0) {
				this.verticalDirection = 'BOTTOM';
			}

			_arrBalls.forEach((elem, i) => {
				if(this.left + this.width === elem.left && isSameY(this, elem)) {
					this.horizontalDirection = 'LEFT';
					elem.horizontalDirection = 'RIGHT';
				} else if(this.left === elem.left + elem.width && isSameY(this, elem)) {
					this.horizontalDirection = 'RIGHT';
					elem.horizontalDirection = 'LEFT';
				}

				if(this.top + this.height === elem.top && isSameX(this, elem)) {
					this.verticalDirection = 'TOP';
					elem.verticalDirection = 'BOTTOM';
				} else if(this.top === elem.top + elem.height && isSameX(this, elem)) {
					this.verticalDirection = 'BOTTOM';
					elem.verticalDirection = 'TOP';
				}
			});

			function isSameY(_this, elem) {
				if((_this.top >= elem.top && _this.top <= elem.top + elem.height) ||
					(elem.top >= _this.top && elem.top <= _this.top + _this.height)) {
					return true;
				} else {
					return false;
				}
			}

			function isSameX(_this, elem) {
				if((_this.left >= elem.left && _this.left <= elem.left + elem.width) ||
					(elem.left >= _this.left && elem.left <= _this.left + _this.width)) {
					return true;
				} else {
					return false;
				}
			}
		}

		move(_canvas, _arrBalls) {
			this.changeDirection(_canvas, _arrBalls);

			if(this.horizontalDirection === 'LEFT') {
				this.ball$.css('left', this.left-- + 'px');
				this.left--;
			} else {
				this.ball$.css('left', this.left++  + 'px');
				this.left++;
			}

			if(this.verticalDirection === 'TOP') {
				this.ball$.css('top', this.top-- + 'px');
				this.top--;
			} else {
				this.ball$.css('top', this.top++ + 'px');
				this.top++;
			}
		}
	}

	$('#addBall').click( function() {
		var ball = $('<div></div>');
		ball.text(setId());
		ball.attr('id', setId());
		var random = Math.round(Math.random() * 10);
		if(random > 4) {
			ball.addClass('red');
		} else {
			ball.addClass('green');
		}
		ball.on('click', onBallclick);
		canvas$.append(ball);
		arrBalls.push(new Ball(ball));
	});

	$('#start').click(function() {
		if(!intervalId) {
			intervalId = setInterval(function() {
				arrBalls.forEach(function(elem) {
					elem.move(canvas$, arrBalls);
				});
			}, 20);
		}
	})

	$('#stop').click(function() {
		clearInterval(intervalId);
		intervalId = null;
	})
	

	function onBallclick() {
		if($(this).hasClass('green')) {
			deleteElement(this);
			if($('.green').length == 0) {
				makeAllBallsRed();
			}
		} else {
			addTwoGreenBall();
		}
	}

	function addTwoGreenBall() {
		addGreenBall();
			setTimeout(function() {
				addGreenBall();
			}, 1000);
	}
	function addGreenBall() {
		var ball = $('<div></div>');
		ball.text(setId());
		ball.attr('id', setId());
		ball.addClass('green');
		ball.on('click', onBallclick);
		canvas$.append(ball);
		arrBalls.push(new Ball(ball, canvas$));
	} 

	function setId() {
		var id;
		if(arrBalls.length != 0) {
			id = +arrBalls[arrBalls.length - 1].ball$.text() + 1;
		} else {
			id = 0;
		}
		return id;
	}

	function makeAllBallsRed() {
		$('div').removeClass('red');
		$('div').addClass('green');
	}

	function deleteElement(el) {
		var id = $(el).attr('id');
		var elIndex;
		arrBalls.forEach(function (item, i) {
			if(item.ball$.attr('id') == id) {
				elIndex = arrBalls.indexOf(item);
			}
		})
		arrBalls.splice(elIndex, 1);
		el.remove();
	}
}) 