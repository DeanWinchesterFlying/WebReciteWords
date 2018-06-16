from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from english.permissions import WordPermission
from english.models import *
from english.serializers import *

from rest_framework import viewsets, mixins
from rest_framework.decorators import action


class UserViewSet(mixins.CreateModelMixin, GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class WordViewSet(viewsets.ModelViewSet):
    queryset = Word.objects.all()
    serializer_class = WordSerializer
    permission_classes = (IsAuthenticated, WordPermission)


class VocabularyViewSet(viewsets.ModelViewSet):
    queryset = Vocabulary.objects.all()
    serializer_class = VocabularySerializer
    permission_classes = (IsAuthenticated,)


class LearnRecordViewSet(viewsets.ModelViewSet):
    queryset = LearnRecord.objects.all()
    serializer_class = LearnRecordSerializer
    permission_classes = (IsAuthenticated,)


class ConfiguraionViewSet(viewsets.ModelViewSet):
    queryset = Configuration.objects.all()
    serializer_class = ConfigurationSerializer
    permission_classes = (IsAuthenticated,)
