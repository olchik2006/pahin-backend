/* eslint-env jest, node */

jest.mock('../../src/services/tree.service', () => ({
  getAllTrees: jest.fn(),
  getAllSpecies: jest.fn(),
  getTreeById: jest.fn(),
  createTree: jest.fn(),
  deleteTree: jest.fn(),
}));

const treeService = require('../../src/services/tree.service');
const AppError = require('../../src/utils/AppError');
const treesController = require('../../src/controllers/trees.controller');

const VALID_UUID = 'f19c0bd7-486c-42a0-ba75-0e44242fad1a';

const flushPromises = () => new Promise(process.nextTick);

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('trees.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTrees', () => {
    test('should return trees list with query filters', async () => {
      const req = {
        query: {
          page: '1',
          limit: '10',
          species: 'Oak',
          region: 'Lviv',
          dateFrom: '2026-01-01',
          dateTo: '2026-12-31',
        },
      };
      const res = mockResponse();
      const next = jest.fn();

      const result = {
        data: [{ id: 1 }, { id: 2 }],
        total: 2,
        page: 1,
        totalPages: 1,
      };

      treeService.getAllTrees.mockResolvedValue(result);

      await treesController.getAllTrees(req, res, next);

      expect(treeService.getAllTrees).toHaveBeenCalledWith({
        page: '1',
        limit: '10',
        species: 'Oak',
        region: 'Lviv',
        dateFrom: '2026-01-01',
        dateTo: '2026-12-31',
      });
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        ...result,
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('getSpecies', () => {
    test('should return all species', async () => {
      const req = {};
      const res = mockResponse();
      const next = jest.fn();

      const species = [
        { id: 1, name: 'Oak' },
        { id: 2, name: 'Pine' },
      ];
      treeService.getAllSpecies.mockResolvedValue(species);

      await treesController.getSpecies(req, res, next);

      expect(treeService.getAllSpecies).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        message: 'success',
        status: 200,
        data: { species },
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('getTreeById', () => {
    test('should call next with AppError 400 for invalid uuid', async () => {
      const req = { params: { id: 'bad-id' } };
      const res = mockResponse();
      const next = jest.fn();

      await treesController.getTreeById(req, res, next);
      await flushPromises();

      expect(treeService.getTreeById).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].message).toBe('Invalid tree ID format');
      expect(next.mock.calls[0][0].statusCode).toBe(400);
    });

    test('should call next with AppError 404 when tree not found', async () => {
      const req = { params: { id: VALID_UUID } };
      const res = mockResponse();
      const next = jest.fn();

      treeService.getTreeById.mockResolvedValue(null);

      await treesController.getTreeById(req, res, next);
      await flushPromises();

      expect(treeService.getTreeById).toHaveBeenCalledWith(VALID_UUID);
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].message).toBe('Tree not found');
      expect(next.mock.calls[0][0].statusCode).toBe(404);
    });

    test('should return tree when uuid is valid and tree exists', async () => {
      const req = { params: { id: VALID_UUID } };
      const res = mockResponse();
      const next = jest.fn();

      const tree = { id: VALID_UUID, speciesId: 1 };
      treeService.getTreeById.mockResolvedValue(tree);

      await treesController.getTreeById(req, res, next);

      expect(treeService.getTreeById).toHaveBeenCalledWith(VALID_UUID);
      expect(res.json).toHaveBeenCalledWith({
        message: 'success',
        status: 200,
        data: { tree },
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('plantTree', () => {
    test('should create tree and return 201', async () => {
      const req = {
        user: { id: 7 },
        body: {
          speciesId: 1,
          latitude: 49.84,
          longitude: 24.03,
          locationName: 'Lviv',
          message: 'Planted with love',
        },
      };
      const res = mockResponse();
      const next = jest.fn();

      const tree = {
        id: VALID_UUID,
        userId: 7,
        speciesId: 1,
        latitude: 49.84,
        longitude: 24.03,
        locationName: 'Lviv',
        message: 'Planted with love',
      };

      treeService.createTree.mockResolvedValue(tree);

      await treesController.plantTree(req, res, next);

      expect(treeService.createTree).toHaveBeenCalledWith({
        userId: 7,
        speciesId: 1,
        latitude: 49.84,
        longitude: 24.03,
        locationName: 'Lviv',
        message: 'Planted with love',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Tree planted successfully',
        status: 201,
        data: { tree },
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('deleteTree', () => {
    test('should call next with AppError 400 for invalid uuid', async () => {
      const req = { params: { id: 'bad-id' }, user: { id: 7 } };
      const res = mockResponse();
      const next = jest.fn();

      await treesController.deleteTree(req, res, next);
      await flushPromises();

      expect(treeService.deleteTree).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].message).toBe('Invalid tree ID format');
      expect(next.mock.calls[0][0].statusCode).toBe(400);
    });

    test('should call next with AppError 404 when tree not found or not owner', async () => {
      const req = { params: { id: VALID_UUID }, user: { id: 7 } };
      const res = mockResponse();
      const next = jest.fn();

      treeService.deleteTree.mockResolvedValue(null);

      await treesController.deleteTree(req, res, next);
      await flushPromises();

      expect(treeService.deleteTree).toHaveBeenCalledWith(VALID_UUID, 7);
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].message).toBe('Tree not found or you are not the owner');
      expect(next.mock.calls[0][0].statusCode).toBe(404);
    });

    test('should return 204 when tree is deleted', async () => {
      const req = { params: { id: VALID_UUID }, user: { id: 7 } };
      const res = mockResponse();
      const next = jest.fn();

      treeService.deleteTree.mockResolvedValue({ id: VALID_UUID });

      await treesController.deleteTree(req, res, next);

      expect(treeService.deleteTree).toHaveBeenCalledWith(VALID_UUID, 7);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
