function createSuggestList(e){clearSuggestList(),showSuggestList();{var t=AllViews.searchList;AllViews.searchBar}if("undefined"==typeof t){var i=createSearchListItemTemplate(),t=Ti.UI.createListView({top:"50dp",left:10,width:"80%",height:Ti.UI.SIZE,backgroundColor:"rgba(64,64,64,64)",templates:{plain:i},defaultItemTemplate:"plain"});t.addEventListener("itemclick",function(e){if("rowtitle"==e.bindId||"pic"==e.bindId){var t=e.section.getItemAt(e.itemIndex);Ti.API.info("suggest.list.clicked :"+JSON.stringify(t)),"undefined"!=typeof t.rowtitle.id&&(changeDestination(JSON.parse(t.rowtitle.id)),animateTo(JSON.parse(t.rowtitle.id))),hideSuggestList()}hideKeyboard()})}for(var a=[],r=Ti.UI.createListSection({headerTitle:"Online",width:Ti.UI.FILL}),n=[],o=0;o<e.length;o++){var s=JSON.parse(e[o].point),l=getCurrentPos(),d=distance(s[0],s[1],l[0],l[1]),p=d>999?(d/1e3).toFixed(1)+" km":d+" m",c={pic:{image:Ti.App.Android.R.drawable.place_32.png},rowtitle:{text:e[o].addr,id:e[o].point,color:"black"},dist:{text:p,color:"black"},properties:{backgroundColor:"rgba(128,128,128,128)",height:"50dp"}};n.push(c)}r.setItems(n),a.push(r),t.sections=a,showSuggestList(),win.add(t),AllViews.searchList=t}function createSearchListItemTemplate(){var e={childTemplates:[{type:"Ti.UI.ImageView",bindId:"pic",properties:{left:"2dp",image:Ti.App.Android.R.drawable.place_32.png}},{type:"Ti.UI.Label",bindId:"rowtitle",properties:{left:"10dp",font:{fontSize:14}}},{type:"Ti.UI.Label",bindId:"dist",properties:{right:"10dp",font:{fontSize:14}}}]};return e}function clearSuggestList(){var e=AllViews.searchList;"undefined"!=typeof e&&e.removeAllChildren()}function hideSuggestList(){var e=AllViews.searchList;"undefined"!=typeof e&&e.hide()}function showSuggestList(){var e=AllViews.searchList;"undefined"!=typeof e&&e.show()}function hideKeyboard(){var e=AllViews.searchBar;"undefined"!=typeof e&&e.blur()}function createAndroidSearchBar(){var e,t=Ti.Platform.displayCaps.platformWidth,i=Ti.Platform.displayCaps.logicalDensityFactor,a=parseInt(t/(i||1),10),r=Ti.UI.Android.createSearchView({backgroundColor:"rgba(128,128,128,128)",color:"black",width:a-160,height:"52dp",top:0,left:50}),n=function(t){clearTimeout(e),e=setTimeout(function(){t.source.value.length>1?searchAddressGoogle(t.source.value,"nz"):hideSuggestList()},1e3)};r.addEventListener("change",n),r.addEventListener("submit",n),AllViews.searchBar=r,win.add(r)}function createIosSearchBar(){var e=Titanium.UI.createSearchBar({width:"80%",showCancel:!0,height:45,top:5,left:10});Ti.API.info("searchbar created"),win.add(e)}