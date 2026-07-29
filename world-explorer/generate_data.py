import json, math, re
from pathlib import Path
import pycountry
from babel import Locale
from countryinfo import CountryInfo
import geopandas as gpd
from shapely.geometry import mapping

OUT=Path('/mnt/data/world-explorer-max-build/data')
CODES='AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CA CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HU IS IN ID IR IQ IE IL IT JM JP JO KZ KE KI KP KR KW KG LA LV LB LS LR LY LI LT LU MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG MK NO OM PK PW PA PG PY PE PH PL PT QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA SS ES LK SD SR SE CH SY TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE GB US UY UZ VU VA VE VN YE ZM ZW PS'.split()
assert len(CODES)==195

# Build CountryInfo index by ISO alpha2.
all_info=CountryInfo().all()
info_by_code={}
for _, d in all_info.items():
    iso=(d or {}).get('ISO') or {}
    a2=iso.get('alpha2')
    if a2 and a2 not in info_by_code:
        info_by_code[a2]=d

manual={
 'ME':{'capital':'Podgorica','latlng':[42.5,19.3],'capital_latlng':[42.4304,19.2594],'population':620000,'area':13812,'region':'Europe','subregion':'Southern Europe','borders':['AL','BA','HR','RS']},
 'MM':{'capital':'Naypyidaw','latlng':[22,98],'capital_latlng':[19.7633,96.0785],'population':54000000,'area':676578,'region':'Asia','subregion':'South-Eastern Asia','borders':['BD','CN','IN','LA','TH']},
 'VA':{'capital':'Vatican City','latlng':[41.9029,12.4534],'capital_latlng':[41.9029,12.4534],'population':825,'area':0.49,'region':'Europe','subregion':'Southern Europe','borders':['IT']},
 'PS':{'capital':'Ramallah','latlng':[31.95,35.23],'capital_latlng':[31.90,35.20],'population':5200000,'area':6020,'region':'Asia','subregion':'Western Asia','borders':['IL','EG','JO']},
 'AD':{'capital':'Andorra la Vella','latlng':[42.5,1.5],'capital_latlng':[42.5063,1.5218],'population':79000,'area':468,'region':'Europe','subregion':'Southern Europe','borders':['FR','ES']},
 'MC':{'capital':'Monaco','latlng':[43.7333,7.4],'capital_latlng':[43.7384,7.4246],'population':39000,'area':2.02,'region':'Europe','subregion':'Western Europe','borders':['FR']},
 'SM':{'capital':'San Marino','latlng':[43.9333,12.45],'capital_latlng':[43.9424,12.4578],'population':34000,'area':61,'region':'Europe','subregion':'Southern Europe','borders':['IT']},
 'LI':{'capital':'Vaduz','latlng':[47.2667,9.5333],'capital_latlng':[47.1410,9.5209],'population':39000,'area':160,'region':'Europe','subregion':'Western Europe','borders':['AT','CH']},
 'NR':{'capital':'Yaren','latlng':[-0.5333,166.9167],'capital_latlng':[-0.5477,166.9209],'population':11000,'area':21,'region':'Oceania','subregion':'Micronesia','borders':[]},
 'TV':{'capital':'Funafuti','latlng':[-8,178],'capital_latlng':[-8.5211,179.1962],'population':12000,'area':26,'region':'Oceania','subregion':'Polynesia','borders':[]},
 'MH':{'capital':'Majuro','latlng':[9,168],'capital_latlng':[7.1164,171.1858],'population':42000,'area':181,'region':'Oceania','subregion':'Micronesia','borders':[]},
 'FM':{'capital':'Palikir','latlng':[6.9167,158.25],'capital_latlng':[6.9248,158.1611],'population':115000,'area':702,'region':'Oceania','subregion':'Micronesia','borders':[]},
 'PW':{'capital':'Ngerulmud','latlng':[7.5,134.5],'capital_latlng':[7.5004,134.6241],'population':18000,'area':459,'region':'Oceania','subregion':'Micronesia','borders':[]},
 'KI':{'capital':'South Tarawa','latlng':[1.4167,173],'capital_latlng':[1.4518,173.0320],'population':121000,'area':811,'region':'Oceania','subregion':'Micronesia','borders':[]},
 'SG':{'capital':'Singapore','latlng':[1.3667,103.8],'capital_latlng':[1.3521,103.8198],'population':5900000,'area':734,'region':'Asia','subregion':'South-Eastern Asia','borders':[]},
 'BH':{'capital':'Manama','latlng':[26,50.55],'capital_latlng':[26.2235,50.5876],'population':1500000,'area':765,'region':'Asia','subregion':'Western Asia','borders':[]},
 'MT':{'capital':'Valletta','latlng':[35.8333,14.5833],'capital_latlng':[35.8989,14.5146],'population':520000,'area':316,'region':'Europe','subregion':'Southern Europe','borders':[]},
 'MV':{'capital':'Malé','latlng':[3.25,73],'capital_latlng':[4.1755,73.5093],'population':540000,'area':300,'region':'Asia','subregion':'Southern Asia','borders':[]},
 'BB':{'capital':'Bridgetown','latlng':[13.1667,-59.5333],'capital_latlng':[13.0975,-59.6167],'population':281000,'area':430,'region':'Americas','subregion':'Caribbean','borders':[]},
 'GD':{'capital':"St. George's",'latlng':[12.1167,-61.6667],'capital_latlng':[12.0561,-61.7488],'population':113000,'area':344,'region':'Americas','subregion':'Caribbean','borders':[]},
 'LC':{'capital':'Castries','latlng':[13.8833,-61.1333],'capital_latlng':[14.0101,-60.9875],'population':184000,'area':616,'region':'Americas','subregion':'Caribbean','borders':[]},
 'VC':{'capital':'Kingstown','latlng':[13.25,-61.2],'capital_latlng':[13.1600,-61.2248],'population':111000,'area':389,'region':'Americas','subregion':'Caribbean','borders':[]},
 'KN':{'capital':'Basseterre','latlng':[17.3333,-62.75],'capital_latlng':[17.3026,-62.7177],'population':53000,'area':261,'region':'Americas','subregion':'Caribbean','borders':[]},
 'AG':{'capital':"Saint John's",'latlng':[17.05,-61.8],'capital_latlng':[17.1274,-61.8468],'population':98000,'area':442,'region':'Americas','subregion':'Caribbean','borders':[]},
 'DM':{'capital':'Roseau','latlng':[15.4167,-61.3333],'capital_latlng':[15.3010,-61.3881],'population':72000,'area':751,'region':'Americas','subregion':'Caribbean','borders':[]},
 'ST':{'capital':'São Tomé','latlng':[1,7],'capital_latlng':[0.3365,6.7273],'population':220000,'area':964,'region':'Africa','subregion':'Middle Africa','borders':[]},
 'SC':{'capital':'Victoria','latlng':[-4.5833,55.6667],'capital_latlng':[-4.6191,55.4513],'population':99000,'area':452,'region':'Africa','subregion':'Eastern Africa','borders':[]},
 'MU':{'capital':'Port Louis','latlng':[-20.2833,57.55],'capital_latlng':[-20.1609,57.5012],'population':1270000,'area':2040,'region':'Africa','subregion':'Eastern Africa','borders':[]},
 'CV':{'capital':'Praia','latlng':[16,-24],'capital_latlng':[14.9331,-23.5133],'population':560000,'area':4033,'region':'Africa','subregion':'Western Africa','borders':[]},
 'KM':{'capital':'Moroni','latlng':[-12.1667,44.25],'capital_latlng':[-11.7172,43.2473],'population':870000,'area':1862,'region':'Africa','subregion':'Eastern Africa','borders':[]},
}

