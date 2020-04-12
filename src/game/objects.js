objects = {
    add : function(instance){
        var basecls = query.baseclass(instance.constructor)
        if(basecls.name in objects) objects[basecls.name].push(instance)
        else objects[basecls.name] = [instance]
    }
}
