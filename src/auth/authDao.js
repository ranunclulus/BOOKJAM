const authDao = {
  selectUserByEmail: async (email, connection) => {
    const sql = `
      select user_id
      from users
      where email = '${email}'
    `;

    const [queryResult] = await connection.query(sql);

    return queryResult[0];
  },

  selectThreeRandomUsers: async (connection) => {
    const sql = "select user_id, name, email, username, profile_image, username from users order by rand() limit 3";
    const [queryResult] = await connection.query(sql);
    return queryResult;
  },

  insertUser: async (connection, user) => {
    try {
      const {kakao, email, password, username} = user;
      const sql = `
      INSERT INTO users (email, password, username) VALUES ("${email}", "${password}", "${username}")`;
      await connection.beginTransaction();
      const [newUser] = await connection.query(sql);
      await connection.commit();
      return newUser.email;
    } catch (error) {
      await connection.rollback();
      console.log(error);
    }
  }
};

export default authDao;
