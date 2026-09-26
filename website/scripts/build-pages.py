"""Generate crawlable locale pages and search/share metadata from one template."""
from pathlib import Path
from html.parser import HTMLParser
from html import escape
import json,re,subprocess
ROOT=Path(__file__).resolve().parents[1]
js=(ROOT/'assets/i18n.js').read_text().split('window.wayneI18n =')[0]
rows=json.loads(subprocess.check_output(['node','-e',js+'\nconsole.log(JSON.stringify(translations));'],text=True))
translations={row[0]:row for row in rows}
BASE='https://wayneclub.com'
variants=[('en','/',0,'en_US'),('en','/en/',0,'en_US'),('zh-Hant','/zh-hant/',1,'zh_TW'),('zh-Hans','/zh-hans/',2,'zh_CN')]
DESC=['Ting-Long (Wayne) Wei. Backend software engineer building reliable systems, AI-powered services, and open-source tools.','Ting-Long（Wayne）Wei，專注可靠系統、AI 服務與開源工具的後端軟體工程師。','Ting-Long（Wayne）Wei，专注可靠系统、AI 服务与开源工具的后端软件工程师。']
class Localize(HTMLParser):
 def __init__(self,index):super().__init__(convert_charrefs=False);self.index=index;self.out=[];self.skip=0
 def handle_starttag(self,tag,attrs):
  raw=self.get_starttag_text()
  for a,v in attrs:
   if a in ['aria-label','alt'] and v in translations:raw=raw.replace(escape(v,quote=True),escape(translations[v][self.index],quote=True))
  self.out.append(raw)
  if tag in ['script','style']:self.skip+=1
 def handle_endtag(self,tag):
  self.out.append(f'</{tag}>')
  if tag in ['script','style']:self.skip-=1
 def handle_data(self,data):
  key=data.strip();self.out.append(data.replace(key,escape(translations[key][self.index])) if not self.skip and key in translations else data)
 def handle_entityref(self,name):self.out.append('&'+name+';')
 def handle_charref(self,name):self.out.append('&#'+name+';')
 def handle_decl(self,data):self.out.append('<!'+data+'>')
 def handle_comment(self,data):self.out.append('<!--'+data+'-->')
template=(ROOT/'src/index.html').read_text()
for lang,path,index,oglocale in variants:
 parser=Localize(index);parser.feed(template);s=''.join(parser.out);s=s.replace('<html lang="en">',f'<html lang="{lang}">')
 s=re.sub(r'<meta (?:name="description"|property="og:description") content="[^"]*">',lambda m:('<meta name="description"' if 'name=' in m[0] else '<meta property="og:description"')+' content="'+escape(DESC[index],quote=True)+'">',s)
 s=s.replace('rel="canonical" href="https://wayneclub.com/"',f'rel="canonical" href="{BASE+path}"').replace('property="og:url" content="https://wayneclub.com/"',f'property="og:url" content="{BASE+path}"')
 schema={'@context':'https://schema.org','@graph':[{'@type':'WebSite','@id':BASE+'/#website','url':BASE+'/','name':'Wayne Club','inLanguage':['en','zh-Hant','zh-Hans']},{'@type':'ProfilePage','@id':BASE+path+'#profile','url':BASE+path,'name':'Wayne Club — Wayne Wei','description':DESC[index],'inLanguage':lang,'isPartOf':{'@id':BASE+'/#website'},'mainEntity':{'@id':BASE+'/#person'}},{'@type':'Person','@id':BASE+'/#person','name':'Ting-Long Wei','alternateName':'Wayne Wei','url':BASE+'/','email':'me@wayneclub.com','jobTitle':'Backend Software Engineer','sameAs':['https://github.com/wayneclub','https://www.linkedin.com/in/mrwwei/'],'alumniOf':[{'@type':'CollegeOrUniversity','name':'University of Southern California'},{'@type':'CollegeOrUniversity','name':'National Cheng Kung University'}],'knowsAbout':['Backend engineering','Python','Java','Cloud infrastructure','AI service integration']} ]}
 metadata='\n<meta name="robots" content="index,follow,max-image-preview:large">\n'
 for code,url in [('en','/en/'),('zh-Hant','/zh-hant/'),('zh-Hans','/zh-hans/'),('x-default','/')]:metadata+=f'<link rel="alternate" hreflang="{code}" href="{BASE+url}">\n'
 metadata+=f'<meta property="og:locale" content="{oglocale}">\n'
 for other in ['en_US','zh_TW','zh_CN']:
  if other!=oglocale:metadata+=f'<meta property="og:locale:alternate" content="{other}">\n'
 metadata+='''<meta property="og:image" content="https://wayneclub.com/assets/wayne-club-social.png">
<meta property="og:image:secure_url" content="https://wayneclub.com/assets/wayne-club-social.png">
<meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Wayne Club — Wayne Wei. Backend engineering, thoughtfully built.">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="Wayne Club — Wayne Wei">
<meta name="twitter:image" content="https://wayneclub.com/assets/wayne-club-social.png">
'''
 metadata+=f'<meta name="twitter:description" content="{escape(DESC[index],quote=True)}">\n<script type="application/ld+json">'+json.dumps(schema,ensure_ascii=False).replace('</','<\\/')+'</script>\n'
 s=s.replace('</head>',metadata+'</head>');out=ROOT/path.strip('/')/'index.html';out.parent.mkdir(exist_ok=True);out.write_text(s)
(ROOT/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join(f'<url><loc>{BASE+p}</loc></url>\n' for _,p,_,_ in variants)+'</urlset>\n')
(ROOT/'robots.txt').write_text('''# Public portfolio pages and assets are crawlable, including by AI search bots.
User-agent: *
Allow: /
Disallow: /sub/
Disallow: /clash/
Disallow: /rules/
Disallow: /cdn-xhttp-mihomo.yaml
Disallow: /cdn-xhttp-vless.txt
Disallow: /shadowrocket.conf

Sitemap: https://wayneclub.com/sitemap.xml
''')
(ROOT/'llms.txt').write_text('''# Wayne Club

> Personal portfolio of Ting-Long (Wayne) Wei, a backend software engineer focused on reliable systems, cloud infrastructure and AI service integration.

## Portfolio
- [English](https://wayneclub.com/en/): Experience, projects, education and contact information.
- [Traditional Chinese](https://wayneclub.com/zh-hant/): 繁體中文個人網站。
- [Simplified Chinese](https://wayneclub.com/zh-hans/): 简体中文个人网站。
- [Resume](https://wayneclub.com/assets/Ting-Long-Wei-Resume.pdf): English resume.

## Verified profiles
- [GitHub](https://github.com/wayneclub)
- [LinkedIn](https://www.linkedin.com/in/mrwwei/)

## Contact
- Email: me@wayneclub.com

## Selected public projects
- [Subtitle Downloader](https://github.com/wayneclub/Subtitle-Downloader): Python subtitle tooling.
- [Apple Dictionary](https://github.com/wayneclub/Apple-Dictionary): Custom dictionary with dark mode and offline pronunciation.
- [PassBar](https://github.com/wayneclub/PassBar): MBE-style bar exam practice.
- [Mieru](https://github.com/wayneclub/Mieru): Insights from food and service reviews.

Career information on the portfolio follows the owner-supplied resume. It is distinct from the older resume repository on GitHub.
''')
print('Built root, 3 static locale pages, sitemap, robots.txt and llms.txt')
