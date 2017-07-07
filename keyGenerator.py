from paillier.paillier import *
import hashlib
import sys
import json
import numpy as np
import M2Crypto
import os


def empty_callback():
  pass


def key():
  M2Crypto.Rand.rand_seed(os.urandom(400))

  # print colored("Generating a 1024 bit private/public key pair for RS...",
  # 'yellow')
  RS = M2Crypto.RSA.gen_key(400, 65537, empty_callback)
  RS.save_key('./RS-private.pem', None)
  RS.save_pub_key('./RS-public.pem')

  AS = M2Crypto.RSA.gen_key(400, 65537, empty_callback)
  AS.save_key('./AS-private.pem', None)
  AS.save_pub_key('./AS-public.pem')
  priv, pub = generate_keypair(512)
  f = file("./pk.pem", "w")
  f.write(str(pub))
  f.close
  g = file("./sk.pem", "w")
  g.write(str(priv))
  g.close
  print "finish key generaton"
if __name__ == '__main__':
  key()
