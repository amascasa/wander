export default class Components {

    constructor(render) {

        this.render = render;

    }

    card(data) {

        return this.render.createCard(data);

    }

}