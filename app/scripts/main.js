/*
 * Page specific code, meant to keep the page logic code seperate from the code in the JS modules.
 */
$(document).ready(function() {

	// Default language setting.
	serverComparatorWorldTable.localUtils.setLanguage("EN");

	$("#languageSelector").change(function() {
		serverComparatorWorldTable.localUtils.setLanguage($("#languageSelector select").val());
	});
	
	// Set table to always be fixed away from the footer. (No overlap)
	$("#worldTableModule").css("margin-bottom",$("#footerBar").height());
});