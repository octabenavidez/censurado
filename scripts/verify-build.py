from html.parser import HTMLParser
from pathlib import Path
import re

class Page(HTMLParser):
 def __init__(self,text):
  super().__init__(); self.anchors=[]; self.meta={}; self.assets=[]; self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='a': self.anchors.append(a.get('href',''))
  if tag=='meta': self.meta[a.get('property',a.get('name',''))]=a.get('content')
  if tag=='img': self.assets.append(a.get('src',''))

source=Path('src/data/links.ts').read_text(encoding='utf-8')
links=re.findall(r'id: "([^"]+)".*?href: "([^"]+)"',source,re.S)
home=Page(Path('dist/index.html').read_text(encoding='utf-8'))
assert len(links)==8
for slug,url in links:
 assert url in home.anchors, (slug,'home URL changed')
for asset in home.assets: assert Path('dist'+asset).is_file(),asset
assert 'url={link.href}' in Path('src/components/LinkActions.tsx').read_text(encoding='utf-8')
assert not Path('dist/enlaces').exists(), 'Obsolete intermediate pages in build'
assert 'https://www.cucina.link/ords/pedidos/r/pedidos/categorias?t=censurado-nvacba' in home.anchors
print('PASS: 8 direct destinations preserved; share uses the card URL; no intermediate pages.')
