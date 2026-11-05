"""Read-only Shopify QA checks; never submits a cart, contact form or order."""
import argparse
import concurrent.futures
import http.cookiejar
import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--domain', default='https://lumasela.com')
parser.add_argument('--theme-id', default='193315438880')
parser.add_argument('--output', default='/tmp/lumasela-http-qa')
args = parser.parse_args()
output = Path(args.output)
output.mkdir(parents=True, exist_ok=True)
jar = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
opener.open(f'{args.domain}/?preview_theme_id={args.theme_id}', timeout=30).read()
checks = [
 ('home', '/', ['lumasela-capsule', 'lumasela-home-steps', 'lumasela-home-faq']),
 ('product', '/products/signature-clear', ['data-lumasela-product', 'data-gallery-dialog', 'data-mobile-review']),
 ('guide', '/pages/support?view=customize', ['lumasela-help', '20 characters']),
 ('faq', '/pages/support?view=faq', ['<details', 'Questions, answered clearly']),
 ('track', '/pages/support?view=track', ['account.lumasela.com/orders']),
 ('contact', '/pages/contact-us', ['/contact#ContactForm']),
 ('cart', '/cart', ['cart']),
]
report = {'theme_id': args.theme_id, 'pages': [], 'assets': []}
assets = set()
for name, path, expected in checks:
 response = opener.open(args.domain + path, timeout=30)
 html = response.read().decode('utf-8')
 (output / f'{name}.html').write_text(html)
 match = re.search(r'Shopify.theme = (.*?);', html)
 theme = json.loads(match.group(1)) if match else {}
 findings = {'name': name, 'url': args.domain + path, 'status': response.status, 'theme_id': str(theme.get('id')), 'role': theme.get('role'), 'missing_markers': [text for text in expected if text.lower() not in html.lower()], 'liquid_error': bool(re.search(r'Liquid (?:error|syntax error)', html))}
 findings['pass'] = response.status == 200 and str(theme.get('id')) == args.theme_id and theme.get('role') == 'unpublished' and not findings['missing_markers'] and not findings['liquid_error']
 report['pages'].append(findings)
 for attr in re.findall(r'(?:src|href)=["\']([^"\']+)["\']', html):
  if '/assets/lumasela-' in attr and not attr.endswith('.js.map'):
   assets.add(urllib.parse.urljoin(args.domain, attr.replace('&amp;', '&')))
def check_asset(url):
 try:
  response = urllib.request.urlopen(url, timeout=30)
  payload = response.read()
  return {'url':url, 'status': response.status, 'bytes':len(payload), 'pass': response.status == 200 and len(payload)>0}
 except Exception as e:
  return {'url':url, 'pass':False, 'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
 report['assets'] = list(pool.map(check_asset, sorted(assets)))
report['pass'] = all(row['pass'] for row in report['pages'] + report['assets'])
(output/'report.json').write_text(json.dumps(report, indent=2))
print(json.dumps({'pass':report['pass'], 'pages':report['pages'], 'assets_checked':len(report['assets']), 'asset_failures':[x for x in report['assets'] if not x['pass']]}))
raise SystemExit(0 if report['pass'] else 1)
