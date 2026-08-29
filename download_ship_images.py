import json
import os
import urllib.request

os.makedirs('assets/images/vessels', exist_ok=True)

media = json.load(open('media.json', 'r', encoding='utf-8', errors='ignore'))

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': '*/*'
}

downloaded = 0
for item in media:
    url = item.get('source_url', '')
    title = item.get('title', {}).get('rendered', '')
    if 'Ship_' in url or 'Ship_' in title or 'YOHO' in url or 'River' in url or 'Kota' in url or 'Iran' in url or 'Michael' in url or 'Lagos' in url:
        filename = os.path.basename(url.split('?')[0])
        dest = os.path.join('assets/images/vessels', filename)
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=10) as resp, open(dest, 'wb') as f:
                f.write(resp.read())
            print(f"Downloaded vessel image: {filename}")
            downloaded += 1
        except Exception as e:
            print(f"Failed {filename}: {e}")

print(f"Successfully downloaded {downloaded} vessel images!")
