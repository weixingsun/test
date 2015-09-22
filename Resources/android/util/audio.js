//speakMp3('turn_left_dist_0.mp3');
var speaker= null;
function speakMp3(type,dist00){
	//var GH = getGHDict();
	//var signname = GH[type];
	//var dist00 = Math.floor(dist/100)*100;//ceil/floor/round
	var file = type+'_dist_'+dist00+'.mp3';
	var path = Ti.Filesystem.getResRawDirectory() + file;
	//var inFile = Ti.Filesystem.getFile(path);
	/*if(speaker!== null && speaker.isPlaying()){
		Ti.API.info('still playing '+file);
		return false;
	}*/
	try{
		speaker = Ti.Media.createSound({url:path});
		speaker.addEventListener('complete',function(e) {
			Ti.API.info('audio complete');
			speaker.release();///////////////////////////////////////////
		});
		speaker.play();
		Ti.API.info('play '+file);
		return true;
	}catch(e){
		Ti.API.info(path+' err:'+e.message);
		player= null;
	}
	return false;
}
function importUtteranceModule(){
	var utterance = require('bencoding.utterance');
	if(!utterance.isSupported()){
		Ti.API.error("Sorry your device "+Ti.Platform.manufacturer+" "+Ti.Platform.model +":"+Ti.Platform.version+" does not support text to speech");
	}
	speaker = utterance.createSpeech();
	//utterance.createSpeechToText();
	//return utterance;
}

function speakLib(inputText,lang){
	if(speaker.isSpeaking()){
		Ti.API.info("already speaking");
		return;
	}
	Ti.API.info("playing "+inputText); //in 100 meters, turn_left
	speaker.startSpeaking({
		voice: lang, //'en_US',
		text:inputText,
	});
	//myTTS.setLanguage(Locale.US);
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
function speakInterface(dist,turn,street){
	var str = constructVoiceStr(dist,turn,street);
	var lang = 'en_US'; //'zh_CN';
	var strdict = Ti.App.Properties.getString('VOICE_PROMPT_DISTANCES');
	var dict = JSON.parse(strdict);
	if(dict[''+dist] != null) speakLib(str,lang);
	return true;//played successfully
}
function constructVoiceStr(dist,turn,street){
	var str = "";
	if(dist>0) str += 'in '+dist+' meters, ';
	str+=turn;
	if(street!=null && street.length>0) str += ', on '+street;
	return str;
}
