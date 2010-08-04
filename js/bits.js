$(function () {
    
    window.BITS = {
        cfg: {},
        init: function(cfg) {
            this.cfg = cfg;
            init(this.cfg.bg);
        },
        isPaused: function() {
            return this.cfg.pause;
        },
        pause: function() {
            this.cfg.pause = true;
        },
        resume: function() {
            this.cfg.pause = false;
        },
        set: function(key, val) {
            this.cfg[key] = val;
        }
    };
    
	var c = document.getElementById('bits'),
		ctx = c.getContext('2d'),
		h, w, limit,
		shapes = {
			circle: drawLittleCircle, 
			square: drawLittleSquare
		},
		i, j, clr;
		
	function init(cfg) {
		w = c.width = window.innerWidth;
		h = c.height = window.innerHeight;
		limit = h > w ? h : w;
		draw(cfg);
		setInterval(draw, BITS.cfg.every);
	}
		
	function draw(cfg) {

		cfg = cfg || BITS.cfg;
		
		if (BITS.isPaused()) {
			return;
		}
		w = c.width;
		h = c.height;
		limit = h > w ? h : w;
		
		if (cfg.gridlock) {
    		drawGridlock(cfg);
		} else {
		    drawRandom(cfg);
		}
		
	}

    function drawGridlock(cfg) {
        var clr = cfg.clr1, i, j, x, y, stroke;
        for (i=0; i<limit; i=i+cfg.width) {
            for (j=0; j<limit; j=j+cfg.width) {
                stroke = cfg.stroke;
                clr = clr === cfg.clr1 ? cfg.clr2 : cfg.clr1;
                drawLittleSquare(clr, j, i, cfg.width, stroke);
            }
            if (!cfg.striped) {
                clr = clr === cfg.clr1 ? cfg.clr2 : cfg.clr1;
            }
        }
    }
    
    function drawRandom(cfg) {
        var i, x, y, stroke;
        for (i=0; i<cfg.times; i++) {
			x = Math.round(Math.random()*limit);
			y = Math.round(Math.random()*limit);
			clr = Math.random() < 0.5 ? cfg.clr1 : cfg.clr2;
			stroke = clr === cfg.clr1 ? cfg.clr2 : cfg.clr1
			if (shapes[cfg.shape] instanceof Function) {
			    shapes[cfg.shape](clr, x, y, cfg.width, cfg.stroke);
		    }
		}
    }
	
	function drawLittleCircle(clr, x, y, w, stroke) {
		ctx.beginPath();
		ctx.arc(x,y, w/2, 0, Math.PI*2, true);
		ctx.closePath();
		if (stroke) {
			ctx.strokeStyle = stroke;
			ctx.stroke();
		}
		ctx.fillStyle = clr;
		ctx.fill();
	}
	
	function drawLittleSquare(clr, x, y, w, stroke) {
		if (stroke) {
			ctx.strokeStyle = stroke;
			ctx.strokeRect(x, y, w, w);
		}
		ctx.fillStyle = clr;
		ctx.fillRect(x, y, w, w);
	}
	
	function mouseMoveAnimation(cfg) {
	    drawLittleCircle(cfg.color, cfg.x, cfg.y, cfg.w, cfg.stroke);
	}
	
	function mouseMove(e) {
	    var cell = getCursorPosition(e);
	    var cfg = {
	        x: cell[0],
	        y: cell[1],
	        w: 10,
	        color: BITS.cfg.mousemove.color,
	        stroke: BITS.cfg.mousemove.stroke
	    }
	    mouseMoveAnimation(cfg);
	}
	
    function getCursorPosition(e) {
        var x, y;
        if (e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY;
        } else {
            x = e.clientX + document.body.scrollLeft +
                document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop +
                document.documentElement.scrollTop;
        }
        return [x,y];
    }
    
    
    $(window).bind('resize', function() {
        init(BITS.cfg.bg);
    });
    
    c.addEventListener('mousemove', mouseMove, false);
	
});