import hashlib
import sys
import json
import numpy as np


def read_in():
  lines = sys.stdin.readlines()
  # print "read lines : ", lines
  # Since our input would only be having one line, parse our JSON data from
  # that
  return json.loads(lines[0])


def PID():
  lines = read_in()
  lines = json.dumps(lines)  # remove [u']

  ID = lines[2:12]
  # print "ID : ", lines
  #np_lines = np.array(lines)
  #ID = str(np_lines[0])
  #randomNum = str(np_lines[1])
  #ID = "A128373696"
  randomNum = "104753015"
  mix = str(ID) + str(randomNum)
  # print "ID||randomNum : ", mix
  PID = hashlib.sha256(mix).hexdigest()
  # print "PID : ",PID
  print PID
  # return PID
if __name__ == '__main__':
  PID = PID()
