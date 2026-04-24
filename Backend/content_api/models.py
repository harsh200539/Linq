from django.db import models
from django.contrib.auth.hashers import make_password, check_password

class AdminUser(models.Model):
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128) # Hashed password
    is_superadmin = models.BooleanField(default=False)
    # Permissions stored as JSON list: ["gallery", "timeline", etc.]
    permissions = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Hash password if it's not already hashed
        if self.password and not self.password.startswith('pbkdf2_sha256$'):
            self.password = make_password(self.password)
        
        # DEBUG: Log permissions to terminal
        print(f"\n[DEBUG] SAVING USER: {self.username}")
        print(f"[DEBUG] PERMISSIONS: {self.permissions}")
        print(f"[DEBUG] IS_SUPER: {self.is_superadmin}\n")
        
        super().save(*args, **kwargs)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return self.username

class GalleryImage(models.Model):
    IMAGE_TYPES = [
        ('a', 'Type A'),
        ('b', 'Type B'),
        ('c', 'Type C'),
    ]
    image = models.ImageField(upload_to='gallery/')
    image_type = models.CharField(max_length=1, choices=IMAGE_TYPES, default='c')
    alt_text = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Gallery Image {self.id} ({self.image_type})"

class Stat(models.Model):
    label = models.CharField(max_length=100)
    value = models.IntegerField()
    suffix = models.CharField(max_length=10, blank=True)

    def __str__(self):
        return f"{self.label}: {self.value}{self.suffix}"

class TimelineItem(models.Model):
    year = models.IntegerField()
    title = models.CharField(max_length=255)
    headline = models.CharField(max_length=255) # Supports <highlight> tag
    description = models.TextField(blank=True)
    thumbnail = models.ImageField(upload_to='timeline/', blank=True, null=True)
    order = models.IntegerField(default=0, editable=False)

    class Meta:
        ordering = ['order', 'id']

    def save(self, *args, **kwargs):
        if not self.pk and self.order == 0:
            max_order = TimelineItem.objects.aggregate(models.Max('order'))['order__max']
            self.order = (max_order or 0) + 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        order = self.order
        super().delete(*args, **kwargs)
        # Shift all subsequent items down by 1
        TimelineItem.objects.filter(order__gt=order).update(order=models.F('order') - 1)

    def __str__(self):
        return f"{self.year} - {self.title}"

class AboutUsSection(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    order = models.IntegerField(default=0, editable=False)

    class Meta:
        ordering = ['order', 'id']

    def save(self, *args, **kwargs):
        if not self.pk and self.order == 0:
            max_order = AboutUsSection.objects.aggregate(models.Max('order'))['order__max']
            self.order = (max_order or 0) + 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class VisionSection(models.Model):
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    description_extended = models.TextField(blank=True)
    image = models.ImageField(upload_to='about_us/', blank=True, null=True)

    def __str__(self):
        return "Vision Section"

class VisionImage(models.Model):
    CATEGORIES = [
        ('MAIN', 'Main Slider'),
        ('BOTTOM', 'Bottom Slider'),
    ]
    image = models.ImageField(upload_to='vision_slider/')
    category = models.CharField(max_length=10, choices=CATEGORIES)
    order = models.IntegerField(default=0, editable=False)

    class Meta:
        ordering = ['category', 'order', 'id']

    def save(self, *args, **kwargs):
        if not self.pk and self.order == 0:
            max_order = VisionImage.objects.filter(category=self.category).aggregate(models.Max('order'))['order__max']
            self.order = (max_order or 0) + 1
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.category} Image {self.id}"

