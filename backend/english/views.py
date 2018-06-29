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
    try:
        configuration = Configuration.objects.all().get(userConfig=user)
    except BaseException:
        configuration = Configuration(userConfig=user, currVocab=Vocabulary.objects.all().get(id=3))
        configuration.save()
    LearnRecord.objects.all().filter(learner=user, iterations=0).delete()
    learned_records = LearnRecord.objects.all().filter(learner=user)
    learned_words = learned_records.values_list('word', flat=True)
    print(learned_words)
    all_words = configuration.currVocab.vocab_word.all()
    all_words.difference(learned_words)
    new_words = list(all_words)
    random.shuffle(new_words)
    if len(new_words) >= configuration.quantity:
        new_words = new_words[0: configuration.quantity]
    learned_records = []
    for word in new_words:
        learnRecord = LearnRecord(learner=user, word=word)
        learned_records.append(learnRecord)
    LearnRecord.objects.bulk_create(learned_records)
    print('make learning plan successfully.....')
    return learned_records


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
        configuration = Configuration(userConfig=User.objects.all().get(username=serializer.data['username'])
                                      , currVocab=Vocabulary.objects.all().get(id=3))
        configuration.save()
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
    fake_chinese = list(Word.objects.all().values_list('chinese', flat=True))
    serializer_class = LearnRecordSerializer
    permission_classes = (IsAuthenticated,)

    def list(self, request, *args, **kwargs):
        tmp = self.get_queryset().filter(learner=request.user, time=datetime.date.today())
        if tmp.count() == 0:
            tmp = make_learning_plan(request.user)
        configuration = Configuration.objects.all().get(userConfig=request.user)
        learn_records_groups = {}
        learn_records = self.get_queryset().filter(learner=request.user, iterations__gt=0).order_by('iterations')
        for record in learn_records:
            if learn_records_groups.get(record.time) is None:
                learn_records_groups[record.time] = []
            learn_records_groups[record.time].append(record)
        final_records = []
        today = datetime.date.today()
        if learn_records_groups.get(today + datetime.timedelta(days=-1)):
            final_records.extend(learn_records_groups[today + datetime.timedelta(days=-1)])
        if learn_records_groups.get(today + datetime.timedelta(days=-2)):
            final_records.extend(learn_records_groups[today + datetime.timedelta(days=-2)])
        if learn_records_groups.get(today + datetime.timedelta(days=-3)):
            final_records.extend(learn_records_groups[today + datetime.timedelta(days=-3)])
        if len(final_records) > configuration.quantity:
            final_records = random.sample(final_records, configuration.quantity // 2)
        left = configuration.quantity - len(final_records)
        if left >= len(tmp):
            final_records.extend(tmp)
        else:
            final_records.extend(tmp[0:left])
        queryset = final_records
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        cnt = 0
        for r in final_records:
            if r.iterations == 0:
                cnt += 1
        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data
        return Response({'record': data, 'new_words': cnt})

    @action(methods=['get'], detail=False)
    def examination(self, request):
        configuration = Configuration.objects.all().get(userConfig=request.user)
        learn_records = self.get_queryset().filter(learner=request.user, iterations__gt=0)
        words = [record.word for record in learn_records]
        if len(words) > configuration.exam:
            words = random.sample(words, configuration.exam)

        data = WordSerializer(words, many=True).data
        for word in data:
            word['fake_chinese'] = random.sample(self.fake_chinese, 3)
        return Response(data)

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

