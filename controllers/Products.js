// // import TR_Product_Registration from "../models/TR_Product_Registration.js";
// // import MS_Product from "../models/MS_Product.js";
// // import MS_CustomerModel from "../models/MS_CustomerModel.js"; // Make sure this import is correct

// // export const getProducts = async (req, res) => {
// //   try {
// //     const products = await TR_Product_Registration.findAll({
// //       include: [
// //         {
// //           model: MS_Product,
// //           include: [
// //             {
// //               model: MS_CustomerModel,
// //               attributes: ["PK_CompanyID", "comp_name"],
// //             },
// //           ],
// //         },
// //       ],
// //     });
// //     res.status(200).json(products);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Internal server error" });
// //   }
// // };

// // export const getProductById = async (req, res) => {
// //   const { id } = req.params;

// //   try {
// //     const product = await TR_Product_Registration.findOne({
// //       include: [{ model: MS_Product }],
// //       where: { id },
// //     });

// //     if (!product) {
// //       return res.status(404).json({ message: "Product not found" });
// //     }
// //     res.status(200).json(product);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Internal server error" });
// //   }
// // };

// // export const createProduct = async (req, res) => {
// //   const {
// //     compId,
// //     prodId,
// //     gradeId,
// //     No_of_casting_in_mould,
// //     Casting_Weight,
// //   } = req.body;

// //   try {
// //     // Find the customer based on the provided compId
// //     const customer = await MS_CustomerModel.findOne({
// //       where: { PK_CompanyID: compId },
// //     });

// //     if (!customer) {
// //       return res.status(404).json({ message: "Customer not found" });
// //     }

// //     // Find the product based on the provided prodId
// //     const product = await MS_Product.findOne({
// //       where: { PK_ProductID: prodId },
// //     });

// //     if (!product) {
// //       return res.status(404).json({ message: "Product not found" });
// //     }

// //     // Create the TR_Product_Registration record
// //     const newProductRegistration = await TR_Product_Registration.create({
// //       compId,
// //       prodId,
// //       gradeId,
// //       No_of_casting_in_mould,
// //       Casting_Weight,
// //       userId: req.user.id, // Store the user ID from authentication middleware if needed
// //     });

// //     res.status(201).json({ message: "Product created successfully", productRegistration: newProductRegistration });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Internal server error" });
// //   }
// // };

// // export const updateProduct = async (req, res) => {
// //   const { id } = req.params;
// //   const {
// //     compId,
// //     prodId,
// //     gradeId,
// //     No_of_casting_in_mould,
// //     Casting_Weight,
// //   } = req.body;

// //   try {
// //     const productRegistration = await TR_Product_Registration.findByPk(id);

// //     if (!productRegistration) {
// //       return res.status(404).json({ message: "Product registration not found" });
// //     }

// //     // Check if the provided compId exists in the MS_CustomerModel table
// //     const customer = await MS_CustomerModel.findOne({
// //       where: { PK_CompanyID: compId },
// //     });

// //     if (!customer) {
// //       return res.status(404).json({ message: "Customer not found" });
// //     }

// //     // Check if the provided prodId exists in the MS_Product table
// //     const product = await MS_Product.findOne({
// //       where: { PK_ProductID: prodId },
// //     });

// //     if (!product) {
// //       return res.status(404).json({ message: "Product not found" });
// //     }

// //     // Update the product registration record
// //     await productRegistration.update({
// //       compId,
// //       prodId,
// //       gradeId,
// //       No_of_casting_in_mould,
// //       Casting_Weight,
// //     });

// //     res.status(200).json({ message: "Product registration updated successfully", productRegistration });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Internal server error" });
// //   }
// // };

// // export const deleteProduct = async (req, res) => {
// //   const { id } = req.params;

// //   try {
// //     const productRegistration = await TR_Product_Registration.findByPk(id);

// //     if (!productRegistration) {
// //       return res.status(404).json({ message: "Product registration not found" });
// //     }

// //     // Delete the product registration record
// //     await productRegistration.destroy();

// //     res.status(200).json({ message: "Product registration deleted successfully" });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Internal server error" });
// //   }
// // };

// // Products.js
// import MS_CustomerModel from "../models/MS_CustomerModel.js";
// import MS_Product from "../models/MS_Product.js";
// import MS_Grade from "../models/MS_Grade.js";
// import Customers from "../models/CustomerModel.js";
// import TR_Product_Registration from "../models/TR_Product_Registration.js";

