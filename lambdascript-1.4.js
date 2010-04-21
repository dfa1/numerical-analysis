/*
 * LambdaScript, http://bitbucket.org/dfa/lambdascript
 * Version: ${pom.version} (${changeSet} on ${changeSetDate})
 * (c) 2009, 2010 Davide Angelocola <davide.angelocola@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/*
 * jsdoc: http://code.google.com/p/jsdoc-toolkit/w/list
 *
 * naming parameter conventions:
 *    - 'lambda'    -> function or string
 *    - 'iterable'  -> iterator or array
 *    - 'array'     -> array
 *    - 'string'    -> string
 *    - 'object'    -> object
 *    - 'n'         -> a positive number
 *
 *  suspicious usage are marked by a "TODO: naming" comment
 */

/**
 * @namespace `LambdaScript` is the namespace for the LambdaScript library.
 */
var LambdaScript = this.LambdaScript || {};

/** @ignore */
LambdaScript._toFunction = function(lambda) {
    if (typeof lambda === 'string') {
        return LambdaScript.lambda(lambda);
    } else if (typeof lambda === 'function') {
        return lambda;
    } else {
        throw 'Not a string or function';
    }
};

// Iterable has the following methods: 'toArray', 'hasNext', 'next'
/** @ignore */
LambdaScript._toIterable = function(iterable) {
    if (iterable === null) {
        return new LambdaScript._NullIterator();
    } else if (iterable === undefined) {
        return new LambdaScript._NullIterator();
    } else if (type(iterable) === 'array') {
        return new LambdaScript._ArrayIterator(iterable);
    } else if (iterable.next && iterable.hasNext && iterable.toArray) { // TODO: 'iterable'
        return iterable;
    } else {
        throw 'Not iterable nor array';
    }
}

/** @ignore */
LambdaScript._RangeIterator = function(start, stopAt, stepBy) {
    this.stopAt = stopAt;
    this.step = stepBy;
    this.i = start;

    this.next = function() {
        var res = this.i;
        this.i = this.step(this.i);
        return res;
    };

    this.hasNext = function() {
        return this.i <= this.stopAt;
    };

    // convert the rest of this iterator to a regular array
    this.toArray = function() {
        var result = [];

        for (var j = this.i; j <= this.stopAt; j = this.step(j)) {
            result.push(j);
        }

        return result;
    };

    this.toString = function() {
        return 'RangeIterator';
    };
};

/** @ignore */
LambdaScript._ArrayIterator = function(array) {
    this.array = array;
    this.i = 0;

    this.next = function() {
        return this.array[this.i++];
    };

    this.hasNext = function() {
        return this.i < this.array.length;
    };

    // returns a copy of this array
    this.toArray = function() {
        return Array.prototype.slice.call(this.array);
    };

    this.toString = function() {
        return 'ArrayIterator';
    };
};

/** @ignore */
LambdaScript._NullIterator = function() {
    this.next = function() {
        return undefined;
    };

    this.hasNext = function() {
        return false;
    };

    this.toArray = function() {
        return [];
    };

    this.toString = function() {
        return 'NullIterator';
    };
};

/**
 * unary/binary/ternary function factory.
 *
 * @function
 * @param {String} string an expression
 * @returns {Function} a function that evaluates to 'expr'
 *
 * @example
 * lambda('-a') is equivalent to function negate(a) { return -a; }
 *
 * @example
 * lambda('a + b') is equivalent to function (a, b) { return a + b; }
 *
 * @example
 * lambda('a * b + c') is equivalent to function (a, b, c) { return a * b + c; }
 */
LambdaScript.lambda = function(string) {
    if (string === null || string === undefined || string == '') {
        return function() {
            return false;
        };
    }

    return function(a, b, c) {
        return eval(string);
    };
};

/**
 * Given two functions, 'f' and 'g', returns another function f(g()).
 *
 * @function
 * @param {Function} f a function
 * @param {Function} g another function
 * @returns {Function} the composed function
 *
 * @example
 * >>> var greet = function(name){ return "hi: " + name; };
 * >>> var exclaim  = function(statement){ return statement + "!"; };
 * >>> var welcome = LambdaScript.compose(greet, exclaim);
 * >>> welcome('moe');
 * 'hi: moe!'
 */
