(() => {
  const names = ['黒', '茶', '赤', '橙', '黄', '緑', '青', '紫', '灰', '白', '金', '銀'];
  const hex = ['#161616', '#834b29', '#d83030', '#f28520', '#f3d537', '#26975a', '#2863c6', '#914bb2', '#969696', '#ffffff', '#c5a34e', '#c0c7ce'];
  const tolerances = { 1: 1, 2: 2, 5: 0.5, 6: 0.25, 7: 0.1, 8: 0.05, 10: 5, 11: 10 };
  const ppm = { 0: 250, 1: 100, 2: 50, 3: 15, 4: 25, 5: 20, 6: 10, 7: 5, 8: 1 };
  const multipliers = Object.fromEntries(names.map((_, i) => [i, i < 10 ? i : i === 10 ? -1 : -2]));
  function encodeResistance(value, count) {
    if (!Number.isFinite(value) || value <= 0) throw new Error('0より大きい有限の抵抗値を入力してください。');
    const length = count === 4 ? 2 : 3;
    const min = 10 ** (length - 1);
    for (let exponent = -2; exponent <= 9; exponent++) {
      const significant = value / 10 ** exponent;
      const rounded = Math.round(significant);
      if (rounded >= min && rounded < min * 10 && Math.abs(significant - rounded) <= Math.max(1, significant) * Number.EPSILON * 16) {
        return { digits: String(rounded).split('').map(Number), multiplier: exponent >= 0 ? exponent : exponent === -1 ? 10 : 11 };
      }
    }
    throw new Error(`${count}バンドでは正確に表現できません。有効数字${length}桁、乗数0.01〜10⁹の範囲で入力してください。`);
  }
  function decodeResistance(digits, multiplier) {
    return Number(digits.join('')) * 10 ** multipliers[multiplier];
  }
  function formatResistance(value) {
    const unit = [[1e9, 'GΩ'], [1e6, 'MΩ'], [1e3, 'kΩ'], [0, 'Ω']].find(([limit]) => value >= limit);
    return `${Number((value / (unit[0] || 1)).toPrecision(12))} ${unit[1]}`;
  }
  globalThis.ResistorColorCode = { names, hex, tolerances, ppm, multipliers, encodeResistance, decodeResistance, formatResistance };
})();
