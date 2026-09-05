import urllib.request
try:
    req = urllib.request.urlopen('https://ithaya-kumar.github.io/school-portfolio/')
    print('Status:', req.getcode())
except Exception as e:
    print('Error:', e)
