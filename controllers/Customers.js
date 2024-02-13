// import MS_CustomerModel from "../models/MS_CustomerModel.js";
// import CustomerModel from "../models/CustomerModel.js";

// const getCustomers = async (req, res) => {
//   try {
//     const customers = await CustomerModel.findAll({
//       include: [{ model: MS_CustomerModel }],
//       where: { userId: req.user.id },
//     });
//     res.json(customers);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// import MS_CustomerModel from "../models/MS_CustomerModel.js";
// import CustomerModel from "../models/CustomerModel.js";

// const getCustomers = async (req, res) => {
//   try {
//     let customers;
//     if (req.user.role === "admin") {
//       customers = await CustomerModel.findAll({
//         include: [{ model: MS_CustomerModel }],
//       });
//     } else {
//       customers = await CustomerModel.findAll({
//         include: [{ model: MS_CustomerModel }],
//         where: { userId: req.user.id },
//       });
//     }
//     res.render("customers", { customers });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


// const getCustomerById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const customer = await CustomerModel.findOne({
//       include: [{ model: MS_CustomerModel }],
//       where: { id, userId: req.user.id },
//     });
//     if (!customer) {
//       return res.status(404).json({ message: "Customer not found" });
//     }
//     res.json(customer);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// const createCustomer = async (req, res) => {
//   const { comp_name, cust_name, comp_add, gstn_number, cont_num } = req.body;

//   try {
//     let masterCustomer;
//     if (req.user.role === "admin" || req.user.role === "dispatch") {
//       masterCustomer = await MS_CustomerModel.create({ comp_name, userId: req.user.id });
//     }

//     const transactionCustomer = await CustomerModel.create({
//       compId: req.user.role === "admin" || req.user.role === "dispatch" ? masterCustomer.PK_CompanyID : null,
//       cust_name,
//       comp_name,
//       comp_add,
//       gstn_number,
//       cont_num,
//       userId: req.user.id,
//     });

//     res.status(201).json(transactionCustomer);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error", error });
//   }
// };


// const updateCustomer = async (req, res) => {
//   const { id } = req.params;
//   const { comp_name, cust_name, comp_add, gstn_number, cont_num } = req.body;

//   try {
//     await MS_CustomerModel.update(
//       { comp_name },
//       { where: { PK_CompanyID: id } }
//     );

//     const [updatedRows] = await CustomerModel.update(
//       {
//         cust_name,
//         comp_name,
//         comp_add,
//         gstn_number,
//         cont_num,
//       },
//       { where: { id, userId: req.user.id } }
//     );

//     if (updatedRows === 0) {
//       return res.status(404).json({ message: "Customer not found" });
//     }

//     res.json({ message: "Customer updated successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// const deleteCustomer = async (req, res) => {
//   const { id } = req.params;

//   try {
//     await MS_CustomerModel.destroy({ where: { PK_CompanyID: id } });

//     const deletedTransactionCustomer = await CustomerModel.destroy({
//       where: { id, userId: req.user.id },
//     });

//     if (deletedTransactionCustomer === 0) {
//       return res.status(404).json({ message: "Customer not found" });
//     }

//     res.json({ message: "Customer deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export {
//   getCustomers,
//   getCustomerById,
//   createCustomer,
//   updateCustomer,
//   deleteCustomer,
// };



// import MS_CustomerModel from "../models/MS_CustomerModel.js";
// import CustomerModel from "../models/CustomerModel.js";

// const getCustomers = async (req, res) => {
//   try {
//     let customers;
//     if (req.user.role === "admin" || req.user.role === "dispatch") {
//       customers = await CustomerModel.findAll({
//         include: [{ model: MS_CustomerModel }],
//       });
//     } else {
//       customers = await CustomerModel.findAll({
//         include: [{ model: MS_CustomerModel }],
//         where: { userId: req.user.id },
//       });
//     }
//     res.render("customers", { customers });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// const getCustomerById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     let customer;
//     if (req.user.role === "admin" || req.user.role === "dispatch") {
//       customer = await CustomerModel.findOne({
//         include: [{ model: MS_CustomerModel }],
//         where: { id },
//       });
//     } else {
//       customer = await CustomerModel.findOne({
//         include: [{ model: MS_CustomerModel }],
//         where: { id, userId: req.user.id },
//       });
//     }

