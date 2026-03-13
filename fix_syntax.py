import os

def fix_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    new_content = content.replace('\\`', '`').replace('\\$', '$')
    if content != new_content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {path}")

for root, _, files in os.walk(r'c:\Users\SANTHOSH.S\OneDrive\Desktop\gym-management\frontend\src'):
    for file in files:
        if file.endswith('.jsx'):
            fix_file(os.path.join(root, file))
