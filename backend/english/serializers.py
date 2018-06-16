from rest_framework import serializers
from english.models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    def create(self, validated_data):
        if not validated_data.get('is_superuser', False):
            return User.objects.create_user(**validated_data)
        return User.objects.create_superuser(**validated_data)

    def save(self, **kwargs):
        return super(UserSerializer, self).save(**kwargs)


class WordSerializer(serializers.ModelSerializer):

    class Meta:
        model = Word
        fields = '__all__'


class VocabularySerializer(serializers.ModelSerializer):
    total_words = serializers.SerializerMethodField()

    class Meta:
        model = Vocabulary
        fields = '__all__'

    def get_total_words(self, obj):
        return Word.objects.all().filter(books=obj.id).count()


class LearnRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearnRecord
        fields = '__all__'


class ConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Configuration
        fields = '__all__'