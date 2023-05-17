import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "postgres://postgres:Rutvik432@localhost:5432/Demo",
  {
    logging: false,
  }
);

// sequelize.sync({force : true});
sequelize.sync();

export default sequelize;
