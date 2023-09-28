import SwaggerUI from 'swagger-ui';
import 'swagger-ui/dist/swagger-ui.css';

const ui = SwaggerUI({
  url: 'openapi.schema.yml',
  dom_id: '#swagger',
});

ui.initOAuth({
  appName: 'ERP API',
  clientId: 'implicit',
});
