/**
 * TechnologyController
 *
 * HTTP controller for technology-related endpoints.
 * Handles listing of technologies in a clear and readable format.
 *
 * Layer: Interfaces.
 */

import type { Request, Response, NextFunction } from 'express';

interface Technology {
  name: string;
  category: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  description: string;
}

export class TechnologyController {
  // GET /technologies
  list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const technologies: Technology[] = [
        // Frontend Technologies
        {
          name: 'TypeScript',
          category: 'Frontend/Backend',
          proficiency: 'Advanced',
          description: 'Strongly typed superset of JavaScript for building scalable applications'
        },
        {
          name: 'React',
          category: 'Frontend',
          proficiency: 'Advanced',
          description: 'Component-based library for building user interfaces'
        },
        {
          name: 'Angular',
          category: 'Frontend',
          proficiency: 'Intermediate',
          description: 'Full-featured framework for building web applications'
        },
        {
          name: 'Vue.js',
          category: 'Frontend',
          proficiency: 'Intermediate',
          description: 'Progressive framework for building user interfaces'
        },
        {
          name: 'HTML5',
          category: 'Frontend',
          proficiency: 'Expert',
          description: 'Markup language for structuring web content'
        },
        {
          name: 'CSS3',
          category: 'Frontend',
          proficiency: 'Advanced',
          description: 'Style sheet language for designing web interfaces'
        },
        {
          name: 'Sass/SCSS',
          category: 'Frontend',
          proficiency: 'Advanced',
          description: 'CSS preprocessor with variables, nesting, and mixins'
        },
        {
          name: 'Tailwind CSS',
          category: 'Frontend',
          proficiency: 'Advanced',
          description: 'Utility-first CSS framework for rapid UI development'
        },
        
        // Backend Technologies
        {
          name: 'Node.js',
          category: 'Backend',
          proficiency: 'Advanced',
          description: 'JavaScript runtime for server-side development'
        },
        {
          name: 'Express.js',
          category: 'Backend',
          proficiency: 'Advanced',
          description: 'Web framework for Node.js applications'
        },
        {
          name: 'NestJS',
          category: 'Backend',
          proficiency: 'Intermediate',
          description: 'Progressive Node.js framework for building scalable server-side applications'
        },
        {
          name: 'Python',
          category: 'Backend',
          proficiency: 'Intermediate',
          description: 'High-level programming language for web development and data science'
        },
        {
          name: 'Django',
          category: 'Backend',
          proficiency: 'Intermediate',
          description: 'High-level Python web framework'
        },
        
        // Databases
        {
          name: 'PostgreSQL',
          category: 'Database',
          proficiency: 'Advanced',
          description: 'Open-source relational database management system'
        },
        {
          name: 'MongoDB',
          category: 'Database',
          proficiency: 'Intermediate',
          description: 'NoSQL document-oriented database'
        },
        {
          name: 'MySQL',
          category: 'Database',
          proficiency: 'Intermediate',
          description: 'Popular open-source relational database'
        },
        {
          name: 'Redis',
          category: 'Database',
          proficiency: 'Intermediate',
          description: 'In-memory data structure store for caching and sessions'
        },
        
        // DevOps & Tools
        {
          name: 'Docker',
          category: 'DevOps',
          proficiency: 'Intermediate',
          description: 'Containerization platform for application deployment'
        },
        {
          name: 'Git',
          category: 'DevOps',
          proficiency: 'Advanced',
          description: 'Distributed version control system'
        },
        {
          name: 'GitHub Actions',
          category: 'DevOps',
          proficiency: 'Intermediate',
          description: 'CI/CD platform for automating workflows'
        },
        {
          name: 'AWS',
          category: 'DevOps',
          proficiency: 'Intermediate',
          description: 'Cloud computing services platform'
        },
        {
          name: 'Jest',
          category: 'Testing',
          proficiency: 'Advanced',
          description: 'JavaScript testing framework'
        },
        {
          name: 'Cypress',
          category: 'Testing',
          proficiency: 'Intermediate',
          description: 'End-to-end testing framework for web applications'
        }
      ];

      // Group technologies by category for better readability
      const groupedTechnologies = technologies.reduce((acc, tech) => {
        if (!acc[tech.category]) {
          acc[tech.category] = [];
        }
        acc[tech.category].push({
          name: tech.name,
          proficiency: tech.proficiency,
          description: tech.description
        });
        return acc;
      }, {} as Record<string, Omit<Technology, 'category'>[]>);

      res.status(200).json({
        data: {
          technologies: groupedTechnologies,
          summary: {
            total: technologies.length,
            categories: Object.keys(groupedTechnologies).length,
            byProficiency: {
              Expert: technologies.filter(t => t.proficiency === 'Expert').length,
              Advanced: technologies.filter(t => t.proficiency === 'Advanced').length,
              Intermediate: technologies.filter(t => t.proficiency === 'Intermediate').length,
              Beginner: technologies.filter(t => t.proficiency === 'Beginner').length,
            }
          }
        }
      });
    } catch (err) {
      next(err);
    }
  };
}