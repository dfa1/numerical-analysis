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

function runtests() {
    each(range(10), function(i) {
	     is(rows(matrix(i, i)), i);    
	 });

    each(range(10), function(i) {
	     is(columns(matrix(i, i)), i);
	 });

    is(type(identity(1)), 'array');
    is(type(identity(0)), 'array');
    is(type(identity(-1)), 'array');
    
    dump(identity(3), 'Matrice identit&agrave;');

    for (var i = 0; i < 10; i++) {
    	is(traspose(traspose(identity(i))), identity(i));
    }

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

    each(range(10), function(i) {
	     dump(abate(i), 'Matrice di Abate i='+i);
	 });


    dump(S(10, 5, 7, 42, 84), 'S<sub>5 7</sub>');
    dump(Q(5, 0, 2, 2));
    dump(Q(5, 1, 2, 2));
    dump(Q(5, 2, 2, 2));
    dump(Q(5, 3, 2, 2));

//    dump(hessembergize(abate(4)));

    var H = [
    	[ 3, 2, 1, 5 ],
    	[ 3, 2, 3, 2 ],
    	[ 0, 2, 3, 3 ],
    	[ 0, 0, 1, 6 ]
    ];

    // results
    summary();
}

function summary() {
    $('#results').prepend($('<h2>Total : ' + results.total + '</h2>'));
    $('#results').prepend($('<h2 style="color:green">Ok    : ' + results.ok + '</h2>'));
    $('#results').prepend($('<h2 style="color:red">Error : ' + results.error + '</h2>'));
}
