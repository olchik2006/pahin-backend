/* eslint-env jest, node */

jest.mock('../../src/models/tree.model', () => ({
  getAllTrees: jest.fn(),
  countTrees: jest.fn(),
  findTreeById: jest.fn(),
  createTree: jest.fn(),
  getTreesByUserId: jest.fn(),
}));

jest.mock('../../src/models/species.model', () => ({
  getAllSpecies: jest.fn(),
}));

const treeModel = require('../../src/models/tree.model');
const speciesModel = require('../../src/models/species.model');
const treeService = require('../../src/services/tree.service');

describe('tree.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTrees', () => {
    test('should return trees without pagination when page and limit are not provided', async () => {
      const filters = {
        species: 'Oak',
        region: 'Lviv',
        dateFrom: '2026-01-01',
        dateTo: '2026-12-31',
      };

      const trees = [{ id: 1 }, { id: 2 }];
      treeModel.getAllTrees.mockResolvedValue(trees);

      const result = await treeService.getAllTrees(filters);

      expect(treeModel.getAllTrees).toHaveBeenCalledWith({
        species: 'Oak',
        region: 'Lviv',
        dateFrom: '2026-01-01',
        dateTo: '2026-12-31',
        page: undefined,
        limit: undefined,
      });

      expect(treeModel.countTrees).not.toHaveBeenCalled();
      expect(result).toEqual({ data: trees });
    });

    test('should return paginated result when page and limit are provided', async () => {
      const filters = {
        page: '2',
        limit: '5',
        species: 'Pine',
        region: 'Kyiv',
        dateFrom: '2026-01-01',
        dateTo: '2026-12-31',
      };

      const trees = [{ id: 6 }, { id: 7 }];
      treeModel.getAllTrees.mockResolvedValue(trees);
      treeModel.countTrees.mockResolvedValue(12);

      const result = await treeService.getAllTrees(filters);

      expect(treeModel.getAllTrees).toHaveBeenCalledWith({
        species: 'Pine',
        region: 'Kyiv',
        dateFrom: '2026-01-01',
        dateTo: '2026-12-31',
        page: '2',
        limit: '5',
      });

      expect(treeModel.countTrees).toHaveBeenCalledWith({
        species: 'Pine',
        region: 'Kyiv',
        dateFrom: '2026-01-01',
        dateTo: '2026-12-31',
      });

      expect(result).toEqual({
        data: trees,
        total: 12,
        page: 2,
        totalPages: 3,
      });
    });
  });

  describe('getTreeById', () => {
    test('should return tree by id', async () => {
      const tree = { id: 10, name: 'Test tree' };
      treeModel.findTreeById.mockResolvedValue(tree);

      const result = await treeService.getTreeById(10);

      expect(treeModel.findTreeById).toHaveBeenCalledWith(10);
      expect(result).toEqual(tree);
    });
  });

  describe('createTree', () => {
    test('should create tree', async () => {
      const data = {
        speciesId: 1,
        latitude: 49.84,
        longitude: 24.03,
        plantedBy: 2,
      };

      const createdTree = { id: 1, ...data };
      treeModel.createTree.mockResolvedValue(createdTree);

      const result = await treeService.createTree(data);

      expect(treeModel.createTree).toHaveBeenCalledWith(data);
      expect(result).toEqual(createdTree);
    });
  });

  describe('getTreesByUserId', () => {
    test('should return trees by user id', async () => {
      const trees = [{ id: 1 }, { id: 2 }];
      treeModel.getTreesByUserId.mockResolvedValue(trees);

      const result = await treeService.getTreesByUserId(3);

      expect(treeModel.getTreesByUserId).toHaveBeenCalledWith(3);
      expect(result).toEqual(trees);
    });
  });

  describe('getAllSpecies', () => {
    test('should return all species', async () => {
      const species = [
        { id: 1, name: 'Oak' },
        { id: 2, name: 'Pine' },
      ];
      speciesModel.getAllSpecies.mockResolvedValue(species);

      const result = await treeService.getAllSpecies();

      expect(speciesModel.getAllSpecies).toHaveBeenCalledTimes(1);
      expect(result).toEqual(species);
    });
  });
});
