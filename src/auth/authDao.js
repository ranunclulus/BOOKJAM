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
    const sql = "select user_id, name, email, username, profile_image, username from users where disabled_at IS NULL order by rand() limit 3";
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
  },

  selectUserInfoByEmail: async (email, connection) => {
    const sql = `
      select email, password, disabled_at
      from users
      where email = '${email}'
    `;

    const [queryResult] = await connection.query(sql);

    return queryResult[0];
  },

  selectUserPassword: async (connection, selectUserPasswordParams)=> {
    const email = selectUserPasswordParams[0];
    const password = selectUserPasswordParams[1];
    const selectUserPasswordQuery = `
        SELECT email, password, username
        FROM users
        WHERE email = '${email}' AND password = '${password}'`;
    const [selectUserPasswordRow] = await connection.query(selectUserPasswordQuery);
    return selectUserPasswordRow[0];
  },

  selectUserAllInfoByEmail: async (email, connection) => {
    const sql = `
      select *
      from users
      where email = '${email}'
    `;

    const [queryResult] = await connection.query(sql);

    return queryResult[0];
  },

  updateUserRefreshToken: async (userId, refreshToken, connection) => {
    const sql = `UPDATE users SET refresh_token = '${refreshToken}' WHERE user_id = ${userId}`;
    try {
      const [result] = await connection.query(sql);
      return result;
    } catch (error) {
      console.log(error);
      return {error: true};
    }
  }
};

export default authDao;
