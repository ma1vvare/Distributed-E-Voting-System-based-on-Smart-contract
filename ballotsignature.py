from paillier.paillier import *
import hashlib
from termcolor import colored
from secretsharing import SecretSharer
from secretsharing import PlaintextToHexSecretSharer
import random
import sys
import math
import os
import M2Crypto
import json
import numpy as np
M2Crypto.Rand.rand_seed(os.urandom(400))


class PublicKey(object):

  @classmethod
  def from_n(cls, n):
    return cls(n)

  def __init__(self, n):
    self.n = n
    self.n_sq = n * n
    self.g = n + 1

  def __repr__(self):
    return '<PublicKey: %s>' % self.n


class PrivateKey(object):

  def __init__(self, l, m):
    self.l = l
    self.m = m

  def __repr__(self):
    return '<PrivateKey: %s %s>' % (self.l, self.m)


def read_in():
  lines = sys.stdin.readlines()
  # print "read lines : ", lines
  # Since our input would only be having one line, parse our JSON data from
  # that
  return json.loads(lines[0])


def ballot_signature():
  #lines = read_in()
  #lamb = int(lines)
  lamb = 3
  # lines = json.dumps(lines)  # remove [u']
  # print "read lines : ", lines

  # print "lamb : ", lamb
  #lamb = 5
  msg = ["This is the ballot signature " +
         str(x + 1) + " signed by AS" for x in range(0, 5)]
  # print "msg[2]:", msg[2]

  SigResultInt = []
  for lam in range(0, 5):
    SignKey = M2Crypto.EVP.load_key('AS-private.pem')
    SignKey.sign_init()
    hashMsg = hashlib.sha256(msg[lam]).hexdigest()
    SignKey.sign_update(hashMsg)
    SignResult = SignKey.sign_final()
    # print "Msg:", msg[lam]
    # print "hashMsg:", hashMsg
    # print "SignResult:", SignResult
    SigResultHex = SignResult.strip().encode('hex')
    # print "SignResultHex:", SigResultHex
    # Represent signature with decimal
    SigResultInt.append(int(SignResult.strip().encode('hex'), 16))
  # print "SignResultInt:"
  # for element in SigResultInt:
    # print colored("intSignResult : ", 'blue'), colored(element, 'red')
    # print "intSignResult : ", element

    # homomorphic encryption
  VerifyKey = M2Crypto.RSA.load_pub_key('AS-public.pem')
  # print "VerifyKey.n :", VerifyKey.n, " ", type(VerifyKey.n)
  NInt = int(VerifyKey.n.encode('hex'), 16)
  # print "NInt :", NInt
  # print colored("Generating Paillier keypair for voter...", 'yellow')
  #priv, pub = generate_keypair(512)
  # read pk.pem and sk.pem
  f = file("./pk.pem", "r")
  line = f.readline()
  line = line.replace("<PublicKey:", "").replace(">", "")
  pub = PublicKey(int(line))
  array = []
  g = file("./sk.pem", "r")
  line = g.readline()
  line = line.replace("<PrivateKey:", "").replace(">", "")
  priv = PrivateKey(int(line.split()[0]), int(line.split()[1]))
  # print "Paillier pub.n :", pub.n
  # lamb = input("Enter the number of ballot signature you want: ")
  # encrypt the ballot signature number lambda which voter's pick
  crypt_lamb = encrypt(pub, int(lamb - 1))
  # print "crypt_lamb : ", crypt_lamb
  # print"cryptLamb : ", crypt_lamb
  crypt_ballot_Sig = []

  for element in SigResultInt:
    crypt_ballot_Sig.append(encrypt(pub, element))
  # print "crypt_ballot_Sig:", crypt_ballot_Sig
  # for element in crypt_ballot_Sig:
  # print colored("crypt_ballot_Sig : ", 'blue'), colored(element, 'red')
  lam_list = []
  # randomNum = 101
  # print colored("-----------------RSA signature
  # verify--------------------------", 'yellow')

  for lam in range(0, 5):

    crypt_lam = encrypt(pub, int(lam))
    # print "lam : ", lam
    # print "crypt_lam : ", crypt_lam
    crypt_inv_lam = modinv(crypt_lam, pub.n_sq)  # cipher inverse, E(lam)^-1
    # print "crypt_inv_lam : ", crypt_inv_lam
    cipher_tmp = e_add(pub, crypt_lamb * crypt_inv_lam, crypt_ballot_Sig[lam])
    ans = decrypt(priv, pub, cipher_tmp)
    #ans = decrypt(priv, pub, crypt_lam)
    # print lam + 1, colored(". ans : ", 'blue'), colored(ans, 'red')
    # print "ans : ", ans
    #-----------------RSA signature verify--------------------------
    # print msg[lam]
    hexSigRecover = hex(ans)  # covert int(ans_sig) to hex(ans_sig)
    hexSigRecover = hexSigRecover[2:-1]  # remove 0x and L
    # print "hexSigRecover : ", hexSigRecover
    # Voter can use "hexSigRecover" to recover original ballot signature
    OrigSigRecover = hexSigRecover.strip().decode('hex')
    # print "OrigSigRecover : ", OrigSigRecover
    base64sig = OrigSigRecover.encode('base64')
    print base64sig
if __name__ == '__main__':
  ballot_signature()
