function dump(matrix, caption) {
    var table = '<table border=1 cellpadding=3>';

    if (caption) {
	table += '<caption align="bottom">' + caption + '</caption>';
    }

    for (var i = 0; i < rows(matrix); i++) {
	table += '<tr align="center">';

	for (var j = 0; j < columns(matrix); j++) {
	    table += '<td>'+ matrix[i][j] + '</td>';
	}

	table += "</tr>";
    }

    table += "</table>";
    $('#results').append($(table));
}

var results = {
    total  : 0,
    ok     : 0,
    error  : 0
};

function runtests() {
    var tests = [];

    // template    
    tests.push(function () {
    	       
    });

    tests.push(function testBuildSquareMatrixWithOneParam () {
	each(range(10), function(i) {
    	     is(columns(matrix(i)), i);
    	 });    
    });

    tests.push(function testCopyIdentity() {
	is(identity(10), copy(identity(10)));
    });
    
    tests.push(function testCopyMatrix() {
	is(matrix(10), copy(matrix(10)));
    });
    
    tests.push(function testRows() {
	each(range(10), function(i) {
	    is(rows(matrix(i, i)), i);    
	});
    });
    
    tests.push(function testColumns() {
	each(range(10), function(i) {
     	     is(columns(matrix(i, i)), i);
        });
    });
    
    tests.push(function testEquals() {
	is(equals(matrix(3), matrix(3)), true);
	is(equals(matrix(4), matrix(3)), false);
	is(equals(identity(3), identity(3)), true);
	is(equals(identity(4), identity(3)), false);
    });

    tests.push(function dumpIdentity() {
	dump(identity(3), 'Matrice identit&agrave;');
    });
    
    tests.push(function testTraspose() {
	each(range(10), function(i) {
	    is(traspose(traspose(identity(i))), identity(i));
	});
    });
    
    tests.push(function testMulWikiPedia() {
	// http://en.wikipedia.org/wiki/Matrix_(mathematics)
	var A = [
	    [ 1, 0, 2],
    	    [-1, 3, 1]
	];

	var B = [
	    [3, 1],
    	    [2, 1],
    	    [1, 0]
	];

	var C = [
	    [ 5, 1],
    	    [ 4, 2]
	];

	is(mul(A, identity(3)), A);
	is(mul(B, identity(2)), B);
	is(mul(A, B), C);
    });

    tests.push(function testMulByIdentity() {
	each(range(10), function(i) {
    	    is(mul(identity(i), matrix(i, i)), matrix(i, i));
    	});
    
	each(range(10), function(i) {
    	    is(mul(matrix(i, i), identity(i)), matrix(i, i));
    	});    
    });

    
    tests.push(function testAbateMatrices () {
	each(range(10), function(i) {
    	    dump(abate(i), 'Matrice di Abate i='+i);
    	});
    });

    tests.push(function testSQ () {
//	dump(S(10, 5, 7, 42, 84), 'S<sub>5 7</sub>');
	dump(Q(5, 0, 2, 2));
	dump(Q(5, 1, 2, 2));
	dump(Q(5, 2, 2, 2));
	dump(Q(5, 3, 2, 2));
    });

    tests.push(function testHessembergize() {
	// dump(hessembergize(abate(4)));
    });
    
    tests.push(function testToTriangular() {
    // var H = [
    // 	[ 3, 2, 1, 5 ],
    // 	[ 3, 2, 3, 2 ],
    // 	[ 0, 2, 3, 3 ],
    // 	[ 0, 0, 1, 6 ]
    // ];
    });
    
    tests.push(function testQR() {
	var A = [
	    [6, 5, 0],
    	    [5, 1, 4],
    	    [0, 4, 3]
	];
   
	QR(A);
    });

    // run tests while catching exceptions    
    each(tests, function(test) {
	 try {
	     test();
	     results.ok++;
	 } catch (x) {
	     results.error++;
	     $('#results').append($(format('<b>{1}</b>: {2}<br/>', test.name, x)));
	 }
	     
	 results.total++;
     });	
    
    // results
    summary();
}

function summary() {
    $('#results').prepend($('<h2>Total : ' + results.total + '</h2>'));
    $('#results').prepend($('<h2 style="color:green">Ok    : ' + results.ok + '</h2>'));
    $('#results').prepend($('<h2 style="color:red">Error : ' + results.error + '</h2>'));
}
