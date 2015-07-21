function createPopView(){
	//backgroundColor : rgba(255,0,0,0.5)	//ios
	//backgroundColor : rgba(255,0,0,127)	//android
	var popDownView = Ti.UI.createView({
	    backgroundColor: 'rgba(64,64,64,200)',
	    width:'100%',
	    height:'20%',
	    layout: 'horizontal',
	    id:"pop",
	    //zIndex: 2,
	    bottom: 0
	});
	popDownView.visible=false;
	createColumns(popDownView);
	//setTimeout(function() {}, 10);
	win.add(popDownView);
	AllViews[popDownView.id] = popDownView;
	return popDownView;
}
function createColumns(popDownView){
	var column1 = Ti.UI.createView({
        width : 20+"%"
    });
	var close=Ti.App.Android.R.drawable.close_64;
	createImages(column1,close);
    var column2 = Ti.UI.createView({
        width : 20+"%"
    });
	var search=Ti.App.Android.R.drawable.search_64;
	createImages(column2,search);
	popDownView.add(column1);
	popDownView.add(column2);
}
//Titanium.UI.createSearchBar();
function createImages(view,id){
	var img = Titanium.UI.createImageView({
			image:id,
			width : 64
		});
	view.add(img);
}