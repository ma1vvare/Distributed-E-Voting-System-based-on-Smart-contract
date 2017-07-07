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
  # print "lines", lines
  return json.loads(lines[0])


def secret_sharing():
  lines = read_in()
  lamb = int(lines)
  #lamb = 5
  vote = str(lamb)
  voteMsg = 'bce' + str(vote)
  shares = SecretSharer.split_secret(voteMsg, 2, 3)
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
  # print "Original secret of vote:"
  # for item in range(0, 3):
  # print shares[item]
# shares = SecretSharer.split_secret(
#"c4bbcb1fbec99d65bf59d85c8cb62ee2db963f0fe106f483d9afa73bd4e39a8a", 2, 3)
#['1-58cbd30524507e7a198bdfeb69c8d87fd7d2c10e8d5408851404f7d258cbcea7', '2-ecdbdaea89d75f8e73bde77a46db821cd40f430d39a11c864e5a4868dcb403ed',
#'3-80ebe2cfef5e40a2cdefef0923ee2bb9d04bc50be5ee308788af98ff609c380a']

  sh3 = ["" for x in range(3)]
  # print "-------------------------encrypt
  # loop-----------------------------------------"
  for index in range(0, 3):
    tmpCoordinate = shares[index][2:].encode('hex')
    crypt_tmpCoordinate = encrypt(pub, int(tmpCoordinate))
    sh3[index] = crypt_tmpCoordinate
    if index == 2:
      print str(crypt_tmpCoordinate) + "$",
    else:
      print str(crypt_tmpCoordinate),

  # print "-------------------------encrypt loop-----------------------------------------"
  # print "-------------------------decrypt loop-----------------------------------------"
  # for element in range(0, 3):
    #tmpCoordinate = int(sh3[element])
    #decrypt_tmp = decrypt(priv, pub, tmpCoordinate)
    #hexCordinate = str(decrypt_tmp).decode('hex')
    #sh3[element] = hexCordinate
    # print str(hexCordinate)
  # print "-------------------------decrypt
  # loop-----------------------------------------"

  #sh = ["" for x in range(3)]
  #shares[0] = '1-' + str(sh3[0])
  #shares[1] = '2-' + str(sh3[1])
  #shares[2] = '3-' + str(sh3[2])
  #RecoverShare = SecretSharer.recover_secret(shares[0:3])
  # print "RecoverShare : ", RecoverShare
  # if RecoverShare == voteMsg:
    # print "The ballot has verified successfully."
  # else:
    # print "The ballot has not verified."

if __name__ == '__main__':
  secret_sharing()
