const template = document.createElement("template");
template.innerHTML = `
<link href="styles/default-styles.css" type="text/css" rel="stylesheet" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<div class="column is-6">

    <section>
        <label class="label has-text-light">Song: 
            <div class="select">
                <select id="trackSelect">
                    <option value="" class="option">No music, please</option>
                    <option value="media/run_90.mp3" class="option">Running in the 90's (Initial D)</option>
                    <option value="media/devil_trigger.mp3" class="option">Devil Trigger (Devil May Cry 5)</option>
                    <option value="media/Silsurf.mp3" class="option">Silver Surfer Stage 1 (NES)</option>
                    <option value="media/walk_mem.mp3" class="option">Walking in Memphis (Marc Cohn)</option>
                    <option value="media/feel_sunshine.mp3" class="option">Nononononnonnnonoono (*Sigh*...Can you feel the Sunshine, Sonic R)</option>
                </select>
            </div>
        </label>
    </section>

    <section>
        <label class="checkbox has-text-light" id="loopText">
            <input type="checkbox" id="loopbox"> Loop Music
        </label>
    </section>
            
    <section class="label has-text-light">
        Volume: <input type="range" id="volumeSlider" min="0" max="1" value="0.5" step="0.01">
        <span id="volumeLabel">0.5</span>
    </section>

</div>
`;

class Mysound extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode: "open"});

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.vol = this.shadowRoot.querySelector("#volumeSlider");
        this.volLabel = this.shadowRoot.querySelector("#volumeLabel");
        this.volLabel.innerHTML = 0.5;

        this.song = this.shadowRoot.querySelector("#trackSelect");

        this.loop = this.shadowRoot.querySelector('#loopbox');
        this.loopSong = false;
        this.active =new Howl({
            src:[''],
            volume: 0.5
        });
        
    }

    connectedCallback(){
        this.song.onchange = e => {
            this.active.stop();
            if(e.targetvalue != ""){
                this.active = new Howl({
                    src:[e.target.value],
                    loop:this.loopSong,
                    volume: 0.5
                })
                
                this.active.play();
            }
        }
        this.vol.oninput = e => {
            this.active.volume(e.target.value);
            this.volLabel.innerHTML = e.target.value;
        }
        this.loop.oninput = e =>{
            console.log(e.target.checked);
            this.loopSong = e.target.checked;
            this.active.loop = e.target.checked;
        }
    }

    disconnectedcallback(){
        this.song.onchange = null;
        this.vol.oninput = null;
        this.loop.oninput = null;
    }
}

customElements.define('my-sound', Mysound);