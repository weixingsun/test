function hidePopView(){
	var pop = AllViews["pop"];
	if(typeof pop !== 'undefined')
		pop.hide();
}
function showPopView(){
	var pop = AllViews["pop"];
	if(typeof pop !== 'undefined')
		pop.show();
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
        width : 80+"%"
    });
    var column2 = Ti.UI.createView({
        width : 20+"%"
    });
	var carId=Ti.App.Android.R.drawable.sedan_128;
	var img_car = createCarImage(column2,carId);
	createNameLabel(column1);
	rowView.add(column1);
	rowView.add(column2);
}
function createNameLabel(column){
    var dest_lat = Ti.App.Properties.getDouble("dest_lat");
	var dest_lng = Ti.App.Properties.getDouble("dest_lng");
	var name = '['+dest_lat+','+dest_lng+']';
	var label = Ti.UI.createLabel({
	  color: '#900',
	  font: { fontSize:20 },
	  shadowColor: '#aaa',
	  shadowOffset: {x:5, y:5},
	  shadowRadius: 3,
	  text: name,
	  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	  top: 10,
	  left: 5,
	  parent: column,
	  width: Ti.UI.SIZE, height: Ti.UI.SIZE
	});
	column.add(label);
	AllViews["place_name"] = label;
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
	var search=Ti.App.Android.R.drawable.search_64;
	var parking=Ti.App.Android.R.drawable.parking_64;
	var img_close = createImages(column1,close);
	var img_search = createImages(column2,search);
	var img_parking = createImages(column3,parking);
    img_close.addEventListener('click', function(e){
    	e.source.parent.parent.parent.hide();
    	removePrevAll();
    	var pre_line = Ti.App.Properties.getInt('route');
		if(pre_line!==0){
			map.removeLayer(pre_line);
		}
		Ti.App.Properties.setInt("MODE",0);
    });
	popDownView.add(column1);
	popDownView.add(column2);
	popDownView.add(column3);
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
	    var from = [Ti.App.Properties.getDouble("gps_lat"),Ti.App.Properties.getDouble("gps_lng")];
	    var to = [Ti.App.Properties.getDouble("dest_lat"),Ti.App.Properties.getDouble("dest_lng")];
	    Ti.API.info("mf="+mf+",map="+map+",from="+from+",to="+to);
	    navi(mf,map,from,to);
	    });
	img.addEventListener('longclick',function(e){
		var bys = JSON.parse(Ti.App.Properties.getString('bys'));
		var by = Ti.App.Properties.getString('by');
		var index = bys.indexOf(by);
		var nextindex = index==bys.length-1?0:index+1;
		var nextby = bys[nextindex];
		Ti.API.info('nextBy='+nextby);
		Ti.App.Properties.setString('by',nextby);
    	var icons = JSON.parse(Ti.App.Properties.getString('by_icons'));
    	var nexticon = icons[nextindex];
    	e.source.image = nexticon;
	});
	AllViews["car_img"] = img;
	return img;
}