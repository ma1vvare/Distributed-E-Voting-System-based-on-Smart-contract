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


def Recover():
  lines = read_in()
  lines = json.dumps(lines)  # remove [u']
  # print "Recover input:", lines, ",type ", type(lines)
  lines = lines.replace("[", "").replace(
      "]", "").replace('"', "")  # remove [,",]

  lines = lines.split(", ")  # divide by comma,
  # print "lines[0]: ", lines[0]
  # print "lines[1]: ", lines[1]
  # print "len(lines) : ", len(lines)
  f = file("./pk.pem", "r")
  line = f.readline()
  line = line.replace("<PublicKey:", "").replace(">", "")
  pub = PublicKey(int(line))
  g = file("./sk.pem", "r")
  line = g.readline()
  line = line.replace("<PrivateKey:", "").replace(">", "")
  priv = PrivateKey(int(line.split()[0]), int(line.split()[1]))
  cipher = []
  for item in range(0, len(lines)):
    cipher = lines[item].split(" ")
    c1 = cipher[0]
    c2 = cipher[1]
    c3 = cipher[2]
    decrypt_tmp1 = decrypt(priv, pub, int(c1))
    decrypt_tmp1 = str(decrypt_tmp1).decode('hex')
    decrypt_tmp2 = decrypt(priv, pub, int(c2))
    decrypt_tmp2 = str(decrypt_tmp2).decode('hex')
    decrypt_tmp3 = decrypt(priv, pub, int(c3))
    decrypt_tmp3 = str(decrypt_tmp3).decode('hex')
    # print decrypt_tmp1, decrypt_tmp2, decrypt_tmp3,
    shares = ["" for x in range(3)]
    shares[0] = '1-' + str(decrypt_tmp1)
    shares[1] = '2-' + str(decrypt_tmp2)
    shares[2] = '3-' + str(decrypt_tmp3)
    RecoverShare = SecretSharer.recover_secret(shares[0:3])
    print RecoverShare
  #c1 = "66768240792853512934866733859389827486309720209606223362569035755701149132747526952380339208985762254789508703554303682404907936107134475961349256042220548439488143611218310788652698165961330783452261827992015073880965150843139669232105619028811417639422642026356543954210543889463263742566574992434596355800"
  #c2 = "37375912129947274532722194410919712332321383162696627673750703155915139163218935622917725199340760087737698222680415765739338502440902228901854928466180540506407699559245743017446505519696776092815165511174862511157137214277636301379223325115120830958693085147607156368620070341938755100004760896569003735708"
  #c3 = "69486715038667344637663347979315949560420672300194398171519703275389045535221013425059412436357243325587015355078032783898897073933331229807954237278995619271813159634727037374816262249508789050550288571444789853232314721096208658790821434379655611657481277374335587611634915098700042068983265160630678236221"


if __name__ == '__main__':
  Recover()
