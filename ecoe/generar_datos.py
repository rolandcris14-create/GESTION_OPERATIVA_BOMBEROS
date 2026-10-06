"""Genera datos.js a partir de las rúbricas y del banco de casos (Markdown).

Uso: python3 generar_datos.py RUBRICAS.md BANCO.md > datos.js
"""
import json, re, sys

rub = open(sys.argv[1], encoding='utf-8').read()
banco = open(sys.argv[2], encoding='utf-8').read()

def filas(tabla):
    out = []
    for l in tabla.splitlines():
        c = [x.strip() for x in l.strip().strip('|').split('|')]
        if len(c) >= 3 and c[0] not in ('N°', '---'):
            out.append({'n': c[0], 't': c[1], 'c': c[2] == 'Sí'})
    return out

bc = filas(re.search(r'\| B1 .*?\n(?=\n)', rub, re.S).group(0))

rubricas = {}
for m in re.finditer(r'^### ([A-Z]\d{4}) (.+?)\n(.*?)(?=^##|\Z)', rub, re.S | re.M):
    rubricas[m.group(1)] = {'tema': m.group(2).strip(), 'crit': filas(m.group(3))}

casos = []
for m in re.finditer(r'^#### (([A-Z]\d{4}) .*?«(.+?)»)\n(.*?)(?=^#### |^## |\Z)', banco, re.S | re.M):
    code, titulo, guia = m.group(2), m.group(3), (m.group(0)).strip()
    campo = lambda k: re.search(r'^\| %s \| (.+?) \|$' % k, guia, re.M).group(1)
    tiempo = campo('Tiempo')
    casos.append({
        'code': code, 'tema': rubricas[code]['tema'], 'titulo': titulo,
        'nivel': campo('Nivel'), 'tiempo': tiempo, 'min': int(re.match(r'\d+', tiempo).group(0)),
        'despacho': re.search(r'\*\*Despacho \(lo lee el evaluador\):\*\* (.+)', guia).group(1).strip(),
        'guia': guia, 'crit': rubricas[code]['crit'],
    })

assert len(casos) == 27 and len(bc) == 6, (len(casos), len(bc))
assert set(c['code'] for c in casos) == set(rubricas)
sys.stdout.write('/* Generado por generar_datos.py: no editar a mano. */\nwindow.ECOE = ' +
                 json.dumps({'bc': bc, 'casos': casos}, ensure_ascii=False) + ';\n')
