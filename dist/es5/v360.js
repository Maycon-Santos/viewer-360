"use strict";

Object.prototype.merge = function (object) {
    for (var key in object) {
        this[key] = object[key];
    }
};
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var V360 = function () {
        function V360() {
                _classCallCheck(this, V360);

                // Get all elements with attribute v360 or V360
                var $v360 = document.querySelectorAll('[v360], [V360]');

                // Transform this elements into Viewer 360
                for (var i = 0, l = $v360.length; i < l; i++) {
                        this.init($v360[i]);
                }
        }

        _createClass(V360, [{
                key: 'init',
                value: function init($target) {

                        // If you receive start 2 times in a row
                        if ($target.v360 && $target.v360.played) return $target.v360.restart();

                        // It's like an instance. Saves properties for this element
                        var props = {

                                target: $target,

                                srcs: undefined,
                                sprite: undefined,
                                frames: 0,
                                dragSensitivity: 5,

                                canvas: this.appendCanvas($target),

                                imgs: [],
                                currentFrame: 0,

                                allowDrag: true,
                                mousePressing: undefined,
                                mouseStart: 0,

                                loadedImages: 0,
                                allLoaded: false

                        };

                        // Replace all ' to "
                        props.merge(JSON.parse($target.getAttribute('v360').replace(/\'/g, '"')));

                        // Preload all images
                        this.preload(props);
                        this.onresize(props);

                        // Adds "commands" to the element (DOM)
                        this.V360DOM($target, props);
                }
        }]);

        return V360;
}();

// On load the page instance the V360


window.addEventListener('load', function () {
        return window.v360 = new V360();
});
'use strict';

V360.prototype.appendCanvas = function ($target) {

    var canvas = {};

    canvas.target = document.createElement('canvas');
    this.resizeCanvas($target, canvas.target);

    canvas.ctx = canvas.target.getContext('2d');

    var canvasStyle = {
        webkitTouchCallout: 'none',
        webkitUserSelect: 'none',
        khtmlUserSelect: 'none',
        mozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',

        msTouchAction: 'pan-y',
        touchAction: 'pan-y'
    };

    Object.keys(canvasStyle).map(function (style) {
        return canvas.target.style[style] = canvasStyle[style];
    });

    $target.appendChild(canvas.target);

    return canvas;
};
"use strict";

/*  
    * Github: https://gist.github.com/gre/1650294
    * Easing Functions - inspired from http://gizma.com/easing/
    * only considering the t value for the range [0, 1] => [0, 1]
*/
V360.prototype.easingFunctions = {
    // no easing, no acceleration
    linear: function linear(t) {
        return t;
    },
    // accelerating from zero velocity
    easeInQuad: function easeInQuad(t) {
        return t * t;
    },
    // decelerating to zero velocity
    easeOutQuad: function easeOutQuad(t) {
        return t * (2 - t);
    },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function easeInOutQuad(t) {
        return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    // accelerating from zero velocity 
    easeInCubic: function easeInCubic(t) {
        return t * t * t;
    },
    // decelerating to zero velocity 
    easeOutCubic: function easeOutCubic(t) {
        return --t * t * t + 1;
    },
    // acceleration until halfway, then deceleration 
    easeInOutCubic: function easeInOutCubic(t) {
        return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    // accelerating from zero velocity 
    easeInQuart: function easeInQuart(t) {
        return t * t * t * t;
    },
    // decelerating to zero velocity 
    easeOutQuart: function easeOutQuart(t) {
        return 1 - --t * t * t * t;
    },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function easeInOutQuart(t) {
        return t < .5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },
    // accelerating from zero velocity
    easeInQuint: function easeInQuint(t) {
        return t * t * t * t * t;
    },
    // decelerating to zero velocity
    easeOutQuint: function easeOutQuint(t) {
        return 1 + --t * t * t * t * t;
    },
    // acceleration until halfway, then deceleration 
    easeInOutQuint: function easeInOutQuint(t) {
        return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    }
};
'use strict';

V360.prototype.preload = function (props) {

        // Preload all images
        for (var j = 1; j <= props.frames; j++) {

                // Insert and get img from the array
                var img = props.imgs[props.imgs.push(new Image()) - 1];

                img.onload = this.onload(props);

                // If is sprite
                if (props.sprite) {
                        img.src = props.sprite;
                        break;
                }

                img.src = props.srcs.replace('#{frame}', ('000' + j).slice(-3));
        }
};
"use strict";

// Place canvas in container size
V360.prototype.resizeCanvas = function ($target, $canvas) {

    $canvas.width = $target.offsetWidth;
    $canvas.height = $target.offsetHeight;
};
"use strict";

V360.prototype.resizeImage = function (props) {

        var $canvas = props.canvas.target;
        var imgs = props.imgs;
        var sprite = !!props.sprite; // Is a sprite
        var frames = props.frames;

        for (var i = 0, l = imgs.length; i < l; i++) {

                var $img = imgs[i];

                if (sprite) $img.realWidth = $img.realWidth / frames;

                // Simple rule of 3
                $img.height = $img.realHeight * $canvas.width / $img.realWidth;
                $img.width = $canvas.width;

                if ($img.width > $canvas.width || $img.height > $canvas.height) {

                        // Simple rule of 3
                        $img.height = $canvas.height;
                        $img.width = $img.realWidth * $canvas.height / $img.realHeight;
                }

                if (sprite) {
                        $img.width = $img.width * frames;
                        $img.realWidth = $img.realWidth * frames;
                }
        }
};
"use strict";

V360.prototype.setImage = function (props, n) {

    if (!props.allLoaded) return;

    var $canvas = props.canvas.target;
    var ctx = props.canvas.ctx;
    var imgs = props.imgs;
    var frames = props.frames;
    var sprite = !!props.sprite;

    var $img = imgs[sprite ? 0 : n];

    ctx.clearRect(0, 0, $canvas.width, $canvas.height);

    if (sprite) {

        var pos = -($img.width / frames * n);
        var spriteWidth = $img.width / frames;

        ctx.drawImage($img, pos, 0, $img.width, $img.height);

        ctx.clearRect(spriteWidth, 0, $canvas.width - spriteWidth, $canvas.height);
    } else ctx.drawImage($img, 0, 0, $img.width, $img.height);
};
'use strict';

V360.prototype.V360DOM = function ($target, props) {
    var _this = this;

    var $canvas = props.canvas.target;
    var frames = props.frames - 1;

    // Handles
    var mousedownHandle = this.onmousedown(props);
    var mouseupHandle = this.onmouseup(props);
    var mousemoveHandle = this.onmousemove(props);
    var resizeHandle = this.onresize(props);

    $canvas.addEventListener('mousedown', mousedownHandle);
    window.addEventListener('mouseup', mouseupHandle);
    window.addEventListener('mousemove', mousemoveHandle);

    $canvas.addEventListener('touchstart', mousedownHandle);
    window.addEventListener('touchend', mouseupHandle);
    window.addEventListener('touchmove', mousemoveHandle);

    window.addEventListener('resize', resizeHandle);

    $target.v360 = { played: true };

    $target.v360.start = function () {

        _this.init($target);

        $target.v360.played = true;
    };

    $target.v360.stop = function () {

        // Remove events
        $canvas.removeEventListener('mousedown', mousedownHandle);
        window.removeEventListener('mouseup', mouseupHandle);
        window.removeEventListener('mousemove', mousemoveHandle);

        $canvas.removeEventListener('touchstart', mousedownHandle);
        window.removeEventListener('touchend', mouseupHandle);
        window.removeEventListener('touchmove', mousemoveHandle);

        window.removeEventListener('resize', resizeHandle);

        // Remove canvas of the DOM
        if ($canvas) $canvas.remove();

        $target.v360.played = false;
    };

    $target.v360.restart = function () {

        $target.v360.stop();
        $target.v360.start();
    };

    var stopAnimation = void 0;
    $target.v360.animate = function (to, duration) {
        var easingFunction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'linear';
        var callback = arguments[3];


        var start = performance.now();
        var progressed = 0;

        props.allowDrag = false;

        requestAnimationFrame(function animate(time) {

            var timeFraction = (time - start) / duration;

            // Calculate the current animation state
            var progress = this.easingFunctions[easingFunction || 'linear'](timeFraction);

            if (to == Infinity || to == -Infinity) {

                if (~~timeFraction > progressed) {
                    progressed = ~~timeFraction;
                    props.currentFrame += to == Infinity ? 1 : -1;
                }
            } else if (~~(progress * Math.abs(to)) > progressed) {

                progressed = ~~(progress * Math.abs(to));

                var direction = to / Math.abs(to);
                var nextFrame = props.currentFrame + ~~(progress * to);
                nextFrame = Math.abs(nextFrame / Math.abs(nextFrame));

                if (direction < 0) nextFrame = -nextFrame;

                props.currentFrame += nextFrame;
            }

            if (props.currentFrame > frames) props.currentFrame = 0;else if (props.currentFrame < 0) props.currentFrame = frames;

            this.setImage(props, props.currentFrame);

            if (stopAnimation) return props.allowDrag = !(stopAnimation = false);

            if (to == Infinity || to == -Infinity) return requestAnimationFrame(animate.bind(this));

            if (timeFraction < 1) return requestAnimationFrame(animate.bind(this));else if (typeof callback == 'function') return callback();

            // If you get here means the animation has come to an end
            props.allowDrag = true;
        }.bind(_this));
    };

    $target.v360.stopAnimation = function () {
        return stopAnimation = true;
    };

    $target.v360.onload = null;
};
'use strict';

V360.prototype.onload = function (props) {
        var _this = this;

        return function (e) {

                props.loadedImages++;

                e.target.realWidth = e.target.width;
                e.target.realHeight = e.target.height;

                // If did not load all images ends here
                if (props.loadedImages < props.frames && !props.sprite) return;

                props.allLoaded = props.allowDrag = true;

                _this.resizeImage(props);
                _this.setImage(props, props.currentFrame);

                if (typeof props.target.v360.onload == 'function') props.target.v360.onload();
        };
};
"use strict";

V360.prototype.onmousedown = function (props) {

        return function (e) {

                // If drag dont's allowed stop here
                if (!props.allowDrag) return;

                // Serves to inform the other functions that the user began to drag
                props.mousePressing = true;

                // Saves the mouse or touch point
                props.mouseStart = e.pageX || e.touches[0].screenX;
        };
};
'use strict';

V360.prototype.onmousemove = function (props) {
        var _this = this;

        return function (e) {

                // If is mouse event set preventDefault()
                if (e.type != 'touchmove') e.preventDefault();

                // If you did not start the drag stop here
                if (!props.mousePressing) return;

                // Saves the mouse or touch point current
                var pageX = e.pageX || e.touches[0].screenX;

                var mouseMoved = (props.mouseStart - pageX) / props.dragSensitivity;

                // Reverse the number pole
                if (mouseMoved > 1) mouseMoved = 1;
                if (mouseMoved < -1) mouseMoved = -1;

                if (Math.abs(mouseMoved) == 1) {

                        // Switches the starting point to the current
                        props.mouseStart = pageX;

                        var roundMouseMoved = Math.round(mouseMoved);

                        props.currentFrame += roundMouseMoved / Math.abs(roundMouseMoved);

                        // If the frame is greater than the maximum frame it returns to 0
                        if (props.currentFrame > props.frames - 1) props.currentFrame = 0;

                        // If the frame is below 0 it will be the maximum
                        if (props.currentFrame < 0) props.currentFrame = props.frames - 1;

                        // Draw image
                        _this.setImage(props, props.currentFrame);
                }
        };
};
"use strict";

V360.prototype.onmouseup = function (props) {

    return function () {

        // Serves to inform the other functions that the user stopped dragging
        props.mousePressing = false;
        props.mouseStart = 0;
    };
};
"use strict";

V360.prototype.onresize = function (props) {
        var _this = this;

        return function () {

                var $target = props.target;
                var $canvas = props.canvas.target;

                // If the container changes size
                if ($canvas.width != $target.offsetWidth || $canvas.height != $target.height) {

                        var currentFrame = props.currentFrame;

                        _this.resizeCanvas($target, $canvas);
                        _this.resizeImage(props);

                        _this.setImage(props, currentFrame);
                }
        };
};
'use strict';

// Restart the viewer
V360.prototype.restart = function () {

    var $v360 = document.querySelectorAll('[v360], [V360]');

    for (var i = 0, l = $v360.length; i < l; i++) {
        $v360[i].v360.restart();
    }
};
"use strict";

// Transform an element that is not a 360 viewer into a
V360.prototype.set = function ($element, props, callback) {

    $element.setAttribute('v360', JSON.stringify(props).replace(/\"/g, "'"));

    this.init($element);

    $element.v360.onload = callback;

    return $element.v360;
};
'use strict';

// Start viewer (Do not confuse with $DOM.v360.animation)
V360.prototype.start = function () {

    var $v360 = document.querySelectorAll('[v360], [V360]');

    for (var i = 0, l = $v360.length; i < l; i++) {
        $v360[i].v360.start();
    }
};
'use strict';

// Stop the viewer (Do not confuse with $DOM.v360.stopAnimation)
V360.prototype.stop = function () {

    var $v360 = document.querySelectorAll('[v360], [V360]');

    for (var i = 0, l = $v360.length; i < l; i++) {
        $v360[i].v360.stop();
    }
};
//# sourceMappingURL=v360.js.map
