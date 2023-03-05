const template = document.createElement("template");
template.innerHTML = `
<link href="styles/default-styles.css" type="text/css" rel="stylesheet" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<div class="column is-12">
    <section>

        <label class="label has-text-light">Color 1: 
            <div class="select">
                <select class="select" id="firstcolor">
                <option value="white" class="option white">White</option>
                <option value="red" class="option red">Red</option>
                <option value="orange" class="option orange">Orange</option>
                <option value="yellow" class="option yellow">Yellow</option>
                <option value="green" class="option green">Green</option>
                <option value="blue" class="option blue">Blue</option>
                <option value="indigo" class="option indigo">Indigo</option>
                <option value="violet" class="option violet">Violet</option>
                </select>
            </div>
        </label>

        <label class="label has-text-light">Color 2: 
            <div class="select">
                <select class="select" id="secondcolor">
                    <option value="white" class="option white">White</option>
                    <option value="red" class="option red">Red</option>
                    <option value="orange" class="option orange">Orange</option>
                    <option value="yellow" class="option yellow">Yellow</option>
                    <option value="green" class="option green">Green</option>
                    <option value="blue" class="option blue">Blue</option>
                    <option value="indigo" class="option indigo">Indigo</option>
                    <option value="violet" class="option violet">Violet</option>
                </select>
            </div>
        </label>

        <label class="label has-text-light"> Style: 
            <div class="select">
                <select class="select" id="style">
                    <option value="swne" class="option">Bottom Left -> Top Right</option>
                    <option value="nwse" class="option">Top Left -> Bottom Right</option>
                    <option value="ns" class="option">Top -> Bottom</option>
                    <option value="ew" class="option">Left -> Right</option>
                </select>
            </div>
        </label>


        <label class="label checkbox has-text-light" id="loopText">
            Use rainbow (Overrides Color1 and Color2): <input type="checkbox" id="rainbow">
        </label>

    </section>

</div>
`;

class Mycolor extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.color1 = this.shadowRoot.querySelector("#firstcolor");
        this.color2 = this.shadowRoot.querySelector("#secondcolor");
        this.gradientStyle = this.shadowRoot.querySelector("#style");
        this.toggleRainbow = this.shadowRoot.querySelector("#rainbow");
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 650;
        this.rainbow = [{percent:0,color:"blue"},{percent:.25,color:"green"},{percent:.5,color:"yellow"},{percent:.75,color:"red"},{percent:1,color:"magenta"}];
        this.useRainbow = false;
        this.normalGradient = [{percent:0, color:"white"},{percent:1, color:"white"}];
        this.gradient;
    }

    connectedCallback(){
        this.gradientStyle.onchange = e => {
            let i = e.target.value;
            switch(i){
                case 'swne':
                    this.startX = 0;
                    this.startY = 650;
                    this.endX = 800;
                    this.endY = 0;
                break;

                case 'nwse':
                    this.startX = 0;
                    this.startY = 0;
                    this.endX = 800;
                    this.endY = 650;
                break;

                case 'ns':
                    this.startX = 0;
                    this.startY = 0;
                    this.endX = 0;
                    this.endY = 650;
                break;

                case 'ew':
                    this.startX = 0;
                    this.startY = 0;
                    this.endX = 800;
                    this.endY = 0;
                break;
            }
        }

        this.color1.onchange = e => {
            this.normalGradient[0].color = e.target.value;
        }
        this.color2.onchange = e => {
            this.normalGradient[1].color = e.target.value;
        }

        this.toggleRainbow.onchange = e => {
            this.useRainbow = e.target.checked;
        }
    }

    disconnectedCallback(){
    
    }

    giveColorData(ctx/*the volume of the track maybe? IDK if I'm getting the audio analyser in...*/){
        if(this.useRainbow == true){
            this.gradient = this.getLinearGradient(ctx,this.startX, this.startY, this.endX, this.endY,this.rainbow);
        }
        else{this.gradient = this.getLinearGradient(ctx,this.startX, this.startY, this.endX, this.endY,this.normalGradient);}
        return this.gradient;
    }

    getLinearGradient (ctx,startX,startY,endX,endY,colorStops) {
        let lg = ctx.createLinearGradient(startX,startY,endX,endY);
        for(let stop of colorStops){
          lg.addColorStop(stop.percent,stop.color);
        }
        return lg;
      };
}

customElements.define('my-color', Mycolor);