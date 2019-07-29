import Sequelize, { Model } from 'sequelize';

class Mettup extends Model {
   static init(sequelize) {
      super.init(
         {
            titulo: Sequelize.STRING,
            descricao: Sequelize.STRING,
            local: Sequelize.STRING,
            date: Sequelize.DATE,
         },
         {
            sequelize,
         }
      );

      return this;
   }

   static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      this.belongsTo(models.Banner, { foreignKey: 'banner_id', as: 'banner' });
   }
}

export default Mettup;
