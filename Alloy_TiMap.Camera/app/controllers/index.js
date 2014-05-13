// add the iOS7-specific camera view
if (OS_IOS && parseInt(Ti.Platform.version, 10) >= 7) {
	var cam = Alloy.Globals.Map.createCamera({
		altitude : 300,
		centerCoordinate : {
			latitude : 37.389569,
			longitude : -122.050212
		},
		heading : -45,
		pitch : 60,
		showsBuildings : true
	});
	// var animCam = function(){
	// Ti.API.info("#### animating!!!");
	// // $.map.removeEventListener('complete', animCam);
	// $.map.animateCamera({
	// camera: cam,
	// curve: Ti.UI.ANIMATION_CURVE_EASE_IN,
	// duration: 3000
	// });
	// };
	// $.map.addEventListener('complete', animCam);
	
	function mapToCamera() {
		Ti.API.info("#### animating!!!");
		(animCam = function() {
			// $.map.removeEventListener('complete', animCam);
			$.map.animateCamera({
				camera : cam,
				curve : Ti.UI.ANIMATION_CURVE_EASE_IN,
				duration : 3000
			});
		})();
	}

}

// some map types are not unified across platforms
// if(OS_ANDROID) {
// $.map1.mapType = Alloy.Globals.Map.TERRAIN_TYPE;
// } else {
// $.map1.mapType = Alloy.Globals.Map.SATELLITE_TYPE;
// }

$.win.open();
