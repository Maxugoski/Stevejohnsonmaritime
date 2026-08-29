import re
import json

content = open('site.html', 'r', encoding='utf-8', errors='ignore').read()

# Let's inspect all <style> tags in site.html
inline_styles = re.findall(r'<style[^>]*>(.*?)</style>', content, re.S)
print(f"Found {len(inline_styles)} inline style tags.")
for s in inline_styles:
    bgs = re.findall(r'(\.elementor-repeater-item-[^\s{]+)\s*\{([^}]*background[^}]*)\}', s)
    if bgs:
        print(f"Found {len(bgs)} repeater background rules in inline style!")
        for sel, decl in bgs:
            print(f"{sel} -> {decl}")

# Also let's search for any image urls in wp-content/uploads
all_uploads = set(re.findall(r'(https?://stevejohnsonmaritime\.com/wp-content/uploads/[^\s"\'\)]+)', content))
print(f"Total unique uploads: {len(all_uploads)}")
for u in sorted(all_uploads):
    print(u)
