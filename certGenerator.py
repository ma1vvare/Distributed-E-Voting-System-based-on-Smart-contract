import hashlib
import sys
import json
import numpy as np
import M2Crypto
import os


def read_in():
  lines = sys.stdin.readlines()
  # print "read lines : ", lines
  # Since our input would only be having one line, parse our JSON data from
  # that
  return json.loads(lines[0])


# def empty_callback():
 # pass


def Cert():
  lines = read_in()
  lines = json.dumps(lines)  # remove [u']
  PID = lines[2:66]

  # M2Crypto.Rand.rand_seed(os.urandom(400))

  # print colored("Generating a 1024 bit private/public key pair for RS...",
  # 'yellow')
  #RS = M2Crypto.RSA.gen_key(400, 65537, empty_callback)

  #RS.save_key('./RS-private.pem', None)

  # RS.save_pub_key('./RS-public.pem')
  SignKey = M2Crypto.EVP.load_key('./RS-private.pem')
  SignKey.sign_init()
  hashMsg = hashlib.sha256(PID).hexdigest()
  SignKey.sign_update(hashMsg)
  SignResult = SignKey.sign_final()
  SigResultHex = SignResult.strip().encode('base64')
  # print "SignResultHex:", SigResultHex

  Cert = str(PID) + str(SigResultHex)
  # print "RS SignResult : ", colored(SignResult, 'green')
  # print colored("Certificate : ", 'yellow'), colored(Cert, 'yellow')
  # print"hello"
  print Cert
if __name__ == '__main__':
  PID = Cert()
