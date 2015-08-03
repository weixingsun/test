//play('turn_left_dist_0.mp3');
var player= null;
function play(type,dist00){
	//var GH = getGHDict();
	//var signname = GH[type];
	//var dist00 = Math.floor(dist/100)*100;//ceil/floor/round
	var file = type+'_dist_'+dist00+'.mp3';
	var path = Ti.Filesystem.getResRawDirectory() + file;
	//var inFile = Ti.Filesystem.getFile(path);
	if(player!== null && player.isPlaying()){
		Ti.API.info('still playing '+file);
		return false;
	} 
	try{
		player = Ti.Media.createSound({url:path});
		player.addEventListener('complete',function(e) {
			Ti.API.info('audio complete');
			player.release();///////////////////////////////////////////
		});
		player.play();
		Ti.API.info('play '+file);
		return true;
	}catch(e){
		Ti.API.info(path+' err:'+e.message);
		player= null;
	}
	return false;
}
