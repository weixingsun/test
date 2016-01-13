function Views(){
	this.popView=0;
	this.img_star=0;
	this.searchBar=0;
	this.place_name1=0;
	this.place_name2=0;
};

Views.prototype.createPlaceView=function (){
	//backgroundColor : rgba(255,0,0,0.5)	//ios
	//backgroundColor : rgba(255,0,0,127)	//android
	var popDownView = Ti.UI.createView({
	    backgroundColor: 'rgba(128,128,128,128)',
	    width:'100%',
	    height:'20%',
	    layout: 'vertical',
	    id:"pop",
	    //zIndex: 2,
	    bottom: 0
	});
	popDownView.visible=false;
	this.createRows(popDownView);
	//setTimeout(function() {}, 10);
	map.win.add(popDownView);
	this.popView = popDownView;
	return popDownView;
};

Views.prototype.createRows=function (popDownView){
	var row1 = Ti.UI.createView({
        height : 60+"%",
	    //backgroundColor: 'blue',
	    layout: 'horizontal',
    });
    var row2 = Ti.UI.createView({
        height : 40+"%",
	    //backgroundColor: 'yellow',
	    layout: 'horizontal',
    });
	popDownView.add(row1);
	popDownView.add(row2);
	this.createTopColumns(row1);
	this.createBottomColumns(row2);
};

Views.prototype.createTopColumns=function (rowView){
	var column1 = Ti.UI.createView({
        width : 80+"%",
	    layout: 'vertical',
    });
	var row1 = Ti.UI.createView({
        height : 60+"%",
    });
    var row2 = Ti.UI.createView({
        height : 40+"%",
    });
    var column2 = Ti.UI.createView({
        width : 20+"%"
    });
	var carId=Ti.App.Android.R.drawable.sedan_128;
	var img_car = this.createCarImage(column2,carId);
	this.createAdressLabel(row1,row2);
	column1.add(row1);
	column1.add(row2);
	rowView.add(column1);
	rowView.add(column2);
};
Views.prototype.createCarImage=function (view,id){
	var that = this;
	var img = Titanium.UI.createImageView({
			image:id,
			//width : 64
		});
	view.add(img);
    img.addEventListener('click', function(e){
	    var from = map.getCurrentPos();
	    var to   = map.getDestinatePos();
	    //Ti.API.info("module="+module+",map="+map+",from="+from+",to="+to);
	    map.navi(from,to);
	    });
	img.addEventListener('longclick',function(e){
		var nextby = map.changeToNextBy();
    	e.source.image = nextby.icon;
	});
	return img;
};
Views.prototype.createAdressLabel=function (row1,row2){
		this.place_name1 = Ti.UI.createLabel({
		  color: '#000',
		  font: { fontSize:20 },
		  //shadowColor: '#aaa',
		  //shadowOffset: {x:5, y:5},
		  //shadowRadius: 3,
		  text: 'Unnamed',
		  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		  bottom: 2,
		  left: 20,
		  parent: row1,
		  width: Ti.UI.SIZE, height: Ti.UI.SIZE
		});
		row1.add(this.place_name1);
		this.place_name2 = Ti.UI.createLabel({
		  color: '#333',
		  font: { fontSize:15 },
		  shadowColor: '#aaa',
		  shadowOffset: {x:5, y:5},
		  shadowRadius: 3,
		  text: '0,0',
		  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		  top: 2,
		  left: 25,
		  parent: row2,
		  width: Ti.UI.SIZE, height: Ti.UI.SIZE
		});
		row2.add(this.place_name2);
	};

