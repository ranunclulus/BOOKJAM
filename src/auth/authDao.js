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

  selectUserEmailByEmail: async (email, connection) => {
    const sql = `
      select email
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
};

export default authDao;
