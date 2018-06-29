from django.test import TestCase
from django.test import Client
import os, django
import json


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from english.models import *


User.objects.all().delete()
Vocabulary.objects.all().delete()
Word.objects.all().delete()
Configuration.objects.all().delete()
LearnRecord.objects.all().delete()

c = Client()

user = User(username='manager', email='manager@qq.com', is_superuser=True)
user.set_password('123456789')
user.save()

vocb_data = [
    {'title': 'GRE词汇红宝书', 'category': 'GRE', 'owner': user},
    {'title': '四级词汇红宝书', 'category': 'CET4', 'owner': user},
    {'title': '六级词汇红宝书', 'category': 'CET6', 'owner': user},
    {'title': '托福词汇红宝书', 'category': 'TOEFL', 'owner': user},
    {'title': '雅思词汇红宝书', 'category': 'IELTS', 'owner': user},
]

for vocb in vocb_data:
    Vocabulary(**vocb).save()

vocb = Vocabulary.objects.all().get(category='CET6')

with open('words.txt', encoding='utf-8') as fp:
    for i, line in enumerate(fp.readlines(), 1):
        # print(line.strip('\n').split('\t'))
        word, ch, sym = line.strip('\n').split('\t')
        obj = Word(word=word, characteristic='adj.', symbol=sym
                   , chinese=ch, sentences='This is a sentence for %s' % word)
        obj.save()
        obj.books.set([vocb])
        obj.save()
        if i % 20 == 0:
            print('add 20 words')
