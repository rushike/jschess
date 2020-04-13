
class converter{
    static vh2px(value) {
        var w = window,
          d = document,
          e = d.documentElement,
          g = d.getElementsByTagName('body')[0],
          x = w.innerWidth || e.clientWidth || g.clientWidth,
          y = w.innerHeight|| e.clientHeight|| g.clientHeight;
      
        var result = (y*value)/100;
        return result;
      }
      static vw2px(value) {
        var w = window,
          d = document,
          e = d.documentElement,
          g = d.getElementsByTagName('body')[0],
          x = w.innerWidth || e.clientWidth || g.clientWidth,
          y = w.innerHeight|| e.clientHeight|| g.clientHeight;
      
        var result = (x*value)/100;
        return result;
      }

      static percent2px(value, rootdivid = 'chess-board') {
        var g = document.getElementById(rootdivid);
        var x = g.clientWidth,
          y = g.clientHeight; 
        const result = {
            x : (x*value)/100,
            y : (y*value)/100
        };
        return result;
      }
}

class get{
	static bodyheight(){
		var w = window,
          d = document,
          e = d.documentElement,
          g = d.getElementsByTagName('body')[0];
          return  g.clientHeight; // || w.innerHeight || e.clientHeight ||
	}

	static bodywidth(){
		var w = window,
          d = document,
          e = d.documentElement,
          g = d.getElementsByTagName('body')[0];
          return g.clientWidth // || w.innerWidth || e.clientWidth ||
	}

	static divheight(id){
		var div = document.getElementById(id)
		if(div){
			return div.offsetHeight
		}
	}

	static divwidth(id){
		var div = document.getElementById(id)
		if(div){
			return div.offsetWidth
		}
	}
}

class match{
	static iscolor(){
		return /^#[0-9A-F]{6}$/i.test('#AABBCC')
	}
}



class query{
	static baseclass(cls){
		if(cls instanceof Function){
			let basecls = cls;
			while (basecls){
			  const newbasecls = Object.getPrototypeOf(basecls);
			  if(newbasecls && newbasecls !== Object && newbasecls.name) basecls = newbasecls;
			  else break;
			}
			return basecls;
		}
	}

	static allinstances(cls){
		var basecls = query.baseclass(cls)
		console.log(basecls, basecls.instances)
	}
}
