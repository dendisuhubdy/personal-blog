export const SITE = {
  website: "https://backpropagation.ai/",
  author: "Dendi Suhubdy",
  profile: "https://github.com/dendisuhubdy",
  desc: "Musings on mathematics, machine learning, and the art of computation.",
  title: "Adventures and Amusings of a Mathematician",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true,
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/dendisuhubdy/personal-blog/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr",
  lang: "en",
  timezone: "America/New_York",
} as const;
