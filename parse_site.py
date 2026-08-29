import re
import json

content = open('site.html', 'r', encoding='utf-8', errors='ignore').read()

# Extract title
title_m = re.findall(r'<title>(.*?)</title>', content, re.I | re.S)
print('PAGE TITLE:', title_m)

# Clean text
clean = re.sub(r'<(script|style).*?</\1>', '', content, flags=re.I | re.S)
clean = re.sub(r'<[^>]+>', '\n', clean)
lines = [line.strip() for line in clean.splitlines() if line.strip()]

with open('extracted_text.txt', 'w', encoding='utf-8') as out:
    out.write('\n'.join(lines))

print(f"Saved {len(lines)} lines to extracted_text.txt")

# Extract links
links = re.findall(r'href=["\'](.*?)["\']', content)
imgs = re.findall(r'src=["\'](.*?)["\']', content)

with open('extracted_assets.json', 'w', encoding='utf-8') as out:
    json.dump({
        'links': list(set(links)),
        'images': list(set(imgs))
    }, out, indent=2)

print("Saved extracted_assets.json")
