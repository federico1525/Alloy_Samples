var colors = require("colors");

module.exports = function(opts) {
    function started() {
        print("Begin Alloy Test Suite");
    }
    function yellowStar() {
        print(yellowStr("(・_・)"));
    }
    function plural(str, count) {
        return 1 == count ? str : str + "s";
    }
    function repeat(thing, times) {
        var arr = [];
        for (var i = 0; times > i; i++) arr.push(thing);
        return arr;
    }
    function indent(str, spaces) {
        var lines = (str || "").split("\n");
        var newArr = [];
        for (var i = 0; lines.length > i; i++) newArr.push(repeat(" ", spaces).join("") + lines[i]);
        return newArr.join("\n");
    }
    function specFailureDetails(suiteDescription, specDescription, stackTraces, messages) {
        print(" ");
        print(suiteDescription + " " + specDescription);
        var i;
        for (i = 0; messages.length > i; i++) print(indent(messages[i], 2));
        for (i = 0; stackTraces.length > i; i++) print(indent(stackTraces[i], 2));
    }
    function finished(elapsed) {
        print("Finished in " + elapsed / 1e3 + " seconds");
    }
    function summary(colorF, specs, failed) {
        print(colorF(specs + " " + plural(language.spec, specs) + ", " + failed + " " + plural(language.failure, failed)));
    }
    function greenSummary(specs, failed) {
        summary(greenStr, specs, failed);
    }
    function redSummary(specs, failed) {
        summary(redStr, specs, failed);
    }
    function fullSuiteDescription(suite) {
        var fullDescription = suite.description;
        suite.parentSuite && (fullDescription = fullSuiteDescription(suite.parentSuite) + " " + fullDescription);
        return fullDescription;
    }
    function eachSpecFailure(suiteResults, callback) {
        for (var i = 0; suiteResults.length > i; i++) {
            var suiteResult = suiteResults[i];
            for (var j = 0; suiteResult.failedSpecResults.length > j; j++) {
                var failedSpecResult = suiteResult.failedSpecResults[j];
                var stackTraces = [];
                var messages = [];
                for (var k = 0; failedSpecResult.items_.length > k; k++) {
                    stackTraces.push(failedSpecResult.items_[k].trace.stack);
                    messages.push(failedSpecResult.items_[k].message);
                }
                callback(suiteResult.description, failedSpecResult.description, stackTraces, messages);
            }
        }
    }
    opts = opts || {};
    var doneCallback = opts.doneCallback || function() {};
    var print, showColors;
    if ("undefined" != typeof Ti) {
        print = Ti.API.info;
        showColors = false;
    } else {
        print = console.log;
        showColors = true;
    }
    print = opts.print || print;
    showColors = opts.showColors || showColors;
    var language = {
        spec: "spec",
        failure: "failure"
    };
    var plainPrint = function(str) {
        return str;
    };
    var greenStr = showColors ? function(str) {
        return str.green;
    } : plainPrint;
    var redStr = showColors ? function(str) {
        return str.red;
    } : plainPrint;
    var yellowStr = showColors ? function(str) {
        return str.yellow;
    } : plainPrint;
    this.now = function() {
        return new Date().getTime();
    };
    this.reportRunnerStarting = function() {
        this.runnerStartTime = this.now();
        started();
    };
    this.reportSpecStarting = function() {};
    this.reportSpecResults = function(spec) {
        function getDescription(suite) {
            if (!suite) return;
            desc = suite.description + " " + desc;
            getDescription(suite.parentSuite);
        }
        var results = spec.results();
        var desc = "";
        getDescription(spec.suite);
        var testName = desc + "--> " + results.description;
        results.skipped ? yellowStar() : results.passed() ? print(greenStr("[PASS] ") + testName) : print(redStr("[FAIL] ") + testName);
    };
    this.suiteResults = [];
    this.reportSuiteResults = function(suite) {
        var suiteResult = {
            description: fullSuiteDescription(suite),
            failedSpecResults: []
        };
        suite.results().items_.forEach(function(spec) {
            spec.failedCount > 0 && spec.description && suiteResult.failedSpecResults.push(spec);
        });
        this.suiteResults.push(suiteResult);
    };
    this.reportRunnerResults = function(runner) {
        eachSpecFailure(this.suiteResults, function(suiteDescription, specDescription, stackTraces, messages) {
            specFailureDetails(suiteDescription, specDescription, stackTraces, messages);
        });
        finished(this.now() - this.runnerStartTime);
        var results = runner.results();
        var summaryFunction = 0 === results.failedCount ? greenSummary : redSummary;
        summaryFunction(runner.specs().length, results.failedCount);
        doneCallback(runner);
    };
};