function speakMp3(e,i){var t=e+"_dist_"+i+".mp3",a=Ti.Filesystem.getResRawDirectory()+t;try{return speaker=Ti.Media.createSound({url:a}),speaker.addEventListener("complete",function(e){Ti.API.info("audio complete"),speaker.release()}),speaker.play(),Ti.API.info("play "+t),!0}catch(n){Ti.API.info(a+" err:"+n.message),player=null}return!1}function importUtteranceModule(){var e=require("bencoding.utterance");e.isSupported()||Ti.API.error("Sorry your device "+Ti.Platform.manufacturer+" "+Ti.Platform.model+":"+Ti.Platform.version+" does not support text to speech"),speaker=e.createSpeech()}function speakLib(e,i){return speaker.isSpeaking()?void Ti.API.info("already speaking"):(Ti.API.info("playing "+e),void speaker.startSpeaking({voice:i,text:e}))}function hear(){speechToText.startSpeechToText({promptText:"Say something",maxResults:10}),speechToText.addEventListener("completed",function(e){Ti.API.info(JSON.stringify(e)),e.success&&e.wordCount>0?alert("Speech Recognized "+e.wordCount+" matches found: "+JSON.stringify(e.words)):alert("Unable to recognize your speech")})}function speakInterface(e,i,t){var a=constructVoiceStr(e,i,t),n="en_US",o=Ti.App.Properties.getString("VOICE_PROMPT_DISTANCES"),r=JSON.parse(o);return null!=r[""+e]&&speakLib(a,n),!0}function constructVoiceStr(e,i,t){var a="";return e>0&&(a+="in "+e+" meters, "),a+=i,null!=t&&t.length>0&&(a+=", on "+t),a}var speaker=null;