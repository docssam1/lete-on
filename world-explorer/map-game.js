import * as d3 from './vendor/d3.esm.js';

const VIEWS = {
  all: { center: [0, 8], scale: 155 },
  asia: { center: [88, 28], scale: 310 },
  europe: { center: [16, 51], scale: 620 },
  africa: { center: [20, 2], scale: 330 },
  'north-america': { center: [-102, 42], scale: 300 },
  'south-america': { center: [-60, -18], scale: 340 },
  oceania: { center: [145, -24], scale: 390 }
};

export class WorldMapGame {
  constructor({ svg, countries, geojson, onCountryClick }) {
    this.svgEl = svg;
    this.svg = d3.select(svg);
    this.countries = countries;
    this.countryById = new Map(countries.map(c => [c.id, c]));
    this.geojson = geojson;
    this.onCountryClick = onCountryClick || (() => {});
    this.solved = new Set();
    this.targetId = null;
    this.selectedId = null;
    this.wrongId = null;
    this.challengeType = 'find-country';
    this.projection = d3.geoNaturalEarth1().fitExtent([[18, 18], [982, 502]], geojson);
    this.path = d3.geoPath(this.projection);
    this.root = this.svg.append('g').attr('class', 'map-root');
    this.root.append('path').datum(d3.geoGraticule10()).attr('class', 'map-graticule').attr('d', this.path);
    this.featureLayer = this.root.append('g').attr('class', 'country-layer');
    this.markerLayer = this.root.append('g').attr('class', 'microstate-layer');
    this.features = new Map();
    for (const feature of geojson.features) {
      const id = feature.properties.id;
      if (id && this.countryById.has(id)) this.features.set(id, feature);
    }
    this.renderFeatures();
    this.renderMicrostates();
    this.zoom = d3.zoom().scaleExtent([1, 10]).translateExtent([[-450, -320], [1450, 840]]).on('zoom', e => this.root.attr('transform', e.transform));
    this.svg.call(this.zoom).on('dblclick.zoom', null);
  }

  renderFeatures() {
    this.featureLayer.selectAll('path').data(this.geojson.features).join('path')
      .attr('d', this.path)
      .attr('data-country', d => d.properties.id || '')
      .attr('class', d => this.classFor(d.properties.id))
      .on('pointerenter', (e, d) => this.showTooltip(e, d.properties.id))
      .on('pointermove', (e, d) => this.showTooltip(e, d.properties.id))
      .on('pointerleave', () => this.hideTooltip())
      .on('click', (e, d) => {
        e.stopPropagation();
        const id = d.properties.id;
        if (this.countryById.has(id)) this.onCountryClick(id);
      });
  }

  renderMicrostates() {
    const missing = this.countries.filter(c => !this.features.has(c.id) && Number.isFinite(c.latlng?.[0]) && Number.isFinite(c.latlng?.[1]));
    const points = missing.map(c => ({ ...c, point: this.projection([c.latlng[1], c.latlng[0]]) })).filter(d => d.point);
    const g = this.markerLayer.selectAll('g.micro-country').data(points, d => d.id).join(enter => {
      const node = enter.append('g').attr('class', 'micro-country');
      node.append('circle').attr('r', 4.2);
      node.append('circle').attr('class', 'micro-hit').attr('r', 12);
      return node;
    });
    g.attr('transform', d => `translate(${d.point[0]},${d.point[1]})`).attr('data-country', d => d.id)
      .on('pointerenter', (e, d) => this.showTooltip(e, d.id))
      .on('pointermove', (e, d) => this.showTooltip(e, d.id))
      .on('pointerleave', () => this.hideTooltip())
      .on('click', (e, d) => { e.stopPropagation(); this.onCountryClick(d.id); });
  }

  classFor(id) {
    const classes = ['map-country'];
    if (!this.countryById.has(id)) classes.push('neutral');
    if (this.solved.has(id)) classes.push('solved');
    if (id === this.targetId && ['highlight-name', 'shape-name'].includes(this.challengeType)) classes.push('target');
    if (id === this.selectedId) classes.push('selected');
    if (id === this.wrongId) classes.push('wrong');
    return classes.join(' ');
  }

  refreshClasses() {
    this.featureLayer.selectAll('path').attr('class', d => this.classFor(d.properties.id));
    this.markerLayer.selectAll('g.micro-country')
      .classed('solved', d => this.solved.has(d.id))
      .classed('target', d => d.id === this.targetId && ['highlight-name', 'shape-name'].includes(this.challengeType))
      .classed('selected', d => d.id === this.selectedId)
      .classed('wrong', d => d.id === this.wrongId);
  }

