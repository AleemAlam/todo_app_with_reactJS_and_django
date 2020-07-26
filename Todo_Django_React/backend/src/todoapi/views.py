from django.shortcuts import render, redirect
from rest_framework.decorators import api_view
from .models import Task
from .serializers import TaskSerializer
from  rest_framework.response import Response
# Create your views here.

@api_view(['GET'])
def view_all_task(request):
    task = Task.objects.all()
    serializer = TaskSerializer(task, many = True)    
    return Response(serializer.data)

@api_view(['GET'])
def view_task(request, pk):
    task = Task.objects.get(pk = pk)
    serializer = TaskSerializer(task, many = False)    
    return Response(serializer.data)

@api_view(['POST'])
def create_task(request):
    serializer = TaskSerializer(data = request.data)
    if serializer.is_valid():
        serializer.save()
    return Response('Task Created')


@api_view(['POST'])
def update_task(request, pk):
    task = Task.objects.get(pk = pk)
    serializer = TaskSerializer(data = request.data, instance=task)
    if serializer.is_valid():
        serializer.save()
    return Response('Task Updated')
    
@api_view(['Delete'])
def delete_task(request, pk):
    task = Task.objects.get(pk = pk)
    if task is not None:
        task.delete()
    return Response('Task Delete')