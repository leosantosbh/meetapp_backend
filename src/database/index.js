import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/User';
import File from '../app/models/File';
import Banner from '../app/models/Banner';
import Mettup from '../app/models/Mett';
import Agend from '../app/models/Agend';

import databaseConfig from '../config/database';

const models = [User, Banner, File, Mettup, Agend];

class Database {
   constructor() {
      this.connection = new Sequelize(databaseConfig);
      this.init();
      this.associate();
      this.mongo();
   }

   init() {
      models.forEach(model => model.init(this.connection));
   }

   associate() {
      models.forEach(model => {
         if (model.associate) {
            model.associate(this.connection.models);
         }
      });
   }

   mongo() {
      this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
         useNewUrlParser: true,
         useFindAndModify: true,
      });
   }
}

export default new Database();
