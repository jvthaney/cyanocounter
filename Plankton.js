/*
 * PlanktonCounter — Plankton.js
 * Refactored from hardcoded 16-counter approach to fully dynamic, data-driven architecture.
 * Supports unlimited taxa counters and optional threshold-based counting (e.g. stop at 300).
 */

// ─── Counter state ────────────────────────────────────────────────────────────
// Each entry: { id, name, count }
let counters = [];
let nextId = 1;

// Colour palette cycling for counter cards
const COLOURS = ['', 'pink', 'blue', 'orange', 'teal', 'grey', 'rose', 'wine', 'khaki'];

// ─── Metadata state ───────────────────────────────────────────────────────────
let meta = {
    name: '', date: '', time: '', location: '',
    lat: '', lon: '', volSample: '', depth: '',
    netDiam: '', rowsCounted: '', volSlide: '',
    threshold: '', notes: ''
};

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const counterGrid   = document.getElementById('counter-grid');
const taxaBody      = document.getElementById('taxa-preview-body');
const thresholdWrap = document.getElementById('threshold-bar-wrap');
const thresholdBar  = document.getElementById('threshold-bar');
const thresholdLbl  = document.getElementById('threshold-label');
const thresholdDisplay  = document.getElementById('threshold-display');
const totalDisplay      = document.getElementById('total-counted-display');
const thresholdAlert    = document.getElementById('threshold-reached-alert');
const outTotal          = document.getElementById('out_total_counted');
const outThreshold      = document.getElementById('out_threshold');

// ─── Submit Info ──────────────────────────────────────────────────────────────
function submitInfo() {
    meta.name        = document.getElementById('text1').value;
    meta.date        = document.getElementById('text2').value;
    meta.time        = document.getElementById('text3').value;
    meta.location    = document.getElementById('text4').value;
    meta.lat         = document.getElementById('text5').value;
    meta.lon         = document.getElementById('text6').value;
    meta.volSample   = document.getElementById('text7').value;
    meta.depth       = document.getElementById('text8').value;
    meta.netDiam     = document.getElementById('text9').value;
    meta.rowsCounted = document.getElementById('text10').value;
    meta.volSlide    = document.getElementById('text11').value;
    meta.threshold   = document.getElementById('text_threshold').value;
    meta.notes       = document.getElementById('text12').value;

    // Update metadata preview row
    document.getElementById('out1').textContent  = meta.name;
    document.getElementById('out2').textContent  = meta.date;
    document.getElementById('out3').textContent  = meta.time;
    document.getElementById('out4').textContent  = meta.location;
    document.getElementById('out5').textContent  = meta.lat;
    document.getElementById('out6').textContent  = meta.lon;
    document.getElementById('out7').textContent  = meta.volSample;
    document.getElementById('out8').textContent  = meta.depth;
    document.getElementById('out9').textContent  = meta.netDiam;
    document.getElementById('out10').textContent = meta.rowsCounted;
    document.getElementById('out11').textContent = meta.volSlide;
    outThreshold.textContent = meta.threshold || '(full slide)';
    document.getElementById('out12').textContent = meta.notes;

    document.getElementById('outalert').textContent = 'Info submitted ✓';

    // Show/hide threshold bar
    const thresh = parseFloat(meta.threshold);
    if (!isNaN(thresh) && thresh > 0) {
        thresholdWrap.style.display = 'block';
        thresholdDisplay.textContent = thresh;
    } else {
        thresholdWrap.style.display = 'none';
    }

    updateAll();
}

// ─── Add a new counter card ────────────────────────────────────────────────────
function addCounter() {
    const id    = nextId++;
    const colour = COLOURS[(counters.length) % COLOURS.length];
    counters.push({ id, name: '', count: 0 });

    // Build card HTML
    const col = document.createElement('div');
    col.className = 'counter-col';
    col.id = `col-${id}`;

    col.innerHTML = `
        <div class="counter ${colour}" id="card-${id}">
            <button class="btn-delete-counter" onclick="deleteCounter(${id})" title="Remove this taxon">&#10005;</button>
            <div class="counter-icon"><i class="fa fa-leaf"></i></div>
            <button class="btn add mx-10 mt-10" onclick="increment(${id})">+</button>
            <button class="btn add mx-10 mt-10" onclick="decrement(${id})">−</button>
            <input type="text"
                   class="form-control transparent-input countername"
                   id="name-${id}"
                   placeholder="Enter taxon name"
                   oninput="updateName(${id})">
            <span class="counter-value" id="count-${id}">0</span>
        </div>
    `;
    counterGrid.appendChild(col);

    // Add row to taxa preview table
    const tr = document.createElement('tr');
    tr.id = `row-${id}`;
    tr.innerHTML = `
        <td id="tname-${id}"></td>
        <td id="tcount-${id}">0</td>
        <td id="tslide-${id}">0</td>
        <td id="tperliter-${id}">0</td>
        <td id="trel-${id}">0</td>
    `;
    taxaBody.appendChild(tr);
}

