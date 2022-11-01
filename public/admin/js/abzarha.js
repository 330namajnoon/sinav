
function CrateElement(data = {name: "div",inerhtml:undefined,id:undefined,class:undefined,type:undefined,value:undefined,style:undefined,atriviuts:[{name:undefined,value:undefined}],src:undefined}) {
    let element = document.createElement(data.name);
    if(data.inerhtml !== undefined)element.innerHTML = data.inerhtml;
    if(data.id !== undefined)element.id = data.id;
    if(data.class !== undefined)element.className = data.class;
    if(data.type !== undefined)element.type = data.type;
    if(data.value !== undefined)element.value = data.value;
    if(data.style !== undefined)element.style.cssText = data.style;
    if(data.src !== undefined)element.src = data.src;
    if(data.atriviuts !== undefined) {
        data.atriviuts.forEach(e => {
            element.setAttribute(e.name,e.value);
        })
    }
    return element;
}

function SerchElement (element = [],value = "name",method = undefined) {
    let element_ = undefined;
    if (method !== undefined) {
        element.forEach(e => {
            if (e[method] == value) {
                element_ = e;
            }
        })
    }else {
        element.forEach(e => {
            if (e == value) {
                element_ = e;
            }
        })
    }
   
    return element_;
}

function ObjectDelete(array,element,value) {
    let array_ = [];
    if (element !== "none") {
        array.forEach(e => {
            if(e[element] !== value) array_.push(e);
        })
    }else {
        array.forEach(e => {
            if(e !== value) array_.push(e);
        })
    }
    
    return array_;
}

function Siralama(array = [],val = "") {
    let siralanmis = Array(array.length);
    for (let index = 0; index < array.length; index++) {
        let v1 = array[index][val];
        let sira = 0;
        for (let index_ = 0; index_ < array.length; index_++) {
            let v2 = array[index_][val];
            if(v2 < v1 && index !== index_) sira++;
        }

        let no = 0;
        let w = false;
        while(w == false) {
            if (siralanmis[sira+no] == null) {
                siralanmis[sira+no] = array[index];
                w = true;
            }else {
                no ++;
            }
        }
        
    }
    return siralanmis;
} 

let zaban = {
    kaydet: "Kaydet",
    nam: "Ad",
    soal: "Soru",
    javab:"Cevap",
    sil:"Sil",
    vorud:"Giris",
    dakika:"dakika",
    print:"print",
    ersal:"Gonder",
}


export {CrateElement,SerchElement,ObjectDelete,Siralama,zaban};