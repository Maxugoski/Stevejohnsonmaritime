import os
import urllib.request
import re

os.makedirs('assets/images/logos', exist_ok=True)

content = open('site.html', 'r', encoding='utf-8', errors='ignore').read()
imgs = re.findall(r'(https?://stevejohnsonmaritime\.com/wp-content/uploads/[^\s"\'\)]+)', content)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': '*/*'
}

target_keywords = ['Tasmania', 'SOLENT', 'South_Shields', 'aastmt', 'Mari', 'Ladoke', 'Falck', 'ExxonMobil', '1630609247842', '1575293014820', 'logowhitemm']

downloaded = []
for url in set(imgs):
    clean_url = url.split('?')[0]
    filename = os.path.basename(clean_url)
    if any(k.lower() in filename.lower() for k in target_keywords):
        dest = os.path.join('assets/images/logos', filename)
        try:
            req = urllib.request.Request(clean_url, headers=headers)
            with urllib.request.urlopen(req, timeout=8) as resp, open(dest, 'wb') as f:
                f.write(resp.read())
            print(f"Downloaded: {filename}")
            downloaded.append(filename)
        except Exception as e:
            print(f"Error {filename}: {e}")

print("Total downloaded logos:", len(downloaded))
