function Views(){this.popView=0,this.img_star=0,this.searchBar=0,this.place_name1=0,this.place_name2=0}Views.prototype.createPlaceView=function(){var e=Ti.UI.createView({backgroundColor:"rgba(128,128,128,128)",width:"100%",height:"20%",layout:"vertical",id:"pop",bottom:0});return e.visible=!1,this.createRows(e),map.win.add(e),this.popView=e,e},Views.prototype.createRows=function(e){var t=Ti.UI.createView({height:"60%",layout:"horizontal"}),i=Ti.UI.createView({height:"40%",layout:"horizontal"});e.add(t),e.add(i),this.createTopColumns(t),this.createBottomColumns(i)},Views.prototype.createTopColumns=function(e){var t=Ti.UI.createView({width:"80%",layout:"vertical"}),i=Ti.UI.createView({height:"60%"}),a=Ti.UI.createView({height:"40%"}),r=Ti.UI.createView({width:"20%"}),o=Ti.App.Android.R.drawable.sedan_128;this.createCarImage(r,o);this.createAdressLabel(i,a),t.add(i),t.add(a),e.add(t),e.add(r)},Views.prototype.createCarImage=function(e,t){var i=Titanium.UI.createImageView({image:t});return e.add(i),i.addEventListener("click",function(e){var t=map.getCurrentPos(),i=map.getDestinatePos();map.navi(t,i)}),i.addEventListener("longclick",function(e){var t=map.changeToNextBy();e.source.image=t.icon}),i},Views.prototype.createAdressLabel=function(e,t){this.place_name1=Ti.UI.createLabel({color:"#000",font:{fontSize:20},text:"Unnamed",textAlign:Ti.UI.TEXT_ALIGNMENT_CENTER,bottom:2,left:20,parent:e,width:Ti.UI.SIZE,height:Ti.UI.SIZE}),e.add(this.place_name1),this.place_name2=Ti.UI.createLabel({color:"#333",font:{fontSize:15},shadowColor:"#aaa",shadowOffset:{x:5,y:5},shadowRadius:3,text:"0,0",textAlign:Ti.UI.TEXT_ALIGNMENT_CENTER,top:2,left:25,parent:t,width:Ti.UI.SIZE,height:Ti.UI.SIZE}),t.add(this.place_name2)},Views.prototype.createImages=function(e,t){var i=Titanium.UI.createImageView({image:t});return e.add(i),i},Views.prototype.createBottomColumns=function(e){var t=this,i=Ti.UI.createView({width:"12%"}),a=Ti.UI.createView({width:"10%"}),r=Ti.UI.createView({width:"10%"}),o=Ti.UI.createView({width:"10%"}),n=Ti.App.Android.R.drawable.close_64,s=Ti.App.Android.R.drawable.star_red_64,l=Ti.App.Android.R.drawable.star_gray_64,c=Ti.App.Android.R.drawable.search_64,p=Ti.App.Android.R.drawable.parking_64,d=this.createImages(i,n);places.isSavedPlacesDB(map.getDestinatePos())?(Ti.API.info("===================is star place"),this.img_star=this.createImages(a,l)):(Ti.API.info("==================star icon to save place"),this.img_star=this.createImages(a,s));this.createImages(r,c),this.createImages(o,p);d.addEventListener("click",function(e){e.source.parent.parent.parent.hide(),map.removeAll(),map.mode=0,map.win.setKeepScreenOn(!1)}),this.img_star.addEventListener("click",function(e){var i=map.getDestinatePos(),a={lat:i[0],lng:i[1],name:"name"};places.isSavedPlacesDB(i)?(places.removeSavedPlaceDB(a),places.removeSavedPlaceMarker(i),t.img_star.image=s):(places.addSavedPlaceDB(a),places.addSavedPlaceMarker(i),t.img_star.image=l)}),e.add(i),e.add(a),e.add(r),e.add(o)},Views.prototype.hidePopView=function(){this.popView.hide()},Views.prototype.showPopView=function(e){var t=this;if(net.getAddressGoogle(e,function(e){t.place_name1.text=e[0],t.place_name2.text=e[1]}),places.isSavedPlacesDB(map.getDestinatePos())){var i=Ti.App.Android.R.drawable.star_gray_64;this.img_star.image=i}else{var a=Ti.App.Android.R.drawable.star_red_64;this.img_star.image=a}t.place_name2.text=e[0]+","+e[1],this.popView.show()},Views.prototype.createAndroidSearchBar=function(){var e=this,t=Ti.Platform.displayCaps.platformWidth,i=Ti.Platform.displayCaps.logicalDensityFactor,a=parseInt(t/(i||1),10);e.searchBar=Ti.UI.Android.createSearchView({backgroundColor:"rgba(128,128,128,128)",color:"black",width:a-160,height:"52dp",top:0,left:50}),e.searchBar.addEventListener("change",function(t){clearTimeout(e.searchThread);var i=function(){t.source.value.length>1?e.searchOfflinePOI(t.source.value,"nz"):e.hideSearchList()};e.searchThread=setTimeout(i,1e3)}),e.searchBar.addEventListener("submit",function(t){clearTimeout(e.searchThread);var i=function(){t.source.value.length>1?e.searchOfflinePOI(t.source.value,"nz"):e.hideSearchList()};e.searchThread=setTimeout(i,100)}),map.win.add(e.searchBar)},Views.prototype.delaySearch=function(e){var t=this;clearTimeout(t.searchThread);var i=function(){e.source.value.length>1?t.searchOfflinePOI(e.source.value,"nz"):t.hideSearchList()};t.searchThread=setTimeout(i,1e3)},Views.prototype.hideSearchList=function(){0!==this.searchList&&this.searchList.hide()},Views.prototype.searchOfflinePOI=function(e,t){var i=this,a=e.replace(/'/g,"''"),r=map.getCurrentPos(),o="poi",n="lat,lng,pname",s="pname match '*"+a+"*'",l=r[0]+"-lat",c=r[1]+"-lng",p="("+l+")*("+l+")+("+c+")*("+c+")  asc limit 0,20",d="select "+n+" from "+o+" where "+s+" order by "+p,u="/"+Ti.App.id+"/poi/"+t+".db",h={sql:d,db:u};map.navimodule.queryFTS(h,function(a){i.fillSearchList(a.rows,"Offline"),i.showSearchList(),a.rows.length<1&&searchAddressGoogle(e,t)})},Views.prototype.fillSearchList=function(e,t){this.clearSearchList();var i=[],a=this.createGoogleListSection(e,t);i.push(a),this.searchList.sections=i,Ti.API.info("createSuggestList().before.show"),this.showSearchList(),Ti.API.info("createSuggestList().listSection.created"),map.win.add(this.searchList)},Views.prototype.createGoogleListSection=function(e,t){for(var i=Ti.UI.createListSection({headerTitle:t,width:Ti.UI.FILL}),a=[],r=0;r<e.length;r++){var o=e[r].point,n=map.getCurrentPos(),s=distance(o[0],o[1],n[0],n[1]),l=s>999?(s/1e3).toFixed(1)+" km":s+" m",c={pic:{image:Ti.App.Android.R.drawable.place_32.png},rowtitle:{text:e[r].addr,id:JSON.stringify(e[r].point),color:"black"},dist:{text:l,color:"black"},properties:{backgroundColor:"rgba(128,128,128,128)",height:"50dp"}};a.push(c)}return i.setItems(a),i},Views.prototype.clearSearchList=function(){0!==this.searchList&&this.searchList.removeAllChildren()},Views.prototype.showSearchList=function(){0!==this.searchList&&this.searchList.show()},Views.prototype.createSearchList=function(){var e=this,t=this.createSearchListItemTemplate();this.searchList=Ti.UI.createListView({top:"50dp",left:10,width:"80%",height:Ti.UI.SIZE,backgroundColor:"rgba(64,64,64,64)",templates:{plain:t},defaultItemTemplate:"plain"}),this.searchList.addEventListener("itemclick",function(t){var i=t.section.getItemAt(t.itemIndex);"undefined"!=typeof i.rowtitle.id&&(map.changeDestination(JSON.parse(i.rowtitle.id)),map.animateTo(JSON.parse(i.rowtitle.id))),Ti.API.info("suggest.list.clicked :"+i.rowtitle.text),Ti.API.info("that.place_name1 :"+e.place_name1),Ti.API.info("that.place_name2 :"+e.place_name2),e.place_name1.text=i.rowtitle.text,e.place_name2.text=i.rowtitle.id,e.hideSearchList(),e.hideKeyboard()})},Views.prototype.hideKeyboard=function(){0!==this.searchBar&&this.searchBar.blur()},Views.prototype.hideBar=function(){var e=map.win.activity.actionBar;"undefined"!=typeof e&&e.hide()},Views.prototype.createSearchListItemTemplate=function(){var e={childTemplates:[{type:"Ti.UI.ImageView",bindId:"pic",properties:{left:"2dp",image:Ti.App.Android.R.drawable.place_32.png}},{type:"Ti.UI.Label",bindId:"rowtitle",properties:{left:"10dp",font:{fontSize:14}}},{type:"Ti.UI.Label",bindId:"dist",properties:{right:"10dp",font:{fontSize:14}}}]};return e};