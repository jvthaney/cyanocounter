/*
 * shared_counter.js
 * Shared logic used by CyanoCounter (index/main), PlanktonCounter, and TaxonCounter.
 * Each page includes this after setting PAGE_CONFIG before the script tag.
 *
 * PAGE_CONFIG shape:
 * {
 *   mode: 'cyano' | 'plankton' | 'taxon',
 *   presets: [{ name, colour, imgIndex }],   // cyano only
 *   yAxisLabels: { count, slide, density },  // labels for chart toggle
 *   densityLabel: string,                    // column header e.g. "Individuals/L"
 * }
 */

// ─── State ────────────────────────────────────────────────────────────────────
let counters = [];     // { id, name, count, unit, isPreset, imgIndex? }

// What was counted has to be recorded, not assumed: 40 Microcystis cells and 40
// Microcystis colonies differ about eightyfold in biomass, so a count without its
// unit cannot be turned into biomass at all. Nothing is counted until a unit is set.
const UNITS = [["cell", "Cells"], ["colony", "Colonies"], ["filament", "Filaments"]];

function unitSegHtml(id, chosen) {
    return `<div class="seg-label" id="unit-label-${id}">Counting</div>
        <div class="seg" role="group" aria-labelledby="unit-label-${id}" id="unit-seg-${id}">` +
        UNITS.map(([u, label]) => `<button type="button" onclick="setUnit(${id},'${u}')"
            aria-pressed="${u === chosen}">${label}</button>`).join("") + `</div>`;
}

function setUnit(id, unit) {
    const c = counters.find(c => c.id === id);
    if (!c || !UNITS.some(([u]) => u === unit)) return;
    if (c.count > 0 && c.unit && c.unit !== unit &&
        !confirm(`This counter already has ${c.count} counted as ${c.unit}. Mixing units in ` +
                 `one counter makes the biomass wrong. Change it anyway?`)) return;
    c.unit = unit;
    const seg = document.getElementById(`unit-seg-${id}`);
    if (seg) [...seg.querySelectorAll("button")].forEach((b, i) =>
        b.setAttribute("aria-pressed", String(UNITS[i][0] === unit)));
    const cell = document.getElementById(`tunit-${id}`);
    if (cell) cell.textContent = unit;
    document.getElementById(`card-${id}`)?.classList.remove("needs-unit");
    document.getElementById(`preset-card-${c.presetIdx}`)?.classList.remove("needs-unit");
    updateAll();
}

function requireUnit(id) {
    const c = counters.find(c => c.id === id);
    if (!c || c.unit) return true;
    const card = document.getElementById(`card-${id}`)
              || document.getElementById(`preset-card-${c.presetIdx}`);
    if (card) {
        card.classList.add("needs-unit");
        card.querySelector(".seg")?.scrollIntoView({ block: "nearest" });
    }
    return false;
}
let nextId   = 1;
let meta     = {};
let chart    = null;
let chartMode = 'rel'; // 'rel' | 'slide' | 'density'

const COLOURS  = ['', 'pink', 'blue', 'orange', 'teal', 'grey', 'rose', 'wine', 'khaki'];
const SR_TOTAL = 1000; // Sedgewick Rafter total squares (50 cols × 20 rows)

// ─── Init ─────────────────────────────────────────────────────────────────────

// ─── Keeping the sample details in step ───────────────────────────────────────
// These used to be read only when a Submit button was pressed, so a note typed and
// not submitted was missing from the export: quiet data loss. They are now read as
// they are typed, and read again before any export, so pressing anything is optional.
const META_IDS = ['text1','text2','text3','text4','text5','text6','text_vol','text_squares',
                  'text_depth','text_tows','text_diam','text_volslide','text_threshold',
                  'text_notes','text_area'];
let metaTimer = null;

function watchMetaFields() {
    META_IDS.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        // A short wait means a half-typed number such as "0." never reaches the
        // density sums; leaving the box applies it at once.
        el.addEventListener('input', () => {
            clearTimeout(metaTimer);
            metaTimer = setTimeout(() => submitInfo(true), 350);
        });
        el.addEventListener('change', () => { clearTimeout(metaTimer); submitInfo(true); });
    });
}

