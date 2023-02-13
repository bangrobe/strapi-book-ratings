//https://docs.strapi.io/developer-docs/latest/development/backend-customization/routes.html#policies
module.exports = {
  routes: [
    {
      method: "PUT",
      path: "/books/:id/like",
      handler: "book.likeBook", //controllerName.actionName
      config: {
        middlewares: [
          (ctx, next) => {
            // check if user is authenticated and save username to context
            let user = ctx.state.user;
            if (user) ctx.username = ctx.state.user.username
            return next();
          }
        ]
      }
    }
  ]
}
