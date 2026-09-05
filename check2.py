import urllib.request
try:
    req = urllib.request.urlopen('https://ithaya-kumar.github.io/')
    print('Status:', req.getcode())
except Exception as e:
    print('Error:', e)
