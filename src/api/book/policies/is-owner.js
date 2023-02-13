'use strict';

/**
 * `is-owner` policy
 */

module.exports = async (policyContext, config, { strapi }) => {
  // get user id/record to update/delete.
  const {id : userId} = policyContext.state.user;
  const {id : bookId} = policyContext.request.params;
  const [book] = await strapi.entityService
    .findMany('api::book.book', {
      filters: {
        id: bookId,
        creator: userId
      }
    })
  // we have an event owned by the authenticated user
  if (book) {
    return true;
  }
};
