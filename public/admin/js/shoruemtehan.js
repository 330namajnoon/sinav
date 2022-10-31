////// imports
import { SerchElement,CrateElement,ObjectDelete,zaban } from "./abzarha.js";

///////  
let socket = io();
let rabetekarbari;
let emtehan_name = localStorage.getItem("emtehan_name");

function User(data) {
    this.data = data;
    this.paszamine = CrateElement({name:"div",class:"user_paszamine"});
    this.name = CrateElement({name:"h3",inerhtml:this.data.name});
    this.img = CrateElement({name:"img",src:"../images/profil.png"});
    this.numero = CrateElement({name:"h4",inerhtml:this.data.numero});

    this.Crate();
}
User.prototype.Crate = function() {
    this.paszamine.appendChild(this.name);
    this.paszamine.appendChild(this.img);
    this.paszamine.appendChild(this.numero);
}


function RabeteKarbari() {
    
    this.body = document.querySelector("body");
    this.header = CrateElement({name:"div",class:"header"});
    this.logo = CrateElement({name:"img",class:"logo",src:"../images/logo.png"});
    this.home_a = CrateElement({name:"a",atriviuts:[{name:"href",value:"./index.html"}]});
    this.home = CrateElement({name:"img",class:"home",src:"../images/home.png"});
    this.payan_a = CrateElement({name:"a",atriviuts:[{name:"href",value:"../natije.html"}]});

    this.shoru_paszamine = CrateElement({name:"div",class:"shoru_paszamine"});
    this.shoru_text = CrateElement({name:"input",class:"shoru_text",type:"text",atriviuts:[{name:"placeholder",value:zaban.dakika}]});
    this.vorud = CrateElement({name:"input",class:"vorud",type:"button",value:zaban.vorud});
    this.zamansanj = CrateElement({name:"h3"});

    this.emtehan_name = CrateElement({name:"h3",class:"emtehan_name",inerhtml:emtehan_name});
    this.khat = CrateElement({name:"div",class:"khat"});

    this.users_paszamine = CrateElement({name:"div",class:"users_paszamine"});
    this.users = [];

    this.vorud.addEventListener("click",()=> {
        this.timer();
    })
   
    this.Crate();
   

   
}
RabeteKarbari.prototype.Crate = function() {
    this.home_a.appendChild(this.home)
    this.header.appendChild(this.home_a);
    this.header.appendChild(this.logo);
    this.body.appendChild(this.header);
    this.body.appendChild(this.shoru_paszamine);
    this.shoru_paszamine.appendChild(this.shoru_text);
    this.shoru_paszamine.appendChild(this.vorud);
    this.body.appendChild(this.emtehan_name);
    this.body.appendChild(this.khat);
    this.body.appendChild(this.users_paszamine);
    this.body.appendChild(this.payan_a);
}
RabeteKarbari.prototype.usersLoader = function(data) {
    this.users.push(new User(data));
    this.users.forEach(e => {
        this.users_paszamine.appendChild(e.paszamine);
    })
}
RabeteKarbari.prototype.timer = function() {
    if(this.shoru_text.value !== "") {
        socket.emit("emtehan_shoru",Number(this.shoru_text.value));
        this.shoru_text.remove();
        this.vorud.remove();
        this.shoru_paszamine.appendChild(this.zamansanj);

        let dakika = Math.floor(Number(this.shoru_text.value))-1;
        let saniye = 60;

        setInterval(() => {
            
            if (saniye > 0) {
                saniye--;
            }else {
                saniye = 60;
                dakika--;
            }
            if (dakika <= 0 && saniye <= 0) {
                this.payan_a.click();           
            }
            this.zamansanj.innerHTML = `${dakika}:${saniye}`;
        }, 1000);

    }
}


rabetekarbari = new RabeteKarbari();

socket.on("user_add",(data)=> {
    rabetekarbari.usersLoader(data);
})


