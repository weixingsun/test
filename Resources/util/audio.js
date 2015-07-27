//play('turn_left_dist_0.mp3');
var player = Titanium.Media.createSound();

function play(type,dist){
	var GH = getGHDict();
	var signname = GH[type];
	var dist00 = Math.floor(dist/100)*100;//ceil/floor/round
	var file = signname+'_dist_'+dist00+'.mp3';
	var path = Ti.Filesystem.getResRawDirectory() + file;
	//var inFile = Ti.Filesystem.getFile(path);
	if(player.isPlaying()) return;
	try{
		Ti.API.info('playing '+file);
		player.url= path;
		player.play();
	}catch(e){
		Ti.API.info(path+' not exist');
	}
}
