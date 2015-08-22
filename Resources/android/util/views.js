function createSuggestList(list,source){
	clearSuggestList();
	showSuggestList();
	var searchBar  = AllViews["searchBar"];
	var searchList = findOrCreateSearchList();
    var sections =[];
    var listSection = createGoogleListSection(list,source);
    Ti.API.info("createSuggestList().listSection.created");
    sections.push(listSection);
    searchList.sections=sections;
    showSuggestList();
    win.add(searchList);
}
function findOrCreateSearchList(){
	var searchList = AllViews["searchList"];
	if(typeof searchList === 'undefined'){
    	var template = createSearchListItemTemplate();
		var searchList = Ti.UI.createListView({
		    top : '50dp',
		    left:10,
			width:'80%',
			height : Ti.UI.SIZE,
	    	backgroundColor:'rgba(64,64,64,64)',
		    templates : {
		        'plain' : template
		    },
		    defaultItemTemplate : 'plain',
		});
		searchList.addEventListener('itemclick', function(e) {
			//var pt = e.itemId;	//'[0,0]'
			if (e.bindId == 'rowtitle' || e.bindId == 'pic'){
				var item = e.section.getItemAt(e.itemIndex);
        		Ti.API.info("suggest.list.clicked :"+JSON.stringify(item));
				if(typeof item.rowtitle.id !== 'undefined'){
					changeDestination(JSON.parse(item.rowtitle.id));
					animateTo(JSON.parse(item.rowtitle.id));
				}
        		hideSuggestList();
			}
        	hideKeyboard();
		});
		AllViews["searchList"] = searchList;
	}
	return searchList;
}
function createGoogleListSection(list,source){
	var googleSection = Ti.UI.createListSection({headerTitle:source,width: Ti.UI.FILL,});
    var addressData= [];
    for (var i=0;i<list.length;i++){
    	var start = list[i].point; //JSON.parse();
    	var to = getCurrentPos();
    	var dist = distance(start[0], start[1], to[0], to[1]);
    	var distance1 = dist>999?(dist/1000).toFixed(1) + " km":dist+' m';
    	var newitem ={
    		pic : {
    			image : Ti.App.Android.R.drawable.place_32.png,	//'place_32.png',
    		},
	        rowtitle : {
	            text : list[i].addr,
	            id: JSON.stringify(list[i].point),
	    		color:'black',
	        },
	        dist:{
	        	text : distance1,
	    		color: 'black',
	        },
	        properties:{
	    		backgroundColor:'rgba(128,128,128,128)',
	    		height : '50dp',
	    	},
    	};
    	addressData.push(newitem);
    }
    googleSection.setItems(addressData);
    return googleSection;
}
function createSearchListItemTemplate(){
	var template = {
    childTemplates : [
    {
        type : 'Ti.UI.ImageView',
        bindId : 'pic',
        properties : {
            left : '2dp',
            image : Ti.App.Android.R.drawable.place_32.png,	//'place_32.png',
        }
    },{
        type : 'Ti.UI.Label',
        bindId : 'rowtitle',
        properties : {
            left : '10dp',
			font: { fontSize:14 },
        }
    },{
        type : 'Ti.UI.Label',
        bindId : 'dist',
        properties : {
            right : '10dp',
			font: { fontSize:14 },
        }
    },
    ]};
    return template;
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
function hideKeyboard(){
	var searchBar = AllViews["searchBar"];
	if(typeof searchBar !== 'undefined'){
		searchBar.blur();
	}
}
function createAndroidSearchBar(){
	//var h=Ti.Platform.displayCaps.platformHeight;
	var pw = Ti.Platform.displayCaps.platformWidth;
	var ldf = Ti.Platform.displayCaps.logicalDensityFactor;
	var w = parseInt(pw / (ldf || 1), 10);
	var searchBar = Ti.UI.Android.createSearchView({
	    //hintText: "Input Address to Search ",
	    backgroundColor: 'rgba(128,128,128,128)',
	    color: "black",
        width : w - 160,
	    height : '52dp',
	    top:0,
	    left:50,
	});
	var searchThread;
    var funReturn = function (e) {
    	clearTimeout(searchThread);
	    searchThread = setTimeout( function() {
	    	Ti.API.info('search:'+e.source.value);
		    if(e.source.value.length>1){
	        	//searchAddressGoogle(e.source.value,'nz');
	        	var list = searchOfflinePOI(e.source.value,'nz');
	        }else{
	        	hideSuggestList();
	        }
	    },1000);
	    
	};
	searchBar.addEventListener('change',funReturn);
	searchBar.addEventListener("submit", funReturn);
	//searchBar.addEventListener('blur', funReturn);
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
    Ti.API.info("searchbar created");
    win.add(searchBar);
}