function Audio(){this.speaker=0,this.played={},this.VOICE_PROMPT_DISTANCES={0:"0",100:"100",200:"200",500:"500",1000:"1000",2000:"2000"},this.GH_TURN_DICT0={"-3":"turn_sharp_left","-2":"turn_left","-1":"turn_slight_left",0:"continue",1:"turn_slight_right",2:"turn_right",3:"turn_sharp_right",4:"finish",5:"reached_via",6:"use_roundabout"},this.GH_TURN_DICT={"-3":"turn sharp left","-2":"turn left","-1":"turn slight left",0:"continue",1:"turn slight right",2:"turn right",3:"turn sharp right",4:"finish",5:"reached via",6:"use roundabout"}}function hear(){speechToText.startSpeechToText({promptText:"Say something",maxResults:10}),speechToText.addEventListener("completed",function(e){Ti.API.info(JSON.stringify(e)),e.success&&e.wordCount>0?alert("Speech Recognized "+e.wordCount+" matches found: "+JSON.stringify(e.words)):alert("Unable to recognize your speech")})}function speakInterface(e,i,t){var n=constructVoiceStr(e,i,t),r="en_US",o=Ti.App.Properties.getString("VOICE_PROMPT_DISTANCES"),a=JSON.parse(o);return null!=a[""+e]&&speakLib(n,r),!0}function constructVoiceStr(e,i,t){var n="";return e>0&&(n+="in "+e+" meters, "),n+=i,null!=t&&t.length>0&&(n+=", on "+t),n}Audio.prototype.speakMp3=function(e,i){var t=this,n=e+"_dist_"+i+".mp3",r=Ti.Filesystem.getResRawDirectory()+n;try{return this.speaker=Ti.Media.createSound({url:r}),this.speaker.addEventListener("complete",function(e){Ti.API.info("audio complete"),t.speaker.release()}),this.speaker.play(),Ti.API.info("play "+n),!0}catch(o){Ti.API.info(r+" err:"+o.message)}return!1},Audio.prototype.init=function(){var e=require("bencoding.utterance");e.isSupported()||Ti.API.error("Sorry your device "+Ti.Platform.manufacturer+" "+Ti.Platform.model+":"+Ti.Platform.version+" does not support text to speech"),this.speaker=e.createSpeech()},Audio.prototype.speakLib=function(e,i){return this.speaker.isSpeaking()?void Ti.API.info("already speaking"):(Ti.API.info("playing "+e),void this.speaker.startSpeaking({voice:i,text:e}))},Audio.prototype.isPlayed=function(e,i){return void 0!==this.played[""+e+"_"+i]&&"y"===this.played[""+e+"_"+i]?!0:!1},Audio.prototype.setPlayedList=function(e,i){this.played[""+e+"_"+i]="y"},Audio.prototype.speakInterface=function(e,i,t){var n=this.constructVoiceStr(e,i,t),r="en_US",o=this.VOICE_PROMPT_DISTANCES;return null!=o[""+e]&&this.speakLib(n,r),!0},Audio.prototype.constructVoiceStr=function(e,i,t){var n="";return e>0&&(n+="in "+e+" meters, "),n+=i,null!=t&&t.length>0&&(n+=", on "+t),n};