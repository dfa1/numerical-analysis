/*
 * adapted from:
 * 
 * LambdaScript, http://bitbucket.org/dfa/lambdascript
 * (c) 2009, 2010 Davide Angelocola <davide.angelocola@gmail.com>
 */

function Description() {
    this.description = "";

    this.append = function() {
        var pattern = /\{\d+\}/g;
        var args = arguments;
        var text = arguments[0];

        this.description += text.replace(pattern, function(capture){
            return args[capture.match(/\d+/)];
        });

        return this;
    }

    this.toString = function() {
        return this.description;
    }
}

function NotMatcher(matcher) {
    this.matcher = matcher;

    this.matches = function(object) {
        return !matcher.matches(object);
    };
}

function IsMatcher(expected) {
    this.expected = expected;
    this.actual = null;

    this.matches = function(actual) {
        this.actual = actual;
        return this.actual === this.expected;
    };

    this.describeTo = function(description) {
        var e = this.expected;
        var a = this.actual;

        if (typeof e == 'string') {
            e = "'" + e + "'";
        }

        if (typeof a == 'string') {
            a = "'" + a + "'";
        }

        description.append("expected: {1} got: {2}", e, a);
    };
}

function ArrayMatcher(expected) {
    this.expected = expected;
    this.actual = null;

    this.matches = function(actual) {
        this.actual = actual;
        if (this.actual.length == this.expected.length) {
            for (var i = 0; i < this.actual.length; i++) {
                if (this.actual[i] !== this.expected[i]) {
                    return false;
                }
            }

            return true;
        } else {
            return false;
        }
    };

    this.describeTo = function(description) {
        var exp = this.expected.toString();

        if (exp.length == 0) {
            exp = '[]';
        }

        var got = this.actual.toString();

        if (got.length == 0) {
            got = '[]';
        }

        description.append("expected: {1} got: {2}", exp, got);
    };
}

function MatrixMatcher(expected) {
    this.expected = expected;
    this.actual = null;

    this.matches = function(actual) {
        this.actual = actual;
	return equals(expected, actual);	
    };

    this.describeTo = function(description) {
        var exp = this.expected.toString();

        if (rows(exp) == 0) {
            exp = '[[]]';
        }

        var got = this.actual.toString();

        if (rows(got) == 0) {
            got = '[][]';
        }

        description.append("expected: {1} got: {2}", exp, got);
    };
}


var results = {
    total  : 0,
    ok     : 0,
    error  : 0
};

function is(actual, expected) {
    var matcher;

    if (rows(expected)) { // check for matrix
	matcher = new MatrixMatcher(expected);
    } else if (type(expected) === 'array') {
        matcher = new ArrayMatcher(expected);
    } else {
        matcher = new IsMatcher(expected);
    }

    var passed = matcher.matches(actual);

    if (!passed) {
        var description = new Description();
        matcher.describeTo(description);
	$('#results').append($('<p> ERROR :' + description.toString() + '</p>'));
	results.error += 1;
    } else {
	results.ok += 1;	
    }

    results.total += 1;	
}
