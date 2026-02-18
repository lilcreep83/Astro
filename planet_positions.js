// This file is shared between Node.js (CLI) and browser (HTML page).
// In Node you need `npm install astronomy-engine`.

(function(root) {
    // root is globalThis (window in browser, global in Node)
    const isNode = typeof module !== 'undefined' && module.exports;
    const Astronomy = isNode
        ? require('astronomy-engine')
        : root.Astronomy;

    function getPlanetPositions(date = new Date()) {
        const bodies = [
            'Sun',
            'Moon',
            'Mercury',
            'Venus',
            'Mars',
            'Jupiter',
            'Saturn',
            'Uranus',
            'Neptune',
            'Pluto'
        ];

        // create a default observer on Earth's surface (equator, prime meridian)
        const observer = new Astronomy.Observer(0, 0, 0);

        const results = {};
        bodies.forEach(body => {
            const eq = Astronomy.Equator(body, date, observer, true, true);
            // eq.dist already contains distance in AU
            const dist = eq.dist;
            results[body] = {
                ra_hours: eq.ra,
                dec_degrees: eq.dec,
                distance_au: dist
            };
        });
        return results;
    }

    function updateTable() {
        console.log('updateTable called, Astronomy:', Astronomy);
        if (!Astronomy) {
            console.error('Astronomy engine not available');
            return;
        }
        const positions = getPlanetPositions();
        console.log('computed positions', positions);
        const tbody = document.querySelector('#positions tbody');
        if (!tbody) {
            console.error('no tbody element');
            return;
        }
        tbody.innerHTML = '';
        for (const [name, pos] of Object.entries(positions)) {
            if (!pos) continue;
            const ra = typeof pos.ra_hours === 'number' ? pos.ra_hours.toFixed(6) : pos.ra_hours;
            const dec = typeof pos.dec_degrees === 'number' ? pos.dec_degrees.toFixed(6) : pos.dec_degrees;
            const dist = typeof pos.distance_au === 'number' ? pos.distance_au.toFixed(6) : pos.distance_au;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${name}</td>
                <td>${ra}</td>
                <td>${dec}</td>
                <td>${dist}</td>
            `;
            tbody.appendChild(tr);
        }
    }

    // export functions
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { getPlanetPositions };
    }

    // if running in browser, attach helper to window and add event listener
    if (root.document) {
        root.updatePlanetTable = updateTable;
    }
})(typeof global !== 'undefined' ? global : window);
