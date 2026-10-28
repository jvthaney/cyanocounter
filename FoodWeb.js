/*
 * FoodWeb.js — FoodWebCounter
 *
 * A counter page that records, for every taxon, WHAT WAS COUNTED as well as how many:
 *   group         phytoplankton | zooplankton | other
 *   counting unit cells | colonies | filaments   (phytoplankton)
 *                 individuals                    (zooplankton and other)
 *
 * The unit is not optional. A count of "Microcystis: 40" cannot be turned into
 * biomass without knowing whether those were cells or colonies, and the two differ
 * roughly eightyfold for the same species. The export therefore carries the unit
 * on every row, and the food web model reads it from there.
 *
 * This file is deliberately separate from main.js: the other three counters depend
 * on main.js and nothing here should be able to break them.
 */

// ─── State ────────────────────────────────────────────────────────────────────
let counters = [];        // { id, name, count, group, unit }
let nextId   = 1;
let meta     = {};
let chart    = null;
let chartMode = 'rel';

const SR_TOTAL = 1000;    // Sedgewick Rafter squares (50 columns x 20 rows)

const GROUPS = {
    phyto: { label: 'Phytoplankton', css: 'grp-phyto', colour: '#2e8b57',
             units: ['cell', 'colony', 'filament'], defaultUnit: 'cell' },
    zoop:  { label: 'Zooplankton',   css: 'grp-zoop',  colour: '#F8BD7F',
             units: ['individual'], defaultUnit: 'individual' },
    other: { label: 'Other',         css: 'grp-other', colour: '#727171',
             units: ['individual'], defaultUnit: 'individual' },
};

// ─── Init ─────────────────────────────────────────────────────────────────────
function initCounters() { renderChart(); }

// ─── Add a counter ────────────────────────────────────────────────────────────
function addCounter(group) {
    group = GROUPS[group] ? group : 'phyto';
    const g  = GROUPS[group];
    const id = nextId++;
    counters.push({ id, name: '', count: 0, group, unit: g.defaultUnit });

    const col = document.createElement('div');
    col.className = 'counter-col';
    col.id = `col-${id}`;
    col.innerHTML = `
        <div class="counter ${g.css}" id="card-${id}">
            <button class="btn-delete-counter" onclick="deleteCounter(${id})" title="Remove this taxon" aria-label="Remove this taxon">&#10005;</button>
            <div class="seg-label" id="grp-label-${id}">Group</div>
            <div class="seg" role="group" aria-labelledby="grp-label-${id}">
                ${Object.keys(GROUPS).map(k => `
                    <button type="button" onclick="setGroup(${id},'${k}')"
                            aria-pressed="${k === group}" id="grp-${id}-${k}">
                        ${k === 'phyto' ? 'Phyto' : k === 'zoop' ? 'Zoop' : 'Other'}
                    </button>`).join('')}
            </div>
            <div class="unit-wrap" id="unit-wrap-${id}" ${g.units.length < 2 ? 'hidden' : ''}>
                <div class="seg-label" id="unit-label-${id}">Counting</div>
                <div class="seg" role="group" aria-labelledby="unit-label-${id}" id="unit-seg-${id}"></div>
            </div>
            <button class="btn add mx-10 mt-10" onclick="increment(${id})" aria-label="Add one">+</button>
            <button class="btn add mx-10 mt-10" onclick="decrement(${id})" aria-label="Subtract one">&minus;</button>
            <label class="visually-hidden" for="name-${id}">Taxon name</label>
            <input type="text" class="form-control transparent-input countername"
                   id="name-${id}" placeholder="Enter taxon name" oninput="updateName(${id})">
            <span class="counter-value" id="count-${id}">0</span>
        </div>`;
    document.getElementById('counter-grid').appendChild(col);
    renderUnitButtons(id);

    const tr = document.createElement('tr');
    tr.id = `row-${id}`;
    tr.innerHTML = `<td id="tname-${id}"></td><td id="tgroup-${id}">${g.label}</td>
        <td id="tunit-${id}">${g.defaultUnit}</td><td id="tcount-${id}">0</td>
        <td id="tslide-${id}">&mdash;</td><td id="tdensity-${id}">&mdash;</td><td id="trel-${id}">0</td>`;
    document.getElementById('taxa-preview-body').appendChild(tr);
    updateAll();
}

