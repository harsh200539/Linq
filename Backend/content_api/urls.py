from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AdminUserViewSet, GalleryImageViewSet, TimelineItemViewSet, VisionSectionViewSet, JobOpeningViewSet, VisionImageViewSet, TestimonialViewSet, TeamMemberViewSet, CareerGrowthMemberViewSet
)

router = DefaultRouter()
router.register(r'admin-users', AdminUserViewSet)
router.register(r'gallery', GalleryImageViewSet)
router.register(r'timeline', TimelineItemViewSet)
router.register(r'vision', VisionSectionViewSet)
router.register(r'vision-images', VisionImageViewSet)
router.register(r'job-openings', JobOpeningViewSet)
router.register(r'testimonials', TestimonialViewSet)
router.register(r'team-members', TeamMemberViewSet)
router.register(r'career-growth-members', CareerGrowthMemberViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
