var db = require("./db_engine");
    

module.exports.set = function(template_address, content, callback){
    db({db: "cache.json", key: template_address, value: content}, "update", function(err, data){
        if (err) callback(err, "");
        else callback(null, data);
    });
};
    
module.exports.get = function(template_address, callback){
    db({db: "cache.json", key: template_address}, "get", function(err, data){
        if (err) callback(err, "");
        else callback(null, data);
    });
};

module.exports.init = function(){
    db({db: "cache.json"}, "clear", function(err, data){
        if (err) console.log(err);
        else console.log(data);
    });
};