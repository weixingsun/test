if (!Array.prototype.remove) {
  Array.prototype.remove = function(val) {
    var i = this.indexOf(val);
    return i>-1 ? this.splice(i, 1) : [];
  };
  Array.prototype.removeAt = function(i) {
    return i>-1 ? this.splice(i, 1) : [];
  };
}
String.prototype.startWith=function(str){  
    if(str==null||str==""||this.length==0||str.length>this.length)  
      return false;  
    if(this.substr(0,str.length)==str)  
      return true;  
    else  
      return false;  
    return true;  
};
String.prototype.endWith=function(str){
    if(str==null||str==""||this.length==0||str.length>this.length)  
      return false;  
    if(this.substring(this.length-str.length)==str)  
      return true;  
    else  
      return false;  
    return true;  
};
function distance(lat1, lon1, lat2, lon2) {
  var R = 6371;
  var a = 0.5 - Math.cos((lat2 - lat1) * Math.PI / 180)/2 + 
     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
     (1 - Math.cos((lon2 - lon1) * Math.PI / 180))/2;
  var m = R * 2 * Math.asin(Math.sqrt(a))*1000;
  return m.toFixed(0);
}