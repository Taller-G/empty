# Technologies API Documentation

## Overview
The Technologies API provides endpoints to list technologies in a clear and readable format, organized by categories and proficiency levels.

## Endpoints

### GET /api/v1/technologies
Retrieves a comprehensive list of technologies grouped by category.

#### Response Format
```json
{
  "data": {
    "technologies": {
      "Frontend/Backend": [
        {
          "name": "TypeScript",
          "proficiency": "Advanced",
          "description": "Strongly typed superset of JavaScript for building scalable applications"
        }
      ],
      "Frontend": [
        {
          "name": "React",
          "proficiency": "Advanced", 
          "description": "Component-based library for building user interfaces"
        },
        {
          "name": "Angular",
          "proficiency": "Intermediate",
          "description": "Full-featured framework for building web applications"
        }
      ],
      "Backend": [...],
      "Database": [...],
      "DevOps": [...],
      "Testing": [...]
    },
    "summary": {
      "total": 26,
      "categories": 6,
      "byProficiency": {
        "Expert": 1,
        "Advanced": 8,
        "Intermediate": 17,
        "Beginner": 0
      }
    }
  }
}
```

#### Technology Categories
- **Frontend/Backend**: Technologies used in both client and server-side development
- **Frontend**: Client-side web development technologies
- **Backend**: Server-side development technologies
- **Database**: Data storage and management technologies
- **DevOps**: Development operations and deployment tools
- **Testing**: Testing frameworks and tools

#### Proficiency Levels
- **Expert**: Deep expertise and extensive experience
- **Advanced**: Strong skills and comprehensive knowledge
- **Intermediate**: Good working knowledge and experience
- **Beginner**: Basic understanding and limited experience

## Example Usage

### JavaScript/TypeScript
```typescript
const response = await fetch('/api/v1/technologies');
const data = await response.json();

console.log(`Total technologies: ${data.data.summary.total}`);
console.log('Frontend technologies:', data.data.technologies.Frontend);
```

### cURL
```bash
curl -X GET http://localhost:3000/api/v1/technologies \
  -H "Accept: application/json"
```

## Features
- ✅ Clear and readable technology list
- ✅ Organized by categories for easy navigation
- ✅ Proficiency levels for each technology
- ✅ Descriptive information for context
- ✅ Summary statistics
- ✅ JSON format for easy integration
- ✅ RESTful API design