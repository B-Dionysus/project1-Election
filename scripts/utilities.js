// titleCase() 
// takes "STRING HERE" or "string here" and returns "String Here"
function titleCase(str){
    if(!str) return false;
    allStr=str.toLowerCase().split(" ");
    final="";
    for(w of allStr){
        var pos=0;
        if(w.charAt(0)==="("){
            if(w.charAt(1)==="\""){
                pos=2;
            }   
            else pos=1;
        }
        // Set up a variable that is the first character of the word and make it upperCase
        var l=w.charAt(pos).toUpperCase();
        // Remove the first character
        w=w.slice(pos+1);
        // Add in our new upperCase character
         w=l+w;
         if(pos===1)w="("+w;
         if(pos===2)w="(\""+w;
        final+=w+" ";
    }
    return final;
}
