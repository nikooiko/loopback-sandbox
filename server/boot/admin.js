'use strict';

module.exports = (app) => {
  const Role = app.models.Role;
  const AppUser = app.models.AppUser;
  const RoleMapping = app.models.RoleMapping;
  let adminRole;
  const defaultAdmin = {
    username: 'admin',
    email: 'admin@email.com',
    password: '1234'
  };
  Role.findOrCreate({ name: 'admin' })
    .then(([role]) => {
      adminRole = role;
      console.log('Default "admin" role successfully initialized');
      return AppUser.findOrCreate({ where: { username: defaultAdmin.username } }, defaultAdmin);
    })
    .then(([admin]) => {
      defaultAdmin.id = admin.id;
      return adminRole.principals({
        where: {
          principalType: RoleMapping.USER,
          principalId: admin.id.toString()
        }
      });
    })
    .then(principals => {
      if (principals.length === 0) {
        return adminRole.principals.create({
          principalType: RoleMapping.USER,
          principalId: defaultAdmin.id
        });
      }
      return principals[0];
    })
    .catch(err => {
      console.error(err);
    });
};
