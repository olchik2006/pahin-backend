const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }
  next();
};

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': "Ім'я має містити мінімум 2 символи",
    'any.required': "Ім'я є обов'язковим",
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Введіть коректний email',
    'any.required': "Email є обов'язковим",
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Пароль має містити мінімум 6 символів',
    'any.required': "Пароль є обов'язковим",
  }),
  confirm_password: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Паролі не співпадають',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const plantTreeSchema = Joi.object({
  speciesId: Joi.string().uuid().required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  locationName: Joi.string().max(255).optional(),
  message: Joi.string().max(500).optional(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional().messages({
    'string.min': "Ім'я має містити мінімум 2 символи",
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Введіть коректний email',
  }),
})
  .min(1)
  .messages({
    'object.min': 'Потрібно передати хоча б одне поле для оновлення',
  });

module.exports = { validate, registerSchema, loginSchema, plantTreeSchema, updateUserSchema };