function renderUnitButtons(id) {
    const c = counters.find(c => c.id === id);
    if (!c) return;
    const g = GROUPS[c.group];
    const seg = document.getElementById(`unit-seg-${id}`);
    if (!seg) return;
    seg.innerHTML = g.units.map(u => `
        <button type="button" onclick="setUnit(${id},'${u}')" aria-pressed="${u === c.unit}">
            ${u === 'cell' ? 'Cells' : u === 'colony' ? 'Colonies' : u === 'filament' ? 'Filaments' : 'Individuals'}
        </button>`).join('');
    document.getElementById(`unit-wrap-${id}`).hidden = g.units.length < 2;
}

// ─── Group and unit ───────────────────────────────────────────────────────────
function setGroup(id, group) {
    const c = counters.find(c => c.id === id);
    if (!c || !GROUPS[group]) return;
    if (c.count > 0 && c.group !== group &&
        !confirm(`This counter already has ${c.count} counted as ${c.unit}. ` +
                 `Changing the group resets the unit. Continue?`)) return;
    c.group = group;
    c.unit  = GROUPS[group].defaultUnit;
    const card = document.getElementById(`card-${id}`);
    Object.values(GROUPS).forEach(g => card.classList.remove(g.css));
    card.classList.add(GROUPS[group].css);
    Object.keys(GROUPS).forEach(k => {
        const b = document.getElementById(`grp-${id}-${k}`);
        if (b) b.setAttribute('aria-pressed', String(k === group));
    });
    renderUnitButtons(id);
    document.getElementById(`tgroup-${id}`).textContent = GROUPS[group].label;
    document.getElementById(`tunit-${id}`).textContent  = c.unit;
    updateAll();
}

function setUnit(id, unit) {
    const c = counters.find(c => c.id === id);
    if (!c || !GROUPS[c.group].units.includes(unit)) return;
    if (c.count > 0 && c.unit !== unit &&
        !confirm(`This counter already has ${c.count} counted as ${c.unit}. ` +
                 `Mixing units in one counter makes the biomass wrong. ` +
                 `Change the unit anyway?`)) return;
    c.unit = unit;
    renderUnitButtons(id);
    document.getElementById(`tunit-${id}`).textContent = unit;
    updateAll();
}

// ─── Counting ─────────────────────────────────────────────────────────────────
function increment(id) {
    const c = counters.find(c => c.id === id);
    if (!c) return;
    c.count++;
    syncCount(c);
    updateAll();
}

function decrement(id) {
    const c = counters.find(c => c.id === id);
    if (!c || c.count === 0) return;
    c.count--;
    syncCount(c);
    updateAll();
}

function syncCount(c) {
    document.getElementById(`count-${c.id}`).textContent  = c.count;
    document.getElementById(`tcount-${c.id}`).textContent = c.count;
}

function updateName(id) {
    const c = counters.find(c => c.id === id);
    if (!c) return;
    c.name = document.getElementById(`name-${id}`).value;
    document.getElementById(`tname-${id}`).textContent = c.name;
    renderChart();
}

function deleteCounter(id) {
    if (!confirm('Remove this taxon counter?')) return;
    counters = counters.filter(c => c.id !== id);
    document.getElementById(`col-${id}`)?.remove();
    document.getElementById(`row-${id}`)?.remove();
    updateAll();
}

