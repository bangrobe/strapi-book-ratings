'use strict';

/**
 * `is-admin` policy
 */

module.exports = (policyContext, config, { strapi }) => {
  // Add your own logic here.


  if (policyContext.state.user.isAdmin) {
    return true;
  }
  //if not admin block request
  return false;
};
