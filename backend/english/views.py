import django_filters
from django.db import transaction
from django.db.models import QuerySet
from django.http import Http404
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet

from english.permissions import WordPermission
from english.models import *
from english.serializers import *

from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
import random

import datetime


class UserViewSet(mixins.CreateModelMixin, mixins.RetrieveModelMixin, GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data['is_superuser'] = False
        #print(data)
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        #print(serializer.data)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class WordViewSet(viewsets.ModelViewSet):
    queryset = Word.objects.all()
    serializer_class = WordSerializer
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend,)
    filter_fields = ('books', )
    permission_classes = (IsAuthenticated, WordPermission)

    def make_learning_plan(self, user):
        print('make learning plan.....')
        configuration = Configuration.objects.all().get(userConfig=user)
        LearnRecord.objects.all().filter(learner=user, iterations=0).delete()
        learned_words = LearnRecord.objects.all().filter(learner=user)
        all_words = configuration.currVocab.vocab_word.all()
        all_words.difference(learned_words)
        new_words = list(all_words)
        random.shuffle(new_words)
        new_words = new_words[0: configuration.quantity]
        for word in new_words:
            learnRecord = LearnRecord(learner=user, word=word)
            learnRecord.save()
        print('make learning plan successfully.....')
        return new_words

    def list(self, request, *args, **kwargs):
        #queryset = self.filter_queryset(self.get_queryset())
        tmp = LearnRecord.objects.all().filter(learner=request.user, time=datetime.date.today())
        if tmp.count() == 0:
            queryset = self.make_learning_plan(request.user)
        else:
            queryset = []
            for record in tmp:
                queryset.append(record.word)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class VocabularyViewSet(viewsets.ModelViewSet):
    queryset = Vocabulary.objects.all()
    serializer_class = VocabularySerializer
    #permission_classes = (IsAuthenticated,)


class LearnRecordViewSet(viewsets.ModelViewSet):
    queryset = LearnRecord.objects.all()
    serializer_class = LearnRecordSerializer
    permission_classes = (IsAuthenticated,)


class ConfiguraionViewSet(mixins.ListModelMixin,
                          mixins.UpdateModelMixin, GenericViewSet):
    queryset = Configuration.objects.all()
    serializer_class = ConfigurationSerializer
    permission_classes = (IsAuthenticated,)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(userConfig=request.user)
        if queryset.count() == 0:
            serializer = self.get_serializer(data={'userConfig': request.user.username})
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
        serializer = self.get_serializer(self.get_queryset().get(userConfig=request.user))
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save()


class LearningPlan(APIView):
    def get(self, request):
        return Response("hello world")