// ─── Delete a counter ─────────────────────────────────────────────────────────
function deleteCounter(id) {
    if (!confirm('Remove this taxon counter?')) return;
    counters = counters.filter(c => c.id !== id);
    const col = document.getElementById(`col-${id}`);
    if (col) col.remove();
    const row = document.getElementById(`row-${id}`);
    if (row) row.remove();
    updateAll();
}

// ─── Increment / Decrement ────────────────────────────────────────────────────
function increment(id) {
    const c = counters.find(c => c.id === id);
    if (!c) return;
    c.count++;
    document.getElementById(`count-${id}`).textContent = c.count;
    document.getElementById(`tcount-${id}`).textContent = c.count;
    updateAll();
}

function decrement(id) {
    const c = counters.find(c => c.id === id);
    if (!c || c.count === 0) return;
    c.count--;
    document.getElementById(`count-${id}`).textContent = c.count;
    document.getElementById(`tcount-${id}`).textContent = c.count;
    updateAll();
}

// ─── Update taxon name ─────────────────────────────────────────────────────────
function updateName(id) {
    const c = counters.find(c => c.id === id);
    if (!c) return;
    c.name = document.getElementById(`name-${id}`).value;
    const nameCell = document.getElementById(`tname-${id}`);
    if (nameCell) nameCell.textContent = c.name;
}

// ─── Core calculation & UI update ─────────────────────────────────────────────
function updateAll() {
    const totalCounted = counters.reduce((sum, c) => sum + c.count, 0);

    // Update total in metadata preview
    if (outTotal) outTotal.textContent = totalCounted;

    // Threshold progress bar
    const thresh = parseFloat(meta.threshold);
    if (!isNaN(thresh) && thresh > 0 && thresholdWrap.style.display !== 'none') {
        const pct = Math.min((totalCounted / thresh) * 100, 100);
        thresholdBar.style.width = pct + '%';
        if (totalCounted >= thresh) {
            thresholdBar.classList.add('done');
            thresholdAlert.style.display = 'block';
        } else {
            thresholdBar.classList.remove('done');
            thresholdAlert.style.display = 'none';
        }
        if (totalDisplay) totalDisplay.textContent = totalCounted;
    }

    // Parse parameters for density calculations
    const rowsCounted  = parseFloat(meta.rowsCounted);
    const totalRows    = 20;
    const percSlide    = (!isNaN(rowsCounted) && rowsCounted > 0) ? rowsCounted / totalRows : NaN;

    const volSampleML  = parseFloat(meta.volSample);
    const volSlideML   = parseFloat(meta.volSlide);
    const depth        = parseFloat(meta.depth);
    const diameter     = parseFloat(meta.netDiam);

    // Volume of lake water sampled (litres): cylinder V = π r² h
    const r            = diameter / 2;
    const lakeWaterL   = (!isNaN(diameter) && !isNaN(depth))
                         ? Math.PI * r * r * depth * 1000 : NaN;

    // Proportion of sample volume that went onto the slide
    const propOnSlide  = (!isNaN(volSampleML) && volSampleML > 0 && !isNaN(volSlideML) && volSlideML > 0)
                         ? volSlideML / volSampleML : NaN;

    counters.forEach(c => {
        // Colonies per whole slide (scale up from rows actually counted)
        const coloniesPerSlide = (!isNaN(percSlide) && percSlide > 0) ? c.count / percSlide : NaN;

        // Colonies per litre of lake water
        // coloniesPerSlide / propOnSlide = colonies in whole sample
        // colonies in whole sample / lakeWaterL = colonies per litre
        let coloniesPerLitre = NaN;
        if (!isNaN(propOnSlide) && propOnSlide > 0 && lakeWaterL > 0) {
            coloniesPerLitre = (coloniesPerSlide / propOnSlide) / lakeWaterL;
        }

        // Relative abundance
        const relAbund = totalCounted > 0 ? (c.count / totalCounted) * 100 : 0;

        // Update table cells
        const fmt = v => isNaN(v) ? '—' : parseFloat(v.toFixed(3)).toString();
        document.getElementById(`tslide-${c.id}`).textContent    = fmt(coloniesPerSlide);
        document.getElementById(`tperliter-${c.id}`).textContent = fmt(coloniesPerLitre);
        document.getElementById(`trel-${c.id}`).textContent      = parseFloat(relAbund.toFixed(1));
    });
}

