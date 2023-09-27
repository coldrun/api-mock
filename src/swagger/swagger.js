import SwaggerUI from 'swagger-ui';
import 'swagger-ui/dist/swagger-ui.css';
import spec from '../schema/openapi.schema.yml';

const ui = SwaggerUI({
  spec,
  dom_id: '#swagger',
});

ui.initOAuth({
  appName: 'ERP API',
  clientId: 'implicit',
});
