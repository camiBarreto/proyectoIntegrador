const path = require("path");
const adminModel = require("../models/adminsModels");
const userModel = require("../models/usersModels");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { User, Admin } = require("../database/models");

const controllerUser = {
  login: (req, res) => {
    const errorMessage = req.query.error;

    res.render("login", { errorMessage });
  },

  postUser: (req, res) => {
    const errors = validationResult(req);

    console.log(errors);

    if (!errors.isEmpty()) {
      return res.render("register", {
        errors: errors.mapped(),
        oldData: req.body,
      });
    }

    const newUser = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      genero: req.body.genero,
      documento: req.body.documento,
      fechaNacimiento: req.body.fechaNacimiento,
      celular: req.body.celular,
      correo: req.body.mail,
      password: req.body.password,
      pais: req.body.pais,
      aerolineaFav: req.body.aerolinea,
    };

    userModel.createUsers(newUser);

    res.redirect("/users/login");
  },

  register: (req, res) => {
    res.render("register");
  },

  admin: (req, res) => {
    res.render("admin");
  },
  getCreateAdmin: (req, res) => {
    res.render("createAdmin");
  },
  postAdmin: (req, res) => {
    const newCompany = {
      empresa: req.body.nombreEmpresa,
      correoEmpresarial: req.body.correo,
      password: req.body.password,
      paisDeOrigen: req.body.paisOrigen,
      aerolinea: req.body.aerolinea,
      paisRuta: req.body.paisRuta,
      contacto: req.body.contacto,
    };

    adminModel.createAdmin(newCompany);

    res.redirect("/users/admin");

    // Desde los POST no renderizamos vistas, solo redireccionamos
    //res.redirect('/');
  },
  processLogin: async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.render("login", {
        errors: errors.mapped(),
        oldData: req.body,
      });
    }

    try {
      let user = await User.findOne({
        raw: true,
        where: {
          email: req.body.correo,
        },
      });


      let admin = await Admin.findOne({
        raw: true,
        where: {
          email_enterprise: req.body.correo,
        },
      });

      if (user) {
        let isOkThePassword = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (isOkThePassword) {
          delete user.password;
          req.session.loggedUser = user;
          if (req.body.recordarme) {
            res.cookie("userEmail", req.body.correo, {
              maxAge: 1000 * 60 * 60,
            });
          }
          return res.redirect("/users/profile");
        } else {
          return res.redirect("/users/login?error=Credenciales invalidas");
        }

        //login de user
      } else if (admin) {
        let isOkThePassword = bcrypt.compareSync(
          req.body.password,
          admin.password
        );
        if (isOkThePassword) {
          delete admin.password;
          req.session.loggedAdmin = admin;
          if (req.body.recordarme) {
            res.cookie("userEmail", req.body.correo, {
              maxAge: 1000 * 60 * 60,
            });
          }
          return res.redirect("/users/admin");
        } else {
          return res.redirect("/users/login?error=Credenciales invalidas");
        }
      } else {
        return res.redirect("/users/login?error=Credenciales invalidas");

        //error email inexistente
      }
    } catch (error) {
      console.error(error);
    }

  },
  profile: (req, res) => {
    return res.render("profile");
  },
  logOut: (req, res) => {
    res.clearCookie("userEmail");
    req.session.destroy();
    return res.redirect("/");
  },
  getEditUser: async (req, res) => {
    const id = req.params.id;
    try {
      const user = await User.findByPk(id)
      return res.render("editUser", { user });
    } catch (error) {
      console.error(error);
    }
  },
  putEditUser: (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    const user = userModel.findById(req.params.id);
    if (!errors.isEmpty()) {
      return res.render("editUser", {
        errors: errors.mapped(),
        oldData: req.body,
        user,
      });
    }

    let firstId = {
      id: req.params.id,
    };

    if (req.body.hasOwnProperty("t&c")) {
      delete req.body["t&c"];
    }

    updatedUser = {
      ...firstId,
      ...req.body,
    };

    userModel.updateUser(updatedUser);

    return res.redirect("/users/profile");
  },
  getEditAdmin: async (req, res) => {
    const id = req.params.id;
    try {
      const admin = await Admin.findByPk(id)
      return res.render("editAdmin", { admin });
    } catch (error) {
      console.error(error);
    }
  },
  putEditAdmin: (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    const admin = adminModel.findById(req.params.id);
    console.log(admin);
    if (!errors.isEmpty()) {
      return res.render("editAdmin", {
        errors: errors.mapped(),
        oldData: req.body,
        admin,
      });
    }

    let firstId = {
      id: req.params.id,
    };

    updatedAdmin = {
      ...firstId,
      ...req.body,
    };

    adminModel.updateAdmin(updatedAdmin);

    return res.redirect("/users/profile");
  },
};

module.exports = controllerUser;
