'use strict';

import helmet from 'helmet';

export const helmetConfig = helmet({
    contentSecurityPolicy: false, // evitamos bloqueos innecesarios en desarrollo
    crossOriginEmbedderPolicy: false
});
