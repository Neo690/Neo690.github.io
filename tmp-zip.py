
import zipfile, os
root = r'C:/workspace/herbier-medicinal'
out = r'C:/workspace/herbier-medicinal/deploy-herbier.zip'
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    base = os.path.join(root, 'www')
    for dirpath, dirs, files in os.walk(base):
        dirs[:] = [d for d in dirs if d not in ('.netlify', 'netlify')]
        for f in files:
            p = os.path.join(dirpath, f)
            z.write(p, os.path.relpath(p, base))
print('ZIP_OK', os.path.getsize(out))
