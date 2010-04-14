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

    matrix.n = n;
    matrix.m = m;
    return matrix;
}

function print(matrix) {
    for (var i = 0; i < matrix.n; i++) {
	for (var j = 0; j < matrix.m; j++) {
	    document.write(matrix[i][j] + " " );
	}

	document.write("<br/>");
    }
}

function main() {
    var A = matrix(10, 10);
    print(A);
}