function resetCounters() {
    if (!confirm('Reset all counts to zero? The taxa, groups and units are kept.')) return;
    counters.forEach(c => { c.count = 0; syncCount(c); });
    updateAll();
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
function submitInfo() {
    const v = id => document.getElementById(id)?.value || '';
    meta = {
        name: v('text1'), date: v('text2'), time: v('text3'), location: v('text4'),
        lat: v('text5'), lon: v('text6'), volSample: v('text_vol'),
        squares: v('text_squares'), depth: v('text_depth'), netDiam: v('text_diam'),
        volSlide: v('text_volslide'), threshold: v('text_threshold'), notes: v('text_notes'),
    };
    const set = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
    set('out1', meta.name); set('out2', meta.date); set('out3', meta.time);
    set('out4', meta.location); set('out5', meta.lat); set('out6', meta.lon);
    set('out_vol', meta.volSample); set('out_squares', meta.squares);
    set('out_depth', meta.depth); set('out_diam', meta.netDiam);
    set('out_volslide', meta.volSlide); set('out_notes', meta.notes);
    set('out_threshold', meta.threshold || '(full slide)');
    document.getElementById('outalert').textContent = 'Info submitted \u2713';

    const t = parseFloat(meta.threshold);
    const wrap = document.getElementById('threshold-bar-wrap');
    if (!isNaN(t) && t > 0) {
        wrap.style.display = 'block';
        document.getElementById('threshold-display').textContent = t;
    } else {
        wrap.style.display = 'none';
    }
    updateAll();
}

// ─── Calculations ─────────────────────────────────────────────────────────────
function densities() {
    const squares   = parseFloat(meta.squares);
    const propSlide = (!isNaN(squares) && squares > 0) ? squares / SR_TOTAL : NaN;
    const volSample = parseFloat(meta.volSample);
    const volSlide  = parseFloat(meta.volSlide);
    const depth     = parseFloat(meta.depth);
    const diam      = parseFloat(meta.netDiam);
    const r         = diam / 2;
    const lakeL     = (!isNaN(diam) && !isNaN(depth)) ? Math.PI * r * r * depth * 1000 : NaN;
    const propOn    = (volSample > 0 && volSlide > 0) ? volSlide / volSample : NaN;
    return { propSlide, propOn, lakeL };
}

function updateAll() {
    const total = counters.reduce((s, c) => s + c.count, 0);
    const outTotal = document.getElementById('out_total_counted');
    if (outTotal) outTotal.textContent = total;

    const t = parseFloat(meta.threshold);
    if (!isNaN(t) && t > 0) {
        const bar = document.getElementById('threshold-bar');
        bar.style.width = Math.min((total / t) * 100, 100) + '%';
        bar.classList.toggle('done', total >= t);
        document.getElementById('threshold-reached-alert').style.display = total >= t ? 'block' : 'none';
        document.getElementById('total-counted-display').textContent = total;
    }

    const { propSlide, propOn, lakeL } = densities();
    const fmt = v => isNaN(v) ? '\u2014' : parseFloat(v.toFixed(3)).toString();
    counters.forEach(c => {
        const perSlide = (propSlide > 0) ? c.count / propSlide : NaN;
        const perLitre = (propOn > 0 && lakeL > 0) ? (perSlide / propOn) / lakeL : NaN;
        const rel = total > 0 ? (c.count / total) * 100 : 0;
        const el = id => document.getElementById(id);
        if (el(`tslide-${c.id}`))   el(`tslide-${c.id}`).textContent   = fmt(perSlide);
        if (el(`tdensity-${c.id}`)) el(`tdensity-${c.id}`).textContent = fmt(perLitre);
        if (el(`trel-${c.id}`))     el(`trel-${c.id}`).textContent     = parseFloat(rel.toFixed(1));
    });
    renderChart();
}

// ─── Chart ────────────────────────────────────────────────────────────────────
function setChartMode(mode) {
    chartMode = mode;
    document.querySelectorAll('.chart-toggle-btn').forEach(b =>
        b.classList.toggle('active-toggle', b.dataset.mode === mode));
    renderChart();
}

function renderChart() {
    const canvas = document.getElementById('taxa-chart');
    if (!canvas || typeof Chart === 'undefined') return;
    const named = counters.filter(c => c.name.trim() !== '');
    const { propSlide, propOn, lakeL } = densities();
    const total = counters.reduce((s, c) => s + c.count, 0);

    const value = c => {
        if (chartMode === 'rel') return total > 0 ? (c.count / total) * 100 : 0;
        const perSlide = (propSlide > 0) ? c.count / propSlide : 0;
        if (chartMode === 'slide') return perSlide;
        return (propOn > 0 && lakeL > 0) ? (perSlide / propOn) / lakeL : 0;
    };
    const labels = named.map(c => `${c.name} (${c.unit})`);
    const data   = named.map(value);
    const colours = named.map(c => GROUPS[c.group].colour);
    const yLabel = chartMode === 'rel' ? 'Relative abundance (%)'
                 : chartMode === 'slide' ? 'Units/slide' : 'Units/L';

    if (chart) chart.destroy();
    chart = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: { labels, datasets: [{ label: yLabel, data, backgroundColor: colours }] },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, title: { display: true, text: yLabel } } },
        },
    });
}

