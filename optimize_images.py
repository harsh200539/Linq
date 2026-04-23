import os
from PIL import Image

def optimize_images(directory, threshold_kb=250):
    """
    Scans the specified directory for large images and compresses them to save space.
    Target quality is set to 75% which typically yields 80-90% size reduction with minimal visual loss.
    """
    optimized_count = 0
    total_saved_kb = 0

    print(f"--- Starting Image Optimization in {directory} ---")
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.webp', '.png', '.jpg', '.jpeg')):
                filepath = os.path.join(root, file)
                size_kb = os.path.getsize(filepath) / 1024
                
                if size_kb > threshold_kb:
                    orig_size = size_kb
                    try:
                        with Image.open(filepath) as img:
                            # Use high compression for WebP (most common in this project)
                            if file.lower().endswith('.webp'):
                                img.save(filepath, 'WEBP', quality=75, method=6)
                            else:
                                # For PNG/JPG, convert to WebP or just compress
                                img.save(filepath, quality=75, optimize=True)
                            
                        new_size_kb = os.path.getsize(filepath) / 1024
                        saved = orig_size - new_size_kb
                        total_saved_kb += saved
                        optimized_count += 1
                        print(f"Optimized: {file}")
                        print(f"  {orig_size:.1f}KB -> {new_size_kb:.1f}KB (Saved {saved:.1f}KB)")
                    except Exception as e:
                        print(f"Error optimizing {file}: {e}")

    print("\n--- Optimization Complete ---")
    print(f"Files Optimized: {optimized_count}")
    print(f"Total Disk Space Saved: {total_saved_kb/1024:.2f} MB")

if __name__ == "__main__":
    # Ensure we are in the right directory from the project root
    target_dir = os.path.join(os.getcwd(), 'src', 'images')
    if os.path.exists(target_dir):
        optimize_images(target_dir)
    else:
        print(f"Error: Could not find directory {target_dir}")