function initCounters() {
    watchMetaFields();
    // Build preset counters (cyano page)
    if (window.PAGE_CONFIG && PAGE_CONFIG.presets) {
        PAGE_CONFIG.presets.forEach((p, i) => {
            const id = nextId++;
            counters.push({ id, name: p.name, count: 0, unit: "", isPreset: true,
                            imgIndex: p.imgIndex, colour: p.colour, presetIdx: i + 1,
                            presetName: p.name });
            renderPresetCard(id, p, i);
            addTableRow(id, p.name);
        });
    }
    renderChart();
}

// ─── Preset card (cyano only — cards already in HTML, just wire them up) ──────
function renderPresetCard(id, preset, idx) {
    // Preset cards are in HTML; we just store their data and wire +/- buttons
    const card = document.getElementById(`preset-card-${idx + 1}`);
    if (!card) return;
    card.classList.add("needs-unit");

    // The preset name is editable: a counter labelled Dolichospermum can be renamed to
    // whatever was actually on the slide, and the original stays as the placeholder so
    // emptying the box does not lose it.
    const heading = card.querySelector("h3");
    let anchor = heading;
    if (heading) {
        const box = document.createElement("input");
        box.type = "text";
        box.className = "form-control transparent-input countername preset-name";
        box.id = `name-${id}`;
        box.value = preset.name;
        box.placeholder = preset.name;
        box.title = "Rename this counter";
        box.setAttribute("aria-label", `Name of this counter (currently ${preset.name})`);
        box.addEventListener("input", () => updateName(id));
        heading.replaceWith(box);
        anchor = box;
    }
    const seg = document.createElement("div");
    seg.innerHTML = unitSegHtml(id, "");
    if (anchor) anchor.insertAdjacentElement("afterend", seg);
    else card.appendChild(seg);
    card.querySelector('.btn-add').addEventListener('click', () => { increment(id); });
    card.querySelector('.btn-min').addEventListener('click', () => { decrement(id); });
    if (card.querySelector('.btn-view')) {
        card.querySelector('.btn-view').addEventListener('click', () => openModal(preset.imgIndex));
    }
}

// ─── Dynamic counter card ─────────────────────────────────────────────────────
function addCounter() {
    const id     = nextId++;
    const colour = COLOURS[(counters.length) % COLOURS.length];
    counters.push({ id, name: '', count: 0, unit: "", isPreset: false, colour });

    const grid = document.getElementById('counter-grid');
    const col  = document.createElement('div');
    col.className = 'counter-col';
    col.id = `col-${id}`;
    col.innerHTML = `
        <div class="counter ${colour} needs-unit" id="card-${id}">
            <button class="btn-delete-counter" onclick="deleteCounter(${id})" title="Remove">&#10005;</button>
            <div class="counter-icon"></div>
            ${unitSegHtml(id, "")}
            <button class="btn add mx-10 mt-10" onclick="increment(${id})">+</button>
            <button class="btn add mx-10 mt-10" onclick="decrement(${id})">−</button>
            <input type="text" class="form-control transparent-input countername"
                   id="name-${id}" placeholder="Enter taxon name"
                   oninput="updateName(${id})">
            <span class="counter-value" id="count-${id}">0</span>
        </div>`;
    grid.appendChild(col);
    addTableRow(id, '');
    updateAll();
}

function deleteCounter(id) {
    if (!confirm('Remove this taxon counter?')) return;
    counters = counters.filter(c => c.id !== id);
    document.getElementById(`col-${id}`)?.remove();
    document.getElementById(`row-${id}`)?.remove();
    updateAll();
}

function addTableRow(id, name) {
    const tbody = document.getElementById('taxa-preview-body');
    const tr    = document.createElement('tr');
    tr.id       = `row-${id}`;
    const densityHeader = window.PAGE_CONFIG?.densityLabel || 'Individuals/L';
    tr.innerHTML = `
        <td id="tname-${id}">${name}</td>
        <td id="tunit-${id}" class="unit-cell">not set</td>
        <td id="tcount-${id}">0</td>
        <td id="tslide-${id}">—</td>
        <td id="tdensity-${id}">—</td>
        <td id="trel-${id}">0</td>`;
    tbody.appendChild(tr);
}

