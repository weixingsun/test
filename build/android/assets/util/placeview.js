function hidePopView(){var e=AllViews.pop;Ti.API.info("start to hide pop view"),"undefined"!=typeof e&&0!==e&&(Ti.API.info("hided pop view"),e.hide())}function showPopView(e){getAddressGoogle(e[0],e[1],getAddressCallback);var i=AllViews.pop;"undefined"!=typeof i&&0!==i&&(i.show(),Ti.API.info("show pop view"));var t=AllViews.star_img;if(isSavedPlacesDB(JSON.stringify(getDestinatePos()))){var a=Ti.App.Android.R.drawable.star_gray_64;t.image=a}else{var n=Ti.App.Android.R.drawable.star_red_64;t.image=n}}function createPlaceView(){var e=Ti.UI.createView({backgroundColor:"rgba(128,128,128,128)",width:"100%",height:"20%",layout:"vertical",id:"pop",bottom:0});return e.visible=!1,createRows(e),win.add(e),AllViews.pop=e,e}function createRows(e){var i=Ti.UI.createView({height:"60%",layout:"horizontal"}),t=Ti.UI.createView({height:"40%",layout:"horizontal"});e.add(i),e.add(t),createTopColumns(i),createBottomColumns(t)}function createTopColumns(e){{var i=Ti.UI.createView({width:"80%",layout:"vertical"}),t=Ti.UI.createView({height:"60%"}),a=Ti.UI.createView({height:"40%"}),n=Ti.UI.createView({width:"20%"}),o=Ti.App.Android.R.drawable.sedan_128;createCarImage(n,o)}createAdressLabel(t,a),i.add(t),i.add(a),e.add(i),e.add(n)}function createAdressLabel(e,i){var t=Ti.UI.createLabel({color:"#000",font:{fontSize:20},text:"Unnamed",textAlign:Ti.UI.TEXT_ALIGNMENT_CENTER,bottom:2,left:20,parent:e,width:Ti.UI.SIZE,height:Ti.UI.SIZE});e.add(t);var a=Ti.UI.createLabel({color:"#333",font:{fontSize:15},shadowColor:"#aaa",shadowOffset:{x:5,y:5},shadowRadius:3,text:JSON.stringify(getDestinatePos()),textAlign:Ti.UI.TEXT_ALIGNMENT_CENTER,top:2,left:25,parent:i,width:Ti.UI.SIZE,height:Ti.UI.SIZE});i.add(a),AllViews.place_name1=t,AllViews.place_name2=a}function createBottomColumns(e){var i,t=Ti.UI.createView({width:"12%"}),a=Ti.UI.createView({width:"10%"}),n=Ti.UI.createView({width:"10%"}),o=Ti.UI.createView({width:"10%"}),r=Ti.App.Android.R.drawable.close_64,d=Ti.App.Android.R.drawable.star_red_64,s=Ti.App.Android.R.drawable.star_gray_64,l=Ti.App.Android.R.drawable.search_64,c=Ti.App.Android.R.drawable.parking_64,p=createImages(t,r);isSavedPlacesDB(JSON.stringify(getDestinatePos()))?(Ti.API.info("===================is star place"),i=createImages(a,s)):(Ti.API.info("==================star icon to save place"),i=createImages(a,d));createImages(n,l),createImages(o,c);p.addEventListener("click",function(e){e.source.parent.parent.parent.hide(),removePrevAll(),Ti.App.Properties.setInt("MODE",0)}),i.addEventListener("click",function(){var e=getDestinatePos(),t={lat:e[0],lng:e[1],name:"name"};isSavedPlacesDB(JSON.stringify(e))?(removeSavedPlaceDB(t),removeSavedPlaceMarker(e),i.image=d):(addSavedPlaceDB(t),addSavedPlaceMarker(e),i.image=s)}),AllViews.star_img=i,e.add(t),e.add(a),e.add(n),e.add(o)}function createImages(e,i){var t=Titanium.UI.createImageView({image:i});return e.add(t),t}function createCarImage(e,i){var t=Titanium.UI.createImageView({image:i});return e.add(t),t.addEventListener("click",function(){var e=getCurrentPos(),i=getDestinatePos();Ti.API.info("mf="+mf+",map="+map+",from="+e+",to="+i),navi(mf,map,e,i)}),t.addEventListener("longclick",function(e){var i=JSON.parse(Ti.App.Properties.getString("bys")),t=Ti.App.Properties.getString("by"),a=i.indexOf(t),n=a==i.length-1?0:a+1,o=i[n];setSettingBy(o);var r=JSON.parse(Ti.App.Properties.getString("by_icons")),d=r[n];e.source.image=d}),AllViews.car_img=t,t}