(() => {
  const { names, hex, tolerances, ppm, multipliers, encodeResistance, decodeResistance, formatResistance } = globalThis.ResistorColorCode;
  const byId = (id) => document.getElementById(id);
  const count = byId('band-count');
  const input = byId('resistance');
  const unit = byId('unit');
  let state = { digits: [4, 7], multiplier: 2, tolerance: 10, ppm: 1 };
  function render() {
    const fields = state.digits.map((digit, i) => ({ key: 'digit', index: i, value: digit, title: `第${i + 1}バンド・数字`, options: names.slice(i === 0 ? 1 : 0, 10).map((name) => [names.indexOf(name), `${name} (${names.indexOf(name)})`]) }));
    fields.push({ key: 'multiplier', value: state.multiplier, title: `第${fields.length + 1}バンド・乗数`, options: names.map((name, i) => [i, `${name} (×${10 ** multipliers[i]})`]) });
    fields.push({ key: 'tolerance', value: state.tolerance, title: `第${fields.length + 1}バンド・公差`, options: Object.entries(tolerances).map(([i, value]) => [i, `${names[i]} (±${value}%)`]) });
    if (count.value === '6') fields.push({ key: 'ppm', value: state.ppm, title: '第6バンド・温度係数', options: Object.entries(ppm).map(([i, value]) => [i, `${names[i]} (${value} ppm/℃)`]) });
    byId('bands').replaceChildren();
    byId('resistor').replaceChildren();
    for (const field of fields) {
      const label = document.createElement('label');
      const title = document.createElement('span');
      title.className = 'band-title';
      const swatch = document.createElement('span');
      swatch.className = 'swatch';
      swatch.style.background = hex[field.value];
      title.append(swatch, field.title);
      const select = document.createElement('select');
      for (const [value, text] of field.options) select.add(new Option(text, value));
      select.value = field.value;
      select.addEventListener('change', () => {
        if (field.key === 'digit') state.digits[field.index] = Number(select.value);
        else state[field.key] = Number(select.value);
        byId('status').textContent = '';
        input.removeAttribute('aria-invalid');
        input.value = Number((decodeResistance(state.digits, state.multiplier) / Number(unit.value)).toPrecision(12));
        render();
        byId('bands').querySelectorAll('select')[fields.indexOf(field)].focus();
      });
      label.append(title, select);
      byId('bands').append(label);
      const stripe = document.createElement('div');
      stripe.className = `stripe ${field.key}`;
      stripe.style.background = hex[field.value];
      byId('resistor').append(stripe);
    }
    const description = fields.map((field) => names[field.value]).join(' → ');
    byId('color-description').textContent = description;
    document.querySelector('.preview').setAttribute('aria-label', `${count.value}バンド抵抗器：${description}`);
    const value = decodeResistance(state.digits, state.multiplier);
    const tolerance = tolerances[state.tolerance];
    byId('result').textContent = `${formatResistance(value)} ±${tolerance}%`;
    byId('range').textContent = `公差範囲：${formatResistance(value * (1 - tolerance / 100))} 〜 ${formatResistance(value * (1 + tolerance / 100))}`;
    byId('formula').textContent = `${state.digits.join('')} × ${10 ** multipliers[state.multiplier]} Ω = ${formatResistance(value)}`;
    byId('ppm-result').textContent = count.value === '6' ? `温度係数：${ppm[state.ppm]} ppm/℃（1℃あたり ${ppm[state.ppm] / 10000}%）` : '温度係数：指定なし（6バンドで選択できます）';
  }
  function fromInput() {
    try {
      if (input.value.trim() === '') throw new Error('抵抗値を入力してください。');
      state = { ...state, ...encodeResistance(Number(input.value) * Number(unit.value), Number(count.value)) };
      input.removeAttribute('aria-invalid');
      byId('status').textContent = '';
    } catch (error) {
      input.setAttribute('aria-invalid', 'true');
      byId('status').textContent = `${error.message} 下の結果は選択中の色の値です。`;
    }
    render();
  }
  input.addEventListener('input', fromInput);
  unit.addEventListener('change', fromInput);
  count.addEventListener('change', () => {
    if (count.value === '4') state.digits = state.digits.slice(0, 2);
    else if (state.digits.length === 2) state.digits.push(0);
    fromInput();
  });
  fromInput();
})();
