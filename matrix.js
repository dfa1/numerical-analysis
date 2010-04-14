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

function array(size, filler) {    
    if (size < 1) {
	size = 1;
    }

    var array = new Array(size);

    for (var i = 0; i < size; i++) {
	array[i] = filler;
    }
    
    return array;
}

function matrix(n, m) {
    if (n < 1) {
	n = 1;
    }

    if (m < 1) {
	m = 1;
    }

    var matrix = new Array();

    for (var i = 0; i < n; i++) {
	matrix.push(array(m, 0));
    }

    matrix.rows = n;
    matrix.columns = m;
    return matrix;
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


function print(matrix) {
    for (var i = 0; i < rows(matrix); i++) {
	for (var j = 0; j < columns(matrix); j++) {
	    document.write(matrix[i][j] + " " );
	}

	document.write("<br/>");
    }

    document.write("<hr/>");
}

function main() {
    var Z = matrix(10, 10);
    var H = [
    	[ 3, 2, 1, 5 ],
    	[ 3, 2, 3, 2 ],
    	[ 0, 2, 3, 3 ],
    	[ 0, 0, 1, 6 ]
    ];
    var A = [ 
	[ 1, 0, 2],
	[-1, 3, 1]
    ];
    var B = [
	[3, 1],
	[2, 1],
	[1, 0]
    ];

    //print(identity(10));
    //print(traspose(H));
    // print(B);    
    // print(mul(A, B));
    print(Q(5, 0, 2, 2));
    print(Q(5, 1, 2, 2));
    print(Q(5, 2, 2, 2));
    print(Q(5, 3, 2, 2));
}