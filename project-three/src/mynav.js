const template = document.createElement("template");
template.innerHTML = `
<link href="styles/default-styles.css" type="text/css" rel="stylesheet" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">

<nav class="navbar has-background-black has-shadow" id="nbar">


<div class="navbar-brand">
    <a class="navbar-item"> <h1 class="title has-text-primary pt-1 pl-2">Slipstream</h1></a>

    <a class="navbar-burger" id="burger">
        <span></span>
        <span></span>
        <span></span>
    </a>
</div>


		<div class="navbar-menu" id="nav-links">
			<div class="navbar-end">
            <a href="home.html" class="navbar-item" id = "home">Home</a>
            <a href="app.html" class="navbar-item" id = "app">App</a>
            <a href="documentation.html" class="navbar-item" id = "doc">About</a>
            </div>
		</div>
</nav>
`;

class Mynav extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.homePage = this.shadowRoot.querySelector("#home");
        this.appPage = this.shadowRoot.querySelector("#app");
        this.docPage = this.shadowRoot.querySelector("#doc");

        this.navLinks = this.shadowRoot.querySelector("#nav-links");
        this.burger = this.shadowRoot.querySelector("#burger");

        //
        this.burger.addEventListener('click', () => {
            this.navLinks.classList.toggle('is-active');
            this.navLinks.classList.toggle('has-background-dark');
        })
    }

    setActivepage(num){
        switch(num)
        {
            case 1: this.appPage.classList.add("has-background-grey-dark");
                break;
            case 2: this.docPage.classList.add("has-background-grey-dark");
                break;
            default:this.homePage.classList.add("has-background-grey-dark");

        }
    }
}
customElements.define('my-nav', Mynav);