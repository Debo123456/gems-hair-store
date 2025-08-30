# Product Images

This folder contains SVG placeholder images for your hair care products. These are simple, colorful placeholders that you can replace with actual product photos.

## Current Images

- **argan-shampoo.svg** - Purple theme for hair care products
- **hydrating-conditioner.svg** - Green theme for conditioning products  
- **anti-frizz-serum.svg** - Yellow/Orange theme for treatment products
- **hair-mask.svg** - Pink theme for intensive treatments
- **styling-gel.svg** - Blue theme for styling products

## How to Use

1. **Replace with Real Photos**: Upload your actual product photos with the same filenames
2. **Supported Formats**: JPG, PNG, WebP, SVG
3. **Recommended Size**: 400x400 pixels or larger (maintains aspect ratio)
4. **File Naming**: Keep the same filenames to maintain compatibility

## Customization

### Option 1: Replace with Real Photos
- Take photos of your actual products
- Resize to 400x400 pixels or larger
- Save with the same filenames (e.g., `argan-shampoo.jpg`)
- Replace the SVG files

### Option 2: Modify SVG Colors
- Edit the SVG files to change colors
- Update the `fill` attributes in the SVG code
- Use your brand colors for consistency

### Option 3: Add More Products
- Create new SVG files for additional products
- Update `lib/productImages.ts` to include new mappings
- Follow the same naming convention

## File Structure

```
public/images/products/
├── argan-shampoo.svg
├── hydrating-conditioner.svg
├── anti-frizz-serum.svg
├── hair-mask.svg
├── styling-gel.svg
└── README.md
```

## Code Integration

The images are automatically used by:
- `lib/productImages.ts` - Image path management
- `lib/productSearch.ts` - Mock product data
- `components/ProductCard.tsx` - Product display component

## Tips

- **Consistent Sizing**: Keep all images the same dimensions for uniform appearance
- **High Quality**: Use high-resolution images for better display on all devices
- **Brand Consistency**: Use consistent styling and colors across all product images
- **File Optimization**: Compress images for faster loading while maintaining quality