  setSolved(ids) { this.solved = new Set(ids || []); this.refreshClasses(); }

  hasShape(id) { return this.features.has(id); }

  setChallenge({ type, targetId }) {
    this.challengeType = type;
    this.targetId = targetId;
    this.selectedId = null;
    this.wrongId = null;
    this.refreshClasses();
    if (type === 'highlight-name') this.focusCountry(targetId, .85);
    else this.focus('all', .45);
  }

  markSelection(id, correct = null) {
    this.selectedId = id;
    this.wrongId = correct === false ? id : null;
    this.refreshClasses();
  }

  clearSelection() { this.selectedId = null; this.wrongId = null; this.refreshClasses(); }

  showTooltip(event, id) {
    const c = this.countryById.get(id);
    if (!c) return;
    const tip = document.querySelector('#mapTooltip');
    if (!tip) return;
    if (['find-country', 'flag-map'].includes(this.challengeType)) { this.hideTooltip(); return; }
    const rect = this.svgEl.getBoundingClientRect();
    tip.hidden = false;
    const flag = document.createElement('img');
    flag.src = `./assets/flags/${c.id.toLowerCase()}.svg`;
    flag.alt = '';
    const name = document.createElement('span');
    name.textContent = c.names[document.documentElement.dataset.lang || 'ko'] || c.names.en;
    tip.replaceChildren(flag, name);
    tip.style.left = `${event.clientX - rect.left}px`;
    tip.style.top = `${event.clientY - rect.top}px`;
  }

  hideTooltip() { const tip = document.querySelector('#mapTooltip'); if (tip) tip.hidden = true; }

  focus(view = 'all', duration = .6) {
    if (view === 'all') {
      this.svg.transition().duration(duration * 1000).call(this.zoom.transform, d3.zoomIdentity);
      return;
    }
    const cfg = VIEWS[view] || VIEWS.all;
    const p = this.projection(cfg.center);
    const k = Math.max(1.25, cfg.scale / 155);
    const transform = d3.zoomIdentity.translate(500 - p[0] * k, 260 - p[1] * k).scale(k);
    this.svg.transition().duration(duration * 1000).call(this.zoom.transform, transform);
  }

  focusCountry(id, duration = .7) {
    const feature = this.features.get(id);
    if (feature) {
      const [[x0, y0], [x1, y1]] = this.path.bounds(feature);
      const dx = Math.max(8, x1 - x0), dy = Math.max(8, y1 - y0);
      const k = Math.min(8, .72 / Math.max(dx / 1000, dy / 520));
      const x = (x0 + x1) / 2, y = (y0 + y1) / 2;
      const transform = d3.zoomIdentity.translate(500 - k * x, 260 - k * y).scale(k);
      this.svg.transition().duration(duration * 1000).call(this.zoom.transform, transform);
    } else {
      const c = this.countryById.get(id);
      if (!c) return;
      const p = this.projection([c.latlng[1], c.latlng[0]]);
      if (!p) return;
      const k = 6;
      this.svg.transition().duration(duration * 1000).call(this.zoom.transform, d3.zoomIdentity.translate(500 - p[0] * k, 260 - p[1] * k).scale(k));
    }
  }

  hint(level, target) {
    if (level <= 1) this.focus(target.continent, .55);
    else if (level === 2) this.focusCountry(target.id, .65);
    else if (level >= 3) {
      this.targetId = target.id;
      this.challengeType = 'highlight-name';
      this.refreshClasses();
    }
  }

  zoomBy(factor) { this.svg.transition().duration(220).call(this.zoom.scaleBy, factor); }
  reset() { this.focus('all', .4); }

  renderShape(targetId, svgElement) {
    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();
    const feature = this.features.get(targetId);
    if (!feature) {
      svg.append('circle').attr('cx', 250).attr('cy', 145).attr('r', 26).attr('class', 'shape-dot');
      svg.append('text').attr('x', 250).attr('y', 205).attr('text-anchor', 'middle').attr('class', 'shape-small-note').text('?');
      return;
    }
    const projection = d3.geoMercator().fitExtent([[32, 24], [468, 266]], feature);
    const path = d3.geoPath(projection);
    svg.append('path').datum(feature).attr('d', path).attr('class', 'country-shape-path');
  }
}
