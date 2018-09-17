$(function(){
   document.title='MyCalenar';
    var AutorizeMdl = new modelAutorize();
    var state = {}; // {pagename: "name", }
    
    function init() {
    var hash = location.hash;
    this.state = decodeURIComponent(hash.substr(1));
    }
    init();

});
//PAGE MODEL----------------------------------

