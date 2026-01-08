import { ObjectId } from "bson";

export const availableDoctorSorts = ["createdAt", "updatedAt", "rating"];
export const availableMemberSorts = ["createdAt", "updatedAt"];

export const shapeIntoMongoObjectId = (target: any) => {
    return typeof target === 'string' ? new ObjectId(target) : target;
};