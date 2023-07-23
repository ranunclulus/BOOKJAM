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
    const {kakao, email, password, username} = user;
    const sql = `
    INSERT INTO users (email, password, username, created_at, updated_at) 
    VALUES ( '${email}', '${password}', '${username}', NOW(), NOW())
    `;

    const [newUser] = await connection.query(sql);
    return newUser.email;
  }
};

export default authDao;
