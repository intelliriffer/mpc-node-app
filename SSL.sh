#!/bin/bash
openssl genrsa -des3 -out CA.key 2048
openssl req -x509 -new -nodes -key CA.key -sha256 -days 99999 -out CA.pem
openssl genrsa -out key.pem 2048
openssl req -new -out ssl.csr -key key.pem -config ./openssl.cnf
openssl  x509 -req -sha256 -days 1186  -in ssl.csr -CAcreateserial -CA CA.pem -CAkey CA.key -out cert.pem -extensions v3_req -extfile ./openssl.cnf
mv cert.pem .apps/
mv key.pem .apps/
rm ssl.csr
rm CA.srl

