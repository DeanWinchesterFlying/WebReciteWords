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


def make_learning_plan(user):
    print('make learning plan.....')
    configuration = Configuration.objects.all().get(userConfig=user)
    LearnRecord.objects.all().filter(learner=user, iterations=0).delete()
    learned_words = LearnRecord.objects.all().filter(learner=user)
    all_words = configuration.currVocab.vocab_word.all()
    all_words.difference(learned_words)
    new_words = list(all_words)
    random.shuffle(new_words)
    new_words = new_words[0: configuration.quantity]
    learnRecords = []
    for word in new_words:
        learnRecord = LearnRecord(learner=user, word=word)
        learnRecords.append(learnRecord)
    LearnRecord.objects.bulk_create(learnRecords)
    print('make learning plan successfully.....')
    return learnRecords


class UserViewSet(mixins.CreateModelMixin, mixins.RetrieveModelMixin, GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data['is_superuser'] = False
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class WordViewSet(viewsets.ModelViewSet):
    queryset = Word.objects.all()
    serializer_class = WordSerializer
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend,)
    filter_fields = ('books', )
    permission_classes = (IsAuthenticated, WordPermission)

    '''def list(self, request, *args, **kwargs):
        tmp = LearnRecord.objects.all().filter(learner=request.user, time=datetime.date.today())
        if tmp.count() == 0:
            queryset = make_learning_plan(request.user)
        else:
            queryset = []
            for record in tmp:
                queryset.append(record.word)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)'''


class VocabularyViewSet(viewsets.ModelViewSet):
    queryset = Vocabulary.objects.all()
    serializer_class = VocabularySerializer
    #permission_classes = (IsAuthenticated,)

    @action(['get', 'post', 'delete'], detail=True)
    def word(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.method == 'POST':
            print(request.data)
            w = Word.objects.all().get(id=request.data['word_id'])
            if instance.vocab_word.all().filter(id=request.data['word_id']).count() == 0:
                instance.vocab_word.add(w)
            s = WordSerializer(w)
            return Response(s.data)
        elif request.method == 'GET':
            s = WordSerializer(instance.vocab_word.all(), many=True)
            return Response(s.data)
        elif request.method == 'DELETE':
            w = Word.objects.all().get(id=request.query_params.get('word'))
            instance.vocab_word.remove(w)
            s = WordSerializer(w)
            return Response(s.data)

    @action(['get'], detail=False)
    def me(self, request):
        queryset = self.get_queryset().filter(owner=request.user)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data['owner'] = request.user
        data['category'] = 'SELF'
        print(data)
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class LearnRecordViewSet(viewsets.ModelViewSet):
    queryset = LearnRecord.objects.all()
    serializer_class = LearnRecordSerializer
    permission_classes = (IsAuthenticated,)

    def list(self, request, *args, **kwargs):
        tmp = self.get_queryset().filter(learner=request.user, time=datetime.date.today())
        if tmp.count() == 0:
            queryset = make_learning_plan(request.user)
        else:
            queryset = tmp
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(methods=['get'], detail=False)
    def new_words(self, request, *args, **kwargs):
        tmp = self.get_queryset().filter(learner=request.user, time=datetime.date.today(), iterations=0)
        return Response({'new_words': tmp.count()})

    @action(methods=['get'], detail=False)
    def analysis1(self, request, *args, **kwargs):
        data = []
        today = datetime.date.today()
        for i in range(-5, 1):
            day = today + datetime.timedelta(days=i)
            cnt = self.get_queryset().filter(learner=request.user, time=day, iterations__gt=0).count()
            data.append({
                'date': day.strftime('%m.%d'),
                'number': cnt
            })
        return Response(data)

    @action(methods=['get'], detail=False)
    def analysis2(self, request, *args, **kwargs):
        data = []
        today = datetime.date.today()
        for i in range(-5, 1):
            day = today + datetime.timedelta(days=i)
            cnt = self.get_queryset().filter(learner=request.user, time__lte=day, iterations__gt=0).count()
            data.append({
                'date': day.strftime('%m.%d'),
                'number': cnt
            })
        return Response(data)


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

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        print(request.data)
        return self.update(request, *args, **kwargs)


class LearningPlan(APIView):
    def get(self, request):
        return Response("hello world")
