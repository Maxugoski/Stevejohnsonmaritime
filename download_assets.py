import urllib.request
import os
import re

os.makedirs('assets/images', exist_ok=True)

content = open('site.html', 'r', encoding='utf-8', errors='ignore').read()
imgs = re.findall(r'(https?://stevejohnsonmaritime\.com/wp-content/uploads/[^\s"\'\)]+)', content)
imgs = list(set(imgs))

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
}

print(f"Found {len(imgs)} images to download.")
for url in imgs:
    # clean url
    clean_url = url.split('?')[0]
    filename = os.path.basename(clean_url)
    dest = os.path.join('assets/images', filename)
    try:
        req = urllib.request.Request(clean_url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp, open(dest, 'wb') as f:
            f.write(resp.read())
        print(f"Downloaded: {filename}")
    except Exception as e:
        print(f"Failed {filename}: {e}")
