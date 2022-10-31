////// imports
import { SerchElement, CrateElement, ObjectDelete,Siralama, zaban } from "../admin/js/abzarha.js";

///////  
let socket = io();
let rabetekarbari;

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
    this.header = CrateElement({ name: "div", class: "header" });
    this.logo = CrateElement({ name: "img", class: "logo", src: "../images/logo.png" });
    this.zamansanj = CrateElement({ name: "h3", class: "zamansanj" });

    this.users_paszamine = CrateElement({name:"div",class:"users_paszamine"});

    this.users = [];
   
    this.Crate();

  

}
RabeteKarbari.prototype.Crate = function () {
    this.header.appendChild(this.logo);
    this.body.appendChild(this.header);
    this.body.appendChild(this.users_paszamine);

}
RabeteKarbari.prototype.usersLoader = function(data) {
    let users = Siralama(data,"numero");
    
    this.users.forEach(e => {
        e.paszamine.remove();
    })
    this.users = [];
    for (let index = users.length-1; index >= 0; index--) {
        this.users.push(new User(users[index]));
        
    }
   
    this.users.forEach(e => {
        this.users_paszamine.appendChild(e.paszamine);
    })
    
}



rabetekarbari = new RabeteKarbari();
rabetekarbari.usersLoader();

socket.emit("users_load");
socket.on("users_load",(data)=> {
    rabetekarbari.usersLoader(data);
})