# Restaurant Finder API (Multer Version)

## Overview
This project extends the Restaurant Finder API by integrating image uploads using Multer.

Supported uploads:
- User → ONE profile picture (2MB max)
- Restaurant → ONE cover image (5MB max)
- Product → UP TO 5 images (5MB each)

All files:
- Are validated by MIME type
- Stored on disk in organized folders
- Saved in the database as relative paths
- Deleted automatically on update or delete

---

## Installation

```bash
nyarn add
