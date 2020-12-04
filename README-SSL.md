# SSL Setup for your MPC/FORCE

**Why? :** Browser Based Midi only Works over Secure Connection to SSL is Must.

**Goal?:** Generate Self Signed SSL Certificate for local network Ip's and custom Host Names my.force and my.mpc

**Requirements:**

1.  **OpenSSL**. (Comes default installed on most Linux distros and Mac). Can be installed on Windows from this page https://wiki.openssl.org/index.php/Binaries

2.  Little bit of time and Editing.

**How**:

1.  **Script:** Edit the openssl.cnf file and you can run the included SSL.sh Script on Mac/Linux to Generate all the Files. Just Answer a few Questions and Provide a Primary Password. and be Done. or..
2.  **Generate Step By Step as Follows**

- **Edit the openssl.conf file in a text editor**. \* under the [alt_names] section Add your local Ip addresses that your device uses. as IP.# = xxx.xxx.xxx.xxx
  as in Example below. . This will make any of these Addresses Secure in your web browser
  [alt_names]
  DNS.1 = my.force
  DNS.2 = my.mpc
  IP.1 = 192.168.2.108
  IP.2 = 192.168.2.109
  IP.3 = 192.168.2.103
  IP.4 = 192.168.1.12
  IP.5 = 192.168.1.16
  and Save.

- **Run the Following Commands in Terminal (one at a time and follow)**

      openssl genrsa -des3 -out CA.key 2048

      openssl req -x509 -new -nodes -key CA.key -sha256 -days 99999 -out CA.pem

      openssl genrsa -out key.pem 2048

      openssl req -new -out ssl.csr -key key.pem -config ./openssl.cnf

      openssl  x509 -req -sha256 -days 1186  -in ssl.csr -CAcreateserial -CA CA.pem -CAkey CA.key -out cert.pem -extensions v3_req -extfile ./openssl.cnf

The above commands will generate the Necessary Files.

**Installation:**

1.  Copy the **cert.pem** and **key.pem** file to **.apps** directory of the app
2.  Copy **CA.pem** to your local computer where its easily accesible. If you also want to use this on your IOS / Android device, Email this file to yourself as attachment.
3.  **MAC**:
    - Launch Keychain Access App
    - File > Import Items and import CA.pem
    - Once Imported, Double Click and Under Trust > make it "Always Trust".
    - Provide the Password to Save Changes.
4.  **Windows**
    - Go to Control Panel and Launch **Internet Options**
    - Go to Content Tab an d under Certificated , Click **Publishers** Button
    - Click on **Trusted Root Certification Authorities** Tab
    - Click Import and Import CA.pem file.
    - Accept the Warning to Install the Certificate.
    - Done

**Testing** : Open WebBrowser. and type https://xxx.xxx.xxx.xx
If everything Went Ok you should be able to access your device over SSL.

**Optional :** You may want to Bind the Ip address to a Host Name.
Do So in /etc/hosts file on MAC/Linux and c:\windows\system32\drivers\etc/hosts file on windows platform (launch notepad as administrator first and then browse).
