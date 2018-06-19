from urllib.request import Request, urlopen

import time
from bs4 import BeautifulSoup

with open('words.txt', encoding='utf-8') as fp:
    for line in fp.readlines():
        print(line.strip('\n').split('\t'))

exit(0)

user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' \
             'Chrome/65.0.3325.181 Safari/537.36'
headers = {
  'User-Agent': user_agent,
}

fp = open('words.txt', 'w', encoding='utf-8')
need = open('need.txt', 'w', encoding='utf-8')

request = Request('https://danci.911cha.com/book_54.html', headers=headers)
html = urlopen(request).read().decode('utf-8')
soup = BeautifulSoup(html, 'lxml')
for div in soup.find_all('div', class_='mcon f14'):
    for li in div.find_all('li'):
        if li.text.find(' ') >= 0:
            continue
        word = li.text
        url = 'https://danci.911cha.com/' + word + '.html'
        print(url)
        request = Request(url, headers=headers)
        html = urlopen(request).read().decode('utf-8')
        wordSoup = BeautifulSoup(html, 'lxml')
        symbol = wordSoup.find('span', class_='ml black f14 nor').text
        chinese = wordSoup.find('div', class_='mcon bt f14 noi').div.p
        print(chinese)
        try:
            chinese.span.extract()
        except BaseException:
            pass
        if len(chinese) == 0:
            need.write(url + '\n')
            print('-----------------------------')
            continue
        print(chinese)
        print(symbol)
        print('-----------------------------')
        fp.write(word + '\t' + chinese.text + '\t' + symbol + '\n')

fp.close()
need.close()