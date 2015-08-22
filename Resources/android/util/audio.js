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
function importUtteranceModule(){
	var utterance = require('bencoding.utterance'),
		textToSpeech = utterance.createSpeech(),
		speechToText = utterance.createSpeechToText();
	if(!utterance.isSupported()){
		alert("Sorry your device does not support text to speech");
	}
}
function speak(inputText){
	if(textToSpeech.isSpeaking()){
		Ti.API.info("already speaking");
		return;
	}
	textToSpeech.startSpeaking({
		text:inputText
	});	
}
function hear(){
	speechToText.startSpeechToText({
		promptText:"Say something",
		maxResults: 10
	});
	speechToText.addEventListener('completed',function(e){
		Ti.API.info(JSON.stringify(e));	
		if(e.success && (e.wordCount > 0)){
			alert("Speech Recognized " + e.wordCount + " matches found: "  + JSON.stringify(e.words));
		}else{
			alert("Unable to recognize your speech");
		}
	});
}
