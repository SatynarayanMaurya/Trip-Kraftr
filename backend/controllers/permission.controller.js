import Permission from "../models/permission.model.js";

export const createPermission = async (org_id, name, permissions, updatedBy) => {
    try {
        const newPermission = await Permission.create({ org_id, name, permissions, updatedBy });
        return newPermission;
    } catch (error) {
        console.log("Error in creating permission : ",error)
        return null;
    }
}