// ─── Increment / Decrement ────────────────────────────────────────────────────
function increment(id) {
    if (!requireUnit(id)) return;
    const c = counters.find(c => c.id === id);
    if (!c) return;
    c.count++;
    document.getElementById(`count-${id}`).textContent  = c.count;
    document.getElementById(`tcount-${id}`).textContent = c.count;
    updateAll();
}

function decrement(id) {
    if (!requireUnit(id)) return;
    const c = counters.find(c => c.id === id);
    if (!c || c.count === 0) return;
    c.count--;
    document.getElementById(`count-${id}`).textContent  = c.count;
    document.getElementById(`tcount-${id}`).textContent = c.count;
    updateAll();
}

function updateName(id) {
    const c = counters.find(c => c.id === id);
    if (!c) return;
    const typed = document.getElementById(`name-${id}`).value;
    // An emptied preset box falls back to the name it started with, so a counter can
    // never be exported nameless just because someone cleared the field.
    c.name = typed.trim() ? typed : (c.presetName || "");
    const cell = document.getElementById(`tname-${id}`);
    if (cell) cell.textContent = c.name;
    renderChart();
}

// ─── Submit info ──────────────────────────────────────────────────────────────
function submitInfo(quiet) {
    const g  = id => document.getElementById(id)?.value || '';
    const mode = window.PAGE_CONFIG?.mode || 'plankton';

    meta = {
        name:      g('text1'), date:     g('text2'), time:    g('text3'),
        location:  g('text4'), lat:      g('text5'), lon:     g('text6'),
        threshold: g('text_threshold'),
        notes:     g('text_notes'),
    };

    if (mode === 'cyano' || mode === 'plankton') {
        meta.volSample  = g('text_vol');
        meta.squares    = g('text_squares');
        meta.depth      = g('text_depth');
        meta.tows       = g("text_tows");
        meta.netDiam    = g('text_diam');
        meta.volSlide   = g('text_volslide');
    }
    if (mode === 'taxon') {
        meta.area = g('text_area');
    }

    // Populate metadata preview
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('out1', meta.name);    set('out2', meta.date);     set('out3', meta.time);
    set('out4', meta.location);set('out5', meta.lat);      set('out6', meta.lon);
    if (mode !== 'taxon') {
        set('out_vol',      meta.volSample);
        set('out_squares',  meta.squares);
        set('out_depth',    meta.depth);
        set('out_tows',     meta.tows);
        set('out_diam',     meta.netDiam);
        set('out_volslide', meta.volSlide);
    } else {
        set('out_area', meta.area);
    }
    set('out_threshold', meta.threshold || '(none)');
    set('out_notes',     meta.notes);

    const note = document.getElementById('outalert');
    if (note) note.textContent = 'Sample details saved \u2713';

    // Threshold bar
    const thresh = parseFloat(meta.threshold);
    const wrap   = document.getElementById('threshold-bar-wrap');
    if (wrap) {
        if (!isNaN(thresh) && thresh > 0) {
            wrap.style.display = 'block';
            document.getElementById('threshold-display').textContent = thresh;
        } else {
            wrap.style.display = 'none';
        }
    }

    updateAll();
}

