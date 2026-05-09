/* eslint-env jest, node */

jest.mock('../../src/services/tree.service', () => ({
  getAllSpecies: jest.fn(),
}));

const treeService = require('../../src/services/tree.service');
const speciesController = require('../../src/controllers/species.controller');

describe('species.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return species with 200', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const species = [
      {
        id: 1,
        name: 'Oak',
        info: {
          ground: 'суглинок',
          sun: 'помірний',
          location: 'всі регіони',
          distance: '5',
        },
      },
      {
        id: 2,
        name: 'Pine',
        info: {
          ground: 'пісок',
          sun: 'сонячний',
          location: 'захід',
          distance: '3',
        },
      },
    ];
    treeService.getAllSpecies.mockResolvedValue(species);

    await speciesController.getSpecies(req, res);

    expect(treeService.getAllSpecies).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(species);
  });

  test('should return 500 when model throws error', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    treeService.getAllSpecies.mockRejectedValue(new Error('DB error'));

    await speciesController.getSpecies(req, res);

    expect(treeService.getAllSpecies).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });

    consoleSpy.mockRestore();
  });
});
