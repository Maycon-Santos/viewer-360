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