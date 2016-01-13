
function initACRA(){
	var ACRA = require("ti.acra");
	/*ACRA.init({
		formUri: "http://nzmessengers.com/acra",
	});*/
	//dlopen failed: cannot locate symbol "__exidx_end"
	//add LOCAL_LDFLAGS += -fuse-ld=bfd ======== 
	ACRA.init({
		mailTo: 'sun.app.service@gmail.com',
		resToastTextKey: 'acra_crash_toast_text', // The i18n key for the text to be displayed in the toast upon crash
		customReportContent: [ // See https://github.com/ACRA/acra/wiki/ReportContent for details
			ACRA.ReportField_STACK_TRACE,
			ACRA.ReportField_LOGCAT,
		],
	//	logcatFilterByPid: true, // Set this to true if you want to include only logcat lines related to your Application process.
		mode: ACRA.ReportingInteractionMode_TOAST,
		logcatArguments: ["-t", "300", "-v", "time"],
	});
}
function crash(){
	var label = Ti.UI.createLabel({
		color:'black',
		text:L('crash'),
		borderColor: 'red',
		height:'auto',
		width:'auto'
	});
	label.setVisible(0);
	//view.add(label);
}
