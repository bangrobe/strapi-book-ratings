'use strict';

/**
 * book router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::book.book', {
  config: {
    create: {
      middlewares: [
        (ctx, next) => {
          // Check if user is authenticated and save user to context
          let user = ctx.state.user;
          if (user ) ctx.username = ctx.state.user.username;
          return next()
        }
      ]
    },
    update: {
      middlewares: [
        (ctx, next) => {
          // Check if user is authenticated and save user to context
          let user = ctx.state.user;
          if (user ) ctx.username = ctx.state.user.username;
          return next()
        }
      ]
    },
    delete: {
      //register policy to check if user is admin
      policies: ["is-owner"]
    }
  }
});
