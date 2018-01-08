'use strict';
var fs = require("fs");
//settings: object. Example: {db: "db.json", key: user_id, value: data}
//method: string. Example: "update"
//callback: functior(err, data)
module.exports = function(settings, method, callback)
{
    fs.appendFile(settings.db, "", 'utf8', function(err){
                    if (err) callback(err, null);
                
fs.readFile(settings.db, 'utf8', (err, data) => {
        if (err) callback(err, null);
        else{
            if (data[0] !== "{"){
                data = "{" + data + "}"
            }
            let json_data = function (data){
                try {
                let o = JSON.parse(data);

                // Handle non-exception-throwing cases:
                // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
                // but... JSON.parse(null) returns null, and typeof null === "object", 
                // so we must check for that, too. Thankfully, null is falsey, so this suffices:
                if (o && typeof o === "object") {
                return o;
                }
            }
            catch (e) { }

            return false;
            }(data);
            
            if (json_data === false){
                callback("the file " + settings.db + " is not correct");
                return;
            }
            
            switch(method){
                case "get":
                    get(json_data, settings, callback);
                    break;
                case "add":
                    add(json_data, settings, callback);
                    break;
                case "update":
                    update(json_data, settings, callback);
                    break;
                case "delete":
                    del(json_data, settings, callback);
                    break;
                case "clear":
                    clear(settings, callback);
                    break;
                default:
                    callback("Method " + method + " is not supported", null);
            }
        }
            
            
            
}); // End readfile
});  
    
    
};

function get(json_data, settings, callback){
    if(settings.key === undefined){
                callback(null, json_data);
            }
            else{
                let data_to_send = json_data[settings.key];
                if (data_to_send === undefined) callback("key not found", null);
                else callback(null, data_to_send);
            }
}

function add(json_data, settings, callback){
    if (json_data[settings.key] !== undefined) callback("key already exists. please use update instead.", null)
            else{
                json_data[settings.key] = settings.value;
                fs.writeFile(settings.db, JSON.stringify(json_data, null, 2), 'utf8', function(err){
                    if (err) callback(err, null);
                    else callback(null, "data updated");
                });
            };
}

function update(json_data, settings, callback){
    if (json_data[settings.key] == undefined) add(json_data, settings, callback);
            else{
				console.log('json_data', json_data);
                json_data[settings.key] = settings.value;
                fs.writeFile(settings.db, JSON.stringify(json_data, null, 2), 'utf8', function(err){
                    if (err) callback(err, null);
                    else callback(null, "data updated");
                });
            };
}

function del(json_data, settings, callback){
    if (json_data[settings.key] == undefined) callback("no such key. delete not made", null)
            else{
                json_data[settings.key] = undefined;
                fs.writeFile(settings.db, JSON.stringify(json_data, null, 2), 'utf8', function(err){
                    if (err) callback(err, null);
                    else callback(null, settings.key + " deleted");
                });
            };
}

function clear(settings, callback){
    fs.writeFile(settings.db, "{}", 'utf8', function(err, data){
                    if (err) callback(err, null);
                    else callback(null, "database cleared");
                });
}