// ─── Core calculation ─────────────────────────────────────────────────────────
function updateAll() {
    const mode  = window.PAGE_CONFIG?.mode || 'plankton';
    const total = counters.reduce((s, c) => s + c.count, 0);

    // Threshold bar update
    const thresh = parseFloat(meta.threshold);
    const wrap   = document.getElementById('threshold-bar-wrap');
    if (wrap && wrap.style.display !== 'none' && !isNaN(thresh) && thresh > 0) {
        const pct  = Math.min((total / thresh) * 100, 100);
        const bar  = document.getElementById('threshold-bar');
        bar.style.width = pct + '%';
        bar.classList.toggle('done', total >= thresh);
        document.getElementById('threshold-reached-alert').style.display = total >= thresh ? 'block' : 'none';
        document.getElementById('total-counted-display').textContent = total;
    }
    const outTotal = document.getElementById('out_total_counted');
    if (outTotal) outTotal.textContent = total;

    const fmt = v => isNaN(v) ? '—' : parseFloat(v.toFixed(3)).toString();

    counters.forEach(c => {
        let indSlide   = NaN;
        let density    = NaN;
        const relAbund = total > 0 ? (c.count / total) * 100 : 0;

        if (mode === 'cyano' || mode === 'plankton') {
            // Squares counted is optional. Left blank, the whole slide is assumed,
            // which also suits anyone not using a Sedgewick Rafter at all.
            const squares    = parseFloat(meta.squares);
            const percSlide  = (!isNaN(squares) && squares > 0) ? squares / SR_TOTAL : 1;
            const volSample  = parseFloat(meta.volSample);
            const volSlide   = parseFloat(meta.volSlide);
            const depth      = parseFloat(meta.depth);
            const diam       = parseFloat(meta.netDiam);
            const tows       = parseFloat(meta.tows) || 1;

            indSlide = (!isNaN(percSlide) && percSlide > 0) ? c.count / percSlide : NaN;

            const r          = diam / 2;
            const lakeWaterL = (!isNaN(diam) && !isNaN(depth))
                               ? Math.PI * r * r * depth * tows * 1000 : NaN;
            const propOnSlide= (!isNaN(volSample) && volSample > 0 && !isNaN(volSlide) && volSlide > 0)
                               ? volSlide / volSample : NaN;

            if (!isNaN(indSlide) && !isNaN(propOnSlide) && !isNaN(lakeWaterL) && lakeWaterL > 0) {
                density = (indSlide / propOnSlide) / lakeWaterL;
            }
        } else if (mode === 'taxon') {
            const area = parseFloat(meta.area);
            density = (!isNaN(area) && area > 0) ? c.count / area : NaN;
        }

        document.getElementById(`tslide-${c.id}`).textContent   = fmt(indSlide);
        document.getElementById(`tdensity-${c.id}`).textContent = fmt(density);
        document.getElementById(`trel-${c.id}`).textContent     = parseFloat(relAbund.toFixed(1));
    });

    renderChart();
}

// ─── Reset ────────────────────────────────────────────────────────────────────
function resetCounters() {
    if (!confirm('Reset all counters to zero?')) return;
    counters.forEach(c => {
        c.count = 0;
        document.getElementById(`count-${c.id}`).textContent  = 0;
        document.getElementById(`tcount-${c.id}`).textContent = 0;
    });
    updateAll();
}

// ─── Chart ────────────────────────────────────────────────────────────────────
function renderChart() {
    const canvas = document.getElementById('taxa-chart');
    if (!canvas || typeof Chart === 'undefined') return;

    // Sort descending by current Y value
    const getValue = c => {
        if (chartMode === 'rel') {
            const total = counters.reduce((s, x) => s + x.count, 0);
            return total > 0 ? (c.count / total) * 100 : 0;
        }
        const el = chartMode === 'slide'
            ? document.getElementById(`tslide-${c.id}`)
            : document.getElementById(`tdensity-${c.id}`);
        const v = parseFloat(el?.textContent);
        return isNaN(v) ? 0 : v;
    };

    const sorted = [...counters].sort((a, b) => getValue(b) - getValue(a));
    const labels = sorted.map(c => c.name || '(unnamed)');
    const data   = sorted.map(c => getValue(c));

    const colours = sorted.map((_, i) => {
        const palette = ['#009988','#EE7733','#33BBEE','#EE3377','#CC6677','#882255','#727171','#AA4499','#DDCC77'];
        return palette[i % palette.length];
    });

    const mode = window.PAGE_CONFIG?.mode || 'plankton';
    const yLabels = PAGE_CONFIG?.yAxisLabels || { rel: 'Relative abundance (%)', slide: 'Individuals/slide', density: 'Individuals/L' };
    const yLabel  = chartMode === 'rel' ? yLabels.rel : chartMode === 'slide' ? yLabels.slide : yLabels.density;

    if (chart) {
        chart.data.labels          = labels;
        chart.data.datasets[0].data   = data;
        chart.data.datasets[0].backgroundColor = colours;
        chart.options.scales.y.title.text = yLabel;
        chart.update();
        return;
    }

    chart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: yLabel,
                data,
                backgroundColor: colours,
                borderRadius: 4,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: ctx => `${ctx.parsed.y.toFixed(2)}` } }
            },
            scales: {
                x: { ticks: { font: { family: 'Cabin', size: 13 } } },
                y: {
                    beginAtZero: true,
                    title: { display: true, text: yLabel, font: { family: 'Cabin', size: 13 } },
                    ticks: { font: { family: 'Cabin', size: 12 } }
                }
            }
        }
    });
}

