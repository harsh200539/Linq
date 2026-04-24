from rest_framework import serializers
from .models import AdminUser, GalleryImage, TimelineItem, VisionSection, JobOpening, VisionImage, Testimonial, TeamMember, CareerGrowthMember, MemberExperience

class AdminUserSerializer(serializers.ModelSerializer):
    permissions = serializers.JSONField(required=False, default=list)

    class Meta:
        model = AdminUser
        fields = ['id', 'username', 'password', 'is_superadmin', 'permissions', 'created_at']
        extra_kwargs = {
            'password': {'write_only': True}
        }

class JobOpeningSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobOpening
        fields = '__all__'

class JobOpeningListSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobOpening
        fields = ['id', 'title', 'slug', 'short_description', 'location', 'employment_type', 'status', 'status_color', 'created_at']

class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = '__all__'

class TimelineItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimelineItem
        fields = '__all__'

class VisionSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisionSection
        fields = '__all__'

class VisionImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisionImage
        fields = '__all__'

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'

class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = '__all__'

class MemberExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemberExperience
        fields = ['id', 'title', 'year', 'duration', 'description', 'exp_type', 'order']

class CareerGrowthMemberSerializer(serializers.ModelSerializer):
    experiences = MemberExperienceSerializer(many=True, required=False)
    # Allow the image to be optional on create/update and tolerates empty uploads.
    image = serializers.ImageField(required=False, allow_null=True, allow_empty_file=True)

    class Meta:
        model = CareerGrowthMember
        fields = ['id', 'name', 'role', 'description', 'detailed_description', 'image', 'member_bg_class', 'order', 'experiences']

    def create(self, validated_data):
        experiences_data = validated_data.pop('experiences', [])

        # If image is missing or empty, don't include it so model can use its default (blank/null).
        image = validated_data.pop('image', serializers.empty)
        if image in (serializers.empty, None, ''):
            member = CareerGrowthMember.objects.create(**validated_data)
        else:
            member = CareerGrowthMember.objects.create(image=image, **validated_data)

        for exp_data in experiences_data:
            MemberExperience.objects.create(member=member, **exp_data)
        return member

    def update(self, instance, validated_data):
        experiences_data = validated_data.pop('experiences', None)

        # Handle image updates only if a new file is provided.
        image = validated_data.pop('image', serializers.empty)
        if image not in (serializers.empty, None, ''):
            instance.image = image

        # Update other member fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # If experiences are provided, replace existing ones
        if experiences_data is not None:
            instance.experiences.all().delete()
            for exp_data in experiences_data:
                MemberExperience.objects.create(member=instance, **exp_data)
        
        return instance
