import re
from html.parser import HTMLParser

class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.result = []
        self.ignore = False
    def handle_starttag(self, tag, attrs):
        if tag in ['script', 'style', 'head', 'noscript']:
            self.ignore = True
    def handle_endtag(self, tag):
        if tag in ['script', 'style', 'head', 'noscript']:
            self.ignore = False
    def handle_data(self, data):
        if not self.ignore:
            text = data.strip()
            if text:
                self.result.append(text)

raw = open('company_profile.html', 'r', encoding='utf-8', errors='ignore').read()
parser = TextExtractor()
parser.feed(raw)

# Also let's extract all images in company_profile.html
images = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', raw)

with open('company_profile_text.txt', 'w', encoding='utf-8') as f:
    f.write("=== EXTRACTED TEXT ===\n")
    for l in parser.result:
        f.write(l + "\n")
    f.write("\n=== IMAGES FOUND ===\n")
    for img in set(images):
        f.write(img + "\n")

print("Saved to company_profile_text.txt")