class Testimonial(models.Model):
    CATEGORIES = [
        ('MIDDLE', 'Middle Card'),
        ('RIGHT', 'Right Card'),
    ]
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    quote = models.TextField(blank=True, null=True)
    highlight = models.CharField(max_length=100, blank=True, null=True)
    category = models.CharField(max_length=10, choices=CATEGORIES, default='MIDDLE')
    image = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    is_avatar_only = models.BooleanField(default=False)
    order = models.IntegerField(default=0, editable=False)

    class Meta:
        ordering = ['order', 'id']

    def save(self, *args, **kwargs):
        if not self.pk and self.order == 0:
            max_order = Testimonial.objects.filter(category=self.category).aggregate(models.Max('order'))['order__max']
            self.order = (max_order or 0) + 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        category = self.category
        order = self.order
        super().delete(*args, **kwargs)
        # Shift all subsequent items down by 1 in the same category
        Testimonial.objects.filter(category=category, order__gt=order).update(order=models.F('order') - 1)

    def __str__(self):
        return self.name

class TeamMember(models.Model):
    title = models.CharField(max_length=100)
    desc = models.TextField()
    image = models.ImageField(upload_to='team_photos/')
    order = models.IntegerField(default=0, editable=False)

    class Meta:
        ordering = ['order', 'id']

    def save(self, *args, **kwargs):
        if not self.pk and self.order == 0:
            max_order = TeamMember.objects.aggregate(models.Max('order'))['order__max']
            self.order = (max_order or 0) + 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        order = self.order
        super().delete(*args, **kwargs)
        # Shift all subsequent items down by 1
        TeamMember.objects.filter(order__gt=order).update(order=models.F('order') - 1)

    def __str__(self):
        return self.title
from django.utils.text import slugify

class JobOpening(models.Model):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    ]
    EMPLOYMENT_TYPES = [
        ('Full Time', 'Full Time'),
        ('Part Time', 'Part Time'),
        ('Remote', 'Remote'),
        ('Contract', 'Contract'),
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    
    short_description = models.TextField(max_length=300, blank=True, null=True, help_text="Brief summary for card view (max 300 chars)")
    full_description = models.TextField(blank=True, null=True, help_text="Detailed description for the job page")
    
    context = models.TextField(blank=True, null=True, help_text="Optional context about the role")
    qualifications = models.JSONField(default=list, blank=True, help_text="List of requirements/qualifications")
    
    location = models.CharField(max_length=100, blank=True, null=True)
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPES, default='Full Time')
    
    reporting_to = models.CharField(max_length=100, blank=True, help_text="Who this role reports to")
    application_email = models.EmailField(blank=True, null=True, help_text="Email for receiving applications")
    
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Active')
    status_color = models.CharField(max_length=7, default='#10b981') # Default green
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            # Generate base slug
            base_slug = slugify(self.title)
            if not base_slug:
                base_slug = 'job'
            
            slug = base_slug
            counter = 1
            
            # Ensure uniqueness
            # We exclude the current instance if it already exists (though it shouldn't have a slug then)
            while JobOpening.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            
            self.slug = slug
            
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class CareerGrowthMember(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    description = models.TextField()
    detailed_description = models.TextField()
    # Allow creating/updating members without requiring an image upload.
    image = models.ImageField(upload_to='career_growth/', blank=True, null=True)
    member_bg_class = models.CharField(max_length=50, default='member-bg-primary')
    order = models.IntegerField(default=0, editable=False)

    class Meta:
        ordering = ['order', 'id']

    def save(self, *args, **kwargs):
        if not self.pk and self.order == 0:
            max_order = CareerGrowthMember.objects.aggregate(models.Max('order'))['order__max']
            self.order = (max_order or 0) + 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class MemberExperience(models.Model):
    TYPES = [
        ('hollow', 'Hollow'),
        ('filled', 'Filled'),
    ]
    member = models.ForeignKey(CareerGrowthMember, related_name='experiences', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    year = models.CharField(max_length=20)
    duration = models.CharField(max_length=50)
    description = models.TextField()
    exp_type = models.CharField(max_length=10, choices=TYPES, default='hollow')
    order = models.IntegerField(default=0, editable=False)

    class Meta:
        ordering = ['order', 'id']

    def save(self, *args, **kwargs):
        if not self.pk and self.order == 0:
            max_order = MemberExperience.objects.filter(member=self.member).aggregate(models.Max('order'))['order__max']
            self.order = (max_order or 0) + 1
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.member.name} - {self.title}"
