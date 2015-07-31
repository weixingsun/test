function hidePopView(){
	var pop = AllViews["pop"];
	Ti.API.info('start to hide pop view');
	if(typeof pop !== 'undefined' && pop!==0){
		Ti.API.info('hided pop view');
		pop.hide();
	}
}
function showPopView(coord){
	//getAddressOSM(coord[0],coord[1], getAddressCallback);
	getAddressGoogle(coord[0],coord[1],getAddressCallback);
	var pop = AllViews["pop"];
	if(typeof pop !== 'undefined' && pop!==0){
		pop.show();
		Ti.API.info('show pop view');
	}
	var star_img = AllViews["star_img"];
	if(isSavedPlacesDB(JSON.stringify(getDestinatePos()))){
		var unstar=Ti.App.Android.R.drawable.star_gray_64;
		star_img.image=unstar;
	}else{
		var star=Ti.App.Android.R.drawable.star_red_64;
		star_img.image=star;
	}
}
function createPlaceView(){
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
	createRows(popDownView);
	//setTimeout(function() {}, 10);
	win.add(popDownView);
	AllViews["pop"] = popDownView;
	return popDownView;
}
function createRows(popDownView){
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
	createTopColumns(row1);
	createBottomColumns(row2);
}
function createTopColumns(rowView){
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
	var img_car = createCarImage(column2,carId);
	createAdressLabel(row1,row2);
	column1.add(row1);
	column1.add(row2);
	rowView.add(column1);
	rowView.add(column2);
}
function createAdressLabel(row1,row2){
	var label1 = Ti.UI.createLabel({
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
	row1.add(label1);
	var label2 = Ti.UI.createLabel({
	  color: '#333',
	  font: { fontSize:15 },
	  shadowColor: '#aaa',
	  shadowOffset: {x:5, y:5},
	  shadowRadius: 3,
	  text: JSON.stringify(getDestinatePos()),
	  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	  top: 2,
	  left: 25,
	  parent: row2,
	  width: Ti.UI.SIZE, height: Ti.UI.SIZE
	});
	row2.add(label2);
	AllViews["place_name1"] = label1;
	AllViews["place_name2"] = label2;
}
function createBottomColumns(popDownView){
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
	var img_close = createImages(column1,close);
	var img_star;
	//AllViews["star_img"]
	if(isSavedPlacesDB(JSON.stringify(getDestinatePos()))){
		Ti.API.info('===================is star place');
		img_star  = createImages(column2,unstar);
	}else{
		Ti.API.info('==================star icon to save place');
		img_star  = createImages(column2,star);
	}
	var img_search = createImages(column3,search);
	var img_parking = createImages(column4,parking);
    img_close.addEventListener('click', function(e){
    	e.source.parent.parent.parent.hide();
    	removePrevAll();
		Ti.App.Properties.setInt("MODE",0);
    });
    img_star.addEventListener('click', function(e){
    	var point=getDestinatePos();
    	var place = {lat:point[0],lng:point[1],name:'name'};
    	if(isSavedPlacesDB(JSON.stringify(point))){
    		removeSavedPlaceDB(place);
    		removeSavedPlaceMarker(point);
    		img_star.image=star;
    	}else{
    		addSavedPlaceDB(place);
    		addSavedPlaceMarker(point);
    		img_star.image=unstar;
    	}
    });
	AllViews["star_img"] = img_star;
	popDownView.add(column1);
	popDownView.add(column2);
	popDownView.add(column3);
	popDownView.add(column4);
}
function createImages(view,id){
	var img = Titanium.UI.createImageView({
			image:id,
			//width : 64
		});
	view.add(img);
	return img;
}
function createCarImage(view,id){
	var img = Titanium.UI.createImageView({
			image:id,
			//width : 64
		});
	view.add(img);
    img.addEventListener('click', function(e){
	    var from = getCurrentPos();
	    var to = getDestinatePos();
	    Ti.API.info("mf="+mf+",map="+map+",from="+from+",to="+to);
	    navi(mf,map,from,to);
	    });
	img.addEventListener('longclick',function(e){
		var bys = JSON.parse(Ti.App.Properties.getString('bys'));
		var by = Ti.App.Properties.getString('by');
		var index = bys.indexOf(by);
		var nextindex = index==bys.length-1?0:index+1;
		var nextby = bys[nextindex];
		//Ti.API.info('nextBy='+nextby);
		setSettingBy(nextby);
    	var icons = JSON.parse(Ti.App.Properties.getString('by_icons'));
    	var nexticon = icons[nextindex];
    	e.source.image = nexticon;
	});
	AllViews["car_img"] = img;
	return img;
}