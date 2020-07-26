from django.urls import path
from . import views

urlpatterns = [
    path('', views.view_all_task, name = 'view_all_task'),
    path('task/<int:pk>/', views.view_task, name = 'view_task'),
    path('create_task/', views.create_task, name = 'create_task'),
    path('update_task/<int:pk>/', views.update_task, name = 'update_task'),
    path('delete_task/<int:pk>/', views.delete_task, name = 'delete_task'),

]