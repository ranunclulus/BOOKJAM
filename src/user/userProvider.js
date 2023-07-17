import pool from "../../config/database";
import userDao from "./userDao";

const userProvider = {

    putUsername: async (userId, username) => {
        try {
            const connection = await pool.getConnection();
            const result = await userDao.updateUsername(connection, userId, username);
            connection.release()
            if (result.error)
                return {error: true}
            return {changed: true};
        } catch (error) {
            console.error(error);
            return {error: true}
        }
        
    },

    putPassword: async (userId, password) => {
        try {
            const connection = await pool.getConnection();
            const result = await userDao.updatePassword(connection, userId, password);
            connection.release()
            if (result.error)
                return {error: true}
            return {changed: true};
        } catch (error) {
            console.error(error);
            return {error: true}
        }
        
    },
    
    putProfile: async (userId, profileImg) => {
        try {
            const connection = await pool.getConnection();
            const result = await userDao.updateProfile(connection, userId, profileImg);
            connection.release()
            if (result.error)
                return {error: true};
            return {changed: true};
        } catch (error) {
            console.error(error);
            return {error: true}
        }
        
    },
    
    putDisabled: async (userId) => {
        try {
            const connection = await pool.getConnection();
            const result = await userDao.updateDisabled(connection, userId);
            connection.release()  
            if (result.error)
                return {error: true} 
            return {disabled: true};
        } catch (error) {
            console.error(error);
            return {error: true}
        }
    },
}

export default userProvider;