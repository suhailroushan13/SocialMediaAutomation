# SocialMedia-Automation

## Installation

```bash
git clone git@github.com:suhailroushan13/SocialMedia-Automation.git
cd SocialMedia-Automation
cd server
mkdir config
cd config
touch default.json

```

### Add Your JSON Values

```jsonc
{
  "URL": "http://example.com", // Domain
  "DB_URI": "mongodb+srv://username:password@automilt.qdfhv0y.mongodb.net/SocialMedia", // DB URI MongoDB
  "PORT": 8888, // Port
  "IG_USERNAME": "username", // Insta UserName
  "IG_PASSWORD": "password", // Insta Password
  "Client_ID": "8439" // Imagur CliendID
}
```

### To Run

```bash
cd server
npm start
```

### Open PostMan Select Form Data And Select

### key should be 'image' and value should be uploaded Image

### Key should be 'caption' and value should be Caption In String
