/* eslint-env jest, node */

jest.mock('../../src/models/species.model', () => ({
  getAllSpecies: jest.fn(),
}));

const speciesModel = require('../../src/models/species.model');
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
      { id: 1, name: 'Oak' },
      { id: 2, name: 'Pine' },
    ];
    speciesModel.getAllSpecies.mockResolvedValue(species);

    await speciesController.getSpecies(req, res);

    expect(speciesModel.getAllSpecies).toHaveBeenCalledTimes(1);
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
    speciesModel.getAllSpecies.mockRejectedValue(new Error('DB error'));

    await speciesController.getSpecies(req, res);

    expect(speciesModel.getAllSpecies).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Internal server error',
    });

    consoleSpy.mockRestore();
  });
});
