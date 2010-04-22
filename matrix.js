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
    return sqrt(square(a), square(b));
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

    if (isundef(m) || m < 1) {
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
// TODO: not very efficient :-(
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

function Q(n, i, alpha, beta) {
    var Q = matrix(n, n);
    Q[i][i] = alpha;
    Q[i+1][i] = beta;
    Q[i][i+1] = -beta;
    Q[i+1][i+1] = alpha;
    return Q;
}

function S(n, p, q, alpha, beta) {
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

function QR(A) {
    iterate(rows(A), function(i) {
	iterate(columns(A), function(j) {
	    if (i > j) {
		$('#results').append(format('<p>{1},{2}</p>', i + 1,j +1));    
		var a = [i-1][j];
		var b = A[i][j];
		var r = hypot(a, b);
		var alpha = a / r;
		var beta = b / r;
		var G = Q(rows(A), i, j);
		dump(G);
	    }
	})
    });
}

function hessembergize(A) {
    var H = copy(A);
    var n = rows(A);

    each(range(1, n - 2), function(p) {
    	     each(range(p + 1, n - 1), function(q) {
		      var d = sqrt(square(A[p-1][p]) + square(A[p-1][q]));
		      var alpha = A[p-1][p] / d;
		      var beta = -A[p-1][q] / d;
		      var Sk = S(n, p, q, alpha, beta);
		      print(Sk);
		      H = mul(traspose(Sk), mul(A, Sk));
    		  });
    	 });

    return H;
}

function abate(n) {
    // left matrix
    var A = matrix(n, n);
    
    iterate(n - 1, function(i) {
	A[i][i] = n + i;
    });
    
    A[n-1][n-1] = 2 * (n - 2);

    // right matrix
    var B = matrix(n, n);
    B[0][0] = -3;
    
    iterate(n - 1, function(i) {
    	B[i][i] = -1;
    });

    iterate(n, function(i) {
	B[i][i+1] = 1;
    });
    
    iterate(n - 1, function(i) {
    	B[i][0] = -2;
    });
    
    return mul(A, B);
}

function main() {
}

