import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "postgres://postgres:root@localhost:5432/MentorsDiary",
  {
    logging: false,
  }
);

// sequelize.sync({force : true});
sequelize.sync();

export default sequelize;
