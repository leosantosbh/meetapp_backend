module.exports = {
   up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('mettup', {
         id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
         },
         titulo: {
            type: Sequelize.STRING,
            allowNull: false,
         },
         descricao: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
         },
         local: {
            type: Sequelize.STRING,
            allowNull: false,
         },
         date: {
            type: Sequelize.DATE,
            allowNull: false,
         },
         banner_id: {
            type: Sequelize.INTEGER,
            references: { model: 'banners', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: false,
         },
         user_id: {
            type: Sequelize.INTEGER,
            references: { model: 'users', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            allowNull: false,
         },
         created_at: {
            type: Sequelize.DATE,
            allowNull: false,
         },
         updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
         },
      });
   },

   down: queryInterface => {
      return queryInterface.dropTable('mettup');
   },
};
