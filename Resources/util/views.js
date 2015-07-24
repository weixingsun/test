function createSuggestList(list){
	clearSuggestList();
	showSuggestList();
	var searchList = AllViews["searchList"];
	var searchBar  = AllViews["searchBar"];
	if(typeof searchList === 'undefined'){
		var searchList = Ti.UI.createListView({
			top:50,
		    left:10,
			width:'80%',
			height:Ti.UI.SIZE,
		});
		searchList.addEventListener('itemclick', function(e) {
			var pt = e.itemId;	//[0,0]
        	Ti.API.info("clicked on :"+pt);
        	changeDestination(JSON.parse(pt));
        	hideSuggestList();
        	searchBar.blur();
		});
	}
    var sections =[];
    var googleSection = Ti.UI.createListSection({headerTitle:"Online",width: Ti.UI.FILL,});
    var addressData= [];
    for (var i=0;i<list.length;i++){
    	var item = {properties:{
    		title:list[i].addr,
    		itemId: list[i].point,
    		color:'black',
	    	height:40,
	    	width: Ti.UI.FILL,
	    	horizontalWrap: false,
    		backgroundColor:'rgba(192,192,192,192)',
    		wordWrap : false,
    		//minimumFontSize: 16,
    	}};
    	addressData.push(item);
    }
    googleSection.setItems(addressData);
    sections.push(googleSection);
    searchList.sections=sections;
    showSuggestList();
    win.add(searchList);
	AllViews["searchList"] = searchList;
}
function clearSuggestList(){
	var searchList = AllViews["searchList"];
	if(typeof searchList !== 'undefined'){
		searchList.removeAllChildren();
	}
}
function hideSuggestList(){
	var searchList = AllViews["searchList"];
	if(typeof searchList !== 'undefined'){
		searchList.hide();
	}
}
function showSuggestList(){
	var searchList = AllViews["searchList"];
	if(typeof searchList !== 'undefined'){
		searchList.show();
	}
}
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
        if(e.source.value.length>2){
        	searchAddressGoogle(e.source.value,'nz');
        }else{
        	hideSuggestList();
        }
        
    });
	searchBar.addEventListener('return', function(e){
        if(e.source.value.length>2){
        	searchAddressGoogle(e.source.value,'nz');
        }
        searchBar.blur();//'return search:'
    });
	AllViews["searchBar"] = searchBar;
    win.add(searchBar);
}

function createIosSearchBar(){
    var searchBar = Titanium.UI.createSearchBar({
	    //barColor:'#000', 
        width : '80%',
	    showCancel:true,
	    height:45,
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