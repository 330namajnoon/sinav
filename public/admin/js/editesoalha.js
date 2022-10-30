////// imports
import { SerchElement,CrateElement,ObjectDelete,zaban } from "./abzarha.js";

///////  
let socket = io();
let rabetekarbari;
let emtehan_name = localStorage.getItem("emtehan_name");

function Javab(id) {
    this.id = id;
    this.paszamine = CrateElement({name:"div",class:"javab_div"});
    this.text = CrateElement({name:"input",type:"text",class:"javab_text",atriviuts:[{name:"placeholder",value: zaban.javab}]})
    this.chekbox = CrateElement({name:"input",type:"checkbox",class:"javab_check"})
    this.delete = CrateElement({name:"input",class:"javab_delete",type:"button",value:zaban.sil});
    this.Crate();

    this.delete.addEventListener("click",()=> {
        this.paszamine.remove();
        rabetekarbari.soruekle.javabha = ObjectDelete(rabetekarbari.soruekle.javabha,"id",this.id);
        rabetekarbari.soruekle.dogrujevapEkle(this.chekbox.value);
    })
    this.text.addEventListener("input",()=> {
        this.chekbox.value = this.text.value;

    })
    this.text.addEventListener("click",()=> {
        if(this.chekbox.checked == true) this.chekbox.click();
    })
    this.chekbox.addEventListener("input",()=> {
        rabetekarbari.soruekle.dogrujevapEkle(this.chekbox.value);
    })
}
Javab.prototype.Crate = function() {
    this.paszamine.appendChild(this.chekbox);
    this.paszamine.appendChild(this.text);
    this.paszamine.appendChild(this.delete);
}


function SoruEkle(id) {
    this.id = id;
    this.javabhayeDorost = [];
    this.paszamine = CrateElement({name:"div",class:"soru_ekle_paszamine"});
    this.soal_div = CrateElement({name:"div",class:"soal_div"});
    this.soal_input = CrateElement({name:"input",class:"soal_input",type:"text",atriviuts:[{name:"placeholder",value: zaban.soal}]})
    this.javab_add = CrateElement({name:"img",class:"javab_add",src:"../images/javab_add.png"});

    this.javabha = [new Javab(1),new Javab(2)];

    this.add = CrateElement({name:"img",class:"add_img",src:"../images/soal_add.png"});
   
    this.Crate();

    this.javab_add.addEventListener("click",()=> {
        this.javabAdd();
        
    })

    this.add.addEventListener("click",()=> {
        rabetekarbari.soruKaydet({id:this.id,soal:this.soal_input.value,javabha:this.javabha,javabhayeDorost:this.javabhayeDorost});
    })

}
SoruEkle.prototype.Crate = function() {
    this.paszamine.appendChild(this.soal_div);
    this.soal_div.appendChild(this.soal_input);
    this.soal_div.appendChild(this.javab_add);
    this.javabha.forEach(e => {
        this.paszamine.appendChild(e.paszamine);
    })
    this.paszamine.appendChild(this.add);
}
SoruEkle.prototype.javabAdd = function() {
    let javab = new Javab(this.javabha.length+1);
    this.add.remove();
    this.paszamine.appendChild(javab.paszamine);
    this.paszamine.appendChild(this.add);
    this.javabha.push(javab);
}
SoruEkle.prototype.dogrujevapEkle = function(val) {
    let serch = SerchElement(this.javabhayeDorost,val);
    if (serch == undefined) {
        this.javabhayeDorost.push(val);
    }else {
        this.javabhayeDorost = ObjectDelete(this.javabhayeDorost,"none",val);
    }
    console.log(this.javabhayeDorost);
}

function Javab2(javab) {
    this.paszamine = CrateElement({name:"div",class:"javab2_paszamine"});
    this.chekbox = CrateElement({name:"input",type:"checkbox",class:"javab2_check",value:javab});
    this.javab = CrateElement({name:"h4",class:"javab2_javab",inerhtml:javab});
    this.Crate();
}
Javab2.prototype.Crate = function() {
    this.paszamine.appendChild(this.chekbox);
    this.paszamine.appendChild(this.javab);
}

