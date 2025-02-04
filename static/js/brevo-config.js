// Brevo API Configuration
window.BREVO_CONFIG = {
    API_KEY: '{{ .Site.Params.brevo_api_key }}',
    LIST_ID: parseInt('{{ .Site.Params.brevo_list_id }}')
};
