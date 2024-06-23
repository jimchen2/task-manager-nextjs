## Task Manager PWA

- Tailwind CSS
- Password protected
- MongoDB with Mongoose

### Features:
1. Daily task management
   - Auto-copy the most previous day's tasks if today's empty
   - If no prev dates have any tasks
2. Task schema
   - Deadline, brief, details
   - Single tag (school/other/personal)
3. Tag management
4. Historical view (read-only)
   - Search previous dates
5. Data export

### Task Structure:
- Title
- Deadline
- Brief description
- Detailed description
- Tag

### Implementation:
- Frontend: PWA with Tailwind CSS
- Database: MongoDB, Mongoose, NextJS
- Daily task rollover system
- Single Password authentication