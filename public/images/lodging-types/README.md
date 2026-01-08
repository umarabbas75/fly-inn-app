# Lodging Types Images

This folder contains all images used for the lodging type dropdown/categories in the Fly-Inn application.

**Source:** `src/constants/index.js` - `LODGING_TYPES_DROPDOWN` array (lines 522-614)

**Total Images:** 13 files (~472 KB)

---

## Image Mapping

### Lodging Type → Image

| Lodging Type | Image File | Size |
|-------------|------------|------|
| Apt. / Condo / Loft | `homedwelling11.webp` | 29 KB |
| Bed & Breakfast | `homedwelling2.webp` | 23 KB |
| Beachfront | `homedwelling2b.webp` | 35 KB |
| Cabin | `homedwelling3.webp` | 47 KB |
| Campsite | `homedwelling4.webp` | 39 KB |
| Farm | `homedwelling6.webp` | 37 KB |
| Hangar | `homedwelling7.webp` | 21 KB |
| Hangar Home | `homedwelling8.webp` | 27 KB |
| House | `homedwelling9.webp` | 24 KB |
| Hotel Room | `homedwelling14.webp` | 32 KB |
| Mansion | `homedwelling12.webp` | 25 KB |
| Novelty | `homedwelling14.webp` | 32 KB *(same as Hotel Room)* |
| RV | `rv.png` | 56 KB |
| RV Pad | `rvpad.png` | 50 KB |
| Tiny Home | `homedwelling14.webp` | 32 KB *(same as Hotel Room)* |

---

## Notes

- **Duplicate Images:**
  - `homedwelling14.webp` is used for 3 lodging types: Hotel Room, Novelty, Tiny Home

- **Format:**
  - 11 WebP images (modern, optimized)
  - 2 PNG images (RV types)

- **Original Location:** `public/images/all/`

- **New Location:** `public/images/lodging-types/`

---

## Usage in Code

```javascript
// Original path
image: "images/all/homedwelling11.webp"

// If updating to use new folder:
image: "images/lodging-types/homedwelling11.webp"
```

---

## File Details

### WebP Images (optimized for web)
- homedwelling2.webp - 23 KB
- homedwelling2b.webp - 35 KB
- homedwelling3.webp - 47 KB
- homedwelling4.webp - 39 KB
- homedwelling6.webp - 37 KB
- homedwelling7.webp - 21 KB
- homedwelling8.webp - 27 KB
- homedwelling9.webp - 24 KB
- homedwelling11.webp - 29 KB
- homedwelling12.webp - 25 KB
- homedwelling14.webp - 32 KB

### PNG Images
- rv.png - 56 KB
- rvpad.png - 50 KB

---

**Status:** ✅ All images copied and organized
**Backward Compatibility:** ✅ Original images remain in `images/all/` - no code changes needed

