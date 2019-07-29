import { Model } from 'sequelize';

class Agend extends Model {
   static init(sequelize) {
      super.init(
         {},
         {
            sequelize,
         }
      );
   }

   static associate(models) {
      this.belongsTo(models.Mettup, { foreignKey: 'mett_id', as: 'mett' });
      this.belongsTo(models.User, {
         foreignKey: 'user_id',
         as: 'user_invited',
      });
   }
}

export default Agend;
