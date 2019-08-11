import sanity from "./sanity";

// const query = `*[_type == "dotfile"] {
//   _id,
//   slug,
//   body,
//   creator
// }`;

// ( visibility == "public" || creator->username == $authUser )
const query = `*[_type == "dotfile"] | order(_createdAt asc) {
  _id,
  _createdAt,
  _updatedAt,
  slug,
  body,
  creator -> {
    username,
    avatar
  }
}`;

// gCRUD
// get
// create
// update
// delete
export default {
  // Get all
  //
  // or queryUser when not private
  getAll(authUser = "") {
    return sanity.fetch(query, authUser);
  },
  get(params, authUser) {
    console.log("get", params, authUser);
    const query = `*[_type == "dotfile" &&
      creator->username == $queryUser && slug.current == $slug]{
      _id,
      _createdAt,
      _updatedAt,
      slug,
      body,
      visibility,
      creator -> {
        username,
        avatar
      }
    }`;
    return sanity.fetch(query, {
      queryUser: params.queryUser,
      // ...(authUser && {authUser}),
      slug: params.slug
    });
  },
  create(doc) {
    return sanity.create(doc);
  }
};