locales={k:Locale.parse(v) for k,v in {'ko':'ko','zh':'zh','ja':'ja','en':'en'}.items()}
continent_map={'Africa':'africa','Asia':'asia','Europe':'europe','Americas':'americas','Oceania':'oceania','':'other'}
# For app tabs split Americas based on latitude/subregion.
def continent_id(region,subregion,lat):
    if region=='Americas':
        if 'South America' in subregion:
            return 'south-america'
        return 'north-america'
    return continent_map.get(region,'other')

def pop_band(pop):
    if pop < 5_000_000:return 'under-5m'
    if pop < 20_000_000:return '5m-20m'
    if pop < 50_000_000:return '20m-50m'
    if pop < 100_000_000:return '50m-100m'
    if pop < 300_000_000:return '100m-300m'
    if pop < 1_000_000_000:return '300m-1b'
    return 'over-1b'

def area_band(area):
    if area < 1_000:return 'micro'
    if area < 10_000:return 'small'
    if area < 100_000:return 'medium'
    if area < 1_000_000:return 'large'
    return 'very-large'

def flag(code):
    return ''.join(chr(127397+ord(c)) for c in code)

countries=[]
missing_info=[]
for code in CODES:
    d=dict(info_by_code.get(code) or {})
    d.update(manual.get(code,{}))
    pc=pycountry.countries.get(alpha_2=code)
    names={lang:loc.territories.get(code, pc.name if pc else code) for lang,loc in locales.items()}
    latlng=d.get('latlng') or d.get('capital_latlng') or [0,0]
    if len(latlng)<2: latlng=[0,0]
    lat,lon=float(latlng[0]),float(latlng[1])
    cap=d.get('capital') or ''
    capll=d.get('capital_latlng') or latlng
    if len(capll)<2: capll=latlng
    pop=int(d.get('population') or 0)
    area=float(d.get('area') or 0)
    region=d.get('region') or ''
    subregion=d.get('subregion') or ''
    cont=continent_id(region,subregion,lat)
    countries.append({
        'id':code,'numericId':getattr(pc,'numeric',None),'alpha3':getattr(pc,'alpha_3',code),
        'names':names,'flag':flag(code),'capital':cap,
        'latlng':[lat,lon],'capitalLatlng':[float(capll[0]),float(capll[1])],
        'population':pop,'populationBand':pop_band(pop),'area':area,'areaBand':area_band(area),
        'region':region,'subregion':subregion,'continent':cont,
        'borders':[b for b in (d.get('borders') or []) if b in CODES]
    })
    if not d: missing_info.append(code)

