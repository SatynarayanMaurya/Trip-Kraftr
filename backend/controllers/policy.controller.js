


import PaymentPolicy from "../models/Policies Models/paymentPolicy.model.js"
import CancellationPolicy from "../models/Policies Models/cancellationPolicy.model.js"
import InclusionPolicy from "../models/Policies Models/inclusionPolicy.model.js"
import ExclusionPolicy from "../models/Policies Models/exclusionPolicy.model.js"
import ThingsToPack from "../models/Policies Models/thingsToPack.model.js"

import mongoose from "mongoose"

const policyModelMap = {
    Payment: PaymentPolicy,
    Cancellation: CancellationPolicy,
    Inclusion: InclusionPolicy,
    Exclusion: ExclusionPolicy,
    "Things To Pack": ThingsToPack,
};


// export const addPolicy = async (req, res) => {
//     try {
//         const { regionId, policies, policyCategory } = req.body;

//         // ✅ Validate required fields
//         if (!regionId || !policies || !policyCategory) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Required fields are missing",
//             });
//         }

//         // ✅ Get model dynamically
//         const Model = policyModelMap[policyCategory];

//         if (!Model) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid policy category",
//             });
//         }

//         // ✅ Check existing policy
//         const existingPolicy = await Model.findOne({
//             org_id: req.user.org_id,
//             regionId,
//         });

//         if (existingPolicy) {
//             return res.status(409).json({
//                 success: false,
//                 message: `${policyCategory} policy already exists for this region`,
//             });
//         }

//         // ✅ Create policy
//         const newPolicy = await Model.create({
//             org_id: req.user.org_id,
//             regionId,
//             policies,
//             policyCategory, // optional if already implied in model
//         });

//         return res.status(201).json({
//             success: true,
//             message: `${policyCategory} policy created successfully`,
//             data: newPolicy,
//         });

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error?.message || "Internal Server Error",
//         });
//     }
// };

export const addPolicy = async (req, res) => {
    try {
        const { regionId, policies, policyCategory } = req.body;

        // ✅ Validate required fields
        if (!regionId || !policies || !policyCategory) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
            });
        }

        // ✅ Get model dynamically
        const Model = policyModelMap[policyCategory];

        if (!Model) {
            return res.status(400).json({
                success: false,
                message: "Invalid policy category",
            });
        }

        // ✅ Ensure policies is always array
        const policiesArray = Array.isArray(policies) ? policies : [policies];

        // ✅ Upsert + push
        const updatedDoc = await Model.findOneAndUpdate(
            {
                org_id: req.user.org_id,
                regionId,
            },
            {
                $push: {
                    policies: { $each: policiesArray },
                },
                $setOnInsert: {
                    org_id: req.user.org_id,
                    regionId,
                    policyCategory,
                },
            },
            {
                new: true,
                upsert: true,
            }
        ).populate({ path: "regionId", select: "_id name" });

        return res.status(200).json({
            success: true,
            message: `${policyCategory} policy added successfully`,
            updatedDoc,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error",
        });
    }
};
export const getPolicy = async (req, res) => {
    try {
        const { regionId, policyCategory } = req.query;
        if (!regionId || !policyCategory) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing"
            })
        }

        if (!mongoose.Types.ObjectId.isValid(regionId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid regionId",
            });
        }

        // const findPolicy = await P 
        const Model = policyModelMap[policyCategory];

        if (!Model) {
            return res.status(400).json({
                success: false,
                message: "Invalid policy category",
            });
        }

        // ✅ Find policy
        const findPolicy = await Model
            .findOne({
                org_id: req.user.org_id,
                regionId,
            })
            .populate({ path: "regionId", select: "_id name" })

        if (findPolicy) {
            return res.status(200).json({
                success: true,
                message: "Policy found",
                findPolicy
            })
        }
        else {
            return res.status(200).json({
                success: false,
                message: "No policy found for this region",
                findPolicy: {}
            })
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        })
    }
}



export const updatePolicy = async (req, res) => {
    try {
        const { policyCategory, regionId, updatedIndex, updatedPolicy } = req.body;

        if (
            !regionId ||
            !policyCategory ||
            updatedIndex === undefined ||
            !updatedPolicy
        ) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(regionId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid regionId",
            });
        }


        const Model = policyModelMap[policyCategory];

        if (!Model) {
            return res.status(400).json({
                success: false,
                message: "Invalid policy category",
            });
        }

        // ✅ Single query with index existence check
        const updatedDoc = await Model.findOneAndUpdate(
            {
                org_id: req.user.org_id,
                regionId,
                [`policies.${updatedIndex}`]: { $exists: true }, // 🔥 key trick
            },
            {
                $set: {
                    [`policies.${updatedIndex}`]: updatedPolicy,
                },
            },
            {
                new: true,
            }
        ).populate({ path: "regionId", select: "_id name" })

        if (!updatedDoc) {
            return res.status(404).json({
                success: false,
                message: "Policy not found or invalid index",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Policy updated successfully",
            updatedDoc,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error",
        });
    }
};

export const deletePolicy = async (req, res) => {
    try {
        const { regionId, deleteIndex, policyCategory } = req.body;

        // ✅ Validate inputs
        if (
            !regionId ||
            deleteIndex === undefined ||
            !policyCategory
        ) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(regionId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid regionId",
            });
        }

        const Model = policyModelMap[policyCategory];

        if (!Model) {
            return res.status(400).json({
                success: false,
                message: "Invalid policy category",
            });
        }

        // ✅ Step 1: unset the specific index
        const doc = await Model.findOneAndUpdate(
            {
                org_id: req.user.org_id,
                regionId,
                [`policies.${deleteIndex}`]: { $exists: true }, // ensure index exists
            },
            {
                $unset: {
                    [`policies.${deleteIndex}`]: 1,
                },
            },
            { new: true }
        );

        if (!doc) {
            return res.status(404).json({
                success: false,
                message: "Policy not found or invalid index",
            });
        }

        // ✅ Step 2: remove null values (clean array)
        const updatedDoc = await Model.findOneAndUpdate(
            {
                org_id: req.user.org_id,
                regionId,
            },
            {
                $pull: {
                    policies: null,
                },
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Policy deleted successfully",
            updatedDoc,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error",
        });
    }
};