function Soru(data) {
    this.data = data;
    this.paszamine = CrateElement({name:"div",class:"soru_paszamine"});
    this.paszamine_s = CrateElement({name:"div",class:"soru_paszamine_s"});
    this.delete = CrateElement({name:"img",class:"soru_delete",src:"../images/cancel.png"});
    this.soru_div = CrateElement({name:"div",class:"soru_div"});
    this.soru_punt = CrateElement({name:"div",class:"soru_punt"});
    this.soal = CrateElement({name:"h3",class:"soru_soal",inerhtml:this.data.soal});
    this.javabha = [];
    for (let index = 0; index < this.data.javabha.length; index++) {
        this.javabha.push(new Javab2(this.data.javabha[index]));
    }

    this.javabha.forEach(e => {
        this.data.javabhayeDorost.forEach(e_ => {
            if(e.javab.innerHTML == e_) e.chekbox.click();
        })
    })
    
    this.Crate();

    this.delete.addEventListener("click",()=> {
        this.paszamine.remove();
        rabetekarbari.soalDelete(this.data.id);
    })
    
}
Soru.prototype.Crate = function() {
    this.paszamine.appendChild(this.paszamine_s);
    this.paszamine.appendChild(this.delete);
    this.paszamine_s.appendChild(this.soru_div);
    this.soru_div.appendChild(this.soru_punt);
    this.soru_div.appendChild(this.soal);
    this.javabha.forEach(e => {
        this.paszamine_s.appendChild(e.paszamine);
    })
}

function RabeteKarbari() {
    this.sorularData = [];
    this.body = document.querySelector("body");
    this.header = CrateElement({name:"div",class:"header"});
    this.logo = CrateElement({name:"img",class:"logo",src:"../images/logo.png"});
    this.home_a = CrateElement({name:"a",atriviuts:[{name:"href",value:"./index.html"}]});
    this.home = CrateElement({name:"img",class:"home",src:"../images/home.png"});

    this.soruekle = new SoruEkle(1);
    this.sorular = [];

    this.delete = CrateElement({name:"input",class:"delete",value:zaban.sil,type:"button"});


    this.Crate();
    this.soruLoader();

    this.delete.addEventListener("click",()=> {
        socket.emit("emtehan_delete",emtehan_name);
        socket.on("emtehan_delete",()=> {
            this.home_a.click();
        })
    })
}
RabeteKarbari.prototype.Crate = function() {
    this.home_a.appendChild(this.home)
    this.header.appendChild(this.home_a);
    this.header.appendChild(this.logo);
    this.body.appendChild(this.header);
    this.body.appendChild(this.delete);
    
}
RabeteKarbari.prototype.soruLoader = function() {
    socket.emit("sorular_load",emtehan_name);
    socket.on("sorular_load",(data)=> {
        let data_ = JSON.parse(data);
        this.soruekle = new SoruEkle(data_.length+1);
        this.body.appendChild(this.soruekle.paszamine);
        this.sorular.forEach(e => {
            e.paszamine.remove();
        })
        this.sorular = [];
        data_.forEach(e => {
            this.sorular.push(new Soru(e));
        })
        this.sorular.forEach(e => {
            this.body.appendChild(e.paszamine);
        })
        this.sorularData = data_;
        this.body.appendChild(this.delete);
    })
}
RabeteKarbari.prototype.soruKaydet = function(data) {
    let data_ = data;
    let javabha = []
    data.javabha.forEach(e => {
        javabha.push(e.text.value);
    })
    data_.javabha = javabha;
    this.soruekle.paszamine.remove();
    socket.emit("soru_save",data_,emtehan_name);
}
RabeteKarbari.prototype.soalDelete = function(id_) {
    this.sorularData = ObjectDelete(this.sorularData,"id",id_);
    socket.emit("soru_delete",this.sorularData,emtehan_name);
}

rabetekarbari = new RabeteKarbari();
