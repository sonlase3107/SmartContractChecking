"""BE URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from BE import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('smartconstract/',include('smartconstract.urls')),
    path('login',views.loginpage),
    path('context/',include('context.urls')),
    path('ltl/',include('LTLpro.urls')),
    path('ltltemplate/',include('ltltemplate.urls')),
    path('cpncontext/',include('cpncontext.urls')),
    path('auth/', include('account.urls')),
    path('select-sc/', include('Transactions.urls')),
    path('tools/',include('tools.urls')),
]
