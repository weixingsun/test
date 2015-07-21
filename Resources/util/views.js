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
	AllViews[popDownView.id] = popDownView;
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
        width : 50+"%"
    });
    var column2 = Ti.UI.createView({
        width : 30+"%"
    });
    var column3 = Ti.UI.createView({
        width : 20+"%"
    });
	var carId=Ti.App.Android.R.drawable.sedan_128;
	var img_car = createCarImage(column3,carId);
    
	createNameLabel(column1);
	rowView.add(column1);
	rowView.add(column2);
	rowView.add(column3);
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
	  width: Ti.UI.SIZE, height: Ti.UI.SIZE
	});
	column.add(label);
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
    	removePrevDestMarker(map);
    	var pre_line = Ti.App.Properties.getInt('route');
		if(pre_line!==0){
			map.removeLayer(pre_line);
		}
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
	    var dest_lat = Ti.App.Properties.getDouble("dest_lat");
		var dest_lng = Ti.App.Properties.getDouble("dest_lng");
	    var gps_lat = Ti.App.Properties.getDouble("gps_lat");
	    var gps_lng = Ti.App.Properties.getDouble("gps_lng");
	    var from = [gps_lat,gps_lng];
	    var to = [dest_lat,dest_lng];
	    Ti.API.info("mf="+mf+",map="+map+",from="+from+",to="+to);
	    navi(mf,map,from,to);
	    });
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
    });
	searchBar.addEventListener('return', function(e){
        searchBar.blur();
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