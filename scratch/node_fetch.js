const https = require('https');
const fs = require('fs');

https.get('https://stitch.withgoogle.com/preview/4276611718169263629?node-id=e967a3b4e7d54d4aaa1b79616f666702', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        fs.writeFileSync('node_raw.html', data);
        console.log('done downloading');
    });
}).on('error', (err) => {
    console.error(err);
});