// export const getProducts = async (req, res) => {
//   try {
//     const { includeNames } = req.query;

//     // Fetch products data
//     let products;
//     if (includeNames) {
//       products = await TR_Product_Registration.findAll({
//         include: [
//           { model: MS_CustomerModel, as: "customer", attributes: ["comp_name"] },
//           { model: MS_Product, as: "product", attributes: ["prod_name"] },
//           { model: MS_Grade },
//         ],
//       });
//     } else {
//       products = await TR_Product_Registration.findAll();
//     }

//     res.json(products);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


// export const getmsproduct = async(req, res)=>{
//   try {
//     const Msproduct = await MS_Product.findAll({
//       // include: [{ model: MS_CustomerModel }],
//     });
//     res.json(Msproduct);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }


// export const getProductById = async (req, res) => {
//   const { id } = req.params;
//   const { prodId } = req.query;

//   try {
//     // Find the product based on the provided ID
//     let product;
//     if (prodId) {
//       // If 'prodId' is defined, include it in the query
//       product = await TR_Product_Registration.findOne({
//         where: { id, prodId },
//         include: [
//           { model: MS_CustomerModel, as: "customer", attributes: ["comp_name"] },
//           { model: MS_Product, as: "product", attributes: ["prod_name"] },
//           { model: MS_Grade },
//         ],
//       });
//     } else {
//       // If 'prodId' is not defined, exclude it from the query
//       product = await TR_Product_Registration.findOne({
//         where: { id },
//         include: [
//           { model: MS_CustomerModel, as: "customer", attributes: ["comp_name"] },
//           { model: MS_Product, as: "product", attributes: ["prod_name"] },
//           { model: MS_Grade },
//         ],
//       });
//     }

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.json(product);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const createProduct = async (req, res) => {
//   const {
//     comp_name,
//     prod_name,
//     gradeId,
//     No_of_casting_in_mould,
//     Casting_Weight,
//   } = req.body;

//   try {
//     // Find the customer based on the provided comp_name
//     const customer = await Customers.findOne({ where: { comp_name } });
//     if (!customer) {
//       return res.status(404).json({ message: "Customer not found" });
//     }

//     // Find or create the product based on the provided product name
//     let product = await MS_Product.findOne({
//       where: { prod_name, compId: customer.compId },
//     });

//     // If the product does not exist, create it
//     if (!product) {
//       product = await MS_Product.create({
//         compId: customer.compId,
//         prod_name,
//         userId: req.user.id,
//       });
//     }

//     // Create the TR_Product_Registration record with correct foreign keys
//     const newProductRegistration = await TR_Product_Registration.create({
//       compId: customer.compId,
//       prodId: product.PK_ProductID,
//       gradeId,
//       No_of_casting_in_mould,
//       Casting_Weight,
//       userId: req.user.id, // Store the user ID from authentication middleware if needed
//     });

//     res.status(201).json({
//       message: "Product created successfully",
//       productRegistration: newProductRegistration,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const updateProduct = async (req, res) => {
//   const { id } = req.params;
//   const { prod_name, gradeId, No_of_casting_in_mould, Casting_Weight } = req.body;

//   try {
//     // Find the product based on the provided ID
//     const product = await TR_Product_Registration.findOne({ where: { id } });

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Update the TR_Product_Registration record
//     await product.update({
//       gradeId,
//       No_of_casting_in_mould,
//       Casting_Weight,
//     });

//     // Find the associated MS_Product record and update its prod_name
//     const msProduct = await MS_Product.findOne({ where: { PK_ProductID: product.prodId } });
//     if (!msProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     await msProduct.update({ prod_name });

//     res.json({ message: "Product updated successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const deleteProduct = async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Find the product based on the provided ID
//     const product = await TR_Product_Registration.findOne({ where: { id } });

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Delete the product
//     await product.destroy();

//     res.json({ message: "Product deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

import MS_CustomerModel from "../models/MS_CustomerModel.js";
import MS_Product from "../models/MS_Product.js";
import MS_Grade from "../models/MS_Grade.js";
import Customers from "../models/CustomerModel.js";
import TR_Product_Registration from "../models/TR_Product_Registration.js";

export const getProducts = async (req, res) => {
  try {
    const { includeNames } = req.query;

    // Fetch products data
    let products;

    if (includeNames) {
      products = await TR_Product_Registration.findAll({
        include: [
          { model: MS_CustomerModel, as: "customer", attributes: ["comp_name"] },
          { model: MS_Product, as: "product", attributes: ["prod_name"] },
          { model: MS_Grade },
        ],
      });

      // Calculate totalQuantity and totalWeight for each product
      products = products.map((product) => {
        const totalQuantity = product.No_of_casting_in_mould * product.product.Casting_Weight;
        const totalWeight = totalQuantity * product.Casting_Weight;

        return {
          ...product.toJSON(),
          totalQuantity,
          totalWeight,
        };
      });
    } else {
      products = await TR_Product_Registration.findAll({
        include: [
          { model: MS_CustomerModel, as: "customer" },
          { model: MS_Product, as: "product" },
          { model: MS_Grade },
        ],
      });
    }

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  const { prodId } = req.query;

  try {
    // Find the product based on the provided ID
    let product;
    if (prodId) {
      // If 'prodId' is defined, include it in the query
      product = await TR_Product_Registration.findOne({
        where: { id, prodId },
        include: [
          { model: MS_CustomerModel, as: "customer", attributes: ["comp_name"] },
          { model: MS_Product, as: "product", attributes: ["prod_name"] },
          { model: MS_Grade },
        ],
      });
    } else {
      // If 'prodId' is not defined, exclude it from the query
      product = await TR_Product_Registration.findOne({
        where: { id },
        include: [
          { model: MS_CustomerModel, as: "customer", attributes: ["comp_name"] },
          { model: MS_Product, as: "product", attributes: ["prod_name"] },
          { model: MS_Grade },
        ],
      });
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createProduct = async (req, res) => {
  const {
    comp_name,
    prod_name,
    gradeId,
    No_of_casting_in_mould,
    Casting_Weight,
  } = req.body;

  try {
    // Find the customer based on the provided comp_name
    const customer = await Customers.findOne({ where: { comp_name } });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Find or create the product based on the provided product name
    let product = await MS_Product.findOne({
      where: { prod_name, compId: customer.compId },
    });

    // If the product does not exist, create it
    if (!product) {
      product = await MS_Product.create({
        compId: customer.compId,
        prod_name,
        userId: req.user.id,
      });
    }

    // Calculate Total Quantity and Total Weight
    const totalQuantity = No_of_casting_in_mould * Casting_Weight;
    const totalWeight = totalQuantity * Casting_Weight;

    // Create the TR_Product_Registration record with correct foreign keys
    const newProductRegistration = await TR_Product_Registration.create({
      compId: customer.compId,
      prodId: product.PK_ProductID,
      gradeId,
      No_of_casting_in_mould,
      Casting_Weight,
      Total_Quantity: totalQuantity,
      Total_Weight: totalWeight,
      userId: req.user.id, // Store the user ID from authentication middleware if needed
    });

    res.status(201).json({
      message: "Product created successfully",
      productRegistration: newProductRegistration,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { prod_name, gradeId, No_of_casting_in_mould, Casting_Weight } = req.body;

  try {
    // Find the product based on the provided ID
    const product = await TR_Product_Registration.findOne({ where: { id } });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Calculate Total Quantity and Total Weight
    const totalQuantity = No_of_casting_in_mould * Casting_Weight;
    const totalWeight = totalQuantity * Casting_Weight;

    // Update the TR_Product_Registration record
    await product.update({
      gradeId,
      No_of_casting_in_mould,
      Casting_Weight,
      Total_Quantity: totalQuantity,
      Total_Weight: totalWeight,
    });

    // Find the associated MS_Product record and update its prod_name
    const msProduct = await MS_Product.findOne({ where: { PK_ProductID: product.prodId } });
    if (!msProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    await msProduct.update({ prod_name });

    res.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the product based on the provided ID
    const product = await TR_Product_Registration.findOne({ where: { id } });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete the product
    await product.destroy();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getmsproduct = async(req, res)=>{
    try {
      const Msproduct = await MS_Product.findAll({
        // include: [{ model: MS_CustomerModel }],
      });
      res.json(Msproduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }