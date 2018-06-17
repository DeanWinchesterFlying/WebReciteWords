from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.utils import timezone


class UserManager(BaseUserManager):
    def _create_user(self, username, email, password, **extra_fields):
        if not username:
            raise ValueError('The given username must be set')
        email = self.normalize_email(email)
        username = self.model.normalize_username(username)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_user(self, username, email=None, password=None, **extra_fields):
        return self._create_user(username=username, email=email, password=password, **extra_fields)

    def create_superuser(self, username, email, password, **extra_fields):
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(username=username, email=email, password=password, **extra_fields)


class User(AbstractBaseUser):
    username = models.CharField(max_length=150, primary_key=True)
    email = models.EmailField(blank=True, unique=True)
    date_joined = models.DateTimeField(default=timezone.now)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()
    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
        return True

    def has_perms(self, perm_list, obj=None):
        return all(self.has_perm(perm, obj) for perm in perm_list)

    def has_module_perms(self, app_label):
        return True


class Vocabulary(models.Model):
    CATEGORIES = (
        ('GRE', 'GRE'),
        ('CET4', '四级'),
        ('CET6', '六级'),
        ('TOEFL', '托福'),
        ('IELTS', '雅思'),
        ('SELF', '自定义'),
    )
    title = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)
    category = models.CharField(max_length=10, choices=CATEGORIES)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owner')


class Word(models.Model):
    CHARACTERISTICS = (
        ('adj.', 'adjective'),
        ('adv.', 'adverb'),
        ('n.', 'noun'),
        ('v.', 'verb'),
        ('conj.', 'conjunction'),
        ('pron.', 'pronoun'),
        ('num.', 'numeral'),
        ('art.', 'article'),
        ('prep.', 'preposition'),
        ('interj.', 'interjection'),
    )
    word = models.CharField(max_length=64)
    characteristic = models.CharField(max_length=15, choices=CHARACTERISTICS)
    symbol = models.CharField(max_length=64)
    chinese = models.CharField(max_length=64)
    sentences = models.TextField(default='')
    books = models.ManyToManyField(Vocabulary, related_name='vocab_word')


class Configuration(models.Model):
    userConfig = models.OneToOneField(User, on_delete=models.CASCADE)
    quantity = models.IntegerField(null=True, default=150)
    showChinese = models.BooleanField(default=True)
    currVocab = models.ForeignKey(Vocabulary, on_delete=models.CASCADE, default=3)


class LearnRecord(models.Model):
    learner = models.ForeignKey(User, on_delete=models.CASCADE)
    word = models.ForeignKey(Word, on_delete=models.CASCADE)
    iterations = models.IntegerField(default=0)
    time = models.DateField(auto_now_add=True)