# Natural Earth geometry, simplified and converted to ISO2.
shp='/opt/pyvenv/lib/python3.13/site-packages/pyogrio/tests/fixtures/naturalearth_lowres/naturalearth_lowres.shp'
gdf=gpd.read_file(shp).to_crs('EPSG:4326')
features=[]
for _,row in gdf.iterrows():
    iso3=row['iso_a3']; name=row['name']
    iso2=None
    if iso3 and iso3!='-99':
        pc=pycountry.countries.get(alpha_3=iso3)
        if pc: iso2=pc.alpha_2
    if name=='Norway': iso2='NO'
    elif name=='France': iso2='FR'
    elif name=='N. Cyprus': iso2='XNC'
    elif name=='Somaliland': iso2='XSOM'
    elif name=='Kosovo': iso2='XK'
    geom=row.geometry.simplify(0.04,preserve_topology=True)
    features.append({'type':'Feature','properties':{'id':iso2 or iso3,'name':name,'continent':row['continent']},'geometry':mapping(geom)})
geo={'type':'FeatureCollection','features':features}

# Write JS modules so file:// and static hosting both work without fetch.
with open(OUT/'countries-195.js','w',encoding='utf-8') as f:
    f.write('// Generated from ISO/CLDR and bundled CountryInfo data.\n')
    f.write('export const COUNTRY_TOTAL = 195;\n')
    f.write('export const countries195 = ')
    json.dump(countries,f,ensure_ascii=False,separators=(',',':'))
    f.write(';\nexport const countryById = new Map(countries195.map(c=>[c.id,c]));\n')
with open(OUT/'world-lowres.js','w',encoding='utf-8') as f:
    f.write('// Natural Earth low resolution geometry bundled for offline map rendering.\n')
    f.write('export const worldGeoJSON = ')
    json.dump(geo,f,ensure_ascii=False,separators=(',',':'))
    f.write(';\n')
print('countries',len(countries),'features',len(features),'missing info',missing_info)
