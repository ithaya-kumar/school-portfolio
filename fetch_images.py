import urllib.request
import json
import os

query = "Tamil Nadu school"
url = f"https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url&format=json"

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        pages = data['query']['pages']
        
        count = 1
        for page_id in pages:
            image_url = pages[page_id]['imageinfo'][0]['url']
            print(f"Downloading {image_url}")
            filepath = f"assets/images/tn_school_{count}.jpg"
            urllib.request.urlretrieve(image_url, filepath)
            count += 1
            if count > 8:
                break
except Exception as e:
    print(f"Error: {e}")
