if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const bcrypt = require('bcryptjs')
const Category = require("../category");
const Record = require("../record");
const db = require('../../config/mongoose');
const User = require('../user');
const SEED_USER = {
  name: 'root',
  email: 'root@example.com',
  password: '12345678'
}

db.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    }))
    .then(user => {
      const userId = user._id
      return Category.find()
        .lean()
        .sort({ _id: 'asc' })
        .then(categories => categories.map(category => category._id))
        .then(categoriesId => {
          const SEED_RECORDS = []
          for (let month = 0; month < 12; month++) {
            for (let i = 1; i < 11; i++) {
              const date = new Date
              date.setMonth(month)
              date.setDate(i)

              SEED_RECORDS.push({
                name: `record-${month + 1}-${i}`,
                categoryId: categoriesId[i % 5],
                date,
                amount: i * 100,
                userId
              })
            }
          }
          return SEED_RECORDS
        })
        .then(records => Record.create(records))
        .catch(error => console.error(error))
    })
    .then(() => {
      console.log('recordSeeder.js done ^_^')
      process.exit()
    })
})