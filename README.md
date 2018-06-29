#已经部署的版本

·使用腾讯云服务器部署: http://111.230.148.106:5000/ 
·前端使用 nodejs 部署，后端使用 django + uwsgi 部署 
·数据库使用mysql 
·建议使用用户名learner1，密码123456789，数据较为全面 

#前端部署
```
cd frontend
npm install # 安装依赖库
npm start # 挂起前端
```

#后端部署

##安装依赖库
```
cd backend
pip install -r requirements.txt # 安装依赖库
```

##数据库部署
·默认数据库用户名为root，密码为root
·创建数据库english
·创建数据库关系
```
rm -r backend/migrations
python manage.py makemigrations --empty english
python manage.py makemigrations
python manage.py migrate # 创建数据库关系
```

##数据库初始化
```
python init_db.py
```

##挂起后端
```
python manage.py runserver 0.0.0.0:8000 # 挂起后端
```
