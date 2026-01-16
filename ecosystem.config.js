module.exports = {
    apps: [
        {
            name: 'maianhdao',
            script: 'node_modules/.bin/next',
            args: 'start -p 3010',
            cwd: '/www/wwwroot/maianhdao.lamdong.vn',
            instances: 1,
            exec_mode: 'fork',
            autorestart: true,
            watch: false,
            max_memory_restart: '500M',
            env: {
                NODE_ENV: 'production',
                PORT: 3010,
                NEXT_PUBLIC_BASE_URL: 'http://maianhdao.lamdong.vn'
            },
            error_file: '/www/wwwlogs/maianhdao-error.log',
            out_file: '/www/wwwlogs/maianhdao-out.log',
            log_file: '/www/wwwlogs/maianhdao-combined.log',
            time: true
        }
    ]
};