// ─── Hand the count straight to the dashboard ─────────────────────────────────
// Both pages are served from the same site, so the dashboard can read what we
// leave here. If the browser refuses (opening the files directly from disk, or
// private browsing), we say so and the user exports a CSV instead.
const HANDOFF_KEY = 'cfb.foodweb.count';

function sendToDashboard() {
    const named = counters.filter(c => c.name.trim() !== '');
    if (!named.length) { alert('Add at least one named taxon first.'); return; }
    const payload = {
        savedAt: new Date().toISOString(),
        meta: { name: meta.name || '', date: meta.date || '', location: meta.location || '' },
        rows: named.map(c => ({
            taxon: c.name.trim(),
            group: c.group,
            unit: c.unit === 'filament' ? 'filament_100um' : c.unit,
            count: c.count,
        })),
    };
    try {
        localStorage.setItem(HANDOFF_KEY, JSON.stringify(payload));
    } catch (e) {
        alert('This browser will not let the two pages share data here. '
            + 'Use "Export data" and then load the file in the dashboard.');
        return;
    }
    window.open('foodweb.html', '_blank', 'noopener');
}

// ─── Export ───────────────────────────────────────────────────────────────────
function exportData() {
    const total = counters.reduce((s, c) => s + c.count, 0);
    const missingUnit = counters.filter(c => c.name.trim() !== '' && !c.unit);
    if (missingUnit.length) {
        alert('Some counters have no counting unit set. Set it before exporting.');
        return;
    }
    const q = v => `"${String(v === undefined || v === null ? '' : v).replace(/"/g, '""')}"`;

    const metaHeaders = ['Name', 'Date', 'Time', 'Location', 'Lat', 'Lon',
        'Vol sample (ml)', 'Squares counted', 'Depth (m)', 'Net diam (m)',
        'Vol slide (ml)', 'Count threshold', 'Total counted', 'Notes'];
    const metaValues = [meta.name, meta.date, meta.time, meta.location, meta.lat, meta.lon,
        meta.volSample, meta.squares, meta.depth, meta.netDiam, meta.volSlide,
        meta.threshold || '(full slide)', total, meta.notes];

    // These column names are what build_food_web.py reads.
    const taxaHeaders = ['taxon', 'group', 'counting_unit', 'count',
                         'units_per_slide', 'units_per_litre', 'relative_abundance_pct'];
    const { propSlide, propOn, lakeL } = densities();
    const taxaRows = counters.map(c => {
        const perSlide = (propSlide > 0) ? c.count / propSlide : NaN;
        const perLitre = (propOn > 0 && lakeL > 0) ? (perSlide / propOn) / lakeL : NaN;
        const rel = total > 0 ? (c.count / total) * 100 : 0;
        const n = v => isNaN(v) ? '' : parseFloat(v.toFixed(3));
        return [q(c.name), q(GROUPS[c.group].label), q(c.unit), c.count,
                n(perSlide), n(perLitre), parseFloat(rel.toFixed(1))].join(',');
    });

    const csv = [
        metaHeaders.map(q).join(','),
        metaValues.map(q).join(','),
        '',
        taxaHeaders.map(q).join(','),
        ...taxaRows,
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `${meta.name || 'FoodWebCount'}_${meta.date || 'nodate'}.csv`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
