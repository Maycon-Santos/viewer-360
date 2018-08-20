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

                props.currentFrame += nextFrame / Math.abs(nextFrame) * direction;

                console.log(props.currentFrame);

            }

            if(props.currentFrame > frames) props.currentFrame = 0;
            else if(props.currentFrame < 0) props.currentFrame = frames;

            this.setImage(props, props.currentFrame);

            if(stopAnimation) return props.allowDrag = !(stopAnimation = false);

            if(to == Infinity) return requestAnimationFrame(animate.bind(this));

            if(timeFraction < 1) return requestAnimationFrame(animate.bind(this));
            else if(typeof callback == 'function')return callback();

            // If you get here means the animation has come to an end
            props.allowDrag = true;

        }.bind(this));

    }

    $target.v360.stopAnimation = () => stopAnimation = true;

}