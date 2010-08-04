function Bits(canvasId, cfg) {
    var inst, limit, h, w,
        shapes = {
    		circle: _drawCircle, 
    		square: _drawSquare
    	},
        $canvas = $('canvas#' + canvasId);
    
    if (!$canvas) {
        throw new Error('No canvas with an id of "' + canvasId + '"');
    }
    
    var c = $canvas[0],
        ctx = c.getContext('2d');
    
    var inst = {
	    isPaused: false,
	    pause: pause,
	    resume: resume,
	    set: set
	};
	
    _init();

	// public
	function pause() {
	    inst.isPaused = true;
	}
	function resume() {
	    inst.isPaused = false;
	}
	function set(k, v) {
	    cfg[k] = v;
	}
    
    // private
	function _init() {
		h = c.width = window.innerWidth;
	    w = c.height = window.innerHeight;
		limit = h > w ? h : w;
		_draw(cfg.bg);
        setInterval(function() {
            _draw(cfg);
        }, cfg.every);
	}
	
	function _draw(cfg) {
	    if (inst.isPaused) {
			return;
		}
		if (cfg.gridlock) {
    		_drawGridlock(cfg);
		} else {
		    _drawRandom(cfg);
		}
	}
	
	function _drawGridlock(cfg) {
        var clr = cfg.clr1, i, j, x, y, stroke;
        for (i=0; i<limit; i=i+cfg.width) {
            for (j=0; j<limit; j=j+cfg.width) {
                stroke = cfg.stroke;
                clr = clr === cfg.clr1 ? cfg.clr2 : cfg.clr1;
                _drawSquare(clr, j, i, cfg.width, stroke);
            }
            if (!cfg.striped) {
                clr = clr === cfg.clr1 ? cfg.clr2 : cfg.clr1;
            }
        }
    }
    
    function _drawRandom(cfg) {
        var i, x, y, stroke, clr;
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
    
    function _drawSquare(clr, x, y, w, stroke) {
		if (stroke) {
			ctx.strokeStyle = stroke;
			ctx.strokeRect(x, y, w, w);
		}
		ctx.fillStyle = clr;
		ctx.fillRect(x, y, w, w);
	}
	
	function _drawCircle(clr, x, y, w, stroke) {
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
	
	function _drawMouseMove(cfg) {
	    _drawCircle(cfg.color, cfg.x, cfg.y, cfg.w, cfg.stroke);
	}
	
	function _mouseMove(e) {
	    if (inst.isPaused) {
			return;
		}
	    var cell = _getCursorPosition(e);
	    var conf = {
	        x: cell[0],
	        y: cell[1],
	        w: 10,
	        color: cfg.mousemove.color,
	        stroke: cfg.mousemove.stroke
	    }
	    _drawMouseMove(conf);
	}
	
    function _getCursorPosition(e) {
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
    
    c.addEventListener('mousemove', _mouseMove, false);
	
	$(window).bind('resize', function() {
        _init();
    });
    
	return inst;
}