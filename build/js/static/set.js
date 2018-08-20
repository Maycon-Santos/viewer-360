V360.prototype.set = function($element, props){

    $element.setAttribute('v360', JSON.stringify(props).replace(/\"/g, "'"));

    this.init($element);

}