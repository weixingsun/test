//play('type_1_dist_0.mp3');
function play(file){
	var folder = Ti.Filesystem.resRawDirectory;//Ti.Filesystem.resourcesDirectory
	var inFile = Ti.Filesystem.getFile(folder, file);
	//var sound = Titanium.Media.createSound({url:pathFromOS, preload:'true'});
	//sound.play();
}
