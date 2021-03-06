var fs = require('fs');
var ursa = require('ursa');

//generate sender private and public keys
var senderkey = ursa.generatePrivateKey(1024, 65537);
var senderprivkey = ursa.createPrivateKey(senderkey.toPrivatePem());
var senderpubkey = ursa.createPublicKey(senderkey.toPublicPem());

//generate recipient private and public keys
var recipientkey = ursa.generatePrivateKey(1024, 65537);
var recipientprivkey = ursa.createPrivateKey(recipientkey.toPrivatePem());
var recipientpubkey = ursa.createPublicKey(recipientkey.toPublicPem());

//prepare JSON message to send
var msg = { 'user':'Nikola Tesla',
            'address':'W 40th St, New York, NY 10018',
            'state':'active' };
            
msg = JSON.stringify(msg);

//encrypt with recipient public key, and sign with sender private key
var encrypted = recipientpubkey.encrypt(msg, 'utf8', 'base64');
var signed = senderprivkey.hashAndSign('sha256', encrypted, 'utf8', 'base64');

//verify message with sender private key
bufferedmsg = new Buffer(encrypted);
if (!senderpubkey.hashAndVerify('sha256', bufferedmsg, signed, 'base64')) {
    throw new Error("invalid signature");
} else {
    //decrypt message with recipient private key
    var decryptedmsg = recipientprivkey.decrypt(encrypted, 'base64', 'utf8');
    console.log('decrypted message verified:', decryptedmsg);
}