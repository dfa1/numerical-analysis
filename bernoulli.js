function fact(n) {
    if (n > 15) {
        return Math.sqrt(2 * Math.PI * n) * Math.pow(n / Math.E, n);
    } else {
        return reduce(range(n), operators.mul, 1);
    }
}

function comb(n, k) {
    return fact(n) / (fact(n - k) * fact(k));
}

function bernoulli(n, m) {
    var s = 0;

    for (var k = 0; k <= m - 1; k++) {
        s += comb(m, k) * (bernoulli(n, k) / (m - k + 1));
    }
                    
    return Math.pow(n, m) - s;
}
