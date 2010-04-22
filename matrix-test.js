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
	each(range(2, 10), function(i) {
    	    dump(abate(i), 'Matrice di Abate n='+i);
    	});
    });

    tests.push(function testGivens () {
	dump(givens2(10, 5, 7, 42, 84), 'S<sub>5 7</sub>');
	dump(givens(5, 0, 2, 2));
	dump(givens(5, 1, 2, 2));
	dump(givens(5, 2, 2, 2));
	dump(givens(5, 3, 2, 2));
    });

    tests.push(function testHessenbergize() {
	var A = [
	    [4, 1, 1, 1], 
	    [1, 4, 1, 0],
	    [1, 1, 4, 1],
	    [1, 0, 1, 4]
	];
	var H = hessenbergize(A);
    });
    
    
    tests.push(function testHessenbergizeSelf() {
	var A = [
	    [1, 4, 2, 3], 
	    [3, 4, 1, 7],
	    [0, 2, 3, 4],
	    [0, 0, 1, 3]
	];
	var H = hessenbergize(A);
	is(A, H);	   
    });
    // http://math.fullerton.edu/mathews/n2003/qrmethod/QRmethodMod/Links/QRmethodMod_lnk_2.html    
    tests.push(function testQRHessemberg() {
	var A = [
	    [ 2,  4,  2 ],
    	    [ -1, 0, -4 ],
    	    [ 2,  2, -1 ],
	];
	decompose(A);
    });
    
    // TODO
    tests.push(function testQRHessemberg() {
	var H = [
	    [ 3, 2, 1, 5 ],
    	    [ 3, 2, 3, 2 ],
    	    [ 0, 2, 3, 3 ],
    	    [ 0, 0, 1, 6 ]
	];
	decompose(H);
    });
    
    // http://en.wikipedia.org/wiki/Givens_rotation
    tests.push(function testQRByWikipedia() {
	var A = [
	    [6, 5, 0],
    	    [5, 1, 4],
    	    [0, 4, 3]
	];
	decompose(A);
    });
    
    // http://en.wikipedia.org/wiki/QR_decomposition
    tests.push(function testQRByWikipedia2() {
	var A = [
	    [ 12, -51,   4],
    	    [  6, 167, -68],
    	    [ -4,  24, -41]
	];
	decompose(A);
    });
    
    // http://reference.wolfram.com/mathematica/ref/QRDecomposition.html
    tests.push(function testQRByMathematica() {
	var A = [
	    [ 1, 2, 3],
    	    [ 4, 5, 6]
	];
	decompose(A);
    });
    
    // http://en.wikipedia.org/wiki/Eigenvalues_and_eigenvectors
    tests.push(function testQRByWikipedia3() {
	var A = [
	    [ 2, 1],
    	    [ 1, 2]
	];
	decompose(A);
    });

    // notes
    tests.push(function testQRByWikipedia3() {
	var A = [
	    [ 0, 0, 1],
    	    [ 1, 0, 0],
	    [ 0, 1, 0]
	];
	decompose(A);
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
