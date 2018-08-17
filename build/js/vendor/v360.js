class V360{

    constructor(){

        const $v360 = document.querySelectorAll('[v360], [V360]');

        for (let i = 0, l = $v360.length; i < l; i++)
            this.init($v360[i]);

    }

    init($target){

        const props = {

            target: $target,
            
            srcs: undefined,
            sprite: undefined,
            frames: 0,
            dragSensitivity: 5,

            canvas: this.appendCanvas($target),

            imgs: [],
            currentImg: 0,

            mousePressing: undefined,
            mouseStart: 0,
            
            loadedImages: 0

        };

        props.merge(JSON.parse($target.getAttribute('v360').replace(/\'/g, '"')));

        this.preload(props);
        this.onresize(props);

        this.V360DOM($target, props);

    }

}

window.addEventListener('load', () => new V360());