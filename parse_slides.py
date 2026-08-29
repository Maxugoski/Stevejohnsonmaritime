import re
import json

f = open('site.html', 'r', encoding='utf-8', errors='ignore').read()

matches = re.findall(r'<div class="elementor-slide-heading">(.*?)</div>\s*<div class="elementor-slide-description">(.*?)</div>', f)
print(f"Total slides found: {len(matches)}")

slides = []
for h, d in matches:
    slides.append({
        'heading': h.strip(),
        'description': d.strip()
    })

with open('slides_data.json', 'w', encoding='utf-8') as out:
    json.dump(slides, out, indent=2)

for i, s in enumerate(slides):
    print(f"{i+1}: {s['heading']} | {s['description']}")
