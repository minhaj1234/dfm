#!/bin/bash
cd /var/www/
sudo unzip dfmui.zip
sudo rm dfmui.zip
sudo unzip modeler.zip -d /var/www/html/modeler/
sudo rm modeler.zip
sudo unzip admin.zip -d /var/www/html/admin/
sudo rm admin.zip
sudo mv default /etc/nginx/sites-available/
sudo systemctl start  nginx
sudo chmod -R 777 /var/log/nginx/