//     if (!customer) {
//       return res.status(404).json({ message: "Customer not found" });
//     }
//     res.json(customer);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// const createCustomer = async (req, res) => {
//   const { comp_name, cust_name, comp_add, gstn_number, cont_num } = req.body;

//   try {
//     let masterCustomer;
//     if (req.user.role === "admin" || req.user.role === "dispatch") {
//       masterCustomer = await MS_CustomerModel.create({ comp_name, userId: req.user.id });
//     }

//     const transactionCustomer = await CustomerModel.create({
//       compId: req.user.role === "admin" || req.user.role === "dispatch" ? masterCustomer.PK_CompanyID : null,
//       cust_name,
//       comp_name,
//       comp_add,
//       gstn_number,
//       cont_num,
//       userId: req.user.id,
//     });

//     res.status(201).json(transactionCustomer);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error", error });
//   }
// };

// const updateCustomer = async (req, res) => {
//   const { id } = req.params;
//   const { comp_name, cust_name, comp_add, gstn_number, cont_num } = req.body;

//   try {
//     if (req.user.role === "admin" || req.user.role === "dispatch") {
//       await MS_CustomerModel.update(
//         { comp_name },
//         { where: { PK_CompanyID: id } }
//       );
//     }

//     const [updatedRows] = await CustomerModel.update(
//       {
//         cust_name,
//         comp_name,
//         comp_add,
//         gstn_number,
//         cont_num,
//       },
//       { where: { id, userId: req.user.id } }
//     );

//     if (updatedRows === 0) {
//       return res.status(404).json({ message: "Customer not found" });
//     }

//     res.json({ message: "Customer updated successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// const deleteCustomer = async (req, res) => {
//   const { id } = req.params;

//   try {
//     if (req.user.role === "admin" || req.user.role === "dispatch") {
//       await MS_CustomerModel.destroy({ where: { PK_CompanyID: id } });
//     }

//     const deletedTransactionCustomer = await CustomerModel.destroy({
//       where: { id, userId: req.user.id },
//     });

//     if (deletedTransactionCustomer === 0) {
//       return res.status(404).json({ message: "Customer not found" });
//     }

//     res.json({ message: "Customer deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export {
//   getCustomers,
//   getCustomerById,
//   createCustomer,
//   updateCustomer,
//   deleteCustomer,
// };



// import MS_CustomerModel from "../models/MS_CustomerModel.js";
// import CustomerModel from "../models/CustomerModel.js";

// const getCustomers = async (req, res) => {
//   try {
//     let customers;
//     if (req.user.role === "admin" || req.user.role === "dispatch") {
//       customers = await CustomerModel.findAll({
//         include: [{ model: MS_CustomerModel }],
//       });
//     } else {
//       customers = await CustomerModel.findAll({
//         include: [{ model: MS_CustomerModel }],
//         where: { userId: req.user.id },
//       });
//     }
//     res.json(customers);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// const getCustomerById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     let customer;
//     if (req.user.role === "admin" || req.user.role === "dispatch") {
//       customer = await CustomerModel.findOne({
//         include: [{ model: MS_CustomerModel }],
//         where: { id },
//       });
//     } else {
//       customer = await CustomerModel.findOne({
//         include: [{ model: MS_CustomerModel }],
//         where: { id, userId: req.user.id },
//       });
//     }

//     if (!customer) {
//       return res.status(404).json({ message: "Customer not found" });
//     }
//     res.json(customer);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// const createCustomer = async (req, res) => {
//   const { comp_name, cust_name, comp_add, gstn_number, cont_num } = req.body;

//   try {
//     let masterCustomer;
//     if (req.user.role === "admin" || req.user.role === "dispatch") {
//       masterCustomer = await MS_CustomerModel.create({ comp_name, userId: req.user.id });
//     }