function setChartMode(mode) {
    chartMode = mode;
    document.querySelectorAll('.chart-toggle-btn').forEach(btn => {
        btn.classList.toggle('active-toggle', btn.dataset.mode === mode);
    });
    renderChart();
}

// ─── Modal (cyano presets) ────────────────────────────────────────────────────
function openModal(idx) {
    const modal = document.getElementById(`myModal${idx}`);
    if (modal) modal.style.display = 'block';
}
document.addEventListener('click', e => {
    if (e.target.classList.contains('close')) {
        e.target.closest('.modal').style.display = 'none';
    }
});

// ─── Export CSV ───────────────────────────────────────────────────────────────
function exportData() {
    submitInfo(true);   // whatever is in the boxes right now
    const mode  = window.PAGE_CONFIG?.mode || 'plankton';
    const total = counters.reduce((s, c) => s + c.count, 0);

    const noUnit = counters.filter(c => c.count > 0 && !c.unit);
    if (noUnit.length) {
        alert('Set what was counted (cells, colonies or filaments) on these counters first:\n\n'
              + noUnit.map(c => '  ' + (c.name || 'unnamed counter')).join('\n'));
        noUnit.forEach(c => {
            const card = document.getElementById(`card-${c.id}`)
                      || document.getElementById(`preset-card-${c.presetIdx}`);
            card?.classList.add('needs-unit');
        });
        return;
    }

    let metaHeaders, metaValues;
    if (mode === 'cyano' || mode === 'plankton') {
        metaHeaders = ['Name','Date','Time','Location','Lat','Lon','Vol sample (ml)','Squares counted','Depth (m)','# Tows','Net diam (m)','Vol slide (ml)','Count threshold','Total counted','Notes'];
        metaValues  = [meta.name, meta.date, meta.time, meta.location, meta.lat, meta.lon,
                       meta.volSample, meta.squares, meta.depth, meta.tows, meta.netDiam,
                       meta.volSlide, meta.threshold || '(none)', total, meta.notes];
    } else {
        metaHeaders = ['Name','Date','Time','Location','Lat','Lon','Area sampled (m²)','Count threshold','Total counted','Notes'];
        metaValues  = [meta.name, meta.date, meta.time, meta.location, meta.lat, meta.lon,
                       meta.area, meta.threshold || '(none)', total, meta.notes];
    }

    const densityCol = PAGE_CONFIG?.densityLabel || 'Individuals/L';
    // 'Group' and 'Counting unit' are what the Food Web Dashboard reads, so a count
    // exported here can be loaded there without editing.
    const taxaHeaders = ['Taxon name','Group','Counting unit','Count','Individuals/slide',
                         densityCol, 'Relative abundance (%)'];

    const group = (window.PAGE_CONFIG?.mode === 'cyano') ? 'Phytoplankton' : '';
    const taxaRows = counters.map(c => {
        const slide   = document.getElementById(`tslide-${c.id}`)?.textContent   || '—';
        const density = document.getElementById(`tdensity-${c.id}`)?.textContent || '—';
        const rel     = document.getElementById(`trel-${c.id}`)?.textContent     || '0';
        return [`"${c.name}"`, `"${group}"`, `"${c.unit || ''}"`, c.count, slide, density, rel].join(',');
    });

    const csv = [
        metaHeaders.map(h => `"${h}"`).join(','),
        metaValues.map(v => `"${String(v).replace(/"/g,'""')}"`).join(','),
        '',
        taxaHeaders.map(h => `"${h}"`).join(','),
        ...taxaRows
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${meta.name || 'Count'}_${meta.date || 'nodate'}.csv`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
