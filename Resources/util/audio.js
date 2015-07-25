//play('type_1_dist_0.mp3');
var player = Titanium.Media.createSound();

function play(type,dist){
	var GH = getGHDict();
	var signname = GH[type];
	var dist00 = Math.ceil(dist/100)*100;//ceil/floor/round
	var file = signname+'_dist_'+dist00+'.mp3';
	var path = Ti.Filesystem.getResRawDirectory() + file;
	//var inFile = Ti.Filesystem.getFile(path);
	if(player.isPlaying()) return;
	player.url= path;
	try{
		player.play();
	}catch(e){
		Ti.API.info(path+' not exist');
	}
}