LambdaScript.compose = function(f, g) { // TODO: generalize for n functions
    return function() {
        return f(g.apply(null, arguments));
    };
};

/**
 * Returns a functions that negates the input function.
 */
LambdaScript.not = function(lambda) {
    var fn = LambdaScript._toFunction(lambda);
    return function() {
        return fn() === false;
    };
};

/**
 * Returns a function that returns true when any the arguments (lambdas)
 * returns true.
 */
LambdaScript.or = function() {
    var args = Array.prototype.splice.call(arguments, 0);
    var result = false;

    LambdaScript.each(args, function(lambda) {
        var fn = LambdaScript._toFunction(lambda);
        if (fn() === true) {
            result = true;
            return false; // break the each function
        }
    });

    return result;
};

/**
 * Returns a function that returns true when all the arguments (lambdas)
 * returns true.
 */
LambdaScript.and = function() {
    var args = Array.prototype.splice.call(arguments, 0);
    var result = true;

    LambdaScript.each(args, function(lambda) {
        var fn = LambdaScript._toFunction(lambda);
        if (fn() === false) { // TODO: it can be also a boolean
            result = false;
            return false; // break the each function
        }
    });

    return result;
};

/**
 * Range iterator.
 *
 * @function
 * @param [Number] begin defaults 1 when not specified
 * @param [Number] end always specified
 * @param [Number|String|Function] step a function or a costant
 * @returns {Iterable} a new range iterator
 *
 * @example
 * >>> range(5)
 * [1, 2, 3, 4, 5]
 *
 * @example
 * >>> range(5, 10)
 * [5, 6, 7, 8, 9, 10]
 *
 * @example
 * >>> range(5, 25, 5)
 * [5, 10, 15, 20, 25]
 *
 * @example
 * >>> range(1, 10, 'a+2')
 * [1, 3, 5, 7, 9]
 *
 * @example
 * >>> range(3, 100, function(a) { return a*3;})
 * [3, 9, 27, 81]
 */
LambdaScript.range = function() {
    var begin = 1;
    var end = 1;
    var step = function(i) {
        return i + 1;
    };

    switch (arguments.length) {
        case 1:
            end = arguments[0];
            break;

        case 2:
            begin = arguments[0];
            end = arguments[1];
            break;

        case 3:
            begin = arguments[0];
            end = arguments[1];

            if (typeof arguments[2] == 'number') {
                var s = arguments[2];
                /** @ignore */
                step = function(i) {
                    return i + s;
                };
            } else if (typeof arguments[2] == 'string') {
                step = LambdaScript.lambda(arguments[2]);
            } else if (typeof arguments[2] == 'function') {
                step = arguments[2];
            } else {
                throw 'third argument can be number, string or an unary function';
            }

            break;
    }

    return new LambdaScript._RangeIterator(begin, end, step);
};

/**
 * Iterates over 'iterable', yielding each in turn to the function 'lambda'. If
 * the function returns false 'each' immediately returns.
 *
 * @function
 * @param {Iterable} iterable an array or a range object
 * @param {Function} lambda a function to invoke for each element
 * @returns {Array} the 'iterable' itself; handy for chaining
 */
LambdaScript.each = function(iterable, lambda) {
    var fn = LambdaScript._toFunction(lambda);
    var iterator = LambdaScript._toIterable(iterable);
    var i = 1;

    while (iterator.hasNext()) {
        if (fn(iterator.next(), i++) === false) {
            break;
        }
    }

    return iterable;
};

/**
 * Reduce boils down 'iterable' into a single value using 'initialValue' as
 * the initial state of the reduction, and each successive step of it should
 * be returned by 'lambda'.
 *
 * AKA: '#inject' in Smalltalk or 'fold' in lisp.
 *
 * @function
 * @param {Iterable} iterable the iterable to reduce
 * @param {Function} lambda a binary function
 * @param {Object} initialValue optional initial value, or the first value of
 *                 'iterable'
 * @returns {Array} a new array
 *
 * @example
 * >>> reduce(lambda('a+b'), [1, 2, 3, 4]) // sum of range(1, 4)
 * 10
 */
