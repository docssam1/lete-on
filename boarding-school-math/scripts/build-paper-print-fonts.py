"""Build fixed-weight worksheet headers from the repository's OFL font.
Build-time only: pip install fonttools brotli. No runtime network/font API.
The derivative uses a new family name, respecting the Reserved Font Names.
"""
from pathlib import Path
from io import BytesIO
import subprocess
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

project = Path(__file__).resolve().parents[1]
repo = project.parent
source = 'fields-classic/question-bank/assets/fonts/pretendard-var.woff2'
raw = subprocess.check_output(['git', 'show', 'HEAD:' + source], cwd=repo)
output = project / 'shared' / 'fonts'
output.mkdir(exist_ok=True)
for weight, style in [(400, 'Regular'), (700, 'Bold')]:
    original = TTFont(BytesIO(raw))
    font = instantiateVariableFont(original, {'wght': weight}, inplace=False)
    assert 'fvar' not in font and 'gvar' not in font
    for record in font['name'].names:
        values = {1: 'GFIELD Print Sans', 2: style,
                  3: 'GFIELDPrintSans-' + style + '-20261126',
                  4: 'GFIELD Print Sans ' + style,
                  6: 'GFIELDPrintSans-' + style,
                  16: 'GFIELD Print Sans', 17: style,
                  21: 'GFIELD Print Sans', 22: style,
                  25: 'GFIELDPrintSans'}
        if record.nameID in values:
            record.string = values[record.nameID].encode(record.getEncoding())
    font.flavor = 'woff2'
    font.save(output / ('gfield-print-sans-' + str(weight) + '.woff2'))
license_bytes = subprocess.check_output(['git', 'show', 'HEAD:fields-classic/question-bank/assets/fonts/OFL-Pretendard.txt'], cwd=repo)
(output / 'OFL.txt').write_bytes(license_bytes)
print('Built fixed 400/700 worksheet header faces with renamed derivative family.')
