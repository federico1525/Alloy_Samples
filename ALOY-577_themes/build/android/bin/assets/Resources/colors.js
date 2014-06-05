function stylize(str, style) {
    var styles;
    if ("console" === exports.mode) styles = {
        bold: [ "[1m", "[22m" ],
        italic: [ "[3m", "[23m" ],
        underline: [ "[4m", "[24m" ],
        inverse: [ "[7m", "[27m" ],
        strikethrough: [ "[9m", "[29m" ],
        white: [ "[37m", "[39m" ],
        grey: [ "[90m", "[39m" ],
        black: [ "[30m", "[39m" ],
        blue: [ "[34m", "[39m" ],
        cyan: [ "[36m", "[39m" ],
        green: [ "[32m", "[39m" ],
        magenta: [ "[35m", "[39m" ],
        red: [ "[31m", "[39m" ],
        yellow: [ "[33m", "[39m" ]
    }; else if ("browser" === exports.mode) styles = {
        bold: [ "<b>", "</b>" ],
        italic: [ "<i>", "</i>" ],
        underline: [ "<u>", "</u>" ],
        inverse: [ '<span style="background-color:black;color:white;">', "</span>" ],
        strikethrough: [ "<del>", "</del>" ],
        white: [ '<span style="color:white;">', "</span>" ],
        grey: [ '<span style="color:gray;">', "</span>" ],
        black: [ '<span style="color:black;">', "</span>" ],
        blue: [ '<span style="color:blue;">', "</span>" ],
        cyan: [ '<span style="color:cyan;">', "</span>" ],
        green: [ '<span style="color:green;">', "</span>" ],
        magenta: [ '<span style="color:magenta;">', "</span>" ],
        red: [ '<span style="color:red;">', "</span>" ],
        yellow: [ '<span style="color:yellow;">', "</span>" ]
    }; else {
        if ("none" === exports.mode) return str + "";
        console.log('unsupported mode, try "browser", "console" or "none"');
    }
    return styles[style][0] + str + styles[style][1];
}

function applyTheme(theme) {
    var stringPrototypeBlacklist = [ "__defineGetter__", "__defineSetter__", "__lookupGetter__", "__lookupSetter__", "charAt", "constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf", "charCodeAt", "indexOf", "lastIndexof", "length", "localeCompare", "match", "replace", "search", "slice", "split", "substring", "toLocaleLowerCase", "toLocaleUpperCase", "toLowerCase", "toUpperCase", "trim", "trimLeft", "trimRight" ];
    Object.keys(theme).forEach(function(prop) {
        -1 !== stringPrototypeBlacklist.indexOf(prop) ? console.log("warn: ".red + ("String.prototype" + prop).magenta + " is probably something you don't want to override. Ignoring style name") : "string" == typeof theme[prop] ? addProperty(prop, function() {
            return exports[theme[prop]](this);
        }) : addProperty(prop, function() {
            var ret = this;
            for (var t = 0; theme[prop].length > t; t++) ret = exports[theme[prop][t]](ret);
            return ret;
        });
    });
}

function sequencer(map) {
    return function() {
        if (!isHeadless) return this.replace(/( )/, "$1");
        var exploded = this.split("");
        exploded = exploded.map(map);
        return exploded.join("");
    };
}

var isHeadless = false;

"undefined" != typeof module && (isHeadless = true);

if (isHeadless) exports.mode = "console"; else {
    var exports = {};
    var module = {};
    var colors = exports;
    exports.mode = "browser";
}

var addProperty = function(color, func) {
    exports[color] = function(str) {
        return func.apply(str);
    };
    String.prototype.__defineGetter__(color, func);
};

var x = [ "bold", "underline", "strikethrough", "italic", "inverse", "grey", "black", "yellow", "red", "green", "blue", "white", "cyan", "magenta" ];

x.forEach(function(style) {
    addProperty(style, function() {
        return stylize(this, style);
    });
});

var rainbowMap = function() {
    var rainbowColors = [ "red", "yellow", "green", "blue", "magenta" ];
    return function(letter, i) {
        return " " === letter ? letter : stylize(letter, rainbowColors[i++ % rainbowColors.length]);
    };
}();

exports.themes = {};

exports.addSequencer = function(name, map) {
    addProperty(name, sequencer(map));
};

exports.addSequencer("rainbow", rainbowMap);

exports.addSequencer("zebra", function(letter, i) {
    return 0 === i % 2 ? letter : letter.inverse;
});

exports.setTheme = function(theme) {
    if ("string" == typeof theme) try {
        exports.themes[theme] = require(theme);
        applyTheme(exports.themes[theme]);
        return exports.themes[theme];
    } catch (err) {
        console.log(err);
        return err;
    } else applyTheme(theme);
};

addProperty("stripColors", function() {
    return ("" + this).replace(/\x1B\[\d+m/g, "");
});