// ─── Reset all counters ────────────────────────────────────────────────────────
function resetCounters() {
    if (!confirm('Reset all counters to zero?')) return;
    counters.forEach(c => {
        c.count = 0;
        const el = document.getElementById(`count-${c.id}`);
        if (el) el.textContent = 0;
        const tc = document.getElementById(`tcount-${c.id}`);
        if (tc) tc.textContent = 0;
    });
    updateAll();
}

// ─── Export to CSV ────────────────────────────────────────────────────────────
function exportData() {
    const totalCounted = counters.reduce((sum, c) => sum + c.count, 0);

    // Header rows matching the preview tables
    const metaHeaders = [
        'Name','Date','Time','Location','Lat','Lon',
        'Vol sample (ml)','Depth (m)','Net diam (m)',
        'Rows counted','Vol slide (ml)','Count threshold','Total counted','Notes'
    ];
    const metaValues = [
        meta.name, meta.date, meta.time, meta.location,
        meta.lat, meta.lon, meta.volSample, meta.depth,
        meta.netDiam, meta.rowsCounted, meta.volSlide,
        meta.threshold || '(full slide)', totalCounted, meta.notes
    ].map(v => `"${String(v).replace(/"/g, '""')}"`);

    const taxaHeaders = [
        'Taxon','Count (colonies/filaments)',
        'Colonies/slide (estimated)','Colonies/L','Relative abundance (%)'
    ];

    const rowsCounted = parseFloat(meta.rowsCounted);
    const percSlide   = (!isNaN(rowsCounted) && rowsCounted > 0) ? rowsCounted / 20 : NaN;
    const volSampleML = parseFloat(meta.volSample);
    const volSlideML  = parseFloat(meta.volSlide);
    const depth       = parseFloat(meta.depth);
    const diameter    = parseFloat(meta.netDiam);
    const r           = diameter / 2;
    const lakeWaterL  = (!isNaN(diameter) && !isNaN(depth)) ? Math.PI * r * r * depth * 1000 : NaN;
    const propOnSlide = (!isNaN(volSampleML) && volSampleML > 0 && !isNaN(volSlideML) && volSlideML > 0)
                        ? volSlideML / volSampleML : NaN;

    const taxaRows = counters.map(c => {
        const coloniesPerSlide = (!isNaN(percSlide) && percSlide > 0) ? c.count / percSlide : NaN;
        let coloniesPerLitre = NaN;
        if (!isNaN(propOnSlide) && propOnSlide > 0 && lakeWaterL > 0) {
            coloniesPerLitre = (coloniesPerSlide / propOnSlide) / lakeWaterL;
        }
        const relAbund = totalCounted > 0 ? (c.count / totalCounted) * 100 : 0;
        const fmt = v => isNaN(v) ? '' : parseFloat(v.toFixed(3));
        return [
            `"${c.name.replace(/"/g, '""')}"`,
            c.count,
            fmt(coloniesPerSlide),
            fmt(coloniesPerLitre),
            parseFloat(relAbund.toFixed(1))
        ].join(',');
    });

    const csv = [
        metaHeaders.join(','),
        metaValues.join(','),
        '',
        taxaHeaders.join(','),
        ...taxaRows
    ].join('\n');

    const blob     = new Blob([csv], { type: 'text/csv' });
    const url      = URL.createObjectURL(blob);
    const link     = document.createElement('a');
    const filename = `${meta.name || 'PlanktonCount'}_${meta.date || 'nodate'}.csv`;
    link.href      = url;
    link.download  = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
