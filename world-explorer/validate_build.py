from pathlib import Path
import re, json, subprocess, sys
root=Path('/mnt/data/world-explorer-max-build')
html=(root/'index.html').read_text(encoding='utf-8')
app=(root/'app.js').read_text(encoding='utf-8')
css=(root/'styles.css').read_text(encoding='utf-8')
ids=set(re.findall(r'id="([^"]+)"',html))
refs=set(x for x in re.findall(r"\$\('#([^']+)'\)",app) if re.fullmatch(r'[A-Za-z][A-Za-z0-9_-]*',x))
missing=sorted(refs-ids)
print('HTML IDs',len(ids),'JS refs',len(refs),'missing',missing)
print('CSS braces',css.count('{'),css.count('}'))
assert not missing, missing
assert css.count('{')==css.count('}')
# Parse JS module payloads without executing imports.
text=(root/'data/countries-195.js').read_text(encoding='utf-8')
prefix='export const countries195 = '
start=text.index(prefix)+len(prefix)
end=text.index(';\nexport const countryById')
countries=json.loads(text[start:end])
assert len(countries)==195
assert len({c['id'] for c in countries})==195
assert all(set(c['names'])=={'ko','zh','ja','en'} for c in countries)
assert all(c['latlng'] and len(c['latlng'])==2 for c in countries)
geo_text=(root/'data/world-lowres.js').read_text(encoding='utf-8')
gprefix='export const worldGeoJSON = '
gstart=geo_text.index(gprefix)+len(gprefix)
gend=geo_text.rfind(';')
geo=json.loads(geo_text[gstart:gend])
assert geo['type']=='FeatureCollection' and len(geo['features'])==177
geo_ids={f['properties']['id'] for f in geo['features']}
covered=sum(1 for c in countries if c['id'] in geo_ids)
markers=195-covered
print('countries',len(countries),'geometry covered',covered,'marker fallback',markers,'features',len(geo['features']))
# Basic semantic checks
for key in ['follow','explore','overview']:
    assert key in (root/'camera-controller.js').read_text(encoding='utf-8')
for mode in ['find-country','highlight-name','shape-name','flag-map']:
    assert mode in app
print('VALIDATION_OK')
