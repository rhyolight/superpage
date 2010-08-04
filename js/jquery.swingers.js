jQuery.fn.swing = function(cfg) {
    
    var $triggers = jQuery(cfg.trigger),
        $swingers = this,
        selectedIndex = null,
        animQueue = [],
        firstSwing = true,
        leftMod = cfg.left ? leftMod(cfg.left) : 0;
        easing = cfg.easing || 'easeOutBack';
    
    function leftMod(val) {
        if (val.substr(0,1) === '+') {
            if (val.substr(val.length-2,2) === 'px') {
                val = val.substr(1,val.length-3);
            }
            return new Number(val);
        }
        return 0;
    }
    
    function right(after, speed) {
        var $it = jQuery(this),
            left = window.outerWidth + 'px',
            top = cfg.top || (window.outerHeight / 2 - $it .height() / 2) + 'px';
        speed = speed || 'slow';
        $it.animate({left: left, top: top}, speed, easing, after);
    }
    
    function left(after, speed) {
        var $it = jQuery(this),
            left = '-' + ($it.width()+100) + 'px',
            top = cfg.top || (window.outerHeight / 2 - $it .height() / 2) + 'px';
        speed = speed || 'slow';
        $it.animate({left: left, top: top}, speed, easing, after);
    }
    
    function center(after, speed) {
        var $el = jQuery(this),
            top = cfg.top || (window.outerHeight / 2 - $el.height() / 2) + 'px',
            left = ((window.outerWidth / 2 - $el.width() / 2) + leftMod) + 'px';
        speed = speed || 'slow';
        $el.show();
        $el.animate({
            top: top,
            left: left
        }, speed, easing, after);
    }
    
    function processQueue() {
        if (animQueue.length) {
            var cmd = animQueue.shift();
            console.log('moving ' + $(cmd.scope).attr('class') + ' to ' + cmd.fn.name);
            cmd.fn.call(cmd.scope, processQueue, cmd.speed);
        }
    }
    
    function select() {
        var $s, i, inc, bumper, anim, oldIndex = selectedIndex || 0;
        
        selectedIndex = $swingers.index(this);
        
        if (oldIndex !== selectedIndex) {
            if (oldIndex < selectedIndex) {
                inc = 1;
                anim = left;
            } else if (oldIndex > selectedIndex){
                inc = -1
                anim = right;
            }
            animQueue.push({fn: anim, scope: $swingers.get(oldIndex), speed: 'fast'});

            for (i = (oldIndex+inc); i !== selectedIndex; i=i+inc) {
                $s = $swingers.get(i);
                animQueue.push({fn: anim, scope: $s, speed: 'fast'});
            }
        }
        
        if (firstSwing) {
            for (i = selectedIndex+1; i < $swingers.length; i++) {
                $s = $swingers.get(i);
                animQueue.push({fn: right, scope: $s, speed: 'fast'});
            }
            firstSwing = false;
        }
        
        animQueue.push({fn: center, scope: this});
        
        processQueue();

    }
    
    $triggers.click(function(e) {
        var id = jQuery(e.target).attr('href').substr(1);
        $swingers.filter('.' + id + '.swinger').each(select);
    });
    
    $swingers.css('left', window.outerWidth + 'px');
    select.call($swingers.filter(cfg.selected));

};