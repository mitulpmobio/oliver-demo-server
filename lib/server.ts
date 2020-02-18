import app from './app';
import * as http from 'http';

const PORT = 3001;

const httpsOptions = {}

http.createServer(httpsOptions, app).listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
})