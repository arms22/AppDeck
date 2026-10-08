// Preferred values: https://www.vishay.com/docs/28372/e-series.pdf
(() => {
  const e24 = [10, 11, 12, 13, 15, 16, 18, 20, 22, 24, 27, 30, 33, 36, 39, 43, 47, 51, 56, 62, 68, 75, 82, 91];
  const e96 = [100, 102, 105, 107, 110, 113, 115, 118, 121, 124, 127, 130, 133, 137, 140, 143, 147, 150, 154, 158, 162, 165, 169, 174, 178, 182, 187, 191, 196, 200, 205, 210, 215, 221, 226, 232, 237, 243, 249, 255, 261, 267, 274, 280, 287, 294, 301, 309, 316, 324, 332, 340, 348, 357, 365, 374, 383, 392, 402, 412, 422, 432, 442, 453, 464, 475, 487, 499, 511, 523, 536, 549, 562, 576, 590, 604, 619, 634, 649, 665, 681, 698, 715, 732, 750, 768, 787, 806, 825, 845, 866, 887, 909, 931, 953, 976];
  const seriesValues = { E6: e24.filter((_, i) => i % 4 === 0), E12: e24.filter((_, i) => i % 2 === 0), E24: e24, E48: e96.filter((_, i) => i % 2 === 0), E96: e96 };
  function calculate(vin, target, tolerance, series, minTotal = null, maxTotal = null) {
    if (![vin, target, tolerance].every(Number.isFinite) || vin <= 0 || target <= 0 || target >= vin || tolerance < 0 || tolerance > 100 || !seriesValues[series]) {
      throw new Error('0 < Vout < Vin、0〜100% の許容誤差を入力してください。');
    }
    return searchCandidates(target, tolerance, series, minTotal, maxTotal, (r1, r2) => vin * (r2 / (r1 + r2)))
      .map((row) => ({ ...row, voltage: row.value }));
  }
  function calculateRatio(part1, part2, tolerance, series, minTotal = null, maxTotal = null) {
    const target = part2 / part1;
    if (![part1, part2, target].every(Number.isFinite) || part1 <= 0 || part2 <= 0 || target <= 0) {
      throw new Error('目標の R1 : R2 は、両方とも0より大きい数値で入力してください。');
    }
    return searchCandidates(target, tolerance, series, minTotal, maxTotal, (r1, r2) => r2 / r1);
  }
  function searchCandidates(target, tolerance, series, minTotal, maxTotal, getValue) {
    if (!Number.isFinite(tolerance) || tolerance < 0 || tolerance > 100 || !seriesValues[series]) {
      throw new Error('0〜100% の許容誤差と抵抗系列を指定してください。');
    }
    if ([minTotal, maxTotal].some((value) => value !== null && (!Number.isFinite(value) || value < 0))) {
      throw new Error('総抵抗値の下限・上限は、0以上の数値で入力してください。');
    }
    if (minTotal !== null && maxTotal !== null && minTotal > maxTotal) {
      throw new Error('総抵抗値の下限は上限以下にしてください。');
    }
    const base = seriesValues[series];
    const values = [];
    for (let decade = 1; decade <= 6; decade++) {
      for (const value of base) values.push(Number((value / base[0] * 10 ** decade).toPrecision(10)));
    }
    values.push(10000000);
    const candidates = [];
    for (const r1 of values) {
      for (const r2 of values) {
        const total = r1 + r2;
        if ((minTotal !== null && total < minTotal) || (maxTotal !== null && total > maxTotal)) continue;
        const value = getValue(r1, r2);
        let error = Math.abs(value / target - 1) * 100;
        if (error < 1e-12) error = 0;
        if (error > tolerance + 1e-12) continue;
        candidates.push({ r1, r2, value, error, total, grade: error < 0.5 ? 0 : error < 2 ? 1 : 2 });
      }
    }
    return candidates;
  }
  function formatResistance(value) {
    const scale = value >= 1e6 ? 1e6 : value >= 1e3 ? 1e3 : 1;
    return `${Number((value / scale).toPrecision(10))} ${scale === 1e6 ? 'MΩ' : scale === 1e3 ? 'kΩ' : 'Ω'}`;
  }
  function getSeriesValues(series) {
    return seriesValues[series].map((value) => Number((value / seriesValues[series][0]).toPrecision(3)));
  }
  globalThis.voltageDivider = { calculate, calculateRatio, formatResistance, getSeriesValues };
})();
