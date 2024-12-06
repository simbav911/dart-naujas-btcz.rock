// Wait for the CMS to be loaded
window.addEventListener('load', function() {
  CMS.init({
    config: {
      load_config_file: false,
      backend: {
        name: 'github',
        repo: 'simbav911/dart-naujas-btcz.rock',
        branch: 'main',
        auth_type: 'oauth',
        base_url: 'https://api.github.com',
        auth_endpoint: 'auth',
        client_id: 'Ov23likVSo2M8nWaTKxA'
      },
      publish_mode: 'editorial_workflow',
      media_folder: 'static/images',
      public_folder: '/images',
      collections: [
        {
          name: 'news',
          label: 'News',
          folder: 'content/en/news',
          create: true,
          slug: '{{year}}-{{month}}-{{slug}}',
          editor: {
            preview: true
          },
          fields: [
            { label: 'Title', name: 'title', widget: 'string' },
            { label: 'Description', name: 'description', widget: 'string' },
            { label: 'Date', name: 'date', widget: 'datetime' },
            { label: 'Author', name: 'author', widget: 'string', default: 'BitcoinZ Team' },
            { label: 'Image', name: 'image', widget: 'image', required: false },
            { label: 'Type', name: 'type', widget: 'hidden', default: 'news' },
            { label: 'Categories', name: 'categories', widget: 'select', multiple: true, options: ['Community', 'Development', 'Exchange', 'Mining', 'Partnership', 'Update'] },
            { label: 'Tags', name: 'tags', widget: 'list' },
            { label: 'Layout', name: 'layout', widget: 'hidden', default: 'single' },
            { label: 'Body', name: 'body', widget: 'markdown' }
          ]
        }
      ]
    }
  });
});
