

function createAndroidSearchBar(){
	var searchBar = Ti.UI.Android.createSearchView({
	    //hintText: "Input Address to Search ",
	    backgroundColor: 'rgba(128,128,128,128)',
	    color: "black",
        width : '80%',
	    top:0,
	    left:10,
	});
    searchBar.addEventListener('change', function(e){
        Ti.API.info("search:"+e.source.value);
        searchAddressGoogle(e.source.value,'nz');
        
    });
	searchBar.addEventListener('return', function(e){
        //searchBar.blur();//'return search:'
    });
    win.add(searchBar);
}

function createIosSearchBar(){
    var searchBar = Titanium.UI.createSearchBar({
	    //barColor:'#000', 
        width : '80%',
	    showCancel:true,
	    height:43,
	    top:5,
	    left:10,
    });
    searchBar.addEventListener('change', function(e){
        e.value;
    });
    searchBar.addEventListener('return', function(e){
        searchBar.blur();
    });
    searchBar.addEventListener('cancel', function(e){
        searchBar.blur();
    });
    Ti.API.info("searchbar created");
    win.add(searchBar);
}