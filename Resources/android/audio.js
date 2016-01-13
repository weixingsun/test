function Audio(){
	this.speaker=0;
	this.played={};
	this.VOICE_PROMPT_DISTANCES={
		"0":"0",
		"100":"100",
		"200":"200",
		"500":"500",
		"1000":"1000",
		"2000":"2000",
	};
	this.GH_TURN_DICT0={
		"-3":"turn_sharp_left",
		"-2":"turn_left",
		"-1":"turn_slight_left",
		"0":"continue",
		"1":"turn_slight_right",
		"2":"turn_right",
		"3":"turn_sharp_right",
		"4":"finish",
		"5":"reached_via",
		"6":"use_roundabout"
	};
	this.GH_TURN_DICT={
		"-3":"turn sharp left",
		"-2":"turn left",
		"-1":"turn slight left",
		"0":"continue",
		"1":"turn slight right",
		"2":"turn right",
		"3":"turn sharp right",
		"4":"finish",
		"5":"reached via",
		"6":"use roundabout"
	};
};
//speakMp3('turn_left_dist_0.mp3');
Audio.prototype.speakMp3 = function(type,dist00){
	//var GH = getGHDict();
	//var signname = GH[type];
	//var dist00 = Math.floor(dist/100)*100;//ceil/floor/round
	var that = this;
	var file = type+'_dist_'+dist00+'.mp3';
	var path = Ti.Filesystem.getResRawDirectory() + file;
	//var inFile = Ti.Filesystem.getFile(path);
	/*if(speaker!== null && speaker.isPlaying()){
		Ti.API.info('still playing '+file);
		return false;
	}*/
	try{
		this.speaker = Ti.Media.createSound({url:path});
		this.speaker.addEventListener('complete',function(e) {
			Ti.API.info('audio complete');
			that.speaker.release();///////////////////////////////////////////
		});
		this.speaker.play();
		Ti.API.info('play '+file);
		return true;
	}catch(e){
		Ti.API.info(path+' err:'+e.message);
	}
	return false;
};
Audio.prototype.init = function(){
	var utterance = require('bencoding.utterance');
	if(!utterance.isSupported()){
		Ti.API.error("Sorry your device "+Ti.Platform.manufacturer+" "+Ti.Platform.model +":"+Ti.Platform.version+" does not support text to speech");
	}
	this.speaker = utterance.createSpeech();
	//utterance.createSpeechToText();
	//return utterance;
};

Audio.prototype.speakLib = function (inputText,lang){
	if(this.speaker.isSpeaking()){
		Ti.API.info("already speaking");
		return;
	}
	Ti.API.info("playing "+inputText); //in 100 meters, turn_left
	this.speaker.startSpeaking({
		voice: lang, //'en_US',
		text:inputText,
	});
	//myTTS.setLanguage(Locale.US);
};
Audio.prototype.isPlayed = function (id,dist){
	if(this.played[''+id+"_"+dist] !== undefined && this.played[''+id+"_"+dist]==='y') return true;
	return false;
};
Audio.prototype.setPlayedList = function (id,dist){
	this.played[''+id+"_"+dist]='y';
};
Audio.prototype.speakInterface = function (dist,turn,street){
	var str = this.constructVoiceStr(dist,turn,street);
	var lang = 'en_US'; //'zh_CN';
	var dict = this.VOICE_PROMPT_DISTANCES;
	if(dict[''+dist] != null) this.speakLib(str,lang);
	return true;//played successfully
};
Audio.prototype.constructVoiceStr = function (dist,turn,street){
	var str = "";
	if(dist>0) str += 'in '+dist+' meters, ';
	str+=turn;
	if(street!=null && street.length>0) str += ', on '+street;
	return str;
};

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
