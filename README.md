Move docker-s3p.service to systemd config (/usr/local/lib/systemd/system/)

Copy compose-template.yml into /var/www/docker-s3p/compose.yml

    systemctl daemon-reload && systemctl enable docker-s3p

    systemctl start docker-s3p

Express will now be listening on 8088 (default); proxy Apache / nginx / whatever to there
