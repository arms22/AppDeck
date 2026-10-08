(() => {
  const { calculate, calculateRatio, formatResistance, getSeriesValues } = globalThis.voltageDivider;
  const find = (id) => document.getElementById(id);
  const headers = [...document.querySelectorAll('th[data-key]')];
  const pageSize = 100;
  let candidates = [];
  let sortKey = 'error';
  let direction = 1;
  let page = 0;
  for (const series of ['E6', 'E12', 'E24', 'E48', 'E96']) {
    const row = document.createElement('section');
    row.className = 'series-row';
    row.dataset.series = series;
    const values = getSeriesValues(series);
    row.innerHTML = `<h3>${series}（${values.length}値）</h3><div class="series-numbers">${values.map((value) => `<span>${value}</span>`).join('')}</div>`;
    find('series-values').append(row);
  }
  function readTotalLimit(id, unitId) {
    const input = find(id);
    if (input.validity.badInput) throw new Error('総抵抗値の下限・上限には数値を入力してください。');
    return input.value === '' ? null : input.valueAsNumber * Number(find(unitId).value);
  }
  function render() {
    candidates.sort((a, b) => direction * (a[sortKey] - b[sortKey]) || a.error - b.error || a.total - b.total || a.r1 - b.r1);
    headers.forEach((header) => header.setAttribute('aria-sort', header.dataset.key === sortKey ? direction === 1 ? 'ascending' : 'descending' : 'none'));
    find('candidates').innerHTML = candidates.slice(page * pageSize, (page + 1) * pageSize).map((row) => {
      const label = ['優良', '良好', '許容'][row.grade];
      const style = ['excellent', 'good', 'acceptable'][row.grade];
      const ratioBase = find('ratio-r1').valueAsNumber;
      const value = find('mode').value === 'ratio' ? `${ratioBase} : ${Number((ratioBase * row.value).toPrecision(8))}` : `${Number(row.value.toPrecision(8))} V`;
      return `<tr><td>${formatResistance(row.r1)}</td><td>${formatResistance(row.r2)}</td><td>${value}</td><td>${row.error === 0 ? '0' : row.error < 0.0001 ? row.error.toExponential(3) : row.error.toFixed(4)}</td><td>${formatResistance(row.total)}</td><td><span class="badge ${style}">${label}</span></td></tr>`;
    }).join('') || '<tr><td class="empty" colspan="6">候補がありません。入力値や許容誤差を調整してください。</td></tr>';
    find('page-info').textContent = candidates.length ? `${page * pageSize + 1}〜${Math.min((page + 1) * pageSize, candidates.length)} / ${candidates.length.toLocaleString('ja-JP')} 件` : '0 件';
    find('previous').disabled = page === 0;
    find('next').disabled = (page + 1) * pageSize >= candidates.length;
  }
  function update() {
    const status = find('status');
    const isRatio = find('mode').value === 'ratio';
    find('series-selection').textContent = `選択中：${find('series').value}`;
    document.querySelectorAll('.series-row').forEach((row) => {
      row.classList.toggle('selected', row.dataset.series === find('series').value);
    });
    document.querySelectorAll('[data-mode]').forEach((label) => {
      label.hidden = label.dataset.mode !== find('mode').value;
      label.querySelector('input').disabled = label.hidden;
    });
    find('value-heading').textContent = isRatio ? '実際の抵抗比 R1 : R2' : '出力電圧';
    find('ratio-label').textContent = isRatio ? '目標抵抗比 R1 : R2' : '理想分圧比 Vout / Vin';
    find('formula').innerHTML = isRatio ? '例：目標が 3 : 6、抵抗が 10 kΩ : 22 kΩ → 実際の比率は 3 : 6.6<br>入力した R1 側の比を固定し、R2 側を換算して表示します。' : 'Vin ─ R1（上側）─ Vout ─ R2（下側）─ GND<br>Vout = Vin × R2 / (R1 + R2)';
    find('error-help').textContent = isRatio ? '誤差 (%) = |実際の R2/R1 ÷ 目標の R2/R1 − 1| × 100' : '誤差 (%) = |実際の Vout ÷ 目標の Vout − 1| × 100';
    try {
      const first = find(isRatio ? 'ratio-r1' : 'vin').valueAsNumber;
      const second = find(isRatio ? 'ratio-r2' : 'vout').valueAsNumber;
      candidates = (isRatio ? calculateRatio : calculate)(first, second, find('tolerance').valueAsNumber, find('series').value,
        readTotalLimit('min-total', 'min-unit'), readTotalLimit('max-total', 'max-unit'));
      find('ratio').textContent = isRatio ? `${first} : ${second}` : Number((second / first).toPrecision(7));
      find('count').textContent = candidates.length.toLocaleString('ja-JP');
      const best = candidates.reduce((min, row) => Math.min(min, row.error), Infinity);
      find('best').textContent = Number.isFinite(best) ? `${Number(best.toPrecision(5))}%` : '—';
      status.textContent = `${find('series').value} の候補を計算しました。評価：優良 < 0.5% / 良好 < 2% / 許容 ≥ 2%`;
      status.className = '';
    } catch (error) {
      candidates = [];
      ['ratio', 'count', 'best'].forEach((id) => { find(id).textContent = '—'; });
      status.textContent = error.message;
      status.className = 'error';
    }
    page = 0;
    render();
  }
  find('parameters').addEventListener('submit', (event) => { event.preventDefault(); update(); });
  find('parameters').addEventListener('input', update);
  headers.forEach((header) => header.querySelector('button').addEventListener('click', () => {
    direction = sortKey === header.dataset.key ? -direction : 1;
    sortKey = header.dataset.key;
    page = 0;
    render();
  }));
  find('previous').addEventListener('click', () => { page--; render(); });
  find('next').addEventListener('click', () => { page++; render(); });
  update();
})();
