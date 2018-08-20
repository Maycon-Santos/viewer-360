class V360{

    constructor(){

        const $v360 = document.querySelectorAll('[v360], [V360]');

        for (let i = 0, l = $v360.length; i < l; i++)
            this.init($v360[i]);

        return 'teste';

    }

    init($target){

        // If you are already a V360
        if($target.v360 && $target.v360.played)
            return $target.v360.restart();

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

            loadedImages: 0

        };

        // Replace all ' to "
        props.merge(JSON.parse($target.getAttribute('v360').replace(/\'/g, '"')));

        this.preload(props);
        this.onresize(props);

        this.V360DOM($target, props);

    }

}

window.addEventListener('load', () => window.v360 = new V360());