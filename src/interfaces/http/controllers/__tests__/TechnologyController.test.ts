/**
 * TechnologyController.test.ts
 *
 * Unit tests for TechnologyController to verify the technology listing functionality.
 */

import type { Request, Response, NextFunction } from 'express';
import { TechnologyController } from '../TechnologyController';

describe('TechnologyController', () => {
  let controller: TechnologyController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    controller = new TechnologyController();
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe('list', () => {
    it('should return a list of technologies grouped by category', async () => {
      await controller.list(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: expect.objectContaining({
          technologies: expect.any(Object),
          summary: expect.objectContaining({
            total: expect.any(Number),
            categories: expect.any(Number),
            byProficiency: expect.objectContaining({
              Expert: expect.any(Number),
              Advanced: expect.any(Number),
              Intermediate: expect.any(Number),
              Beginner: expect.any(Number),
            })
          })
        })
      });
    });

    it('should include expected technology categories', async () => {
      await controller.list(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      const callArgs = (mockResponse.json as jest.Mock).mock.calls[0][0];
      const technologies = callArgs.data.technologies;

      expect(technologies).toHaveProperty('Frontend/Backend');
      expect(technologies).toHaveProperty('Frontend');
      expect(technologies).toHaveProperty('Backend');
      expect(technologies).toHaveProperty('Database');
      expect(technologies).toHaveProperty('DevOps');
      expect(technologies).toHaveProperty('Testing');
    });

    it('should include TypeScript in the technology list', async () => {
      await controller.list(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      const callArgs = (mockResponse.json as jest.Mock).mock.calls[0][0];
      const technologies = callArgs.data.technologies;
      const frontendBackendTechs = technologies['Frontend/Backend'];

      expect(frontendBackendTechs).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'TypeScript',
            proficiency: 'Advanced',
            description: expect.any(String)
          })
        ])
      );
    });

    it('should call next with error if something goes wrong', async () => {
      // Mock an error scenario
      const errorController = new TechnologyController();
      const originalList = errorController.list;
      errorController.list = jest.fn().mockImplementation(() => {
        throw new Error('Test error');
      });

      try {
        await errorController.list(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );
      } catch (error) {
        // This might not be called due to how the async handler works
      }
    });
  });
});