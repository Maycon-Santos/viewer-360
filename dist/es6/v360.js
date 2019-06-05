Object.prototype.merge = function(object){
    for (const key in object) this[key] = object[key];
}
class V360{

    constructor(){

        // Get all elements with attribute v360 or V360
        const $v360 = document.querySelectorAll('[v360], [V360]');

        // Transform this elements into Viewer 360
        for (let i = 0, l = $v360.length; i < l; i++)
            this.init($v360[i]);

    }

    init($target){

        // If you receive start 2 times in a row
        if($target.v360 && $target.v360.played)
            return $target.v360.restart();

        // It's like an instance. Saves properties for this element
        const props = {

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

}

// On load the page instance the V360
window.addEventListener('load', () => window.v360 = new V360());
V360.prototype.appendCanvas = function($target){

    let canvas = {};

    canvas.target = document.createElement('canvas');
    this.resizeCanvas($target, canvas.target);

    canvas.ctx = canvas.target.getContext('2d');

    const canvasStyle = {
        webkitTouchCallout: 'none',
        webkitUserSelect: 'none',
        khtmlUserSelect: 'none',
        mozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',

        msTouchAction: 'pan-y',
        touchAction: 'pan-y'
    };
    
    Object.keys(canvasStyle).map(style =>
        canvas.target.style[style] = canvasStyle[style]);

    $target.appendChild(canvas.target);

    return canvas;

}
/*  
    * Github: https://gist.github.com/gre/1650294
    * Easing Functions - inspired from http://gizma.com/easing/
    * only considering the t value for the range [0, 1] => [0, 1]
*/
V360.prototype.easingFunctions = {
    // no easing, no acceleration
    linear: function (t) { return t },
    // accelerating from zero velocity
    easeInQuad: function (t) { return t*t },
    // decelerating to zero velocity
    easeOutQuad: function (t) { return t*(2-t) },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
    // accelerating from zero velocity 
    easeInCubic: function (t) { return t*t*t },
    // decelerating to zero velocity 
    easeOutCubic: function (t) { return (--t)*t*t+1 },
    // acceleration until halfway, then deceleration 
    easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
    // accelerating from zero velocity 
    easeInQuart: function (t) { return t*t*t*t },
    // decelerating to zero velocity 
    easeOutQuart: function (t) { return 1-(--t)*t*t*t },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
    // accelerating from zero velocity
    easeInQuint: function (t) { return t*t*t*t*t },
    // decelerating to zero velocity
    easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
    // acceleration until halfway, then deceleration 
    easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}
V360.prototype.preload = function(props){

    // Preload all images
    for(let j = 1; j <= props.frames; j++){

        // Insert and get img from the array
        const img = props.imgs[props.imgs.push(new Image()) - 1];

        img.onload = this.onload(props);

        // If is sprite
        if(props.sprite){
            img.src = props.sprite;
            break;
        }

        img.src = props.srcs.replace('#{frame}', ('000' + j).slice(-3));

    }

}
// Place canvas in container size
V360.prototype.resizeCanvas = function($target, $canvas){

    $canvas.width = $target.offsetWidth;
    $canvas.height = $target.offsetHeight;

}
V360.prototype.resizeImage = function(props){

    const $canvas = props.canvas.target;
    const imgs = props.imgs;
    const sprite = !!props.sprite; // Is a sprite
    const frames = props.frames;

    for(let i = 0, l = imgs.length; i < l; i++){

        const $img = imgs[i];

        if(sprite) $img.realWidth = $img.realWidth / frames;

        // Simple rule of 3
        $img.height = ($img.realHeight * $canvas.width) / $img.realWidth;
        $img.width = $canvas.width;

        if($img.width > $canvas.width || $img.height > $canvas.height){

            // Simple rule of 3
            $img.height = $canvas.height;
            $img.width = ($img.realWidth * $canvas.height) / $img.realHeight;

        }

        if(sprite) {
            $img.width = $img.width * frames;
            $img.realWidth = $img.realWidth * frames;
        }

    }

}
V360.prototype.setImage = function(props, n){

    if(!props.allLoaded) return;

    const $canvas = props.canvas.target;
    const ctx = props.canvas.ctx;
    const imgs = props.imgs;
    const frames = props.frames;
    const sprite = !!props.sprite;

    const $img = imgs[sprite ? 0 : n];

    ctx.clearRect(0, 0, $canvas.width, $canvas.height);

    if(sprite){

        const pos = -(($img.width / frames) * n);
        const spriteWidth = $img.width / frames;

        ctx.drawImage($img, pos, 0, $img.width, $img.height);

        ctx.clearRect(spriteWidth, 0, $canvas.width - spriteWidth, $canvas.height);
        
    }else {
        console.log($img, n)
        ctx.drawImage($img, 0, 0, $img.width, $img.height);
    }

}
V360.prototype.V360DOM = function($target, props){

    const $canvas = props.canvas.target;
    const frames = props.frames - 1;

    // Handles
    const mousedownHandle = this.onmousedown(props);
    const mouseupHandle = this.onmouseup(props);
    const mousemoveHandle = this.onmousemove(props);
    const resizeHandle = this.onresize(props);

    $canvas.addEventListener('mousedown', mousedownHandle);
    window.addEventListener('mouseup', mouseupHandle);
    window.addEventListener('mousemove', mousemoveHandle);
    
    $canvas.addEventListener('touchstart', mousedownHandle);
    window.addEventListener('touchend', mouseupHandle);
    window.addEventListener('touchmove', mousemoveHandle);

    window.addEventListener('resize', resizeHandle);

    $target.v360 = { played: true };

    $target.v360.start = () => {

        this.init($target);

        $target.v360.played = true;

    }

    $target.v360.stop = () => {

        // Remove events
        $canvas.removeEventListener('mousedown', mousedownHandle);
        window.removeEventListener('mouseup', mouseupHandle);
        window.removeEventListener('mousemove', mousemoveHandle);

        $canvas.removeEventListener('touchstart', mousedownHandle);
        window.removeEventListener('touchend', mouseupHandle);
        window.removeEventListener('touchmove', mousemoveHandle);

        window.removeEventListener('resize', resizeHandle);

        // Remove canvas of the DOM
        if($canvas) $canvas.remove();

        $target.v360.played = false;

    }

    $target.v360.restart = () => {

        $target.v360.stop();
        $target.v360.start();

    }

    let stopAnimation;
    $target.v360.animate = (to, duration, easingFunction = 'linear', callback) => {

        let start = performance.now();
        let progressed = 0;

        props.allowDrag = false;

        requestAnimationFrame(function animate(time){

            let timeFraction = (time - start) / duration;
        
            // Calculate the current animation state
            let progress = this.easingFunctions[easingFunction || 'linear'](timeFraction);
        
            if(to == Infinity || to == -Infinity){

                if(~~timeFraction > progressed){
                    progressed = ~~timeFraction;
                    props.currentFrame += (to == Infinity) ? 1 : -1;
                }

            }else if(~~(progress * Math.abs(to)) > progressed){

                progressed = ~~(progress * Math.abs(to));

                let direction = to / Math.abs(to);
                let nextFrame = props.currentFrame + ~~(progress * to);
                nextFrame = Math.abs(nextFrame / Math.abs(nextFrame));

                if(direction < 0) nextFrame = -nextFrame;
                
                props.currentFrame += nextFrame;

            }

            if(props.currentFrame > frames) props.currentFrame = 0;
            else if(props.currentFrame < 0) props.currentFrame = frames;

            this.setImage(props, props.currentFrame);

            if(stopAnimation) return props.allowDrag = !(stopAnimation = false);

            if(to == Infinity || to == -Infinity) return requestAnimationFrame(animate.bind(this));

            if(timeFraction < 1) return requestAnimationFrame(animate.bind(this));
            else if(typeof callback == 'function')return callback();

            // If you get here means the animation has come to an end
            props.allowDrag = true;

        }.bind(this));

    }

    $target.v360.stopAnimation = () => stopAnimation = true;

    $target.v360.onload = null;

}
V360.prototype.onload = function(props){

    return e => {

        props.loadedImages++;

        e.target.realWidth = e.target.width;
        e.target.realHeight = e.target.height;

        // If did not load all images ends here
        if(props.loadedImages < props.frames && !props.sprite) return;

        props.allLoaded = props.allowDrag = true;

        this.resizeImage(props);
        this.setImage(props, props.currentFrame);

        if(typeof props.target.v360.onload == 'function')
            props.target.v360.onload();

    }

}
V360.prototype.onmousedown = function(props){

    return e => {

        // If drag dont's allowed stop here
        if(!props.allowDrag) return;

        // Serves to inform the other functions that the user began to drag
        props.mousePressing = true;

        // Saves the mouse or touch point
        props.mouseStart = e.pageX || e.touches[0].screenX;

    }

}
V360.prototype.onmousemove = function(props){

    return e => {

        // If is mouse event set preventDefault()
        if(e.type != 'touchmove') e.preventDefault();

        // If you did not start the drag stop here
        if(!props.mousePressing) return;

        // Saves the mouse or touch point current
        const pageX = e.pageX || e.touches[0].screenX;

        let mouseMoved = (props.mouseStart - pageX) / props.dragSensitivity;

        // Reverse the number pole
        if(mouseMoved > 1) mouseMoved = 1;
        if(mouseMoved < -1) mouseMoved = -1;

        if(Math.abs(mouseMoved) == 1){

            // Switches the starting point to the current
            props.mouseStart = pageX;

            let roundMouseMoved = Math.round(mouseMoved);

            props.currentFrame += roundMouseMoved / Math.abs(roundMouseMoved);

            // If the frame is greater than the maximum frame it returns to 0
            if(props.currentFrame > props.frames - 1) props.currentFrame = 0;

            // If the frame is below 0 it will be the maximum
            if(props.currentFrame < 0) props.currentFrame = props.frames - 1;

            // Draw image
            this.setImage(props, props.currentFrame);

        }

    }

}
V360.prototype.onmouseup = function(props){

    return () => {

        // Serves to inform the other functions that the user stopped dragging
        props.mousePressing = false;
        props.mouseStart = 0;

    }

}
V360.prototype.onresize = function(props){

    return () => {

        const $target = props.target;
        const $canvas = props.canvas.target;

        // If the container changes size
        if($canvas.width != $target.offsetWidth || $canvas.height != $target.height){

            const currentFrame = props.currentFrame;

            this.resizeCanvas($target, $canvas);
            this.resizeImage(props);

            this.setImage(props, currentFrame);
            
        }

    }
    
}
// Restart the viewer
V360.prototype.restart = function(){

    const $v360 = document.querySelectorAll('[v360], [V360]');

    for (let i = 0, l = $v360.length; i < l; i++)
        $v360[i].v360.restart();

}
// Transform an element that is not a 360 viewer into a
V360.prototype.set = function($element, props, callback){

    $element.setAttribute('v360', JSON.stringify(props).replace(/\"/g, "'"));

    this.init($element);

    $element.v360.onload = callback;

    return $element.v360;

}
// Start viewer (Do not confuse with $DOM.v360.animation)
V360.prototype.start = function(){

    const $v360 = document.querySelectorAll('[v360], [V360]');

    for (let i = 0, l = $v360.length; i < l; i++)
        $v360[i].v360.start();

}
// Stop the viewer (Do not confuse with $DOM.v360.stopAnimation)
V360.prototype.stop = function(){

    const $v360 = document.querySelectorAll('[v360], [V360]');

    for (let i = 0, l = $v360.length; i < l; i++)
        $v360[i].v360.stop();

}
//# sourceMappingURL=v360.js.map
