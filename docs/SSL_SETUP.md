# 🔐 Hướng Dẫn Cấu Hình SSL cho maianhdao.lamdong.vn

## Cách 1: Qua BT Panel (Khuyến nghị)

1. Truy cập **BT Panel** (http://IP:8888)
2. Vào **Website** → Chọn **maianhdao.lamdong.vn**  
3. Click **SSL** → Chọn **Let's Encrypt**
4. Tick **Force HTTPS**
5. Click **申请/Apply**

## Cách 2: Qua Command Line (acme.sh)

```bash
# Cài đặt acme.sh nếu chưa có
curl https://get.acme.sh | sh

# Đăng ký SSL
~/.acme.sh/acme.sh --issue -d maianhdao.lamdong.vn --webroot /www/wwwroot/maianhdao.lamdong.vn/public

# Cài đặt cert
mkdir -p /www/server/panel/vhost/cert/maianhdao.lamdong.vn

~/.acme.sh/acme.sh --install-cert -d maianhdao.lamdong.vn \
  --key-file /www/server/panel/vhost/cert/maianhdao.lamdong.vn/privkey.pem \
  --fullchain-file /www/server/panel/vhost/cert/maianhdao.lamdong.vn/fullchain.pem \
  --reloadcmd "nginx -s reload"
```

## Sau khi có SSL, uncomment trong Nginx config:

File: `/www/server/panel/vhost/nginx/maianhdao.lamdong.vn.conf`

```nginx
server
{
    listen 80;
    listen 443 ssl http2;
    server_name maianhdao.lamdong.vn;
    
    ssl_certificate /www/server/panel/vhost/cert/maianhdao.lamdong.vn/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/maianhdao.lamdong.vn/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    
    # Redirect HTTP to HTTPS
    if ($server_port !~ 443) {
        rewrite ^(/.*)$ https://$host$1 permanent;
    }

    # ... rest of config
}
```

Sau đó: `nginx -t && nginx -s reload`
