"""Export owner's original logo curves from Wayne Club.sketch; no tracing/redrawing."""
import json,zipfile,sys
from pathlib import Path
source=Path(sys.argv[1]);out=Path(sys.argv[2]);out.mkdir(parents=True,exist_ok=True)
z=zipfile.ZipFile(source)
page=next(json.loads(z.read(n)) for n in z.namelist() if n.startswith('pages/') and json.loads(z.read(n))['name']=='Symbols')
def pair(s):return [float(v) for v in s.strip('{}').split(',')]
def paths(layer,ox=0,oy=0):
 f=layer['frame'];x=ox+f['x'];y=oy+f['y'];w=f['width'];h=f['height']
 if 'points' not in layer:return ' '.join(paths(c,x,y) for c in layer.get('layers',[]))
 points=layer['points']
 def xy(p,key):
  a,b=pair(p[key]);return f'{x+a*w:.5f},{y+b*h:.5f}'
 d='M'+xy(points[0],'point')
 for a,b in zip(points,points[1:]+([points[0]] if layer.get('isClosed') else [])):
  if a.get('hasCurveFrom') or b.get('hasCurveTo'): d+=' C'+xy(a,'curveFrom' if a.get('hasCurveFrom') else 'point')+' '+xy(b,'curveTo' if b.get('hasCurveTo') else 'point')+' '+xy(b,'point')
  else:d+=' L'+xy(b,'point')
 return d+(' Z' if layer.get('isClosed') else '')
def extract(name):
 sym=next(l for l in page['layers'] if l['name']==name);shape=next(l for l in sym['layers'] if l['name']=='Combined Shape');f=shape['frame'];d=' '.join(paths(l) for l in shape['layers']);return d,f['width'],f['height']
d,w,h=extract('favicon')
grad='<defs><linearGradient id="silver"><stop stop-color="#bfc2c4"/><stop offset="1" stop-color="#787b7d"/></linearGradient></defs>'
def mark(vb,transform,background=''):
 return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="Wayne Club">{grad}{background}<g transform="{transform}"><path fill="url(#silver)" fill-rule="evenodd" d="{d}"/></g></svg>\n'
# Sketch combined shape is rotated 180 degrees and flipped horizontally: net Y reflection.
(out/'wayne-club-logo.svg').write_text(mark(f'0 0 {w} {h}',f'translate(0 {h}) scale(1 -1)'))
(out/'favicon.svg').write_text(mark('0 0 512 512',f'translate(31 {124+h}) scale(1 -1)'))
(out/'apple-touch-icon.svg').write_text(mark('0 0 512 512',f'translate(76 {154+h*.8}) scale(.8 -.8)','<rect width="512" height="512" fill="#f5f5f5"/>'))
dt,tw,th=extract('text-logo')
(out/'wayne-club-wordmark.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {tw} {th}" role="img" aria-label="Wayne Club">{grad}<g transform="translate(0 {th}) scale(1 -1)"><path fill="url(#silver)" fill-rule="evenodd" d="{dt}"/></g></svg>\n')
print('Exported original vector logo, wordmark, favicon and touch icon source')
