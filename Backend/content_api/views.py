from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from .models import AdminUser, GalleryImage, TimelineItem, VisionSection, JobOpening, VisionImage, Testimonial, TeamMember, CareerGrowthMember
from .serializers import (
    AdminUserSerializer, GalleryImageSerializer, TimelineItemSerializer,
    VisionSectionSerializer, JobOpeningSerializer, JobOpeningListSerializer, VisionImageSerializer, TestimonialSerializer, TeamMemberSerializer, CareerGrowthMemberSerializer
)

class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = AdminUser.objects.all()
    serializer_class = AdminUserSerializer

    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        try:
            user = AdminUser.objects.get(username=username)
            if user.check_password(password):
                serializer = self.get_serializer(user)
                return Response({
                    'status': 'success',
                    'user': serializer.data
                })
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except AdminUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

from django.shortcuts import get_object_or_404

class JobOpeningViewSet(viewsets.ModelViewSet):
    queryset = JobOpening.objects.all()
    lookup_field = 'slug'

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        lookup_value = self.kwargs[lookup_url_kwarg]

        # Try to find by ID first if it's numeric
        if lookup_value.isdigit():
            try:
                return get_object_or_404(queryset, id=lookup_value)
            except:
                pass # If not found by ID, try slug

        # Fallback to slug lookup
        filter_kwargs = {self.lookup_field: lookup_value}
        obj = get_object_or_404(queryset, **filter_kwargs)
        self.check_object_permissions(self.request, obj)
        return obj

    def get_serializer_class(self):
        if self.action == 'list':
            return JobOpeningListSerializer
        return JobOpeningSerializer

class GalleryImageViewSet(viewsets.ModelViewSet):
    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageSerializer

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

class TimelineItemViewSet(viewsets.ModelViewSet):
    queryset = TimelineItem.objects.all()
    serializer_class = TimelineItemSerializer

    @action(detail=False, methods=['post'])
    def reorder(self, request):
        ordered_ids = request.data.get('ordered_ids', [])
        user_id = request.data.get('user_id')

        # Permission check
        try:
            user = AdminUser.objects.get(id=user_id)
            if not user.is_superadmin and 'timeline_edit' not in (user.permissions or []):
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        except:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

        if not isinstance(ordered_ids, list):
            return Response({'error': 'Invalid payload'}, status=status.HTTP_400_BAD_REQUEST)

        for index, t_id in enumerate(ordered_ids):
            try:
                item = TimelineItem.objects.get(id=t_id)
                item.order = index + 1
                item.save(update_fields=['order'])
            except TimelineItem.DoesNotExist:
                continue

        return Response({'status': 'reordered'})

class VisionSectionViewSet(viewsets.ModelViewSet):
    queryset = VisionSection.objects.all()
    serializer_class = VisionSectionSerializer

class VisionImageViewSet(viewsets.ModelViewSet):
    queryset = VisionImage.objects.all()
    serializer_class = VisionImageSerializer


class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer

    @action(detail=False, methods=['post'])
    def reorder(self, request):
        category = request.data.get('category')
        ordered_ids = request.data.get('ordered_ids', [])
        user_id = request.data.get('user_id')

        # Permission check
        try:
            user = AdminUser.objects.get(id=user_id)
            if not user.is_superadmin and 'testimonials_edit' not in (user.permissions or []):
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        except:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

        if not category or not isinstance(ordered_ids, list):
            return Response({'error': 'Invalid payload'}, status=status.HTTP_400_BAD_REQUEST)

        # Bulk update orders based on the index in the array
        for index, t_id in enumerate(ordered_ids):
            try:
                testimonial = Testimonial.objects.get(id=t_id, category=category)
                testimonial.order = index + 1
                testimonial.save(update_fields=['order'])
            except Testimonial.DoesNotExist:
                continue

        return Response({'status': 'reordered'})

class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer

    @action(detail=False, methods=['post'])
    def reorder(self, request):
        ordered_ids = request.data.get('ordered_ids', [])
        user_id = request.data.get('user_id')

        # Permission check
        try:
            user = AdminUser.objects.get(id=user_id)
            if not user.is_superadmin and 'team_edit' not in (user.permissions or []):
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        except:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

        if not isinstance(ordered_ids, list):
            return Response({'error': 'Invalid payload'}, status=status.HTTP_400_BAD_REQUEST)

        for index, m_id in enumerate(ordered_ids):
            try:
                member = TeamMember.objects.get(id=m_id)
                member.order = index + 1
                member.save(update_fields=['order'])
            except TeamMember.DoesNotExist:
                continue

        return Response({'status': 'reordered'})

class CareerGrowthMemberViewSet(viewsets.ModelViewSet):
    queryset = CareerGrowthMember.objects.all()
    serializer_class = CareerGrowthMemberSerializer

    @action(detail=False, methods=['post'])
    def reorder(self, request):
        ordered_ids = request.data.get('ordered_ids', [])
        user_id = request.data.get('user_id')

        # Permission check
        try:
            user = AdminUser.objects.get(id=user_id)
            if not user.is_superadmin and 'growth_edit' not in (user.permissions or []):
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        except:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

        if not isinstance(ordered_ids, list):
            return Response({'error': 'Invalid payload'}, status=status.HTTP_400_BAD_REQUEST)

        for index, m_id in enumerate(ordered_ids):
            try:
                member = CareerGrowthMember.objects.get(id=m_id)
                member.order = index + 1
                member.save(update_fields=['order'])
            except CareerGrowthMember.DoesNotExist:
                continue

        return Response({'status': 'reordered'})
