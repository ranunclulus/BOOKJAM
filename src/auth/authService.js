import pool from "../../config/database";
import authDao from "./authDao";

const authService = {
    createNewUser: async (user) => {
        try {
            console.log(user);햣
            const connection = await pool.getConnection();
            const newUser = authDao.insertUser(connection, user);
            if (!newUser) {
                return { error:true };
            }
            return newUser;
        } catch (error) {
            return {error:true};
        }
    }
}

export default authService;