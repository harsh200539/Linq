from django.contrib import admin
from .models import GalleryImage, TimelineItem, VisionSection, AboutUsSection, VisionImage, Testimonial, TeamMember, CareerGrowthMember, MemberExperience, JobOpening

class BaseAdmin(admin.ModelAdmin):
    class Media:
        css = {
            'all': ('admin/css/custom_admin.css',)
        }

@admin.register(JobOpening)
class JobOpeningAdmin(BaseAdmin):
    list_display = ('title', 'location', 'employment_type', 'status', 'created_at')
    list_filter = ('status', 'employment_type', 'location')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'full_description', 'short_description')

@admin.register(GalleryImage)
class GalleryImageAdmin(BaseAdmin):
    list_display = ('id', 'image_type', 'alt_text')
    list_filter = ('image_type',)

@admin.register(TimelineItem)
class TimelineItemAdmin(BaseAdmin):
    list_display = ('year', 'title', 'order')

@admin.register(AboutUsSection)
class AboutUsSectionAdmin(BaseAdmin):
    list_display = ('title', 'order')

@admin.register(VisionSection)
class VisionSectionAdmin(BaseAdmin):
    pass

@admin.register(VisionImage)
class VisionImageAdmin(BaseAdmin):
    list_display = ('id', 'category', 'order')
    list_filter = ('category',)

@admin.register(Testimonial)
class TestimonialAdmin(BaseAdmin):
    list_display = ('name', 'role', 'order')

@admin.register(TeamMember)
class TeamMemberAdmin(BaseAdmin):
    list_display = ('title', 'order')

# Career Growth Admin
class MemberExperienceInline(admin.TabularInline):
    model = MemberExperience
    extra = 1

@admin.register(CareerGrowthMember)
class CareerGrowthMemberAdmin(BaseAdmin):
    list_display = ('name', 'role', 'order')
    inlines = [MemberExperienceInline]

admin.site.site_header = "LINQ Corporate Admin"
admin.site.site_title = "LINQ Admin Portal"
admin.site.index_title = "Welcome to LINQ Content Management"
