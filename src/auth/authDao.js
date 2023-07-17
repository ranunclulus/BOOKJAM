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
    const sql = "select * from users order by rand() limit 3";
    const [queryResult] = await connection.query(sql);
    return queryResult;
  }
};

export default authDao;
