var classes = [
	// 'transform',
	// 'opacity',
	'bgGradient',
	// 'greenBg',
	// 'red',
	// 'shadow',
	// 'huge',
	// 'right',
	// 'zIndex'
];

function changeClasses(e) {
	var c = $.behind.classes[0];
	if (c) {
		Ti.API.info('Removing class "' + c + '"');
		$.removeClass($.behind, c);
	} else {
		Ti.API.info('adding classes: ' + JSON.stringify(classes));
		$.addClass($.behind, classes);
	}
	$.behind.text = JSON.stringify($.behind.classes);
	Ti.API.info('####' + JSON.stringify($.behind));
}

// changeClasses();
$.index.open();
