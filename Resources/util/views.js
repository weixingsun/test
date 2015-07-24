
function createSuggestList(list){
	clearSuggestList();
	showSuggestList();
	var searchList = AllViews["searchList"];
	var searchBar  = AllViews["searchBar"];
	if(typeof searchList === 'undefined'){
    	var template = createSearchListItemTemplate();
		var searchList = Ti.UI.createListView({
		    top : '50dp',
		    left:10,
			width:'80%',
		    templates : {
		        'plain' : template
		    },
		    defaultItemTemplate : 'plain',
		});
		searchList.addEventListener('itemclick', function(e) {
			//var pt = e.itemId;	//'[0,0]'
			if (e.bindId == 'rowtitle' || e.bindId == 'pic'){
				var item = e.section.getItemAt(e.itemIndex);
        		Ti.API.info("clicked :"+JSON.stringify(item));
				if(typeof item.rowtitle.id !== 'undefined'){
					changeDestination(JSON.parse(item.rowtitle.id));
				}
        		hideSuggestList();
			}
        	hideKeyboard();
		});
	}
    var sections =[];
    var googleSection = Ti.UI.createListSection({headerTitle:"Online",width: Ti.UI.FILL,});
    var addressData= [];
    for (var i=0;i<list.length;i++){
    	var newitem ={
    		pic : {
    			image : Ti.App.Android.R.drawable.place_32.png,	//'place_32.png',
    		},
	        rowtitle : {
	            text : list[i].addr,
	            id: list[i].point,
	    		color:'black',
	        },
	        dist:{
	        	text : 'dist:',
	    		color: 'gray',
	        },
	        properties:{
	    		backgroundColor:'rgba(192,192,192,192)',
	    	},
    	};
    	addressData.push(newitem);
    }
    googleSection.setItems(addressData);
    sections.push(googleSection);
    searchList.sections=sections;
    showSuggestList();
    win.add(searchList);
	AllViews["searchList"] = searchList;
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
            left : '40dp'
        }
    },{
        type : 'Ti.UI.Label',
        bindId : 'dist',
        properties : {
            right : '10dp'
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
	var searchBar = Ti.UI.Android.createSearchView({
	    //hintText: "Input Address to Search ",
	    backgroundColor: 'rgba(128,128,128,128)',
	    color: "black",
        width : '80%',
	    top:0,
	    left:10,
	});
    var funReturn = function (e) {
	    Ti.API.info(JSON.stringify(e));
	    //e.source.getParent().backgroundColor = 'blue';
	    if(e.source.value.length>1){
        	searchAddressGoogle(e.source.value,'nz');
        }else{
        	hideSuggestList();
        }
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