require('dotenv').config();
const { pool } = require('../config/database');

const BASE_URL = 'https://raw.githubusercontent.com/olchik2006/pahin-backend/main/assets/species';

const seedSpecies = async () => {
  await pool.query('TRUNCATE TABLE tree_species CASCADE');
  console.log('🗑️ Cleared tree_species table');

  const species = [
    // ── ХВОЙНІ
    [
      'Сосна звичайна',
      'Pinus sylvestris',
      'хвойні',
      'Вічнозелене дерево з довгими голками, невибагливе до ґрунту',
      'піщаний',
      'помірний',
      'всі регіони',
      5,
      `${BASE_URL}/pinus-sylvestris.jpg`,
    ],
    [
      'Ялина європейська',
      'Picea abies',
      'хвойні',
      'Швидкоросте хвойне дерево, символ Різдва',
      'суглинок',
      'холодний',
      'Карпати, захід',
      5,
      `${BASE_URL}/picea-abies.jpg`,
    ],
    [
      'Ялиця біла',
      'Abies alba',
      'хвойні',
      'Гірське хвойне дерево з плоскими голками',
      'гірський',
      'холодний',
      'Карпати',
      6,
      `${BASE_URL}/abies-alba.jpg`,
    ],
    [
      'Модрина європейська',
      'Larix decidua',
      'хвойні',
      'Єдина хвойна порода, що скидає голки на зиму',
      'суглинок',
      'помірний',
      'Карпати, захід',
      4,
      `${BASE_URL}/larix-decidua.jpg`,
    ],
    [
      'Ялівець звичайний',
      'Juniperus communis',
      'хвойні',
      'Невисоке хвойне з корисними ягодами, ароматне',
      'піщаний',
      'помірний',
      'всі регіони',
      2,
      `${BASE_URL}/juniperus-communis.jpg`,
    ],

    // ── ЛИСТЯНІ
    [
      'Дуб звичайний',
      'Quercus robur',
      'листяні',
      'Довговічне дерево, живе до 1000 років',
      'глинистий',
      'помірний',
      'всі регіони',
      8,
      `${BASE_URL}/quercus-robur.jpg`,
    ],
    [
      'Клен гостролистий',
      'Acer platanoides',
      'листяні',
      'Декоративне з яскравим осіннім забарвленням',
      'суглинок',
      'помірний',
      'всі регіони',
      5,
      `${BASE_URL}/acer-platanoides.jpg`,
    ],
    [
      'Береза повисла',
      'Betula pendula',
      'листяні',
      'Світлолюбне з характерною білою корою',
      'піщаний',
      'помірний',
      'всі регіони',
      4,
      `${BASE_URL}/betula-pendula.jpg`,
    ],
    [
      'Бук лісовий',
      'Fagus sylvatica',
      'листяні',
      'Величне лісове дерево з гладкою сірою корою',
      'суглинок',
      'помірний',
      'Карпати, захід',
      7,
      `${BASE_URL}/fagus-sylvatica.jpg`,
    ],
    [
      'Ясен звичайний',
      'Fraxinus excelsior',
      'листяні',
      'Струнке дерево з перистими листками, любить вологу',
      'суглинок',
      'помірний',
      'всі регіони',
      6,
      `${BASE_URL}/fraxinus-excelsior.jpg`,
    ],
    [
      'Горіх грецький',
      'Juglans regia',
      'листяні',
      'Цінне горіхове дерево, живе до 400 років',
      'суглинок',
      'помірний',
      'захід, центр, південь',
      8,
      `${BASE_URL}/juglans-regia.jpg`,
    ],

    // ── КВІТУЧІ
    [
      'Каштан кінський',
      'Aesculus hippocastanum',
      'квітучі',
      'Красиво квітне навесні білими суцвіттями',
      'суглинок',
      'помірний',
      'захід, центр',
      7,
      `${BASE_URL}/aesculus-hippocastanum.jpg`,
    ],
    [
      'Черешня пташа',
      'Prunus avium',
      'квітучі',
      'Рясно квітне білим навесні, дає їстівні плоди',
      'суглинок',
      'помірний',
      'всі регіони',
      5,
      `${BASE_URL}/prunus-avium.jpg`,
    ],
    [
      'Липа серцелиста',
      'Tilia cordata',
      'квітучі',
      'Медоносне дерево з ароматними квітами',
      'суглинок',
      'помірний',
      'всі регіони',
      5,
      `${BASE_URL}/tilia-cordata.jpg`,
    ],
    [
      'Черемха звичайна',
      'Prunus padus',
      'квітучі',
      'Запашне біле цвітіння, популярне у народних піснях',
      'вологий',
      'помірний',
      'всі регіони',
      4,
      `${BASE_URL}/prunus-padus.jpg`,
    ],
    [
      'Глід одноматочковий',
      'Crataegus monogyna',
      'квітучі',
      'Щільна крона, білі квіти та яскраво-червоні ягоди',
      'суглинок',
      'помірний',
      'всі регіони',
      3,
      `${BASE_URL}/crataegus-monogyna.jpg`,
    ],

    // ── ПЛОДОВІ
    [
      'Яблуня домашня',
      'Malus domestica',
      'плодові',
      'Найпоширеніше плодове дерево України',
      'суглинок',
      'помірний',
      'всі регіони',
      4,
      `${BASE_URL}/malus-domestica.jpg`,
    ],
    [
      'Груша звичайна',
      'Pyrus communis',
      'плодові',
      'Цінне плодове дерево з солодкими плодами',
      'суглинок',
      'помірний',
      'захід, центр',
      5,
      `${BASE_URL}/pyrus-communis.jpg`,
    ],
    [
      'Слива домашня',
      'Prunus domestica',
      'плодові',
      'Невибагливе плодове дерево, морозостійке',
      'суглинок',
      'помірний',
      'всі регіони',
      4,
      `${BASE_URL}/prunus-domestica.jpg`,
    ],
    [
      'Вишня звичайна',
      'Prunus cerasus',
      'плодові',
      'Символ України, кисло-солодкі плоди',
      'суглинок',
      'помірний',
      'всі регіони',
      3,
      `${BASE_URL}/prunus-cerasus.jpg`,
    ],
    [
      'Абрикос звичайний',
      'Prunus armeniaca',
      'плодові',
      'Соковиті плоди, раннє цвітіння рожевим',
      'суглинок',
      'теплий',
      'центр, південь',
      4,
      `${BASE_URL}/prunus-armeniaca.jpg`,
    ],

    // ── ШВИДКОРОСТУЧІ
    [
      'Тополя чорна',
      'Populus nigra',
      'швидкоростучі',
      'Росте до 2м на рік, добре очищує повітря',
      'вологий',
      'помірний',
      'всі регіони',
      10,
      `${BASE_URL}/populus-nigra.jpg`,
    ],
    [
      'Верба біла',
      'Salix alba',
      'швидкоростучі',
      'Любить вологу, швидко росте біля води',
      'вологий',
      'помірний',
      'береги водойм',
      8,
      `${BASE_URL}/salix-alba.jpg`,
    ],
    [
      'Пауловнія повстяна',
      'Paulownia tomentosa',
      'швидкоростучі',
      'Одне з найшвидкоростучих дерев світу',
      'суглинок',
      'теплий',
      'південь, захід',
      12,
      `${BASE_URL}/paulownia-tomentosa.jpg`,
    ],
    [
      'Верба плакуча',
      'Salix babylonica',
      'швидкоростучі',
      'Декоративна з довгими звисаючими гілками',
      'вологий',
      'помірний',
      'береги водойм',
      6,
      `${BASE_URL}/salix-babylonica.jpg`,
    ],
  ];

  const query = `
    INSERT INTO tree_species
      (name_ukr, latin_name, category, description, soil, weather, region, distance, image_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT DO NOTHING
  `;

  for (const s of species) {
    await pool.query(query, s);
  }

  console.log(`✅ Seeded ${species.length} species successfully`);
  await pool.end();
  process.exit(0);
};

seedSpecies().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
