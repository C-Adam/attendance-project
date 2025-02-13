import RPi.GPIO as GPIO

from mfrc522 import MFRC522
from mfrc522 import SimpleMFRC522

reader = SimpleMFRC522()

print("Place tag")

tagId, writtenText = reader.read()

try:
    print("Tag Id:", tagId)
    print("Written Text:", writtenText)
finally:
    GPIO.cleanup()