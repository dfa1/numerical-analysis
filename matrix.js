function constant(k) {
    return function() {
	return k;
    };
}

function sqrt(n) {
    return Math.sqrt(n);
}

function square(n) {
    return n * n;
}

function hypot(a, b) {
    return sqrt(square(a) + square(b));
}

function rows(matrix) {
    if (matrix === undefined || matrix === null) {
	throw 'not a matrix';
    }

    if (matrix.rows) {
	return matrix.rows;
    } else {
	return matrix.length;
    }
}

function columns(matrix) {
    if (matrix === undefined || matrix === null) {
	throw 'not a matrix';
    }

    if (matrix.columns !== undefined) {
	return matrix.columns;
    } else {
	return matrix[0].length;
    }
}

// returns indexes between 0 and n - 1
function indexes(upTo) {
    return range(0, upTo - 1);
}

function iterate(n, f) {
    each(indexes(n), f);
}

function equals(A, B) {
    if (rows(A) != rows(B)) {
	return false;
    }

    if (columns(A) != columns(B)) {
	return false;
    }

    var equal = true;
    iterate(rows(A), function(i) {
	iterate(columns(A), function(j) {
	    if (A[i][j] !== B[i][j]) {
		equal = false;
	    }
	})
    });

    return equal;
}

function row(size, filler) {
    if (size < 1) {
	size = 1;
    }
    
    if (isundef(filler)) {
	filler = 0;
    }

    return map(range(size), constant(filler));
}

function matrix(n, m) {
    if (n < 1) {
	n = 1;
    }
    
    if (isundef(m)) {
	m = n; // square matrix
    } else if (m < 1) {
	m = 1;
    }

    var matrix = new Array();

    iterate(n, function() {
	matrix.push(row(m));	     
    });

    matrix.rows = n;
    matrix.columns = m;
    return matrix;
}

// duplicate a matrix
// TODO: slow :-(
function copy(matrix) {
    return traspose(traspose(matrix));
}

function identity(n) {
    var I = matrix(n, n);
    iterate(n, function(i) {
	I[i][i] = 1;
    });
    return I;
}

function mul(A, B) {
    if (columns(A) != rows(B)) {
    	throw 'incompatible matrices';
    }

    var R = matrix(rows(A), columns(B));

    iterate(rows(A), function(i) {
	iterate(columns(B), function(j) {
	    iterate(columns(A), function(k) {
		R[i][j] += (A[i][k] * B[k][j]);
	    })
	})
    });

    return R;
}

function traspose(A) {
    var T = matrix(columns(A), rows(A));

    iterate(rows(A), function(i) {
	iterate(columns(A), function(j) {
	    T[j][i] = A[i][j];
	}) 
    });
    
    return T;
}

function givens(n, i, alpha, beta) {
    return givens2(n, i, i+1, alpha, beta);
}

function givens2(n, p, q, alpha, beta) {
    var S = matrix(n, n);
    iterate(n, function(i) {
	S[i][i] = 1;
    });
    S[p][p] = alpha;
    S[p][q] = beta;
    S[q][p] = -beta;
    S[q][q] = alpha;
    return S;
}

function hessenbergize(A) {
    var k = 0;
    var Ak = A;
    var n = rows(A);
    
    debug('<hr/>');
    debug('n = ' + n);
    dump(Ak, 'the input');
    
    each(range(1, n-2), function(p) {
	each(range(p+1, n-1), function(q) {
	    debug(format('step {1}, {2}', p, q));
		 
	    var a = Ak[p-1][p];
	    var b = -Ak[p-1][q];
	    var d = hypot(a, b);
	    var alpha = a / d;
	    var beta =  b / d;
			    
	    debug('a = ' + a);
	    debug('b = ' + b);
	    debug('d = ' + d);
	    debug('condition : ' + (square(alpha) + square(beta)));	
		 
	    var Sk = givens2(n, p, q, alpha, beta);
	    dump(Sk, 'S<sub>' + p + ',' + q + '</sub>');
	    dump(Ak, 'A<sub>' + k + '</sub>');
    	    Ak = mul(mul(traspose(Sk), Ak), Sk);
	    k = k + 1;
    	});
    });

    return Ak;
}

function abate(n) {
    // left matrix
    var A = matrix(n, n);
    
    iterate(n - 1, function(i) {
	A[i][i] = n + i;
    });
    
    A[n-1][n-1] = (2 * n) - 2; // TODO: fixme

    // right matrix
    var B = matrix(n, n);
    B[0][0] = -3;
    
    each(range(1, n-1), function(i) {
    	B[i][i] = -1;
    });

    each(range(0, n-1), function(i) {
	B[i][i+1] = 1;
    });
    
    each(range(1, n - 1), function(i) {
    	B[i][0] = -2;
    });
    
    return mul(A, B);
}

function QR(A) {
    var Q = identity(rows(A));
    var k = 1;
    
    iterate(rows(A), function(i) {
	iterate(columns(A), function(j) {
	    if (i > j) { // skip zeroes (A[i][j] != 0)
		debug(format('zero({1},{2})', i + 1,j +1));    
		var a = A[i-1][j];
		var b = A[i][j];
		
		if (a == 0 && b == 0) {
		    b = 1;
		}
		
		var r = hypot(a, b);
		debug('a = ' + a);
		debug('b = ' + b);
		debug('r = ' + r);
		var alpha = a / r;
		var beta = b / r;
		debug('condition : ' + (square(alpha) + square(beta)));	
		var G = givens(rows(A), i-1, alpha, beta);
		dump(G, 'G' + '<sub>' + k + '</sub>');
		A = mul(G, A);
		dump(A, 'A' + '<sub>k+1</sub>');
		Q = mul(Q, traspose(G));
		k = k + 1;
	    }
	})
    });

    return {
	'R': A,
	'Q': Q
    };
}

// helpers
function debug(string) {
    $('#results').append(format('<p>{1}</p>', string));    
}

function dump(matrix, caption) {
    var table = '<table border="1" cellpadding="4" style="margin-bottom: 3%">';

    if (caption) {
	table += '<caption align="bottom">' + caption + '</caption>';
    }

    for (var i = 0; i < rows(matrix); i++) {
	table += '<tr align="center">';

	for (var j = 0; j < columns(matrix); j++) {
	    var style = '';
	    var v = matrix[i][j].toFixed(3);

	    if (v === '0.000' || v === '-0.000') {
		style='style="color:white"';
	    }
	    
	    table += '<td ' + style + '>'+ v + '</td>';
	}

	table += '</tr>';
    }

    table += '</table>';
    $('#results').append($(table));
}

function decompose(matrix) {
    debug('<hr/>');
    dump(matrix, 'Decomposing');
    var decomposition = QR(matrix);
    dump(decomposition.R, 'R');
    dump(decomposition.Q, 'Q');
    var A = mul(decomposition.Q, decomposition.R); 
    dump(matrix, 'original');
    dump(A, 'A = QR');
}

// the main
function main() {
    var A = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]];
    var H = hessenbergize(A);
    dump(H, 'Hessenberg form of A');
    //decompose(traspose(A));
}
