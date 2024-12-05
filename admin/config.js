window.CMS_MANUAL_INIT = true;

CMS.init({
  config: {
    backend: {
      name: 'github',
      repo: 'simbav911/dart-naujas-btcz.rock',
      branch: 'main',
      base_url: 'https://api.github.com',
      auth_endpoint: 'auth',
      commit_messages: {
        create: 'Create {{collection}} "{{slug}}"',
        update: 'Update {{collection}} "{{slug}}"',
        delete: 'Delete {{collection}} "{{slug}}"',
        uploadMedia: 'Upload "{{path}}"',
        deleteMedia: 'Delete "{{path}}"'
      }
    },
    media_folder: 'static/images',
    public_folder: '/images',
    logo_url: '/images/btcz-logo.png',
    site_url: 'https://simbav911.github.io/dart-naujas-btcz.rock',
    display_url: 'https://simbav911.github.io/dart-naujas-btcz.rock',
    show_preview_links: true,
    search: true,
    locale: 'en'
  }
});