Views.prototype.createImages=function (view,id){
	var img = Titanium.UI.createImageView({
			image:id,
			//width : 64
		});
	view.add(img);
	return img;
};
Views.prototype.createBottomColumns=function (popDownView){
	var that=this;
	var column1 = Ti.UI.createView({
        width : 12+"%"
    });
    var column2 = Ti.UI.createView({
        width : 10+"%"
    });
    var column3 = Ti.UI.createView({
        width : 10+"%"
    });
    var column4 = Ti.UI.createView({
        width : 10+"%"
    });
	var close=Ti.App.Android.R.drawable.close_64;
	var star=Ti.App.Android.R.drawable.star_red_64;
	var unstar=Ti.App.Android.R.drawable.star_gray_64;
	var search=Ti.App.Android.R.drawable.search_64;
	var parking=Ti.App.Android.R.drawable.parking_64;
	var img_close = this.createImages(column1,close);
	//Ti.API.info('createBottomColumns');
	if(places.isSavedPlacesDB(map.getDestinatePos())){
		Ti.API.info('===================is star place');
		this.img_star  = this.createImages(column2,unstar);
	}else{
		Ti.API.info('==================star icon to save place');
		this.img_star  = this.createImages(column2,star);
	}
	var img_search = this.createImages(column3,search);
	var img_parking = this.createImages(column4,parking);
    img_close.addEventListener('click', function(e){
    	e.source.parent.parent.parent.hide();
    	map.removeAll();
		map.mode=0;
		map.win.setKeepScreenOn(false);
    });
    this.img_star.addEventListener('click', function(e){
    	var point=map.getDestinatePos();
    	var place = {lat:point[0],lng:point[1],name:'name'};
    	if(places.isSavedPlacesDB(point)){
    		places.removeSavedPlaceDB(place);
    		places.removeSavedPlaceMarker(point);
    		that.img_star.image=star;
    	}else{
    		places.addSavedPlaceDB(place);
    		places.addSavedPlaceMarker(point);
    		that.img_star.image=unstar;
    	}
    });
	popDownView.add(column1);
	popDownView.add(column2);
	popDownView.add(column3);
	popDownView.add(column4);
};
Views.prototype.hidePopView=function(){
	this.popView.hide();
};
Views.prototype.showPopView=function(point){
	var that = this;
	//getAddressOSM(coord[0],coord[1], getAddressCallback);
	net.getPointAddressGoogle(point,function(e) {
	    //Ti.API.info("address callback = "+e);
	    that.place_name1.text = e[0];
	    that.place_name2.text = e[1];
	});
	if(places.isSavedPlacesDB(map.getDestinatePos())){
		var unstar=Ti.App.Android.R.drawable.star_gray_64;
		this.img_star.image=unstar;
	}else{
		var star=Ti.App.Android.R.drawable.star_red_64;
		this.img_star.image=star;
	}
    //that.place_name1.text = "";
    that.place_name2.text = point[0]+","+point[1];
	this.popView.show();
};
Views.prototype.createAndroidSearchBar=function (){
	var that = this;
	//var h=Ti.Platform.displayCaps.platformHeight;
	var pw = Ti.Platform.displayCaps.platformWidth;
	var ldf = Ti.Platform.displayCaps.logicalDensityFactor;
	var w = parseInt(pw / (ldf || 1), 10);
	that.searchBar = Ti.UI.Android.createSearchView({
	    //hintText: "Input Address to Search ",
	    backgroundColor: 'rgba(128,128,128,128)',
	    color: "black",
        width : w - 160,
	    height : '52dp',
	    top:0,
	    left:50,
	});
	that.searchBar.addEventListener('change', function (e) {
    	clearTimeout(that.searchThread);
		var searchFunc = function() {
		    if(e.source.value.length>1){
	        	//searchAddressGoogle(e.source.value,'nz');
	        	places.searchOfflinePOI(e.source.value,'nz');
	        }else{
	        	that.hideSearchList();
	        }
	    };
	    that.searchThread = setTimeout(searchFunc,1000);
	});
	that.searchBar.addEventListener("submit", function (e) {
    	clearTimeout(that.searchThread);
		var searchFunc = function() {
		    if(e.source.value.length>1){
	        	//searchAddressGoogle(e.source.value,'nz');
	        	places.searchOfflinePOI(e.source.value,'nz');
	        }else{
	        	that.hideSearchList();
	        }
	    };
	    that.searchThread = setTimeout(searchFunc,100);
	});
    map.win.add(that.searchBar);
};
Views.prototype.delaySearch = function (e) {
	var that=this;
	clearTimeout(that.searchThread);
	var searchFunc = function() {
	    if(e.source.value.length>1){
        	//searchAddressGoogle(e.source.value,'nz');
        	places.searchOfflinePOI(e.source.value,'nz');
        }else{
        	that.hideSearchList();
        }
    };
    that.searchThread = setTimeout(searchFunc,1000);
};
Views.prototype.hideSearchList=function (){
	if(this.searchList !== 0){
		this.searchList.hide();
	}
};

Views.prototype.fillSearchList=function (list,source){
	//if(this.searchList!==0)
    	//this.win.remove(this.searchList);
	this.clearSearchList();
	//this.showSearchList();
    var sections =[];
    var listSection = this.createGoogleListSection(list,source);
    sections.push(listSection);
    this.searchList.sections=sections;
    this.showSearchList();
    map.win.add(this.searchList);
};
Views.prototype.createGoogleListSection=function(list,source){
	var googleSection = Ti.UI.createListSection({headerTitle:source,width: Ti.UI.FILL,});
    var addressData= [];
    for (var i=0;i<list.length;i++){
    	var start = list[i].point; //JSON.parse();
    	var to = map.getCurrentPos();
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
};
Views.prototype.clearSearchList=function (){
	if(this.searchList!==0)
		this.searchList.removeAllChildren();
};
Views.prototype.showSearchList=function (){
	if(this.searchList !== 0){
		this.searchList.show();
	}
};
Views.prototype.createSearchList=function(){
	var that = this;
	var template = this.createSearchListItemTemplate();
	this.searchList = Ti.UI.createListView({
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
	this.searchList.addEventListener('itemclick', function(e) {
		//var pt = e.itemId;	//'[0,0]'
		//if (e.bindId == 'rowtitle' || e.bindId == 'pic'){
			var item = e.section.getItemAt(e.itemIndex);
    		//Ti.API.info("suggest.list.clicked :"+JSON.stringify(item));
			if(typeof item.rowtitle.id !== 'undefined'){
				map.changeDestination(JSON.parse(item.rowtitle.id));
				map.animateTo(JSON.parse(item.rowtitle.id));
			}
    		Ti.API.info("suggest.list.clicked :"+item.rowtitle.text);
    		Ti.API.info("that.place_name1 :"+that.place_name1);
    		Ti.API.info("that.place_name2 :"+that.place_name2);
			that.place_name1.text=item.rowtitle.text;
			that.place_name2.text=item.rowtitle.id;
    		that.hideSearchList();
		//}
    	that.hideKeyboard();
	});
};
Views.prototype.hideKeyboard=function(){
	if(this.searchBar !== 0){
		this.searchBar.blur();
	}
};
Views.prototype.hideBar = function() {
	var actionBar = map.win.activity.actionBar;
	//Ti.API.info('actionBar:'+actionBar );
	if(typeof actionBar !== 'undefined'){
		actionBar.hide();
	}
};
Views.prototype.createSearchListItemTemplate=function (){
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
};