LambdaScript.reduce = function(iterable, lambda, initialValue) {
    var iterator = LambdaScript._toIterable(iterable);
    var fn = LambdaScript._toFunction(lambda);
    var i = initialValue || iterator.next();

    LambdaScript.each(iterator, function(element) {
        i = fn(i, element);
    });

    return i;
};

/**
 * Produces a new array of values by mapping each value in 'iterable' through
 * the unary transformation function 'lambda'.
 *
 * AKA: '#collect' in Smalltalk.
 *
 * @function
 * @param {Iterable} iterable an iterable
 * @param {Function} lambda an unary function
 * @returns {Array} a new array
 *
 * @example
 * >>> function square(a) { return a*a; }
 * >>> map(square, [2, 3, 4, 5])
 * [4, 9, 16, 25]
 *
 * @example
 * >>> map(lambda('a*a'), [2, 3, 4, 5])
 * [4, 9, 16, 25]
 *
 * @example
 * >>> map('a*a', [2, 3, 4, 5])
 * [4, 9, 16, 25]
 */
LambdaScript.map = function(iterable, lambda) {
    var fn = LambdaScript._toFunction(lambda);
    var iterator = LambdaScript._toIterable(iterable);
    var result = [];

    LambdaScript.each(iterator, function (element) {
        result.push(fn(element));
    });

    return result;
};

/***
 * Looks through each value in 'iterable', returning a new array of all the
 * values that pass the truth test 'lambda'.
 *
 * AKA: #select in Smalltalk.
 *
 * @function
 * @param {Iterable} iterable an iterable
 * @param {Function} lambda a truth test (a unary function)
 * @returns {Array} a new array
 *
 * @example
 * >>> filter(lambda('a%2==0'), range(1, 10))
 * [2, 4, 6, 8, 10]
 */
LambdaScript.filter = function(iterable, lambda) {
    var fn = LambdaScript._toFunction(lambda);
    var iterator = LambdaScript._toIterable(iterable);
    var result = [];

    LambdaScript.each(iterator, function(element) {
        if (fn(element) === true) {
            result.push(element);
        }
    });

    return result;
};

/**
 * Returns true if <b>all</b> of the values in 'iterable' pass the truth test
 * 'lambda'.
 *
 * @function
 * @param {Iterable} iterable an iterable
 * @param {Function} lambda a truth test (a unary function)
 * @returns {Boolean}
 */
LambdaScript.every = function(iterable, lambda) {
    var fn = LambdaScript._toFunction(lambda);
    var iterator = LambdaScript._toIterable(iterable);
    var result = true;

    // TODO: abort the inner loop at the first false
    LambdaScript.each(iterator, function(element) {
        if (fn(element) === false) {
            result = false;
        }
    });

    return result;
};

/**
 * Returns true if <b>any</b> of the values in 'iterable' pass the truth test
 * 'lambda'.
 *
 * @function
 * @param {Iterable} iterable an array
 * @param {Function} lambda the truth test (a unary function)
 * @returns {Boolean}
 *
 * @example
 */
LambdaScript.some = function(iterable, lambda) {
    var iterator = LambdaScript._toIterable(iterable);
    var fn = LambdaScript._toFunction(lambda);
    var result = false;

    LambdaScript.each(iterator, function(element) {
        if (fn(element) === true) {
            result = true;
        }
    });

    return result;
};

/**
 * Like 'filter' but returns an array of the first n items that satisfy
 * the 'lambda' parameter.
 */
LambdaScript.take = function(iterable, n) {
    var iterator = LambdaScript._toIterable(iterable);
    var result = [];

    if (n < 1) {
        return result;
    }

    var i = 0;

    LambdaScript.each(iterator, function(element) {
        if (i++ < n) {
            result.push(element);
        }
    });

    return result;
};

