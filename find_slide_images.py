import re
import os
import json
import urllib.request

content = open('site.html', 'r', encoding='utf-8', errors='ignore').read()

# Let's find all CSS links in site.html to fetch them and search for elementor slide backgrounds
css_links = re.findall(r'href=["\']([^"\']+\.css[^"\']*)["\']', content)
print(f"Found {len(css_links)} CSS links.")

# Also let's search in post-xxx.css or speedycache files
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

all_css_text = ""
for link in set(css_links):
    if 'post-' in link or 'elementor' in link or 'speedycache' in link:
        try:
            req = urllib.request.Request(link, headers=headers)
            with urllib.request.urlopen(req, timeout=8) as resp:
                all_css_text += resp.read().decode('utf-8', errors='ignore') + "\n"
            print(f"Loaded CSS: {link}")
        except Exception as e:
            print(f"Failed CSS {link}: {e}")

# Search for elementor-repeater-item backgrounds
bg_rules = re.findall(r'\.elementor-repeater-item-([a-z0-9]+)\s*\{[^}]*background-image:\s*url\(([^)]+)\)', all_css_text)
print(f"Found {len(bg_rules)} slide background image rules in fetched CSS.")
for item_id, bg_url in bg_rules:
    print(f"Repeater {item_id}: {bg_url}")

with open('slide_images.json', 'w', encoding='utf-8') as out:
    json.dump(bg_rules, out, indent=2)
