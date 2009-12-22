function fact(n) {
    return reduce('a*b', range(n), 1);
}

fact = memoize(fact);

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