/**
 * Returns an array of all but the first 'n' items in 'iterable'.
 */
LambdaScript.drop = function(iterable, n) {
    var iterator = LambdaScript._toIterable(iterable);
    var result = [];

    if (n < 1) {
        return result;
    }

    LambdaScript.each(iterator, function(element, i) {
        if (i > n) {
            result.push(element);
        }
    });

    return result;
};

/**
 * Like 'drop(iterable, 1)'.
 */
LambdaScript.rest = function(iterable) {
    return LambdaScript.drop(iterable, 1);
};

/**
 * Like 'take(iterable, 1)'.
 */
LambdaScript.first = function(iterable) {
    return LambdaScript.take(iterable, 1)[0]; // TODO: check me!
};

/**
 * Returns the last element of 'iterable'.
 */
LambdaScript.last = function(iterable) {
    var iterator = LambdaScript._toIterable(iterable);
    var result = null;

    LambdaScript.each(iterator, function(element) {
        result = element;
    });

    return result;
};

/**
* Bind the last n parameters to a function.
*
* @example
* >>> var mulBy2 = curry('a*b', 2);
* >>> mulBy2(21)
* 42
*/
LambdaScript.curry = function(lambda) {
    var fn = LambdaScript._toFunction(lambda);
    var innerArgs = Array.prototype.slice.call(arguments, 1);
    return function () {
        return fn.apply(this, innerArgs.concat(Array.prototype.slice.call(arguments, 0)))
    };
};

/**
* Build a function that returns the value of the property 'name'.
*
* @example
* >>> map(['a', 'aa', 'aaa', 'aaaa'], pluck('length'))
* [1, 2, 3, 4]
*/
LambdaScript.pluck = function(name) {
    return function(object) {
        return object[name];
    };
};

/**
* Build a function that invokes the method 'name', with the arguments passed to
* this function.
*
* @example
* >>> map(['hdr: a', 'hdr: aa', 'hdr: aaa', 'hdr: aaaa'], invoke('substr', 5, 10))
* ['a', 'aa', 'aaa', 'aaaa']
*/
LambdaScript.invoke = function(name) {
    var args = Array.prototype.splice.call(arguments, 1);
    return function(object) {
        return object[name].apply(object, args);
    };
};

/**
* Given a function returns another function that caches memoize results.
*/
LambdaScript.memoize = function(lambda) {
    var fn = LambdaScript._toFunction(lambda);
    var cache = {};

    return function() {
        var args = Array.prototype.splice.call(arguments, 0);

        if (!(args in cache)) {
            cache[args] = fn.apply(this, args);
        }

        return cache[args];
    };
};

/**
 * an array-aware, typeof-like function.
 *
 * (see: JavaScript: The Good Parts, Douglas Crockford, pp 106)
 */
LambdaScript.type = function(object) {
    if (object === null) {
        return 'null';
    } else if (typeof object === 'object'
        && typeof object.length === 'number'
        && !(object.propertyIsEnumerable('length'))) {
        return 'array';
    } else {
        return typeof object;
    }
};

/**
 * Like java.lang.String.format() but using {1}.. {n} in place of %
 */
LambdaScript.format = function(string) {
    string = string || "";
    var pattern = /\{\d+\}/g;
    var args = arguments;
    return string.replace(pattern, function(capture) {
        return args[capture.match(/\d+/)];
    });
};

LambdaScript.isnull = function(object) {
    return object === null;
};

// checking for undefined is tricky (what about if window.undefined is defined?)
LambdaScript.isundef = function(object) {
    return typeof object == 'undefined';
};

/**
* This function copies all the public functions in `LambdaScript` except itself
* into the global namespace.
*
* @function
*
* @example
* >>> LambdaScript.install()
*/
LambdaScript.install = function() {
    var source = LambdaScript;
    /** @ignore */
    var target = (function() {
        return this;
    })(); // References the global object.

    for (var name in source) {
        if (name != 'install' && name.charAt(0) != '_') {
            target[name] = source[name];
        }
    }
};
