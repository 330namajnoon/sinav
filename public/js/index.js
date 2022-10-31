////// imports
import { SerchElement, CrateElement, ObjectDelete, zaban } from "../admin/js/abzarha.js";

///////  
let socket = io();
let rabetekarbari;

function Javab(javab, harf) {
    this.paszamine = CrateElement({ name: "div", class: "javab2_paszamine" });
    this.chekbox = CrateElement({ name: "input", type: "checkbox", class: "javab2_check", value: javab });
    this.javab = CrateElement({ name: "h4", class: "javab2_javab", inerhtml: harf + ") " + " " + javab });
    this.Crate();
}
Javab.prototype.Crate = function () {
    this.paszamine.appendChild(this.chekbox);
    this.paszamine.appendChild(this.javab);
}

function Soru(data) {
    this.horuf = "abcdefg";
    this.data = data;
    this.paszamine = CrateElement({ name: "div", class: "soru_paszamine" });
    this.paszamine_s = CrateElement({ name: "div", class: "soru_paszamine_s" });
    this.soru_div = CrateElement({ name: "div", class: "soru_div" });
    this.soru_punt = CrateElement({ name: "div", class: "soru_punt" });
    this.soal = CrateElement({ name: "h3", class: "soru_soal", inerhtml: this.data.soal });
    this.javabha = [];
    for (let index = 0; index < this.data.javabha.length; index++) {
        this.javabha.push(new Javab(this.data.javabha[index], this.horuf.charAt(index)));
    }


    this.Crate();



}
Soru.prototype.Crate = function () {
    this.paszamine.appendChild(this.paszamine_s);
    this.paszamine_s.appendChild(this.soru_div);
    this.soru_div.appendChild(this.soru_punt);
    this.soru_div.appendChild(this.soal);
    this.javabha.forEach(e => {
        this.paszamine_s.appendChild(e.paszamine);
    })
}

function Login() {
    this.paszamine = CrateElement({ name: "div", class: "login_paszamine" });
    this.text = CrateElement({ name: "input", type: "text", atriviuts: [{ name: "placeholder", value: zaban.nam }] });
    this.button = CrateElement({ name: "input", type: "button", value: zaban.vorud });
    this.paszamine.appendChild(this.text);
    this.paszamine.appendChild(this.button);

    this.button.addEventListener("click", () => {
        if (this.text.value !== "") {
            localStorage.setItem("username", this.text.value);
            socket.emit("user_add", { name: this.text.value, numero: 0 });
            rabetekarbari.loading.src = "../images/loading2.gif";
            this.paszamine.remove();
        }
    })
}


function RabeteKarbari() {
    this.body = document.querySelector("body");
    this.header = CrateElement({ name: "div", class: "header" });
    this.logo = CrateElement({ name: "img", class: "logo", src: "../images/logo.png" });
    this.zamansanj = CrateElement({ name: "h3", class: "zamansanj" });
    this.payan_a = CrateElement({ name: "a", atriviuts: [{ name: "href", value: "./natije.html" }] });
    this.loading = CrateElement({ name: "img", class: "loading", src: "../images/loading.gif" });

    this.login = new Login();
    this.natije_paszamine = CrateElement({name:"div",class:"natije_paszamine"});
    this.natije_emtiyaz = CrateElement({name:"input",type:"button",value:"0",class:"natije"});
    this.enviar = CrateElement({name:"input",type:"button",value:zaban.print,class:"button"});
    this.print = CrateElement({name:"input",type:"button",value:zaban.ersal,class:"button"});    
    this.soalha = [];
    this.Crate();

    this.loading.style.cssText = `width: ${innerWidth}px;height:${innerHeight}px`
    this.logo.addEventListener("click", () => {
        this.mohasebeEmtiyaz();
    })

}
RabeteKarbari.prototype.Crate = function () {
    this.header.appendChild(this.logo);
    this.body.appendChild(this.header);
    // this.body.appendChild(this.zamansanj);
    this.body.appendChild(this.loading);
    this.body.appendChild(this.payan_a);
    this.natije_paszamine.appendChild(this.natije_emtiyaz);
    this.natije_paszamine.appendChild(this.print);
    this.natije_paszamine.appendChild(this.enviar);
    this.body.appendChild(this.natije_paszamine);
}
RabeteKarbari.prototype.timer = function (zaman) {

    let dakika = Math.floor(zaman) - 1;
    let saniye = 60;
    let durum = true;



    setInterval(() => {

        if (durum == true) {
            if (saniye > 0) {
                saniye--;
            } else {
                saniye = 60;
                dakika--;
            }
            if (dakika <= 0 && saniye <= 0) {
                this.mohasebeEmtiyaz();
                durum = false;
                this.zamansanj.remove();
            }
            this.zamansanj.innerHTML = `${dakika}:${saniye}`;
        }
    }, 1000);


}
RabeteKarbari.prototype.mohasebeEmtiyaz = function () {
    let emtiyaz = 0;
    let javahayeSahih = 0;
    this.soalha.forEach(e => {
        javahayeSahih += e.data.javabhayeDorost.length;
        let javabedorost = 0;

        e.data.javabhayeDorost.forEach(e__ => {
            e.javabha.forEach(e_ => {
                if (e__ == e_.chekbox.value && e_.chekbox.checked == true) {
                    javabedorost++;
                    e_.chekbox.style.cssText += "background-color: green;";
                }
                if (e__ == e_.chekbox.value && e_.chekbox.checked == false) {

                    e_.chekbox.style.cssText += "background-color: mediumorchid;";
                }
                if (e__ !== e_.chekbox.value && e_.chekbox.checked == true && e_.chekbox.style.cssText !== "background-color: green;") {
                    e_.chekbox.style.cssText += "background-color: red;";
                }
            })

        })
        emtiyaz += javabedorost;
    })

    let miyangin = ((10 / javahayeSahih) * emtiyaz);



}



rabetekarbari = new RabeteKarbari();

socket.on("emtehan_load", (data) => {
    let data_ = JSON.parse(data);
    data_.forEach(e => {
        rabetekarbari.soalha.push(new Soru(e));
    })
    rabetekarbari.soalha.forEach(e => {
        rabetekarbari.body.appendChild(e.paszamine);
    })
    localStorage.removeItem("username");
    if (localStorage.getItem("username") !== null) {

        socket.emit("user_add", { name: localStorage.getItem("username"), numero: 0 });
        rabetekarbari.loading.src = "../images/loading2.gif";
    } else {
        // rabetekarbari.body.appendChild(rabetekarbari.login.paszamine);
    }

})
socket.on("emtehan_shoru", (zaman) => {
    if (localStorage.getItem("username") !== null) {
        rabetekarbari.timer(zaman);
        rabetekarbari.loading.remove();
    }
})
rabetekarbari.loading.remove();
