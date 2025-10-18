import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import path from 'path';

const swaggerRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));
const require = createRequire(import.meta.url);
const swaggerFilePath = path.join(__dirname, '../swagger.yaml');
const swaggerDocument = YAML.load(swaggerFilePath);
const swaggerUiAssetsPath = path.dirname(require.resolve('swagger-ui-dist/index.html'));

const swaggerOptions = {
    swaggerOptions: {
        url: '/swagger.yaml'
    },
    customJs: [
        `${swaggerUiAssetsPath}/swagger-ui-bundle.js`,
        `${swaggerUiAssetsPath}/swagger-ui-standalone-preset.js`
    ]
};

swaggerRouter.use(
    '/',
    swaggerUi.serveFiles(swaggerDocument, swaggerOptions),
    swaggerUi.setup(swaggerDocument, swaggerOptions)
);

export default swaggerRouter;