//     const transactionCustomer = await CustomerModel.create({
//       compId: req.user.role === "admin" || req.user.role === "dispatch" ? masterCustomer.PK_CompanyID : null,
//       cust_name,
//       comp_name,
//       comp_add,
//       gstn_number,
//       cont_num,
//       userId: req.user.id,
//     });

//     res.status(201).json(transactionCustomer);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error", error });
//   }
// };

// const updateCustomer = async (req, res) => {
//   const { id } = req.params;
//   const { comp_name, cust_name, comp_add, gstn_number, cont_num } = req.body;

//   try {
//     if (req.user.role === "admin" || req.user.role === "dispatch") {
//       await MS_CustomerModel.update(
//         { comp_name },
//         { where: { PK_CompanyID: id } }
//       );
//     }

//     const [updatedRows] = await CustomerModel.update(
//       {
//         cust_name,
//         comp_name,
//         comp_add,
//         gstn_number,
//         cont_num,
//       },
//       { where: { id, userId: req.user.id } }
//     );

//     if (updatedRows === 0) {
//       return res.status(404).json({ message: "Customer not found" });
//     }

//     res.json({ message: "Customer updated successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// const deleteCustomer = async (req, res) => {
//   const { id } = req.params;

//   try {
//     if (req.user.role === "admin" || req.user.role === "dispatch") {
//       await MS_CustomerModel.destroy({ where: { PK_CompanyID: id } });
//     }

//     const deletedTransactionCustomer = await CustomerModel.destroy({
//       where: { id, userId: req.user.id },
//     });

//     if (deletedTransactionCustomer === 0) {
//       return res.status(404).json({ message: "Customer not found" });
//     }

//     res.json({ message: "Customer deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export {
//   getCustomers,
//   getCustomerById,
//   createCustomer,
//   updateCustomer,
//   deleteCustomer,
// };



import MS_CustomerModel from "../models/MS_CustomerModel.js";
import CustomerModel from "../models/CustomerModel.js";

const getCustomers = async (req, res) => {
  try {
    const customers = await CustomerModel.findAll({
      include: [{ model: MS_CustomerModel }],
    });
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getMSCustomers = async (req, res)=> {
  try {
    const Mscustomers = await MS_CustomerModel.findAll({
      // include: [{ model: MS_CustomerModel }],
    });
    res.json(Mscustomers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
    
}


const getCustomerById = async (req, res) => {
  const { id } = req.params;

  try {
    let customer;
    if (req.user.role === "dispatch") {
      customer = await CustomerModel.findOne({
        include: [{ model: MS_CustomerModel }],
        where: { id, userId: req.user.id },
      });
    } else {
      customer = await CustomerModel.findOne({
        include: [{ model: MS_CustomerModel }],
        where: { id },
      });
    }

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createCustomer = async (req, res) => {
  const { comp_name, cust_name, comp_add, gstn_number, cont_num } = req.body;

  try {
    let masterCustomer;
    if (req.user.role === "dispatch" || req.user.role === "admin") {
      masterCustomer = await MS_CustomerModel.create({ comp_name, userId: req.user.id });
    }

    const transactionCustomer = await CustomerModel.create({
      compId: req.user.role === "dispatch" || req.user.role === "admin" ? masterCustomer.PK_CompanyID : null,
      cust_name,
      comp_name,
      comp_add,
      gstn_number,
      cont_num,
      userId: req.user.id,
    });

    res.status(201).json(transactionCustomer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};


const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { comp_name, cust_name, comp_add, gstn_number, cont_num } = req.body;

  try {
    const customer = await CustomerModel.findOne({ where: { id } });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (req.user.role === "dispatch" && customer.userId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await MS_CustomerModel.update({ comp_name }, { where: { PK_CompanyID: customer.compId } });

    await CustomerModel.update(
      {
        cust_name,
        comp_name,
        comp_add,
        gstn_number,
        cont_num,
      },
      { where: { id } }
    );

    res.json({ message: "Customer updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await CustomerModel.findOne({ where: { id } });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (req.user.role === "dispatch" && customer.userId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await MS_CustomerModel.destroy({ where: { PK_CompanyID: customer.compId } });

    await CustomerModel.destroy({ where: { id } });

    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getMSCustomers
};
