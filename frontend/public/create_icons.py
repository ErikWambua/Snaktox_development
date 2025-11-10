from PIL import Image, ImageDraw
import os

# Create icons directory if it doesn't exist
os.makedirs('icons', exist_ok=True)

# Icon sizes needed
sizes = [72, 96, 128, 144, 152, 192, 384, 512]

for size in sizes:
    # Create a new image with a white background
    img = Image.new('RGB', (size, size), color='#3b82f6')
    draw = ImageDraw.Draw(img)
    
    # Draw a simple snake icon (S letter)
    draw.ellipse([size*0.2, size*0.2, size*0.8, size*0.8], outline='white', width=max(2, size//64))
    
    # Save the image
    img.save(f'icons/icon-{size}x{size}.png', 'PNG')
    print(f'Created icon-{size}x{size}.png')

print('All icons created!')