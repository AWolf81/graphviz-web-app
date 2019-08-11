export default {
  name: "dotfile",
  title: "Dotfile",
  type: "document",
  fields: [
    {
      title: "Filename",
      name: "filename",
      type: "string"
    },
    {
      title: "Slug",
      name: "slug",
      type: "slug",
      options: {
        source: "filename"
      }
    },
    {
      title: "Body",
      name: "body",
      type: "text"
    },
    {
      title: "Visibility",
      name: "visibility",
      type: "string",
      options: {
        list: [
          { title: "Public (everyone can see)", value: "public" },
          { title: "Private (only visible for you)", value: "private" }
        ],
        layout: "radio"
      }
    },
    {
      title: "Creator",
      name: "creator",
      type: "reference",
      to: [{ type: "user" }]
    }
  ]
};
