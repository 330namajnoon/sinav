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

const http = require("http");
const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const pdp = path.join(__dirname,"./public");
app.use(express.static(pdp));
const server = http.createServer(app);

const fs = require("fs");
server.listen(port,()=> {
    console.log(`server is up on port ${port}!;`);
})

const socketio = require("socket.io");
const io = socketio(server);

let emtehan = false;
io.on('connection',(client)=> {
    console.log("new web connect");
    //////////  users
    if(emtehan !== false){
        fs.readFile(`./database/${emtehan}.json`,(err,data)=> {
            if(err) throw err;
            client.emit("emtehan_load",data.toString());
        })
    } 

    client.on("emtehan_load",(name)=> {
        fs.readFile(`./database/${name}.json`,(err,data)=> {
            if(err) throw err;
            io.emit("emtehan_load",data.toString());
            emtehan = name;
        })
    })

    client.on("user_add",(data)=> {
        io.emit("user_add",data);
    })

    client.on("emtehan_shoru",(zaman)=> {
        io.emit("emtehan_shoru",zaman);
    })


    //////////  admin
    client.on("soalha_load",()=> {
        emtehan = false;
        fs.readFile("./database/soalha.json",(err,data)=> {
            if(err) throw err;
            client.emit("soalha_load",data.toString());
        })
    })
    client.on("soalha_save",(value)=> {
        fs.readFile("./database/soalha.json",(err,data)=> {
            if(err) throw err;
            
            let data_ = JSON.parse(data.toString());
            let serch = SerchElement(data_,value);
            if(serch == undefined && value !== "") {
                data_.push(value);
                fs.writeFile("./database/soalha.json",JSON.stringify(data_),(err)=> {
                    fs.readFile("./database/soalha.json",(err,data__)=> {
                        if(err) throw err;
                       
                        fs.writeFile(`./database/${value}.json`,"[]",(err)=> {
                            client.emit("soalha_load",data__.toString());
                        })
                    })
                })
            }else {
               
                client.emit("soalha_load",undefined);
            }

        })
    })

    client.on("sorular_load",(name)=> {
        fs.readFile(`./database/${name}.json`,(err,data)=> {
            if(err) throw err;
            client.emit("sorular_load",data.toString());
        })
    })

    client.on("soru_save",(data,database)=> {
        fs.readFile(`./database/${database}.json`,(err,data_)=> {
            if(err)throw err;
            let data__ = JSON.parse(data_.toString());
            data__.push(data);
            fs.writeFile(`./database/${database}.json`,JSON.stringify(data__),(err)=> {
                client.emit("sorular_load",JSON.stringify(data__));
            })
        })
    })

    client.on("soru_delete",(data,database)=> {
        fs.writeFile(`./database/${database}.json`,JSON.stringify(data),(err)=> {
            console.log("saved");
        })
    })

    client.on("emtehan_delete",(name)=> {
        fs.readFile(`./database/soalha.json`,(err,data)=> {
            if(err)throw err;
            let data_ = JSON.parse(data);
            data_ = ObjectDelete(data_,"none",name);
            fs.unlink(`./database/${name}.json`,(err)=> {
                if(err)throw err;
                console.log("deleted file");
            });
            fs.writeFile(`./database/soalha.json`,JSON.stringify(data_),(err)=> {
                client.emit("emtehan_delete");
            })

        })
    })

    client.on('disconnect',()=> {
        console.log("new web disconnect");
    })
})