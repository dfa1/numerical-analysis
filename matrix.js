function len(array) {
    return array.length;
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

    return matrix;
}

function print(matrix) {
    for (var i = 0; i < len(matrix); i++) {
	for (var j = 0; j < len(matrix[i]); j++) {
	    document.write(matrix[i][j] + " " );
	}

	document.write("<br/>");
    }
}

function main() {
    //var A = matrix(10, 10);
    var A = [
	[ 3, 2, 1, 5 ],
	[ 3, 2, 3, 2 ],
	[ 0, 2, 3, 3 ],
	[ 0, 0, 1, 6 ]
    ];

    print(A);
}
