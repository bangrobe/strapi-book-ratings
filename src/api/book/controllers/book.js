'use strict';

/**
 * book controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::book.book', ({ strapi }) => ({
  //Like book
  async likeBook(ctx) {
    let { id } = ctx.params;
    //get book by id
    const book = await strapi.service('api::book.book').findOne(id)
    // if book does not exist
    if (!book) {
      return ctx.badRequest("book does not exist", { details: "This book was not found" })
    }

    //update function
    const updateFunction = async (whoLiked) => {
      let entity = await strapi.service('api::book.book').update(id, { data: { likes: whoLiked } })
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    }
    /*  LIKE BOOKS  */
    //if no existing likes
    if (book.likes === null || book.likes.length === 0) {
      let peopleWhoLiked = [];
      peopleWhoLiked.push(ctx.username);
      return updateFunction(peopleWhoLiked);
    }

    //if user already liked
    else if (book.likes.include(ctx.username)) {
      let peopleWhoLiked = book.likes;
      let index = peopleWhoLiked.indexOf(ctx.username);
      if (index > -1) {
        peopleWhoLiked.splice(index, 1);
      }
      // new like
    } else {
      let peopleWhoLiked = book.likes;
      peopleWhoLiked.push(ctx.username);
      return updateFunction(peopleWhoLiked)
    }
  },

  async create(ctx) {
    console.log(ctx.request.body);
    // console.log(ctx.username);
    const content  = JSON.parse(ctx.request.body.data);
    const cover = ctx.request.files;
    console.log(content, cover)
    // console.log(ctx.request.files);
    // save creator field from middleware
    // console.log(data)
    content.creator = ctx.username

    // // create book
    let entity = await strapi.service('api::book.book').create({data:{...content} , files: {cover: cover['files.cover']} });
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity)
},
  // Update like book
  async update(ctx) {
    let { id } = ctx.params;

    //get the book
    const book = await strapi.service('api::book.book').findOne(id);

    // if book does not exist
    if (!book) {
      return ctx.badRequest("Book does not exist", { details: "This book was not found" });
    }

    //if book belongs to this user
    if (book.creator !== ctx.username) {
      return ctx.forbidden("You can not update this book", { details: "This book does not belong to you" });
    }

    // Update book
    let entity = await strapi.service('api::book.book').update(id, ctx.request.body);
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },
  //Delete book
  async delete(ctx) {
    let { id } = ctx.params;
    console.log(id)
    //get the book
    const book = await strapi.service('api::book.book').findOne(id);

    // if book does not exist
    if (!book) {
      return ctx.badRequest("Book does not exist", { details: "This book was not found" });
    }

    // Update book
    let entity = await strapi.service('api::book.book').delete(id);
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  }
}));
