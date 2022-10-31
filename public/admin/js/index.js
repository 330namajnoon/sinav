///////// imports
import { CrateElement ,zaban} from "./abzarha.js";


/////////  elements
let socket = io();
socket.emit("soalha_load");

let rabete_karbari;
let colors = {
    c_1: "#FF7D7D",
    c_2: "#5D5D5D",
    c_3: "#EAEAEA"
}


function Emtehan(name) {
    this.name = name;
    this.a_vorud = CrateElement({name:"a",atriviuts:[{name: "href",value:"./editesoalha.html"}]});
    this.a_shoru = CrateElement({name:"a",atriviuts:[{name: "href",value:"./shoruemtehan.html"}]});
    
    this.paszamine = CrateElement({name:"div",class:"emtehan_div"});
    this.button_vorud = CrateElement({name:"input",class:"emtehan_b_vorud",value:this.name,type:"button"});
    this.button_shoru = CrateElement({name:"input",class:"emtehan_b_shoru",type:"button"});

    this.a_vorud.appendChild(this.button_vorud);
    this.a_shoru.appendChild(this.button_shoru);
    
    this.paszamine.appendChild(this.a_vorud);
    this.paszamine.appendChild(this.a_shoru);

    this.button_vorud.addEventListener("click",()=> {
        localStorage.setItem("emtehan_name",this.name);
        this.a_vorud.click();
    })
    this.button_shoru.addEventListener("click",()=> {
        socket.emit("emtehan_load",this.name);
        localStorage.setItem("emtehan_name",this.name);
        this.a_shoru.click();
        
    })

}

function RabeteKarbari(emtehanat_data) {
    ///////  socket
    socket.on("soalha_load",(data)=> {
        if(data !== null) {
            this.emtehanatLoader(JSON.parse(data));
            this.emtehan_add_paszamine.style.display = "none";
        }else {
            this.emtehan_add_err.style.display = "flex";
        }
    })

    this.emtehanat_data = emtehanat_data;
    this.body = document.querySelector("body");
    ///// header
    this.header = CrateElement({name:"div",class:"header"});
    this.logo = CrateElement({name:"img",src:"../images/logo.png",class: "logo"});
    this.emtehan_add = CrateElement({name:"img",class:"emtehan_add",src:"../images/sinav_add.png"});
    ///////  sinav add
    this.emtehan_add_paszamine = CrateElement({name:"div",class:"emtehan_add_paszamine"});
    this.cancel = CrateElement({name:"img",class:"cncel",src:"../images/cancel.png"});
    this.emtehan_add_err = CrateElement({name:"h3",class:"emtehan_add_err",inerhtml:" No vale !!"});
    this.emtehan_add_text = CrateElement({name:"input",type:"text",class:"emtehan_add_text",atriviuts:[{name:"placeholder",value: zaban.nam}]});
    this.emtehan_add_button = CrateElement({name:"input",type:"button",class:"emtehan_add_button",value:zaban.kaydet});
    ////// paddane
    this.emtehanat_div = CrateElement({name:"div",class:"emtehanat_div"});
    
    this.emtehanat = [];

    this.Crate();

    ////// events
    this.cancel.addEventListener("click",()=> {
        this.emtehan_add_paszamine.style.display = "none";
    })
    this.emtehan_add.addEventListener("click",(e)=> {
        e.stopPropagation();
        this.emtehan_add_paszamine.style.display = "flex";
    })

    this.emtehan_add_button.addEventListener("click",(e)=> {
        e.stopPropagation();
        socket.emit("soalha_save",this.emtehan_add_text.value);
    })


}
RabeteKarbari.prototype.Crate = function() {
    this.header.appendChild(this.logo);
    this.header.appendChild(this.emtehan_add);
    this.body.appendChild(this.header);
    this.emtehan_add_paszamine.appendChild(this.cancel);
    this.emtehan_add_paszamine.appendChild(this.emtehan_add_err);
    this.emtehan_add_paszamine.appendChild(this.emtehan_add_text);
    this.emtehan_add_paszamine.appendChild(this.emtehan_add_button);
    this.emtehanat_div.appendChild(this.emtehan_add_paszamine);
    this.body.appendChild(this.emtehanat_div);
}
RabeteKarbari.prototype.emtehanatLoader = function(data) {
    this.emtehanat.forEach(e => {
        e.paszamine.remove();
    })
    this.emtehanat = [];
    data.forEach(e => {
        this.emtehanat.push(new Emtehan(e));
    })
    this.emtehanat.forEach(e => {
        this.emtehanat_div.appendChild(e.paszamine);
    })
}


rabete_karbari = new RabeteKarbari();




