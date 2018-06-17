from django.test import TestCase
from django.test import Client
import os, django
import json


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from english.models import *
from django.contrib.auth.hashers import make_password, check_password
from django.contrib import auth
from rest_framework_jwt.serializers import JSONWebTokenSerializer


vocb = Vocabulary.objects.all().get(category='CET6')

with open('words.txt', encoding='utf-8') as fp:
    for line in fp.readlines():
        word, ch, sym = line.strip('\n').split('\t')
        obj = Word(word=word, characteristic='adj.', symbol=sym
                   , chinese=ch, sentences='This is a sentence for %s' % word)
        obj.save()
        obj.books.set([vocb])
        obj.save()