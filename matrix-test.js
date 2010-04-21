function dump(matrix, caption) {
    var table = '<table border=1 cellpadding=3>';
    table += '<caption align="bottom">' + caption + '</caption>';

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
    is(type(identity(1)), 'array');
    dump(identity(3), 'Matrice identit&agrave;');
    
    //print(traspose(H));
    // print(B);
    // print(mul(A, B));
    // print(Q(5, 0, 2, 2));
    // print(Q(5, 1, 2, 2));
    // print(Q(5, 2, 2, 2));
    // print(Q(5, 3, 2, 2));

    // print(hessembergize(abate(4)));
    // print(S(10, 5, 7, 42, 84));
//    document.write('' + equals(matrix(10, 10), matrix(10, 10)));


    // results
    summary();
}

function summary() {
    $('#results').append($('<h2>Total : ' + results.total + '</h2>'));
    $('#results').append($('<h2 style="color:green">Ok    : ' + results.ok + '</h2>'));
    $('#results').append($('<h2 style="color:red">Error : ' + results.error + '</h2>'));
}
