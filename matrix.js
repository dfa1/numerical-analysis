function sqrt(n) {
    return Math.sqrt(n);
}

function square(n) {
    return n * n;
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

function equals(A, B) {
    if (rows(A) != rows(B)) {
	return false;
    }

    if (columns(A) != columns(B)) {
	return false;
    }

    var equal = true;
    each(indexes(rows(A)), function(i) {
    	     each(indexes(columns(A)), function(j) {
		      if (A[i][j] !== B[i][j]) {
			  equal = false;
		      }
		  })
	 });

    return equal;
}

// returns indexes between 0 and n - 1
function indexes(upTo) {
    return range(0, upTo - 1);
}

function row(size, filler) {
    if (size < 1) {
	size = 1;
    }
    
    if (isundef(filler)) {
	filler = 0;
    }

    var row = new Array(size);

    each(indexes(size), function(i) {
	     row[i] = filler;
	 });
    return row;
}

function matrix(n, m) {
    if (n < 1) {
	n = 1;
    }

    if (isundef(m) || m < 1) {
	m = 1;
    }

    var matrix = new Array();

    each(indexes(n), function() {
	     matrix.push(row(m));	     
	 });
    
    matrix.rows = n;
    matrix.columns = m;
    return matrix;
}

function copy(aMatrix) {
    var copy = matrix(rows(aMatrix), columns(aMatrix));
    each(indexes(rows(aMatrix)), function(i) {
    	     each(indexes(columns(aMatrix)), function(j) {
    		      copy[i][j] = aMatrix[i][j];
    		  })});
    return copy;
}

function identity(n) {
    var I = matrix(n, n);

    for (var i = 0; i < n; i++) {
	I[i][i] = 1;
    }

    return I;
}

function mul(A, B) {
    if (columns(A) != rows(B)) {
    	throw 'incompatible matrices';
    }

    var R = matrix(rows(A), columns(B));

    for (var i = 0; i < rows(A); i++) {
    	for (var j = 0; j < columns(B); j++) {
    	    for (var r = 0; r < columns(A); r++) {
    		R[i][j] += (A[i][r] * B[r][j]);
    	    }
    	}
    }

    return R;
}

function traspose(A) {
    var T = matrix(columns(A), rows(A));

    for (var i = 0; i < rows(A); i++) {
	for (var j = 0; j < columns(A); j++) {
	    T[j][i] = A[i][j];
	}
    }

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

    each(indexes(n), function(i) {
	     S[i][i] = 1;
	 });
    
    S[p][p] = alpha;
    S[p][q] = beta;
    S[q][p] = -beta;
    S[q][q] = alpha;
    return S;
}

function QR(A) {

}

function hessembergize(A) {
    var H = copy(A);
    var n = rows(A);

    // for (var p = 1; p < n - 1; p++) {
    // 	for (var q = p + 1; q < n; q++) {
    // 	    document.write(p + ',' + q + '<br/>') ;
    // 	}
    // }

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
    var A = matrix(n, n, 0);

    // riempo A
    for (var i = 0; i < n - 1; i++) {
	A[i][i] = n + i;
    }

    A[n-1][n-1] = 2 * (n - 2);

    // riempo B
    var B = matrix(n, n, 0);
    B[0][0] = -3;

    for (var i = 1; i < n; i++) {
	B[i][i] = -1;
    }

    for (var i = 0; i < n; i++) {
	B[i][i+1] = 1;
    }

    for (var i = 1; i < n; i++) {
	B[i][0] = -2;
    }

    return mul(A, B);
}

function main() {
    alert('da scrivere');
}

